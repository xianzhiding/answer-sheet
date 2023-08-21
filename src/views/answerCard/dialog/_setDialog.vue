<template>
  <el-dialog
    class="newAdd-content"
    :title="title"
    :visible.sync="openedFrame"
    :width="'500px'"
    :before-close="closeFrame"
    :show-close="false"
    :close-on-click-modal="false"
    center
  >
    <div class>
      <el-row>
        <el-col :span="6">纸张大小</el-col>
        <el-col :span="18">
          <div
            v-for="item in sizeArr"
            :key="item.id"
            :class="['paper', { active: item.id === paperSpec }]"
            @click="changeSize(item.id)"
          >
            <span class="paper-size" :style="{width:item.id == 'A4' ? '35px' : '50px'}">{{ item.id }}</span>
            <div class="title">{{ item.content }}</div>
          </div>
        </el-col>
      </el-row>
      <el-row class="el_row_layout">
        <el-col :span="6">答题卡布局</el-col>
        <el-col :span="18">
          <div
            v-for="row in layoutArr"
            :key="row.id"
            :class="['paper', { active: row.id == layout }]"
            v-show="row.pid === paperSpec"
            @click="hanldeColumns(row)"
          >
            <span v-if="row.id == 1">
              <svg width="37px" height="42px" viewBox="0 0 37 42" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                  <g id="1栏备份" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                      <rect id="底框" stroke="#979797" opacity="0" x="-8" y="0" width="48" height="48"></rect>
                      <path
                        d="M34,0 C35.6568542,0 37,1.34314575 37,3 L37,3 L37,39 C37,40.6568542 35.6568542,42 34,42 L34,42 L3,42 C1.34314575,42 0,40.6568542 0,39 L0,39 L0,3 C0,1.34314575 1.34314575,0 3,0 L3,0 Z M34,2 L3,2 C2.44771525,2 2,2.44771525 2,3 L2,3 L2,39 C2,39.5522847 2.44771525,40 3,40 L3,40 L34,40 C34.5522847,40 35,39.5522847 35,39 L35,39 L35,3 C35,2.44771525 34.5522847,2 34,2 L34,2 Z M30,34 C30.5522847,34 31,34.4477153 31,35 L31,36 C31,36.5522847 30.5522847,37 30,37 L7,37 C6.44771525,37 6,36.5522847 6,36 L6,35 C6,34.4477153 6.44771525,34 7,34 L30,34 Z M30,27 C30.5522847,27 31,27.4477153 31,28 L31,29 C31,29.5522847 30.5522847,30 30,30 L7,30 C6.44771525,30 6,29.5522847 6,29 L6,28 C6,27.4477153 6.44771525,27 7,27 L30,27 Z M30,20 C30.5522847,20 31,20.4477153 31,21 L31,22 C31,22.5522847 30.5522847,23 30,23 L7,23 C6.44771525,23 6,22.5522847 6,22 L6,21 C6,20.4477153 6.44771525,20 7,20 L30,20 Z M30,5 C30.5522847,5 31,5.44771525 31,6 L31,14 C31,14.5522847 30.5522847,15 30,15 L7,15 C6.44771525,15 6,14.5522847 6,14 L6,6 C6,5.44771525 6.44771525,5 7,5 L30,5 Z"
                        id="形状结合" :fill="row.id == layout? color :activeColor" fill-rule="nonzero"></path>
                  </g>
              </svg>
            </span>
            <span v-if="row.id == 2">
              <svg width="52px" height="42px" viewBox="0 0 52 42" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                  <g id="2栏备份" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                      <rect id="底框" stroke="#979797" opacity="0" x="-8" y="0" width="48" height="48"></rect>
                      <path
                        d="M49,0 C50.6568542,0 52,1.34314575 52,3 L52,3 L52,39 C52,40.6568542 50.6568542,42 49,42 L49,42 L3,42 C1.34314575,42 0,40.6568542 0,39 L0,39 L0,3 C0,1.34314575 1.34314575,0 3,0 L3,0 Z M49,2 L3,2 C2.44771525,2 2,2.44771525 2,3 L2,3 L2,39 C2,39.5522847 2.44771525,40 3,40 L3,40 L49,40 C49.5522847,40 50,39.5522847 50,39 L50,39 L50,3 C50,2.44771525 49.5522847,2 49,2 L49,2 Z M44,34 C44.5522847,34 45,34.4477153 45,35 L45,36 C45,36.5522847 44.5522847,37 44,37 L28,37 C27.4477153,37 27,36.5522847 27,36 L27,35 C27,34.4477153 27.4477153,34 28,34 L44,34 Z M23,34 C23.5522847,34 24,34.4477153 24,35 L24,36 C24,36.5522847 23.5522847,37 23,37 L7,37 C6.44771525,37 6,36.5522847 6,36 L6,35 C6,34.4477153 6.44771525,34 7,34 L23,34 Z M44,27 C44.5522847,27 45,27.4477153 45,28 L45,29 C45,29.5522847 44.5522847,30 44,30 L28,30 C27.4477153,30 27,29.5522847 27,29 L27,28 C27,27.4477153 27.4477153,27 28,27 L44,27 Z M23,27 C23.5522847,27 24,27.4477153 24,28 L24,29 C24,29.5522847 23.5522847,30 23,30 L7,30 C6.44771525,30 6,29.5522847 6,29 L6,28 C6,27.4477153 6.44771525,27 7,27 L23,27 Z M44,20 C44.5522847,20 45,20.4477153 45,21 L45,22 C45,22.5522847 44.5522847,23 44,23 L28,23 C27.4477153,23 27,22.5522847 27,22 L27,21 C27,20.4477153 27.4477153,20 28,20 L44,20 Z M23,20 C23.5522847,20 24,20.4477153 24,21 L24,22 C24,22.5522847 23.5522847,23 23,23 L7,23 C6.44771525,23 6,22.5522847 6,22 L6,21 C6,20.4477153 6.44771525,20 7,20 L23,20 Z M23,5 C23.5522847,5 24,5.44771525 24,6 L24,14 C24,14.5522847 23.5522847,15 23,15 L7,15 C6.44771525,15 6,14.5522847 6,14 L6,6 C6,5.44771525 6.44771525,5 7,5 L23,5 Z M44,12 C44.5522847,12 45,12.4477153 45,13 L45,14 C45,14.5522847 44.5522847,15 44,15 L28,15 C27.4477153,15 27,14.5522847 27,14 L27,13 C27,12.4477153 27.4477153,12 28,12 L44,12 Z M44,5 C44.5522847,5 45,5.44771525 45,6 L45,7 C45,7.55228475 44.5522847,8 44,8 L28,8 C27.4477153,8 27,7.55228475 27,7 L27,6 C27,5.44771525 27.4477153,5 28,5 L44,5 Z"
                        id="形状结合" :fill="row.id == layout? color :activeColor" fill-rule="nonzero"></path>
                  </g>
              </svg>
            </span>
            <span v-if="row.id == 3">
              <svg width="52px" height="42px" viewBox="0 0 52 42" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                  <g id="3栏备份" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                      <rect id="底框" stroke="#979797" opacity="0" x="-8" y="0" width="48" height="48"></rect>
                      <path
                        d="M49,0 C50.6568542,0 52,1.34314575 52,3 L52,3 L52,39 C52,40.6568542 50.6568542,42 49,42 L49,42 L3,42 C1.34314575,42 0,40.6568542 0,39 L0,39 L0,3 C0,1.34314575 1.34314575,0 3,0 L3,0 Z M49,2 L3,2 C2.44771525,2 2,2.44771525 2,3 L2,3 L2,39 C2,39.5522847 2.44771525,40 3,40 L3,40 L49,40 C49.5522847,40 50,39.5522847 50,39 L50,39 L50,3 C50,2.44771525 49.5522847,2 49,2 L49,2 Z M15,34 C15.5522847,34 16,34.4477153 16,35 L16,36 C16,36.5522847 15.5522847,37 15,37 L7,37 C6.44771525,37 6,36.5522847 6,36 L6,35 C6,34.4477153 6.44771525,34 7,34 L15,34 Z M30,34 C30.5522847,34 31,34.4477153 31,35 L31,36 C31,36.5522847 30.5522847,37 30,37 L22,37 C21.4477153,37 21,36.5522847 21,36 L21,35 C21,34.4477153 21.4477153,34 22,34 L30,34 Z M45,34 C45.5522847,34 46,34.4477153 46,35 L46,36 C46,36.5522847 45.5522847,37 45,37 L37,37 C36.4477153,37 36,36.5522847 36,36 L36,35 C36,34.4477153 36.4477153,34 37,34 L45,34 Z M15,27 C15.5522847,27 16,27.4477153 16,28 L16,29 C16,29.5522847 15.5522847,30 15,30 L7,30 C6.44771525,30 6,29.5522847 6,29 L6,28 C6,27.4477153 6.44771525,27 7,27 L15,27 Z M30,27 C30.5522847,27 31,27.4477153 31,28 L31,29 C31,29.5522847 30.5522847,30 30,30 L22,30 C21.4477153,30 21,29.5522847 21,29 L21,28 C21,27.4477153 21.4477153,27 22,27 L30,27 Z M45,27 C45.5522847,27 46,27.4477153 46,28 L46,29 C46,29.5522847 45.5522847,30 45,30 L37,30 C36.4477153,30 36,29.5522847 36,29 L36,28 C36,27.4477153 36.4477153,27 37,27 L45,27 Z M15,20 C15.5522847,20 16,20.4477153 16,21 L16,22 C16,22.5522847 15.5522847,23 15,23 L7,23 C6.44771525,23 6,22.5522847 6,22 L6,21 C6,20.4477153 6.44771525,20 7,20 L15,20 Z M30,20 C30.5522847,20 31,20.4477153 31,21 L31,22 C31,22.5522847 30.5522847,23 30,23 L22,23 C21.4477153,23 21,22.5522847 21,22 L21,21 C21,20.4477153 21.4477153,20 22,20 L30,20 Z M45,20 C45.5522847,20 46,20.4477153 46,21 L46,22 C46,22.5522847 45.5522847,23 45,23 L37,23 C36.4477153,23 36,22.5522847 36,22 L36,21 C36,20.4477153 36.4477153,20 37,20 L45,20 Z M15,5 C15.5522847,5 16,5.44771525 16,6 L16,14 C16,14.5522847 15.5522847,15 15,15 L7,15 C6.44771525,15 6,14.5522847 6,14 L6,6 C6,5.44771525 6.44771525,5 7,5 L15,5 Z M30,12 C30.5522847,12 31,12.4477153 31,13 L31,14 C31,14.5522847 30.5522847,15 30,15 L22,15 C21.4477153,15 21,14.5522847 21,14 L21,13 C21,12.4477153 21.4477153,12 22,12 L30,12 Z M45,12 C45.5522847,12 46,12.4477153 46,13 L46,14 C46,14.5522847 45.5522847,15 45,15 L37,15 C36.4477153,15 36,14.5522847 36,14 L36,13 C36,12.4477153 36.4477153,12 37,12 L45,12 Z M30,5 C30.5522847,5 31,5.44771525 31,6 L31,7 C31,7.55228475 30.5522847,8 30,8 L22,8 C21.4477153,8 21,7.55228475 21,7 L21,6 C21,5.44771525 21.4477153,5 22,5 L30,5 Z M45,5 C45.5522847,5 46,5.44771525 46,6 L46,7 C46,7.55228475 45.5522847,8 45,8 L37,8 C36.4477153,8 36,7.55228475 36,7 L36,6 C36,5.44771525 36.4477153,5 37,5 L45,5 Z"
                        id="形状结合" :fill="row.id == layout? color :activeColor" fill-rule="nonzero"></path>
                  </g>
              </svg>
            </span>
            <div class="title">{{ row.content }}</div>
          </div>
        </el-col>
      </el-row>
      <el-row class="el_row_layout">
        <el-col :span="6">阅卷方式</el-col>
        <el-col :span="18">
          <el-radio-group v-model="asType">
            <el-radio v-for="item in asTypeArr" :key="item.id" :label="item.id" @change="handleAsType(item.id)">{{item.content}}</el-radio>
          </el-radio-group>
        </el-col>
      </el-row>
    </div>

    <div slot="footer" :class="['dialog-footer',{createLayout:createLayout}]">
      <el-button v-if="!createLayout" @click="closeFrame">取 消</el-button>
      <el-button type="primary" :disabled="isdisabledFn" @click="preCreateTitle">{{btnName}}</el-button>
    </div>

    <question-dialog ref="questionDialogs" />
  </el-dialog>
