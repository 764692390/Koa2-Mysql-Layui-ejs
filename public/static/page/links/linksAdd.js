layui.config({
  base: "js/"
}).use(['form', 'layer', 'jquery', 'upload'], function () {
  var form = layui.form(),
    layer = parent.layer === undefined ? layui.layer : parent.layer,
    laypage = layui.laypage,
    upload = layui.upload,
    $ = layui.jquery;


  //上传图片
  layui.upload({
    url: "/admin/news/UploadImg",
    success: function (res) {
      top.layer.msg(res.msg);
      if (res.code == 0) {
        picImg.src = CDNURL+res.data.src;
        $("#pic").val(res.data.src);
      }
    }
  });

  //判断是否是修改
  if (ids != "add") {
    $.ajax({
      url: '/api/link/getlinksItem',
      type: "get",
      data: {
        id:ids
      },
      success: function (res) {
        if (res.code == 0) {
          var data = res.result[0]
          $('input[name="webname"]').val(data.webname);
          $('input[name="url"]').val(data.url);
          $('input[name="email"]').val(data.email);
          if(data.state == 1){
            $('input[name="state"]').attr("checked", true);
          }else{
            $('input[name="state"]').attr("checked", false);
          }
          $("#picImg").attr("src",CDNURL+data.pic);
          $('input[name="pic"]').val(data.pic);
        
          form.render();
        } else {
          top.layer.msg(res.msg);
        }
      }
    });
  }

  form.on("submit(addLinks)", function (data) {
    var index = top.layer.msg('数据提交中，请稍候', {
      icon: 16,
      time: false,
      shade: 0.8
    });
    var state = data.field.state == "on" ? "1" : "0"; //是否显示1 显示， 0 不显示
    if (ids == "add") {
      var url = "/admin/links/linksAdd";
      var data = {
        webname: data.field.webname,
        url: data.field.url,
        email: data.field.email,
        pic: data.field.pic,
        state: state,
      }
    } else {
      var url = "/admin/links/linksEdit";
      var data = {
        webname: data.field.webname,
        url: data.field.url,
        email: data.field.email,
        pic: data.field.pic,
        state:state,
        id:ids
      }
    }
    $.ajax({
      url: url,
      type: "POST",
      data: data,
      success: function (res) {
        setTimeout(function () {
          if (res.code == 0) {
            top.layer.close(index);
            top.layer.msg(res.msg);
            layer.closeAll("iframe");
            parent.location.reload();
          } else {
            top.layer.msg(res.msg);
          }
        }, 500);
      }
    });
    return false;
  })

})