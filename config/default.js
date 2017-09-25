/**
 * @creater:lizhi@blog.jczxw.cn
 * @create time:2017/9/15
 * @describe：全局配置
 **/

const config = {
  // 启动端口
  port: 3100,
  // Mysql数据库配置
  database: {
    DATABASE: "test",
    USERNAME: "test",
    PASSWORD: "test",
    PORT: "3306",
    HOST: "127.0.0.1"
  },
  //session-redis配置
  SessionRedis: {
    host: "127.0.0.1",
    port: 6379,
    ttl: 60*60
  },
  //redis数据库配置
  Redis: {
    host: "127.0.0.1", //安装好的redis服务器地址
    port: 6379, //端口
    prefix: "sam:", //存诸前缀
    ttl: 0, //过期时间
    db: 0
  }
};

module.exports = config;
