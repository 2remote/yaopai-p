const API_DEV_SERVER = '//dev.api.aiyaopai.com/'
const API_PRODUCTION_SERVER = '//api.aiyaopai.com/'

function isProduction(host) { // 只在url里包含yaopai且不包含dev的时候，才使用正式环境
  const devReg = /dev/i
  const hostReg = /yaopai/i
  return (!host.match(devReg)) && host.match(hostReg)
}

const apiHost = isProduction(window.location.host) ?
  API_PRODUCTION_SERVER : API_DEV_SERVER

const apiServer = `${apiHost}?api=`

export default apiServer // temporary

export { apiServer }
