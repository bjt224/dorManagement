// miniprogram/pages/pay/pay.js
const db = wx.cloud.database()
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    rateInfo: // 当月应付的水电费
    {
      date: '2020年2月',
      imgs: [],
      rateDetail: [{
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
    totalRate: 0,
    dorId: '',
    modalHidden: true
  },

  // 点击支付按钮弹出二维码付款
  onPay() {
    wx.navigateTo({
      url: '../../pages/erweima/erweima',
    })
  },

  modalCancel() {
    this.setData({
      modalHidden: true
    })
  },

  modalConfirm() {
    this.setData({
      modalHidden: true
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.showLoading({
      title: '加载数据中',
    })
    // 通过openid获取当前用户的宿舍
    db.collection('student').where({
      _openid: app.globalData.userID
    }).get({
      success: res => {
        // console.log(res.data)
        this.setData({
          dorId: res.data[0].dorId
        })
        // 获取该宿舍未缴费的水电费信息
        db.collection('charge').where({
          dorId: res.data[0].dorId,
          isPay: false
        }).get({
          success: res => {
            console.log(res)
            const data = res.data[0]
            let rateInfo = this.data.rateInfo
            rateInfo.date = data.date
            // 电费
            rateInfo.rateDetail[0].value[0].value = data.airRate
            rateInfo.rateDetail[0].value[1].value = data.amRate
            rateInfo.rateDetail[0].rate = data.eleRate

            // 水费
            rateInfo.rateDetail[1].value[0].value = data.coldRate
            rateInfo.rateDetail[1].value[1].value = data.hotRate
            rateInfo.rateDetail[1].rate = data.waterRate

            this.setData({
              rateInfo: rateInfo
            })

            const rateDetail = this.data.rateInfo.rateDetail
            let totalRate = 0
            for (let r of rateDetail) {
              totalRate += r.rate
            }
            this.setData({
              totalRate
            })
            wx.hideLoading()
          }
        })
      }
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