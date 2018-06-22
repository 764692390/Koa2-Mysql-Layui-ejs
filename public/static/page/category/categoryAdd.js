layui.config({
  base: "js/"
}).use(['form', 'layer', 'jquery'], function () {
  var form = layui.form(),
    layer = parent.layer === undefined ? layui.layer : parent.layer,
    $ = layui.jquery;

  //判断是否是修改
  if (ids != "add") {
    $.ajax({
      url: '/api/Category/getCategoryItem',
      type: "get",
      data: {
        id:ids
      },
      success: function (res) {
        console.log(res);
        if (res.code == 0) {
          var data = res.result[0]
          $('input[name="category_text"]').val(data.category_text);
          if(data.state == 1){
            $('input[name="state"]').attr("checked", true);
          }else{
            $('input[name="state"]').attr("checked", false);
          }
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
      var url = "/admin/category/categoryAdd";
      var data = {
        category_text: data.field.category_text,
        state: state,
      }
    } else {
      var url = "/admin/category/categoryEdit";
      var data = {
        category_text: data.field.category_text,
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