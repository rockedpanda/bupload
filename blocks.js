/**
 * 
 */
const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const uuid = require('uuid/v4');
const child_process = require('child_process');

let BASE_DIR = path.resolve('.');
let PART_TEMP_DIR = 'parts_temp';
let distDir = "../upload/";
const list = [];

function getList() {
  return list;
}

function getInfo(filePath) {
  let info = _.find(list, x => x.filePath === filePath);
  return info;
}

function createInfo({ filePath, start, end, total }) {
  if (getInfo(filePath)) {
    //同名文件已存在,无法创建新的
    return null;
  }
  const info = _.extend({ id: uuid(), t: Date.now(), "finish": false, uploaded: [] }, { filePath, start, end, total });
  list.push(info);
  return info;
}

function removeFile(fileName){
  let infoIndex = _.findIndex(list, x => x.filePath === fileName);
  let info = list[infoIndex];
  child_process.exec(`rm -rf "${info.id}"`, { cwd: path.join('.', `${PART_TEMP_DIR}`)}, function(err, stdout, stderr){
    if (err) {
      console.log(err);
      return;
    }
    if (stderr) {
      console.log(stderr);
    }
  });
  list.splice(infoIndex, 1);
}
/**
 * 检查或创建一个存储信息
 * @param {Object} options 创建参数,格式为{ filePath, start, end, total }
 */
function getOrCreate(options) {
  let info = getInfo(options.filePath);
  if (info) {
    return info;
  }
  info = createInfo(options);
  if (info) {
    return info;
  }
  return null; //创建失败返回null
}


/** 检查一个文件是否全部上传结束 */
function checkFile(filePath) {
  const info = getInfo(filePath);
  if (!info) {
    return false; //没有该文件信息
  }
  const curList = info.uploaded;
  if (curList.length === 0) {
    return false;
  }
  const lastItem = curList[curList.length - 1];
  if (lastItem[1] !== info.total) {
    return false;
  }
  for (let i = 1; i < curList.length; i++) {
    if (curList[i][0] !== curList[i - 1][1]) {
      return false;
    }
  }
  return true;
}

/** 为文件路径确保所在文件夹存在 */
function mkdirForFile(filePath) {
  console.log(filePath, BASE_DIR);
  var dirs = filePath.replace(BASE_DIR, '').split(path.sep);
  for (let i = 1; i < dirs.length; i++) {
    const p = '.' + path.sep + dirs.slice(0, i).join(path.sep);
    console.log(p);
    if (!fs.existsSync(p)) { //TODO: 改进为异步检查和创建
      console.log('已创建');
      fs.mkdirSync(p);
    }
  }
  return Promise.resolve(true);
}

/** 根据一组文件将文件逐个合并到一个目标文件,实现合并
function appendFile(partsList, distFilePath){
  
}
*/

function getAbsolutePath(relativePath){
  return path.resolve(relativePath);
}

/** 合并文件 */
function mergeFile(fileName) {
  console.log(fileName);
  let info = getInfo(fileName);
  let filePath = 'upload'+ path.sep +info.filePath;
  const absolutePath = getAbsolutePath(filePath);
  const absoluteDir = absolutePath.slice(0, absolutePath.lastIndexOf(path.sep)+1);
  console.log(absoluteDir, absolutePath, filePath);
  mkdirForFile(absoluteDir).then(() => {
    //const info = getInfo(filePath);
    //const partsList = info.uploaded.map(x => `${BASE_DIR}/${PART_TEMP_DIR}/${info.id}/${x[0]}-${x[1]}.part`);
    //appendFile(partsList, absolutePath);
    child_process.exec(`copy /b *.part ${absolutePath}`, { cwd: path.join('.', `${PART_TEMP_DIR}/${info.id}`) }, function(err, stdout, stderr){
      if(err){
        console.log(err);
        return;
      }
      if(stderr){
        console.log(stderr);
      }else{
        console.log('合并成功'); //TODO:合并成功后删除所有parts和list中的对应项
        removeFile(fileName);
      }
    });
  });
}

/**
 * 记录已经完成的块信息
 * @param {String} filePath 文件路径
 * @param {int} start 起始块,字节编号
 * @param {int} end 终止块,字节编号
 */
function gotBlock(filePath, start, end) {
  const info = getInfo(filePath);
  console.log(info);
  if (!info) {
    console.log('未找到该文件');
    return false; //没有该文件信息
  }
  //将块插入到最后一个比当前索引块小的块之后,使得uploaded数组是升序排列的.
  const index = _.findLastIndex(info.uploaded, x => x[0] < start);
  info.uploaded.splice(index + 1, 0, [start, end]);
  console.log(info.uploaded);
  process.nextTick(function () {
    let checkAns = checkFile(filePath);
    console.log('文件所有块上传完成? ', checkAns);
    if (checkAns) {
      mergeFile(filePath);
    }
  });
}


function getPathForOnePart(info, start, end){
  function fixZero(n, size) {
    return (Array(size).fill('0').join('') + n).slice(-size);
  }

  let size = (info.total+'').length;
  let name = fixZero(start, size)+'-'+fixZero(end, size);
  return path.join(PART_TEMP_DIR, info.id, name+'.part');
}

function getPathForName(fileName){
  return 'upload' + path.sep + fileName;
}

exports.getList = getList;
exports.getInfo = getInfo;
exports.createInfo = createInfo;
exports.getOrCreate = getOrCreate;
exports.getPathForOnePart = getPathForOnePart;
exports.mkdirForFile = mkdirForFile;
exports.gotBlock = gotBlock;
exports.getPathForName = getPathForName;
