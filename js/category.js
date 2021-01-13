

//----------------------------------------统一配置------------------------------------
var baseURL = 'http://www.itcbc.com:8080';
$.ajaxPrefilter(function(option){
    //统一配置url(根路径)
    option.url = baseURL + option.url,

    //身份认证 的话 必须得写这些  token就代表身份认证的关键
    //统一设置headers
    option.headers = {
        Authorization:localStorage.getItem("token")
    },
    //统一配置complete   
    option.complete = function(xhr){
        var res = xhr.responseJSON;
            if (res && res.status == 1 && res.message === "身份认证失败!") {
                //说明token 过期了 需要重新登录   这里可以过期之后直接跳转到登录页面
                // 删除过期的token
                localStorage.removeItem("token");
                //跳转到登录页面
                location.href = "./login.html";
            }
    }
});
//----------------------------------------获取分类-----------------------------
function render () {
    $.ajax({
        //因为上面统一配置了 所以前面的不用写了 
        // url:' http://www.itcbc.com:8080/my/category/list',
        url:'/my/category/list',
        success: function(res) {
            // console.log(res);
            if (res.status === 0) {
                //成功  使用模板引擎渲染
                var str = template("tpl",res);
                $("tbody").html(str);
            }
        },
        //必须写这个请求头  否则会报 身份认证失败
        // headers: {
        //     //因为之前将token的值存储到本地中了  所以直接调用本地中的
        //     Authorization:localStorage.getItem("token"),
        // },
        // // 请求完成后触发  无论成功与否  都会触发
        // complete: function(xhr) {
        //     // console.log(xhr);
        //     var res = xhr.responseJSON;
        //     if (res && res.status == 1 && res.message === "身份认证失败!") {
        //         //说明token 过期了 需要重新登录   这里可以过期之后直接跳转到登录页面
        //         // 删除过期的token
        //         localStorage.removeItem("token");
        //         //跳转到登录页面
        //         location.href = "./login.html";
        //     }
        // }
    });
}
render(); 
//----------------------------------------删除分类-----------------------
$("tbody").on("click",".del",function(){
    var id = $(this).attr("data-id");
    //弹出框  使用layui的弹层提示
    layer.confirm('你确定删除吗?', function(index){
        //如果用户点击确定 会执行下列代码
        $.ajax({
            url:'/my/category/delete',
            data:{id:id},
            success:function(res){
                layer.msg(res.message);
                if (res.status === 0) {
                    render();
                }
            },
            // headers:{
            //     Authorization:localStorage.getItem("token"),
            // },
            // complete: function(xhr){
            //     var res = xhr.responseJSON;
            //     if (res && res.status === 1 && res.message ==="身份认证失败!") {
            //         localStorage.removeItem("token");
            //         location.href = "./login.html";
            //     }
            // }
        });
        //关闭弹层
        layer.close(index);
      }); 
   
    
})
//---------------------------------------添加分类------------------------------------
var index;
$("button:contains('添加')").on("click",function(){
    index = layer.open({
        content: 'test',
        title:'添加类别',
        type:1,
        //弹层的内容 创建模版 获取模版中的html
        content:$("#tpl-add").html(),
        area:['500px','250px'],
      });
})
//------------------------------------表单提交---------------------------
$("body").on("submit",".add",function(e){
    //阻止默认跳转行为
    e.preventDefault();
    var data = $(this).serialize();
    //收集表单数据
    $.ajax({
        type:"POST",
        url:'/my/category/add',
        data:data,
        success:function(res){
            //提示信息
            layer.msg(res.message);
            
            if (res.status === 0) {
                render();
                //当添加成功以后关闭弹层
                layer.close(index);
            }
        }
    });
})
//---------------------------------------修改分类---------
var editIndex;
//点击编辑  出现弹层
/*怎样才能将页面中的内容值给弹层中的input中value呢？
 1.给编辑按钮添加自定义属性  data-id="item.id" data-name="item.name" data-alias="item.alias"
 2.获取自定义的值
 3.将获取到的值给input中的value
*/
$("body").on("click","button:contains('编辑')",function(){
    var shuju = $(this).data();  //jQuery的data方法  不传入参数 表示获取所有自定义属性的值
    // console.log(shuju);  // {alias: "music", name: "音乐", id: 243}
    editIndex = layer.open({
        content: 'test',
        title:'编辑类别',
        type:1,
        //弹层的内容 创建模版 获取模版中的html
        content:$("#tpl-edit").html(),
        area:['500px','250px'],
        //弹层后调用下面的函数
        success: function(){
            //完成数据回填
            $(".edit input[name=name]").val(shuju.name);
            $(".edit input[name=alias]").val(shuju.alias);
            $(".edit input[name=id]").val(shuju.id);
        }
      });

});
//表单提交  完成修改
$("body").on("submit",".edit",function(e){
    e.preventDefault();
    var data = $(this).serialize();
    $.ajax({
        type:"POST",
        data:data,
        url:'/my/category/update',
        success: function(res){
            layer.msg(res.message);
            if (res.status === 0) {
                render();
                layer.close(editIndex);
            }
        }
    });
})