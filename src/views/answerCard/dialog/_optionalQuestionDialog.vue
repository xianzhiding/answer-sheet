<template>
  <el-dialog
    class="newAdd-content answer_box"
    :title="title"
    :visible.sync="openedFrame"
    :width="'600px'"
    :before-close="closeFrame"
    center
  >
    <div class="item-box ">
      <el-row>
        <el-col :span="12" class="select-item">
          <div class="label">大题题号:</div>
          <hj-select
            :items="options"
            size="mini"
            :value="data.number"
            @change="hanldeSelect"
          ></hj-select>
        </el-col>
        <el-col :span="12" class="select-item">
          <div class="label">题目:</div>
          <el-input
            v-model="data.topicName"
            size="mini"
            placeholder="请输入内容"
          ></el-input>
        </el-col>
      </el-row>
      <optional-group
        v-for="(item, i) in data.group"
        :key="i"
        :form-data="item"
        @change-status="changeStatus"
        @pre-edit-optional-group="preEditOptionalGroup"
      />
      <div class="question-group">
        <optional-item
          v-for="(item, i) in groupItemData"
          :key="i"
          :optional-data="item"
        />
      </div>
      <!-- <div class="condition_box">
        <el-checkbox v-model="data.HorizontalLine">生成解答题横线</el-checkbox>
        <span class="answer_rows" v-show="data.HorizontalLine">
          <span>行数：</span>
          <el-input
            v-model.number="data.rows"
            size="mini"
            @input="rowsFunc"
            onkeyup="this.value = this.value.replace(/[^\d.]/g,'');"
          />
          <span class="p-5"> 行 </span>
        </span>
      </div> -->
      <div class="condition_box Insert_box" v-show="editQuestionId == null">
        <el-checkbox v-model="data.InsertTitle">插入添加题目</el-checkbox>
        <div :class="['questionNumber_big_exist_style', { Fade: !data.InsertTitle }]">
          <span>插入到第</span>

          <hj-select
            :items="questionNumber_big_exist"
            size="mini"
            :value="existNumber"
            @change="hanldeSelectexistBig"
          />
          <span>大题后</span>
        </div>
        <el-checkbox
          :class="['Postpone', { Fade: !data.InsertTitle }]"
          v-model="data.Postpone"
          >大题号自动顺延</el-checkbox
        >
        <div class="Insert_Mask" v-show="!data.InsertTitle"></div>
      </div>
    </div>
    <div class="error-message" v-if="errorMessage">{{ errorVal }}</div>
    <div slot="footer" class="dialog-footer">
      <el-button type="cancel" @click="closeFrame">取 消</el-button>
      <el-button
        type="primary"
        :disabled="isdisabledFn"
        @click="preCreateQuestion"
        >确 定</el-button
      >
    </div>
  </el-dialog>
</template>

