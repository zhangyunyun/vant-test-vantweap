// pages/category/category.js
const app = getApp()
Page({
  data: {
    winHeight: 0, //左侧列表滚动高度
    categoryList: [], //分类商品列表数据
    currentIndex: 0, //左侧导航选中的index
    scrollTopId: '', //右侧滚动到某一个子列表的id

    heightArr: [], //存储右侧所有商品列表每一块的高度(模块高度-标题高度==列表高度)
    containerH: 0
  },
  onLoad(options) {
    //获取窗口的高度
    this.getWinHeight()

    //获取分类列表数据
    this.getCategoryData()
  },
  //获取屏幕高度
  getWinHeight() {
    wx.getSystemInfo({
      success: res => {
        // console.log(res)
        let winHeight = res.windowHeight
        this.setData({
          winHeight
        })
      }
    })
  },
  // 获取分类列表数据
  getCategoryData() {
    const categoryList = app.globalData.mock.categoryList.map(item => {
      return item
    })
    this.setData({
      categoryList
    })
    this.setHeightArr()
  },

  //点击左侧导航右侧对应分类滚动
  goToSlide(e) {
    // console.log(e)
    let id = e.currentTarget.dataset.id //a开头的id
    let index = e.currentTarget.dataset.index
    this.setData({
      scrollTopId: id, //当前选中的id对应的右侧模块的id
      currentIndex: index //当前选中的index
    })
  },

  //获取高度
  setHeightArr() {
    let heightArr = [];
    let h = 0;
    //获取整个模块的高度
    let query = wx.createSelectorQuery().in(this);
    query.selectAll('.contItem').boundingClientRect((react) => {
      react.forEach((res) => {
        h += res.height;
        heightArr.push(h)
      });
      this.setData({
        heightArr: heightArr
      })
    })

    //获取模块列表内容的高度
    query.select('.contItem_cont').boundingClientRect(res => {
      console.log(res)
      this.setData({
        containerH: res.height
      })
    }).exec()
  },

  //右侧列表滑动对应左侧导航选中
  onScroll(e) {
    //console.log(e)
    let scrollTop = e.detail.scrollTop
    let scrollArr = this.data.heightArr
    let containerH = this.data.containerH
    if (scrollTop >= scrollArr[scrollArr.length - 1] - containerH) {
      return
    } else {
      for (let i = 0; i < scrollArr.length; i++) {
        if (scrollTop >= 0 && scrollTop < scrollArr[0]) {
          this.setData({
            currentIndex: 0
          })
        } else if (scrollTop >= scrollArr[i - 1] && scrollTop < scrollArr[i]) {
          this.setData({
            currentIndex: i
          })
        }
      }
    }
  }
})