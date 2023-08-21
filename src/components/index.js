/*
 * @Description: 
 * @Author: dingxianzhi
 * @Email: dingxz@moofen.cn
 * @Date: 2022-06-06 13:31:46
 * @LastEditTime: 2022-06-16 14:14:45
 */
import {Loading} from 'element-ui'
import HjSelect from './elementUi/select'
export default {
  install: (Vue) => {
    Vue.use(Loading)
    Vue.component('hj-select', HjSelect)
  }
}