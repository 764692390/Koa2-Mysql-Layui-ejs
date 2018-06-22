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
  abstract mediumtext NOT NULL,
  content mediumtext NOT NULL,
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
  *  category_text = 分类文字
  *  create_time = 创建时间
  *  state = 状态
  *  update_time = 更新时间
 */

let category = `create table if not exists category(
  id INT NOT NULL AUTO_INCREMENT,  
  category_text VARCHAR(255)NOT NULL,
  create_time VARCHAR(255) NOT NULL,
  state VARCHAR(1) NOT NULL,
  update_time VARCHAR(255),
  PRIMARY KEY ( id )
 )ENGINE=InnoDB DEFAULT CHARSET=utf8;`;


  /**
  * 【message 留言板一级表】
  *  id =主键
  *  conten = 内容
  *  UserName = 回复人的用户名
  *  UserImg  =回复人的用户图像
  *  openid = 第三方用户唯一id
  *  ip = 客户端ip
  *  ip_city = 市 
  *  ip_ips = ids运营商
  *  create_time = 创建时间
  *  state = 状态
 */

let message = `create table if not exists message(
  id INT NOT NULL AUTO_INCREMENT,  
  conten mediumtext NOT NULL,
  username VARCHAR(255)NOT NULL,
  userimg VARCHAR(255)NOT NULL,
  openid VARCHAR(255)NOT NULL,
  ip VARCHAR(255)NOT NULL,
  ip_city VARCHAR(255)NOT NULL,
  ip_ips VARCHAR(255)NOT NULL,
  create_time VARCHAR(255)NOT NULL, 
  state VARCHAR(1) NOT NULL,
  PRIMARY KEY ( id )
 )ENGINE=InnoDB DEFAULT CHARSET=utf8;`;

  /**
  * 【message 留言板二级表】
  *  id =主键
  *  parentid = 父级id 
  *  conten = 内容
  *  UserName = 回复人的用户名
  *  UserImg  =回复人的用户图像
  *  openid = 第三方用户唯一id
  *  ip = 客户端ip
  *  ip_city = 市 
  *  ip_ips = ids运营商
  *  create_time = 创建时间
  *  state = 状态
 */

let messageply = `create table if not exists messageply(
  id INT NOT NULL AUTO_INCREMENT, 
  parentid VARCHAR(1) NOT NULL, 
  conten mediumtext NOT NULL,
  username VARCHAR(255)NOT NULL,
  userimg VARCHAR(255)NOT NULL,
  openid VARCHAR(255)NOT NULL,
  ip VARCHAR(255)NOT NULL,
  ip_city VARCHAR(255)NOT NULL,
  ip_ips VARCHAR(255)NOT NULL,
  create_time VARCHAR(255)NOT NULL, 
  state VARCHAR(1) NOT NULL,
  PRIMARY KEY ( id )
 )ENGINE=InnoDB DEFAULT CHARSET=utf8;`;


 /**
  * 【qquser qq快捷登录表】
  *  id =主键
  *  create_time = 创建时间
  *  state = 状态
 */

let qquser = `create table if not exists qquser(
  id INT NOT NULL AUTO_INCREMENT, 
  ret VARCHAR(255)NOT NULL,
  msg VARCHAR(255)NOT NULL,
  is_lost VARCHAR(255)NOT NULL,
  nickname VARCHAR(255)NOT NULL,
  gender VARCHAR(255)NOT NULL,
  province VARCHAR(255)NOT NULL,
  city VARCHAR(255)NOT NULL,
  year VARCHAR(255)NOT NULL,
  figureurl VARCHAR(255)NOT NULL,
  figureurl_1 VARCHAR(255)NOT NULL,
  figureurl_2 VARCHAR(255)NOT NULL,
  figureurl_qq_1 VARCHAR(255)NOT NULL,
  figureurl_qq_2 VARCHAR(255)NOT NULL,
  is_yellow_vip VARCHAR(255)NOT NULL,
  vip VARCHAR(255)NOT NULL,
  yellow_vip_level VARCHAR(255)NOT NULL,
  level VARCHAR(255)NOT NULL,
  is_yellow_year_vip VARCHAR(255)NOT NULL,
  openid VARCHAR(255)NOT NULL,
  addtimer VARCHAR(255)NOT NULL,
  updatatimer VARCHAR(255)NOT NULL,
  speak VARCHAR(255)NOT NULL,
  create_time VARCHAR(255)NOT NULL, 
  state VARCHAR(1) NOT NULL,
  PRIMARY KEY ( id )
 )ENGINE=InnoDB DEFAULT CHARSET=utf8;`;



   /**
  * 【loginlog 登录日志表】
  *  id =主键
 */

let  loginlog = `create table if not exists loginlog(
  id INT NOT NULL AUTO_INCREMENT, 
  username VARCHAR(255)NOT NULL,
  ip VARCHAR(255)NOT NULL,
  area VARCHAR(255)NOT NULL,
  area_id VARCHAR(255)NOT NULL,
  city VARCHAR(255)NOT NULL,
  city_id VARCHAR(255)NOT NULL,
  country VARCHAR(255)NOT NULL,
  country_id VARCHAR(255)NOT NULL,
  county VARCHAR(255)NOT NULL,
  county_id VARCHAR(255)NOT NULL,
  isp VARCHAR(255)NOT NULL,
  isp_id VARCHAR(255)NOT NULL,
  region VARCHAR(255)NOT NULL,
  region_id VARCHAR(255)NOT NULL,
  create_time VARCHAR(255)NOT NULL, 
  PRIMARY KEY ( id )
 )ENGINE=InnoDB DEFAULT CHARSET=utf8;`;


 

module.exports = [users,articles,links,category,message,messageply,qquser,loginlog];
