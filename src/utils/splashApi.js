import jQuery from 'jquery'
import observer from './observer'

// 调用客户端 requestSessionUserInfo 后，客户端调用 appJs_sessionCallback 返回 wpsSid 和 userInfoJsonStr
window.appJs_sessionCallback = function (wpsSid, userInfoJsonStr) {
  var userInfo = {}
  try {
    userInfo = JSON.parse(userInfoJsonStr)
  } catch (e) {
  }
  if (splashApi._getSessionDeferred()) splashApi._getSessionDeferred().resolve(wpsSid, userInfo)
  // observer('loginStateChanged').publish(wpsSid, userInfo)
}

// 登录回调，带用户信息
window.appJs_loginCallback = function (wpsSid, userInfoJsonStr) {
  var userInfo = {}
  try {
    userInfo = JSON.parse(userInfoJsonStr)
  } catch (e) {
  }
  if (splashApi._getLoginDeferred()) splashApi._getLoginDeferred().resolve(wpsSid, userInfo)
  observer('loginStateChanged').publish(wpsSid, userInfo)
}

// 异步httpGet回调
window.callbackHttpGet = function (requestId, response) {
  observer('httpGetReceived').publish(requestId, response)
}

// 异步httpPost回调
window.callbackHttpPost = function (requestId, response) {
  observer('httpPostReceived').publish(requestId, response)
}

// 充值回调
window.wpsThirdPayResult = function (response) {
  observer('wpsThirdPayResult').publish(response)
}

// 购买会员半屏 支付回调
window.appJs_purchasingMemberCallback = function (wpsSid, userInfo) {
  observer('purchasingMemberCallback').publish(wpsSid, userInfo)
}

