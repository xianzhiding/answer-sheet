<template>
  <div>
    <div
      :class="pageLayout.asAbPaper ? 'header-panel' : ''"
      :style="{ height: heightT + 'px' }"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="150"
        height="78"
        v-if="pageLayout.asAbPaper"
      >
        <text x="4" y="27" style="font-size: 16px;">试卷</text>
        <text x="4" y="60" style="font-size: 16px;">类型</text>
        <text x="42" y="27" style="font-size: 16px;">试卷A</text>
        <text x="42" y="60" style="font-size: 16px;">试卷B</text>
        <rect
          x="0"
          y="0"
          width="40"
          height="78"
          :stroke="color"
          style="fill-opacity: 0;stroke-width: 1px;"
        ></rect>
        <rect
          x="89"
          y="17"
          width="17"
          height="10"
          :stroke="color"
          style="fill-opacity: 0;stroke-width: 1;"
        ></rect>
        <rect
          x="89"
          y="49"
          width="17"
          height="10"
          :stroke="color"
          style="fill-opacity: 0;stroke-width: 1;"
        ></rect>
      </svg>
      <div
        :class="['textVal-style', { active: previewIs }]"
        v-if="previewIs"
        v-html="data.textVal == '' ? '请输入答题卡标题' : data.textVal"
        :style="{ height: heightT + 'px' }"
      ></div>
      <hj-textarea
        v-else
        :style="{ height: heightT + 'px' }"
        :textarea-data="data.textVal"
      />
    </div>
    <div v-if="!pageLayout.asSecret">
    <student-info
      v-if="pageLayout.asNoteExist&&!pageLayout.asSecret"
      :data-a='pageLayout.asSecret'
      @hanldeStudent="hanldeStudent"
      :title-info= "data.titleInfo"
      :preview-is="previewIs"
      :color="color"
      :class="['student-row',pageLayout.column===3?'student-row-3':'student-row-2']"
    />
    <!-- v-if="!pageLayout.asSecret" -->
    
    <div class="precautions_box">
      <div
        :span="12"
        class="precautions_left"
        :style="{ width: pageNum==1&&pageLayout.asSecret ? '442px' :  'calc(100% - '+titleWidthRight+'px)', borderColor: color }"
      >
        <student-info
          v-if="!pageLayout.asNoteExist"
          @hanldeStudent="hanldeStudent"
          :title-info="data.titleInfo"
          :preview-is="previewIs"
          :color="color"
          :class="['student-col',pageLayout.column===3?'student-col-3':'student-col-2']"
        />
        <div class="precautions" v-if="pageLayout.asNoteExist">
          <div class="precautions_title" :style="{ borderColor: color, 'position': 'relative' }">
            注 意 事 项
            <!-- <el-button
              v-show="!previewIs"
              type="primary"
              size="mini"
              @click="editNoticesRules"
              >编辑</el-button
            > -->
          </div>
          <div
            :class="[
              'precautions_content',
              { active: pageWidth == 480 },
              { red: pageLayout.asRedCard },{
                precautions_sim: titleRows >9&&pageLayout.column===3
              }
            ]"
          >
            <!-- <div v-for="(item, index) in noticesRules" :key="index">
              {{ `${index + 1}. ${item}` }}
            </div> -->
            <div v-for="(item, index) in title_percautions" :key="index">
              {{ `${index + 1}. ${item}` }}
            </div>
          </div>
        </div>
        <div
          :class="[
            'precautions_mark',
            !svg ? 'col-2' : 'col-3',
            { red: pageLayout.asRedCard },{
                precautions_mark_sim: titleRows >9&&pageLayout.column===3
              }
          ]"
          v-if="pageLayout.asLackMark"
        >
          <span>样例<em class="diamond solid"></em></span><span>缺考<em class="diamond"></em></span><span>作弊<em class="diamond"></em></span>
        </div>
      </div>
      <div
        :span="12"
        class="precautions_right"
        v-if="pageLayout.schNumType == 1"
        :style="{ width: pageNum==1&&pageLayout.asSecret ? '247px' : titleWidthRight + 'px', borderColor: color }"
      >
        <div class="ticket_number" :style="{ borderColor: color }">
          <!-- 准考证号 -->
          {{admissionName}}
          <span
            v-show="!previewIs"
            class="precautions_edit layui-btn layui-btn-xs"
            @click="editAdmissionNumber"
            >编辑</span
          >
        </div>
          <!-- <ul class="exam-number">
            <li v-for="(item, i) in titleRows"
                :key="i"
                >
              <span :style="{ borderColor: color }"></span>
              <div
                  v-for="(row, i) in trDiv"
                  :key="row"
                  :style="{ minWidth: divWidth + 'px' }"
                >
                  <svg width="21" height="13" xmlns="http://www.w3.org/2000/svg">
                    <rect height="13" width="21" y="0" x="0" :stroke="color" fill="#ffffff"/>
                    <text text-anchor="start" font-size="9" y="9.58939" x="6.96114" stroke-width="0" stroke="#000" :fill="color">{{ i }}</text>
                  </svg>
                </div>
            </li>
          </ul> -->
        <table class="table_box" cellspacing="0" cellpadding="0" style="margin:0 auto;">
          <tbody>
            <tr>
              <th
                v-for="(item, i) in titleRows"
                :key="i"
                :style="{ borderColor: color }"
              />
            </tr>
            <tr>
              <td
                v-for="(item, i) in titleRows"
                :key="i"
                :style="{ borderColor: color }"
              >
                <div
                  v-for="(row, i) in trDiv"
                  :key="row"
                  :style="{ minWidth: divWidth + 'px' }"
                >
                  <!-- [<span>{{ i }} </span>] -->
                  <svg width="21" height="13" xmlns="http://www.w3.org/2000/svg">
                    <rect height="13" width="21" y="0" x="0" :stroke="color" fill="#ffffff"/>
                    <text text-anchor="start" font-size="9" y="9.58939" x="6.96114" stroke-width="0" stroke="#000" :fill="color">{{ i }}</text>
                  </svg>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div
        :span="12"
         v-if="!pageLayout.asSecret&&pageLayout.schNumType == 2"
        class="precautions_right"
        :style="{ width: titleWidthRight + 'px', borderColor: color }"
      >
        
        <!-- 贴条形码区 -->
        <div class="stick-area">
          <!-- <ul><li v-for="(item, i) in 8" :key="i"></li></ul> -->
          <div :class="['stick-code',{color:color} ]" :style="{ borderColor: color }">贴条形码区</div>
        </div>
      </div>
    </div>
  </div>

  <div class="regular-mark-box" v-if="pageLayout.asType==2 && pageLayout.asRegularMark">
    <div class="regular-strip" v-if="pageLayout.asScoreMode==1">
        <div>长条打分正确打分：
          <img :src="img.regular[0]"/>
          (得分为2分)
        </div>
        <div>
          修改打分：
          <img :src="img.regular[1]"/>
          (得分为4分,取填涂更多的为最终得分)
        </div>
      </div>
      <div class="regular-strip" v-if="pageLayout.asScoreMode==2">
        <div>长条打分正确打分：
          <img :src="img.regular[2]"/>
          (扣2分、最终得分2分)
        </div>
        <div>
          修改打分：
          <img :src="img.regular[3]"/>
          (扣4分、得分为0分,取填涂更多的为最终得分)
        </div>
    </div>
    <div class="regular-eachMark" v-if="pageLayout.asType==2 &&pageLayout.asScorePoint">
      <div v-if="pageLayout.asEachMark === 1">
      填空题每空打分:留空得满分
        <img :src="img.eachMark[0]" />
      </div>
      <div v-else>
        请保持卷面整洁，不折叠、不弄破答题纸，禁用涂改液涂改。
      </div>
    </div>
  </div>
    
