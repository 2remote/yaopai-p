// var async = require('async');
// var  SmartCrop = require('smartcrop');
var Tools = {
  'qiniu-putb64' : function (token,data,success,failed) {
    $.ajax({
      type:'POST',
      contentType:"application/octet-stream",
      cache:false,
      url: 'http://up.qiniu.com/putb64/-1',
      processData: false,
      data: data,
      headers: {"Authorization": "UpToken "+token,'Content-Type':'image/png'},
      success : success,
      error : failed,
    });
  },
}

/*
 * attachData作为Tool要解决的情况是：
 * 某些接口提交数据后，服务器返回成功，这些提交的数据扔需保存到Store中（但是后台没返回来）
 * 注：这个方法暂时只支持1个arg到2个arg的情况，如果以后有需要，可以做成展开的形式
 */
Tools.attachData = function(originalFunc, data) {
  return function(resp) {
    originalFunc(resp, data);
  };
};

module.exports = Tools;
