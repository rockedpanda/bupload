var express = require('express');
var router = express.Router();
const fs = require('fs');

var blocks = require('./blocks.js');

router.put('/upload', function (req, res, next) {
    let { fileName, start=0, end=0, total=0 } = req.query;
    start = parseInt(start, 10);
    end = parseInt(end, 10);
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
