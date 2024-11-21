import amapFile from '../../lib/amap-wx.js' //高德地图
// import QQMapWX from '../../libs/qqmap-wx-jssdk.js' //腾讯地图
import methodUtil from '../../utils/methodUtil.js' //公用方法
import {
  gaodeKey
} from '../../utils/constants.js'

import {
  reqBanner
} from '../../api/index' //接口请求

//腾讯地图
// const qqmapsdk = new QQMapWX({
//   key: tentectKey
// })

//高德地图
let amapFileFun = new amapFile.AMapWX({
  key: gaodeKey
})

const app = getApp()
Page({
  data: {
    cityInfo: null,
    posName: '', //当前位置的名称
    posDistance: '', //当前距离

    indicatorDots: false,
    autoplay: true,
    circular: true,
    interval: 2000,
    duration: 500,
    bannerList: [], //轮播图列表

    navList: [], //导航列表
    noticeList: [], //公告列表

    shopList: [], //商家列表
    shopTabList: [],
    shopPanelList: [],
    currentIndex: 0,

    testList: [] //测试请求数据
  },
  onLoad(options) {
    methodUtil.isShowLoading('加载中...', 0)

    //setTimeout(() => {
    //调用当前定位方法
    this.getAuthorizeFun()
    //获取模拟的数据
    this.getMockData()
    //获取测试数据testList
    this.getTestList()
    //}, 1500)

    methodUtil.isHideLoading(3000)
  },

  //获取当前地理位置
  getLocalFun(locationString) {
    //腾讯地图(正确代码)
    // qqmapsdk.reverseGeocoder({
    //   location: locationString,
    //   get_poi: 1,
    //   success: res => {
    //     console.log('逆解析地址转换', res)
    //     let cityInfo = res.result
    //     let posName = cityInfo.address
    //     // let markers = []
    //     // const poisList = res.result.pois.map(item => {
    //     //   return {
    //     //     id: item.id,
    //     //     title: item.title,
    //     //     address: item.address
    //     //   }
    //     // })
    //     // markers.push({
    //     //   title: res.result.address_reference.landmark_l2.title,
    //     //   id: 0,
    //     //   latitude: latitude,
    //     //   longitude: longitude,
    //     //   iconPath: '../../images/ico_position-current.png', //图标路径
    //     //   width: 26,
    //     //   height: 36,
    //     //   poisList: poisList
    //     // })
    //     this.setData({
    //       cityInfo,
    //       posName //当前位置名称
    //     })
    //   },

    //   fail: function (error) {
    //     console.log(error)
    //   }
    // })

    //高德地图
    amapFileFun.getRegeo({
      location: locationString,
      success: res => {
        console.log('获取到坐标信息', res)
        let cityInfo = res
        let posName = cityInfo[0].desc
        let latitude = cityInfo[0].latitude
        let longitude = cityInfo[0].longitude
        this.setData({
          cityInfo,
          posName,
          latitude,
          longitude
        })
      },
      fail: function (info) {
        //失败回调
        console.log('获取到坐标信息失败', info)
      }
    })
  },

  //微信获得经纬度
  getLocationFun() {
    wx.getLocation({
      type: "gcj02", //wgs84 gcj02
      success: res => {
        console.log('获取纬度经度', res)
        let locationString = res.longitude + ',' + res.latitude; //格式为'经度,纬度'
        this.getLocalFun(locationString)
      }
    })
  },

  //未授权弹框
  openConfirmLocation() {
    let that = this
    //处理错误 没有开定位权限的处理
    wx.showModal({
      title: '请求授权当前位置',
      content: '需要获取您的地理位置，请确认授权',
      success: function (res) {
        if (res.cancel) {
          wx.showToast({
            title: '拒绝授权',
            icon: 'none',
            duration: 1000
          })
        } else if (res.confirm) {
          console.log('====点了授权===')
          wx.openSetting({
            success: function (dataAu) {
              if (dataAu.authSetting["scope.userLocation"] == true) {
                // wx.showToast({
                //   title: '授权成功',
                //   icon: 'success',
                //   duration: 1000
                // })
                //再次授权，调用wx.getLocation的API
                that.getLocationFun()
              } else {
                wx.showToast({
                  title: '授权失败',
                  icon: 'none',
                  duration: 1000
                })
              }
            }
          })
        }
      }
    })
  },

  //授权 调用获取经纬度方法
  getAuthorizeFun() {
    wx.getSetting({
      success: res => {
        // res.authSetting['scope.userLocation'] == undefined //表示 初始化进入该页面
        // res.authSetting['scope.userLocation'] == false //表示 非初始化进入该页面, 且未授权
        // res.authSetting['scope.userLocation'] == true //表示 地理位置授权
        if (res.authSetting['scope.userLocation'] == true) {
          //如果未授权，调用权限检查接口wx.authorize
          wx.authorize({
            scope: 'scope.userLocation',
            success: () => {
              console.log('点了授权')
              this.getLocationFun()
            },
            fail: () => {
              //如果用户拒绝授权或没有授权，再次打开授权弹框
              console.log('点了拒绝')
              //弹窗提示设置
              this.openConfirmLocation()
            }
          })
        } else {
          //已经授权
          this.getLocationFun()
        }
      },
      fail: err => {
        console.log(err)
      }

    })
  },

  //跳转到选择收货地址页面
  goToAddress() {
    const cityInfo = JSON.stringify(this.data.cityInfo)
    wx.navigateTo({
      url: '/pages/address/address?cityInfo=' + cityInfo
    })
  },

  //获取首页banner列表
  async getTestList() {
    let result = await reqBanner()
    console.log('======获取测试的数据哦========', result)
    // if (result.code == 0) {
    //   const testList = result.data
    //   this.setData({
    //     testList: testList
    //   })
    // }
  },

  //获取模拟的数据
  getMockData() {
    const bannerList = app.globalData.mock.bannerList,
      navList = app.globalData.mock.navList,
      noticeList = app.globalData.mock.noticeList,
      shopList = app.globalData.mock.shopList.map(item => {
        return item
      })
    this.setData({
      bannerList,
      navList,
      noticeList,
      shopList
    })

    this.getTabList()
    this.getShopList('热门推荐')
  },

  getTabList() {
    let shopList = this.data.shopList
    let shopTabList = []
    shopList.map((t, index) => {
      shopTabList.push({
        id: t.id,
        title: t.title,
        titleSub: t.titleSub
      })
    })
    this.setData({
      shopTabList
    })
  },
  getShopList(title) {
    let shopList = this.data.shopList
    let shopPanelList = []
    if (title != '') {
      shopList.map((t, index) => {
        if (title == t.title) {
          shopPanelList = t.shops
        }
      })
    }
    this.setData({
      shopPanelList
    })
  },
  //商铺tab切换
  handleShopTab(e) {
    let index = e.currentTarget.dataset.index
    let title = e.currentTarget.dataset.title
    this.setData({
      currentIndex: index
    })
    this.getShopList(title)
  }
})