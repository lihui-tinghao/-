//登录功能
//找到表单  注册submit事件 
  $(".login-form").on("submit", function (e) {
      //阻止默认行为
      e.preventDefault();
      var data = $(this).serialize(); //获取表单中的所有数据
      $.ajax({
          type:"POST",
          url:" http://www.itcbc.com:8080/api/login",
          data: data,  //请求体参数
          success: function(res){
            console.log(res);

            //无论成功或失败 都要有个提示
            layer.msg(res.message);
            if (res.status === 0) {
              //登录成功后，马上把token保存到本地存储中
              localStorage.setItem("token",res.token);
                //登录成功跳转页面
                location.href = "./category.html";
            }
          },
          //失败后触发  xhr 是这个方法中必须写的
          error:function(xhr) {
            var res = xhr.responseJSON;
            if (res && res.status === 1) {
              layer.msg(res.message);
            }
          }
      });
    });