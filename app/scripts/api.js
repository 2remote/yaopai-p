// var API_URL = 'http://localhost:3000';
var API_URL = 'http://yaopai1.chinacloudapp.cn/api/?api=';

var API_CONST = {
  user_api : {
    login : API_URL + 'User.Login',
    login_with_token : API_URL + 'User.LoginWithToken',
    register : API_URL + 'User.ReceiveTelRegister',
    sendTelRegister : API_URL + "User.SendTelRegister",
    logout : API_URL + "User.Logout"

  }
}

module.exports = API_CONST;