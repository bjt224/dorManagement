// miniprogram/pages/home/home.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    school: "广东科学技术职业学院",
    functions: [
      {image: "write.png",title: "填水电数据"},
      { image: "search.png", title: "查水电费" },
      { image: "pay.png", title: "付水电费" }
    ]
  },

  onChangePage(e) {
    const index = e.currentTarget.dataset.index
    switch(index) {
      case 0: wx.navigateTo({
        url: '../../pages/write/write',
      });break;
      case 1: wx.navigateTo({
        url: '../../pages/search/search',
      });break;
      case 2: wx.navigateTo({
        url: '../../pages/pay/pay',
      });break;
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})