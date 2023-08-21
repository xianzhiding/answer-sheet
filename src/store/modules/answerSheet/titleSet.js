/*
 * @Description: 
 * @Author: dingxianzhi
 * @Email: dingxz@moofen.cn
 * @Date: 2022-01-21 15:03:26
 * @LastEditTime: 2022-02-09 11:34:15
 */
const state = {
  textVal: '',
  titleRows: 8,
  admissionName: '准考证号',
  noticesRules: ['1.答题前请将姓名、班级、考场、座号和准考证号填写清楚。',
'2.客观题答题,必须使用2B铅笔填涂,修改时用橡皮擦干净。',
'3.主观题必须使用黑色签字笔书写。',
'4.必须在题号对应的答题区域内作答,超出答题区域书写无效。',
'5.保持答卷清洁完整。']
}

const mutations = {
  editTitleInfo: (state, obj) => {
    state.titleInfo = obj
  },
  editTitleRows: (state, val) => {
    state.titleRows = val
  },
  editTextarea: (state, val) => {
    state.textVal = val
  },
  editAdmissionName: (state, val) => {
    state.admissionName = val
  },
  editNoticesRules: (state, val) => {
    state.noticesRules = val
  }
}

const actions = {

}

const getters = {

}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}