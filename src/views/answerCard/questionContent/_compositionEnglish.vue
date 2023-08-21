<template>
  <div>

    <div class="question-info">
      <div
        class="question-title"
        ref="tinyeditor"
        v-if="data.first&&!data.segmented"
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
      	v-if="data.first&& !data.segmented && pageLayout.asType === 2"
	      :style="{
          'marginBottom':'10px',
	        'border-top':!data.orderFirst || !pageIndex ? '1px solid #000' : 'none',
      	}"
       	v-html="renderScoreMode"></div>
         <!-- 'border-bottom':!data.orderFirst || !pageIndex ? 'none' : '1px solid #000', -->
      <div class="question_arrays" v-if="!previewIs">
        <div class="question_editOrDel">
          <el-checkbox style="margin-right: 10px" v-if="data.first&& !data.segmented && pageLayout.asType === 2" v-model="showDecimal" @change="handleCheckDecimal">0.5</el-checkbox>
          <el-button type="primary" size="mini" @click="compositionEnglishEdit">编辑</el-button>
          <el-button type="primary" size="mini" @click="delHanlde">删除</el-button>
        </div>
      </div>
      <drag-change-height
        :question="questionData"
        :previewIs="previewIs"
        v-if="data.heightTitle != data.castHeight"
        @height-resize="handleResize($event)"
      >
        
        <div class="content-info"
          :style="{
            height:tinymceHeight + 'px'}"
          :class="{lineLattice: cotent.lineLattice}"
        >
          <div v-if="!previewIs" class="totalScore">[总分{{questionData.content.scoreTotal}}]</div>
          <trigger-tinymce
            @tinymce-change="tinymceChangeFunc"
            v-model="editorDetail"
            v-if="pageLayout.column == 3"
            :readonly="readonly"
	          :style="{height:tinymceHeight + 'px'}"
            ref="tinymceBox"
          >
          </trigger-tinymce>
          <trigger-tinymce
            @tinymce-change="tinymceChangeFunc"
            v-model="editorDetail"
            :readonly="readonly"
            :style="{height:tinymceHeight + 'px'}"
            ref="tinymceBox"
            v-else
          >
          </trigger-tinymce>
        </div>
      </drag-change-height>
    </div>
    
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
import { mapState, mapGetters, mapMutations } from 'vuex'
import { PAGE_HEIGHT, QUESTION_NUMBERS, DECIMAL_OBJ } from '@/models/base'
import { useArrayCutHook } from '@/assets/js/useArrayCutHook'
import tinyVue from '@/components/tinymce'
import dragChangeHeight from '../questionContent/drag'
import triggerTinymce from '@/components/tinymce/triggerEditor'
export default {
  components: {
    tinyVue,
    dragChangeHeight,
    triggerTinymce
  },
  props: {
    questionData: {
      type: Object,
      default: () => { }
    },
    contentData: {
      type: Object,
      default: () => { }
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
  data () {
    return {
      openedPrompt: false,
      isEditor: false,
      data: {},
      cotent: {},
      options: QUESTION_NUMBERS.map((label,value)=>({label,value})),
      maxHeight:24,
      pageLayout: this.contentData.pageLayout,
      tinymceHeight: 30,
      page_height: PAGE_HEIGHT,
      strP:'</p>',
      showDecimal: false,
      miniScoreHeight:0,
      isShowHd:{}
      
    }
  },
  computed: {
    ...mapState('page', ['pageData']),
    ...mapGetters('page', ['page_width']),
    strLong () {
      
      let long = this.contentData.topic.toString().length
      return parseInt(long) * 8 + 1
    },

    topicData () {
      return ''
    },

    rowsData () {
      // let Arr = []
      // for (let i = 1; i <= this.data.rows; i++) {
      //   Arr.push(i)
      // }
      return Array.from(Array(this.data.rows), (v,k) =>k+1)
    },
    pageWidth () {
      return this.previewWidth == 0 ? this.page_width : this.previewWidth - 40
    },
    questionInfo(){
      let {rows,rowHeight,content,first} = this.questionData
      
      let Arr = []
      let questionInfo = ''
      let str = '&ensp;'
      let spaceLong = Math.ceil((this.pageWidth - 26) / 6)
      let spaceSum = ''
      for(let x = 0; x < spaceLong;x++){
          spaceSum += str
      }
      this.rowsData.forEach((item, i)=>{
        if(content.lineLattice){
          questionInfo += `<p><a>${spaceSum}</a></p>`
        }else{
          questionInfo += `<p><a style="text-decoration:underline">${spaceSum}</a></p>`
        }
        Arr.push(rowHeight)
      })
      return {data: questionInfo,Arr:Arr}
    },

    editorDetail(){
      let {editorContent,segmented,id,operatTinymce,rowHeightArr, segmentedArr} = this.questionData
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
      if(operatTinymce[segmented] == undefined){
        editorContent[segmented] = this.questionInfo.data
        rowHeightArr[segmented] = this.questionInfo.Arr
        this.pageData_editorStr({
          id:id,
          content:editorContent,
          rowHeightArr:rowHeightArr,
        })
      }
      return editorContent[segmented]
    }
    ,
    renderScoreMode(){
      const lattice = 21 //this.pageLayout.column === 3 ? 21 : 28
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

    contentData: {
      immediate: true,
      handler () {
        this.pageLayout = this.contentData.pageLayout
        this.cotent = this.contentData
      },
    },

    questionData: {
      immediate: true,
      handler () {
        this.data = {
          ...this.questionData
        }
        this.content = ''
        const {topicName,number,score} = this.contentData
        const {first,castHeight,heightTitle,marginHeight, titleContent, segmented, showDecimal} = this.questionData
          if(!titleContent){
             this.content = `<p><strong>${this.options[number].label}.${topicName}&nbsp;&nbsp;(${score})分</strong></p>`
          }else{
            this.content = titleContent
          }

          this.tinymceHeight = first&&!segmented ? castHeight - heightTitle - marginHeight : castHeight

          if(this.$refs.tinymceBox != undefined){
            this.$refs.tinymceBox.editorHtml()
          }
          this.maxHeight = heightTitle
          this.showDecimal = showDecimal
      }
    },

  },

  methods: {
    ...mapMutations('page', [
      'pageData_del',
      'pageData_id_clean',
      'pageData_edit',
      'pageData_editorStr',
    ]),

    ...mapMutations('questionType', [
      'subTopic_already_del',
      'subTopic_number_calculate',
      'subTopic_determine_clean',
    ]),

    ...mapMutations('page',['pageData_edit_title']),

    hanldeEditor () {
      this.isEditor = true
    },
    // 是否显示小数 0.5
    handleCheckDecimal(val){
      let {id} = this.data
      let index = this.pageData.findIndex((item => item.id === id))
      let questionObj = this.pageData[index]
      this.pageData_edit({
        ...questionObj,
        showDecimal: val
      })
      /* if(this.pageLayout.column===3 &&this.data.content.scoreTotal>60){
        this.showDecimal = false
      }else{
        let {id} = this.data
        let index = this.pageData.findIndex((item => item.id === id))
        let questionObj = this.pageData[index]
        this.pageData_edit({
          ...questionObj,
          showDecimal: val
        })
      } */
    },
    compositionEnglishEdit () {
      this.openedPrompt = true
    },
    handleOpenedPrompt(){
      this.openedPrompt = false
      this.$emit('composition-english-edit', this.data)
    },
    delHanlde () { // 删除大题-小题数
      const index = this.pageData.findIndex((itme) => itme.id === this.data.id)
      if (index > -1) {
        this.subTopic_already_del([this.contentData])
        this.subTopic_determine_clean(this.contentData.topic)
        this.pageData_id_clean(this.data.id)
        this.subTopic_number_calculate()
      }
    },

    handleResize (height) {
      const index = this.pageData.findIndex(obj => this.questionData.id === obj.id)
      if(index > -1){
        let questionObj = this.pageData[index]
        this.pageData_edit({
            ...questionObj,
            height:height,
          })
      }
    },

    changeContent(obj){
      const {val,tinyHeight} = obj
      const index = this.pageData.findIndex(question => question.id == this.questionData.id)
      const height = val ? tinyHeight + 2 : 2
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

    tinymceChangeFunc (obj) {
      // 富文本参数
      const {val,tinyHeight,tinyId} = obj

      // 首个p向下top7px
      let tinyContentH = tinyHeight
      // 参数
      const {segmented,operatTinymce} = this.questionData

      // 更改富文本编辑后行高数组--------------------------------------------------
      let tinymcePList = document.querySelectorAll(`#${tinyId} p`)
      let tinyMceRowHeight = []
          tinymcePList.forEach((itme,index) => {
            let height = itme.offsetHeight
            tinyMceRowHeight.push(height)
          })
      // 标记富文本进行过编辑
      operatTinymce[segmented] = 1
      this.tinymceHeight =  tinyContentH  // 最大高度
      // return;
      this.editConten(this.questionData,tinyHeight,val,tinyMceRowHeight)
    },

    editConten(eidtObj,tinyHeight,val,tinyMceRowHeight){
      let tinymceEditObj = JSON.parse(JSON.stringify(eidtObj))

      const {
        editorContent,segmented,first,id,marginHeight,operatTinymce,rowHeight,
        rowHeightArr,remainderHeight,heightTitle,height,castHeight
      } = tinymceEditObj
      const index = this.pageData.findIndex(question => question.id == id)

      let containerHeight, // 容器高度
          difference = 0, // 差值
          differenceLong = 0, // 差值长度
          nextSegmented = segmented + 1,// 数组中-当前位置之后一位
          setArrContent = [],
          overflowArrs = [],
          operatTinymceArr = []

        //计算容器容纳高度
      if(first && segmented == 0){
        containerHeight = remainderHeight - marginHeight - heightTitle
      }else{
        containerHeight = this.page_height - marginHeight
      }
      // 计算当前容器内容高度
      tinyMceRowHeight.forEach(num =>{
        difference += num
        if(containerHeight < difference){
          differenceLong ++
        }
      })
      // return
      // 下一级长度
      if(editorContent[segmented] != undefined){
        if(differenceLong > 0){
          // 截取溢出的高度
          editorContent[segmented] = val
          rowHeightArr[segmented] = tinyMceRowHeight
          operatTinymceArr = editorContent.map(() => {return 1})
        }else{
          if(containerHeight > difference && editorContent[nextSegmented] != undefined){
            let contentHeight = tinyMceRowHeight.reduce((total, currentValue)=> total + currentValue, 0)
            containerHeight = contentHeight
            operatTinymceArr = editorContent.map(() => {return 1})
            editorContent[segmented] = val
            rowHeightArr[segmented] = tinyMceRowHeight
          }else{
            editorContent[segmented] = val
            rowHeightArr[segmented] = tinyMceRowHeight
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
            height:height
          },
          index:index,
        }
        // return
        this.pageData_edit_title(data)
      }
    },

    convertArrayConten (oldStr) {
      //转换富文本编辑的内容为数组
      if(oldStr != undefined){
        let arr = oldStr.split('</p>') // 回车换行
            arr = arr.map(item => item == '' || item == 'undefined' ? '' : item + '</p>')
                  .filter(item => item !='')
        return arr
      }
      //转换富文本编辑的内容为数组
    }
  },
}
</script>


<style lang="less">
.lineLattice{
  p{
    height: 28px;
    padding-bottom: 10px !important;
    padding-top: 5px;
    line-height: 30px;
    display: flex;
    a {
      width: 100%;
      // border-bottom: 1px solid #888;
      flex-shrink:1;
      height: inherit;
      background-image: linear-gradient(0deg, transparent 8px, #000 9px);
      background-size: 9px 9px;
    }
  }
  }
</style>

