/**
 * creater:lizhi@blog.jczxw.cn
 * create time:2017/9/15
 * describe：友情链接表SQL
 **/

const query = require("./mysql");

// 添加友情链接
let insertLinks = function(value) {
  console.log('SQL');
  console.log(value);
  let _sql ="insert into links(webname,url,email,pic,create_time,state) values (?,?,?,?,?,?)";
  return query(_sql, value);
};

//更新友情链接
let UpdateLinks =function(value){
  let _sql =
  "UPDATE links SET webname=?,url=?,email=?,pic=?,state=?,update_time=? WHERE id=?";
  return query(_sql, value);
}

//查询友情链接列表
let findLinks = function(value) {
  let _sql =
    "SELECT * FROM links WHERE state=1 ORDER BY create_time desc LIMIT " +
    value[0] +
    "," +
    value[1] +
    "";
  return query(_sql);
};

//查询友情链接列表总数
let findLinksCount = function(value) {
  let _sql = "SELECT COUNT(*) AS Numbers FROM links WHERE state=1";
  return query(_sql);
};

//查询友情链接列表所有
let findLinksAll = function(value) {
  let _sql =
    "SELECT * FROM links ORDER BY create_time desc LIMIT " +
    value[0] +
    "," +
    value[1] +
    "";
  return query(_sql);
};

//查询友情链接列表总数所有
let findLinksCountAll = function(value) {
  let _sql = "SELECT COUNT(*) AS Numbers FROM links";
  return query(_sql);
};

/*修改友情链接自定义属性 state是否显示 */
let UpDateState = function(value) {
  let _sql = `UPDATE links SET state=? WHERE id=?`;
  return query(_sql, value);
};


/*删除友情链接 批量删除和单个删除 */
let DelLinksAll = function(value) {
  let _sql = `DELETE FROM links WHERE id=?`;
  return query(_sql, value);
};

/*获取友情链接详情*/
let GetLinksItem = function(value){
  let _sql = `SELECT * FROM links WHERE id=?`;
  return query(_sql, value);
}

module.exports = {
  insertLinks,
  UpdateLinks,
  findLinks,
  findLinksCount,
  findLinksAll,
  findLinksCountAll,
  UpDateState,
  DelLinksAll,
  GetLinksItem
};
