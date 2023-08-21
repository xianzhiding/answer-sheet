/*
 * @Description: 
 * @Author: dingxianzhi
 * @Email: dingxz@moofen.cn
 * @Date: 2022-06-06 13:31:46
 * @LastEditTime: 2022-08-26 09:34:36
 */
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import '@/assets/css/normalize.css'
// import 'element-ui/lib/theme-chalk/index.css';
import "@/assets/css/index.css";
import ElementUI from 'element-ui'
import store from './store'
import Components from './components/index'
import httpRequest from './utils/request'
import { post, fetch, patch, put, postForm } from './utils/http'
import { URL } from '@/config/api'
import { proving } from '@/assets/js/_verifyProving'
import { convertArray_p } from './utils/convertArray'
import lodash from 'lodash'

Vue.prototype.$http = httpRequest
Vue.prototype.$lodash = lodash
Vue.config.productionTip = false
Vue.prototype.$post = post
Vue.prototype.$fetch = fetch
Vue.prototype.$patch = patch
Vue.prototype.$put = put
Vue.prototype.$postForm = postForm
Vue.prototype.URL = URL
Vue.prototype.proving = proving
Vue.prototype.convertArray_p = convertArray_p


Vue.use(Components)
// Vue.use(httpRequest)
Vue.use(ElementUI, {
  size: 'medium'
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
