var API_URL = 'http://localhost:3000';
var API_CONST = {
  user_api : {
    login_url : API_URL + '/login',
    register_url : API_URL + '/register',
    sendTelRegister : API_URL + "/sendTelRegister"
  }
}

module.exports = API_CONST;