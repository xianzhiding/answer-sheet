/*
 * @Description: 
 * @Author: dingxianzhi
 * @Email: dingxz@moofen.cn
 * @Date: 2022-01-21 15:03:25
 * @LastEditTime: 2022-02-23 15:08:57
 */
export const API_VERSION = 'v1'
// 报表服务器地址
let BASEURL = window.location.origin //'http://localhost:9090'
if (process.env.NODE_ENV === 'development') {
  BASEURL = 'http://localhost:9090'
}
export const URL = {}