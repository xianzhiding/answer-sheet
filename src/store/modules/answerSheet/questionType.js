const state = {
  subTopic_number: 1,
  subTopic_number_already: [], // 已有的题组
  subTopic_number_determine: [], // 确定下的小题

  largest_questionNum: 1000, // 最大题数
}

const mutations = {
  subTopic_already_del(state, Arr) {
    // 删除已有小题数组
    Arr.forEach((item) => {
      state.subTopic_number_already = state.subTopic_number_already.filter(question => question.topic != item.topic)
    })
  },

  subTopic_already_add(state, Arr) {
    //新增小题数组
    Arr.forEach((item) => {
      const index = state.subTopic_number_already.findIndex(
        (row) => row.topic === item.topic
      )
      if (index > -1) {
        state.subTopic_number_already.splice(index, 1, item)
      } else {
        state.subTopic_number_already.push(item)
      }
    })
  },

  subTopic_already_clean: (state, id) => {
    // 一次清除
    state.subTopic_number_already = state.subTopic_number_already.filter((item) => {
      return ![id].includes(item.id)
    })
  },

  subTopic_already_pid_clean: (state, pid) => {
    // 解答一次清除
    state.subTopic_number_already = state.subTopic_number_already.filter((item) => {
      return ![pid].includes(item.pid)
    })
  },

  already_pid_clean:(state, pid) => {
    state.subTopic_number_already = state.subTopic_number_already.filter((item) => item.pid == pid)
  },

  subTopic_number_calculate_already: (state, Arr) => {
    Arr.forEach((newTopic) => {
      state.subTopic_number_already = state.subTopic_number_already.map(subTopic => {
        return subTopic.topic == newTopic.topic ? newTopic : subTopic
      })
    })
  },

  subTopic_already_reset: (state) => {
    // 重置
    state.subTopic_number_already = []
  },

  subTopic_number_calculate: (state, start) => {
    // 计算小题题号
    for (let i = 1; i < state.largest_questionNum; i++) {
      const index = state.subTopic_number_already.findIndex((item) => item.topic === i)
      const determineIndex = state.subTopic_number_determine.findIndex((item) => item.topic === i)
      if (index <= -1 && determineIndex <= -1) {
        if(start) {
          state.subTopic_number = start;
        }else{
          state.subTopic_number = i
        }
        break
      }
    }

  },

  subTopic_calculate_determine: (state, Arr) => {
    // 添加确定值
    Arr.forEach((item) => {
      const index = state.subTopic_number_determine.findIndex(
        (row) => row.topic === item.topic
      )
      if (index > -1) {
        state.subTopic_number_determine.splice(index, 1, item)
      } else {
        state.subTopic_number_determine.push(item)
      }
    })

  },

  subTopic_determine: (state,obj) => {
    state.subTopic_number_determine = state.subTopic_number_determine.filter(ele => ele.number != obj.number)
  },

  subTopic_determine_pid_clean: (state, pid) => {
    // 清除相同pid
    state.subTopic_number_determine = state.subTopic_number_determine.filter((item) => {
      return ![pid].includes(item.pid)
    })
  },

  subTopic_determine_clean: (state, topic) => {
    // 清除topic
    state.subTopic_number_determine = state.subTopic_number_determine.filter((item) => {
      return ![topic].includes(item.topic)
    })
  },


  subTopic_determine_del: (state, Arr) => {
    Arr.forEach((newTopic) => {
      state.subTopic_number_determine = state.subTopic_number_determine.map(subTopic => {
        return subTopic.topic == newTopic.topic ? newTopic : subTopic
      })
    })
  },

}

const actions = {}

const getters = {
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
}