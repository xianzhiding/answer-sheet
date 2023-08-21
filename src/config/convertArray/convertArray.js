export function convertArray(oldStr, idF = false) {
  if(oldStr != undefined){
    let arr = oldStr.split(/[(\r\n)\r\n]+/) // 回车换行
    if (!idF) {
      arr = arr.map(item => item == '' || item == 'undefined' ? '' : item + '\n')
              .filter(item => item !='')
    }
    return arr
  }
}

export function convertArray_p(oldStr) {
  //转换富文本编辑的内容为数组
  if(oldStr != undefined){
    let arr = oldStr.split('</p>') // 回车换行
        arr = arr.map(item => item == '' || item == 'undefined' ? '' : item + '</p>')
              .filter(item => item !='')
    return arr
  }

  // return oldStr.match(/<(\w+)[^<>]*>(?:<(\w+)[^<>]*>.*?<\/\2>|.)*?<\/\1>/g) || []
  //转换富文本编辑的内容为数组
}