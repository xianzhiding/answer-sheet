import { QUESTION_NUMBERS } from '@/models/base'
import { question_objective,question_language } from '@/models/questionType'

const state = {
  questionNumber: QUESTION_NUMBERS,
  pageLayout: {
    paperSpec: 'A3',
    column: 2,
    asType: 1,
    asSecret: false, // 密封线
    schNumType: 1,  // 填写布局
    asNoteExist: false, // 注意事项
    asLackMark: true, // 缺考标记
    asAbPaper: false, // 存在AB卷
    asRedCard: false, // 红色答题卡
    asColumn: false, // 客观题竖向排列
    asBlock: false, // 分区答题卡
    asScorePoint: false, // 打分框模式
    asEachMark: 1, // 填空题每空打分
    asRegularMark: false, // 显示打分规范
    asScoreMode: 2
  },
  pageData: [],
  nonAnswer: [], // 非答题存在数组
  IsNew:false
}

const mutations = {
  //编辑页面布局
  pageLayout_change: (state, obj) => {
    state.pageLayout = obj
    
  },
  pageLayout_switch_mode:(state, asType)=>{
    state.pageData.forEach(item=>{
      if(item.questionType !== 'ObjectiveQuestion' || item.questionType!= 'AnswerSheetTitle'){
        if(asType == 2&&!item.marginHeight){
          item.marginHeight = 24
          item.height = item.height + 24
          item.initialHeigh = item.height + 24
          if(item.questionType == 'answerQuestion'){
            item.answerArrHeight[item.orderFirst] = item.height
          }
        }else{
          item.marginHeight = 0
          item.height = item.height - 24
          item.initialHeigh = item.height - 24
          if(item.questionType == 'answerQuestion'){
            item.answerArrHeight[item.orderFirst] = item.height
          }
        }
      }
    })
  },
  change_isNew: (state, status) => {
    state.IsNew = status
  },

  reset_pageData: (state, Arr) => {
    state.pageData = Arr
  },

  pageData_edit_header: (state, question) => {
  },

  //新增页面数据
  pageData_add: (state, question) => {
    state.pageData.push(question)
  },

  // 编辑页面数据
  pageData_edit: (state, question) => {
    let index = state.pageData.findIndex((itme) => itme.id === question.id)
    if (index > -1) {
      if (question.changeOrder) { // 非作答题
        state.pageData.splice(index, 1)
        // state.pageData.splice(question.changeOrder, 0, question)
        state.pageData.splice(index, 0, question)
      } else {
        state.pageData.splice(index, 1, question)
      }
    }
    if (question.layoutChange) {
      state.pageData = state.pageData.map(item => {
        let obj = {}
        if (item.editorContent != undefined) {
          obj = {
            titleContent: '',
            editorContent: [],
            segmentedArr: [],
            operatTinymce:[],
            rowHeightArr: [],
            height: item.initialHeigh != undefined ? item.initialHeigh:item.height
          }
        }
        return {
          ...item,
          ...obj
        }
      })
    }
  },

  //编辑题型标题
  pageData_edit_title: (state, data) => {
    if (data.index > -1) {
      state.pageData.splice(data.index,1,data.question)
    }
  },

  pageData_insert: (state, {
    obj,
    bigId,
    SelfOrder
  }) => {
    let nums = 0

    const index = state.pageData.findIndex((itme) => itme.id == bigId)
    if (index > -1) {
      nums = index + 1
      if(obj.questionType == "answerQuestion"){
        // 解答题插入
        nums = nums + obj.index
      }
      state.pageData.splice(nums, 0, obj)
    }

    if (SelfOrder) {
      let order = 0
      state.pageData = state.pageData.map((question) => {
        if (question.questionType !== "NonRresponseArea") {
          order += 1
        }
        let num = {}
        if (!question.questionType !== "AnswerSheetTitle") {
          num = {
            number:order - 2
          }
        }
        return {
          ...question,
          content: {
            ...question.content,
            ...num
          }
        }
      })

    }
  },

  pageData_editorStr: (state, obj) => {
    // 富文本编辑后字符串
    let index = state.pageData.findIndex((itme) => itme.id == obj.id)
    if (obj.answer != undefined) {
      index = state.pageData.findIndex((itme) => itme.objId == obj.id)
    }
    if (index > -1) {

      state.pageData[index] = {
        ...state.pageData[index],
        editorContent: obj.content != undefined ? obj.content : state.pageData[index].editorContent,
        operatTinymce: obj.operatTinymce != undefined ? obj.operatTinymce : state.pageData[index].operatTinymce,
        height: obj.height != undefined ? obj.height : state.pageData[index].height,
        rowHeightArr: obj.rowHeightArr != undefined ? obj.rowHeightArr : state.pageData[index].rowHeightArr,
      }
    }
  },

  pageData_del: (state, index) => {
    state.pageData.splice(index, 1)
  },

  pageData_id_clean: (state, id) => {
    // 内容分页
    state.pageData = state.pageData.filter((item) => {
      return ![id].includes(item.id)
    })
  },

  pageData_orderFirst: (state, data) => {
    // 解答题删除后续排序
    let index = -1
    state.pageData = state.pageData.map(question => {
      if (question.objId == data.objId) {
        index += 1
        return {
          ...question,
          orderFirst: index,
          scoreTotal: data.scoreTotal,
          heightTitle:index == 0 ? 24 : question.heightTitle
        }
      }else{return question}
    })
  },

  pageData_order_edit: (state, data) => {
    // 解答题
    state.pageData = state.pageData.map(question => ({
      ...question,
      previousOrder: question.objId === data.objId ? data.num : question.previousOrder
    }))
  },

  pageData_id_filter: (state, id) => {
    // 解答题
    state.pageData = state.pageData.filter(question => question.id != id)
  },

  pageData_simple_insert: (state, data) => {
    // 解答题插入
    // if (data.num > -1) {
    //   state.pageData.splice(data.num + 1, 0, data.obj)
    // }
    if (data.num > -1) {
      if(data.manual==1){
        state.pageData.splice((data.num + 1), 1, data.obj)
      }else{
        state.pageData.splice(data.num + 1,0,data.obj)
      }
    }
  },

  add_nonAnswer: (state, obj) => {
    // 非答题新增
    let index = state.nonAnswer.findIndex(ele => ele.id == obj.id)
    if (index > -1) {
      state.nonAnswer = state.nonAnswer.splice(index, 0, obj)
    } else {
      state.nonAnswer.push(obj)
    }
  },

  del_nonAnswer: (state, obj) => {
    // 非答题新增
    let index = state.nonAnswer.findIndex(ele => ele.id == obj.id)
    if (index > -1) {
      state.nonAnswer.splice(index, 1)
    } else {
      state.nonAnswer.splice(0, 1)
    }
  },
  // 插入清空的非答题
  nonAnswer_insert: (state) => {
    state.nonAnswer.forEach(obj => {
      let index = state.pageData.findIndex(question => question.id == obj.insertIndex)
      if (index > -1) {
        state.pageData.splice(index + 1, 0, obj)
      }
    })
  },

  pageData_nonA_clean: (state,objId) => {
    // state.pageData = state.pageData.filter((item) => item.questionType != "NonRresponseArea")
    state.pageData = state.pageData.filter((item) => item.objId != objId)
  }
}

