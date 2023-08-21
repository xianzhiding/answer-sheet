<template>
  <!-- 解答题 -->
  <div class="question-info">
    <div
      class="question-title"
      ref="tinyeditor"
      v-if="!data.orderFirst && data.first"
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

	<div class="hand-read-bar" 
      v-if="this.data.first&& this.pageLayout.asType === 2"
      :style="{
        'border-top':!data.orderFirst || !pageIndex ? '1px solid #000' : 'none',
        'border-bottom':!data.orderFirst || !pageIndex ? 'none' : '1px solid #000',
      }" v-html="renderScoreMode"></div>
    <div class="question_arrays" v-if="!previewIs">
      <div class="question_editOrDel" v-if="data.first">
        <el-checkbox style="margin-right: 10px" v-model="showDecimal" v-if="data.first&& pageLayout.asType === 2" @change="handleCheckDecimal">0.5</el-checkbox>
        <el-button type="primary" size="mini" @click="subTopic_numberAnswerEdit">编辑</el-button>
        <el-button type="primary" size="mini" @click="delHanlde">删除</el-button>
      </div>
    </div>
    <drag-change-height
      
      @height-resize="handleResize($event)"
      :question="questionData"
      :previewIs="previewIs"
      :style="{
        'border-top':!data.orderFirst || !pageIndex ? '1px solid #000' : 'none',
      }"
    >
      <div
        class="content-info"
        :style="{height: tinymceHeight + 'px'}"
      >
      <div v-if="!previewIs" class="totalScore">[总分{{questionData.content.scoreTotal}}]</div>
        <!-- 富文本编辑区 -->
        <!-- <div v-if="!previewIs"> -->
          <!-- v-if="!previewIs" -->
          <trigger-tinymce
            @tinymce-change="tinymceChangeFunc"
            v-model="editorDetail"
            :readonly="readonly"
            :style="{height: tinymceHeight + 'px'}"
            ref="tinymceBox"
            v-if="!previewIs"
            >
          </trigger-tinymce>
          <trigger-tinymce
            v-else
            v-model="editorDetail"
            :readonly="readonly"
            :style="{height: tinymceHeight + 'px'}"
            ref="tinymceBox"
            >
            <!-- v-if="!previewIs" -->
          </trigger-tinymce>
          <!-- <trigger-tinymce
            @tinymce-change="tinymceChangeFunc"
            v-model="editorDetail"
            :readonly="readonly"
            :style="{height: tinymceHeight + 'px'}"
            ref="tinymceBox"
            v-else
          >
          </trigger-tinymce>
        </div> -->
        <!-- <div class="content-info-preview" v-else :style="{height: tinymceHeight + 'px'}"  v-html="editorDetail"></div> -->
      </div>
    </drag-change-height>

  </div>
</template>

<script>
import { mapState, mapMutations, mapGetters} from 'vuex'
import { PAGE_HEIGHT, QUESTION_NUMBERS, DECIMAL_OBJ } from '@/models/base'
import { useArrayCutHook } from '@/assets/js/useArrayCutHook'

import tinyVue from '@/components/tinymce'
import triggerTinymce from '@/components/tinymce/triggerEditor'
import dragChangeHeight from '../questionContent/drag'

