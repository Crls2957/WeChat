/**
 * Page() 打卡页 
 */
var util = require('../../utils/util.js');
var app = getApp();

Page({
  data: {
    //是否有签到任务
    flag: false, 

    //轮播
    indicatorDots: true,
    autoplay: false,
    interval: 5000,
    duration: 400,
    //当前任务下标
    current: 0,
    //当前任务
    curTask:{},
    //签到任务 
    tasks: "",
    distance: '',
    //用户信息
    userInfo: {},
    //测试1号
    openId: '',
    //当前状态 0 {倒计时}，1｛已打卡｝，2｛迟到｝,3｛请假中｝
    currentState: 0,
    //0 倒计时  1 已迟到
    currentTimeFlag: 0, 
    //当前请假任务开始时间
    currentLeaveStart: '',
    //当前请假任务结束时间
    currentLeaveEnd: '',
    //验证码
    veryCode:'',   
    //倒计时
    clock: {
      hour: '00',
      min: '00',
      second : '00'
    },
    //打卡按钮状态 0:未按压 1：按压 2：完成
    btn: 0,
    //按压了没
    btnPress: false,

    //更新地址不  
    updateAddres: false,
    //提示框默认隐藏
    modalHidden: true,
    //提示框文本
    modalText: '',
    //隐藏 
    leaveHidden: true,   
    //默认心情
    humor: '',
    humorAble: false,
    // 请假事由
    reason: ''
    ,
    //展示模态框   签到框
    showModal: false,

    Timer: null
  },

  //显示请假面板
  showLeavePanel: function () {
    this.setData({
      leaveHidden: false
    })
  },

  //关闭请假面板
  HideLeavePanel: function () {
    this.setData({
      leaveHidden: true
    })
  },

  // 当前请假任务开始时间
  startDateChange: function (e) {
    this.setData({
      currentLeaveStart: e.detail.value
    })
  }, 

  // 当前请假任务结束时间
  endDateChange: function (e) {
    this.setData({
      currentLeaveEnd: e.detail.value
    })
  },

  //输入请假理由
  inputReason: function (e) {
    this.setData({
      reason: e.detail.value
    })
  },

  //输入验证码
  inputVeryfiCode: function (e) {
     this.setData({
        veryCode : e.detail.value
     })
  },

  // 获取任务
  updateTask: function () {
    var that = this;
    var current = this.data.current;
    var curTask = this.data.curTask;
    var Timer = this.data.Timer;
    //var Tasks;
    wx.request({
      url: 'http://118.24.156.136:8080/attendance/student/kaoqinList',
      data: {
        'weChatId': that.data.openId
      },
      method: 'GET', 
      success: function(res){
        //获取任务
        console.log("updateTask"+res);
        console.log(res);
        var Tasks = res.data
        // var Tasks = [{ "taskDesc": "离散数学demo", "endDate": "23:55", "state": 0, "kaoqinMethod": "0", "latitude": "30.8214", "longitude": "104.18497" }];  
        if (Tasks.length <= 0) {
           return 0;
        }
        //console.log(Tasks.length);
        //console.log("..........................");
        var sign;
        var time_str = Tasks[current].endDate;
        sign = new Date(time_str.replace(/-/g, '/'));
        Timer = setInterval(function () {
        var now = new Date();
        that.judgeStatus(now,sign);    
        var disTime = Math.abs(now.getTime() - sign.getTime());
        that.updateClock(disTime);
        
        }, 1000);
        //获取距离
        if (Tasks[current].kaoqinMethod == 1){
          wx.getLocation({
            type: 'wgs84',
            success: function (res) {
              var my = {
                latitude: res.latitude,
                longitude: res.longitude
              }
              var d = that.getDistance(my.latitude, my.longitude, Tasks[0].latitude, Tasks[0].longitude);
              var distance = '距离还有' + d + '公里';
              that.setData({
                distance: distance
              })
            }
          })
        }

        that.setData({
            tasks : Tasks,
            curTask : Tasks[current],
            flag : true,
            currentState:Tasks[current].currentstate,
            Timer : Timer
      
        })
       
      },
      fail:function(){
        console.log("0");
      }
    })
  },

  updateClock: function (disTime) {
      var that = this;
    that.setData({
      'clock.hour': util.formatNumber(Math.floor(disTime / (3600 * 1000))),
      'clock.min': util.formatNumber(Math.floor(disTime % (3600 * 1000) / (60 * 1000))),
      'clock.second': util.formatNumber(Math.floor(disTime % (3600 * 1000) % (60 * 1000) / 1000))
    })
  },

  judgeStatus:function(now,sign){
    var that = this;
    if (now.getTime() < sign.getTime()) {
      // 倒计时状态
      that.setData({
        currentTimeFlag: 0
      })
    } else {
      // 已迟到状态
      that.setData({
        currentTimeFlag: 1
      })
    }
  },

  // 签到打卡
  signTask: function () {
    var that = this;
    var d;
    
    if (!this.data.btnPress) {
      this.setData({
        'btn': 1,
        'btnPress': true
      });

      setTimeout(function () {
        that.setData({
          'btn': 0,
          'btnPress': false
        });
      }, 500);
      console.log(this.data.curTask.kaoqinMethod+"--------")
      switch (this.data.curTask.kaoqinMethod){
          case 0:
            //随机码打卡
            this.setData({ showModal: true });
            break;
          case 1:
            //定位打卡
            this.localtionKaoqin();
            break;
          default:
            break;
      }
    }
  },

  //定位考勤
  localtionKaoqin:function(){
    console.log("定位考勤---------------------------");
    var that = this;
    var Tasks = this.data.tasks;
    var current = this.data.current;
    var curTask = this.data.curTask;
    var d;
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        var my = {
          latitude: res.latitude,
          longitude: res.longitude
        }
        //console.log(Tasks);
        d = that.getDistance(my.latitude, my.longitude, curTask.latitude, curTask.longitude);
        if (d > curTask.kaoqinRange) {
          that.setData({
            'modalText': '距离有点远',
            'modalHidden': false
          })
        } else {
          wx.request({
            url: 'http://118.24.156.136:8080/attendance/student/kaoqin',
            method : 'POST',
            data: {
              weChatId: that.data.openId,
              latitude: curTask.latitude,
              longitude: curTask.longitude,
              courseId: curTask.courseId
            },
            success:function(res){
              console.log("localtionKaoqin---success");
              console.log(res)
              if (res.data.Result) {
                that.setData({ "currentState": 1 })
              } else {
                wx.hideToast()
                that.setData({
                  'modalText': res.data.msg,
                  'modalHidden': false
                });
              }
            
            }
          })
        }
      }
    })
  },
  
  // 计算距离
  getDistance: function (lat1, lng1, lat2, lng2) {
    function rad(d) {
      return d * Math.PI / 180.0
    }
    var radLat1 = rad(lat1);
    var radLat2 = rad(lat2);
    var a = radLat1 - radLat2;
    var b = rad(lng1) - rad(lng2);
    var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) +
      Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
    s = s * 6378.137;// EARTH_RADIUS;
    s = (Math.round(s * 10000) / 10000).toFixed(2);
    return s;
  },

  // 更新距离
  updateDistance: function () {
    var openId = wx.getStorageSync('openId');
    var that = this;
    var Tasks = this.data.tasks;
    var current = this.data.current;
    this.setData({
      updateAddres: true
    });

    setTimeout(function () {
      that.setData({
        updateAddres: false
      });
    }, 1000);
    wx.getLocation({
      type: 'wgs84', 
      success: function (res) {
        var my = {
          latitude: res.latitude,
          longitude: res.longitude
        }
        console.log("updateDistance----"+Tasks);
        var d = that.getDistance(my.latitude, my.longitude, Tasks[current].latitude, Tasks[current].longitude);
        var distance = '距离还有' + d + '公里';
        that.setData({
            distance:distance
        })
      }
    })
  
  },

  // 隐藏弹出框
  modalChange: function () {
    this.setData({
      'modalHidden': true
    });
  },

  // 监听输入框
  bindKeyInput: function (e) {
    this.setData({
      humor: e.detail.value
    })
  },

  onReady: function () {
  },

  // 监听页面显示
  onShow: function () {
    var that = this;
    var openId, Timer;
    Timer = setInterval(function () {
      if (wx.getStorageSync('openId')) {
        clearInterval(Timer);
        that.updateTask();
      }
    }, 1000);
  },

  // 初始化
  onLoad: function () {
    var that = this;
    var openId = wx.getStorageSync('openId');
    // 初始化基本信息和微信id
    app.getUserInfo(function (userInfo) {
      //更新数据
      that.setData({
        userInfo: userInfo
      });
       that.setData({
         openId: openId
       })
    });
  },

