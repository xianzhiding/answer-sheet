<template>
  <div class="question-info">
    <!-- <div
      class="question-title"
      ref="tinyeditor"
      v-if="data.first && data.borderTop == undefined || data.borderTop == 0"
      :style="{'height':maxHeight + 'px'}"
    >
      <el-input v-model="content" @input="changeContent"></el-input>

    </div> -->

    <div
      class="question-title"
      ref="tinyeditor"
      v-if="questionData.first"
      :style="{'height':maxHeight + 'px'}"
    >
      <tiny-vue class="title-span"
        v-model="content"
        @input="changeContent"
        ref="tinyMCE"
        :max-height="maxHeight"
        :readonly="readonly"
      />
    </div>
    <!-- <div class="question_arrays">
      <div class="question_editOrDel">
        <span class="layui-btn layui-btn-xs" @click="subTopic_numberAnswerEdit">编辑</span>
        <span class="layui-btn layui-btn-xs" @click="delHanlde">删除</span>
      </div>
    </div> -->

    <div class="question_arrays" v-if="!previewIs">
      <div class="question_editOrDel" style="top:17px" v-if="data.first">
        <!-- <el-checkbox style="margin-right: 10px" v-model="showDecimal" v-if="data.first&& pageLayout.asType === 2" @change="handleCheckDecimal">0.5</el-checkbox> -->
        <el-button type="primary" size="mini" @click="subTopic_numberAnswerEdit">编辑</el-button>
        <el-button type="primary" size="mini" @click="delHanlde">删除</el-button>
      </div>
    </div>

    <drag-change-height
      :question="questionData"
      :previewIs="previewIs"
      @height-resize="handleResize($event)"
      :style="{
        'border-top':!data.orderFirst || !pageIndex ? '1px solid #000' : 'none',
        'height':minHeight  + 'px',
      }"
      v-if="tinymceHeight > 0"
    >
      <div
        class="content-info info_pLIst"
        :style="{
          height:tinymceHeight + 'px',
        }"
      >
        <div v-if="!previewIs" class="totalScore">[总分{{questionData.content.scoreTotal}}]</div>
          <!-- 富文本编辑区 -->
          <trigger-tinymce
            @tinymce-change="tinymceChangeFunc"
            v-model="editorDetail"
            v-if="pageLayout.column == 3"
            :readonly="readonly"
            :style="{height: tinymceHeight + 'px'}"
            ref="tinymceBox"
          >
          </trigger-tinymce>
          <trigger-tinymce
            @tinymce-change="tinymceChangeFunc"
            v-model="editorDetail"
            :readonly="readonly"
            :style="{height: tinymceHeight + 'px'}"
            ref="tinymceBox"
            v-else
          >
          </trigger-tinymce>
      </div>
    </drag-change-height>

  </div>
</template>

<script>
import { mapState, mapMutations ,mapGetters} from 'vuex'
import { QUESTION_NUMBERS } from '@/models/base'
import { PAGE_HEIGHT } from '@/models/base'
import { useArrayCutHook } from '@/assets/js/useArrayCutHook'

import dragChangeHeight from '../questionContent/drag'
import tinyVue from '@/components/tinymce'
import triggerTinymce from '@/components/tinymce/triggerEditor'

