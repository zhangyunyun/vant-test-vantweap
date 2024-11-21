// pages/address/address.js
import {
  tentectKey,
  refererCityKey,
  refererLocationKey
} from '../../utils/constants'
Page({
  data: {
    cityInfos: [],
    latitude: '',
    longitude: '',
    posName: '', //当前位置信息
    posAddress: '', //当前地址
    posCity: '', //当前城市
    markers: []
    // selectorVisible: false,
    // selectorCity: {
    //   key: tentectKey,
    //   referer: refererCityKey,
    //   hotCitys: '北京,上海,广州,深圳'
    // },
    // selectorMap: {
    //   key: tentectKey,
    //   referer: refererLocationKey,
    //   scale: 15
    // }
  },
  onLoad(options) {
    console.log('=进入地址页面=', options);
    let cityInfos = JSON.parse(options.cityInfo)
    let latitude = cityInfos[0].latitude
    let longitude = cityInfos[0].longitude
    let posName = cityInfos[0].desc
    let posAddress = cityInfos[0].name
    let posCity = cityInfos[0].regeocodeData.addressComponent.city
    this.setData({
      cityInfos: cityInfos,
      latitude: latitude,
      longitude: longitude,
      posName: posName,
      posAddress,
      posCity
    })
  },

  // 选择城市
  goToCity() {
    this.setData({
      selectorVisible: true
    })
  },
  onSelectCity(e) {
    const {
      city
    } = e.detail;
    this.setData({
      cityName: city,
    });
  },

  //地图选择更多地址
  goToMap() {
    //腾讯地图插件(正确代码)
    // const key = this.data.selectorMap.key
    // const referer = this.data.selectorMap.referer
    // const scale = this.data.selectorMap.scale
    // const location = JSON.stringify({
    //   latitude: this.data.latitude,
    //   longitude: this.data.longitude
    // })
    // const category = '商务楼字'
    // wx.navigateTo({
    //   url: `plugin://chooseLocation/index?key=${key}&referer=${referer}&scale=${scale}&location=${location}&category=${category}`
    // })

    const locations = JSON.stringify({
      latitude: this.data.latitude,
      longitude: this.data.longitude
    })
    wx.navigateTo({
      url: '/pages/map/map?locations=' + locations
    })
  }
})