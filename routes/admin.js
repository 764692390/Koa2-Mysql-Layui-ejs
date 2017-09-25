/**
 * creater:lizhi@blog.jczxw.cn
 * create time:2017/9/15
 * describe：admin路由
 **/

const router = require("koa-router")();
const Redis = require("ioredis");
const config = require("../config/default");
const redis = new Redis(config.Redis);
const Articles = require("../db/articles");
const Users = require("../db/users");
const Links = require("../db/links");
const tool = require("../tool/common");
const md5 = require("md5");

/*后台登录*/
router.get("/", async (ctx, next) => {
  if (ctx.session.users != null) {
    ctx.state = {
      users: ctx.session.users
    };
    await ctx.render("admin/main");
  } else {
    await ctx.render("admin/login");
  }
});

/*登录页面 */
router.get("/login", async (ctx, next) => {
  ctx.session.users = null;
  await ctx.render("admin/login");
});

/*没登录拦截到登录页面*/
router.get("*", async (ctx, next) => {
  if (ctx.session.users != null) {
    await next();
  } else {
    await ctx.render("admin/login");
  }
});

/*没登录拦截到登录页面*/
router.post("*", async (ctx, next) => {
  if (ctx.session.users != null) {
    if (ctx.session.users.authority == 2) {
      await next();
    } else {
      ctx.body = {
        code: "1",
        msg: "当前用户没有权限"
      };
    }
  } else {
    ctx.body = {
      code: "1",
      msg: "当前用户没有权限"
    };
  }
});

/*后台默认首页 */
router.get("/index", async (ctx, next) => {
  ctx.state = {
    users: ctx.session.users
  };
  await ctx.render("admin/index");
});

/* 个人资料【user/userInfo】 */
router.get("/user/userInfo", async (ctx, next) => {
  ctx.state = {
    users: ctx.session.users
  };
  await ctx.render("admin/user/userInfo");
});

/*修改密码 changePwd*/
router.get("/user/changePwd", async (ctx, next) => {
  ctx.state = {
    users: ctx.session.users
  };
  await ctx.render("admin/user/changePwd");
});

/*修改密码 UpDateNewPassword */
router.post("/user/UpDateNewPassword", async (ctx, next) => {
  let data = ctx.request.body;
  let newPassword = await md5(data.newPassword);
  let oPassword = await md5(data.oPassword);
  if (newPassword.length < 6) {
    ctx.body = {
      code: "1",
      msg: "新密码长度不能小于6位"
    };
    return;
  }
  if (oPassword != ctx.session.users.password) {
    ctx.body = {
      code: "1",
      msg: "旧密码输入有误！"
    };
    return;
  }
  let arr = [newPassword, ctx.session.users.username];
  await Users.UpDateNewPassword(arr);
  ctx.body = {
    code: "0",
    msg: "密码修改成功！"
  };
  await tool.UpdataSession(ctx); //更新session
});

/*后台用户上传图片*/
router.post(
  "/user/UploadImg",
  tool.upload("public/UploadImg/").single("userFace"),
  async (ctx, next) => {
    if (ctx.session.users != null) {
      if (ctx.session.users.authority == 2) {
        await Users.UploadImg([
          "/UploadImg/" + ctx.req.file.filename,
          ctx.session.users.username
        ]);
        ctx.body = {
          code: "0",
          msg: "修改成功！",
          result: {
            path: "/UploadImg/" + ctx.req.file.filename //返回文件名
          }
        };
        await tool.UpdataSession(ctx); //更新session
      } else {
        ctx.body = {
          code: "1",
          msg: "当前用户没有权限"
        };
      }
    } else {
      await ctx.render("admin/login");
    }
  }
);

/*个人资料修改 UpDateUserMSN */
router.post("/user/UpDateUserMSN", async (ctx, next) => {
  let data = ctx.request.body;
  if (
    data.mobile != undefined &&
    data.sex != undefined &&
    data.nick_name != undefined
  ) {
    let arr = [
      data.mobile,
      data.sex,
      data.nick_name,
      ctx.session.users.username
    ];
    await Users.UpDateUserMSN(arr);
    ctx.body = {
      code: "0",
      msg: "修改成功"
    };
    await tool.UpdataSession(ctx); //更新session
  } else {
    ctx.body = {
      code: "1",
      msg: "参数有误！"
    };
  }
});

/*文章列表*/
router.get("/news/newsList", async (ctx, next) => {
  ctx.state = {
    users: ctx.session.users
  };
  await ctx.render("admin/news/newsList");
});

/*添加文章 newsAdd*/
router.get("/news/newsAdd/:id", async (ctx, next) => {
  let  id = ctx.params.id;  
  ctx.state = {
    users: ctx.session.users,
    id:id
  };
  await ctx.render("admin/news/newsAdd");
});

/*添加文章 newsAdd*/
router.post("/news/newsAdd", async (ctx, next) => {
  let data = ctx.request.body;
  let timers = await tool.Time();
  //title,abstract,content,create_time,state,stick,recommend,username,coverImg,typeName
  let arr = [
    data.title,
    data.abstract,
    data.content,
    timers,
    data.state,
    data.stick,
    data.recommend,
    data.username,
    data.coverImg,
    data.typeName
  ];
  await Articles.insertArticles(arr);
  ctx.body = {
    code: "0",
    msg: "文章添加成功！"
  };
});

