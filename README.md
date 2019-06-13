# 分块的大文件上传

在客户端(浏览器端)进行分开,使用PUT方式上传.
服务端在接收完所有块之后合并文件.

## 设计思路
详见 doc/design.md

## 实现步骤
- [x] 以常规路由形式构建原型
- [x] 文件分块上传(单个)
- [x] 文件队列控制
- [x] 文件合并
- [ ] 支持配置
- [ ] 模块化剥离改造
- [ ] 查询功能 - 查询未完成列表等
- [ ] MD5校验支持
- [ ] 断点续传 - 查询未完成列表等
- [x] 分块下载 - 由于express-static的Range支持,不需要单独开发
- [x] 将分块上传增加兼容HTTP 1.1中规定的格式: Content-Range: bytes 2333-7000/99999
## 使用方式
待改进.

目前尚未模块化封装,是以Express Router的方式挂载到Express APP中的,举例如下:
```javascript
//服务端
var bupload = require('./bupload');
app.use('/upload/', bupload);
```
由于暂时未支持配置化,目前临时分片文件存放于运行当前目录"./parts_temp",最终文件存放于:"./upload",两个路径均相对于运行环境的$cwd,请确保文件夹存在.
客户端的例子详见 test/index.html, 这是个简单的上传测试页面