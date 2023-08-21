<template>
  <!-- 作文英 -->
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
            <el-input v-model="data.topicName" size="mini" placeholder=""></el-input>
          </el-col>
          <el-col :span="4" class="select-item composition_item_5">
            <el-checkbox v-model="data.Attach">附加题</el-checkbox>
          </el-col>
        </el-row>
      </div>
      <div class="item-box">
        <el-row>
          <el-col :span="24" class="select-item composition_topic">
            <div class="label">小题题号:</div>
            <el-input
              v-model.number="data.topic"
              size="mini"
              placeholder=""
            />
            <span>题</span>
            <el-checkbox class="margin-left: 20px" v-model="data.showTopic">是否显示小题号</el-checkbox>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24" class="select-item">
            <div class="label">分数:</div>
            <el-input
              v-model.number="data.score"
              @blur="hanldeVerification"
              @input="hanldeRowsFunc"
              size="mini"
              placeholder=""
            />
            <span>分</span>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24" class="select-item">
            <div class="label">作文行数:</div>
            <el-input
              v-model.number="data.rows"
              @blur="hanldeVerification"
              @input="hanldeRowsFunc"
              size="mini"
              placeholder=""
            />
            <span style="margin-right: 20px">行</span>
            <el-checkbox v-model="data.lineLattice">四线格</el-checkbox>
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
      <div class="error-message" v-if="errorMessage"><i></i>{{ errorVal }}</div>
    </div>
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
import { mapState, mapMutations,mapGetters } from 'vuex'
import { PAGE_HEIGHT } from '@/models/base'
import Checkbox from '../../../components/elementUi/checkbox.vue'

export default {
  components: {Checkbox},
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
        topicName: '作文',
        rows: 10,
        topic: 1,
        Attach: false,
        score: '',
        InsertTitle: false,
        Postpone: false,
        lineLattice: false,
        showTopic: false,
      },
      editData: {},
      changeClick:false,
      page_height:PAGE_HEIGHT,
      heightTitle:24,
      marginHeight: 0,
      rowHeight: 35
    }
  },
  computed: {
    ...mapState('questionType', [
      'subTopic_number',
      'subTopic_number_determine',
    ]),
    ...mapState('pageContent', [
      'pageHeight',
    ]),
    ...mapState('page', [
      'pageData',
      'pageLayout',
    ]),
    ...mapGetters('page', ['questionNumber_big_exist','questionorder']),
    ...mapGetters('question',['options']),

    title(){
      return this.editQuestionId ? '编辑作文' : '设置'
    },
    questionNumber_big(){
      return this.questionNumber_big_exist.length
    },
    errorMessage() {
      return this.errorVal != '' ? true : false
    },
    groupItemData() {
      return this.data.group.map((item) => item.childGroup)[0]
    },
    isdisabledFn() {
      return !this.editQuestionId && !this.changeClick ?  true :
              this.changeClick && this.errorVal != '' ?  true :false
    },
    tabStatusVal() {
      const { topic, score, rows } = this.data
      let subTopic_number_determine = this.subTopic_number_determine
      let str = ''
      if (subTopic_number_determine.length > 0) {
        let index = subTopic_number_determine.findIndex((item) => item.topic == topic)
        if (index > -1) {
          if (
            this.editQuestionId != null &&
            this.editData.content.topic == this.data.topic
          ) {
            str = ''
          } else {
            // str = `${topic}题已经存在，请勿重复添加`
          }
        }
      }
      return score == ''
        ? '分数不能为空'
        : score > 99
        ? '分数不能大于99'
        : this.pageLayout.column===3 && score > 89
        ? '三栏分数不能大于89'
        : rows == ''
        ? '作文行数不能为空'
        : topic == ''
        ? '小题题号不能为空'
        : str != ''
        ? str
        : ''
    },
    tabStatus() {
      const { topic, score, rows } = this.data
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
      return score == ''? true :
              rows == ''? true :
                // topic == ''? true:
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
    },
    miniScoreHeight(){
      return this.pageLayout.miniScoreHeight
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
    closeFrame() {
      // 关闭弹窗
      this.subTopic_number_calculate()
      this.questionData = JSON.parse(JSON.stringify(this.closeData))
      this.openedFrame = false
      this.subTopic_already_reset() // 清空
      this.errorVal = ''
    },

    preCreateQuestion() {
      const { rows, InsertTitle, Postpone, score, lineLattice} = this.data
      this.errorVal = this.tabStatusVal
      let rowHeight = lineLattice ? 43 : this.rowHeight
      let rectHeight = rows * rowHeight // 当前内容高度 45(内部高度)
      let marginHeight = this.pageLayout.asType === 2 ?34: this.marginHeight
      let heights = rectHeight + marginHeight + this.heightTitle + 7
      if (!this.tabStatus) {
        let objId = `compositionEnglish_${+new Date()}`
        //------------------------------------------------------------
        let obj = {
          heightTitle: this.heightTitle,
          marginHeight: marginHeight,
          height: heights,
          rowHeight: rowHeight,
          id: objId,
          questionType: 'compositionEnglish',
          content: {
            ...this.data,
            scoreTotal:parseFloat(score),
            pageLayout:this.pageLayout,
            initRow:rows
          },
          first: true,
          titleContent:'',
          editorContent:[],
          segmentedArr:[],
          operatTinymce:[], // 判断富文本是否操作过
          tinymceCHeight:[],
          rowHeightArr:[], // 内容行高数组
        }
        // return;
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
          this.pageData_edit({ 
            ...obj, 
            id: this.editQuestionId,
            // ...this.editData,
            // height: obj.height,
            // rowHeight: obj.rowHeight,
            // content: obj.content
          })
        }

        this.subTopic_number_calculate()
        this.data = JSON.parse(JSON.stringify(this.closeData))
        this.openedFrame = false
      }
    },
    hanldeRowsFunc() {
      const { rows, score } = this.data
      if (rows <= 0) {
        this.errorVal = '作文行数必须大于0'
      } else if (score <= 0) {
        this.errorVal = '分数必须大于0'
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
.composition_box {
  .el-dialog__body {
    padding: 10px 0 15px !important;
  }
  .Insert_box {
    margin-top: 20px;
  }
  .dialog_content {
    border-bottom: 1px solid #eee;
    padding: 0 20px 30px;
  }
  .select-item .label {
    width: 85px;
    line-height: 28px;
    top: 0;
  }
  .dialog-footer {
    padding-top: 15px;
    padding-right: 20px;
  }
  .item-box:nth-child(n + 2) {
    .el-row {
      margin-top: 20px;
      span {
        line-height: 28px;
        padding-left: 10px;
      }
    }
  }
  .select-item:last-child {
    margin-top: 0;
  }
  .composition_item {
    margin-left: 35px;
  }
  .composition_item_5 {
    margin-left: 11px;
    line-height: 28px;
  }
  .composition_topic {
    .el-input.el-input--mini {
      width: 68px;
    }
    .el-input--mini .el-input__inner {
      width: 68px;
      text-align: center;
    }
  }
  .el-input--mini .el-input__inner {
    text-align: center;
    padding: 0 0;
  }
  .el-radio__inner {
    margin-left: -10px;
  }
  .error-message {
    margin-top: 15px;
    margin-left: -17px;
    i {
      display: inline-block;
      width: 4px;
      height: 4px;
      border-radius: 50%;
      background-color: red;
      position: relative;
      left: -10px;
    }
  }
}
</style>
