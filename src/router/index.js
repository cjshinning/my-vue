import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/components/Index'
import Entry from '@/components/Entry'
import Result from '@/components/Result'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',name: 'Index',component: Index
    },
    {
      path: '/entry',name: 'Entry',component: Entry,
      children: [

      ]
    },
    { path:'/result/:key',component:Result },
  ]
})
