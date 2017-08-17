import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    listData: [],
    searchData: []
  },
  getters: {
  },
  mutations: {
    changeListData (state, d) {
      state.listData = d
    },
    changesearchData (state, d) {
      state.searchData = d
    }
  }
})
