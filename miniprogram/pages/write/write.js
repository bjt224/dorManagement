// miniprogram/pages/write/write.js
const db = wx.cloud.database()
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    rateType: [ // 收费类型
      {
        title: '电表',
        value: [{
            title: '空调电表',
            value: 0
          },
          {
            title: '日常用电',
            value: 0
          }
        ],
        hide: true
      },
      {
        title: '水表',
        value: [{
            title: '阳台水表',
            value: 0
          },
          {
            title: '厕所水表',
            value: 0
          },
          {
            title: '热水表',
            value: 0
          }
        ],
        hide: true
      }
    ],
    isShow: true,
    currentIndex: -1,
    imgs: [],
    date: '', // 提交表单时的日期
    dorId: '',
    totalPrice: 0,
    eleRate: 0, // 电费
    waterRate: 0, // 水费
    isMonth: false, // 是否到使用空调的季节f
    form_info: ''
  },

  // 点击显示填写的表单
  changeIsShow(e) {
    const index = e.currentTarget.dataset.index
    const hide = this.data.rateType[index].hide
    this.setData({
      [`rateType[${index}].hide`]: !hide
    })
  },

  // 获取表单中填写的数据
  formSubmit(e) {
    wx.showLoading({
      title: '正在处理',
    })
    console.log(e.detail.value)
    const data = e.detail.value
    console.log(this.data.dorId)
    db.collection('student').where({
      _openid: app.globalData.userID
    }).get().then(res => {
      this.setData({
        dorId: res.data[0].dorId
      })
      var time = new Date()
      //获取年份  
      var Y = time.getFullYear()
      //获取月份  
      var M = (time.getMonth() + 1 < 10 ? '0' + (time.getMonth() + 1) : time.getMonth() + 1)
      // 获取日期
      var d = (time.getDate() < 10 ? '0' + time.getDate() : time.getDate())
      var date = Y + '年' + M + '月' + d + '日'
      // 获取前一个月的水电量，计算差值，然后计算水电费
      var preM = ((M - 1) < 10 ? '0' + (M - 1) : (M - 1))
      var preY = Y
      if (preM == 0) {
        preM = 12;
        preY = Y - 1
      }
      var preDate = preY + '年' + preM + '月' + d + '日'
      console.log(preDate)
      // 查询前一个月的水电量
      db.collection('charge').where({
        date: preDate,
        dorId: this.data.dorId
      }).get().then(res => {
        console.log(res)
        var airC = res.data[0].airConditioner
        var ammeter = res.data[0].ammeter
        var waterMeter = res.data[0].waterMeter
        var hotWater = res.data[0].hotWater
        var dairC = parseFloat(data['空调电表']) - airC
        var dammeter = parseFloat(data['日常用电']) - ammeter
        console.log(dammeter)
        var dwaterMeter = parseFloat(data['阳台水表']) + parseFloat(data['厕所水表']) - waterMeter
        var dhotWater = parseFloat(data['热水表']) - hotWater
        var airRate = dairC * 0.79
        var hotRate = 0
        var amRate = 0
        var coldRate = 0
        if (dammeter > 32) {
          amRate = parseFloat(Number((dammeter - 32) * 0.79).toFixed(3))
        } else {
          amRate = 0
        }
        if (dwaterMeter > 8) {
          coldRate = parseFloat(Number((dwaterMeter - 8) * 5).toFixed(3))
        } else {
          coldRate = 0
        }
        if (dhotWater > 2) {
          hotRate = parseFloat(Number((dhotWater - 2) * 15).toFixed(3))
        } else {
          hotRate = 0
        }

        console.log(amRate)
        console.log(hotRate)
        console.log(coldRate)
        var totalPrice = airRate + amRate + hotRate + coldRate
        // 将本月的水电保存在云数据库中
        db.collection('charge').add({
          data: {
            dorId: this.data.dorId,
            airConditioner: parseFloat(data['空调电表']),
            ammeter: parseFloat(data['日常用电']),
            hotWater: parseFloat(data['热水表']),
            waterMeter: parseFloat(data['阳台水表']) + parseFloat(data['厕所水表']),
            images: this.data.imgs,
            amRate: amRate,
            airRate: airRate,
            eleRate: airRate + amRate,
            coldRate: coldRate,
            hotRate: hotRate,
            waterRate: coldRate + hotRate,
            totalPrice: totalPrice,
            isPay: false,
            date: date
          }
        }).then(res => {
          wx.hideLoading()
          wx.showToast({
            title: '提交成功'
          })
          // wx.redirectTo({
          //   url: '../write/write',
          // })
          this.setData({
            form_info: '',
            imgs: []
          })
        }).catch(err => {
          wx.showToast({
            title: '提交失败'
          })
          console.error(err)
        })
      })

    })


  },

  // 操作图片
  // 上传图片
  chooseImg(e) {
    var that = this;
    var imgs = this.data.imgs;
    if (imgs.length >= 9) {
      this.setData({
        lenMore: 1
      });
      setTimeout(function() {
        that.setData({
          lenMore: 0
        });
      }, 2500);
      return false;
    }
    wx.chooseImage({
      // count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function(res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;
        var imgs = that.data.imgs;
        // console.log(tempFilePaths + '----');
        for (var i = 0; i < tempFilePaths.length; i++) {
          if (imgs.length >= 9) {
            that.setData({
              imgs: imgs
            });
            return false;
          } else {
            imgs.push(tempFilePaths[i]);
          }
        }
        // console.log(imgs);
        that.setData({
          imgs: imgs
        });
      }
    });
  },
  // 删除图片
  deleteImg: function(e) {
    var imgs = this.data.imgs;
    var index = e.currentTarget.dataset.index;
    imgs.splice(index, 1);
    this.setData({
      imgs: imgs
    });
  },
  // 预览图片
  previewImg: function(e) {
    //获取当前图片的下标
    var index = e.currentTarget.dataset.index;
    //所有图片
    var imgs = this.data.imgs;
    wx.previewImage({
      //当前显示图片
      current: imgs[index],
      //所有图片
      urls: imgs
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // const time = new Date()
    // // console.log(time)
    // this.setData({
    //   date: time
    // })

    // 判断当前月份的时间是否为使用空调的月份
    // 获取当前时间的月份
    var timestamp = Date.parse(new Date())
    var date = new Date(timestamp)
    console.log(timestamp)
    console.log(date)
    //获取年份  
    var Y = date.getFullYear()
    //获取月份  
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1)
    //获取当日日期 
    var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    date = Y + '年' + M + '月'
    console.log("当前时间：" + Y + '年' + M + '月' + D + '日')
    console.log(date)

    let flag = true
    if (M >= 9 && M <= 12) {
      flag = true
    } else {
      flag = false
    }
    this.setData({
      date: date,
      isMonth: flag
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