showDialogBtn: function () { this.setData({ showModal: true }) },
   /**
     * 弹出框蒙层截断touchmove事件
     */ 
preventTouchMove: function () { }, 
    /**
     * 隐藏模态对话框
     */
hideModal: function () { 
  this.setData({ showModal: false }); 
}, 
/**
     * 对话框取消按钮点击事件
     */ 
onCancel: function () { 
  this.hideModal(); 
  }, 
/**
     * 对话框确认按钮点击事件
     */ 
onConfirm: function (e) { 
  var that = this;
  this.hideModal(); 
  if (that.data.veryCode == null || that.data.veryCode == ''){
    that.setData({
      'modalText': '验证码不能为空哦',
      'modalHidden': false
    });
    return;
  }
      wx.showToast({
        title: '请求中',
        icon: 'loading',
        duration: 1000
      })
      wx.request({
        url: 'http://118.24.156.136:8080/attendance/student/kaoqin',
        method: 'POST',
        data:{
          'weChatId':that.data.openId,
          'veriCode':that.data.veryCode,
          'courseId':that.data.tasks[0].courseId
        },
        success:function(res) {
           console.log(res);
          if (res.data.Result){
               that.setData( {"currentState":1})
            } else {
               wx.hideToast()
               that.setData({
                'modalText' : res.data.msg,
                'modalHidden' : false
              });
              }
            }
      })
  },

  // 切换滑块
  changeSwiper: function (e) {
    var that = this;
    var sign;
    var now = new Date();
    var Timer = this.data.Timer;

    var time_str = this.data.tasks[e.detail.current].endDate;

    this.setData({
      current: e.detail.current
    })

    sign = new Date(time_str.replace(/-/g, '/'));

    that.judgeStatus(now,sign);

    var disTime = Math.abs(now.getTime() - sign.getTime());
    that.updateClock(disTime);
    this.setData({
    // currentState: this.data.tasks[e.detail.current].state,
       curTask: this.data.tasks[e.detail.current],
    //  currentLeaveStart: this.data.tasks[e.detail.current].startTime,
    //  currentLeaveEnd: this.data.tasks[e.detail.current].endTime
    })
    //切换任务倒计时
    clearInterval(Timer);
    Timer = setInterval(function () {
      var now = new Date();
      that.judgeStatus(now, sign);
      var disTime = Math.abs(now.getTime() - sign.getTime());
      that.updateClock(disTime);
    }, 1000);
    that.setData({
      Timer : Timer
    })

  },

});