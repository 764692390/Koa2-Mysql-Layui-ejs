layui.config({
	base : "js/"
}).use(['form','layer','jquery','laypage'],function(){
	var form = layui.form(),
		layer = parent.layer === undefined ? layui.layer : parent.layer,
		laypage = layui.laypage,
		$ = layui.jquery,
		one =true ;
		

	//加载页面数据
	var usersData = '';
	$.post("/admin/user/getallUsers", function(data){
		if(data.code == 0){
			//执行加载数据的方法
			usersList(data.data);
		}else{
			layer.msg(data.msg);
		};
	});

	/*点击分页更新html*/
	function updateList(index){
		$.post("/admin/user/getallUsers",{"index":index}, function(data){
			//执行加载数据的方法
			setTimeout(function(){
				top.layer.close(indexs);
				if(data.code == 0){
					//执行加载数据的方法
					$(".users_content").html(renderDate(data.data.list));
					$('.users_list thead input[type="checkbox"]').prop("checked",false);
					form.render();
				}else{
					layer.msg(data.msg);
				};
			},500);
		})
	};


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


	//添加用户
	window.adduserFn = function(id){
		if(id == "add"){
			var type = "add";
		}else{
			var type = id;
		};
		var index = layui.layer.open({
			title : "添加用户",
			type : 2,
			content : "/admin/user/addUsers/"+type,
			success : function(layero, index){
				setTimeout(function(){
					layui.layer.tips('点击此处返回列表', '.layui-layer-setwin .layui-layer-close', {
						tips: 3
					});
				},500)
			}
		})
		//改变窗口大小时，重置弹窗的高度，防止超出可视区域（如F12调出debug的操作）
		$(window).resize(function(){
			layui.layer.full(index);
		})
		layui.layer.full(index);
	}

	//批量删除
	$(".batchDel").click(function(){
		var $checkbox = $('.users_list tbody input[type="checkbox"][name="checked"]');
		var $checked = $('.users_list tbody input[type="checkbox"][name="checked"]:checked');
		var arr=[];
		if($checkbox.is(":checked")){
			layer.confirm('确定删除选中的信息？',{icon:3, title:'提示信息'},function(index){
				var index = layer.msg('删除中，请稍候',{icon: 16,time:false,shade:0.8});
				for(var j=0;j<$checked.length;j++){
					arr.push($($checked[j]).attr('data-id'));
				}
				//删除方法
				removeUsers(arr,index);
				
	        })
		}else{
			layer.msg("请选择需要删除的文章");
		}
	});

	//删除
	$("body").on("click",".users_del",function(){  
		var _this = $(this);
		var arr=[_this.attr("data-id")];
		layer.confirm('确定删除此用户？',{icon:3, title:'提示信息'},function(){
			//删除
			var index = layer.msg('删除中，请稍候',{icon: 16,time:false,shade:0.8});
			removeUsers(arr,index);
		});
	});

	//删除方法
	function removeUsers(arr,index){
		//删除数据
		$.post('/admin/user/removeUser',{"ids":arr},function(res){
			$('.users_list thead input[type="checkbox"]').prop("checked",false);
			layer.close(index);
			if(res.code == 0){
				location.reload();
			}
			layer.msg(res.msg);
		});
	};

    //全选
	form.on('checkbox(allChoose)', function(data){
		var child = $(data.elem).parents('table').find('tbody input[type="checkbox"]:not([name="show"])');
		child.each(function(index, item){
			item.checked = data.elem.checked;
		});
		form.render('checkbox');
	});

	//通过判断文章是否全部选中来确定全选按钮是否选中
	form.on("checkbox(choose)",function(data){
		var child = $(data.elem).parents('table').find('tbody input[type="checkbox"]:not([name="show"])');
		var childChecked = $(data.elem).parents('table').find('tbody input[type="checkbox"]:not([name="show"]):checked')
		if(childChecked.length == child.length){
			$(data.elem).parents('table').find('thead input#allChoose').get(0).checked = true;
		}else{
			$(data.elem).parents('table').find('thead input#allChoose').get(0).checked = false;
		}
		form.render('checkbox');
	})
	


	//渲染数据
	function renderDate(data){
		var dataHtml = '';
		currData = data;
		if(currData.length != 0){
			for(var i=0;i<currData.length;i++){
				dataHtml += '<tr>'
				+  '<td><input type="checkbox" name="checked" lay-skin="primary" data-id="'+currData[i].id+'" lay-filter="choose"></td>'
				+  '<td>'+currData[i].nick_name+'</td>'
				+  '<td>'+currData[i].username+'</td>'
				+  '<td>'+currData[i].mobile+'</td>'

				if(currData[i].sex == 1){
					dataHtml +=  '<td>男</td>'
				}else if(currData[i].sex == 0){
					dataHtml += '<td>女</td>'
				}

				if(currData[i].authority == 1){
					dataHtml +=  '<td>普通管理员</td>'
				}else if(currData[i].authority == 2){
					dataHtml += '<td style="color:#FF5722">超级管理员</td>'
				}

				if(currData[i].statu == 1){
					dataHtml +=  '<td>启用</td>'
				}else if(currData[i].statu == 0){
					dataHtml += '<td>禁用</td>'
				}
				
				dataHtml += '<td>'+formatTimer(currData[i].create_time)+'</td>'
				+  '<td>'
				+    '<a class="layui-btn layui-btn-mini users_edit" onclick="adduserFn('+currData[i].id+')"><i class="iconfont icon-edit"></i> 编辑</a>'
				+    '<a class="layui-btn layui-btn-danger layui-btn-mini users_del" data-id="'+currData[i].id+'"><i class="layui-icon">&#xe640;</i> 删除</a>'
				+  '</td>'
				+'</tr>';
			}
		}else{
			dataHtml = '<tr><td colspan="8">暂无数据</td></tr>';
		}
		return dataHtml;
	}

	function usersList(data){

		//分页
		var nums = data.rows; //每页出现的数据量
		laypage({
			cont : "page",
			pages : Math.ceil(data.count/nums),
			jump : function(obj){
				if(one){
					one = false;
					$(".users_content").html(renderDate(data.list));
					$('.users_list thead input[type="checkbox"]').prop("checked",false);
					form.render();
				  }else{
					indexs = top.layer.msg('数据获取中，请稍候',{icon: 16,time:false,shade:0.8});
					updateList(obj.curr);
					console.log(obj);
				  }
			}
		})
	}
        
})