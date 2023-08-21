<template>
  <!-- 作文语文 -->
  <el-dialog
    class="newAdd-content composition_box"
    :title="title"
    :visible.sync="openedFrame"
    :width="'600px'"
    :before-close="closeFrame"
    :close-on-click-modal="false"
    center
  >
    <div class="dialog_content">
      <div class="item-box ">
        <el-row>
          <el-col :span="10" class="select-item">
            <div class="label">大题题号:</div>
            <hj-select
              :items="options"
              size="mini"
              :value="data.number"
              @change="hanldeSelect"
            ></hj-select>
          </el-col>
          <el-col :span="8" class="select-item composition_item">
            <div class="label">题目:</div>
            <el-input
              v-model="data.topicName"
              size="mini"
            ></el-input>
          </el-col>
          <el-col :span="4" class="select-item composition_item_5">
            <el-checkbox v-model="data.Attach">附加题</el-checkbox>
          </el-col>
        </el-row>
      </div>
      <div class="item-box">
        <el-row>
          <el-col :span="12" class="select-item composition_topic">
            <div class="label">小题题号:</div>
            <el-input
              v-model.number="data.topic"
              size="mini"
            />
            <span>题</span>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12" class="select-item">
            <div class="label">分数:</div>
            <el-input
              v-model="data.score"
              @input="hanldeRowsFunc"
              @blur="hanldeVerification"
              size="mini"
            />
            <span>分</span>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12" class="select-item">
            <div class="label">字数最少:</div>
            <el-input
              v-model="data.minWordCount"
              @input="hanldeRowsFunc"
              @blur="hanldeVerification"
              size="mini"
            />
            <span>字</span>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24" class="select-item">
            <div class="label">字数标记:</div>
            <el-radio v-model="data.mark" label="1"
              >最少字数显示标记</el-radio
            >
            <!-- <el-radio v-model="data.mark" label="1"
              >最少字数处显示一个字数标记</el-radio
            > -->
            <el-radio v-model="data.mark" label="2"
              >每100字显示标记</el-radio>
            <el-radio v-model="data.mark" label="3"
              >每200字显示标记</el-radio>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12" class="select-item">
            <div class="label">总字数:</div>
            <el-input
              v-model.number="data.totalWordCount"
              @input="hanldeRowsFunc"
              @blur="hanldeVerification"
              size="mini"
            />
            <span>字</span>
          </el-col>
        </el-row>
      </div>
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
      <div class="error-message" v-if="errorMessage">{{ errorVal }}</div>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button type="cancel" @click="closeFrame">取 消</el-button>
      <el-button
        type="primary"
        :disabled="isdisabledFn"
        @click="preCreateQuestion"
        >确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { mapState, mapMutations,mapGetters } from 'vuex'
import { PAGE_HEIGHT } from '@/models/base'

