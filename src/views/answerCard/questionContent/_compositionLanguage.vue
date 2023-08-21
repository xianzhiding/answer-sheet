<template>
  <div class="question-info">
    <div
      class="question-title"
      ref="tinyeditor"
      v-if="data.first && !data.segmented"
      :style="{'height':maxHeight + 'px'}"
    >
      <tiny-vue class="title-span"
        v-model="content"
        @input="changeContent"
        :max-height="maxHeight"
        :readonly="readonly"
        ref="tinyMCE"
      />
    </div>

    <!-- 'border-bottom':!data.orderFirst || !pageIndex ? 'none' : '1px solid #000', -->
<div class="hand-read-bar" :style="{
  'marginBottom':'10px',
        'border-top':!data.orderFirst || !pageIndex ? '1px solid #000' : 'none',
      }" v-if="data.first&& !data.segmented && pageLayout.asType === 2" v-html="renderScoreMode"></div>
    <div class="question_arrays" v-if="!previewIs">
      <div class="question_editOrDel language">
        <el-checkbox style="margin-right: 10px" v-if="data.first&& !data.segmented && pageLayout.asType === 2" v-model="showDecimal" @change="handleCheckDecimal">0.5</el-checkbox>
        <span  class="btn_addSub_name spacing">行间距：</span>
        <span class="btn_addSub" @click="subtractSpacing">-</span>
        <span class="btn_addSub_info">{{contentData.spacing.label}}</span>
        <span class="btn_addSub" @click="addSpacing">+</span>
        <el-button type="primary" size="mini" @click="compositionLanguagehEdit">编辑</el-button>
        <el-button type="primary" size="mini" @click="delHanlde">删除</el-button>
      </div>
    </div>
    
    <div class="answer_question_box composition_box">
      <!-- <template v-if="data.first && data.borderTop == undefined && !data.segmented">
        <div class="Language_item_title">
          <span>{{contentData.topic}}.</span>
        </div>
      </template> -->
      <div class="compositionLanguage_box">
        <p
          v-for="(rowsList, i) in rowsData"
          :key="i"
          class="compositionLanguage_item"
          :style="{
            height:
              i != rowsData.length
                ? data.rowHeight + 'px'
                : data.rowHeight - contentData.spacing + 'px',
          }"
        >
          <a
            v-for="(lattices, a) in latticeData"
            :key="'id_' + (i * data.lattice + (a += 1))"
            class="svg_span"
            :style="{
              height: data.rowWidth - 1 + 'px'
            }"
          >
          
         

            <svg
              xmlns="http://www.w3.org/2000/svg"
              version="1.1"
              height="30"
              width="30"
              v-show="
                /(^[1-9]\d*$)/.test((i * data.lattice + a + superiorGrid) / 200) &&
                contentData.mark == '3'
              "
            >
              <text x="0" y="15" style="font-size:6px">
                {{ i * data.lattice + (a += 1) + superiorGrid - 1 }}字
              </text>
            </svg>

            <svg
              xmlns="http://www.w3.org/2000/svg"
              version="1.1"
              height="30"
              width="30"
              v-show="
                /(^[1-9]\d*$)/.test((i * data.lattice + a + superiorGrid) / 100) &&
                contentData.mark == '2'
              "
            >
              <text x="0" y="15" style="font-size:6px">
                {{ i * data.lattice + (a += 1) + superiorGrid - 1 }}字
              </text>
            </svg>

            <svg
              xmlns="http://www.w3.org/2000/svg"
              version="1.1"
              height="30"
              width="30"
              v-show="
                (i * data.lattice + (a += 1) + superiorGrid - 1) == contentData.minWordCount &&
                contentData.mark == '1'
              "
            >
              <text x="0" y="15" style="font-size:6px">
                {{ contentData.minWordCount }}字
              </text>
            </svg>
          </a>
        </p>
      </div>
    </div>
    <el-dialog
      title="提示"
      :visible.sync="openedPrompt"
      width="400px"
      center
      :modal-append-to-body="false"
      :close-on-click-modal="false"
      append-to-body>
      <span>先阅后扫三栏情况下勾选0.5分，题块最高分只能为59分!</span>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" type="primary" @click="openedPrompt = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import { QUESTION_NUMBERS, DECIMAL_OBJ } from '@/models/base'

