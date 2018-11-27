//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    weChatId:'2',
    inputValue:'',
    valueArr:[],
    motto: '',
    student: {
      name: '李四',
      num: '1234556',
      depart: '计科院',
      major: '软件工程'
    },
    teacher:{
      name:'张三',
      tel:'123456'
    },
    course:{},
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //跳转函数
  gotoUpdateTeahcer:function(){
    wx.navigateTo({
      url: 'updateTeacher/updateTeacher',
    })
  },
  gotoUpdateInfo: function () {
    wx.navigateTo({
      url: 'updateInfo/updateInfo',
    })
  },
  setValue(e){
    this.setData({
      inputValue:e.detail.value
    })
  },
  giveCourse(){
    if(this.data.inputValue){
      var list=this.data.valueArr;
      list.push({
        msg:this.data.inputValue
      });
      this.setData({
        valueArr:list
      })
      wx.request({
        url: '',
        data: {
          'course': this.data.inputValue,
        },
        method: 'POST',
        header: { 'Content-Type': 'application/json' },//默认参数
        success: function (res) {
          console.log(res.data);
          this.setData({
            name:res.data,
            tel:res.data
          })
        },
        fail: function (res) {
          console.log("connect failed!")
        }
      })
      wx.showToast({
        title: '发布成功！',
      })
    }else{
      wx.showModal({
        title: '警告',
        content: '课程内容不能为空',
      })
    }
  },
  delcourse(ev) {
    var i = ev.target.dataset.index;
    var list = this.data.valueArr;
    wx.request({
      url: '',
      data: {
        'deleteId':i
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
         console.log(res.data)
      },
      fail: function (err) {
        console.log(err)
      }
    })
    list.splice(i, 1);
    this.setData({
      valueArr: list
    })
  },
  onLoad: function () {
    //获得身份
    wx.request({
      url: '',
      data: {},
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {

        console.log(res.data)
        that.setData({
          weChatId: res.data //设置数据
        })
      },
      fail: function (err) {
        console.log(err)
      }
    })
    var weChatId=this.data.weChatId
    //请求教师信息
    if(weChatId === '2'){
      var that = this
      wx.request({
        url: '',
        data: {},
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {

          console.log(res.data)
          that.setData({
            teacher: res.data //设置数据
          })
        },
        fail: function (err) {
          console.log(err)
        }
      })
      /**显示请求的教师信息 */
    // var teacher = wx.getStorageSync('teacher');
    // this.setData({ teacher: teacher });
      }
      else if(weChatId==='1'){
      //请求学生信息
      var that = this
      wx.request({
        url: '',
        data: {},
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {

          console.log(res.data)
          that.setData({
            student: res.data //设置数据
          })
        },
        fail: function (err) {
          console.log(err)
        }
      })
    /**显示请求的学生信息 */
    // var student = wx.getStorageSync('student');
    // this.setData({ student: student });
      }
    /**请求删除课程信息 */
    // wx.request({
    //   url: '',
    //   data: {},
    //   header: {
    //     'content-type': 'application/json'
    //   },
    //   success: function (res) {
    //     var list=this.data.valueArr;
    //     that.setData({
    //       course: res.data //设置数据
    //     })
    //     list.push({
    //       msg:course
    //     });
    //     this.setData({
    //       vlaueArr:list
    //     })
    //   },
    //   fail: function (err) {
    //     console.log(err)
    //   }
    // })
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