</div>
</template>

<script>
import hjTextarea from './Precautions/_textarea'
import studentInfo from './Precautions/_studentInfo'
import { PRECAUTIONS } from '@/models/base'
import { mapGetters } from 'vuex'



export default {
  components: {
    hjTextarea,
    studentInfo,
  },
  props: {
    contentData: {
      type: Object,
      default() {
        return []
      },
    },
    previewIs: {
      type: Boolean,
      default: false,
    },
    questionData: {
      type: Object,
      default: () => { }
    },
    previewWidth:{
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      trDiv: 10,
      pageNum:this.$route.query.pageNum,
      studentInfoList: [],
      data: {},
      titleRows: this.questionData.content.titleRows,
      admissionName: this.questionData.content.admissionName,
      noticesRules: this.questionData.content.noticesRules,
      pageLayout: this.questionData.content.pageLayout,
      title_percautions: PRECAUTIONS,
      heightTitle: 30,
      img:{
        regular: [require('@/assets/img/regular1.jpg'),require('@/assets/img/regular2.jpg'),require('@/assets/img/regular3.jpg'),require('@/assets/img/regular4.jpg')],
        eachMark: [require('@/assets/img/eachMark.jpg'), require('@/assets/img/eachMark2.png')]
      }
    }
  },
  computed: {
    ...mapGetters('page', ['page_width']),
    pageWidth() {
      let width = this.$route.query.pageWidth
      return width !== undefined && parseInt(width) - 40 != this.page_width
        ? parseInt(width) - 40
        : this.page_width
    },

    cardData() {
      return this.contentData[0]
    },

    Rows() {
      return this.data.titleRows == 9 && this.pageWidth == 480 ? 26 : 28
    },

    svg() {
      return this.pageWidth == 480 ? true : false
    },
    color() {
      return this.pageLayout.asRedCard ? '#ff0000' : '#000000'
    },

    titleWidthLeft() {
      
      if (this.titleRows * this.Rows < 246) {
        return this.pageWidth - 246 - 6
      } else if(this.pageLayout.schNumType === 2){
        return this.pageWidth - 246
      } else {
        return this.pageWidth - this.titleRows * this.Rows - 6
      }
    },
    titleWidthRight() {
      if (this.titleRows * this.Rows < 246) {
        return 246
      } else if(this.pageLayout.schNumType === 2){
        return 246
      } else {
        return this.pageWidth - this.titleWidthLeft
      }
      
    },
    divWidth() {
      // return this.titleWidthRight == 246
      //   ? 246 / this.titleRows - 1
      //   : this.Rows - 1
      return 27
    },
    heightT(){
      const {content} = this.questionData
      let heightTitle = content.pageLayout.asAbPaper&&this.questionData.heightTitle < 78 ? 78 : this.questionData.heightTitle;
      return heightTitle
    }
  },
  watch: {
    questionData: {
      immediate: true,
      handler () {
        this.data = {
          ...this.questionData.content
        }
        this.titleRows = this.questionData.content.titleRows
        this.heightTitle = this.questionData.heightTitle
        this.admissionName = this.questionData.content.admissionName
        this.noticesRules = this.questionData.content.noticesRules
      }
    }
  },
  mounted() {

  },
  methods: {
    hanldeStudent(Arr) {
      console.log(Arr);
      this.$emit('hanldeStudent', Arr)
    },
    editAdmissionNumber() {
      this.$emit('edit-admission-number')
    },
    editNoticesRules() {
      this.$emit('edit-notices-rules')
    },
    hanldeCloseEsitor(){
    }
  },
}
</script>

