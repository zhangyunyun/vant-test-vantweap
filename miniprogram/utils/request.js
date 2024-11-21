/* 
   分装请求的方法
   使用Promise

   注意
      1.小程序请求的接口必须是https协议
      2. 请求接口之前要提前配置接口请求：
         第一种方法：在微信小程序后台配置request合法域名
         第二种方法：在开发者工具--详情--本地配置--勾选'不校验合法域名' 
*/
const app = getApp()

// const baseURL = 'https://接口地址:端口' //后台开发请求地址(本地环境 如：http://192.168.0.105:8080)
const baseURL = 'https://gsydweixin.com/busitransact/' //后台开发请求地址(线网环境)
// const socketHttp = "wss://*****.com/wss" //websocket后台开发请求地址

const request = (params) => {
   let url = params.url
   let data = params.data || {}
   let method = params.method
   let header = {
      /* 
         开发者服务器返回的服务器请求头，默认值
         'content-type':"application/x-www-form-urlencoded"
      */
      "Content-Type": "application/json" //默认值

   }
   //鉴权验证，获取登录之后后端返回的token，存在即在头部Authorization写token，具体的看后端需求
   //获取到后台返回的token(可以分装到方法中调用)
   // let wxUser = wx.getStorageSync("wxUser")
   // console.log('==wxUser==', wxUser)
   // if (wxUser) {
   //    let token = wxUser.tokenValue
   //    header['token'] = token
   // }

   wx.showLoading({
      title: '加载中...',
   })
   return new Promise((resolve, reject) => {
      wx.request({
         url: baseURL + url, //api url
         method: method, // get/post
         data: data, // 请求参数
         header: header, // 头部
         success: (res) => {
            //请求成功 
            if (res.statusCode < 399) {
               //判断状态码-- - errCode状态根据后端定义来判断
               if (res.data.code === 401) {
                  //token过期，重新执行登录流程
                  wx.showModal({
                     title: "提示",
                     content: "请登录",
                     showCancel: false,
                     success: res => {
                        wx.navigateTo({
                           url: "/pages/login/login",
                        })
                     }
                  })
                  //处理异常结果
                  reject(res.data)
               }
               //处理返回的结果
               resolve(res.data);
            } else {
               // 其他异常
               switch (res.statusCode) {
                  case 404:
                     wx.showToast({
                        title: '未知异常',
                        duration: 2000,
                     })
                     break;
                  default:
                     wx.showToast({
                        title: '请重试...',
                        duration: 2000,
                     })
                     break;
               }
               reject("未知错误,请稍后再试");
            }
         },
         fail: (error) => {
            console.log('===request error===', error)
            if (error.errMsg.indexOf('request:fail') !== -1) {
               wx.showToast({
                  title: '网络异常',
                  icon: "error",
                  duration: 2000
               })
            } else {
               wx.showToast({
                  title: '未知异常',
                  duration: 2000
               })
            }
            reject(error);
         },
         complete: (res) => {
            wx.hideLoading()
         }
      })
   })
}
export {
   request
}