<script>
import optionalGroup from '../Subassembly/optional'
import optionalItem from '../Subassembly/optional/item'
import { mapState, mapMutations,mapGetters} from 'vuex'
export default {
  components: {
    optionalGroup,
    optionalItem,
  },
  data() {
    return {
      data: {},
      openedFrame: false,
      closeData: {},
      editQuestionId: null,
      errorVal: '',
      existNumber: null,
      orders:0,
      questionData: {
        number: 0,
        topicName: '选作题',
        rows: 7,
        startQuestion: 1,
        HorizontalLine: false, // 横行
        InsertTitle: false,
        Postpone: false,
        group: [
          {
            choices: '', // 几选几
            select: '',
            start: 1,
            end: '',
            score: '',
            id: 'optionalTopic',
            childGroup: [],
          },
        ],
      },
      marginHeight:0,
      rowHeight:35,
      heightTitle:46,
      oldAnswerData:{}
    }
  },
  computed: {
    ...mapState('questionType', [
      'subTopic_number',
      'subTopic_number_determine',
    ]),
    ...mapState('page', ['pageLayout']),
    ...mapState('answerQuestion', ['answerQuestionArr']),
    ...mapGetters('page', ['questionNumber_big_exist','questionOrder']),
    ...mapGetters('question',['options']),

    questionNumber_big(){
      return this.questionNumber_big_exist.length
    },

    errorMessage() {
      return this.errorVal != '' ? true : false
    },

    groupItemData() {
      return this.data.group.map((item) => item.childGroup)[0]
    },

    childGroups(){
      return this.data.group.map(item => item.childGroup).flat()
    },

    title(){
      return !this.editQuestionId ? '新增选作题' : '编辑选作题'
    },

    isdisabledFn(){
      return  this.groupItemData.length > 0 && !this.errorMessage ? false:true
    }
  },
  watch: {
    questionData: {
      immediate: true,
      handler() {
        let num = {}
        if (this.editQuestionId == null){
          num = {
            number: this.questionNumber_big,
            group:this.questionData.group.map(subtopic => ({
              ...subtopic,
              start: subtopic.end == '' ? this.subTopic_number : subtopic.start,
            }))
          }
        }
        this.data = {
          ...this.questionData,
          ...num,
        }
      },
    },

    childGroups:{
      immediate: true,
      handler(){
        this.subTopic_already_reset()
        if(this.childGroups.length > 0){
          this.subTopic_already_add(this.childGroups)
        }else{
          this.subTopic_already_add(this.subTopic_number_determine)
        }
        this.subTopic_number_calculate()
      }
    }
  },
  mounted() {
    this.closeData = JSON.parse(JSON.stringify(this.questionData))
    this.subTopic_number_calculate()
  },
  methods: {
    ...mapMutations('page', [
      'pageData_add',
      'pageData_edit',
      'pageData_insert',
    ]),
    ...mapMutations('questionType', [
      'subTopic_number_calculate',
      'subTopic_already_reset',
      'subTopic_already_add',
      'subTopic_calculate_determine',
      'subTopic_determine_pid_clean',
    ]),
    opened() {
      this.questionData.number = this.questionNumber_big
      this.data.number = this.questionNumber_big
      // 开打弹框
      this.openedFrame = true

      this.subTopic_already_add(this.subTopic_number_determine)
      this.subTopic_number_calculate()
    },
    openedEdit(obj) {
      let accessToken = JSON.parse(localStorage.getItem('accessToken'))
      this.oldOptionalData = accessToken.find(item=> obj.id === item.id)
      //编辑弹框
      this.editQuestionId = obj.id
      this.orders = obj.order
      this.openedFrame = true
      this.data = JSON.parse(JSON.stringify(obj))
      this.subTopic_number_calculate()
    },
    closeFrame() {
      // 关闭弹窗
      this.subTopic_number_calculate()
      this.questionData = JSON.parse(JSON.stringify(this.closeData))
      this.openedFrame = false
      this.subTopic_already_reset() // 清空临时小题group
      this.errorVal = ''
    },
    preCreateQuestion() {
      // 当前页内容所占高度topic, number,Postpone
      const { rows, InsertTitle, Postpone,group } = this.data

      let rectHeight = rows * this.rowHeight // 当前内容高度 45(内部高度)
      let heights = rectHeight + this.marginHeight + this.heightTitle

      let objId = `optional_${+new Date()}`

      let obj = {
        marginHeight: this.marginHeight,
        heightTitle: this.heightTitle,
        height: heights,
        rowHeight: this.rowHeight,
        id: objId,
        questionType: 'optionalQuestion',
        content:{
          ...this.data,
          scoreTotal:group[0].score,
          pageLayout:this.pageLayout
        },
        order: this.questionorder,
        first: true,
        titleContent:'',
        editorContent:[],
        segmentedArr:[],
        operatTinymce:[], // 判断富文本是否操作过
        tinymceCHeight:[],
        rowHeightArr:[], // 内容行高数组
        initialHeigh:heights, // 初始高度
      }
      if (this.editQuestionId == null) {
        if (InsertTitle && this.questionNumber_big_exist.length > 0) {
          let select = this.questionNumber_big_exist[this.existNumber]
          let data = {
              obj: {
                ...obj,
                order: this.questionorder,
              },
              bigId: select.id,
              SelfOrder: Postpone,
          }
          this.pageData_insert(data)
        } else {
          this.pageData_add({...obj,editorContent:[],segmentedArr:[],operatTinymce:[],tinymceCHeight:[],rowHeightArr:[]})

        }

      } else {
        let optional = this.oldOptionalData
        // 编辑
        this.subTopic_determine_pid_clean(this.childGroups[0].pid)
        obj.id = this.editQuestionId
        this.pageData_edit({...obj,
        order:this.orders,
        titleContent:optional.titleContent,
        editorContent:optional.editorContent,
        segmentedArr:optional.segmentedArr,
        operatTinymce:optional.operatTinymce,
        tinymceCHeight:optional.tinymceCHeight,
        rowHeightArr:optional.rowHeightArr
        })
      }
      //------------------------------------
      this.openedFrame = false // 关闭弹窗
      // 清空弹框数据

      this.subTopic_already_add(this.childGroups)
      this.subTopic_calculate_determine(this.childGroups)
      this.subTopic_number_calculate()

      this.data = JSON.parse(JSON.stringify(this.closeData))
    },
    changeStatus(val) {
      // 报错状态
      this.errorVal = val
    },
    hanldeSelectexistBig(e) {
      this.existNumber = e
    },
    preEditOptionalGroup(obj) {
      // 新增题组
      const index = this.data.group.findIndex((item) => item.id === obj.id)
      if (index > -1) {
        this.data.group.splice(index, 1, obj)
      }
    },
    rowsFunc() {
      if (this.data.rows <= 0) {
        this.errorVal = '行数必须大于0'
        this.isdisabledFn = true
      } else {
        this.errorVal = ''
        this.isdisabledFn = false
      }
    },
    hanldeSelect(e) {
      // 选择答题号
      this.questionData.number = e
      this.data.number = e
    },
  },
}
</script>

