layui.config({
  base: "js/"
}).use(['form', 'layer'], function () {
  var form = layui.form(),
    layer = parent.layer === undefined ? layui.layer : parent.layer,
    $ = layui.jquery;

  //video背景
  function autoVideo() {
    if ($(".video-player").width() > $(window).width()) {
      $(".video-player").css({
        "height": $(window).height(),
        "width": "auto"
      });
    } else {
      $(".video-player").css({
        "width": $(window).width(),
        "height": "auto"
      });
    }
  }

  //video背景
  $(window).resize(function () {
    autoVideo();
  }).resize();

  //初始化背景
  autoVideo();

  //刷新验证码
  $('.code').on('click', 'img', function () {
    $(this).attr('src', '/api/login/code?timer=' + new Date().getTime());
  })

  //登录按钮事件
  form.on("submit(login)", function (data) {
    var index = layer.msg('登录中，请稍候',{icon: 16,time:false,shade:0.8});
    $.ajax({
      url:'/api/users/login',
      type: "POST",
      contentType:"application/x-www-form-urlencoded",
      data: data.field,
      success: function(data){
        setTimeout(function(){
          layer.close(index);
          if(data.code == 0 ){
            window.location.href = "/admin";
          }else{
            //登录失败重新获取验证码
            layer.msg(data.msg);
            $('.code img').attr('src', '/api/login/code?timer=' + new Date().getTime());
          } 
        },1000)
      }
    })
    
    return false;
  })
})