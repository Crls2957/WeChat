/**
 * App() 函数
 * 
 * 用来注册一个小程序。接受一个 object 参数，其指定小程序的生命周期函数等。
 * 
 * @param onLaunch // 当小程序初始化完成时，会触发 onLaunch（全局只触发一次）
 * @param onShow   // 当小程序启动，或从后台进入前台显示，会触发 onShow
 * @param onHide   // 当小程序从前台进入后台，会触发 onHide
 * @param getUserInfo // 获取用户信息
 */

App({

	onLaunch: function() {
    // 获取用户信息
    // wx.getSetting({
    //   success: res => {
    //     if (res.authSetting['scope.userInfo']) {
    //       // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
    //       wx.getUserInfo({
    //         success: res => {
    //           // 可以将 res 发送给后台解码出 unionId
    //           this.globalData.userInfo = res.userInfo
    //           // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    //           // 所以此处加入 callback 以防止这种情况
    //           if (this.userInfoReadyCallback) {
    //             this.userInfoReadyCallback(res)
    //           }
    //         }
    //       })
    //     }
    //   }
    // })
    //测试
		console.log('APP-onLaunch 生命周期函数--监听小程序初始化');
	},

	onShow: function() {
		console.log('App-onShow 生命周期函数--监听小程序显示');
	},

	onHide: function() {
		console.log('App-onHide 生命周期函数--监听小程序隐藏');
	},

	getUserInfo: function(cb) {
		var that = this
		if (this.globalData.userInfo) {
			typeof cb == "function" && cb(this.globalData.userInfo)
		} else {
			//调用登录接口
			wx.login({
				success: function(r) {
          console.log('Login-----------------------------');
					// 获取用户信息 
					// wx.getUserInfo({
					// 	success: function(res) {
					// 		that.globalData.userInfo = res.userInfo
					// 		typeof cb == "function" && cb(that.globalData.userInfo)
					// 	}
					// }) 
          // 查看是否授权
          wx.getSetting({
            success: function (res) {
              if (res.authSetting['scope.userInfo']) {
                // 已经授权，可以直接调用 getUserInfo 获取头像昵称
                wx.getUserInfo({
                  success: function (res) {
                    that.globalData.userInfo = res.userInfo
                    typeof cb == "function" && cb(that.globalData.userInfo)
                    //console.log(res.userInfo)
                    //  that.setData({
                    //    userInfo: res.userInfo
                    //  });
                    // console.log(canIUse)
                  }
                })
              } else {
                wx.navigateTo({
                  url: '../../pages/authority/authority'
                });
              }
            }
          }) 

					// 获取用户openid
					wx.request({
            url: 'http://118.24.156.136:8080/attendance/getOpenId',
						data: {
							'code': r.code
						},
						method: 'GET',
						success: function(res) {
              console.log('---code 换取 openid---' + that.globalData.openId);
							//wx.setStorageSync('openId', res.data.openid);
              wx.setStorageSync('openId', that.globalData.openId);
						},
            fail:function(){
              console.log("fail");
            }
					})
				}
			})
		}
	},

  //全局变量
	globalData: {
		userInfo: null,
		openId: 'stu1'
	}
})