// miniprogram/pages/profile/profile.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatar: '',
    nickName: '',
    loginStatus: false,
    showLogin: true
  },

  // 跳转到信息页面
  onShowStuInfo() {
    wx.navigateTo({
      url: '../../pages/stuInfo/stuInfo?avatar=' + this.data.avatar
    })
  },

  // 获取用户头像
  onGetUserInfo(e) {
    this.setData({
      avatar: e.detail.userInfo.avatarUrl,
      nickName: e.detail.userInfo.nickName,
      loginStatus: true,
      showLogin: false
    })
    app.globalData.loginStatus = true;
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      loginStatus: app.globalData.loginStatus
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})