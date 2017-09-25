/**
 * @creater:lizhi@blog.jczxw.cn
 * @create time:2017/9/15
 * @describe：数据库操作
 **/

const mysql = require("mysql");
const moduleSql = require("./moduleSql");
const config = require("../config/default.js");

const pool = mysql.createPool({
  host: config.database.HOST,
  user: config.database.USERNAME,
  password: config.database.PASSWORD,
  database: config.database.DATABASE
});

/*增删改查*/
let query = function(sql, values) {
  return new Promise((resolve, reject) => {
    pool.getConnection(function(err, connection) {
      if (err) {
        let json = {
          code: "2",
          msg: "sql错误",
          errno: true
        };
        resolve(json);
      } else {
        console.log(sql);
        console.log(values);
        connection.query(sql, values, (err, rows) => {
          let temp = JSON.stringify(rows);
          if (err) {
            let json = {
              code: "2",
              msg: "sql错误",
              errno: true
            };
            resolve(json);
          } else {
            let data = JSON.parse(temp);
            resolve(data);
          }
          connection.release();
        });
      }
    });
  });
};

/*建表*/
let createTable = function(sql) {
  return query(sql, []);
};

/*初始化建表*/
function InItData() {
  for (var i = 0; i < moduleSql.length; i++) {
    createTable(moduleSql[i]);
  }
}

/*初始化创建表*/
//InItData();

module.exports = query;
