var $;
layui.config({
	base : "../../js/"
}).use(['form','layer','layedit'],function(){
    var form = layui.form(),
        layer = parent.layer === undefined ? layui.layer : parent.layer,
        layedit = layui.layedit;
        $ = layui.jquery;

    //消息回复
    var editIndex = layedit.build('msgReply',{
         tool: ['face'],
         height:100
    });


    /*获取当前时间*/
	function formatTimer(t) {
		if(!t){return false};
		function toDub(n) {
		return n > 9 ? n : "0" + n;
		}
		var oDate = new Date();
		oDate.setTime(t);
		var y = oDate.getFullYear();
		var m = oDate.getMonth() + 1;
		var d = oDate.getDate();
		var h = oDate.getHours();
		var mm = oDate.getMinutes();
		var s = oDate.getSeconds();
		return (
		y +
		"-" +
		toDub(m) +
		"-" +
		toDub(d) +
		" " +
		toDub(h) +
		":" +
		toDub(mm) +
		":" +
		toDub(s)
		);
	};
        
    form.on('select(selectMsg)',function(data){
        var len = $(".msgHtml tr").length;
        for(var i=0;i<len;i++){
            if(data.value == "0"){
                $(".msgHtml tr").eq(i).show();
                $(".msgHtml tr.no_msg").remove();
            }else{
                if($(".msgHtml tr").eq(i).find(".msg_collect i").hasClass("icon-star")){
                    $(".msgHtml tr").eq(i).show();
                }else{
                    $(".msgHtml tr").eq(i).hide();
                }
            }
        }
        if(data.value=="1" && $(".msgHtml tr").find(".msg_collect i.icon-star").length=="0"){
            $(".msgHtml").append("<tr class='no_msg' align='center'><td colspan='4'>暂无收藏消息</td></tr>")
        }
    })

    //加载数据
    $.get("/admin/message/getmessageList",function(data){
        var msgHtml = '';
        var data = data.result;
        for(var i=0; i<data.length; i++){
            
            msgHtml += '<tr>';
            msgHtml += '  <td class="msg_info">';
            msgHtml += '    <img src="'+data[i].userimg+'" width="50" height="50"><input type="hidden" value="'+data[i].id+'">';
            msgHtml += '    <div class="user_info">';
            msgHtml += '        <h2>'+data[i].username+'</h2>';
            msgHtml += '        <p>'+data[i].conten+'</p>';
            msgHtml += '    </div>';
            msgHtml += '  </td>';
            msgHtml += '  <td class="msg_time">'+data[i].ip_city+'-'+data[i].ip_ips+'&nbsp;&nbsp;&nbsp;'+formatTimer(data[i].create_time)+'</td>';
            msgHtml += '  <td class="msg_opr">';
            msgHtml += '    <a class="layui-btn layui-btn-mini reply_msg" data-id="'+data[i].id+'"><i class="layui-icon">&#xe611;</i> 回复</a>';
            msgHtml += '  </td>';
            msgHtml += '</tr>';
        }
        $(".msgHtml").html(msgHtml);
    })

    //回复
    $("body").on("click",".reply_msg",function(){
        var  parentid = $(this).attr('data-id');
      
        var id = $(this).parents("tr").find("input[type=hidden]").val();
        var userName = $(this).parents("tr").find(".user_info h2").text();
        var index = layui.layer.open({
            title : "与 "+userName+" 的聊天",
            type : 2,
            content : "/admin/message/messageReply",
            success : function(layero, index){
                setTimeout(function(){
                    layui.layer.tips('点击此处返回消息列表', '.layui-layer-setwin .layui-layer-close', {
                        tips: 3
                    });
                },500)
                var body = layui.layer.getChildFrame('body', index);
                //加载回复信息
                $.get("/admin/message/getmessageReply?parentid="+parentid,function(data){
                    var msgHtml = '';
                    var data = data.result;
                    for(var i=0; i<data.length; i++){
                        
                        msgHtml += '<tr>';
                        msgHtml += '  <td class="msg_info">';
                        msgHtml += '    <img src="'+data[i].userimg+'" width="50" height="50"><input type="hidden" value="'+data[i].id+'">';
                        msgHtml += '    <div class="user_info">';
                        msgHtml += '        <h2>'+data[i].username+'</h2>';
                        msgHtml += '        <p>'+data[i].conten+'</p>';
                        msgHtml += '    </div>';
                        msgHtml += '  </td>';
                        msgHtml += '  <td class="msg_time">'+data[i].ip_city+'-'+data[i].ip_ips+'&nbsp;&nbsp;&nbsp;'+formatTimer(data[i].create_time)+'</td>';
                        msgHtml += '</tr>';
                    }
                    body.find(".msgReplyHtml").html(msgHtml);
                })
            }
        })
        //改变窗口大小时，重置弹窗的高度，防止超出可视区域（如F12调出debug的操作）
        $(window).resize(function(){
            //layui.layer.full(index);
        })
        layui.layer.full(index);
    })

    //提交回复
    var message = [];
    $(".send_msg").click(function(){
        if(layedit.getContent(editIndex) != ''){
            var replyHtml = '',msgStr;
            replyHtml += '<tr>';
            replyHtml += '  <td class="msg_info">';
            replyHtml += '    <img src="../../images/face.jpg" width="50" height="50">';
            replyHtml += '    <div class="user_info">';
            replyHtml += '        <h2>请叫我马哥</h2>';
            replyHtml += '        <p>'+layedit.getContent(editIndex)+'</p>';
            replyHtml += '    </div>';
            replyHtml += '  </td>';
            replyHtml += '  <td class="msg_time">'+formatTime(new Date())+'</td>';
            replyHtml += '  <td class="msg_reply"></td>';
            replyHtml += '</tr>';
            $(".msgReplyHtml").prepend(replyHtml);
            $("#LAY_layedit_1").contents().find("body").html('');
        }else{
            layer.msg("请输入回复信息");
        }
    })
})


function formatTime(_time){
    var year = _time.getFullYear();
    var month = _time.getMonth()+1<10 ? "0"+(_time.getMonth()+1) : _time.getMonth()+1;
    var day = _time.getDate()<10 ? "0"+_time.getDate() : _time.getDate();
    var hour = _time.getHours()<10 ? "0"+_time.getHours() : _time.getHours();
    var minute = _time.getMinutes()<10 ? "0"+_time.getMinutes() : _time.getMinutes();
    return year+"-"+month+"-"+day+" "+hour+":"+minute;
}

