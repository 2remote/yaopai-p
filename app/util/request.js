import $ from 'jquery'

/**
 * Request is a light wrapper around jQuery ajax.
 * @param: url: url to send the request
 * @param: data: data to send
 * @param: success: callback for success
 * @param: error: callback for error
**/
const request = (url, data, success = () => {}, error = () => {}) => {
  /**
   * @param: error包含：
   * @param: error.status: HTTP返回的状态
   * @param: error.statusText: HTTP返回状态文本，当status为200时，这个值是ErrorMsg
   * @param: error.code: 服务器错误code，仅HTTP 200时后台接口抛错时有意义，HTTP非200的时候，使用status值
  **/
  const errorHandler = (errorData) => {
    error({
      status: errorData.status,
      statusText: errorData.statusText,
      code: errorData.code || error.status,
    })
  }
  /**
   * 没有直接用success作为ajax.success的方法，是为了把resp.Success为false的情况抛给error处理
  **/
  const successHandler = (resp) => {
    if (resp.Success) success(resp)
    else errorHandler({ status: 200, code: resp.ErrorCode, statusText: resp.ErrorMsg })
  }

  $.ajax({
    url,
    type: 'POST',
    dataType: 'json',
    data,
    timeout: 5000,
    crossDomain: true,
    xhrFields: { withCredentials: true },
    success: successHandler,
    error: errorHandler,
  })
}

export default request
