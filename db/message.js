/**
 * creater:lizhi@blog.jczxw.cn
 * create time:2017/12/1
 * describe：留言板一级  message 表SQL
 **/

const query = require("./mysql");

// 添加留言
let insertMessage = function(value) {
  let _sql ="insert into message(conten,username,userimg,openid,ip,ip_city,ip_ips,create_time,state) values (?,?,?,?,?,?,?,?,?)";
  return query(_sql, value);
};

  
//查询留言列表
let findMessage = function(value) {
let _sql =
    "SELECT * FROM message WHERE state=1 ORDER BY create_time desc LIMIT " +
    value[0] +
    "," +
    value[1] +
    "";
return query(_sql);
};

//查询留言数量
let findMessageCount = function(value) {
    let _sql = "SELECT COUNT(*) AS Numbers FROM message WHERE state=1";
    return query(_sql);
  };

//查询留言列表所有
let findMessageAll = function(value) {
  let _sql =
    "SELECT * FROM message ORDER BY create_time desc LIMIT " +
    value[0] +
    "," +
    value[1] +
    "";
  return query(_sql);
};

//查询留言数量所有
let findMessageCountAll = function(value) {
  let _sql = "SELECT COUNT(*) AS Numbers FROM message";
  return query(_sql);
};

/*修改友情链接自定义属性 state是否显示 */
let UpDateState = function(value) {
  let _sql = `UPDATE message SET state=? WHERE id=?`;
  return query(_sql, value);
};


module.exports = {
    insertMessage,
    findMessage,
    findMessageCount,
    findMessageAll,
    findMessageCountAll,
    UpDateState
};
