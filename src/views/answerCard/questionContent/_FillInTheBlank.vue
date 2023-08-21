<template>
  <!-- 填空题 -->
  <div class="question-info">
    <div
      class="question-title"
      ref="tinyeditor"
      v-if="questionData.first"
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
      v-if="questionData.first&& pageLayout.asType === 2&& !pageLayout.asScorePoint"
      :style="{
        'border-top':!data.orderFirst || !pageIndex ? '1px solid #000' : 'none',
        'border-bottom':!data.orderFirst || !pageIndex ? 'none' : '1px solid #000',
      }" v-html="renderScoreMode"></div>

    <div class="question_arrays" v-if="!previewIs">
      <div class="question_editOrDel" :style="{'top':(questionData.first? miniScoreHeight: 0) + 'px'}">
        <el-checkbox style="margin-right: 10px" v-model="showDecimal" v-if="questionData.first&& pageLayout.asType === 2" @change="handleCheckDecimal">0.5</el-checkbox>
        <el-button type="primary" size="mini" @click="subTopic_numberFillEdit">编辑</el-button>
        <el-button type="primary" size="mini" @click="delfillTheBlank">删除</el-button>
      </div>
    </div>
    <!-- {{questionData}} -->
    <drag-change-height
      :question="questionData"
      :previewIs="previewIs"
      @height-resize="handleResize($event)"
      :style="{height: pageLayout.asScorePoint ? tinymceHeight+questionData.marginHeight+'px' : tinymceHeight+'px', paddingTop: pageLayout.asScorePoint? '12px': 0}"
    >
      <div
        class="content-info"
        :style="{
          height:tinymceHeight+ 'px'}"
          v-html="editorDetailScorePoint"
          v-if="pageLayout.asScorePoint"
      ></div>
      <div v-else>
        
        <div class="content-info"
        :style="{
          height:tinymceHeight+ 'px'}"
        >
          <div v-if="!previewIs" class="totalScore">[总分{{questionData.content.scoreTotal}}]</div>
          <trigger-tinymce
          @tinymce-change="tinymceChangeFunc"
          v-model="editorDetail"
          v-if="pageLayout.column == 3"
          :readonly="readonly"
          :style="{
            height:tinymceHeight+ 'px'}"
          ref="tinymceBox"
        >
        </trigger-tinymce>
        <trigger-tinymce
          @tinymce-change="tinymceChangeFunc"
          v-model="editorDetail"
          :readonly="readonly"
          :style="{
            height:tinymceHeight + 'px'}"
          ref="tinymceBox"
          v-else
        >
        </trigger-tinymce>
        </div>
      </div>
    </drag-change-height>
    <el-dialog
      title="提示"
      :visible.sync="openedPrompt"
      width="400px"
      center
      :modal-append-to-body="false"
      :close-on-click-modal="false"
      append-to-body>
      <span>修改后手动编辑的内容会消失，确定修改吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" type="primary" @click="handleOpenedPrompt">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapState, mapMutations, mapGetters } from 'vuex'
import { PAGE_HEIGHT, QUESTION_NUMBERS, DECIMAL_OBJ } from '@/models/base'
import { useArrayCutHook } from '@/assets/js/_useArrayCutHook'

import tinyVue from '@/components/tinymce'
import triggerTinymce from '@/components/tinymce/triggerEditor'
import dragChangeHeight from '../questionContent/drag'

