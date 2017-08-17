/**
 * Created by kingsoft on 2017/7/21.
 */

import axios from 'axios';

let online = 'http://54.223.135.152:90'; // 测试服

let onlineVC = 'https://cloudservice22.kingsoft-office-service.com'; // 正式服（渠道号，版本号）

// 获取淘宝猜你喜欢列表
export const guessLike = params => { return axios.get(`${online}/taobao/guess_like`, { params: params })};

// 获取默认搜索提示语
export const getTip = params => { return axios.get(`${online}/taobao/search/tip`, { params: params })};

// 获取热门词条
export const getHot = params => { return axios.get(`${online}/taobao/search/hot`, { params: params })};

// 获取搜索结果
export const search = params => { return axios.get(`${online}/taobao/search/`, { params: params })};

// 数据上报
export const getUse = params => { return axios.get(`${online}/taobao/search/use`, { params: params })};
