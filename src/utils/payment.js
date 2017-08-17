import dataServices from './dataServices'
import splashApi from './splashApi'
import tools from './tools'

var Payment = function () {
  this.getPaymentWays = function () {
    var payWay = JSON.parse(splashApi.JSGetPaymentWay())
    // {'pay_way':['alipay_android','wxpay_android']}
    return payWay.pay_way
  }
  /*
    memType:会员类型 稻壳：12；青铜：14；白银：20；白金：40
    payWay: 支付方式 'alipay_android','wxpay_android','alipay_wap','wx_wap'
    days: 购买的天数
    sn: 优惠券码
    */
  this.pay = function (memType, contract, days, sn, payWay, verCsource) {
    var data = {}
    var memTypePaytypeMaps = {12: 0, 14: 1, 20: 2, 40: 3}
    // if (verCsource == 'android_vip_hd_new') {
    var memTypeMaps = {12: '稻壳', 14: '青铜', 20: 'WPS', 40: '超级'}
    // } else {
    //   var memTypeMaps = {14: '青铜', 20: '白银', 40: '白金'}
    // }

    if (tools.getEnv() === 'wps') {
      // 当前环境为wps客户端
      var payway = (payWay === 'wechat') ? 'wxpay_android' : (payWay === 'alipay' ? 'alipay_android' : '')
      data = {
        memtype: memType,       // 购买的会员类型
        csource: verCsource || '',   // 购买来源
        count: days,              // 购买天数
        sn: sn || '',       // 优惠券sn
        payway: payway,             // 支付方式
        contract: contract,   // 签约包月
        prepay: 1,
        apiversion: 2,
        payconfig: 'android'
      }

      dataServices.get('pay').postOrder({data: data}).done(function (resp) {
        // alert(JSON.stringify(resp))
        if (resp.result === 'ok' && resp.data.order_num) {
          var orderNum = resp.data.order_num
          var price = resp.data.total_fee
          var orderUrl = resp.data.url || ''
          var payData = {
            // 商品描述
            'pay_title': '开通' + memTypeMaps[memType] + '会员',
            // 描述
            'pay_body': '开通' + memTypeMaps[memType] + '会员',
            // todo: 改价钱！！！！
            'pay_sum': price,
            // 'pay_sum': 0.1,
            // 订单号（ps：就算不同订单系统，生成的订单号也要互相不同！！）
            'pay_trade_no': orderNum,
            'auto_pay_url': orderUrl,
            // 支付方式
            'pay_way': payway,
            'pay_local': true,
            'pay_type': memTypePaytypeMaps[memType],
            // todo 微信通知服务器地址
            'pay_notify_url_wx': 'https://pay.wps.cn/api/pay/invoke/android_wx_notify',
            // 'pay_notify_url_wx': 'http://test.pay.wps.cn/api/pay/invoke/android_wx_notify',
            // todo 支付宝通知服务器地址
            'pay_notify_url_ali': 'https://pay.wps.cn/api/pay/invoke/android_alipay_notify'
            // 'pay_notify_url_ali': 'http://test.pay.wps.cn/api/pay/invoke/android_alipay_notify'
          }

          splashApi.JSStartPaymentActivity(JSON.stringify(payData))
        } else {
          // todo: 异常处理
          alert(resp.result + ':操作失败，请稍后再试')
        }
      })
    } else {
      // 非客户端环境
      if (payWay === 'alipay') {
        data = {
          memtype: memType,       // 购买的会员类型
          csource: verCsource || '',   // 购买来源
          count: days,              // 购买天数
          sn: sn || '',       // 优惠券sn
          payway: 'alipay_wap',             // 支付方式
          contract: contract,
          prepay: 0,
          apiversion: 2,
          payconfig: 'android'
        }
        var url = window.location.protocol + '//vip.wps.cn/pay/webpay?' + tools.stringifyURL(data)
        console.log(url)
        window.location.href = url
      } else if (payWay === 'wechat') {
        data = {
          memtype: memType,       // 购买的会员类型
          csource: verCsource || '',   // 购买来源
          count: days,              // 购买天数
          sn: sn || '',       // 优惠券sn
          payway: 'wx_wap',             // 支付方式
          contract: contract,
          prepay: 1,
          apiversion: 2,
          payconfig: 'android'
        }
        dataServices.get('pay').postOrder({data: data}).done(function (resp) {
          if (resp.result === 'ok' && resp.data.order_num) {
            var orderNum = resp.data.order_num
            // alert('https://vip.wps.cn/wap/pay/wechat?order_id='+ order_num)
            window.location.href = window.location.protocol + '//vip.wps.cn/wap/pay/wechat?order_id=' + orderNum
          } else {
            // todo：异常处理
            console.log('操作失败，请稍后再试')
          }
        })
      }
    }
  }
}
var ins = new Payment()

export default ins
