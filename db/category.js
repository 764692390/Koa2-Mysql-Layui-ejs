/**
 * creater:lizhi@blog.jczxw.cn
 * create time:2017/9/15
 * describe：分类表SQL
 **/

const query = require("./mysql");

/**
  * 【category 分类表】
  *  category_text = 分类文字
  *  create_time = 创建时间
  *  state = 状态
  *  update_time = 更新时间
 */

// 添加分类
let insertCategory = function(value) {
  let _sql =
    "insert into category(category_text,create_time,state) values (?,?,?)";
  return query(_sql, value);
};

//更新分类
let UpdateCategory = function(value) {
  let _sql =
    "UPDATE category SET category_text=?,state=?,update_time=? WHERE id=?";
  return query(_sql, value);
};


//查询分类列表
let findCategory = function(value) {
  let _sql =
    "SELECT * FROM category WHERE state=1 ORDER BY create_time desc LIMIT " +
    value[0] +
    "," +
    value[1] +
    "";
  return query(_sql);
};

//查询分类列表所有
let findCategoryAll = function(value) {
  let _sql =
    "SELECT * FROM category ORDER BY create_time desc LIMIT " +
    value[0] +
    "," +
    value[1] +
    "";
  return query(_sql);
};

//查询分类列表所有-不带分页
let findCategoryAlls = function(value) {
  let _sql =
    "SELECT * FROM category ORDER BY create_time desc";
  return query(_sql);
};

//查询文章列表总数
let findCategoryCount = function(value) {
  let _sql = "SELECT COUNT(*) AS Numbers FROM category WHERE state=1";
  return query(_sql);
};


//查询文章列表总数所有
let findCategoryCountAll = function(value) {
  let _sql = "SELECT COUNT(*) AS Numbers FROM category";
  return query(_sql);
};

/*修改分类是否显示属性 state是否显示 */
let UpDateState = function(value) {
  let _sql = `UPDATE category SET state=? WHERE id=?`;
  return query(_sql, value);
};

/*获取分类详情*/
let GetCategoryItem = function(value){
  let _sql = `SELECT * FROM category WHERE id=?`;
  return query(_sql, value);
}

module.exports = {
  insertCategory,
  UpdateCategory,
  findCategory,
  findCategoryAll,
  findCategoryCount,
  findCategoryCountAll,
  findCategoryAlls,
  UpDateState,
  GetCategoryItem,
};
