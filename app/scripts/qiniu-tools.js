var QiniuTools = {
  putb64 : function (token,data,success,failed) {
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
  }
}

module.exports = QiniuTools;