/* 
  公共的方法
*/
//加载提示
function isShowLoading(title, time) {
  setTimeout(function () {
    wx.showLoading({
      title: title,
    })
  }, time)
}

function isHideLoading(time) {
  setTimeout(function () {
    wx.hideLoading()
  }, time)
}

//toast提示
// function isShowToast(title, icon, duration) {
//   wx.showToast({
//     title: title,
//     icon: icon,
//     duration: duration
//     // duration: !duration ? duration || 0
//   })
// }
// extends.js
// 设置默认参数
const toast = ({
  title = '数据加载中...',
  icon = 'none',
  duration = 2000,
  mask = true
} = {}) => {
  wx.showToast({
    title,
    icon,
    duration,
    mask
  })
}
// 将封装的模块挂载到 wx 全局对象身上
wx.toast = toast


//是否为空
function isEmpty(obj) {
  if (obj == '' || obj == undefined || obj == null) {
    return false
  }
  return true
}


export default {
  isShowLoading,
  isHideLoading,
  // isShowToast,
  isEmpty
}