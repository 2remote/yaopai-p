import Reflux from 'reflux'
import { postStar } from '../../HttpFactory'
import { USER } from '../../api'

/**
 * login:
**/
const UserAccountAction = Reflux.createActions({
  login: { children: [ 'success', 'error' ]},
})

UserAccountAction.login.listen(function(loginData) {
  postStar(USER.LOGIN, {

  }, function(resp) {

  }, function(error) {

  })
})

export default UserAccountAction
