/**
 * creater:lizhi@blog.jczxw.cn
 * create time:2017/9/15
 * describe：Api接口路由
 **/
const router = require("koa-router")();
const Articles = require("../db/articles");
const Users = require("../db/users");
const Links = require("../db/links");
const Message = require("../db/message");
const Messageply = require("../db/messagereply");
const Loginlog = require("../db/loginlog");
const Category = require("../db/category");
const md5 = require("md5");
const tool = require("../tool/common");

router.get("/", function(ctx, next) {
  ctx.session.n = 1;	
  ctx.body = "this is api";
});

/*******************登录验证码生成*************************/
router.get("/login/code", async (ctx, next) => {
  let code = await tool.setCode();
  ctx.session.code = code.code;	
  ctx.response.type = "image/png";
  ctx.response.body = code.imgbase64;
});

/******************users表的操作*************************/
/*用户登录*/
router.post("/users/login", async (ctx, next) => {
  let data = ctx.request.body;
  if (data.username == undefined || data.password == undefined) {
    ctx.response.body = {
      code: "1",
      msg: "用户名或密码不能为空"
    };
    return;
  }
  if (data.code != ctx.session.code) {
    ctx.response.body = {
      code: "1",
      msg: "验证码输入有误！"
    };
    return;
  }
  let loginUsers = await Users.loginUsers([data.username, md5(data.password)]);
  if (loginUsers.length == 0) {
    ctx.response.body = {
      code: "1",
      msg: "用户名或者密码错误"
    };
  } else if (typeof loginUsers[0].statu != undefined && loginUsers[0].statu == 0) {
    ctx.response.body = {
      code: "1",
      msg: "登录失败,帐号已被禁用！"
    };
    return;
  } else {
    ctx.response.body = {
      code: "0",
      msg: "登录成功"
    };
    ctx.session.users = loginUsers[0];
    
    let ipjson = await tool.getIp(ctx);
    let data = ipjson.data;
    let arr = [ctx.session.users.username,data.ip,data.area,data.area_id,data.city,data.city_id,data.country,data.country_id,data.county,data.county_id,data.isp,data.isp_id,data.region,data.region_id,tool.Time()];
    Loginlog.insertLoginlog(arr);
  }
});

/*用户注册*/
// router.post("/users/reg", async (ctx, next) => {
//   let data = ctx.request.body;

//   if (data.username.length < 4) {
//     ctx.response.body = {
//       code: "1",
//       msg: "用户名不能少于4位"
//     };
//     return;
//   }

//   if (data.password.length < 6) {
//     ctx.response.body = {
//       code: "1",
//       msg: "密码不能小于6位！"
//     };
//     return;
//   }
//   //先查询下用户是否存在；
//   let findOneUser = await Users.findOneUsers(data.username);
//   if (findOneUser.length != 0 && typeof findOneUser.code) {
//     ctx.response.body = {
//       code: "1",
//       msg: "用户名已存在！"
//     };
//     return;
//   } else if (typeof findOneUser.code && findOneUser.code == 2) {
//     ctx.response.body = {
//       code: "1",
//       msg: "系统出小差了！"
//     };
//     return;
//   }
//   //用户不存在插入数据库
//   let arr = [
//     data.username,
//     data.mobile || "",
//     md5(data.password),
//     new Date().getTime(),
//     "http://blog.jczxw.cn/undefined",
//     "1",
//     "1"
//   ];
//   //username,mobile,password,create_time,pic,statu,authority
//   let msg = await Users.insertUsers(arr);
//   let res = {};

//   if (msg.errno) {
//     res = {
//       code: "1",
//       errno: msg.errno
//     };
//   } else {
//     res = {
//       code: "0",
//       errno: "注册成功！"
//     };
//   }
//   ctx.response.body = res;
// });

/*退出登录*/
router.get("/users/loginout", async (ctx, next) => {
  ctx.session.users = null;
  ctx.response.body = {
    code: "0",
    msg: "退出成功"
  };
});