const actions = {

}

const getters = {
  // 页面宽度
  page_width:(state) => {
    return state.pageLayout.column === 3 && state.pageLayout.paperSpec == 'A3'
        ? 480
        : 745
  },

  latticeWidth: (state,getters) => {
    //作文格子承载宽度
      return getters.page_width === 480 ? 31 : 32
  },

  latticeNum: (state, getters) => {
    return  getters.page_width === 480 ? 15 : 23
  },

  questionOrder: (state) => {
    return state.pageData.filter(question => question.questionType !== 'NonRresponseArea').length
  },

  compile_pageData: (state, getters) => {
    return state.pageData.map((question) => {
      switch (question.questionType) {
        case 'AnswerSheetTitle':
          return {
              ...question, 
              height:question.contentHeight + question.heightTitle + question.checkHeight + question.regularMarkHeight+question.scorePointHeight,
              content: { ...question.content, pageLayout:state.pageLayout }
            }
        case  'ObjectiveQuestion':
          return question_objective(question, getters.page_width,state.pageLayout)
        case  'compositionLanguage':
          return question_language(question,getters.latticeNum,getters.latticeWidth)
        case  'answerQuestion':
          return {
              ...question, content: { ...question.content, pageLayout: state.pageLayout },
              height:question.answerArrHeight[question.orderFirst]
            }
        default:
          return {
              ...question, content: { ...question.content, pageLayout:state.pageLayout }
            }
      }
    })
  },

  questionNumber_big_exist: (state,getters) => {
    // 大题号
    let obj = {}
    let Arr = []

    Arr =  getters.compile_pageData.filter(question => question.questionType !== 'AnswerSheetTitle' )
      .filter(question => question.questionType !== 'NonRresponseArea')
      .map((question, index) => {
        let {
          number,
          topicName
        } = question.content
        let objId = {}
        if (question.objId) {
          objId = {objId:question.objId}
        }
        return {
          id: question.id,
          ...objId,
          label: state.questionNumber[number] + '.' + topicName,
          order: !question.order ? index + 1 : question.order,
          value: index,
          type:question.questionType
        }
      })
      .reduce((acc, cur) => {
        obj[cur.label] ? '' : obj[cur.label] = true && acc.push(cur)
        return acc.map(question => {
          return question.label == cur.label && question.order < cur.order ? cur : question
        })
      }, [])
    return Arr
  },

}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}