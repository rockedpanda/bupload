# 分块方式的大文件上传设计思路

## 基本理论验证:
fetch('/aaaa.png',{method:'PUT',body: document.getElementById('f').files[0].slice(0,1000)}).then(x=>x.text()).then(x=>console.log(x))
借助File对象的slice方法得到Blob, 发送至服务器存储; 

## 限制:
服务端和客户端需要改造.

## 配套调整:
- 每次上传一个块,
- 需要控制并发量, 简单起见最多限制5个并发
- 需要在没个块上传成功后计算剩余待上传的块,可以将待上传的块列表发送客户端
- 块的大小,默认5M, 小于5M直接发送;大于5M按照5M切割后发送
- 全部上传成功后服务的自动合并文件并清理临时块
- 服务端需要记录已经上传成功的块(文件和块信息)

## 支持断点续传.
- 单个块中断传输,下次可以重新传这个块(单个块不需要断点续传)
- 支持进度查询和展示

## 应用场景扩展:
- 1 大文件传输和断点续传
- 2 小文件传输,调整为小的分块,支持进度查看


##服务端设计:
### 1 API接口:
- 请求:
请求方式: HTTP + PUT
上传格式: Blob
URL格式: /upload?file=filePath&start=0&end=1000&total=99999
- 响应:
格式: JSON UTF-8
{ "file":"/file/path", "error_code":0, "uploaded":[[0,1000],[1001,2000]],"finish": false, "url":"/file/paht", "total":99999}

### 2 服务端形式:
express模块/中间件
需要配置临时存储文件夹(upload_parts_temp)
每个文件分文件夹存储,文件夹内命名方式: file.json 1-1000.part 1001-2000.part ...
文件分开信息说明文件file.json: 
[{
"file":"/file/path", "error_code":0, "uploaded":[[0,1000],[1001,2000]],"finish": false, "url":"/file/paht", "total":99999, "dir":"uuid"
}]
- 暂不引入数据库存储,使用文件存储信息.后期改为lowdb简单存储.(支持数据库类型配置)
- 所有分开存储完成后合并文件到目标文件夹,并重命名为原始文件名 (stream拷贝, 临时uuid文件名, 重命名为原始文件名)



改进空间:
1 客户端和服务端的MD5检查: 减少相同数据的发送;校验数据相同;
