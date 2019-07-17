const axios = require('axios')
const uri = '//service-hs8z83vp-1256476187.ap-shanghai.apigateway.myqcloud.com/release/'

export function post(name, data = {}) {
  return axios.post(uri + name, data)
}
