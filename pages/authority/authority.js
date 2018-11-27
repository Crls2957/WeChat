// pages/authority/authority.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo')
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

  },
  //绑定授权按钮
  bindGetUserInfo: function (res) {
    if (res.detail.userInfo) { 
      wx.request({
        //传入id
        url: '#',
        success: function (data) {
          // success
          if (data.result) {
            wx.showModal({
              title: '选择您的身份',
              content: '',
              cancelText: '我是学生',
              confirmText: '我是教师'
            })
          }
        },
        fail: function () {
          // fail
          wx.showToast({
            title: '请求失败',
          })
        }
      })
      ;

      wx.navigateBack({
        url: '../../pages/sign/index'
      })
    } else {
      console.log('用户点击了取消按钮')
    }
  }
})