export default {
  components: {
    dragChangeHeight,
    tinyVue,
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
    previewContent: {
      type: Boolean,
      default: false
    },
    previewWidth:{
      type: Number,
      default: 0
    },
    previewIs: {
      type: Boolean,
      default: false
    },
    readonly: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      isEditor: false,
      data: {},
      cotent: '',
      promptTitle: '请考生用2B铅笔将所选题目对应题号涂黑，答题区域只允许选择一题，多涂、错涂漏涂均不给分，如果多做，则按所选做的前一题计分。',
      options: QUESTION_NUMBERS.map((label,value)=>({label,value})),
      maxHeight:46,
      tinymceHeight:28,
      str:'&ensp;',
      pageLayout: this.contentData.pageLayout,
      page_height: PAGE_HEIGHT,
      strP:'</p>'
    }
  },
  computed: {
    ...mapState('page', ['pageData']),
    ...mapGetters('page', ['page_width']),

    minHeight(){
      const {first,heightTitle,castHeight} = this.questionData
      return  first ? castHeight - heightTitle : castHeight
    },

    topicData () {
      return this.contentData.group.map(question => question.childGroup).flat()
    },

    rowsData () {
      let Arr = []
      for (let i = 1; i <= this.questionData.rows; i++) {
        Arr.push(i)
      }
      return Arr
    },

    pageWidth () {
      return this.previewWidth == 0 ? this.page_width - 20 : this.previewWidth - 38
    },

    spaceStr () {
      let sum = Math.ceil((this.pageWidth - 23) / 8)
      let space = ''

      for(let x = 0; x < sum;x++){
          space += this.str
      }
      return space
    },

    questionInfo(){
      const {first,heightTitle,height,castHeight,content,rowHeight} = this.data
      let boxP = ''
      let Arr = []

      if(first || heightTitle == (height - castHeight)){
        let spans = ''
        this.topicData.forEach(item =>{
          spans += `<span class="digital">${item.topic}</span>`
        })
        boxP = `<p>
                  我选的题号（${content.scoreTotal}分）
                  <span class="topic_number_box">
                    <span class="black_icon">&ensp;</span>${spans}<span class="black_icon">&ensp;</span>
                  </span>
                </p>`
      }

      let pList = ''
      this.rowsData.forEach((e,index) =>{
        let classS = content.HorizontalLine ? 'outline':''
        if(first && index == 0 || heightTitle == (height - castHeight) && index == 0){
          pList += boxP
        }else{

          pList += `<p><span> ${this.spaceStr} </span></p>`
        }
        Arr.push(rowHeight)
      })
      return  {data:pList,Arr:Arr}
    },

    editorDetail() {
      const {
        editorContent,segmented,id,operatTinymce,
        rowHeightArr,
      } = this.questionData

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
			return editorContent[segmented]
    }
  },
  watch: {
    questionData: {
      immediate: true,
      handler () {
        this.data = {
          ...this.questionData
        }
        const {castHeight,heightTitle,content,titleContent,first, segmented, marginHeight} = this.questionData
        this.tinymceHeight = first&&!segmented ? castHeight - heightTitle - marginHeight : castHeight
        this.content = ''
        let {number,topicName} = this.contentData
        if(!titleContent){
          this.content = `${this.options[number].label}.${topicName}(${content.scoreTotal}分) ${this.promptTitle}`
        }else{
          this.content = titleContent
        }
        this.pageLayout = this.contentData.pageLayout
        if(this.$refs.tinymceBox != undefined){
          this.$refs.tinymceBox.editorHtml()
        }
        this.maxHeight = heightTitle
      }
    },

  },

  methods: {
    ...mapMutations('page', [
      'pageData_del',
      'pageData_edit',
      'pageData_editorStr',]),

    ...mapMutations('questionType', [
      'subTopic_already_del',
      'subTopic_number_calculate',
      'subTopic_determine_clean',
    ]),

    ...mapMutations('page', [
      'pageData_edit_title'
    ]),

    hanldeEditor () {
      this.isEditor = true
    },
    subTopic_numberAnswerEdit () {
      this.$emit('current-question-optional-edit', this.contentData, this.data.id)
    },
    delHanlde () { // 删除大题-小题数
      const index = this.pageData.findIndex((itme) => itme.id === this.data.id)
      if (index > -1) {
        this.subTopic_already_del(this.topicData)
        this.topicData.forEach(question => {
          this.subTopic_determine_clean(question.topic)
        })

        this.pageData_del(index)
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
    tinymceChangeFunc(obj){
      // 富文本参数
      const {val,tinyHeight,tinyId} = obj
      // let tinyContentH = tinyHeight

      const {segmented,operatTinymce, rowHeight} = this.questionData

      // 更改富文本编辑后行高数组--------------------------------------------------
      // let tinymcePList = document.querySelectorAll(`#${tinyId} p`)
      let tinyMceRowHeight = []
      let rows = Math.floor(tinyHeight / 35)
        tinyMceRowHeight = Array(rows).fill(rowHeight)
      // 标记富文本进行过编辑
      operatTinymce[segmented] = 1
      this.tinymceHeight =  tinyHeight  // 最大高度
      this.editConten(this.questionData,tinyHeight,val,tinyMceRowHeight)
    },

    editConten(eidtObj,tinyHeight,val,tinyMceRowHeight){
      const {
        editorContent,segmented,first,id,marginHeight,operatTinymce,rowHeight,
        rowHeightArr,remainderHeight,heightTitle,height,castHeight
      } = eidtObj
      const index = this.pageData.findIndex(question => question.id == id)

      let containerHeight, // 容器高度
          difference = 0, // 差值
          differenceLong = 0, // 差值长度
          nextSegmented = segmented + 1,// 数组中-当前位置之后一位
          setArrContent = [],
          overflowArrs = [],
          operatTinymceArr = [],
          // 富文本字符串
          overflowHeight = 0,
          currentContentArr = []
          // currentContentArr = this.convertArray_p(val).filter(item => item.indexOf(this.strP) != -1)
          currentContentArr = val.match(/<p>.*?<\/p>/g, '')
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
          let RemainingHeight =  this.page_height  - marginHeight

          if(editorContent[segmented] != undefined){

            // let editorArr = editorContent.map( item => {
            //   return this.convertArray_p(item).filter(ele => ele.indexOf(this.strP) != -1)
            // }).map((ele,index) =>{
            //   return ele.map((item,i) => {
            //     return {str:item,height: rowHeightArr[index][i]}
            //   })
            // })

            // let currentEditorContent = currentContentArr.map((item,index) => {
            //   return {str:item,height: tinyMceRowHeight[index]}
            // })

            if(differenceLong > 0){
              // 截取溢出的高度
              // let testH =  (remainderHeight - 20 - marginHeight - heightTitle)
              // let textCo = useArrayCutHook(editorArr,{ height: testH, perpageHeight: RemainingHeight,rowHeight:rowHeight,marginTop:7 })
              // let setArrContent1 = textCo.setArr(segmented, currentEditorContent)

              // setArrContent = setArrContent1.map(item => {
              //   let strContent = ''
              //     item.forEach(element => {
              //     strContent+= element.str
              //   })
              //   return strContent
              // })
              // overflowArrs = setArrContent1.map(item => {
              //   return item.map(ele => ele.height)
              // })
              // operatTinymceArr = overflowArrs.map(() => {return 1})

              // let nextHeight = 0
              //     overflowArrs.forEach((ele,index) => {
              //       if(index != 0 && index < overflowArrs.length - 1){
              //         let nums = 0
              //         ele.forEach(num => {
              //           nums += num
              //           nextHeight += num
              //         })
              //         if(nums < RemainingHeight) {
              //           let numLong = Math.ceil((RemainingHeight - nums) / rowHeight)
              //           nextHeight += numLong * rowHeight
              //         }
              //       }else if(index == overflowArrs.length - 1){
              //         ele.forEach(num => {
              //           nextHeight += num
              //         })
              //       }
              //     })
              // overflowHeight = (remainderHeight - 20 - 12) + nextHeight
              editorContent[segmented] = val
              rowHeightArr[segmented] = tinyMceRowHeight
              operatTinymceArr = editorContent.map(() => {return 1})
              overflowHeight = height
            }else{
              if(containerHeight > difference && editorContent[nextSegmented] != undefined){
               //内容低于内容高度
               //内容框高度 - 内容
                /* containerHeight = (remainderHeight - 20 - marginHeight - heightTitle)

                let testH =  (remainderHeight - 20 - marginHeight - heightTitle)
                let textCo = useArrayCutHook(editorArr,{ height: testH, perpageHeight: RemainingHeight,rowHeight:rowHeight,marginTop:7 })
                let setArrContent1 = textCo.setArr(segmented, currentEditorContent)

                  setArrContent = setArrContent1.map(item => {
                    let strContent = ''
                    item.forEach(element => {
                      strContent+= element.str
                    })
                    return strContent
                  })
                  overflowArrs = setArrContent1.map(item => {
                    return item.map(ele => ele.height)
                  })
                  operatTinymceArr = overflowArrs.map(() => {return 1})
                let nextHeight = 0
                  overflowArrs.forEach((ele,index) => {
                    if(index != 0 && index < overflowArrs.length - 1){
                      let nums = 0
                      ele.forEach(num => {
                        nums += num
                        nextHeight += num
                      })
                      if(nums < RemainingHeight) {
                        let numLong = Math.ceil((RemainingHeight - nums) / rowHeight)
                        nextHeight += numLong * rowHeight
                      }
                    }else if(index == overflowArrs.length - 1){
                      ele.forEach(num => {
                        nextHeight += num
                      })
                    }
                  }) */
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
                height:overflowHeight
              },
              index:index,
            }
            this.pageData_edit_title(data)
          }
    }
  },
}
</script>


<style lang="less" >
.question-container{
  // margin-top: 10px;

  .answer_question_box {
    height: 35px;
    line-height: 35px;
    padding: 0 15px ;
    position: relative;
    margin: 0;
  }
}
.optional-item-list {
    margin: 0 0;
    line-height: 35px;
    width: calc(100% - 30px);
    margin-left: 15px;
    padding: 0 3mm;

  &.outline{
    a{
      border-bottom: 1px solid #888;
    }
  }

  a{
    width: 100%;
  }
}
.number-info {
  height: 20px;
  line-height: 20px;
  font-size: 12px;
  position: relative;
}
.topic_number_box {
  height: 20px;
  position: absolute;
  line-height: 20px;
  right: 15px;
  top: 0;

  span {
    display: inline-block;
    margin-left: 5px;
  }
  .black_icon {
    width: 18px;
    height: 8px;
    background-color: #000;
    display: inline-table;
    overflow: hidden;
    line-height: 8px;
  }
  .digital {
    min-width: 26px;
    font-size: 12px;
    border: 1px solid #000;
    text-align: center;
    height: 12px;
    line-height: 10px;
    font-family: 'simsun';
  }
}
</style>