layui.config({
  base: "js/"
}).use(['form', 'layer', 'jquery', 'laypage'], function () {
  var form = layui.form(),
    layer = parent.layer === undefined ? layui.layer : parent.layer,
    laypage = layui.laypage,
    $ = layui.jquery,
    dataList,
    one = true;

  //加载页面数据
  var linksData = '';
  $.ajax({
    url: "/api/Category/getCategorylistall",
    type: "get",
    dataType: "json",
    success: function (data) {
      linksData = data;
      //执行加载数据的方法
      linksList(linksData);
    }
  })


  //添加分类
  $(".linksAdd_btn").click(function () {
    var index = layui.layer.open({
      title: "添加分类",
      type: 2,
      content: "categoryAdd/add",
      success: function (layero, index) {
        setTimeout(function () {
          layui.layer.tips('点击此处返回友链列表', '.layui-layer-setwin .layui-layer-close', {
            tips: 3
          });
        }, 500)
      }
    })
    //改变窗口大小时，重置弹窗的高度，防止超出可视区域（如F12调出debug的操作）
    $(window).resize(function () {
      layui.layer.full(index);
    })
    layui.layer.full(index);
  })
 
  //isState 是否展示
  form.on('switch(isState)', function (data) {
    var state;
    if (data.elem.checked) {
      state = 1;
    } else {
      state = 0;
    }
    var id = $(data.elem).attr('data-id');
    var index = layer.msg('修改中，请稍候', {
      icon: 16,
      time: false,
      shade: 0.8
    });
    $.ajax({
      url: '/admin/category/isState',
      type: 'post',
      data: {
        id: id,
        state: state
      },
      success: function (res) {
        setTimeout(function () {
          if (res.code == 0) {
            layer.close(index);
            layer.msg(res.msg);
          } else {
            data.elem.checked = !data.elem.checked;
            layer.close(index);
            layer.msg(res.msg);
            form.render();
          }
        }, 500);
      }
    })
    return false;
  })
  //操作
  $("body").on("click", ".links_edit", function () { //编辑
    var id = $(this).attr('data-id');
    var index = layui.layer.open({
      title: "修改分类",
      type: 2,
      content: "categoryAdd/" + id,
      success: function (layero, index) {
        setTimeout(function () {
          layui.layer.tips('点击此处返回友链列表', '.layui-layer-setwin .layui-layer-close', {
            tips: 3
          });
        }, 500)
      }
    })
    //改变窗口大小时，重置弹窗的高度，防止超出可视区域（如F12调出debug的操作）
    $(window).resize(function () {
      layui.layer.full(index);
    })
    layui.layer.full(index);
  })

  //获取数据
  function getDataList(index) {
    $.ajax({
      url: "/api/Category/getCategorylistall",
      type: "get",
      data: {
        index: index
      },
      dataType: "json",
      success: function (data) {
        setTimeout(function () {
          linksData = data;
          $(".links_content").html(renderDate(linksData.result));
          form.render();
          top.layer.close(indexs);
        }, 500)
      }
    })
  }

  //渲染数据
  function renderDate(currData) {
    var dataHtml = '';
    if (currData.length != 0) {
      for (var i = 0; i < currData.length; i++) {
        dataHtml += '<tr>' +
          '<td>'+ currData[i].id+'</td>' +
          '<td align="left">' + currData[i].category_text + '</td>' +
          '<td>' + currData[i].create_time + '</td>'
        if (currData[i].state == "1") { //是否展示
          dataHtml += '<td><input type="checkbox" lay-skin="switch" lay-text="是|否" lay-filter="isState" checked data-id="' + currData[i].id + '"></td>';
        } else {
          dataHtml += '<td><input type="checkbox" lay-skin="switch" lay-text="是|否" lay-filter="isState" data-id="' + currData[i].id + '"></td>';
        }
        dataHtml += '<td>' +
          '<a class="layui-btn layui-btn-mini links_edit" data-id="' + currData[i].id + '"><i class="iconfont icon-edit"></i> 编辑</a>' +
          '</td>' +
          '</tr>';
      }
    } else {
      dataHtml = '<tr><td colspan="7">暂无数据</td></tr>';
    }
    return dataHtml;
  }
  /*初始化*/
  function linksList(that) {
    //分页
    var nums = that.rows; //每页出现的数据量
    if (that) {
      linksData = that;
    }
    laypage({
      cont: "page",
      pages: Math.ceil(linksData.count / nums),
      jump: function (obj) {
        if (one) {
          one = false;
          $(".links_content").html(renderDate(linksData.result));
          form.render();
        } else {
          indexs = top.layer.msg('数据获取中，请稍候', {
            icon: 16,
            time: false,
            shade: 0.8
          });
          getDataList(obj.curr);
        }
      }
    })
  }
})