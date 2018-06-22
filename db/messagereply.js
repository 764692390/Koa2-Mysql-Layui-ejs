/**
 * creater:lizhi@blog.jczxw.cn
 * create time:2017/12/1
 * describe：留言板二级  messageply 表SQL
 **/

const query = require("./mysql");

// 添加留言
let insertMessageply = function(value) {
  let _sql ="insert into messageply(parentid,conten,username,userimg,openid,ip,ip_city,ip_ips,create_time,state) values (?,?,?,?,?,?,?,?,?,?)";
  return query(_sql, value);
};

  
//查询留言列表
let findMessageply = function(value) {
let _sql =
    "SELECT * FROM messageply WHERE state=1 ORDER BY create_time desc LIMIT " +
    value[0] +
    "," +
    value[1] +
    "";
return query(_sql);
};

//查询留言数量
let findMessageplyCount = function(value) {
    let _sql = "SELECT COUNT(*) AS Numbers FROM messageply WHERE state=1";
    return query(_sql);
};

//查询留言列表所有-前台
let findMessageplyAlls = function(value) {
    let _sql =
      "SELECT * FROM messageply WHERE state=1 ORDER BY create_time ASC";
    return query(_sql);
};

//查询留言列表所有-后台
let findMessageplyAll = function(value) {
  let _sql =
    "SELECT * FROM messageply ORDER BY create_time ASC";
  return query(_sql);
};


//查询留言列表所有-后台
let findMessageplyAllFindOne = function(value) {
  let _sql ="SELECT * FROM messageply WHERE parentid=? ORDER BY create_time ASC";
  return query(_sql, value);
};

//查询留言数量所有
let findMessageplyCountAll = function(value) {
  let _sql = "SELECT COUNT(*) AS Numbers FROM messageply";
  return query(_sql);
};

/*修改友情链接自定义属性 state是否显示 */
let UpDateState = function(value) {
  let _sql = `UPDATE messageply SET state=? WHERE id=?`;
  return query(_sql, value);
};


module.exports = {
    insertMessageply,
    findMessageply,
    findMessageplyCount,
    findMessageplyAll,
    findMessageplyCountAll,
    UpDateState,
    findMessageplyAlls,
    findMessageplyAllFindOne
};
