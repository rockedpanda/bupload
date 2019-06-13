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
- [ ] 查询功能
- [ ] MD5校验支持

## 使用方式
待改进.

目前尚未模块化封装,是以Express Router的方式挂载到Express APP中的,举例如下:
```javascript
//服务端
var bupload = require('./bupload');
app.use('/upload/', bupload);
```
客户端的例子详见 test/index.html, 这是个简单的上传测试页面