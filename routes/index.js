/**
 * creater:lizhi@blog.jczxw.cn
 * create time:2017/9/15
 * describe：Index路由
 **/

const router = require("koa-router")();
const Redis = require("ioredis");
const config = require("../config/default");
const redis = new Redis(config.Redis);

router.get("/", async (ctx, next) => {
  redis.set("test", "倒计时", "EX", "60");
  let users = ctx.session.users || null;
  ctx.state = {
    users: users
  };
  await ctx.render("index");
});

module.exports = router;
