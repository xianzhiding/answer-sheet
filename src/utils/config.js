/*
 * @Description: 
 * @Author: dingxianzhi
 * @Email: dingxz@moofen.cn
 * @Date: 2022-06-01 10:12:10
 * @LastEditTime: 2022-08-11 17:08:29
 */
export const URL = {
  AXIOS_TIMEOUT: 10000,
  SERVICE_LOCATION: window.location.origin,
  SERVICE_CONTEXT_PATH: window.location.origin+'/moofen-nep/', // http://localhost:60044 http://192.168.0.56:8012
  SERVICE_UPLOAD_PICTURE: window.location.origin+'/moofen-nep/' //'http://localhost:63993/' // 图片上传服务器端口 //http://172.16.10.99:60041/
}

export function getCookie (name) {
  var strcookie = document.cookie;//获取cookie字符串
  var arrcookie = strcookie.split("; ");//分割
  //遍历匹配
  for (var i = 0; i < arrcookie.length; i++) {
    var arr = arrcookie[i].split("=");
    if (arr[0] == name) {
      return arr[1];
    }
  }
  return "";
}