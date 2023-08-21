export function proving (e) {
  var keynum = window.event ? e.keyCode : e.which; // 获取键盘码
  // var keychar = String.fromCharCode(keynum); // 获取键盘吗对应的字符
  if (keynum == 189 || keynum == 190 || keynum == 110 || keynum == 109) {
    e.target.value = ''
  }
}
