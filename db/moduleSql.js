/**
 * @creater:lizhi@blog.jczxw.cn
 * @create time:2017/9/15
 * @describe：数据库建模
 **/

/**
 * 【users用户表】
 *  id=主键* ，
 *  username=用户名称, 
 *  mobile=手机号，
 *  password=密码，
 *  create_time = 创建时间，
 *  pic=用户图像，
 *  statu=用户状态，
 *  sex=性别，
 *  nick_name=昵称，
 *  authority=权限 【1普通用户-游客， 2超级管理员】
 * 
 */
let users = `create table if not exists users(
 id INT NOT NULL AUTO_INCREMENT,  
 username VARCHAR(30),
 mobile VARCHAR(11),
 password VARCHAR(32) NOT NULL,
 create_time VARCHAR(13) NOT NULL,
 pic VARCHAR(255) NOT NULL,
 statu VARCHAR(1) NOT NULL,
 authority VARCHAR(1) NOT NULL,
 sex VARCHAR(1) ,
 age VARCHAR(3) ,
 nick_name VARCHAR(255),
 PRIMARY KEY ( id )
)ENGINE=InnoDB DEFAULT CHARSET=utf8;`;

/**
  * 【articles文章表】
 *  id=主键* ，
 *  title=文章标题,
 *  abstract=文章描述，
 *  content=文章内容 
 *  create_time = 创建时间，
 *  state=文章状态， 
 *  stick=文章顶， 
 *  recommend=文章推荐，
 *  username=文章作者，
 *  coverImg=封面图片
 *  typeName=文章分类
 *  look=查看次数
 *  msgleng=留言次数
 *  update_time=修改时间
 * 
 */
let articles = `create table if not exists articles(
  id INT NOT NULL AUTO_INCREMENT,  
  title VARCHAR(255) NOT NULL,
  abstract VARCHAR(255)NOT NULL,
  content VARCHAR(255) NOT NULL,
  create_time VARCHAR(255) NOT NULL,
  state VARCHAR(1) NOT NULL,
  stick VARCHAR(1) NOT NULL,
  recommend VARCHAR(1) NOT NULL,
  username VARCHAR(255) NOT NULL,
  coverImg VARCHAR(255) NOT NULL,
  typeName VARCHAR(255) NOT NULL,
  look VARCHAR(255),
  msgleng VARCHAR(255),
  update_time VARCHAR(255),
  PRIMARY KEY ( id )
 )ENGINE=InnoDB DEFAULT CHARSET=utf8;`;


 /**
  * 【links文章表】
 *  id=主键* ，
 *  webname=标题,
 *  url=网站链接，
 *  email=站长邮箱 
 *  pic=网站图标
 *  create_time=创建时间，
 *  state=是否展示， 
 *  update_time=修改时间
 * 
 */

let links = `create table if not exists links(
  id INT NOT NULL AUTO_INCREMENT,  
  webname VARCHAR(255)NOT NULL,
  url VARCHAR(255)NOT NULL,
  email VARCHAR(255)NOT NULL,
  pic VARCHAR(255)NOT NULL,
  create_time VARCHAR(255) NOT NULL,
  state VARCHAR(1) NOT NULL,
  update_time VARCHAR(255),
  PRIMARY KEY ( id )
 )ENGINE=InnoDB DEFAULT CHARSET=utf8;`;


 /**
  * 【category 分类表】
  *  category_name = 分类名称值
  *  category_text = 分类文字
  *  create_time = 创建时间
  *  state = 状态
  *  update_time = 更新时间
 */

let category = `create table if not exists category(
  id INT NOT NULL AUTO_INCREMENT,  
  category_name VARCHAR(255)NOT NULL,
  category_text VARCHAR(255)NOT NULL,
  create_time VARCHAR(255) NOT NULL,
  state VARCHAR(1) NOT NULL,
  update_time VARCHAR(255),
  PRIMARY KEY ( id )
 )ENGINE=InnoDB DEFAULT CHARSET=utf8;`;

module.exports = [users,articles,links,category];
