import splashApi from './splashApi'
import dataServices from './dataServices'
// import tools from './tools'
import jQuery from 'jquery'

var Login = (function () {
  return {
    getSid: function () {
      return this._sid
    },

    setSid: function (sid) {
      this._sid = (sid === void 0) ? '' : sid
    },

    getUserInfo: function () {
      return this._userInfo
    },

    setUserInfo: function (userInfo) {
      this._userInfo = (userInfo === void 0) ? {} : userInfo
    },

    checkLogin: function (env) {
      var seft = this
      var _deferred = jQuery.Deferred()

      // env==='web'时不调用客户端接口，强制调用pc接口
      if (env !== 'web' && splashApi.checkApi()) {
        // 客户端里
        splashApi.getSession().done(function (wpsid, userinfo) {
          // tools.setCookie('wps_sid', wpsid)
          window.sessionStorage.wps_sid = wpsid
          seft.setSid(wpsid)
          seft.setUserInfo(userinfo)
          _deferred.resolve(wpsid, userinfo)
        })
      } else {
        // 非客户端
        dataServices.get('user').getUserInfo().done(function (resp) {
          if (resp.result === 'ok') {
            var userinfo = {
              userId: resp.data.userid,
              userName: resp.data.nickname,
              picUrl: resp.data.pic,
              companyId: resp.data.companyid,
              role: resp.data.role,
              vipInfo: {
                credits: resp.data.wealth,
                expiretime: resp.data.vip.expire_time,
                memberId: resp.data.vip.memberid
              }
            }
            // todo sid需要补一下
            // seft.setSid('')
            seft.setUserInfo(userinfo)
            _deferred.resolve('', userinfo)
          } else {
            seft.setSid('')
            seft.setUserInfo({})
            _deferred.resolve('', {})
          }
        })
      }
      return _deferred
    },

    isLogin: function () {
      // 用户信息非空，说明已登录
      for (var i in this._userInfo) {
        return true
      }
      return false
    },

    gotoLogin: function () {
      var seft = this
      var _deferred = jQuery.Deferred()
      if (splashApi.checkApi()) {
        splashApi.goToLoginAndCallBackUserInfo().done(function (wpsid, userInfo) {
          // tools.setCookie('wps_sid', wpsid)
          window.sessionStorage.wps_sid = wpsid
          seft.setSid(wpsid)
          seft.setUserInfo(userInfo)
          _deferred.resolve(wpsid, userInfo)
        })
      } else {
        seft.setSid('')
        seft.setUserInfo({})
        _deferred.resolve('', {})
        window.location.href = '//account.wps.cn/mobilelogin?cb=' + encodeURIComponent(window.location.href)
      }
      return _deferred
    },

    loginCallback: function () {
      var seft = this
      var _deferred = jQuery.Deferred()

      if (this.isLogin()) {
        _deferred.resolve(this._sid, this._userInfo)
      } else {
        if (splashApi.checkApi()) {
          splashApi.goToLoginAndCallBackUserInfo().done(function (wpsid, userInfo) {
            if (wpsid) {
              // tools.setCookie('wps_sid', wpsid)
              window.sessionStorage.wps_sid = wpsid
              seft.setSid(wpsid)
              seft.setUserInfo(userInfo)
              _deferred.resolve(wpsid, userInfo)
            }
          })
        } else {
          seft.setSid('')
          seft.setUserInfo({})
          _deferred.resolve('', {})
          window.location.href = '//account.wps.cn/mobilelogin?cb=' + encodeURIComponent(window.location.href)
        }
      }

      return _deferred
    }
  }
})()

export default Login
