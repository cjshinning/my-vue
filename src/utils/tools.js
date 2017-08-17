var tools = (function () {
  return {
    getEnv: function () {
      var env = 'unknow'
      if (/MicroMessenger/i.test(navigator.userAgent)) {
        env = 'wechat'
      } else if (/QQ/i.test(navigator.userAgent)) {
        env = 'qq'
      } else if (/wpsmoffice/i.test(navigator.userAgent)) {
        env = 'wps'
      }
      return env
    },
    getCookie: function (sName) {
      sName = sName.toLowerCase()
      var oCrumbles = document.cookie.split(';')
      for (var i = 0; i < oCrumbles.length; i++) {
        var oPair = oCrumbles[i].split('=')
        var sKey = decodeURIComponent(oPair[0].trim().toLowerCase())
        var sValue = oPair.length > 1 ? oPair[1] : ''
        if (sKey === sName) return decodeURIComponent(sValue)
      }
      return ''
    },
    setCookie: function (sName, sValue, second) {
      var date = new Date()
      second = second === undefined ? 60 * 60 * 24 * 7 : second
      date.setTime(date.getTime() + second * 1000)
      // 默认开启secure，即https验证
      // var sCookie = encodeURIComponent(sName) + '=' + encodeURIComponent(sValue) + ';path=/;domain=.wps.cn;secure;expires=' + date.toGMTString();
      var sCookie =
        encodeURIComponent(sName) +
        '=' +
        encodeURIComponent(sValue) +
        ';path=/;domain=.wps.cn;expires=' +
        date.toGMTString()
      document.cookie = sCookie
    },

    // 拼接url参数
    stringifyURL: function (args) {
      var t = []
      for (var i in args) {
        t.push([i, args[i]].join('='))
      }
      return t.join('&')
    },

    // 解析url获取query参数
    getUrlQuery: (function () {
      var query = {}
      // 把 url 分隔成3段：path, query, hash; \x12 = \#
      var url = (window.location.search).split(/\?|\x12/)

      // 解析 query
      var args = (url[1] || '').split('&')
      args.forEach(function (n) {
        if (!n[0]) return
        n = n.split('=')
        query[n[0]] = n[1] || ''
      })
      return query
    })()
  }
})()

export default tools
