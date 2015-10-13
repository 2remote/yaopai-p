// var API_URL = 'http://localhost:3000';
var API_URL = 'http://api.anorangevision.com/?api=';
var Local_Host = "http://localhost:8000";

var API_CONST = {
  USER : {
    login : API_URL + 'User.Login',
    login_with_token : API_URL + 'User.LoginWithToken',
    register : API_URL + 'User.ReceiveTelRegister',
    sendTelRegister : API_URL + "User.SendTelRegister",
    modify_password : API_URL + 'User.ChangePassword',
    logout : API_URL + "User.Logout",
    open_login : API_URL + "openuser.login&serviceid=openweixin&redirecturl="+Local_Host,
    current_user : API_URL + 'User.CurrentUser',
    currentUserDetail : API_URL + 'User.CurrentUserDetail',
    changeAvatar : API_URL + 'User.ChangeAvatar',
    updateInfo : API_URL + 'User.ChangeInfo',
  },
  PHOTOGRAPHER :{
    submitAudit : API_URL + 'Photographer.SubmitAudit',
    viewAudit : API_URL + 'Photographer.ViewAudit',
  },
  ALBUMS : {
    add : API_URL + 'Albums.Add',
    update : API_URL + 'Albums.Update',
    delete : API_URL + 'Albums.Delete',
    get : API_URL + 'Albums.Get',
    search : API_URL + 'Albums.Search',
    categories : API_URL + 'AlbumsCategory.Search',
    offSale : API_URL + 'Albums.SalesOff',
    onSale : API_URL + 'Albums.SalesOn'
  },

  FILE : {
    getToken : API_URL + 'File.Token',
    user_token_url : 'http://api.anorangevision.com/file/token?type=user',
    work_token_url : 'http://api.anorangevision.com/file/token?type=work',
  },
  COMMON : {
    area_list : API_URL + 'Area.List',
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