</template>

<script>
import { mapState, mapMutations,mapGetters} from 'vuex'
import { TITLE_SUDENTINFO, LAYOUT_COLUMNS ,LAYOUT_SIZE, LAYOUT_ASTYPE} from '@/models/base'

import questionDialog from '../dialog/_objectiveQuestion'
export default {
  components: {
    questionDialog,
  },
  props: {
    propLayout: {
      type: Object,
      default: () => {},
    },
  },
  data () {
    return {
      acid: null,
      openedFrame: false,
      title: '创建答题卡',
      isdisabledFn: false,
      createLayout: true,
      sizeArr: LAYOUT_SIZE,
      layoutArr: LAYOUT_COLUMNS,
      asTypeArr: LAYOUT_ASTYPE,
      paperSpec: this.propLayout.paperSpec,
      layout: this.propLayout.column,
	    asType: this.propLayout.asType,
      titleInfo:TITLE_SUDENTINFO,
      color:'#4587E7',
      activeColor:'#666',
      heightTitle:40,
      checkHeight: 0, //40,
      switchtype: false,
      miniScoreHeight: 0
      
    }
    
  },
  computed: {
    ...mapState('titleSet', ['textVal', 'titleRows', 'admissionName']),
    ...mapGetters('page', ['questionOrder']),
    ...mapState('page', ['pageLayout','pageData']),

    btnName(){
      return this.createLayout ? '创 建' : '确 定'
    },

    change(){
      return this.createLayout ? 0 : 1
    },
    contentHeight(){
      return this.pageLayout.asType == 2 && this.pageLayout.asRegularMark
        ? 383
        : this.pageLayout.asType == 2 &&
          this.pageLayout.asRegularMark &&
          this.pageLayout.asScorePoint
        ? 418
        : 293
    }
  },
  watch: {
    propLayout: {
      immediate: true,
      handler () {
        this.paperSpec = this.propLayout.paperSpec
        this.layout = this.propLayout.column
	      this.asType = this.propLayout.asType
      },
    }
  },
  methods: {
    ...mapMutations('pageContent', [
      'pageLayout_launch_page',]),

    ...mapMutations('page',[
      'pageLayout_change',
      'pageLayout_switch_mode',
      'pageData_add',
      'pageData_edit',
      'reset_pageData'
    ]),

    openRForm (type) {
      if (type === 1) {
        this.createLayout = true
      } else {
        this.createLayout = false
        this.title = '编辑答题卡'
      }
      this.openedFrame = true
    },
    closeFrame () {
      this.openedFrame = false
    },
    preCreateTitle () {
      this.pageLayout.paperSpec =this.paperSpec
      this.pageLayout.column= this.layout
      this.pageLayout.asType= this.asType
      this.pageLayout.miniScoreHeight= this.miniScoreHeight
      this.pageLayout_change(this.pageLayout);
      this.pageLayout_switch_mode(this.asType);

      if(this.pageData[0] != undefined){
        this.heightTitle = this.pageData[0].heightTitle
      }
      const TestData = {
        id: 'AnswerSheet',
        contentHeight: this.pageLayout.asSecret ? 0 : 293,
        questionType: 'AnswerSheetTitle',
        marginHeight: 0,
        heightTitle: this.heightTitle,
        height: this.contentHeight + this.heightTitle,
        checkHeight:this.checkHeight,
        // regularMarkHeight: this.asType===2&&this.pageLayout.asRegularMark ? 90 : 0,
        // scorePointHeight: this.asType===2&&this.pageLayout.asScorePoint ? 35 : 0,
        regularMarkHeight: 0,
        scorePointHeight: 0,
        content: {
          textVal: this.textVal,
          titleInfo: this.titleInfo,
          titleRows: this.titleRows,
          admissionName: this.admissionName,
          pageLayout:this.pageLayout
        },
        order: this.questionOrder,
        first: true,
        layoutChange:true
      }
      if(this.layout === 3 && this.pageLayout.asNoteExist){
        TestData.checkHeight = 80
      }else if(this.layout !== 3 && this.pageLayout.asNoteExist){
        TestData.checkHeight = 40
      }else if(this.layout === 3 && this.pageLayout.asRegularMark){
        // TestData.contentHeight = 418
      }else if(this.layout === 3 && this.pageLayout.asNoteExist && this.pageLayout.asRegularMark){
        // TestData.contentHeight = 373 + 125
      }
      if (this.change) {
        this.openedFrame = false
        this.pageData_edit(TestData)
      } else {
        // 新增值
        this.pageData_add(TestData)
      }
      this.openedFrame = false
    },

    changeSize (item) {
      this.paperSpec = item
      this.layout = this.paperSpec === 'A4' ? 1 : this.paperSpec === 'A3' ? 2 : this.layout
    },
    hanldeColumns (item) {
      this.layout = item.id
    },
    handleAsType(item){
      this.asType = item
      this.miniScoreHeight = item === 2 ? 25 : 0
    }
  }
}
</script>

<style lang="less" scoped>
@import '~@/assets/css/variables.less';
.createLayout {
  text-align: center;
}
.paper {
  display: inline-block;
  width: 90px;
  text-align: center;
  cursor: pointer;
  .title {
    margin-top: 5px;
  }
  &.active {
    color: @main;
  }
}
.paper-size {
  display: inline-block;
  width: 50px;
  height: 40px;
  border: 2px solid;
  border-radius: 3px;
  line-height: 45px;
  cursor: pointer;
}
.el_row_layout {
  margin-top: 20px;
}
</style>