// WPS安卓客户端接口
var splashApi = (function (api) {
  var _deferred = null
  var _loginDeferred = null

  // 异常捕捉转调函数
//   var method = function (m) {
//     try {
//       m()
//     } catch (_) {
//     }
//   }

  return {
    /**
     *  检查是否存在客户端接口
     */
    checkApi: function () {
      return api !== void 0
    },

    /**
     *  私有接口：返回 getSession 的回调deferred
     */
    _getSessionDeferred: function () {
      return _deferred
    },

    /**
     * 返回登陆回调
     */
    _getLoginDeferred: function () {
      return _loginDeferred
    },

    /**
     * 请求Session（使得客户端会调用""javascript:appJs_sessionCallback('" + wpsSid + "', '" + userInfoStr + "')"）
     */
    requestSession: function () {
      api.requestSessionUserInfo()
    },

    /**
     *  请求登录回调
     */
    goToLoginAndCallBackUserInfo: function () {
      _loginDeferred = jQuery.Deferred()
      api.goToLoginAndCallBackUserInfo()
      return _loginDeferred
    },

    getSession: function () {
      _deferred = jQuery.Deferred()
      this.requestSession()
      return _deferred
    },

    // 获取设备信息
    jsGetDeviceInfo: function () {
      return api.jsGetDeviceInfo()
    },

    /**
     * 请求登录WPS（带回调javascript:appJs_loginCallback('" + wpsSid + "', '" + userInfoStr + "')）
     */
    login: function () {
      api.goToLoginAndCallBackUserInfo()
    },

    /**
     * httpGet请求
     * @param
     * strURL：网络路径
     * headers：json字符串没有传null
     * timeout：超时时间
     * @return
     * json字符串，含两个key值：
     * errorCode:0没有错误 1超时 2网络不可用 3DNS解析失败 4未知错误 5json数据解析失败
     * body：网络内容
     */
    httpGet: function (url, headers, timeout) {
      return api.httpGet(url, headers, timeout)
    },

    /**
     * httpPost请求
     * @param
     * strURL：网络路径
     * strBody：示例："version=%s&firstchannel=%s&channel=%s"
     * headers：json字符串没有传null
     * timeout：超时时间
     * @return
     * json字符串，含两个key值：
     * errorCode:0没有错误 1超时 2网络不可用 3DNS解析失败 4未知错误 5json数据解析失败
     * body：网络内容
     */
    httpPost: function (url, body, headers, timeout) {
      return api.httpPost(url, body, headers, timeout)
    },

    // httpGet的异步接口, requestId用于识别请求
    asynHttpGet: function (requestId, url, headers, timeout) {
      api.asynHttpGet(requestId, url, headers, timeout)
    },

    // httpPost的异步接口, requestId用于识别请求
    asynHttpPost: function (requestId, url, body, headers, timeout) {
      api.asynHttpPost(requestId, url, body, headers, timeout)
    },

    /**
     * 弹Toast提示
     */
    showToast: function (msg) {
      api.JSShowToast(msg)
      // alert(msg) //debug
    },

    /**
     * 设置屏幕方向
     * @param orientation 1 为竖屏
     */
    setRequestedOrientation: function (orientation) {
      api.setRequestedOrientation()
    },

    /**
     * 禁止下拉刷新
     * @param isEnabled false 为禁止下载刷新
     */
    setSwipeRefreshEnabled: function (isEnabled) {
      api.JSSetSwipeRefreshEnabled(isEnabled)
    },

    /**
     * 调起分享
     */
    shareWx: function (title, url) {
      api.shareWx(title, url)
    },

    /**
     * js回调返回按钮
     * @param isFinish true执行关闭activity，false则先执行goback
     */
    onBackPressed: function (isFinish) {
      api.onBackPressed(isFinish)
    },

    /**
     * 调客户端下载
     * @param url
     * @param type 可填browser或者system
     */
    download: function (url, type) {
      if (!type) {
        type = 'system'
      }
      api.JSDownload(type, url)
    },

    /**
     * 设置正在下载的文件的上报信息，一般是在 download 接口调用之后再调用它
     * @param download_tracking_url 下载完成的上报url地址数组
     * @param install_tracking_url 安装完成的上报url地址数组
     * @param pkg 下载apk的包名
     * @param click_url apk的下载地址，避免使用短链接
     */
    trackingInfo: function (downloadTrackingUrl, installTrackingUrl, pkg, clickUrl) {
      // 参数json格式如下
      //
      // {
      //   "download_tracking_url": [
      //   "http://rcv.mobad.ijinshan.com/rp/?IA_q"
      // ],
      //   "install_tracking_url": [
      //   "http://rcv.mobad.ijinshan.com/rp/?IA_q"
      // ],
      //   "pkg": "cn.wps.moffice",
      //   "click_url": "apk的下载地址"
      // }

      var data = {
        download_tracking_url: [downloadTrackingUrl],
        install_tracking_url: [installTrackingUrl],
        pkg: pkg,
        click_url: clickUrl
      }
      var jsonStr = JSON.stringify(data)
      console.log(jsonStr)
      api.trackingInfo(jsonStr)
    },

    /**
     * 判断是否已安装指定app
     * @param packageName
     */
    isInstalledApp: function (packageName) {
      return api.isInstalledApp(packageName)
    },

    /**
     * 打开一个超链接
     * @param url要打开的链接，openMode可填（可填写webview、popwebview、browser）
     */
    loadHyperlink: function (url,openMode) {
      return api.loadHyperlink(url,openMode)
    },

    /**
     * 唤醒第三方app
     * @param uri 如 "weixin://wap/pay"
     */
    intentSchemeURI: function (uri) {
      api.JSIntentSchemeURI(uri, 1)
    },

    /**
     * 数据上报type1类型事件
     */
    collectData: function (eventID) {
      try {
        api.collectData(eventID)
      } catch (_) {
      }
    },

    /**
     * 数据上报type3类型事件
     */
    collectDataV3: function (eventID, eventValue) {
      if (eventValue == null) {
        eventValue = ''
      }
      try {
        api.collectDataV3(eventID, eventValue)
      } catch(_) {}
    },

    JSGetPaymentWay: function () {
      api.JSGetPaymentWay()
    },

    // 直接跳转到支付界面（第三方支付,订单号外部传入） JSStartPaymentActivity(java.lang.String jsonString)
    JSStartPaymentActivity: function (jsonString) {
      api.JSStartPaymentActivity(jsonString)
    },

    // 调起客户端半屏支付界面
    // jsonString - { "pay_source": "android_vip" // 支付来源 "pay_memberid": 20 //WPS会员20 稻壳会员12 超级会员40 "pay_unchanged": true //true不允许客户端根据服务器配置来切换超级会员 }
    JSStartPurchasingMemberPopupWindow: function (jsonString) {
      api.JSStartPurchasingMemberPopupWindow(jsonString)
    },

    // 调起模板预览页，moban_app：模板类型（1/2/3），v10.3开始支持
    showTemplateDetailDialog: function (mobanApp, jsonStr, csourceRice, csourceVip) {
      api.showTemplateDetailDialog(mobanApp, jsonStr, csourceRice, csourceVip)
    }

  }
})(window.splash)

export default splashApi
