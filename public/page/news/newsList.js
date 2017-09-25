layui.config({
	base : "js/"
}).use(['form','layer','jquery','laypage'],function(){
	var form = layui.form(),
		layer = parent.layer === undefined ? layui.layer : parent.layer,
		laypage = layui.laypage,
    $ = layui.jquery,
		indexs,
    dataList,
    one =true ;

	//加载页面数据
	var newsData = '';
	$.get("/api/Articles/getArticleslistall", function(data){
      //执行加载数据的方法
      if(data.code ==0){
        newsList(data);
      }
	})

	//查询
	$(".search_btn").click(function(){
    return false;
		var newArray = [];
		if($(".search_input").val() != ''){
			var index = layer.msg('查询中，请稍候',{icon: 16,time:false,shade:0.8});
            setTimeout(function(){
            	$.ajax({
					url : "../../json/newsList.json",
					type : "get",
					dataType : "json",
					success : function(data){
						if(window.sessionStorage.getItem("addNews")){
							var addNews = window.sessionStorage.getItem("addNews");
							newsData = JSON.parse(addNews).concat(data);
						}else{
							newsData = data;
						}
						for(var i=0;i<newsData.length;i++){
							var newsStr = newsData[i];
							var selectStr = $(".search_input").val();
		            		function changeStr(data){
		            			var dataStr = '';
		            			var showNum = data.split(eval("/"+selectStr+"/ig")).length - 1;
		            			if(showNum > 1){
									for (var j=0;j<showNum;j++) {
		            					dataStr += data.split(eval("/"+selectStr+"/ig"))[j] + "<i style='color:#03c339;font-weight:bold;'>" + selectStr + "</i>";
		            				}
		            				dataStr += data.split(eval("/"+selectStr+"/ig"))[showNum];
		            				return dataStr;
		            			}else{
		            				dataStr = data.split(eval("/"+selectStr+"/ig"))[0] + "<i style='color:#03c339;font-weight:bold;'>" + selectStr + "</i>" + data.split(eval("/"+selectStr+"/ig"))[1];
		            				return dataStr;
		            			}
		            		}
		            		//文章标题
		            		if(newsStr.newsName.indexOf(selectStr) > -1){
			            		newsStr["newsName"] = changeStr(newsStr.newsName);
		            		}
		            		//发布人
		            		if(newsStr.newsAuthor.indexOf(selectStr) > -1){
			            		newsStr["newsAuthor"] = changeStr(newsStr.newsAuthor);
		            		}
		            		//审核状态
		            		if(newsStr.newsStatus.indexOf(selectStr) > -1){
			            		newsStr["newsStatus"] = changeStr(newsStr.newsStatus);
		            		}
		            		//浏览权限
		            		if(newsStr.newsLook.indexOf(selectStr) > -1){
			            		newsStr["newsLook"] = changeStr(newsStr.newsLook);
		            		}
		            		//发布时间
		            		if(newsStr.newsTime.indexOf(selectStr) > -1){
			            		newsStr["newsTime"] = changeStr(newsStr.newsTime);
		            		}
		            		if(newsStr.newsName.indexOf(selectStr)>-1 || newsStr.newsAuthor.indexOf(selectStr)>-1 || newsStr.newsStatus.indexOf(selectStr)>-1 || newsStr.newsLook.indexOf(selectStr)>-1 || newsStr.newsTime.indexOf(selectStr)>-1){
		            			newArray.push(newsStr);
		            		}
		            	}
		            	newsData = newArray;
		            	newsList(newsData);
					}
				})
            	
                layer.close(index);
            },2000);
		}else{
			layer.msg("请输入需要查询的内容");
		}
	})

	//改变窗口大小时，重置弹窗的高度，防止超出可视区域（如F12调出debug的操作）
	$(window).one("resize",function(){
		//添加文章
		$(".newsAdd_btn").click(function(){
			var index = layui.layer.open({
				title : "添加文章",
				type : 2,
				content : "newsAdd/add",
				success : function(layero, index){
					setTimeout(function(){
						layui.layer.tips('点击此处返回文章列表', '.layui-layer-setwin .layui-layer-close', {
							tips: 3
						});
					},500)
				}
			})			
			layui.layer.full(index);
		})

	 //修改文章
		$("body").on("click",".news_edit",function(){  //编辑
			var id =$(this).attr('data-id');
			var index = layui.layer.open({
				title : "修改文章",
				type : 2,
				content : "newsAdd/"+id,
				success : function(layero, index){
					setTimeout(function(){
						layui.layer.tips('点击此处返回文章列表', '.layui-layer-setwin .layui-layer-close', {
							tips: 3
						});
					},500)
				}
			})			
			layui.layer.full(index);
		})
	}).resize();

	//单个删除个批量删除
	function removeList(arrid){
		var index = layer.msg('删除中，请稍候',{icon: 16,time:false,shade:0.8});
		//批量删除文章
		$.ajax({
			url:'/admin/news/delAll',
			type:'post',
			data:{
				 id:arrid,
			},
			success:function(res){
				setTimeout(function(){
            if(res.code == 0){
              layer.close(index);
              window.location.reload();
            }else{
              layer.close(index);
              layer.msg(res.msg);
            }
				},500);
			}
		})
	}

	//批量删除
	$(".batchDel").click(function(){
		var arr=[]; //选中的
		var $checkbox = $('.news_list tbody input[type="checkbox"][name="checkeds"]');
		var $checked = $('.news_list tbody input[type="checkbox"][name="checkeds"]:checked');
		if($checkbox.is(":checked")){
			layer.confirm('确定删除选中的信息？',{icon:3, title:'提示信息'},function(index){
				//选中要删除数据的ID
				for(var j=0;j<$checked.length;j++){
					var id = $($checked[j]).attr('data-id');
					arr.push(id);
				}
				//单个删除或者批量删除
				removeList(arr)
	    })
		}else{
			layer.msg("请选择需要删除的文章");
		}
		return false;
	})

	//全选
	form.on('checkbox(allChoose)', function(data){
    var child = $(data.elem).parents('table').find('tbody tr').find('td input[name="checkeds"]');
		child.each(function(index, item){
			item.checked = data.elem.checked;
		});
		form.render('checkbox');
	});

	//通过判断文章是否全部选中来确定全选按钮是否选中
	form.on("checkbox(choose)",function(data){
		var child = $(data.elem).parents('table').find('tbody input.checkeds[type="checkbox"]');
    var childChecked = $(data.elem).parents('table').find('tbody input.checkeds[type="checkbox"]:checked');
    data.elem.checked;
		if(childChecked.length != 0){
			$(data.elem).parents('table').find('thead input#allChoose').get(0).checked = true;
		}else{
			$(data.elem).parents('table').find('thead input#allChoose').get(0).checked = false;
		}
		form.render('checkbox');
	})

	//isState 是否展示
	form.on('switch(isState)', function(data){
    var state;
    if(data.elem.checked){
      state=1;
    }else{
      state=0;
    }
    var id = $(data.elem).attr('data-id');
		var index = layer.msg('修改中，请稍候',{icon: 16,time:false,shade:0.8});
    $.ajax({
      url:'/admin/news/isState',
      type:'post',
      data:{
         id:id,
         state:state
      },
      success:function(res){
        setTimeout(function(){
          if(res.code == 0 ){
            layer.close(index);
            layer.msg(res.msg);
          }else{
            data.elem.checked = !data.elem.checked;
            layer.close(index);
            layer.msg(res.msg);
            form.render();
          }
      },500);
      }
    })
    return false;
  })
	//isRecommend 是否推荐
	form.on('switch(isRecommend)', function(data){
    var recommend;
    if(data.elem.checked){
      recommend=1;
    }else{
      recommend=0;
    }
    var id = $(data.elem).attr('data-id');
    var index = layer.msg('修改中，请稍候',{icon: 16,time:false,shade:0.8});
        $.ajax({
          url:'/admin/news/isRecommend',
          type:'post',
          data:{
              id:id,
              recommend:recommend
          },
          success:function(res){
            setTimeout(function(){
              if(res.code == 0 ){
                layer.close(index);
                layer.msg(res.msg);
              }else{
                data.elem.checked = !data.elem.checked;
                layer.close(index);
                layer.msg(res.msg);
                form.render();
              }
          },500);
          }
      })
       return false; 
  })
	//isStick 是否顶
	form.on('switch(isStick)', function(data){
    var stick;
    if(data.elem.checked){
      stick=1;
    }else{
      stick=0;
    }
    var id = $(data.elem).attr('data-id');
		var index = layer.msg('修改中，请稍候',{icon: 16,time:false,shade:0.8});
    $.ajax({
      url:'/admin/news/isStick',
      type:'post',
      data:{
        id:id,
        stick:stick,
      },
      success:function(res){
          setTimeout(function(){
              if(res.code == 0 ){
                layer.close(index);
                layer.msg(res.msg);
              }else{
                data.elem.checked = !data.elem.checked;
                layer.close(index);
                layer.msg(res.msg);
                form.render();
              }
          },500);
      }
    })
    return false;
	})
 
	//操作
	// $("body").on("click",".news_edit",function(){  //编辑
	// 	layer.alert('您点击了文章编辑按钮，由于是纯静态页面，所以暂时不存在编辑内容，后期会添加，敬请谅解。。。',{icon:6, title:'文章编辑'});
	// })


	$("body").on("click",".news_del",function(){  //删除
		var _this = $(this);
		layer.confirm('确定删除此信息？',{icon:3, title:'提示信息'},function(index){
			var arr=[];
			arr.push(_this.attr('data-id'));
			removeList(arr)
		});
  })
  
  /*点击分页更新html*/
  function updateList(index){
    $.get("/api/Articles/getArticleslistall?index="+index, function(data){
      //执行加载数据的方法
      setTimeout(function(){
        top.layer.close(indexs);
        if(data.code ==0){
					dataList = data.result; //当前列表数据
          var html = renderDate(data.result);
          $(".news_content").html(html);
          $('.news_list thead input[type="checkbox"]').prop("checked",false);
          form.render();
        }
      },500);
	  })
  }
  //渲染数据
  function renderDate(data){
    var dataHtml = '';
    if(data.length != 0){
      for(var i=0;i<data.length;i++){
        dataHtml += '<tr>'
          +'<td><input type="checkbox" class="checkeds" name="checkeds" lay-skin="primary" data-id="'+data[i].id+'" lay-filter="choose"></td>'
          +'<td align="left">'+data[i].title+'</td>'
          +'<td>'+data[i].username+'</td>';
          if(data[i].state == "1"){  //是否展示
            dataHtml += '<td><input type="checkbox" lay-skin="switch" lay-text="是|否" lay-filter="isState" checked data-id="'+data[i].id+'"></td>';
          }else{
            dataHtml += '<td><input type="checkbox" lay-skin="switch" lay-text="是|否" lay-filter="isState" data-id="'+data[i].id+'"></td>';
          }
          if(data[i].recommend == "1"){  //是否推荐
            dataHtml += '<td><input type="checkbox" name="recommend" lay-skin="switch" lay-text="是|否" lay-filter="isRecommend" checked data-id="'+data[i].id+'"></td>';
          }else{
            dataHtml += '<td><input type="checkbox" name="recommend" lay-skin="switch" lay-text="是|否" lay-filter="isRecommend" data-id="'+data[i].id+'"></td>';
          }
          if(data[i].stick == "1"){  //是否顶
            dataHtml += '<td><input type="checkbox" lay-skin="switch" lay-text="是|否" lay-filter="isStick" checked data-id="'+data[i].id+'"></td>';
          }else{
            dataHtml += '<td><input type="checkbox" lay-skin="switch" lay-text="是|否" lay-filter="isStick" data-id="'+data[i].id+'"></td>';
          }
          dataHtml +='<td>'+data[i].create_time+'</td>'
          +'<td>'
        +  '<a class="layui-btn layui-btn-mini news_edit" data-id="'+data[i].id+'"><i class="iconfont icon-edit"></i> 编辑</a>'
        +  '<a class="layui-btn layui-btn-danger layui-btn-mini news_del" data-id="'+data[i].id+'"><i class="layui-icon">&#xe640;</i> 删除</a>'
            +'</td>'
          +'</tr>';
      }
    }else{
      dataHtml = '<tr><td colspan="8">暂无数据</td></tr>';
    }
    top.layer.close(indexs);
    return dataHtml;
  }
  /*初始化数据*/
	function newsList(that){
		//分页
		var nums = that.rows; //每页出现的数据量
		if(that){
			newsData = that.count; //总页数
    }
    //弹出loading
		dataList = that.result; //当前列表数据
		laypage({
			cont : "page",
			pages : Math.ceil(newsData / nums),
			jump : function(obj){
        if(one){
          one = false;
          var html = renderDate(dataList);
          $(".news_content").html(html);
          $('.news_list thead input[type="checkbox"]').prop("checked",false);
          form.render();
        }else{
          indexs = top.layer.msg('数据获取中，请稍候',{icon: 16,time:false,shade:0.8});
          updateList(obj.curr);
        }
			}
		})
	}
})
