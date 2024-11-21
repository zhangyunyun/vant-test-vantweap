/* 
  定义请求接口函数 
  包含n多个函数请求模块
  返回值是 promise对象
*/
import {
  request
} from '../utils/request.js'

//测试
export const reqBanner = (params) => {
  return request({
    url: 'api/index/getBannerList',
    data: params,
    method: 'GET',
  })
}

//获取验证码
export const reqVerify = (params) => {
  return request({
    url: 'loginApi/wxLogin/sendVerifyCode',
    data: params,
    method: 'POST',
  })
}
//登录
export const reqLogin = (params) => {
  return request({
    url: 'loginApi/wxLogin/login',
    data: params,
    method: 'POST'
  })
}