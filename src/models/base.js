/*
 * @Description: 
 * @Author: dingxianzhi
 * @Email: dingxz@moofen.cn
 * @Date: 2022-01-21 15:03:26
 * @LastEditTime: 2023-02-07 15:04:21
 */
// 页面高度
export const PAGE_HEIGHT = 1020

//页面布局
export const LAYOUT_COLUMNS = [
  { id: 1, content: '一栏', pid: 'A4' },
  { id: 2, content: '两栏', pid: 'A3' },
  { id: 3, content: '三栏', pid: 'A3' },
]

export const LAYOUT_SIZE = [
  { id: 'A3', content: 'A3/B4/8K纸' },
  { id: 'A4', content: 'A4/B5纸' },
]

export const LAYOUT_ASTYPE = [
  { id: 1, content: '先扫后阅(网阅)' },
  { id: 2, content: '先阅后扫(手阅)' },
]

// 学生信息
// 标题设置
export const TITLE_SUDENTINFO = [
    {
      name: '考号',
      checked: false
    },
    {
      name: '学校',
      checked: true
    },
    {
      name: '姓名',
      checked: true
    },
    {
      name: '班级',
      checked: true
    },
    {
      name: '考场',
      checked: true
    },
    {
      name: '座号',
      checked: true
    },
    {
      name: '任课老师',
      checked: false
    }
]

//注意事项
export const PRECAUTIONS = [
  '答题前请将姓名、班级、考场、座号和准考证号填写清楚。',
  '客观题答题,必须使用2B铅笔填涂,修改时用橡皮擦干净。',
  '主观题必须使用黑色签字笔书写。',
  '必须在题号对应的答题区域内作答,超出答题区域书写无效。',
  '保持答卷清洁完整。'
]

export const AREA_NUMBERS = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"]

// 大题号
export const QUESTION_NUMBERS = ['一', '二', '三', '四', '五','六', '七', '八', '九', '十','十一', '十二', '十三', '十四', '十五','十六', '十七', '十八', '十九', '二十','二十一', '二十二', '二十三', '二十四']

// 客观题题型
export const OBJECTIVE_QUESTION = [
    { label: '单选框', name: 'singleChoice' },
    { label: '多选框', name: 'checkChoice' },
    { label: '判断题', name: 'judgmentChoice'},
]
// 客观题选项
export const LETTER_LIST = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']

export const DECIMAL_OBJ = {
  decimal: ['0','0.5','1','1.5','2','2.5','3','3.5','4','4.5','5','5.5','6','6.5','7','7.5','8','8.5','9','9.5','10','10.5','11','11.5','12','12.5','13','13.5','14','14.5','15','15.5','16','16.5','17','']
  ,array: ['0','0.5', '','0','1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26']
  ,bigArr: ['0','1','2','3','4','5','6','7','8','9','']
}