var express = require('express');
var router = express.Router();
const fs = require('fs');

var blocks = require('./blocks.js');

router.put('/upload', function (req, res, next) {
    let fileName = req.query.fileName;
    let contentRangeHeader = req.header('Content-Range');
    let { start = 0, end = 0, total = 0 } = req.query;
    if (contentRangeHeader && contentRangeHeader.match(/^bytes [0-9]+-[0-9]+\/[0-9]+$/)) {
        //如果包含Content-Range头,且格式合法,优先使用头里面的.
        [start, end, total] = contentRangeHeader.match(/\d+/g).slice(0);
    }
    start = parseInt(start, 10); //索引从0开始,对应字节包含在内
    end = parseInt(end, 10);  //end对应字节包含在内
    total = parseInt(total, 10);

    console.log({ fileName, start, end, total });
    if(total === 0){
        const tmpPath = blocks.getPathForName(fileName);
        return req.pipe(fs.createWriteStream(tmpPath)).on('close', () => {
            res.send({ error_code: 0 });
        });
    }
    let info = blocks.getOrCreate({ filePath: fileName, start, end, total });
    if (info) {
        let tmpPath = blocks.getPathForOnePart(info, start, end);
        console.log(tmpPath);
        blocks.mkdirForFile(tmpPath).then(() => {
            console.log('文件夹就绪');
            return req.pipe(fs.createWriteStream(tmpPath)).on('close', () => {
                blocks.gotBlock(fileName, start, end);
                res.send({ error_code: 0 });
            });
        }).catch((err) => {
            res.send(err);
        });
    }
});

module.exports = router;