import tinyVue from '@/components/tinymce'
export default {
  components: {
    tinyVue,
  },
  props: {
    questionData: {
      type: Object,
      default: () => {},
    },
    contentData: {
      type: Object,
      default: () => {},
    },
    previewWidth:{
      type: Number,
      default: 0
    },
    readonly: {
      type: Number,
      default: 0
    },
    previewIs: {
      type: Boolean,
      default: false,
    }
  },
  data() {
    return {
      openedPrompt: false,
      isEditor: false,
      data: {},
      cotent: '',
      options: QUESTION_NUMBERS.map((label,value)=>({label,value})),
      maxHeight: 24,
      pageLayout: this.contentData.pageLayout,
      showDecimal: false,
      miniScoreHeight:0
    }
  },
  computed: {
    ...mapState('page', ['pageData']),

    strLong() {
      let long = this.contentData.topic.toString().length
      return parseInt(long) * 8 + 1
    },
    topicData() {
      return ''
    },
    rowsData() {
      const {
        heightTitle,
        marginHeight,
        castHeight,
        first,
        borderTop,
        rowHeight,
        segmentedArr,
        segmented,
        totalRow,
      } = this.data
      let row = 0
      if (first && !segmented) {
        row = Math.floor((castHeight - marginHeight - heightTitle) / rowHeight)
      } else {
        row = Math.floor(castHeight / rowHeight)
        if(segmentedArr.length - 1 == segmented){
          row = totalRow
          segmentedArr.forEach((num,i) => {
            if(i != segmented){
              row -= num
            }
          })
        }
      }

      let Arr = []
      for (let i = 1; i <= row; i++) {
        Arr.push(i)
      }
      return Arr
    },
    latticeData() {
      let Arr = []
      for (let i = 1; i <= this.data.lattice; i++) {
        Arr.push(i)
      }
      return Arr
    },
    superiorGrid(){
      const {segmentedArr,lattice,segmented} = this.data
      let nums = 0
      // 解析格子总数
      for(let i = 1 ; i <= segmentedArr.length;i++){
        if(i <= segmented){
          nums += segmentedArr[i - 1]
        }
      }
      return nums * lattice
    }
    ,
    renderScoreMode(){
      const lattice = 21 //this.pageLayout.column ===3 ? 21 : 28
      let html = '';
      for (let i = 0; i < lattice; i++) {
        html +=`<span class="item"><span>${this.scoreMode[i] ? this.scoreMode[i] : ''}</span></span>`
      }
      return html
    },
    scoreMode(){
      let asScoreMode = this.pageLayout.asScoreMode;
      return this.large20concat.map(item=> asScoreMode==2&&item>0 ?item*-1 :item)
    }
    /* ,large20concat() {
      const isDecimal = this.showDecimal ? DECIMAL_OBJ.array : DECIMAL_OBJ.array.slice(0).splice(3);
      if(this.pageLayout.column !== 3 && this.data.content.scoreTotal < 14 && this.showDecimal){
        return DECIMAL_OBJ.decimal.slice(0).splice(0, (this.data.content.scoreTotal*2)+1)
      }else if(this.data.content.scoreTotal < 11 && this.showDecimal){
        return DECIMAL_OBJ.decimal.slice(0).splice(0, (this.data.content.scoreTotal*2)+1)
      }
      if(this.pageLayout.column !== 3){
        return this.data.content.scoreTotal > 27 || this.showDecimal ? [...isDecimal,...DECIMAL_OBJ.array.slice(0).splice(3, (this.data.content.scoreTotal/10)+1)]: Array.from({length: this.data.content.scoreTotal + 1}, (x, i) => i+'')
      }else{
        return this.data.content.scoreTotal > 21 || this.showDecimal ? [...isDecimal,...DECIMAL_OBJ.array.slice(0).splice(3, (this.data.content.scoreTotal/10)+1)]: Array.from({length: this.data.content.scoreTotal + 1}, (x, i) => i+'')
      }
    } */
    ,large20concat() {
      let totalScore = this.data.content.scoreTotal;
      let bigArr = []
      for (let i=0; i<=totalScore; i++){if((i/10)%1 === 0){bigArr.push(i+'')}}
      if(totalScore > 17&&totalScore <= 20){
        // return this.showDecimal ? [...DECIMAL_OBJ.bigArr, ...bigArr]: Array.from({length: totalScore + 1}, (x, i) => i+'')
        return Array.from({length: totalScore + 1}, (x, i) => i+'')
      }else if(totalScore > 20){
        return [...DECIMAL_OBJ.bigArr, ...bigArr]
      }else if(totalScore < 11 && this.showDecimal){
        return DECIMAL_OBJ.decimal.slice(0).splice(0, (totalScore*2)+1)
      }else{
        return this.showDecimal ? DECIMAL_OBJ.array.slice(0).splice(0, (totalScore*1)+4) : Array.from({length: totalScore + 1}, (x, i) => i+'')
      }
    }
  },
  watch: {
    questionData: {
      immediate: true,
      handler() {
        this.data = {
          ...this.questionData,
        }
        this.content = ''
        const {titleContent, heightTitle, showDecimal} = this.questionData
        const {topicName,number,score} = this.contentData
          
          if(!titleContent){
            this.content = `<p><strong>${this.options[number].label}.${topicName}&nbsp;&nbsp;(${score})分</strong></p>`
          }else{
            this.content = titleContent
          }
          this.maxHeight = heightTitle
          this.showDecimal = showDecimal
      },
    },
  },

  methods: {

    ...mapMutations('page', [
      'pageData_del',
      'pageData_id_clean',
      'pageData_edit',
    ]),

    ...mapMutations('questionType', [
      'subTopic_already_del',
      'subTopic_number_calculate',
      'subTopic_determine_clean',
    ]),

    ...mapMutations('page',['pageData_edit_title']),

    hanldeCloseEsitor(content) {
      this.isEditor = false
      this.cotent = content
    },

    hanldeEditor() {
      this.isEditor = true
    },
    // 是否显示小数 0.5
    handleCheckDecimal(val){
      let {id} = this.data
      let index = this.pageData.findIndex((item => item.id === id))
      let questionObj = this.pageData[index]
      if(this.pageLayout.column===3 &&this.data.content.scoreTotal>60){
        this.showDecimal = false
        return this.openedPrompt = true
      }else{
        this.showDecimal = val
        this.pageData_edit({
          ...questionObj,
          showDecimal: val
        })
      }
    },
    compositionLanguagehEdit() {
      this.$emit('composition-language-edit', this.data)
    },

    subtractSpacing(){
      const { label,value } = this.data.content.spacing
      let spacLabel = label - 0.2
          spacLabel = Number(spacLabel.toFixed(2))
      let spacVal = value - 0.5
          spacVal =  Number(spacVal.toFixed(2))

      if(spacLabel < 1){
        this.$message({
          message: '行间距最小值1',
          type: 'warning'
        });
      }else{
        this.$emit('subtract-spacing',{
          ...this.data,
          content:{
            ...this.data.content,
            spacing:{
              label:spacLabel,
              value:spacVal
            }
          }
        })
      }
    },

    addSpacing(){
      const { label,value } = this.data.content.spacing

      let spacLabel = label + 0.2
          spacLabel = Number(spacLabel.toFixed(2))
      let spacVal = value + 0.5
          spacVal =  Number(spacVal.toFixed(2))

      if(spacLabel <= 2.8){
        this.$emit('subtract-spacing',{
          ...this.data,
          content:{
            ...this.data.content,
            spacing:{
              label:spacLabel,
              value:spacVal
            }
          }
        })
      }else{
        this.$message({
          message: '行间距最大值2.8',
          type: 'warning'
        });
      }
    },

    delHanlde() {
      // 删除大题-小题数
      const index = this.pageData.findIndex((itme) => itme.id === this.data.id)
      if (index > -1) {
        this.subTopic_already_del([this.contentData])
        this.subTopic_determine_clean(this.contentData.topic)

        this.pageData_id_clean(this.data.id)
        this.subTopic_number_calculate()
      }
    },

    changeContent(obj){
      const {val,tinyHeight} = obj
      const index = this.pageData.findIndex(question => question.id == this.questionData.id)

      let height = val ? tinyHeight + 2 : 2
      this.maxHeight = height // 最大高度

      if(index > -1){
        let curObj = this.pageData[index]

        let data = {
          question:{
            ...curObj,
            titleContent:val,
            heightTitle:height,
            height:(curObj.height - curObj.heightTitle) + height
          },
          index:index,
        }

        this.pageData_edit_title(data)
      }
    }
  },
}
</script>

<style lang="less">
// .answer_question_box.composition_box {
//   padding: 5px;
// }
.Language_item_title {
  height: 37px;
  position: relative;
  line-height: 37px;
  font-size: 14px;
}
.compositionLanguage_box {
  border: 1px solid #000;
  border-top-color: #000;
  .compositionLanguage_item {
    margin: 0;
    display: flex;

    a {
      flex-shrink:1;
      border: 1px solid #000;
      border-left: none;
      width: 100%;
    }

    a:last-child {
      border-right: none;
    }
  }
  .compositionLanguage_item:first-child {
    a {
      border-top: none;
    }
  }
}
.svg_span {
  position: relative;
  svg {
    position: absolute;
    top: 20px;
    left: 5px;
    z-index: 9999;
  }
}
.spacing{color: #333}
</style>

<style lang="less" scoped>
  // .composition_box{
  //   border: 1px solid #888;
  // }
  .miniScoreHeight{
    border-left: 1px solid #000;
    border-right: 1px solid #000;
  }
</style>

