/**
 * creater:lizhi@blog.jczxw.cn
 * create time:2017/9/15
 * describe：公共工具
 **/

const captchapng = require("captchapng"); //验证码
const multer = require("koa-multer"); //加载koa-multer模块
const query = require("../db/mysql");
const request =require("request");

/*生成随机数验证码*/
let setCode = function() {
  let code = Math.floor(Math.random() * (9999 - 999 + 1) + 999); //生成随机验证码
  let p = new captchapng(80, 30, parseInt(code)); // width,height,numeric captcha
  p.color(255, 255, 255, 0); // First color: background (red, green, blue, alpha)
  p.color(80, 80, 80, 255); // Second color: paint (red, green, blue, alpha)
  let img = p.getBase64();
  let imgbase64 = new Buffer(img, "base64");
  let data = {
    code: code,
    imgbase64: imgbase64
  };
  return data;
};

/*文件上传*/
let upload = function(url) {
  let urls = url || "public/static/"; //配置文件存储路径
  console.log(9999999999999999);
  //配置
  let storage = multer.diskStorage({
    //文件保存路径
    destination: function(req, file, cb) {
      cb(null, urls);
    },
    //修改文件名称
    filename: function(req, file, cb) {
      let fileFormat = file.originalname.split(".");
      cb(null, Date.now() + "." + fileFormat[fileFormat.length - 1]);
    }
  });
  //加载配置
  let upload = multer({ storage: storage });
  return upload;
};

/*更新session */
let UpdataSession = async function(ctx) {
  let value = [ctx.session.users.username];
  let _sql = `SELECT * from users where username=?`;
  let data = await query(_sql, value);
  ctx.session.users = data[0];
};

/*获取当前时间*/
let Time = function() {
  function toDub(n) {
    return n > 9 ? n : "0" + n;
  }
  let oDate = new Date();
  let y = oDate.getFullYear();
  let m = oDate.getMonth() + 1;
  let d = oDate.getDate();
  let h = oDate.getHours();
  let mm = oDate.getMinutes();
  let s = oDate.getSeconds();
  return (
    y +
    "-" +
    toDub(m) +
    "-" +
    toDub(d) +
    " " +
    toDub(h) +
    ":" +
    toDub(mm) +
    ":" +
    toDub(s)
  );
};


/*获取IP*/
let getIp = function(ctx){
  return new Promise((resolve, reject) => {
    let ips = 'x-real-ip';
    let ip = ctx.headers[ips];
    request.get('http://ip.taobao.com/service/getIpInfo.php?ip=' + ip, function(error, doce) {
      if (error) {
        resolve(error);
      }else{
        let data = JSON.parse(doce.body);
        resolve(data);
      }
    });
  });
};


module.exports = {
  setCode,
  upload,
  UpdataSession,
  Time,
  getIp
};
