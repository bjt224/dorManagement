//app.js
App({
  onLaunch: function() {
    const that = this;
    this.globalData = {}; //全局变量

    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        env: 'test-oml05',
        traceUser: true,
      })
    }

    //首先获取用户oppid
    wx.cloud.callFunction({
        name: 'login',
        success: res => {
          console.log(res)
          that.globalData.userID = res.result.openid;
        },
        fail: err => {
          console.error('[云函数] [login] 调用失败：', err)
        }
      }),
      //判断授权情况
      wx.getSetting({
        success(res) {
          if (res.authSetting['scope.userInfo']) {
            // 已经授权，可以直接调用 getUserInfo 获取头像昵称
            that.globalData.loginStatus = true;
            wx.getUserInfo({
              success: function(res) {
                that.globalData.userPhoto = res.userInfo.avatarUrl
              }
            })
          } else {
            that.globalData.loginStatus = false;
            wx.showModal({
              title: '提示',
              content: '请先授权登录',
              success: function() {
                wx.switchTab({
                  url: "/pages/stuInfo/stuInfo",
                })
              }
            })
          }
        }
      }),
      //获取手机高度
      wx.getSystemInfo({
        success: function(res) {
          that.globalData.animationShowHeight = res.screenHeight;
        }
      })

    //检查是否存在新版本
    wx.getUpdateManager().onCheckForUpdate(function(res) {
      // 请求完新版本信息的回调
      if (res.hasUpdate) { //如果有新版本
        // 小程序有新版本，会主动触发下载操作（无需开发者触发）
        wx.getUpdateManager().onUpdateReady(function() { //当新版本下载完成，会进行回调
          wx.showModal({
            title: '更新提示',
            content: '新版本已经准备好，单击确定重启应用',
            showCancel: false,
            success: function(res) {
              // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
              wx.getUpdateManager().applyUpdate();
            }
          })
        })
        // 小程序有新版本，会主动触发下载操作（无需开发者触发）
        wx.getUpdateManager().onUpdateFailed(function() { //当新版本下载失败，会进行回调
          wx.showModal({
            title: '提示',
            content: '检查到有新版本，但下载失败，请检查网络设置',
            showCancel: false,
          })
        })
      }
    })
  }
})