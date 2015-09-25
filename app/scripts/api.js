// var API_URL = 'http://localhost:3000';
var API_URL = 'http://api.anorangevision.com/?api=';
var Local_Host = "http://localhost:8000";

var API_CONST = {
  user_api : {
    login : API_URL + 'User.Login',
    login_with_token : API_URL + 'User.LoginWithToken',
    register : API_URL + 'User.ReceiveTelRegister',
    sendTelRegister : API_URL + "User.SendTelRegister",
    logout : API_URL + "User.Logout",
    open_login : API_URL + "openuser.login&serviceid=openweixin&redirecturl="+Local_Host,
    current_user : API_URL + 'User.CurrentUser',
  },
  file_api : {
    getToken : API_URL + 'File.Token',
  }
}

function getRootPath_web() {
    var strFullPath=window.document.location.href; 
    var strPath=window.document.location.pathname; 
    var pos=strFullPath.indexOf(strPath); 
    var prePath=strFullPath.substring(0,pos); 
    var postPath=strPath.substring(0,strPath.substr(1).indexOf('/')+1); 
    return(prePath+postPath); 
}

module.exports = API_CONST;