<style lang="less">
@import '~@/assets/css/variables.less';

.stick-area{
  padding: 15px 5px;
  height: 246px;
  display:flex;
  flex-flow: column;
  justify-content: space-evenly;
  .stick-code{
    height: 142px;
    border: 1px dashed @font-888;
    line-height: 140px;
    text-align: center;
    border-radius: 15px;
    width: 234px;
  }
  ul{
    padding: 0;
    list-style: none;
    display: flex;
    justify-content: center;
    margin: 0;
    li{
      border: 1px solid @font-888;
      width: 26px;
      height: 26px;
      &:not(:last-child){
        border-right: none
      }
    }
  }

}
.header-panel {
  display: flex;
}
.red {
  color: red !important;
}
.student-list{
  position: relative;
  .titke-edit {
    position: absolute;
    top: 10px;
    right: 10px;
    font-size: 12px !important;
    height: 20px;
    line-height: 20px;
    padding: 0 6px;
    border-radius: 3px;
    color: @white;
    cursor: pointer;
    background-color: @main;
  }
  .title-item {
    display: flex;
    // min-width: 148px;
    span:last-child {
      flex: 1;
      margin-left: 10px;
      border-bottom: 1px solid @font-888;
    }
  }
}
.student-col {
  height: 242px;
  padding-left: 15px;
  padding-right: 15px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  .title-item {
    height: 30px;
    line-height: 30px;
    span:last-child {
      height: 22px;
    }
  }
}
.student-col-2{
  .title-item {
    width: 90%;
  }
}
.student-col-3{
  display: flex;
  box-sizing: border-box;
  .title-item {
    width: 100%;
  }
}
.student-row{
  display: flex;
  .title-item{
    height: 40px;
    line-height: 66px;
    span:last-child {
      height: 40px;
      margin-right: 15px;
    }
    
  }
}
.student-row-2{
  height: 40px;
  .title-item{
    width: calc(100% / 5);
    &:nth-child(5){
      span:last-child {
      margin-right: 0;
    }
    }
  }
}
.student-row-3{
  flex-wrap: wrap;
  // height: 80px;
  .title-item{
    width: calc(100% / 3);
    &:nth-child(3){
      span:last-child {
        margin-right: 0;
      }
    }
  }
}

