layui
  .config({
    base: "js/"
  })
  .use(["form", "layer", "jquery", "layedit", "laydate", "upload"], function() {
    var form = layui.form(),
      layer = parent.layer === undefined ? layui.layer : parent.layer,
      laypage = layui.laypage,
      layedit = layui.layedit,
      laydate = layui.laydate,
      upload = layui.upload,
      $ = layui.jquery;
      window.editIndex;

    //上传图片
    layui.upload({
      url: "/admin/news/UploadImg",
      success: function(res) {
        top.layer.msg(res.msg);
        if (res.code == 0) {
          articleCoverImg.src = res.data.src;
          $("#articleCoverSrc").val(res.data.src);
        }
      }
    });

    //富文本编辑器图片上传
    layedit.set({
      uploadImage: {
        url: "/admin/news/UploadImgContent", //接口url
      }
    });

    //如果是修改获取内容
    if (ids != "add") {
      $.ajax({
        url: "/api/news/getNewsItem",
        type: "get",
        data: {
          id: ids
        },
        success: function(res) {
          if (res.code == 0) {
            var data = res.result[0];
            $('input[name="title"]').val(data.title);
            $('textarea[name="abstract"]').html(data.abstract);
            $("#news_content").html(data.content);
            $('input[name="coverImg"]').val(data.coverImg);
            $("#articleCoverImg").attr("src", data.coverImg);
            if (data.state == 1) {
              $('input[name="state"]').attr("checked", true);
            } else {
              $('input[name="state"]').attr("checked", false);
            }

            if (data.recommend == 1) {
              $('input[name="recommend"]').attr("checked", true);
            } else {
              $('input[name="recommend"]').attr("checked", false);
            }

            if (data.stick == 1) {
              $('input[name="stick"]').attr("checked", true);
            } else {
              $('input[name="stick"]').attr("checked", false);
            }

            form.render();
            //创建一个编辑器
            editIndex = layedit.build("news_content");
          } else {
            top.layer.msg(res.msg);
          }
        }
      });
    } else {
      //创建一个编辑器
      editIndex = layedit.build("news_content");
    }

    //提交按钮监听
    form.on("submit(addNews)", function(data) {
      //弹出loading
      var contents = layedit.getContent(editIndex);
      var index = top.layer.msg("数据提交中，请稍候", {
        icon: 16,
        time: false,
        shade: 0.8
      });
      //自定义属性
      var state = data.field.state == "on" ? "1" : "0", //文章是否显示1 显示， 0 不显示
        recommend = data.field.recommend == "on" ? "1" : "0", //是否推荐显示1 是， 0 否
        stick = data.field.stick == "on" ? "1" : "0"; //是否顶  1是，0 否
      data.field.state = state;
      data.field.recommend = recommend;
      data.field.stick = stick;
      if (ids == "add") {
        var url ="/admin/news/newsAdd";
        var data = {
          title: data.field.title,
          abstract: data.field.abstract,
          content: contents,
          state: data.field.state,
          stick: data.field.stick,
          recommend: data.field.recommend,
          username: data.field.username,
          coverImg: data.field.coverImg,
          typeName: data.field.typeName
        }
      }else{
        var url ="/admin/news/newsEdit";
        var data = {
          title: data.field.title,
          abstract: data.field.abstract,
          content: contents,
          state: data.field.state,
          stick: data.field.stick,
          recommend: data.field.recommend,
          username: data.field.username,
          coverImg: data.field.coverImg,
          typeName: data.field.typeName,
          id:ids
        }
      }
      $.ajax({
        url: url,
        type: "POST",
        data:data,
        success: function(res) {
          setTimeout(function() {
            if(res.code == 0 ){
              top.layer.close(index);
              top.layer.msg(res.msg);
              layer.closeAll("iframe");
              parent.location.reload();
            }else{
              top.layer.msg(res.msg);
            }
          }, 500);
        }
      });
      return false;
    });
  });
