/**
 * creater:lizhi@blog.jczxw.cn
 * create time:2017/12/1
 * describe：登录日志  loginlog 表SQL
 **/

const query = require("./mysql");

// 添加留言
let insertLoginlog = function(value) {
  let _sql ="insert into loginlog(username,ip,area,area_id,city,city_id,country,country_id,county,county_id,isp,isp_id,region,region_id,create_time) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
  return query(_sql, value);
};


module.exports = {
  insertLoginlog
};
