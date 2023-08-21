import { QUESTION_NUMBERS } from '@/models/base'

const state = {
  questionOrder:0
}

const mutations = {
  set_questionOrder: (state) => {
    state.questionOrder = state.questionOrder + 1
  },

  del_questionOrder: (state, order) => {

    state.pageData.map((item) =>
      item.order > order ? item.order - 1 : item.order
    )
    state.questionOrder = state.questionOrder - 1
  },

  questionOrder_subtract: (state, order) => {
    state.pageData.map((item) =>
      item.order > order ? item.order - 1 : item.order
    )
    state.questionOrder = state.questionOrder - 1
  },
}

const actions = {

}

const getters = {
  options:()=>{
    return QUESTION_NUMBERS.map((label,value)=>({label,value}))
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}