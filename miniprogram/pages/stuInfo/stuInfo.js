// miniprogram/pages/stuInfo/stuInfo.js
const db = wx.cloud.database()
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    stuInfo: [{
        title: '头像',
        value: ''
      },
      {
        title: '性别',
        value: ''
      },
      {
        title: '姓名',
        value: ''
      },
      {
        title: '学号',
        value: ''
      },
      {
        title: '宿舍号',
        value: ''
      },
      {
        title: '手机号码',
        value: ''
      },
      {
        title: '邮箱',
        value: ''
      },
      {
        title: '民族',
        value: ''
      }
    ],
    sex: ['-请选择-', '男', '女'],
    sexIndex: 0,
    nation: [
      '-请选择-',
      '汉族',
      '蒙古族',
      '藏族',
      '苗族',
      '壮族',
      '回族',
      '维吾尔族',
      '彝族',
      '布依族',
      '朝鲜族',
      '侗族',
      '白族',
      '哈尼族',
      '傣族',
      '傈僳族',
      '畲族',
      '拉祜族',
      '满族',
      '瑶族',
      '土家族',
      '哈萨克族',
      '黎族',
      '佤族',
      '高山族',
      '水族',
      '东乡族',
      '景颇族',
      '土族',
      '仫佬族',
      '布朗族',
      '毛南族',
      '锡伯族',
      '普米族',
      '纳西族',
      '柯尔克孜族',
      '达斡尔族',
      '羌族',
      '撒拉族',
      '仡佬族',
      '阿昌族',
      '塔吉克族',
      '怒族',
      '俄罗斯族',
      '德昂族',
      '裕固族',
      '塔塔尔族',
      '鄂伦春族',
      '门巴族',
      '基诺族',
      '乌孜别克族',
      '鄂温克族',
      '保安族',
      '京族',
      '独龙族',
      '赫哲族',
      '珞巴族'
    ],
    nationIndex: 0
  },

  // 监听点击事件
  bindPickerChange1: function(e) {
    // console.log('picker1发送选择改变，携带值为', e.detail.value)
    this.setData({
      sexIndex: e.detail.value
    })
  },

  bindPickerChange2: function (e) {
    // console.log('picker2发送选择改变，携带值为', e.detail.value)
    this.setData({
      nationIndex: e.detail.value
    })
  },

  formSubmit(e) {
    // 提交表单的时候将输入的信息保存到stuInfo里面
    // console.log(e.detail.value)
    let stuInfo = this.data.stuInfo
    stuInfo[1].value = this.data.sex[e.detail.value['性别']]
    stuInfo[stuInfo.length - 1].value = this.data.nation[e.detail.value['民族']]
    for(let i = 2; i < stuInfo.length - 1; i++) {
      stuInfo[i].value = e.detail.value[stuInfo[i].title]
    }

    // 将信息保存在云数据库的student集合里
    db.collection('student').add({
      data: {
        avatar: stuInfo[0].value,
        stuId: stuInfo[3].value,
        name: stuInfo[2].value,
        sex: stuInfo[1].value === '男' ? 0 : 1,
        telephone: stuInfo[5].value,
        email: stuInfo[6].value,
        dorId: stuInfo[4].value,
        nation: stuInfo[7].value
      }
    }).then( res => {
      this.setData({
        stuInfo,
        sexIndex: e.detail.value['性别'],
        nationIndex: e.detail.value['民族']
      })
      wx.showToast({
        title: '保存成功',
      })
    }).catch(err => {
        wx.showToast({
          title: '保存失败',
        })
        console.error(err)
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.showLoading({
      title: '数据加载中',
    })
    let stuInfo = this.data.stuInfo
    stuInfo[0].value = options.avatar
    this.setData({
      stuInfo
    })
    
    // 如果数据库中已经存在这个学生，则直接显示学生信息
    db.collection('student').where({
      _openid: app.globalData.userID
    }).get({
      success: res => {
        // console.log(res)
        const data = res.data[0]
        console.log(data)
        stuInfo[0].value = data.avatar
        stuInfo[1].value = data.sex === 0 ? '男' : '女'
        const sexIndex = data.sex + 1
        stuInfo[2].value = data.name
        stuInfo[3].value = data.stuId
        stuInfo[4].value = data.dorId
        stuInfo[5].value = data.telephone
        stuInfo[6].value = data.email
        stuInfo[7].value = data.nation
        console.log(data.nation)
        const nationIndex = this._getNationIndex(data.nation)
        console.log(nationIndex)
        this.setData({
          stuInfo: stuInfo,
          sexIndex: sexIndex,
          nationIndex: nationIndex
        })
        console.log(this.data.stuInfo)
        wx.hideLoading()
      }
    })
    wx.hideLoading()
  },

  // 获取选择民族的下标
  _getNationIndex(obj) {
    const nation = this.data.nation
    for(let i = 0; i < nation.length; i++) {
      if(nation[i] === obj) {
        return i
      }
    }
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