/*
 * @Description: 
 * @Author: dingxianzhi
 * @Email: dingxz@moofen.cn
 * @Date: 2022-06-01 10:12:11
 * @LastEditTime: 2022-09-06 15:48:26
 */
export function question_objective(question,pageWidth,pageLayout){
  console.log(question);
  // 客观题
  let { rowGroup, heightTitle } = question
  //题型分组
  let showData = [],columnArr = [],widthSum = 0,rowHeight = question.rowHeight, columnHeight = []
  rowGroup.forEach(item => {
    let maxWidth = item.map(subtopic => { return question.asColumn ? ((question.content.rows * 26) + 10) : subtopic.width}).reduce((a, b) => b > a ? b : a)
      console.log(pageWidth);
      console.log(maxWidth);
      widthSum += maxWidth
      if(widthSum < pageWidth){
          columnArr.push(item)
        }else{
          if(question.asColumn){
            let max = Math.max(...columnArr.flat(Infinity).map(item=> item.select))
            columnHeight.push(max)
          }
          showData.push(columnArr)
          widthSum = maxWidth
          columnArr = []
          columnArr.push(item)
        }
  })

  if(columnArr.length > 0){
    if(question.asColumn){
      let max = Math.max(...columnArr.flat(Infinity).map(item=> item.select))
      columnHeight.push(max)
    }
    showData.push(columnArr)
  }
  let lastHeight = showData[showData.length -1]
    .map(temp => temp.length * 21 + 10)
    .reduce((a, b) => b > a ? b : a)
  // let less = lastHeight >= rowHeight ? 0 : rowHeight - lastHeight
  //计算内容高度
  console.log(showData);
  if(question.asColumn){
    console.log(columnHeight.reduce((prev, next)=> prev + next));
    console.log(showData.length*10);
    rowHeight = (columnHeight.reduce((prev, next)=> prev + next) * 20) + showData.length*30
  }
  console.log(rowHeight);
  
  // let heights = heightTitle + showData.length * rowHeight - less
  let heights = heightTitle + (question.asColumn ? rowHeight : showData.length * rowHeight)
  return {...question,rowHeight,height:heights,showData:showData,content:{...question.content,pageLayout:pageLayout}}
}


export function question_language (question, latticeNum, latticeWidth) {
  // 作文（语文）
  const { totalWordCount,spacing} = question.content
  let rows = Math.ceil(totalWordCount / latticeNum) // .toFixed(2)
  let rowHeight = latticeWidth + spacing.value
      rowHeight = rowHeight.toFixed(2)*1
    let height = rows * rowHeight + question.marginHeight + question.heightTitle

    height = height.toFixed(2)*1
  return {
    ...question,
    height: height,
    rowHeight: rowHeight,
    lattice:latticeNum,
    rowWidth: latticeWidth,
    totalRow:Math.ceil(totalWordCount/latticeNum),
  }
}