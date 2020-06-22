// miniprogram/pages/search/search.js
const db = wx.cloud.database()
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    rateInfo: [
      {
        date: '',
        rate: [
          {
            title: '电费',
            value: 0
          },
          {
            title: '水费',
            value: 0
          }
        ]
      }
    ],
    dorId: '' ,
    date: ''
  },

  // 跳转到详情页面
  goDetail() {
    wx.navigateTo({
      url: '../../pages/searchDetail/searchDetail?date='+ this.data.date+'&dorId='+this.data.dorId,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载数据中',
    })
    console.log(app.globalData.userID)
    // 通过openid获取当前用户的宿舍
    db.collection('student').where({
      _openid: app.globalData.userID
    }).get({
      success: res => {
        console.log(res.data)
        this.setData({
          dorId: res.data[0].dorId
        })
        // 获取该宿舍历月水电费信息
        db.collection('charge').where({
          dorId:this.data.dorId,
          isPay: true
        }).get({
          success: res => {
            console.log(res.data)
            const data = res.data
            let rateInfo = this.data.rateInfo
            var time = ''
            for (let i = 0; i < data.length; i++) {
              time = data[i].date
              rateInfo[i].date = time
              rateInfo[i].rate[0].title = '电费'
              rateInfo[i].rate[1].title = '水费'
              rateInfo[i].rate[0].value = data[i].eleRate
              rateInfo[i].rate[1].value = data[i].waterRate
            }
            this.setData({
              date: time,
              rateInfo
            })
            
            console.log(this.data.rateInfo)
            wx.hideLoading()
          }
        })
      }
    })
  
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