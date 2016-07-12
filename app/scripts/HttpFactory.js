var HttpFactory = {
  post: function (url,data,success,failed) {
    //json post
    $.ajax({
      url: url,
      type: 'POST',
      dataType: 'json',
      data: data,
      timeout: 5000,
      crossDomain: true,
      xhrFields: {
        withCredentials: true,
      },
      success: success,
      error: failed,
    });
  },
  postStar: function(url, data, success, error) {
    $.ajax({
      url: url,
      type: 'POST',
      dataType: 'json',
      data: data,
      timeout: 5000,
      crossDomain: true,
      xhrFields: {
        withCredentials: true,
      },
      success: successStar,
      error: errorStar,
    });
    /**
     * 没有直接用success作为ajax.success的方法，是为了把resp.Success为false的情况抛给error处理
    **/
    function successStar(resp) {
      if(resp.Success) {
        success(resp);
      } else {
        errorStar({
          status: 200,
          code: resp.ErrorCode,
          statusText: resp.ErrorMsg,
        });
      }
    }
    /**
     * @param: error包含：
     * @param: error.status: HTTP返回的状态
     * @param: error.statusText: HTTP返回状态文本，当status为200时，这个值是ErrorMsg
     * @param: error.code: 服务器错误code，仅HTTP 200时后台接口抛错时有意义，HTTP非200的时候，使用status值
    **/
    function errorStar(errorData) {
      error({
        status: errorData.status,
        statusText: errorData.statusText,
        code: errorData.code || error.status,
      });
    }
  },
};

module.exports = HttpFactory;
