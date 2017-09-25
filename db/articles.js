/**
 * creater:lizhi@blog.jczxw.cn
 * create time:2017/9/15
 * describe：文章表SQL
 **/

const query = require("./mysql");

// 添加文章
let insertArticles = function(value) {
  let _sql =
    "insert into articles(title,abstract,content,create_time,state,stick,recommend,username,coverImg,typeName) values (?,?,?,?,?,?,?,?,?,?)";
  return query(_sql, value);
};

//更新文章
let UpdateArticles =function(value){
  let _sql =
  "UPDATE articles SET title=?,abstract=?,content=?,state=?,stick=?,recommend=?,username=?,coverImg=?,typeName=?,update_time=? WHERE id=?";
  return query(_sql, value);
}

//查询文章列表
let findArticles = function(value) {
  let _sql =
    "SELECT * FROM articles WHERE state=1 ORDER BY stick desc,recommend desc,create_time desc LIMIT " +
    value[0] +
    "," +
    value[1] +
    "";
  //let _sql = "SELECT * from users LIMIT 1, 2";
  return query(_sql);
};

//查询文章列表总数
let findArticlesCount = function(value) {
  let _sql = "SELECT COUNT(*) AS Numbers FROM articles WHERE state=1";
  return query(_sql);
};

//查询文章列表所有
let findArticlesAll = function(value) {
  let _sql =
    "SELECT * FROM articles ORDER BY create_time desc LIMIT " +
    value[0] +
    "," +
    value[1] +
    "";
  return query(_sql);
};

//查询文章列表总数所有
let findArticlesCountAll = function(value) {
  let _sql = "SELECT COUNT(*) AS Numbers FROM articles";
  return query(_sql);
};

/*修改文章自定义属性 state是否显示 */
let UpDateState = function(value) {
  let _sql = `UPDATE articles SET state=? WHERE id=?`;
  return query(_sql, value);
};

/*修改文章自定义属性 Recommend推荐 */
let UpDateRecommend = function(value) {
  let _sql = `UPDATE articles SET recommend=? WHERE id=?`;
  return query(_sql, value);
};

/*修改文章自定义属性 Stick是否顶 */
let UpDateStick = function(value) {
  let _sql = `UPDATE articles SET stick=? WHERE id=?`;
  return query(_sql, value);
};

/*删除文章 批量删除和单个删除 */
let DelArticlesAll = function(value) {
  let _sql = `DELETE FROM articles WHERE id=?`;
  return query(_sql, value);
};

/*获取文章详情*/
let GetArticlesItem = function(value){
  let _sql = `SELECT * FROM articles WHERE id=?`;
  return query(_sql, value);
}

module.exports = {
  insertArticles,
  findArticles,
  findArticlesCount,
  findArticlesAll,
  findArticlesCountAll,
  UpDateState,
  UpDateRecommend,
  UpDateStick,
  DelArticlesAll,
  GetArticlesItem,
  UpdateArticles
};
