// var API_URL = 'http://localhost:3000';
var API_URL = 'http://api.anorangevision.com/?api=';
var Local_Host = getRootPath_web();

var API_CONST = {
  user_api : {
    login : API_URL + 'User.Login',
    login_with_token : API_URL + 'User.LoginWithToken',
    register : API_URL + 'User.ReceiveTelRegister',
    sendTelRegister : API_URL + "User.SendTelRegister",
    logout : API_URL + "User.Logout",
    open_login : API_URL + "openuser.login&serviceid=openweixin&redirecturl="+Local_Host,
    current_user : API_URL + 'User.CurrentUser',

  }
}

function getRootPath_web() {
    //获取当前网址，如： http://localhost:8083/uimcardprj/share/meun.jsp
    var curWwwPath = window.document.location.href;
    var pos = curWwwPath.indexOf("#");
    //获取主机地址，如： http://localhost:8000
    var localhostPath = curWwwPath.substring(0, pos);
    return localhostPath ;
}

module.exports = API_CONST;