var $;
layui.config({
	base: "js/"
}).use(['form', 'layer', 'jquery', 'upload'], function () {
	var form = layui.form(),
		layer = parent.layer === undefined ? layui.layer : parent.layer,
		upload = layui.upload,
		laypage = layui.laypage;
	$ = layui.jquery;

	var addUserArray = [], addUser;

	//上传图片
	layui.upload({
		url: "/admin/news/UploadImg",
		success: function (res) {
			top.layer.msg(res.msg);
			if (res.code == 0) {
				picImg.src = CDNURL + res.data.src;
				$("#pic").val(res.data.src);
			}
		}
	});

	form.on("submit(addUser)", function (data) {
		if(data.field.sex == "男"){
			var sex = '1';
		}else{
			var sex = '0';
		}
		//弹出loading
		var index = top.layer.msg('数据提交中，请稍候', { icon: 16, time: false, shade: 0.8 });
		$.post('/admin/user/addUsers',{
			username:data.field.username,
			mobile:data.field.mobile,
			password:data.field.password,
			pic:data.field.pic,
			statu:data.field.statu,
			authority:data.field.authority,
			sex:sex,
			age:data.field.age,
			nick_name:data.field.nick_name
		},function(res){
			top.layer.close(index);
			if(res.code == 0 ){
				layer.closeAll("iframe");
				//刷新父页面
				parent.location.reload();
			}else{
				top.layer.msg(res.msg);
			}
		});
		return false;
	})

})

//格式化时间
function formatTime(_time) {
	var year = _time.getFullYear();
	var month = _time.getMonth() + 1 < 10 ? "0" + (_time.getMonth() + 1) : _time.getMonth() + 1;
	var day = _time.getDate() < 10 ? "0" + _time.getDate() : _time.getDate();
	var hour = _time.getHours() < 10 ? "0" + _time.getHours() : _time.getHours();
	var minute = _time.getMinutes() < 10 ? "0" + _time.getMinutes() : _time.getMinutes();
	return year + "-" + month + "-" + day + " " + hour + ":" + minute;
}
