var HttpFactory = {
  option : 'jsonp',
  //封装post方法应对目前测试环境的跨域访问
  post : function (url,data,success,failed) {
    if(this.option == 'jsonp'){
      //jsonp post
      $.ajax({
        async : false,
        url : url,
        dataType : 'jsonp',
        data : data,
        timeout : 5000,
        success : success,
        error : failed,
      });
    }else{
      //普通post
      $.post(url,data).then(success,failed);
    }
  }
}

module.exports = HttpFactory;