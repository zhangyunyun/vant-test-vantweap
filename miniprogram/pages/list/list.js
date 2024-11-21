const app = getApp()
Page({
  data: {
    listId: '',
    listTitle: '',
    listItemList: []
  },

  onLoad(options) {
    const listId = options.listId
    const listTitle = options.listTitle
    this.setData({
      listId,
      listTitle
    })
    wx.setNavigationBarTitle({
      title: listTitle
    })

    this.getItemList()
  },
  //根据导航id获取对应的列表数据
  getItemList() {
    const listId = this.data.listId
    app.globalData.mock.listItemList.map((item, index) => {
      if (listId == item.id) {
        this.setData({
          listItemList: item.data
        })
      }
    })
  }
})