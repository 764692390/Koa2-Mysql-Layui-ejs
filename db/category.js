/**
 * creater:lizhi@blog.jczxw.cn
 * create time:2017/9/15
 * describe：分类表SQL
 **/

const query = require("./mysql");

/**
  * 【category 分类表】
  *  category_name = 分类名称值
  *  category_text = 分类文字
  *  create_time = 创建时间
  *  state = 状态
  *  update_time = 更新时间
 */

// 添加分类
let insertCategory = function(value) {
  let _sql =
    "insert into category(category_name,category_text,create_time,state,stick) values (?,?,?,?,?)";
  return query(_sql, value);
};

//更新分类
let UpdateCategory = function(value) {
  let _sql =
    "UPDATE category SET category_name=?,category_text=?,state=?,update_time=? WHERE id=?";
  return query(_sql, value);
};

module.exports = {
  insertCategory,
  UpdateCategory,
};
