// pages/phoneLogin/phoneLogin.js
import secretUtil from '../../utils/secretUtil'
import methodUtil from '../../utils/methodUtil'
import {
  reqVerify,
  reqLogin
} from '../../api/index'
Page({
  data: {
    is: false,
    code: '', //wx.login登录微信小程序服务器,微信小程序服务器返回一个code码

    phoneCloseIsShow: false,
    verifyCloseIsShow: false,
    phoneNum: '',
    verifyNum: '',
    verifyCurIsShow: false,
    verifyDisabled: false,
    verifyDesc: '获取验证码',
    count: 60,
    timer: null,

    isShow: false,
    verifyPuzzle: null
  },

  onLoad(options) {
    wx.login({
      success: res => {
        this.setData({
          code: res.code
        });
      }
    });
  },

  onReady: function () {
    wx.nextTick(() => {
      this.puzzleVerify = this.selectComponent("#puzzleVerify")

      // this.puzzleVerify.canvasInit()
    })
  },

  getPhoneNum(e) {
    let phoneNum = e.detail.value
    let phoneNumLen = phoneNum.length
    this.setData({
      phoneNum
    })
    if (phoneNumLen > 0) {
      this.setData({
        phoneCloseIsShow: true
      })
    } else {
      this.setData({
        phoneCloseIsShow: true
      })
    }

    if (phoneNumLen == 11) {
      this.setData({
        verifyCurIsShow: true
      })
    }
  },

  getVerifyNum(e) {
    let verifyNum = e.detail.value
    let verifyNumLen = verifyNum.length
    this.setData({
      verifyNum
    })
    if (verifyNumLen > 0) {
      this.setData({
        verifyCloseIsShow: true
      })
    } else {
      this.setData({
        verifyCloseIsShow: false
      })
    }

    setTimeout(() => {
      if (verifyNumLen == 6) {
        if (this.data.verifyPuzzle == null) {
          this.handleShow()
        }
      }
    }, 1000);
  },

  //倒计时
  timeDown() {
    let count = this.data.count
    clearInterval(this.data.timer)
    this.data.timer = setInterval(() => {
      if (count <= 0) {
        this.setData({
          verifyDesc: '获取验证码',
          verifyDisabled: false,
          verifyCurIsShow: false
        })
        count = 60
        clearInterval(timer)
      } else {
        count--
        this.setData({
          verifyDesc: count + 's后重试',
          verifyDisabled: true
        })
      }
    }, 1000)
  },

  checkPhoneNum() {
    let phoneReg = /^1[3456789]\d{9}$/ //验证手机号码正则
    let phoneNum = this.data.phoneNum
    if (!methodUtil.isEmpty(phoneNum)) {
      wx.toast({
        title: '手机号码不能为空',
        icon: 'none',
        duration: 1000
      })
      return
    } else if (!phoneReg.test(phoneNum)) {
      wx.toast({
        title: '请输入移动手机号码',
        icon: 'none',
        duration: 1000
      })
      return
    }
    return phoneNum
  },

  checkVerifyNum() {
    let verifyNum = this.data.verifyNum
    if (!methodUtil.isEmpty(verifyNum)) {
      wx.toast({
        title: '验证码不能为空',
        icon: 'none',
        duration: 1000
      })
      return
    } else if (verifyNum.length < 6) {
      wx.toast({
        title: '验证码至少6位',
        icon: 'none',
        duration: 1000
      })
      return
    }
    return verifyNum
  },

  //获取验证码
  async getCodeNum() {
    let phoneNum = this.checkPhoneNum()
    if (!phoneNum) {
      return
    }
    //收集参数
    const datas = {
      "phoneNo": secretUtil.Encrypt(phoneNum),
      "appid": "wx2fe9401e529192d7"
    }
    //调用发送验证码请求接口，获取验证码
    const result = await reqVerify(datas)
    if (result.respcode == 0) {
      //倒计时
      this.timeDown()
      //提示短信发送成功
      wx.showToast({
        title: '短信发送成功',
        icon: 'none',
        duration: 1000
      })
      wx.login({
        success: res => {
          this.setData({
            code: res.code
          });
        }
      });
      this.setData({
        verifyCurIsShow: false
      })
    } else {
      this.setData({
        verifyCurIsShow: false
      })
    }
  },

  //清空手机号码
  clearPhone() {
    this.setData({
      phoneNum: ''
    })
  },

  //清空验证码
  clearCode() {
    this.setData({
      verifyNum: ''
    })
  },

  //滑块验证是否成功操作
  handlePuzzleVerify(e) {
    let puzzle = e.detail.puzzle
    let isShow = e.detail.isShow
    this.setData({
      verifyPuzzle: puzzle,
      isShow: isShow
    })
  },

  //显示滑块验证
  handleShow() {
    this.setData({
      isShow: true
    })
    this.puzzleVerify.canvasInit()
  },

  //关闭滑块验证
  handleClose() {
    this.setData({
      isShow: false
    })
    this.puzzleVerify.canvasInit()
  },

  //登录
  async handleSubmit() {
    // if (this.data.verifyPuzzle == null || this.data.verifyPuzzle === false) {
    //   this.handleShow()
    //   return false
    // }
    let phoneNum = this.checkPhoneNum()
    if (!phoneNum) {
      return false
    }
    let verifyNum = this.checkVerifyNum()
    if (!verifyNum) {
      return false
    }
    console.log(this.data.code)
    const params = {
      // "verifyPuzzle": this.data.verifyPuzzle,
      "phoneNo": secretUtil.Encrypt(phoneNum),
      "verifyCode": secretUtil.Encrypt(verifyNum),
      "code": this.data.code,
      "appid": "wx2fe9401e529192d7"
    }
    //调用登录请求接口 登录
    const result = await reqLogin(params)
    console.log('==登录==', result)
    clearInterval(this.data.timer)
    //登录成功后跳转到我的页面
    // wx.switchTab({
    //   url: '/pages/mine/mine?param=' + param,
    // })
  }
})