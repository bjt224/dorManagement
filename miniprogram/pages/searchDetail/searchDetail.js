// miniprogram/pages/searchDetail/searchDetail.js
const db = wx.cloud.database()
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    rateDetail: {
      date: '',
      detail: [{
          title: '电费',
          value: [{
              title: '空调用电花费',
              value: 0
            },
            {
              title: '日常用电花费',
              value: 0
            }
          ],
          rate: 0
        },
        {
          title: '水费',
          value: [{
              title: '冷水用水花费',
              value: 0
            },
            {
              title: '热水用水花费',
              value: 0
            }
          ],
          rate: 0
        }
      ]
    },
    imgs: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.showLoading({
      title: '数据加载中',
    })
    console.log(options)
    var date = options.date
    var dorId = options.dorId
    db.collection('charge').where({
      date: date,
      dorId: dorId,
      isPay: true
    }).get().then(res => {
      let rateDetail = this.data.rateDetail
      console.log(res)
      var data = res.data[0]
      // 日期 
      rateDetail.date = data.date

      // 电费
      rateDetail.detail[0].value[0].value = data.airRate
      rateDetail.detail[0].value[1].value = data.amRate
      rateDetail.detail[0].rate = data.eleRate

      // 水费
      rateDetail.detail[1].value[0].value = data.coldRate
      rateDetail.detail[1].value[1].value = data.hotRate
      rateDetail.detail[1].rate = data.waterRate
      var imgs = data.images
      this.setData({
        rateDetail: rateDetail,
        imgs: imgs
      })

      wx.hideLoading()
    }).catch(err => {
      wx.hideLoading()
      console.log(err)
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