/*用户列表*/
router.get("/users/getuserslist", async (ctx, next) => {
  let data = ctx.query;
  let index = data.index || 1;
  let rows = data.rows || 10;
  let arr = [(index - 1) * rows, rows];
  let Count = await Users.findUserCount();
  let list = await Users.findUsers(arr);

  if (typeof list.code != undefined && list.code == "2") {
    ctx.response.body = {
      code: "1",
      msg: "查询失败,传入非法参数！",
      count: "",
      result: []
    };
  } else {
    let json = {
      code: "0",
      msg: "查询成功",
      index: index,
      rows: rows,
      count: Count[0].Numbers,
      result: list
    };
    ctx.response.body = json;
  }
});

/*获取文章列表 Articles*/
router.get("/Articles/getArticleslist", async (ctx, next) => {
  let data = ctx.query;
  let index = data.index || 1;
  let rows = data.rows || 10;
  let arr = [(index - 1) * rows, rows];
  let Count = await Articles.findArticlesCount();
  let list = await Articles.findArticles(arr);

  if (typeof list.code != undefined && list.code == "2") {
    ctx.response.body = {
      code: "1",
      msg: "查询失败,传入非法参数！",
      count: "",
      result: []
    };
  } else {
    let json = {
      code: "0",
      msg: "查询成功",
      index: index,
      rows: rows,
      count: Count[0].Numbers,
      result: list
    };
    ctx.response.body = json;
  }
});

/*获取文章列表 Articles*/
router.get("/Articles/getArticleslistall", async (ctx, next) => {
  let data = ctx.query;
  let index = data.index || 1;
  let rows = data.rows || 10;
  let arr = [(index - 1) * rows, rows];
  let Count = await Articles.findArticlesCountAll();
  let list = await Articles.findArticlesAll(arr);

  if (typeof list.code != undefined && list.code == "2") {
    ctx.response.body = {
      code: "1",
      msg: "查询失败,传入非法参数！",
      count: "",
      result: []
    };
  } else {
    let json = {
      code: "0",
      msg: "查询成功",
      index: index,
      rows: rows,
      count: Count[0].Numbers,
      result: list
    };
    ctx.response.body = json;
  }
});

/*获取文章详情news/getNews*/
router.get("/news/getNewsItem", async (ctx, next) => {
  let id = [ctx.query.id];
  let data = await Articles.GetArticlesItem(id);
  if(data.length > 0 ){
    if (ctx.session.users != null) {
      ctx.response.body = {
        code: "0",
        msg: "查询成功！",
        result: data
      };
    }else{
      if(data[0].state == 1){
        ctx.response.body = {
          code: "0",
          msg: "查询成功！",
          result: data
        };
      }else{
        ctx.response.body = {
          code: "1",
          msg: "查询失败,数据为空",
          result: []
        };
      }
    }
  }else{
    ctx.response.body = {
      code: "1",
      msg: "查询失败,数据为空",
      result: []
    };
  }
});

/*获取只是显示的 友情链接 */
router.get("/Links/getLinkslist", async (ctx, next) => {
  let data = ctx.query;
  let index = data.index || 1;
  let rows = data.rows || 10;
  let arr = [(index - 1) * rows, rows];

  let Count = await Links.findLinksCount();

  let list = await Links.findLinks(arr);

  if (typeof list.code != undefined && list.code == "2") {
    ctx.response.body = {
      code: "1",
      msg: "查询失败,传入非法参数！",
      count: "",
      result: []
    };
  } else {
    let json = {
      code: "0",
      msg: "查询成功",
      index: index,
      rows: rows,
      count: Count[0].Numbers,
      result: list
    };
    ctx.response.body = json;
  }
});

/*获取所有的友情链接 */
router.get("/Links/getLinkslistall", async (ctx, next) => {
  let data = ctx.query;
  let index = data.index || 1;
  let rows = data.rows || 10;
  let arr = [(index - 1) * rows, rows];
  let Count = await Links.findLinksCountAll();
  let list = await Links.findLinksAll(arr);

  if (typeof list.code != undefined && list.code == "2") {
    ctx.response.body = {
      code: "1",
      msg: "查询失败,传入非法参数！",
      count: "",
      result: []
    };
  } else {
    let json = {
      code: "0",
      msg: "查询成功",
      index: index,
      rows: rows,
      count: Count[0].Numbers,
      result: list
    };
    ctx.response.body = json;
  }
});

