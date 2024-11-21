// pages/login/login.js
import methodUtil from '../../utils/methodUtil'
Page({
  data: {
    isShowAgree: false,
    radioChecked: false,
    radioCheckVal: 0 //协议选中未选中值
  },

  onLoad(options) {

  },

  handleChange(e) {
    let val = e.detail.value
    this.setData({
      radioCheckVal: val
    })
  },

  handleTap(e) {
    let radioChecked = this.data.radioChecked
    this.setData({
      radioChecked: !radioChecked
    })
    let check = this.data.radioChecked
    if (check == false) {
      this.setData({
        radioCheckVal: 0,
      })
    }
    if (check == true) {
      this.setData({
        radioCheckVal: 1,
        isShowAgree: false
      })
    }
  },

  checkAgree() {
    let radioChecked = this.data.radioChecked
    if (radioChecked == false) {
      //提示未选中
      this.setData({
        isShowAgree: true
      })
      return false
    }
    return radioChecked
  },

  loginQuick() {
    let checkAgree = this.checkAgree()
    if (!checkAgree) {
      return false
    }
  },

  loginOther() {
    let checkAgree = this.checkAgree()
    if (!checkAgree) {
      return false
    }
    wx.navigateTo({
      url: '/pages/phoneLogin/phoneLogin'
    })
  }
})