export default {
  components: {
    tinyVue,
    triggerTinymce,
    dragChangeHeight
  },
  props: {
    contentData: {
      type: Object,
      default: () => { },
    },
    questionData: {
      type: Object,
      default: () => { },
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
    },
  },
  data () {
    return {
      data: {},
      isEditor: false,
      openedPrompt: false,
      cotent: '',
      options: QUESTION_NUMBERS.map((label, value) => ({ label, value })),
      quilleditor: false,
      pageLayout: this.contentData.pageLayout,
      richText: '',
      maxHeight: 30,
      tinymceHeight: 30,
      str:'&ensp;',
      aWidth:1,
      page_height: PAGE_HEIGHT,
      strP:'</p>',
      showDecimal: false,
      eachMark:require('@/assets/img/eachMark.png'),
      reduceMark:require('@/assets/img/reduceMark.png'),
      isShowHd:{},
      miniScoreHeight:0
    }
  },
  computed: {
    ...mapState('questionType', ['questionNumber', 'letterList']),
    ...mapState('page', ['pageData']),
    ...mapGetters('page', ['page_width']),

    airStr(){
      return  this.previewContent ? 2 : 3
    },

    pageWidth () {
      return this.previewWidth == 0 ? this.page_width - 23 : this.previewWidth - 63
    },

    topicBox () {
      return this.data.group.map(question => question.childGroup).flat()
    },

    strBox(){
      let num = Math.ceil(Math.ceil(this.pageWidth /this.data.rows) / 9)
      let strBox = []
          for(let x = 0; x < num;x++){
            strBox.push(this.str)
          }

      return strBox
    },
    questionInfo1(){
      // this.pageData_edit(this.questionData)
      const {showData,rowHeight, content} = this.questionData
      let questionInfo = ''
      let Arr = []
      showData.forEach(subtopic =>{
        let aList = ''
        subtopic.forEach((topic) =>{
          let spanBox = ''
          let sLeng = 0

          if(topic.lid){
            let li1 = topic.smallTopic == 1 && topic.spaceNum == 1 ? topic.scoreNo : ''
            let li2 = topic.spaceNum <= 1 ? `(${topic.smallTopic})` : ''
            sLeng = li2 != '' ? 1 : 0
            spanBox = `${li1}${li2}`
          }else{
            let li3 = !topic.spaceNum || topic.spaceNum == 1 ? topic.scoreNo : ''
            spanBox = `${li3}`
          }
          // + this.airStr

          let numLong = (spanBox.length - sLeng) / 2 + this.airStr
          let spaceStr = ''
          for(let x = 0; x < this.strBox.length - numLong ;x++){
            spaceStr +=  this.strBox[x]
          }
          if(this.pageLayout.asScorePoint&&this.pageLayout.asType === 2 &&this.pageLayout.asEachMark === 1){
            aList += `<div class="item item-1" style="width: calc((100% - ${(content.rows*1 - 1) * 15+'px'}) / ${content.rows});"><span class="number">${spanBox}</span> <p class="blank"></p><span class="score"></span></div>
            `
          }else if(this.pageLayout.asScorePoint&&this.pageLayout.asType === 2 &&this.pageLayout.asEachMark === 2){
            aList += `<div class="item item-2" style="width: calc((100% - ${(content.rows*1 - 1) * 15+'px'}) / ${content.rows});"><span class="number">${spanBox}</span> <p class="blank"></p><img src="${this.pageLayout.asScoreMode == 1 ? this.eachMark : this.reduceMark}" /></div>
            `
          }
        })
        questionInfo +=  `<div class="content-row ${this.pageLayout.asScorePoint?'content-row-score content-row-score-2': ''}">${aList}</div>
        
        `
        //questionInfo +=  `<p class="content-row">${aList}</p>
        //`// 需要空一行回车，这样才能筛选行数，不能删除
        Arr.push(rowHeight)
      })
      return {data:questionInfo,Arr:Arr}
    },
    questionInfo(){
      const {showData,rowHeight} = this.questionData
      let questionInfo = ''
      let Arr = []
      showData.forEach(subtopic =>{
        let aList = ''
        subtopic.forEach((topic) =>{
          let spanBox = ''
          let sLeng = 0

          if(topic.lid){
            let li1 = topic.smallTopic == 1 && topic.spaceNum == 1 ? topic.topic : ''
            let li2 = topic.spaceNum <= 1 ? `(${topic.smallTopic})` : ''
            sLeng = li2 != '' ? 1 : 0
            spanBox = `${li1}${li2}`
          }else{
            let li3 = !topic.spaceNum || topic.spaceNum == 1 ? topic.topic : ''
            spanBox = `${li3}`
          }
          let numLong = (spanBox.length - sLeng) / 2 + this.airStr
          let spaceStr = ''
          for(let x = 0; x < this.strBox.length - numLong ;x++){
            spaceStr +=  this.strBox[x]
          }
          aList += `&ensp;${spanBox}&ensp; <span style="text-decoration: underline;">${spaceStr}</span>`
          })
        questionInfo += `<p>${aList}</p>`// 需要空一行回车，这样才能筛选行数，不能删除
        Arr.push(rowHeight)
      })
      return {data:questionInfo,Arr:Arr}
    },

    editorDetailScorePoint(){
      
      const {editorContent,segmented,id,operatTinymce,rowHeightArr,} = this.questionData
      if (operatTinymce[segmented] == undefined) {
        editorContent[segmented] = this.questionInfo1.data
        rowHeightArr[segmented] = this.questionInfo1.Arr
        this.pageData_editorStr({
          id:id,
          content:editorContent,
          rowHeightArr:rowHeightArr,
        })
      }
      
			return editorContent[segmented]
    },
    editorDetail(){
      let { editorContent, segmented, id, operatTinymce, rowHeightArr, segmentedArr } = this.questionData
      if(operatTinymce.length>0){
        let content = editorContent.join('')
        let rows = rowHeightArr.flat()
        if(segmentedArr.length>1){
          content = content.match(/<(\w+)[^<>]*>(?:<(\w+)[^<>]*>.*?<\/\2>|.)*?<\/\1>/g)
          let contentArray = [], rowsArray = []
          for (let i = 0; i < segmentedArr.length; i++) {
            contentArray.push(content.splice(0, segmentedArr[i]).join(''))
            rowsArray.push(rows.splice(0, segmentedArr[i]))
          }
          editorContent = contentArray
          rowHeightArr = rowsArray
        }else{
          editorContent = [content]
          rowHeightArr = rows
        }
      }
      
      // 判断是否进行过富文本编辑
      if (operatTinymce.length<1 && operatTinymce[segmented] == undefined) {
        editorContent[segmented] = this.questionInfo.data
        rowHeightArr[segmented] = this.questionInfo.Arr
        this.pageData_editorStr({
          id:id,
          content:editorContent,
          rowHeightArr:rowHeightArr,
        })
      }
			return editorContent[segmented]
    },
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
      let totalScore = this.data.scoreTotal;
      const isDecimal = this.showDecimal ? DECIMAL_OBJ.array : DECIMAL_OBJ.array.slice(0).splice(3);
      console.log(isDecimal);
      if(this.pageLayout.column !== 3 && totalScore < 14 && this.showDecimal){
        return DECIMAL_OBJ.decimal.slice(0).splice(0, (totalScore*2)+1)
      }else if(totalScore < 11 && this.showDecimal){
        return DECIMAL_OBJ.decimal.slice(0).splice(0, (totalScore*2)+1)
      }
      if(this.pageLayout.column !== 3){
        return totalScore > 27 || this.showDecimal ? [...isDecimal,...DECIMAL_OBJ.array.slice(0).splice(3, (totalScore/10)+1)]: Array.from({length: totalScore + 1}, (x, i) => i+'')
      }else{
        return totalScore > 21 || this.showDecimal ? [...isDecimal,...DECIMAL_OBJ.array.slice(0).splice(3, (totalScore/10)+1)]: Array.from({length: totalScore + 1}, (x, i) => i+'')
      }
    } */
    ,large20concat() {
      let totalScore = this.data.scoreTotal;
      let bigArr = []
      for (let i=0; i<=totalScore; i++){if((i/10)%1 === 0){bigArr.push(i+'')}}
      if(totalScore > 17 &&totalScore <=20){
        // return this.showDecimal ? [...DECIMAL_OBJ.bigArr, ...bigArr]: Array.from({length: totalScore + 1}, (x, i) => i+'')
        return Array.from({length: totalScore + 1}, (x, i) => i+'')
      }else 
      if(totalScore > 20){
        return [...DECIMAL_OBJ.bigArr, ...bigArr]
      }else if(totalScore < 11 && this.showDecimal){
        return DECIMAL_OBJ.decimal.slice(0).splice(0, (totalScore*2)+1)
      }else{
        return this.showDecimal ? DECIMAL_OBJ.array.slice(0).splice(0, (totalScore*1)+4) : Array.from({length: totalScore + 1}, (x, i) => i+'')
      }
    }
  },
  watch: {
    contentData: {
      immediate: true,
      handler () {
        this.data = {
          ...this.contentData,
        }
        
        this.pageLayout = this.contentData.pageLayout
      },
    },

    questionData: {
      immediate: true,
      handler () {
        this.content = ''
        let { number, topicName, scoreTotal } = this.data
        const {first,castHeight,heightTitle,titleContent, showDecimal,marginHeight, pageFirst, segmented} = this.questionData
        this.isShowHd = {
          first,
          pageFirst,
          isScorePoint: this.pageLayout.asScorePoint?1:2
        }
       
        if (!titleContent) {
          // this.content = `<p><span>${this.options[number].label}.</span><span>${topicName}</span><span class='p-5'>(${scoreTotal}分)</span></p>`
          this.content = `${this.options[number].label}.${topicName} (${scoreTotal})分`
        } else {
          this.content = titleContent
        }
        this.tinymceHeight = first&&!segmented ? castHeight - heightTitle - marginHeight : castHeight
        // this.tinymceHeight = castHeight - heightTitle
        if(this.$refs.tinymceBox != undefined){
          this.$refs.tinymceBox.editorHtml()
        }
        this.maxHeight = heightTitle
        this.showDecimal = showDecimal
      }
    },

    pageWidth:{
      immediate: true,
      handler () {
        this.aWidth = this.pageWidth /this.data.rows
      }
    }

  },
  mounted () {
  },

  methods: {
    ...mapMutations('page', [
      'pageData_del',
      'pageData_edit',
      'pageData_editorStr',
    ]),
    ...mapMutations('questionType', [
      'subTopic_already_del',
      'subTopic_number_calculate',
      'subTopic_determine_clean',
    ]),
    ...mapMutations('page', ['pageData_edit_title']),

    delfillTheBlank () {
      // 删除大题-小题数
      let { id } = this.questionData
      const index = this.pageData.findIndex((itme) => itme.id === id)
      if (index > -1) {
        this.subTopic_already_del(this.topicBox)
        this.topicBox.forEach(question => {
          this.subTopic_determine_clean(question.topic)
        })

        this.pageData_del(index)
        this.subTopic_number_calculate()
      }
    },
    subTopic_numberFillEdit () {
      this.openedPrompt = true
    },
    handleOpenedPrompt(){
      this.openedPrompt = false
      this.$emit('current-question-fill-edit', this.questionData)
    },
    hanldeEditor () {
      this.isEditor = true
    },
    // 是否显示小数 0.5
    handleCheckDecimal(val){
      let {id} = this.questionData
      let index = this.pageData.findIndex((item => item.id === id))
      let questionObj = this.pageData[index]
      if(this.pageLayout.column===3 &&this.data.scoreTotal>59){
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
    itemGroup() {
      const {showData} = this.questionData
      let array = showData.flat()
      let index = 0;
      let newArray = [];
      if (!Array.isArray(array)) return;
      while (index < array.length) {
        newArray.push(array.slice(index, (index += 2)));
      }
      return newArray;
    },
    handleResize (height) {
      const index = this.pageData.findIndex(obj => this.questionData.id === obj.id)
      if (index > -1) {
        let questionObj = this.pageData[index]

        this.pageData_edit({
          ...questionObj,
          height: isNaN(height) ? questionObj.height : height,
        })

      }
    },

    changeContent (obj) {
      const {val,tinyHeight} = obj

      const index = this.pageData.findIndex(question => question.id == this.questionData.id)

      let height = val ? tinyHeight + 2 : 2
      this.maxHeight = height // 最大高度
      if (index > -1) {
        let curObj = this.pageData[index]
        let data = {
          question: {
            ...curObj,
            titleContent: val,
            heightTitle: height,
            height: (curObj.height - curObj.heightTitle) + height,
          },
          index: index,
        }
        this.pageData_edit_title(data)
      }
    },
    tinymceChangeFunc (obj) {
      // 富文本参数
      const {val,tinyHeight,tinyId} = obj
      let tinyMceRowHeight = []
      // 首个p向下top7px
      // let tinyContentH = tinyHeight
      let valHeight = 0;
      val.match(/<(\w+)[^<>]*>(?:<(\w+)[^<>]*>.*?<\/\2>|.)*?<\/\1>/g).forEach(item =>{
        valHeight+=35
      })
      // 参数
      const {segmented,operatTinymce, rowHeight} = this.questionData
      // 更改富文本编辑后行高数组--------------------------------------------------
      if(valHeight > tinyHeight){
        this.tinymceHeight =  valHeight
        let rows = Math.floor(valHeight / 35)
        tinyMceRowHeight = Array(rows).fill(rowHeight)
      }else{
        this.tinymceHeight =  tinyHeight 
        // let rows = Math.floor(tinyHeight / 35)
        let rows = Math.floor(valHeight / 35)
        tinyMceRowHeight = Array(rows).fill(rowHeight)
      }


      // 标记富文本进行过编辑
      operatTinymce[segmented] = 1

      // this.tinymceHeight =  tinyContentH  // 最大高度

      this.editConten(this.tinymceHeight,val,tinyMceRowHeight)


// 富文本参数
/*       const {val,tinyHeight,tinyId} = obj

      // 首个p向下top7px
      let tinyContentH = 0
      // 参数
      const {segmented,operatTinymce} = this.questionData

      // 更改富文本编辑后行高数组--------------------------------------------------
      let tinymcePList = document.querySelectorAll(`#${tinyId} p`)

      let tinyMceRowHeight = []
      tinymcePList.forEach((itme,index) => {
        tinyMceRowHeight.push(itme.offsetHeight)
        tinyContentH += itme.offsetHeight
      })
      tinyContentH += 7
      // 标记富文本进行过编辑
      operatTinymce[segmented] = 1

      this.tinymceHeight =  tinyContentH  // 最大高度

      this.editConten(tinyContentH,val,tinyMceRowHeight) */

    },

    editConten(tinyHeight,val,tinyMceRowHeight){
      const { editorContent,segmented,first,id,marginHeight,operatTinymce,rowHeight, rowHeightArr,remainderHeight,heightTitle,height,castHeight} = this.questionData
      const index = this.pageData.findIndex(question => question.id == id)

      let containerHeight, // 容器高度
          difference = 0, // 差值
          differenceLong = 0, // 差值长度
          nextSegmented = segmented + 1,// 数组中-当前位置之后一位
          setArrContent = [],
          overflowArrs = [],
          operatTinymceArr = [],
          overflowHeight = 0;
           //计算容器容纳高度
          if(first && segmented == 0){
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

          // 下一级长度
          if(editorContent[segmented] != undefined){

            if(differenceLong > 0){
              // 截取溢出的高度
              editorContent[segmented] = val
              rowHeightArr[segmented] = tinyMceRowHeight
              operatTinymceArr = editorContent.map(() => {return 1})
              overflowHeight = height
            }else{
              if(containerHeight > difference && editorContent[nextSegmented] != undefined){
                //内容低于内容高度
                //内容框高度 - 内容
                let contentHeight = tinyMceRowHeight.reduce((total, currentValue)=> total + currentValue, 0)
                containerHeight = contentHeight
                editorContent[segmented] = val
                rowHeightArr[segmented] = tinyMceRowHeight
                operatTinymceArr = editorContent.map(() => {return 1})
                overflowHeight = height
              }else{
                editorContent[segmented] = val
                rowHeightArr[segmented] = tinyMceRowHeight
                if(first && segmented == 0){
                  overflowHeight = tinyHeight + heightTitle + marginHeight
                }else{
                  overflowHeight = height
                }
              }
            }
          }

          if(index > -1){
            let curObj = this.pageData[index]
            let data = {
              question:{
                ...curObj,
                editorContent: setArrContent.length ? setArrContent : editorContent,
                operatTinymce:operatTinymceArr.length ? operatTinymceArr : operatTinymce, // 是否操作
                rowHeightArr: overflowArrs.length ? overflowArrs : rowHeightArr,
                height: overflowHeight
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
.hand-read-bar{
  height: 24px;
  display: flex;
  flex-direction: row-reverse;
  // border-top: 1px solid @font-888;
  border-bottom: 1px solid #000;
  border-right: 1px solid #000;
  border-left: 1px solid #000;
  >span{
    height: 22px;
    flex: 1;
    text-align: center;
    box-sizing: border-box;
    line-height: 24px;
    font-family: simsun;
    width: 22.3px;
    span{
      transform: scale(0.8);
      display: block;
      font-size: 12px;
      -webkit-text-size-adjust:none;
    }
    &:not(:last-child) {
      border-left: 1px solid #000;
    }
  }
}

.footer:hover{
  .question_arrays{
      // display: block;
      visibility: visible;
    }
}
.question_arrays {
  position: relative;
  display: flex;
  flex-wrap: wrap;
  // display: none;
  visibility: hidden;
  .question_editOrDel {
    position: absolute;
    right: 40px;
    top: 0px;
    z-index: 99;
    // width: 40px;
    // span {
    //   margin-left: 10px;
    // }
  }
  .el-button--primary{
      border-color: transparent;
      background-color: transparent;
      color: @main;
    }
  
}
.content-row-score{
    display: flex;
    /* width: calc(100% - 6mm); */
    flex-direction: row;
    flex-wrap: nowrap;
    align-items: center;
    padding: 7px 4px;
  .item{
    display: flex;
    height: 22px;
    &:not(:last-child){
      margin-right: 15px;
    }
  }
  .number{
    width: 25px;
    padding-right: 3px;
    line-height: 30px;
    text-align: right;
  }
  .blank{
    border-bottom: 1px solid #000;
    // width: calc(100% - (25px + 40px + 15px));
    margin-right: 5px;
  }
  img{
    height: 22px;
  }
  .score{
    width: 40px;
    height: 26px;
    display: block;
    text-align: center;
    line-height: 26px;
    font-size: 20px;
    border: 1px solid #333;
  }
  &.content-row-score-2{
    .item-1{
      .blank{
        width: calc(100% - (25px + 40px + 5px));
      }
    }
    .item-2{
      .blank{
        width: calc(100% - (25px + 84px + 5px));
      }
      .score{
        width: 28px;
        margin-left: -1px;
      }
    }
  }
  &.content-row-score-3{
    .item-1{
      .blank{
        width: calc(100% - (25px + 40px + 5px));
      }
    }
    .item-2{
      .blank{
        width: calc(100% - (25px + 56px + 5px));
      }
      .score{
        width: 28px;
        margin-left: -1px;
      }
    }
  }
}
</style>