/*获取友情链接详情link/getlinksItem*/
router.get("/link/getlinksItem", async (ctx, next) => {
  let id = [ctx.query.id];
  let data = await Links.GetLinksItem(id);
  if(data.length > 0 ){
    if (ctx.session.users != null) {
      ctx.response.body = {
        code: "0",
        msg: "查询成功！",
        result: data
      };
    }else{
      if(data[0].state == 1){
        ctx.response.body = {
          code: "0",
          msg: "查询成功！",
          result: data
        };
      }else{
        ctx.response.body = {
          code: "1",
          msg: "查询失败,数据为空",
          result: []
        };
      }
    }
  }else{
    ctx.response.body = {
      code: "1",
      msg: "查询失败,数据为空",
      result: []
    };
  }
});

/*获取只是显示的 分类 */
router.get("/Category/getCategorylist", async (ctx, next) => {
  let data = ctx.query;
  let index = data.index || 1;
  let rows = data.rows || 10;
  let arr = [(index - 1) * rows, rows];
  let Count = await Category.findCategoryCount();
  let list = await Category.findCategory(arr);

  if (typeof list.code != undefined && list.code == "2") {
    ctx.response.body = {
      code: "1",
      msg: "查询失败,传入非法参数！",
      count: "",
      result: []
    };
  } else {
    let json = {
      code: "0",
      msg: "查询成功",
      index: index,
      rows: rows,
      count: Count[0].Numbers,
      result: list
    };
    ctx.response.body = json;
  }
});

/*获取所有的分类 */
router.get("/Category/getCategorylistall", async (ctx, next) => {
  let data = ctx.query;
  let index = data.index || 1;
  let rows = data.rows || 10;
  let arr = [(index - 1) * rows, rows];
  let Count = await Category.findCategoryCountAll();
  let list = await Category.findCategoryAll(arr);

  if (typeof list.code != undefined && list.code == "2") {
    ctx.response.body = {
      code: "1",
      msg: "查询失败,传入非法参数！",
      count: "",
      result: []
    };
  } else {
    let json = {
      code: "0",
      msg: "查询成功",
      index: index,
      rows: rows,
      count: Count[0].Numbers,
      result: list
    };
    ctx.response.body = json;
  }
});

/*获取分类所有的 不带分页 findCategoryAlls*/
router.get("/Category/getCategorylistalls", async (ctx, next) => {
 
  let list = await Category.findCategoryAlls();

  if (typeof list.code != undefined && list.code == "2") {
    ctx.response.body = {
      code: "1",
      msg: "查询失败,传入非法参数！",
      result: []
    };
  } else {
    let json = {
      code: "0",
      msg: "查询成功",
      result: list
    };
    ctx.response.body = json;
  }
});


/*获取分类详情Category/getCategoryItem*/
router.get("/Category/getCategoryItem", async (ctx, next) => {
  let id = [ctx.query.id];
  let data = await Category.GetCategoryItem(id);
  if(data.length > 0 ){
    if (ctx.session.users != null) {
      ctx.response.body = {
        code: "0",
        msg: "查询成功！",
        result: data
      };
    }else{
      if(data[0].state == 1){
        ctx.response.body = {
          code: "0",
          msg: "查询成功！",
          result: data
        };
      }else{
        ctx.response.body = {
          code: "1",
          msg: "查询失败,数据为空",
          result: []
        };
      }
    }
  }else{
    ctx.response.body = {
      code: "1",
      msg: "查询失败,数据为空",
      result: []
    };
  }
});


/*获取消息列表 /api/message/getmessageList*/
router.get("/message/getmessageList", async (ctx,next) => {
  
    let data = ctx.query;
    let index = data.index || 1;
    let rows = data.rows || 10;
    let arr = [(index - 1) * rows, rows];
  
    let Count = await Message.findMessageCount();
    let list = await Message.findMessage(arr);

    for(var i=0; i<list.length; i++){
      list[i].child = await Messageply.findMessageplyAlls();
    };
    if (typeof list.code != 'undefined' && list.code == "2") {
      ctx.response.body = {
        code: "1",
        msg: "查询失败!",
        count: "",
        result: []
      };
    } else {
      ctx.response.body = {
        code: "0",
        msg: "查询成功",
        index: index,
        rows: rows,
        count: Count[0].Numbers,
        result: list
      };
    }
});
  


module.exports = router;