/*修改文章 news/newsEdit*/
router.post("/news/newsEdit", async (ctx, next) => {
  let data = ctx.request.body;
  let timers = await tool.Time();
  //title=?,abstract=?,content=?,state=?,stick=?,recommend=?,username=?,coverImg=?,typeName=?,update_time=? WHERE id=?
  let arr = [
    data.title,
    data.abstract,
    data.content,
    data.state,
    data.stick,
    data.recommend,
    data.username,
    data.coverImg,
    data.typeName,
    timers,
    data.id
  ];
  await Articles.UpdateArticles(arr);
  ctx.body = {
    code: "0",
    msg: "修改成功"
  };
});

/*文章封面图片上传*/
router.post("/news/UploadImg",tool.upload("public/UploadImg/").single("coverImgs"),async (ctx, next) => {
  let path = "/UploadImg/" + ctx.req.file.filename; //返回文件名
  ctx.body = {
    code: "0",
    msg: "上传成功！",
    data: {
      src: path,
      title:ctx.req.file.filename
    }
  };
});

/*文章内容上传图片*/
router.post("/news/UploadImgContent",tool.upload("public/ArticlesImg/").single("file"),async (ctx, next) => {
  let path = "/ArticlesImg/" + ctx.req.file.filename; //返回文件名
  ctx.body = {
    code: "0",
    msg: "上传成功！",
    data: {
      src: path,
      title:ctx.req.file.filename
    }
  };
});

/*文章是否显示isState*/
router.post("/news/isState", async (ctx, next) => {
  let data = ctx.request.body;
  let arr = [data.state, data.id];
  await Articles.UpDateState(arr);
  ctx.body = {
    code: "0",
    msg: "修改成功！"
  };
});

/*文章是否推荐isRecommend*/
router.post("/news/isRecommend", async (ctx, next) => {
  let data = ctx.request.body;
  let arr = [data.recommend, data.id];
  await Articles.UpDateRecommend(arr);
  ctx.body = {
    code: "0",
    msg: "修改成功！"
  };
});

/*文章是否顶isStick*/
router.post("/news/isStick", async (ctx, next) => {
  let data = ctx.request.body;
  let arr = [data.stick, data.id];
  await Articles.UpDateStick(arr);
  ctx.body = {
    code: "0",
    msg: "修改成功！"
  };
});

/*删除文章文章单个或者批量删除*/
router.post("/news/delAll", async (ctx, next) => {
  let data = ctx.request.body.id;
  if(data.length > 0){
      for(var i=0; i<data.length;i++){
        var arr = [data[i]];
        await Articles.DelArticlesAll(arr);
      }
      ctx.body = {
        code: "0",
        msg: "删除成功！"
      };
  }else{
    ctx.body = {
      code: "1",
      msg: "删除失败！"
    };
  }
});

/*友情链接*/
router.get("/links/linksList", async (ctx, next) => {
  ctx.state = {
    users: ctx.session.users,
  };
  await ctx.render("admin/links/linksList");
});

/*友情链接*/
router.get("/links/linksAdd/:id", async (ctx, next) => {
  let  id = ctx.params.id;  
  ctx.state = {
    users: ctx.session.users,
    id:id
  };
  await ctx.render("admin/links/linksAdd");
});

/*添加友情链接 Links*/
router.post("/links/linksAdd", async (ctx, next) => {
  let data = ctx.request.body;
  let timers = await tool.Time();
  //webname,url,email,pic,create_time,state
  let arr = [
    data.webname,
    data.url,
    data.email,
    data.pic,
    timers,
    data.state,
  ];
  console.log(arr);
  await Links.insertLinks(arr);
  ctx.body = {
    code: "0",
    msg: "添加成功！"
  };
});

/*删除友情链接单个和批量删除 */
router.post("/links/delAll", async (ctx, next) => {
  let data = ctx.request.body.id;
  if(data.length > 0){
      for(var i=0; i<data.length;i++){
        var arr = [data[i]];
        await Links.DelLinksAll(arr);
      }
      ctx.body = {
        code: "0",
        msg: "删除成功！"
      };
  }else{
    ctx.body = {
      code: "1",
      msg: "删除失败！"
    };
  }
});

/*链接是否显示isState*/
router.post("/links/isState", async (ctx, next) => {
  let data = ctx.request.body;
  let arr = [data.state, data.id];
  await Links.UpDateState(arr);
  ctx.body = {
    code: "0",
    msg: "修改成功！"
  };
});

/*修改友情链接 links/linksEdit*/
router.post("/links/linksEdit", async (ctx, next) => {
  let data = ctx.request.body;
  let timers = await tool.Time();
  //UPDATE links SET webname=?,url=?,email=?,pic=?,state=?,update_time=? WHERE id=?";
  let arr = [
    data.webname,
    data.url,
    data.email,
    data.pic,
    data.state,
    timers,
    data.id
  ];
  await Links.UpdateLinks(arr);
  ctx.body = {
    code: "0",
    msg: "修改成功"
  };
});

module.exports = router;
