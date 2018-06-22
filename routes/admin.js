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
const Message = require("../db/message");
const Messageply = require("../db/messagereply");
const Category = require("../db/category");
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
router.post( "/user/UploadImg",tool.upload("public/static/UploadImg/").single("userFace"),
  async (ctx, next) => {
    if (ctx.session.users != null) {
      if (ctx.session.users.authority == 2) {
        await Users.UploadImg([
          "/static/UploadImg/" + ctx.req.file.filename,
          ctx.session.users.username
        ]);
        ctx.body = {
          code: "0",
          msg: "修改成功！",
          result: {
            path: "/static/UploadImg/" + ctx.req.file.filename //返回文件名
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

/*用户列表*/
router.get("/user/allUsers", async (ctx, next) => {
  ctx.state = {
    users: ctx.session.users
  };
  await ctx.render("admin/user/allUsers");
});

/*获取用户列表*/
router.post("/user/getallUsers", async (ctx, next) => {
  let data = ctx.request.body;
  let rows = data.rows || '10';
  let index = ((parseFloat(data.index) || '1')-1)*rows;
  let arr = [index,rows];
  let findUserCount = await Users.findUserCount();//获取总数;
  let list = await Users.findUsers(arr);
  ctx.body = {
    code: "0",
    msg: "获取用户列表成功",
    data:{
      list:list,
      rows:rows,
      index:index+1,
      count:findUserCount[0].Numbers,
    }
  };
});

/*用户添加或修改*/
router.get("/user/addUsers/:id", async (ctx, next) => {
  let  id = ctx.params.id;  
  ctx.state = {
    users: ctx.session.users,
    id:id
  };
  await ctx.render("admin/user/addUsers");
});

/*添加新用户*/
router.post("/user/addUsers", async (ctx, next) => {
  let data = ctx.request.body; 
  if (data.username.length < 4) {
    ctx.response.body = {
      code: "1",
      msg: "用户名不能少于4位"
    };
    return;
  }

  if (data.password.length < 6) {
    ctx.response.body = {
      code: "1",
      msg: "密码不能小于6位！"
    };
    return;
  }
  //先查询下用户是否存在；
  let findOneUser = await Users.findOneUsers(data.username);
  if (findOneUser.length != 0 && typeof findOneUser.code) {
    ctx.response.body = {
      code: "1",
      msg: "用户名已存在！"
    };
    return;
  } else if (typeof findOneUser.code && findOneUser.code == 2) {
    ctx.response.body = {
      code: "1",
      msg: "系统出小差了！"
    };
    return;
  }
  //用户不存在插入数据库
  let arr = [
    data.username,
    data.mobile || "",
    md5(data.password),
    new Date().getTime(),
    data.pic,
    data.statu,
    data.authority,
    data.sex,
    data.age,
    data.nick_name
  ];
  //username,mobile,password,create_time,pic,statu,authority
  let msg = await Users.insertUsers(arr);
  let res = {};

  if (msg.errno) {
    res = {
      code: "1",
      errno: msg.errno
    };
  } else {
    res = {
      code: "0",
      errno: "添加成功！"
    };
  }
  ctx.response.body = res;
});

/*删除用户 */
router.post("/user/removeUser",async (ctx, next) => {
  let data = ctx.request.body; 
  let ids = data.ids;
  for(var i=0; i <ids.length; i++){
    Users.DelUserAll(ids[i]);
  }
  ctx.response.body = {"code":"0","msg":"删除成功！"};
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
router.post("/news/UploadImg",tool.upload("public/static/UploadImg/").single("coverImgs"),async (ctx, next) => {
  let path = "/static/UploadImg/" + ctx.req.file.filename; //返回文件名
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
router.post("/news/UploadImgContent",tool.upload("public/static/ArticlesImg/").single("file"),async (ctx, next) => {
  let path = "/static/ArticlesImg/" + ctx.req.file.filename; //返回文件名
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


/*分类列表*/
router.get("/category/categoryList", async (ctx,next) =>{
  ctx.state = {
    users: ctx.session.users,
  };
  await ctx.render("admin/category/categoryList");
});

/*分类添加/修改*/
router.get("/category/categoryAdd/:id", async (ctx,next) =>{
  let  id = ctx.params.id;  
  ctx.state = {
    users: ctx.session.users,
    id:id,
  };
  await ctx.render("admin/category/categoryAdd");
});

/*添加分类insertCategory*/
router.post("/category/categoryAdd", async (ctx, next) => {
  let data = ctx.request.body;
  let timers = await tool.Time();
  //category_text,create_time,state
  let arr = [
    data.category_text,
    timers,
    data.state,
  ];
  await Category.insertCategory(arr);
  ctx.body = {
    code: "0",
    msg: "添加成功！"
  };
});

/*链接是否显示isState*/
router.post("/category/isState", async (ctx, next) => {
  let data = ctx.request.body;
  let arr = [data.state, data.id];
  await Category.UpDateState(arr);
  ctx.body = {
    code: "0",
    msg: "修改成功！"
  };
});

/*修改友情链接 links/linksEdit*/
router.post("/category/categoryEdit", async (ctx, next) => {
  let data = ctx.request.body;
  let timers = await tool.Time();
  // category_text=?,state=?,update_time=? WHERE id=?
  let arr = [
    data.category_text,
    data.state,
    timers,
    data.id
  ];
  await Category.UpdateCategory(arr);
  ctx.body = {
    code: "0",
    msg: "修改成功"
  };
});

/*消息列表 /admin/message/messageList*/
router.get("/message/messageList", async (ctx,next) => {
  await ctx.render("admin/message/messageList");
});

/*获取消息列表 /admin/message/getmessageList*/
router.get("/message/getmessageList", async (ctx,next) => {

    let data = ctx.query;
    let index = data.index || 1;
    let rows = data.rows || 10;
    let arr = [(index - 1) * rows, rows];
  
    let Count = await Message.findMessageCountAll();
    let list = await Message.findMessageAll(arr);

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

/*二级消息页面 */
router.get("/message/messageReply",async (ctx,next)=>{
  await ctx.render("admin/message/messageReply");
});

/*获取二级消息页面 */
router.get("/message/getmessageReply",async (ctx,next)=>{
  
  if(typeof  ctx.query.parentid == 'undefined'){
    ctx.response.body = {
      code: "1",
      msg: "查询失败",
      result:[]
    };
  }else{
    let parentid =  ctx.query.parentid;
    let list = await Messageply.findMessageplyAllFindOne(parentid);
    if (typeof list.code != 'undefined' && list.code == "2") {
      ctx.response.body = {
        code: "1",
        msg: "查询失败!",
        result: []
      };
    } else {
      ctx.response.body = {
        code: "0",
        msg: "查询成功",
        result: list
      };
    }
  }
});



module.exports = router;
