var util = require('../../utils/util.js');
var app = getApp();

Page({
  data: {
    task: {
      name: '',
      address: '点击选择地点',
      signTime: '00:00',
      endTime: '00:00',
      startDay: '2018-11-00',
      endDay: '2018-11-00',
      className: '请选择考勤课程',
      index: 0,
      latitude: 0,
      longitude:0,
      methodIndex: 0,
      methodes:["随机码签到","定位签到"],
      classes: [{ "courseId": 1, "courseName": "离散数学" }, { "courseId": 2, "courseName": "高等数学" }],
    },
    openId: '',
    userInfo: {},
    creating: false,
    button: {
      txt: '新建'
    },
    modalHidden: true
  },

  // 设置任务名称
  bindKeyInput: function (e) {
    this.setData({
      'task.name': e.detail.value
    });
  },

  // 设置任务地点
  chooseLocation: function () {
    var that = this;
    wx.chooseLocation({
      success: function(res){
        that.setData({
          'task.address': res.address,
          'task.latitude': res.latitude,
          'task.longitude': res.longitude
        })
      },
      fail: function() {
        // fail
      },
      complete: function() {
        // complete
      }
    })
  },

  //选择课程
  setClassName:function(e){
    this.setData({ 'task.index': e.detail.value });
  },

  //选择考勤方式
  setMethodName:function(e){
    this.setData({ 'task.methodIndex': e.detail.value });
  },

  // 设置打卡时间
  setSignTime: function (e) {
    var that = this;
    var hour = ((+e.detail.value.slice(0, 2) + 24 - 2) % 24).toString();
    that.setData({
      'task.signTime': e.detail.value,
       'task.endTime': (hour[1] ? hour : '0' + hour) + ':' + e.detail.value.slice(3, 5)
    });
  },

  // 设置结束打卡时间
  setEndTime: function (e) {
    var that = this;
    var hour = ((+e.detail.value.slice(0, 2) + 24 - 2) % 24).toString();
    that.setData({
      'task.endTime': e.detail.value,
    });
  },
  
  // 设置开始日期
  startDateChange: function (e) {
    this.setData({
      'task.startDay': e.detail.value
    })
  },

  // 设置结束日期
  endDateChange: function (e) {
    this.setData({
      'task.endDay': e.detail.value
    })
  },
 
  // 隐藏提示
  modalChange: function (e) {
    this.setData({
      modalHidden: true
    })
  },

  // 创建任务
  createTask: function () {
    var that = this;
    var task = this.data.task;
    var openId = this.data.openId;
    var courseId = task.classes[task.index].courseId;
    //var userInfo = this.data.userInfo;
    console.log(task.endDay + " " + task.endTime + ":00");
    wx.showToast({
      title: '新建中',
      icon: 'loading',
      duration: 10000
    });

    wx.request({
      url: 'http://118.24.156.136:8080/attendance/teacher/kaoqin',
      data: {
        startDate: task.startDay+" "+task.signTime+":00",
        endDate: task.endDay + " " + task.endTime + ":00",
        taskDesc: task.name,
        kaoqinMethod: task.methodIndex,
        teacherId : openId,
        courseId: courseId,
        longitude: task.longitude,
        latitude: task.latitude,
      },
      method: 'POST',
      header: {
        'Content-Type': 'application/json'
      },
      success: function(res){
        wx.hideToast();
        console.log(res);
        var command = res.data.code;
        var kaoqinMethod = that.data.task.methodIndex;

        wx.navigateTo({
          url: '/pages/new/success/success?command=' + command +'&kaoqinMethod='+kaoqinMethod,
          success: function(res){
            // success
          },
          fail: function() {
            // fail
          },
          complete: function() {
            // complete
          }
        })
      },
      fail: function() {
        // fail
      },
      complete: function() {
        // complete
      }
    })
  },

  // 提交、检验
  bindSubmit: function (e) {
    var that = this;
    var task = this.data.task;
    var creating = this.data.creating;
    
    if (task.name == '' || (task.address == '点击选择地点' && task.methodIndex == 1) ){
      this.setData({
        modalHidden: false
      });
    } else {
      if (!creating) {
        this.setData({
          'creating': true
        });
        that.createTask();
      }
    }
  },
  
  onShow: function () {
    // 恢复新建按钮状态
    this.setData({
      'creating': false
    });
  },

  onHide: function () {
  },

  // 初始化设置
  onLoad: function () {
    var that = this;
    var now = new Date();
    var openId = wx.getStorageSync('openId');
    // 初始化打卡时间
    that.setData({
      'task.signTime': util.getHM(now),
      'task.endTime': util.getHM(new Date(now.getTime() + 1000 * 300))
    });
    
    // 初始化日期
    that.setData({
      'task.startDay': util.getYMD(now),
      'task.endDay': util.getYMD(now)
      
    });

    // 初始化昵称
    app.getUserInfo(function(userInfo){
      //更新数据
      that.setData({
        userInfo:userInfo
      });
      that.setData({
        openId: openId
      })
    });

  }  
})