export default {
  components: {
    tinyVue,
    triggerTinymce,
    dragChangeHeight,
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
    previewIs: {
      type: Boolean,
      default: false
    },
    pageIndex:{
      type: Number,
      default: 0,
    },

    previewContent: {
      type: Boolean,
      default: false
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
      isEditor: false,
      data: {},
      content: '',
      options: QUESTION_NUMBERS.map((label,value)=>({label,value})),
      maxHeight: 30,
      tinymceHeight:30,
      str:'&ensp;',
      pageLayout: this.contentData.pageLayout,
      page_height: PAGE_HEIGHT,
      strP:'</p>',
      tinymceEditObj:{}, // 用于区分富文本编辑后
      showDecimal: false,
      miniScoreHeight:0,
      isShowHd:{}
    }
  },
  computed: {
    ...mapState('page', ['pageData']),
    ...mapGetters('page', ['page_width']),

    topicData() {
      
      return this.contentData.group
    },
    rowsData() {
      console.log(this.data);
      return Array.from(Array(this.data.rows*1), (v,k) =>k+1)
    },

    pageWidth () {
      // return this.previewWidth == 0 ? this.page_width - 20 - 12 : this.previewWidth - 40
      // console.log(this.previewWidth);
      return this.previewWidth == 0 ? this.page_width : this.previewWidth - 40
    },
    showMiniScoreHeight(){
      return this.data.first&& this.pageLayout.asType === 2
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
      if(this.pageLayout.column !== 3 && this.data.score < 14 && this.showDecimal){
        return DECIMAL_OBJ.decimal.slice(0).splice(0, (this.data.score*2)+1)
      }else if(this.data.score < 11 && this.showDecimal){
        return DECIMAL_OBJ.decimal.slice(0).splice(0, (this.data.score*2)+1)
      }
      if(this.pageLayout.column !== 3){
        return this.data.score > 27 || this.showDecimal ? [...isDecimal,...DECIMAL_OBJ.array.slice(0).splice(3, (this.data.score/10)+1)]: Array.from({length: this.data.score + 1}, (x, i) => i+'')
      }else{
        return this.data.score > 19 || this.showDecimal ? [...isDecimal,...DECIMAL_OBJ.array.slice(0).splice(3, (this.data.score/10)+1)]: Array.from({length: this.data.score + 1}, (x, i) => i+'')
      }
    } */
    ,large20concat() {
      let totalScore = this.data.score;
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
    ,isHorizontalLine(){
      return this.contentData.HorizontalLine
    },
    questionInfo() {
      const {first,content,score,topic, scoreNo, rowHeight} = this.data
      let pList = ''
      let Arr = []
      // console.log('pageWidth', this.pageWidth);
      if(this.rowsData.length>0){
        this.rowsData.forEach((item,i) =>{
          let titleStr = `${scoreNo}` + (content.showScore ? ` (${ score }分)` : '')
          let span1 =  i == 0 && first  ? `&ensp;${titleStr}&ensp; ` : ''
          let titleStrLong = i == 0 && first  ? titleStr.length * 10 : 0
  
          let spaceLong = Math.ceil((this.pageWidth - 26 - titleStrLong ) / 6)
          let spaceSum = ''
          for(let x = 0; x < spaceLong;x++){
            spaceSum += this.str
          }
  
          let span2 = content.HorizontalLine ? `<span style="text-decoration: underline;"> ${spaceSum} </span>` :`<span> ${this.str} </span>`
          if(content.HorizontalLine || i == 0){
            pList += `<p>${span1}${span2}</p>
            ` // 需要空一行回车，这样才能筛选行数，不能删除
          }
          // else{
          //   pList += `<p></p>`
          // }
          Arr.push(rowHeight)
        })
  
        return  {data:pList,Arr:Arr}
      }
    },

    editorDetail(){
      let { editorContent,segmented,id,operatTinymce, rowHeightArr, segmentedArr } = this.tinymceEditObj
      console.log(segmentedArr.length);
      console.log(operatTinymce);
      // 判断是否进行过富文本编辑
      if (operatTinymce[segmented] == undefined) {
        editorContent[segmented] = this.questionInfo.data
        rowHeightArr[segmented] = this.questionInfo.Arr
        this.pageData_editorStr({
          id:id,
          content:editorContent,
          rowHeightArr:rowHeightArr,
        })
      }
      // debugger
			return editorContent[segmented]
    }
  },
  watch: {
    questionData: {
      immediate: true,
      handler() {
        console.log(this.questionData);
        this.data = {
          ...this.questionData,
        }

        const {castHeight,heightTitle,segmented,titleContent,scoreTotal,first, marginHeight, showDecimal} = this.questionData
        this.tinymceHeight = first&&!segmented ? castHeight - heightTitle - marginHeight : castHeight
        this.maxHeight = heightTitle
        this.showDecimal = showDecimal
        this.content = ''
        let {number,topicName} = this.contentData
        if(!titleContent){
          this.content = `<p><strong>${this.options[number].label}.${topicName}&nbsp;&nbsp;(${scoreTotal})分</strong></p>`
        }else{
          this.content = titleContent
        }
        this.pageLayout = this.contentData.pageLayout
        // 作用于富文本编辑之后
        // this.tinymceEditObj = JSON.parse(JSON.stringify(this.questionData ))
        this.tinymceEditObj = this.questionData

        if(this.$refs.tinymceBox != undefined){
          this.$refs.tinymceBox.editorHtml()
        }

      },
    },

  },
  methods: {
    ...mapMutations('page', [
      'pageData_del',
      'pageData_edit',
      'pageData_orderFirst',
      'pageData_editorStr',
    ]),

    ...mapMutations('questionType', [
      'subTopic_already_del',
      'subTopic_number_calculate',
      'subTopic_determine_clean',
    ]),

    ...mapMutations('page', [
      'pageData_edit_title'
    ]),

    hanldeEditor() {
      this.isEditor = true
    },
    // 是否显示小数 0.5
    handleCheckDecimal(val){      
      let {id} = this.data
      let index = this.pageData.findIndex((item => item.id === id))
      let questionObj = this.pageData[index]
      if(this.pageLayout.column===3 &&this.data.content.scoreTotal>59){
        this.showDecimal = false
        return this.openedPrompt = true
      }else{
        this.showDecimal = val
        this.pageData_edit({
          ...questionObj,
          showDecimal: val
        })
      }
    }
    ,subTopic_numberAnswerEdit() {
      this.$emit('current-question-answer-edit', this.data)
    },

    delHanlde() {
      let {group} = this.data.content
      let questionGroup = group[0]

      const {sid,fid,pid,id} = this.data

      if(sid){
        //三节
        let index = questionGroup.childGroup.findIndex(question => question.id === fid)
        if(index > -1){
          let levelTwo = questionGroup.childGroup[index]
          let twoIndex = levelTwo.childGroup.findIndex(question => question.id === pid)
          if(twoIndex > -1){
            let levelThree = levelTwo.childGroup[twoIndex]
            let threeIndex = levelThree.childGroup.findIndex(question => question.id === id)
            if(threeIndex > -1){
              if(levelTwo.childGroup.length <= 1){
                questionGroup.childGroup.splice(index,1)
              }else if(levelThree.childGroup.length <= 1){
                levelTwo.childGroup.splice(twoIndex,1)
              }else{
                levelThree.childGroup.splice(threeIndex,1)
              }
            }
          }
        }
      }else if(fid && !sid){
        //二节
        let index = questionGroup.childGroup.findIndex(question => question.id === pid)
        if(index > -1){
          let levelTwo = questionGroup.childGroup[index]
          let twoIndex = levelTwo.childGroup.findIndex(question => question.id === id)
          if(twoIndex > -1){

            if(levelTwo.childGroup.length <= 1){
              questionGroup.childGroup.splice(index,1)
            }else{
              levelTwo.childGroup.splice(twoIndex,1)
            }
          }
        }
      }else if(id && !fid && !sid){
        //一节
        let index = questionGroup.childGroup.findIndex(question => question.id === id)
        if(index > -1){
          questionGroup.childGroup.splice(index,1)
          this.subTopic_already_del([this.data])
          this.subTopic_determine_clean(this.data.topic)
        }
      }
      // 删除大题-小题数
      const index = this.pageData.findIndex((itme) => itme.id === this.data.id)
      if (index > -1) {
        this.pageData_del(index)
        this.pageData_orderFirst({objId:this.data.objId,scoreTotal:this.data.scoreTotal - this.data.score})
      }
      this.subTopic_number_calculate()

    },

    handleResize (height) {
      const index = this.pageData.findIndex(obj => this.questionData.id === obj.id)
      if(index > -1){
        let questionObj = this.pageData[index]
        // if(questionObj.first&&height<=35) return;
        // height = questionObj.first&&!questionObj.orderFirst&&height<=35 ? (questionObj.heightTitle + questionObj.miniScoreHeight+ 35) : questionObj.first&&height<=35 ? 35 : height
        questionObj.answerArrHeight[questionObj.orderFirst] = height
        questionObj.height = height
        questionObj.initialHeigh = height
        console.log(questionObj);
        this.pageData_edit({
            ...questionObj,
            answerArrHeight: questionObj.answerArrHeight,
            initialHeigh: questionObj.initialHeigh,
            height: questionObj.height,
            content: {
              ...questionObj.content,
              rows: !questionObj.content.HorizontalLine ? Math.floor(questionObj.height / questionObj.rowHeight): questionObj.content.rows
            }
        })

      }
    },
    // 标题
    changeContent(obj){
      const {val,tinyHeight} = obj
      const index = this.pageData.findIndex(question => question.id == this.questionData.id && question.first)
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

    },

    //改变内容
    tinymceChangeFunc(obj){
      // 富文本参数
      const eidtObj = JSON.parse(JSON.stringify(this.tinymceEditObj))
      const {val, tinyHeight} = obj
      const {segmented, operatTinymce, rowHeight} = eidtObj
      const {HorizontalLine} = eidtObj.content
      // 更改富文本编辑后行高数组--------------------------------------------------
      let tinyMceRowHeight = []
      if(HorizontalLine){
        const tinymcePList = val.match(/<(\w+)[^<>]*>(?:<(\w+)[^<>]*>.*?<\/\2>|.)*?<\/\1>/g)
        if(tinymcePList){
          tinymcePList.forEach(() => {
            tinyMceRowHeight.push(35)
          })
        }
      }else{
        let rows = Math.floor(tinyHeight / 35)
        tinyMceRowHeight = Array(rows).fill(rowHeight)
      }
      this.tinymceHeight = tinyHeight // 最大高度 */
      // 标记富文本进行过编辑
      operatTinymce[segmented] = 1
      this.editConten(eidtObj,tinyHeight,val,tinyMceRowHeight)
    },


    editConten(eidtObj,tinyHeight,val,tinyMceRowHeight){
      let tinymceEditObj = JSON.parse(JSON.stringify(eidtObj))
      const { editorContent,segmented,first,id,marginHeight,operatTinymce,rowHeight, rowHeightArr,remainderHeight,heightTitle,orderFirst,answerArrHeight,height,castHeight} = tinymceEditObj
      const index = this.pageData.findIndex(question => question.id == id)
      let containerHeight, // 容器高度
          // containerHeightNext,
          difference = 0, // 差值
          differenceLong = 0, // 差值长度
          nextSegmented = segmented + 1,// 数组中-当前位置之后一位
          setArrContent = [],
          overflowArrs = [],
          operatTinymceArr = [],
          // 内容高度小于内容框高度差值
          // impairment = 0,
          // 富文本字符串
          overflowHeight = 0,
          currentContentArr = []
          currentContentArr = val.match(/<p>.*?<\/p>/g, '')
          //计算容器容纳高度
          if(first && !orderFirst){
            containerHeight = (remainderHeight - marginHeight - heightTitle)
          }else{
            containerHeight = this.page_height
          }
          // 计算当前容器内容高度
          tinyMceRowHeight.forEach(num =>{
            difference += num
            if(containerHeight < difference){
              differenceLong += 1
            }
          })
          if(editorContent[segmented] != undefined){
            if(differenceLong > 0){
              // 截取溢出的高度
              editorContent[segmented] = val
              rowHeightArr[segmented] = tinyMceRowHeight
              operatTinymceArr = editorContent.map(() => {return 1})
              // overflowHeight = tinyHeight + heightTitle + marginHeight
              overflowHeight = height
              answerArrHeight[orderFirst] = overflowHeight
            }else{
              if(containerHeight > difference && editorContent[nextSegmented] != undefined){
                //内容低于内容高度
                //内容框高度 - 内容
                let contentHeight = tinyMceRowHeight.reduce((total, currentValue)=> total + currentValue, 0)
                containerHeight = contentHeight
                operatTinymceArr = editorContent.map(() => {return 1})
                editorContent[segmented] = val
                rowHeightArr[segmented] = tinyMceRowHeight
                overflowHeight = height
                answerArrHeight[orderFirst] = overflowHeight
              }else{
                editorContent[segmented] = val
                rowHeightArr[segmented] = tinyMceRowHeight
                if(first && !orderFirst){
                  // overflowHeight = tinyHeight + heightTitle + marginHeight
                  overflowHeight = height
                }else{
                  overflowHeight = height
                }
                answerArrHeight[orderFirst] = overflowHeight
              }
            }
          }
          if(index > -1){
            let curObj = this.pageData[index]
            let data = {
              question:{
                ...curObj,
                // editorContent: setArrContent.length ? setArrContent : editorContent,
                editorContent: editorContent,
                answerArrHeight:answerArrHeight,
                operatTinymce:operatTinymceArr.length ? operatTinymceArr : operatTinymce, // 是否操作
                rowHeightArr: overflowArrs.length ? overflowArrs : rowHeightArr,
                height:overflowHeight
              },
              index:index,
            }
            this.pageData_edit_title(data)
          }
    },
  },
}
</script>

<style lang="less">
@import '~@/assets/css/variables.less';

p {
  margin: 0;
}
.totalScore{
  position: absolute;
  bottom: 5px;
  width: 100%;
  text-align: center;
  color: #f00;
  font-size: 12px;
}

.content-info{
  // overflow: auto;
  .mce-content-body{
    padding-top: 7px;
  }
  p {
    img {
      max-width: 97%;
    }
    margin: 0;
    line-height: 35px;
    padding: 0 10px;
    box-sizing: content-box;
    .title {
      flex-shrink: 0;
      margin-right: 5px;
    }
  }
}
.content-info-preview{
  padding-top: 7px;
  p{
    word-break: break-word;
  }
} 
</style>
