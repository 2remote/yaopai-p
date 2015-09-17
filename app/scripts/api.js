// var API_URL = 'http://localhost:3000';
var API_URL = 'http://yaopai.chinacloudapp.cn/api/?api=';

var API_CONST = {
  user_api : {
    login : API_URL + 'User.Login',
    register : API_URL + 'User.ReceiveTelRegister',
    sendTelRegister : API_URL + "User.SendTelRegister",
    logout : API_URL + "User.Logout"

  }
}

module.exports = API_CONST;