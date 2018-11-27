// pages/student/updateInfo/updateInfo.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    updateInfo:{
      name:'',
      num:'',
      depart:'',
      major:''
    },
    name:'',
    num: '',
    depart: '',
    major: '',
  },
  //获取数据
  setName(e){
    this.setDate({
      name:e.detail.value
    })
  },
  setNum(e) {
    this.setDate({
      num: e.detail.value
    })
  },
  setDepart(e) {
    this.setDate({
      depart: e.detail.value
    })
  },
  setMajor(e) {
    this.setDate({
      major: e.detail.value
    })
  },
  //提交数据
  updateInfo:function(e){
    var obj={};
    obj.name=this.date.name;
    obj.num=this.data.num;
    obj.depart=this.data.depart;
    obj.major=this.data.major;
    data.push(obj);
    this.setDate({
      updateInfo:this.data.obj
    })
    if(this.data.updateInfo){
      wx.request({
        url: '',
        data: {
            'updateInfo': this.data.updateInfo
        },
        method: 'POST',
        header: { 'Content-Type': 'application/json' },//默认参数
        success: function (res) {
          console.log(res.data);
          wx.showToast({
            title: '重置成功',
          })
          wx.navigateTo({
            url: '../personal',
            success: function (res) {
              // success
            },
            fail: function () {
              // fail
            },
            complete: function () {
              // complete
            }
          })
        },
        fail: function (res) {
          console.log("connect failed!")
        }
      })
    }else{
      wx.showModal({
        title: '警告',
        content: '修改信息内容不能为空',
      })
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