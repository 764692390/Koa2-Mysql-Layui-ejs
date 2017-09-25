/**
 * creater:lizhi@blog.jczxw.cn
 * create time:2017/9/15
 * describe：用户表SQL
 **/

const query = require("./mysql");

// 注册用户
let insertUsers = function(value) {
  let _sql =
    "insert into users(username,mobile,password,create_time,pic,statu,authority) values (?,?,?,?,?,?,?)";
  return query(_sql, value);
};

// 用户登录
let loginUsers = function(value) {
  let _sql = "SELECT * from users where username=? and password=?";
  return query(_sql, value);
};

// 查询用户是否存在
let findOneUsers = function(value) {
  let _sql = `SELECT * from users where username=?`;
  return query(_sql, value);
};

//查询用户列表
let findUsers = function(value) {
  let _sql = "SELECT * from users LIMIT " + value[0] + "," + value[1] + "";
  //let _sql = "SELECT * from users LIMIT 1, 2";
  return query(_sql);
};

//查询用户列表总数
let findUserCount = function(value) {
  let _sql = "SELECT COUNT(*) AS Numbers FROM users";
  return query(_sql);
};

/*修改个人资料用户图像*/
let UploadImg = function(value) {
  let _sql = `UPDATE users SET pic=? WHERE username=?`;
  return query(_sql, value);
};

/*修改个人资料 mobile sex nick_name*/
let UpDateUserMSN = function(value) {
  let _sql = `UPDATE users SET mobile=?, sex=?, nick_name=? WHERE username=?`;
  return query(_sql, value);
};

/*修改密码 newpassword nick_name*/
let UpDateNewPassword = function(value) {
  let _sql = `UPDATE users SET password=? WHERE username=?`;
  return query(_sql, value);
};

module.exports = {
  insertUsers,
  findOneUsers,
  findUsers,
  findUserCount,
  loginUsers,
  UploadImg,
  UpDateUserMSN,
  UpDateNewPassword
};
