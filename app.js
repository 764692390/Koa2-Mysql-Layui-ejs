/**
 * @creater:lizhi@blog.jczxw.cn
 * @create time:2017/9/15
 * @describe：项目主程序入口
 **/

const Koa = require("koa");
const app = new Koa();
const router = require("koa-router")();
const views = require("koa-views");
const convert = require("koa-convert");
const json = require("koa-json");
const bodyparser = require("koa-bodyparser")();
const logger = require("koa-logger");
// const session = require("koa-session-redis");
const config = require("./config/default");
const session = require("koa-session2");
const Store = require("./config/Store.js");

/*把config挂载到app对象上*/
app.config = config;

/*获取路由模块*/
const index = require("./routes/index");
const admin = require("./routes/admin");
const api = require("./routes/api");



// middlewares
app.use(convert(bodyparser));
app.use(convert(json()));
app.use(convert(logger()));
app.use(require("koa-static")(__dirname + "/public"));
app.use(
  views(__dirname + "/views", {
    extension: "ejs"
  })
);

/*设置session*/
app.keys = ['some secret hurr'];
app.use(
  session({
       store: new Store()
  })
);

/*注册路由*/
router.use("/", index.routes(), index.allowedMethods());
router.use("/admin", admin.routes(), admin.allowedMethods());
router.use("/api", api.routes(), api.allowedMethods());

// response
app.use(router.routes(), router.allowedMethods());

/*错误处理*/
router.get("*", async (ctx, next) => {
  await ctx.render("error");
});

/*错误处理 */
app.on("error", function(err, ctx) {
  console.log("ERR");
});

module.exports = app;
