import drawQrcode from '../../../libs/weapp.qrcode.esm.js' //二维码
import methodUtil from '../../../utils/methodUtil.js'
Page({
  data: {
    isShowRuleDialog: false, //活动规则弹窗
    isShowShareDialog: false, //分享弹框
    joinCount: '709,569', //参与人数
    currentIndex: null, //当前选中的金蛋的属性id
    act: null, //选中的金蛋对应的锤子默认样式显示、灯光高亮
    actOpen: null, //选中的金蛋对应的锤子开始晃动
    daningImgOpen: null, //砸中的金蛋裂开
    isShowRecordDialog: false, //显示中奖弹窗
    count: 3, //砸蛋次数
    state: 1, //中奖状态 0表示未中奖 1表示中奖
    //中奖记录列表
    recordList: [
      /*{
      name: '王小花',
      time: '2021.05.31 14:33:45',
      level: '二等奖'
    }, {
      name: '王小花',
      time: '2021.05.31 14:33:45',
      level: '二等奖'
    }, {
      name: '王小花',
      time: '2021.05.31 14:33:45',
      level: '二等奖'
    }, {
      name: '王小花',
      time: '2021.05.31 14:33:45',
      level: '二等奖'
    }, {
      name: '王小花',
      time: '2021.05.31 14:33:45',
      level: '二等奖'
    }*/
    ],

    // ctx: null, //canvas对象
    isShowCanvasO: false,
    isShowCanvasT: true,
    isShowImg: false,
    shareImgUrl: '../../images/games/zjd/img_sharePoster.jpg', //海报底图链接
    codeImgUrl: '', //二维码图片地址
    headImgUrl: '', //头像图片地址
    posterImgUrl: '', //最后生成的海报图片地址
    //openAlbumStatus: true, // 声明一个全局变量判断是否授权保存到相册
  },
  onLoad(options) {
    //分享到朋友圈
    /* 
      分享到朋友圈原生页面可以
                webview嵌入的页面不可以
    */
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    })
  },
  //分享到朋友圈
  onShareTimeline() {
    return {
      title: '欢乐砸金蛋',
      query: '/pages/index/index',
      imageUrl: '../../images/games/zjd/fxzd-pyq.png'
    }
  },
  //用户点击右上角分享
  onShareAppMessage(options) {
    var shareObj
    //来自页面内的按钮的转发
    if (options.from === 'button') {
      console.log('=======点了按钮分享')
      var eData = options.target.dataset
      // console.log(typeof eData.id) //1
      if (eData.id == 1) {
        // 此处可以修改 shareObj 中的内容
        // shareObj = {
        //   title: '欢乐砸金蛋-按钮方式的分享',
        //   path: '/pages/index/index',
        //   imageUrl: '../../images/fxzd.png',
        // }

      }
    } else if (options.from == 'menu') {
      console.log('=======点了右上角分享')
      shareObj = {
        title: '欢乐砸金蛋-右上方菜单的分享',
        path: '/pages/index/index',
        imageUrl: '../../images/games/zjd/fxzd.png',
        // success: function (res) {
        //   //转发成功
        //   if (res.errMsg == 'shareAppMessage:ok') {

        //   }
        // },
        // fail: function () {
        //   // 转发失败之后的回调
        //   if (res.errMsg == 'shareAppMessage:fail cancel') {
        //     // 用户取消转发
        //   } else if (res.errMsg == 'shareAppMessage:fail') {
        //     // 转发失败，其中 detail message 为详细失败信息
        //   }
        // },
        // complete: function (res) {
        //   // 转发结束之后的回调（转发成不成功都会执行）
        // },
      }
    }
    return shareObj
  },
  //点击分享按钮弹出分享海报
  handleSharePoster() {
    this.setData({
      isShowRecordDialog: false,
      isShowShareDialog: true, //海报生成之后再显示弹框
    })

    //调用二维码生成方法  
    this.createQrCode()

    //调用生成海报方法
    setTimeout(() => {
      this.createPoster()
    }, 2000)
  },
  //关闭海报分享弹框
  handleCloseShare() {
    this.setData({
      //isShowCanvasT: true,
      isShowImg: false,
      isShowShareDialog: false
    })
  },
  //生成二维码并获取生成的二维码的图片地址
  createQrCode() {
    //let content = "**********"; //二维码内容
    //生成二维码(使用weapp-qrcode.js)
    // new qrCode('qrcode', {
    //   text: '个人信息',
    //   width: 160,
    //   height: 160,
    //   colorDark: "#000000",
    //   colorLight: "#ffffff",
    //   padding: 0, // 生成二维码四周自动留边宽度，不传入默认为0
    //   correctLevel: 3, // 二维码可辨识度
    //   callback: (res) => {
    //     // console.log('生成的二维码图片路径', res.path)
    //     this.setData({
    //       codeImgUrl: res.path
    //     })
    //   }
    // })
    //使用H5提供的新版本canvas-2d写法(weapp.qrcode.esm.js)
    wx.nextTick(() => {
      const query = wx.createSelectorQuery()
      query.select('#qrcode')
        .fields({
          node: true,
          size: true
        })
        .exec((res) => {
          console.log('========', res)
          const canvas = res[0].node
          // 调用方法drawQrcode生成二维码
          drawQrcode({
            canvas: canvas,
            canvasId: 'qrcode',
            width: 160,
            heihgt: 160,
            padding: 0,
            background: '#ffffff',
            foreground: '#000000',
            text: '个人二维码信息'
          })

          //获取canvas画布转成图片并返回图片地址
          wx.canvasToTempFilePath({
            canvas: canvas,
            canvasId: 'qrcode',
            success: (res) => {
              // console.log('生成的二维码图片路径', res.tempFilePath)
              this.setData({
                codeImgUrl: res.tempFilePath,
                // isShowCanvasT: false,
                // isShowCanvasO: true
              })
            },
            fail: (error) => {
              console.log(error)
            }
          })
        })
    })
  },

  //获取图片信息
  // getImgInfo(imgURL) {
  //   return new Promise(resolve => {
  //     wx.getImageInfo({
  //       src: imgURL,
  //       success: (res) => {
  //         resolve(res)
  //       }
  //     })
  //   })
  // },

  //生成海报
  createPoster() {
    let that = this
    wx.nextTick(() => {
      // let ctx = this.data.ctx
      let shareImgUrl = that.data.shareImgUrl
      let codeImgUrl = that.data.codeImgUrl
      //if (!ctx) {
      const query = wx.createSelectorQuery()
      query.select('#mycanvas')
        .fields({
          node: true,
          size: true
        })
        .exec(async (res) => {
          console.log('====mycanvas=====', res)
          const canvas = res[0].node
          const ctx = canvas.getContext('2d')

          //Canvas 画布的实际绘制宽高
          const canvasWidth = res[0].width
          const canvasHeight = res[0].height

          // const dpr = wx.getSystemInfoSync().pixelRatio //获取设备的dpi像素 2
          const dpr = wx.getWindowInfo().pixelRatio

          //初始化画布大小
          canvas.width = canvasWidth * dpr
          canvas.height = canvasHeight * dpr
          ctx.scale(dpr, dpr)

          //绘制画布底色(测试用)
          // ctx.fillStyle = "#FF0000"
          ctx.fillRect(0, 0, canvas.width, canvas.height)

          //二维码的大小、位置
          let codeurl_width = 160 * dpr //绘制的二维码宽度
          let codeurl_heigt = 160 * dpr //绘制的二维码高度
          let codeurl_x = (canvas.width - codeurl_width) / 2 //绘制的二维码在画布上的位置
          let codeurl_y = canvas.height - codeurl_heigt - (30 * dpr) //绘制的二维码在画布上的位置

          const shareImg = canvas.createImage()
          shareImg.src = shareImgUrl
          shareImg.position = 'relative'
          shareImg.zIndex = 1
          shareImg.onload = function () {
            ctx.drawImage(shareImg, 0, 0, canvas.width, canvas.height)
            //绘制二维码
            const codeImg = canvas.createImage()
            codeImg.src = codeImgUrl
            codeImg.zIndex = 3
            codeImg.onload = function () {
              ctx.drawImage(codeImg, codeurl_x, codeurl_y, codeurl_width, codeurl_heigt)
              wx.canvasToTempFilePath({
                canvas: canvas,
                canvasId: 'mycanvas',
                success: (res) => {
                  // console.log('生成的海报图片路径', res.tempFilePath)
                  that.setData({
                    // isShowCanvasO: false,
                    isShowImg: true,
                    posterImgUrl: res.tempFilePath
                  })
                },
                fail: (error) => {
                  console.log(error)
                }
              })
            }
          }
        })
      //}
    })
  },

  //保存图片的方法
  saveImageFun(imgUrl) {
    //保存中
    methodUtil.isShowLoading('保存中', 600)
    //调用保存方法
    wx.saveImageToPhotosAlbum({
      filePath: imgUrl,
      success: () => {
        //保存成功
        methodUtil.isHideLoading(60)
        methodUtil.isShowToast('海报保存成功', 'success', 2000, 0)
      },
      fail: (error) => {
        //保存失败
        methodUtil.isHideLoading(60)
        methodUtil.isShowToast('保存失败', 'none', 2000, 0)
      },
      complete: (res) => {},
    })
  },
  //用户拒绝授权后，弹框提示重新授权
  openConfirmAlbum: function (imgUrl) {
    let that = this
    wx.showModal({
      content: '检测到您没打开此小程序的定位权限，是否去设置打开？',
      confirmText: "确认",
      //cancelText: "取消",
      success: function (res) {
        if (res.cancel) {
          //点击“取消”
          wx.showToast({
            title: '拒绝授权',
            icon: 'none',
            duration: 1000
          })
        } else if (res.confirm) {
          //点击“确认”时打开设置页面
          wx.openSetting({
            success: res => {
              if (res.authSetting["scope.writePhotosAlbum"] === true) {
                //已经开启、已经授权
                this.saveImageFun(imgUrl)
              }
            },
          })
        }
      }
    });
  },
  //保存到相册
  saveImageToPhotosAlbum() {
    //获取海报图片
    const posterImgUrl = this.data.posterImgUrl
    //获取用户是否授权相册信息
    wx.getSetting({
      success: (res) => {
        console.log(res)
        if (!res.authSetting['scope.writePhotosAlbum']) {
          console.log('未授权==========')
          //如果未授权，调用权限检查接口wx.authorize
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success: () => {
              console.log('点了授权')
              this.saveImageFun(posterImgUrl)
            },
            fail: () => {
              //如果用户拒绝授权或没有授权，再次打开授权弹框
              console.log('点了拒绝')
              //弹窗提示开启相册权限
              this.openConfirmAlbum(posterImgUrl)
            }
          })
        } else {
          console.log('已授权==========')
          //如果已经授权，直接保存图片到相册
          this.saveImageFun(posterImgUrl)
        }
      }
    })
  },
  //显示隐藏活动规则
  handleRule() {
    this.setData({
      isShowRuleDialog: !this.data.isShowRuleDialog
    })
  },
  //点击当前蛋修改选中的样式
  handleSelEgg(e) {
    this.data.currentIndex = e.currentTarget.dataset.id
    this.setData({
      act: this.data.currentIndex
    })
  },
  //提示信息弹框
  handleShowToast(title) {
    wx.showToast({
      title: title,
      icon: 'none',
      duration: 2000,
      mask: true
    })
  },
  //点击砸金蛋按钮
  handleEgg() {
    let act = this.data.act
    let count = this.data.count
    if (count == 0) {
      this.handleShowToast('今天没有机会了哦')
    } else {
      if (act == null) {
        //没有选择金蛋，提示选择一个金蛋
        this.handleShowToast('请先选择一个金蛋哦')
        return false
      } else {
        this.setData({
          actOpen: this.data.currentIndex
        })
        setTimeout(() => {
          this.setData({
            act: null,
            actOpen: null,
            daningImgOpen: this.data.currentIndex
          })
        }, 1800);
        setTimeout(() => {
          this.setData({
            act: null,
            actOpen: null,
            daningImgOpen: null,
            isShowRecordDialog: true
          })
        }, 2500);
      }
      count--
      this.setData({
        count: count
      })
    }
  },
  //再来一次
  handleBegin() {
    this.setData({
      act: null,
      actOpen: null,
      daningImgOpen: null,
      isShowRecordDialog: false,
      prizeOpen: false
    })
  },
  //关闭中奖弹框
  handleCloseRecord() {
    this.setData({
      act: null,
      actOpen: null,
      daningImgOpen: null,
      isShowRecordDialog: false,
      prizeOpen: false
    })
  }
})