export default {
  components: {},
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
        number: 1, // 大题号
        topicName: '作文', // 题目
        Attach: false,
        topic: 1,
        score: '',
        minWordCount: 800,
        mark: '1', // 1 ，2
        totalWordCount: 1000,
        spacing: {value:2,label:1}, // 间距
        InsertTitle: false,
        Postpone: false,
      },
      editData: {},
      changeClick:false,
      page_height:PAGE_HEIGHT,
      marginHeight: 0,
      rowTitle:24,
      heightTitle:24
    }
  },
  computed: {
    ...mapState('questionType', [
      'questionNumber',
      'subTopic_number',
      'subTopic_number_determine',
    ]),

    ...mapState('pageContent', ['pageHeight',]),
    ...mapState('page', [
      'pageData',
      'pageLayout',
    ]),

    ...mapGetters('page',['questionNumber_big_exist','questionorder']),

    ...mapGetters('question',['options']),

    questionNumber_big(){
      return this.questionNumber_big_exist.length
    },

    title(){
      return this.editQuestionId ? '编辑作文' : '设置'
    },

    errorMessage() {
      return this.errorVal != '' ? true : false
    },
    isdisabledFn() {
      return !this.editQuestionId && !this.changeClick ?  true :
              this.changeClick && this.errorVal != '' ?  true :false
    },
    tabStatusVal() {
      const { topic, score, minWordCount, totalWordCount } = this.data
      let subTopic_number_determine = this.subTopic_number_determine
      let str = ''
      /* if (subTopic_number_determine.length > 0) {
        let index = subTopic_number_determine.findIndex((item) => item.topic == topic)
        if (index > -1) {
          if (
            this.editQuestionId != null &&
            this.editData.content.topic == this.data.topic
          ) {
            str = ''
          } else {
            str = `${topic}题已经存在，请勿重复添加`
          }
        }
      } */
      return topic == '' ? '小题题号不能为空' : 
            score == '' ? '分数不能为空':
            score > 99 ? '分数不能大于99':
            this.pageLayout.column===3 && score > 89 ? '三栏分数不能大于89':
            minWordCount == ''? '最少字数不能为空':
            totalWordCount == ''? '总字数不能为空':
            minWordCount > totalWordCount? '最少字数不能大于总字数': str != ''? str: ''
    },
    tabStatus() {
      const { topic, score, minWordCount, totalWordCount } = this.data
      let subTopic_number_determine = this.subTopic_number_determine

      let str = ''
      /* if (subTopic_number_determine.length > 0) {
        let index = subTopic_number_determine.findIndex((item) => item.topic == topic)
        if (index > -1) {
          if (
            this.editQuestionId != null &&
            this.editData.content.topic == this.data.topic
          ) {
            str = ''
          } else {
            str = `${topic}题已经存在，请勿重复添加`
          }
        }
      } */
      return score == ''? true:
      // topic == ''? true:
              minWordCount == ''? true:
              totalWordCount == ''? true:
              minWordCount > totalWordCount? true:
              str != ''? true: false
    },
    currentPageHeight() {
      let heights = this.pageHeight[this.pageHeight.length - 1]
        .map((item) => item)
        .reduce((accumulator, currentValue) => {
          return accumulator + currentValue
        })

      let currentPageHeight = this.page_height - heights - 32 // 当前页剩余可用高度
      return currentPageHeight
    },
    BeforeEditing() {
      let num = 0
      if (this.editQuestionId == null) {
        num = this.currentPageHeight
      }
      return num
    }
  },
  watch: {
    questionData: {
      immediate: true,
      handler() {
        this.data = {
          ...this.questionData,
        }
        if (this.editQuestionId == null) {
          this.$nextTick(() => {
            this.data = {
              ...this.data,
              number: this.questionNumber_big,
              topic: this.subTopic_number,
            }
          })
        }
        this.existNumber =
          this.questionNumber_big_exist.length > 0
            ? this.questionNumber_big_exist[0].value
            : null
      },
    },
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
      'pageData_id_clean',
    ]),

    ...mapMutations('questionType', [
      'subTopic_number_calculate',
      'subTopic_already_reset',
      'subTopic_already_add',
      'subTopic_calculate_determine',
    ]),

    opened() {
      this.questionData = JSON.parse(
        JSON.stringify({
          ...this.questionData,
          number: this.questionNumber_big,
          topic: this.subTopic_number,
        })
      )
      // 开打弹框
      this.openedFrame = true

      this.subTopic_already_add(this.subTopic_number_determine)
      this.subTopic_number_calculate()
    },

    openedEdit(obj) {
      this.editData = JSON.parse(JSON.stringify(obj))
      //编辑弹框
      this.subTopic_number_calculate()
      this.editQuestionId = obj.id
      this.orders = obj.order
      this.openedFrame = true
      this.data = JSON.parse(JSON.stringify(obj.content))
    },

    changeSpacing(obj){
      this.editData = JSON.parse(JSON.stringify(obj))
      this.editQuestionId = obj.id
      this.orders = obj.order
      this.data = JSON.parse(JSON.stringify(obj.content))

      this.$nextTick(()=>{
        this.preCreateQuestion()
      })
    },

    closeFrame() {
      // 关闭弹窗
      this.subTopic_number_calculate()
      this.questionData = JSON.parse(JSON.stringify(this.closeData))
      this.openedFrame = false
      this.subTopic_already_reset() // 清空
      this.errorVal = ''
    },
    hanldeStatus(val) {
      // 报错状态
      this.errorVal = val
    },
    preOptionalData(obj) {
      // 新增题组
      const index = this.data.group.findIndex((item) => item.id === obj.id)
      if (index > -1) {
        this.data.group.splice(index, 1, obj)
      }
    },
    preCreateQuestion() {
      const { InsertTitle, Postpone,score } = this.data //  spacing, totalWordCount,
      let marginHeight = this.pageLayout.asType === 2 ?34: this.marginHeight
      this.errorVal = this.tabStatusVal
      if (!this.tabStatus) {
        let objId = `compositionLanguage_${+new Date()}`
        //------------------------------------------------------------
        let obj = {
          heightTitle: this.heightTitle,
          marginHeight: marginHeight,
          height: 0,
          id: objId,
          questionType: 'compositionLanguage',
          content: {
            ...this.data,
            scoreTotal:parseFloat(score),
            pageLayout:this.pageLayout
          },
          first: true,
          rowHeight: 0,
          rowWidth: 0,
          superiorGrid:0, // 上级格子数量
          titleContent:''
        }
        this.subTopic_already_add([this.data])

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
            this.pageData_add(obj)
          }
          this.subTopic_calculate_determine([this.data])

        } else {
          this.pageData_edit({ ...obj, id: this.editQuestionId ,titleContent:''})
        }
        this.subTopic_number_calculate()
        this.data = JSON.parse(JSON.stringify(this.closeData))
        this.openedFrame = false
      }
    },
    hanldeRowsFunc() {
      const { minWordCount, score, totalWordCount } = this.data
      if (minWordCount <= 0) {
        this.errorVal = '最少字数必须大于0'
      } else if (score <= 0) {
        this.errorVal = '分数必须大于0'
      } else if (totalWordCount <= 0) {
        this.errorVal = '最少字数不能大于总字数'
      } else {
        this.errorVal = ''
      }
    },
    hanldeVerification() {
      this.changeClick = true
      this.errorVal = this.tabStatusVal
    },
    hanldeSelect(e) {
      // 选择答题号
      this.questionData.number = e
      this.data.number = e
    },
    hanldeSelectexistBig(e) {
      this.existNumber = e
    },
  },
}
</script>

<style lang="less">
@import '~@/assets/css/variables.less';
.el-radio__input.is-checked + .el-radio__label {
  color: @main !important;
}
.el-radio__input.is-checked .el-radio__inner {
  border-color: @main !important;
  background: @main !important;
}
.el-radio__inner:hover {
  border-color: @main !important;
}
.el-input.is-active .el-input__inner,
.el-input__inner:focus {
  border-color: @main !important;
}
.dialog_content{
  .error-message{
    margin-left: 15px;
  }
}
</style>

