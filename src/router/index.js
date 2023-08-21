/*
 * @Description: 
 * @Author: dingxianzhi
 * @Email: dingxz@moofen.cn
 * @Date: 2022-01-21 15:03:26
 * @LastEditTime: 2022-03-04 14:53:39
 */
import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/views/answerCard/'
import Preview from '@/views/answerCard/previewContent.vue'


const routerPush = VueRouter.prototype.push
VueRouter.prototype.push = function push (location) {
  return routerPush.call(this, location) //.catch(error => error)
}
// 教师分析

Vue.use(VueRouter)

const routes = [{
  path: '/',
  name: 'Home',
  component: Home,
  meta: {
    title: '答题卡制作'
  }
},
{
  path: '/preview',
  name: 'preview',
  component: Preview,
  meta: {
    title: '答题卡预览'
  }
}
]


const router = new VueRouter({
  routes
})

export default router