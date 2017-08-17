import splashApi from './splashApi'
import observer from './observer'
// import tools from './tools'
import jQuery from 'jquery'
/**
 * 创建模板服务模块
 *
 */
var DataServices = function () {
  this.init()
}

DataServices.prototype = {
  constructor: DataServices,

  init: function () {
    this.dataServices = []
  },

  add: function (name, url, dataMap, action) {
    this.dataServices[name] = new CURD(url, dataMap, action)
  },

  get: function (name) {
    return this.dataServices[name]
  }
}

var CURD = function (url, dataMap, action) {
  this.action = jQuery.extend(true, {
    query: {},
    create: {},
    update: {},
    remove: {}
  }, action)
  this.params = {url: url}
  this.dataMap = dataMap
  this.init()
}

CURD.prototype = {
  constructor: CURD,

  init: function () {
    for (var x in this.action) {
      this[x] = (function (type) {
        return function (params) {
          return this.send(params, type)
        }
      }(x))
    }
  },

  // 发送信息
  send: function (params, type) {
    var handleFunc = function (dfd, resp) {
      var json = null
      var data = null
      try {
        json = JSON.parse(resp)
        data = json.body
      } catch (e) {
        json = { errorCode: 5 }
      }

      if (json.errorCode === 0) {
        dfd.resolve(data)
      } else {
        // todo: 非客户端情况下调不到splashApi.showToast
        if (json.errorCode === 2) {
          splashApi.showToast('无网络服务器') // 无网络
        } else {
          splashApi.showToast('网络错误，请稍候重试') // 其他网络错误
        }
        dfd.reject(json.errorCode)
      }
    }

    var _params = jQuery.extend(true, {}, this.params, this.action[type], params)

    for (var x in this.dataMap) {
      if (_params.hasOwnProperty(x)) {
        var reg = new RegExp(':\\b' + x + '\\b')
        _params.url = _params.url.replace(reg, _params[x])
      }
    }

    var url = _params.url
    if (splashApi.checkApi()) {
      // jQuery.extend(_params.header, {Cookie: 'wps_sid=' + tools.getCookie('wps_sid')})
      jQuery.extend(_params.header, {Cookie: 'wps_sid=' + window.sessionStorage.wps_sid})
    }
    var header = _params.header ? JSON.stringify(_params.header) : null
    var timeout = 10000

    var curRequestId = null
    var dfd = jQuery.Deferred()
    var resp = null
    // 先检测是否有客户端接口，如果没有就会使用ajax，如果有就用客户端
    if (_params.method.toLocaleUpperCase() === 'POST') {
      if (splashApi.checkApi()) {
        var postData = ''
        if (!jQuery.isEmptyObject(_params.data)) {
          jQuery.each(_params.data, function (k, v) {
            postData += (postData ? '&' : '')
            postData += k + '=' + v
          })
        }
        var body = postData
        if (_params.async) {
          curRequestId = (new Date() - 0).toString()
          observer('httpPostReceived').subscribe(function (reqId, resp) {
            if (reqId === curRequestId) {
              handleFunc(dfd, resp)
            }
          })
          splashApi.asynHttpPost(curRequestId, url, body, header, timeout)
        } else {
          resp = splashApi.httpPost(url, body, header, timeout)
          handleFunc(dfd, resp)
        }
      } else {
        jQuery.ajax({
          url: url,
          type: 'POST',
          async: _params.async,
          headers: _params.header,
          // beforeSend: function (xhr) {
          //     xhr.setRequestHeader('sid', _params.header.sid)
          // },
          xhrFields: {
            // withCredentials: true
          },
          data: _params.data,
          crossDomain: true,
          success: function (resp) {
            dfd.resolve(resp)
          }
        })
      }
    } else if (_params.method.toLocaleUpperCase() === 'GET') {
      if (!jQuery.isEmptyObject(_params.data)) {
        jQuery.each(_params.data, function (k, v) {
          url += url.indexOf('?') === -1 ? '?' : '&'
          url += k + '=' + v
        })
      }
      if (splashApi.checkApi()) {
        if (_params.async) {
          curRequestId = (new Date() - 0).toString()
          observer('httpGetReceived').subscribe(function (reqId, resp) {
            if (reqId === curRequestId) {
              handleFunc(dfd, resp)
            }
          })
          splashApi.asynHttpGet(curRequestId, url, header, timeout)
        } else {
          resp = splashApi.httpGet(url, header, timeout)
          handleFunc(dfd, resp)
        }
      } else {
        jQuery.ajax({
          url: url,
          type: 'GET',
          async: _params.async,
          headers: _params.header,
          // beforeSend: function (xhr) {
          //     xhr.setRequestHeader('sid', _params.header.sid)
          // },
          xhrFields: {
            // withCredentials: true
          },
          crossDomain: true,
          success: function (resp) {
            dfd.resolve(resp)
          }
        })
      }
    }
    return dfd
  }
}

var ins = new DataServices()

// 模板页面接口
ins.add('template', window.location.protocol + ':_method_', {_method_: '@_method_'}, {
  getTemplateInfoByIds: {_method_: '//docer.wps.cn/v3.php/api/mb/info', method: 'get', header: {'X-Requested-With': 'XMLHttpRequest'}},
  getList: {_method_: '//pay.wps.cn/api/auto_renew/contract/list', method: 'get', header: {'X-Requested-With': 'XMLHttpRequest'}},
  toDelete: {_method_: '//pay.wps.cn/api/auto_renew/contract/delete', method: 'post', header: {'X-Requested-With': 'XMLHttpRequest'}}
})

// 用户信息接口
ins.add('user', window.location.protocol + ':_method_', {_method_: '@_method_'}, {
  // 获取用户信息
  getUserInfo: {_method_: '//vip.wps.cn/userinfo', method: 'get', header: {'X-Requested-With': 'XMLHttpRequest'}}
})

ins.add('coupon', window.location.protocol + ':_method_', {_method_: '@_method_'}, {
  // 获取可领取优惠券列表
  couponList: {_method_: '//vip.wps.cn/coupon/couponsbycsource', method: 'get', header: {'X-Requested-With': 'XMLHttpRequest'}, cache: false},
  // 获取可用于支付优惠券列表
  usableCouponList: {_method_: '//vip.wps.cn/coupon/member/usablelist', method: 'get', header: {'X-Requested-With': 'XMLHttpRequest'}, cache: false},
  // 领取优惠券
  receiveCoupon: {_method_: '//vip.wps.cn/coupon/member/receives', method: 'post', header: {'X-Requested-With': 'XMLHttpRequest'}, cache: false}
})

// 支付相关接口
ins.add('pay', window.location.protocol + ':_method_', {_method_: '@_method_'}, {
  // 获取配置
  getPayConfig: {_method_: '//vipapi.wps.cn/pay_config/v1/config/member?payconfig=android', method: 'get', header: { 'X-Requested-With': 'XMLHttpRequest' }},
  // 下单：get
  getOrder: {_method_: '//vip.wps.cn/pay/webpay', method: 'get', header: {'X-Requested-With': 'XMLHttpRequest'}, cache: false},
  // 下单：post
  postOrder: {_method_: '//vip.wps.cn/pay/webpay', method: 'post', header: {'X-Requested-With': 'XMLHttpRequest'}, cache: false}
})

export default ins