.precautions_box {
  padding-top: 15px;
  display: flex;
  .precautions_left {
    border: 1px solid @font-888;
    height: 278px;
  }
  .precautions_right {
    border: 1px solid @font-888;
    min-width: 223px;
    border-left: none;
    height: 278px;
    position: relative;
    overflow: hidden;
  }
}
// .precautions_right {
//   display: flex;
//   flex-direction: column;
//   align-content: center;
//   align-items: center;
// }
.precautions {
  .precautions_title {
    height: 38px;
    line-height: 38px;
    border-bottom: 1px solid @font-333;
    text-align: center;
    width: 100%;
  }
  .precautions_content {
    padding-left: 10px;
    height: 203px;
    // border-bottom: 1px solid @font-333;
    font-size: 14px;
    line-height: 16px;
    &.active {
      div {
        padding: 3px 0 4px 0;
      }
    }
  }
  .precautions_sim{
    font-size: 12px;
    line-height: 15px;
    padding-bottom: 2px;
    padding-left: 4px;
    height: 200px;
    &.active {
      div {
        padding: 3px 0 1px 0;
      }
    }
  }
}
.precautions_left.columns .precautions_content {
  height: 141px;
  font-size: 12px;
  margin-top: 5px;
}
.precautions_title,
.ticket_number {
  height: 38px;
  line-height: 38px;
  // border-bottom: 1px solid @font-888;
  text-align: center;
  width: 100%;
}
.ticket_number_list{
  display: flex;
  ul{
    padding: 0;
    margin: 0;
    list-style: none;
  }
  li{
    &:not(:nth-child(0)){
      border-left: 1px solid @font-333;
    }
    font-size: 12px;
    text-align: center;
    padding-top: 4px;
    min-width: 27px;
    height: 16px;
  }
}
.layui-btn-xs {
  height: 22px;
  line-height: 22px;
  padding: 0 5px;
  font-size: 12px;
  display: inline-block;
  background-color: @main;
  color: @white;
  white-space: nowrap;
  text-align: center;
  border: none;
  border-radius: 2px;
  cursor: pointer;
}
.precautions_content div {
  padding: 9px 0;
  margin: 0 0;
}
.precautions_edit {
  position: absolute;
  right: 15px;
  top: 8px;
}
.precautions_mark {
  border-top: 1px solid @font-333;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  // height: 40px;
  color: @font-333;
  &.col-2,&.col-3{
    display: flex;
    align-items: center;
    height: 33px;
    line-height: 33px;
    font-size: 16px;
  }
  .diamond {
    display: inline-block;
    border: 1px solid #000;
    width: 17px;
    height: 10px;
    margin-left: 8px;
    &.solid {
      background-color: #000;
    }
  }
  &.precautions_mark_sim{
    font-size: 12px;
    &.col-2,&.col-3{
    line-height: inherit
  }
    span{
      display: flex;
      flex-flow: column;
      // align-content: center;
      align-items: center;
    }
    .diamond{
      margin-left: 0;
    }
  }
}
.el-textarea__inner {
  border-style: dashed;
  padding: 0 0;
  text-align: center;
  // line-height: 31px;
  font-size: 23px;
  border-color: @font-888;
  color: @font-333;
}

.exam-number{
  display: flex;
  padding: 0;
  list-style: none;
  margin: 0 auto;
  li{
    text-align: center;
  }
  span{
    width: 27px;
    height: 27px;
    display: block;
    border: 1px solid transparent;
  }
  li:not(:last-child){
    span{
      border-right-width: 0;
    }
  }
  div {
  font-size: 12px;
  text-align: center;
  padding-top: 7px;
  min-width: 27px;
  height: 20px;
}
}

table tr td div:last-child {
  margin-bottom: 6px;
}

.table_box th {
  height: 28px;
}

.table_box div {
  font-size: 12px;
  text-align: center;
  padding-top: 7px;
  min-width: 27px;
  height: 20px;
}

.table_box div span {
  position: relative;
  top: 1px;
  left: 1.8px;
}

.table_box tr th {
  border: 1px solid @font-888;
}

// .table_box td,
// .table_box th {
//   // border-left: 1px dashed @font-333;
// }

// .table_box td:first-child,
// .table_box th:first-child {
//   // border-left: none;
// }
// // .table_box td:last-child,
// .table_box th:last-child {
//   // border-right: 1px dashed @font-333;
// }
.el-input--medium {
  font-size: 23px !important;
}
.el-textarea__inner {
  padding: 0 0 !important;
  border-style: dashed !important;
  border-color: @font-888 !important;
}
.table_box td:first-child {
  height: 186px;
}
.textVal-style {
  text-align: center;
  font-size: 24px;
  word-break: break-all;
  // font-weight: bold;
  &.active {
    line-height: 36px;
    height: auto;
    // flex: 1;
    // margin-right: 15px;
  }
}

.regular-mark-box {
  border: 1px solid rgb(136, 136, 136);
  overflow: hidden;
  letter-spacing: 0px;
  word-spacing: 1px;
  font-size: 14px;
  margin-top: 10px;
  .regular-strip,.regular-eachMark{
    padding: 5px;
    div {
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      align-items: center;
      flex-wrap: wrap;
    }
    
  }
  .regular-strip{
    height: 68px;
    img {
      height: 30px;
      vertical-align: middle;
    }
  }
  .regular-eachMark{
    padding-top: 0;
    img{
      height: 25px;
    }
  }
}
</style>

