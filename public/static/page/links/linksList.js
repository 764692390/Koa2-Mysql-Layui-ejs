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
    url: "/api/Links/getLinkslistall",
    type: "get",
    dataType: "json",
    success: function (data) {
      linksData = data;
      //执行加载数据的方法
      linksList(linksData);
    }
  })

  //查询
  $(".search_btn").click(function () {
    return false;
    var newArray = [];
    if ($(".search_input").val() != '') {
      var index = layer.msg('查询中，请稍候', {
        icon: 16,
        time: false,
        shade: 0.8
      });
      setTimeout(function () {
        $.ajax({
          url: "../../json/linksList.json",
          type: "get",
          dataType: "json",
          success: function (data) {
            if (window.sessionStorage.getItem("addLinks")) {
              var addLinks = window.sessionStorage.getItem("addLinks");
              linksData = JSON.parse(addLinks).concat(data);
            } else {
              linksData = data;
            }
            for (var i = 0; i < linksData.length; i++) {
              var linksStr = linksData[i];
              var selectStr = $(".search_input").val();

              function changeStr(data) {
                var dataStr = '';
                var showNum = data.split(eval("/" + selectStr + "/ig")).length - 1;
                if (showNum > 1) {
                  for (var j = 0; j < showNum; j++) {
                    dataStr += data.split(eval("/" + selectStr + "/ig"))[j] + "<i style='color:#03c339;font-weight:bold;'>" + selectStr + "</i>";
                  }
                  dataStr += data.split(eval("/" + selectStr + "/ig"))[showNum];
                  return dataStr;
                } else {
                  dataStr = data.split(eval("/" + selectStr + "/ig"))[0] + "<i style='color:#03c339;font-weight:bold;'>" + selectStr + "</i>" + data.split(eval("/" + selectStr + "/ig"))[1];
                  return dataStr;
                }
              }
              //网站名称
              if (linksStr.linksName.indexOf(selectStr) > -1) {
                linksStr["linksName"] = changeStr(linksStr.linksName);
              }
              //网站地址
              if (linksStr.linksUrl.indexOf(selectStr) > -1) {
                linksStr["linksUrl"] = changeStr(linksStr.linksUrl);
              }
              //
              if (linksStr.showAddress.indexOf(selectStr) > -1) {
                linksStr["showAddress"] = changeStr(linksStr.showAddress);
              }
              if (linksStr.linksName.indexOf(selectStr) > -1 || linksStr.linksUrl.indexOf(selectStr) > -1 || linksStr.showAddress.indexOf(selectStr) > -1) {
                newArray.push(linksStr);
              }
            }
            linksData = newArray;
            linksList(linksData);
          }
        })

        layer.close(index);
      }, 2000);
    } else {
      layer.msg("请输入需要查询的内容");
    }
  })

  //添加友情链接
  $(".linksAdd_btn").click(function () {
    var index = layui.layer.open({
      title: "添加友情链接",
      type: 2,
      content: "linksAdd/add",
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

  /*删除友情链接 批量和单个删除 */
  function removeList(arrid) {
    var index = layer.msg('删除中，请稍候', {
      icon: 16,
      time: false,
      shade: 0.8
    });
    //批量删除友情链接
    $.ajax({
      url: '/admin/links/delAll',
      type: 'post',
      data: {
        id: arrid,
      },
      success: function (res) {
        setTimeout(function () {
          if (res.code == 0) {
            layer.close(index);
            window.location.reload();
          } else {
            layer.close(index);
            layer.msg(res.msg);
          }
        }, 500);
      }
    })
  }

  //批量删除
  $(".batchDel").click(function () {
    var $checkbox = $('.links_list tbody input.checkeds[type="checkbox"]');
    var $checked = $('.links_list tbody input.checkeds[type="checkbox"]:checked');
    var arrid = [];
    if ($checkbox.is(":checked")) {
      layer.confirm('确定删除选中的信息？', {
        icon: 3,
        title: '提示信息'
      }, function (index) {
        for (var i = 0; i < $checked.length; i++) {
          var id = $checked.eq(i).attr('data-id');
          arrid.push(id);
        }
        removeList(arrid)
      })
    } else {
      layer.msg("请选择需要删除的文章");
    }
  })

  //全选
  form.on('checkbox(allChoose)', function (data) {
    var child = $(data.elem).parents('table').find('tbody tr').find('td input[name="checkeds"]');
    child.each(function (index, item) {
      item.checked = data.elem.checked;
    });
    form.render('checkbox');
  });

  //通过判断文章是否全部选中来确定全选按钮是否选中
  form.on("checkbox(choose)", function (data) {
    var child = $(data.elem).parents('table').find('tbody input.checkeds[type="checkbox"]');
    var childChecked = $(data.elem).parents('table').find('tbody input.checkeds[type="checkbox"]:checked')
    data.elem.checked;
    if (childChecked.length != 0) {
      $(data.elem).parents('table').find('thead input#allChoose').get(0).checked = true;
    } else {
      $(data.elem).parents('table').find('thead input#allChoose').get(0).checked = false;
    }
    form.render('checkbox');
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
      url: '/admin/links/isState',
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
      title: "修改友情链接",
      type: 2,
      content: "linksAdd/" + id,
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

  $("body").on("click", ".links_del", function () { //删除
    var _this = $(this);
    layer.confirm('确定删除此信息？', {
      icon: 3,
      title: '提示信息'
    }, function (index) {
      var id = _this.attr("data-id");
      var arrid = [id];
      removeList(arrid)
      layer.close(index);
    });
  })
  //获取数据
  function getDataList(index) {
    $.ajax({
      url: "/api/Links/getLinkslistall",
      type: "get",
      data: {
        index: index
      },
      dataType: "json",
      success: function (data) {
        setTimeout(function () {
          linksData = data;
          $(".links_content").html(renderDate(linksData.result));
          $('.links_list thead input[type="checkbox"]').prop("checked", false);
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
          '<td><input type="checkbox" name="checkeds" class="checkeds" lay-skin="primary" data-id="' + currData[i].id + '" lay-filter="choose"></td>' +
          '<td align="left">' + currData[i].webname + '</td>' +
          '<td><a style="color:#1E9FFF;" target="_blank" href="' + currData[i].url + '">' + currData[i].url + '</a></td>' +
          '<td>' + currData[i].email + '</td>' +
          '<td>' + currData[i].create_time + '</td>'
        if (currData[i].state == "1") { //是否展示
          dataHtml += '<td><input type="checkbox" lay-skin="switch" lay-text="是|否" lay-filter="isState" checked data-id="' + currData[i].id + '"></td>';
        } else {
          dataHtml += '<td><input type="checkbox" lay-skin="switch" lay-text="是|否" lay-filter="isState" data-id="' + currData[i].id + '"></td>';
        }
        dataHtml += '<td>' +
          '<a class="layui-btn layui-btn-mini links_edit" data-id="' + currData[i].id + '"><i class="iconfont icon-edit"></i> 编辑</a>' +
          '<a class="layui-btn layui-btn-danger layui-btn-mini links_del" data-id="' + currData[i].id + '"><i class="layui-icon">&#xe640;</i> 删除</a>' +
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
          $('.links_list thead input[type="checkbox"]').prop("checked", false);
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