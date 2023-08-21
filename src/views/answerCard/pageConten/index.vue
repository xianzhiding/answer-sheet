<template>
  <div class="container-card">
    <div
      v-for="(pageList, i) in contentData"
      :key="i"
      class="page-contents"
      :style="{ width: pageWidth + 'px' }"
    >
      <div v-if="i === 0 && pageLayout.asSecret" class="seal-line-area">
        <div class="seal-line-cont">
          <div class="seal-line-cont-transform">
            <ul class="seal-line-stu">
              <li 
                v-for="(titleInfo, index) in studentInfoArr"
                :key="index"
                :style="{width: studentInfoLength + '%'}"
              >{{titleInfo.name}}：<span></span></li>
              <!-- <el-button type="primary" size="mini" class="titke-edit" v-show="!previewIs" @click="hanldeStudent">编辑</el-button> -->
            </ul>
          <div class="seal-line-stu-code" v-if="pageLayout.asSecret&&pageLayout.schNumType !=1">
            <p>贴条形码区</p>
            <p>贴二维码/条形码，勿贴出框外</p>
          </div>
          </div>
        </div>
        <!-- <div class="seal-line-line"><svg width="2" height="1104" fill="none" xmlns="http://www.w3.org/2000/svg"><path stroke-dasharray="5,5" d="M0 0v1104" stroke="#000" stroke-width="2"></path></svg></div> -->
      </div>
      <div v-if="i == 0" :style="{ width: pageWidth + 'px', position: 'relative'}">
        <div class="pages">
        <div
          v-for="(topice,index) in pageList"
          :key="topice.id + '_' + i + '_' + index"
          :class="['footer',{answer:topice.questionType == 'answerQuestion' && topice.orderFirst && index > 0}]"
        :style="[{height: topice.castHeight+'px'}]"
          ref="box"
        >
          <component
            ref="answerComponent"
            :is="topice.questionType"
            :content-data="topice.content"
            :question-data="topice"
            :page-index="index"
            @hanldeStudent="hanldeStudent"
            @edit-admission-number="editAdmissionNumber"
            @edit-notices-rules="editNoticesRules"
            @current-question-hanlde-edit="subTopic_numberHanldeEdit"
            @current-question-fill-edit="subTopic_numberFillEdit"
            @hanlde-subtraction="hanldeSubtraction"
            @current-question-answer-edit="subTopic_numberAnswerEdit"
            @current-question-optional-edit="subTopic_numberOptionalEdit"
            @composition-english-edit="compositionEnglishEdit"
            @composition-language-edit="compositionLanguageEdit"
            @subtract-spacing="subtractSpacing"
            @cur-edit-non="curEditNon"
            @hanlde-subtraction-non="hanldeSubtractionNon"
          />
        </div>
        </div>
        <div class="card_footer">
            第 {{i + 1}}-{{contentData.length}} 页
        </div>
      </div>
      <div v-else :style="{ width: pageWidth + 'px' }">
        <div class="pages">
        <div
        v-for="(topice,index) in pageList"
        :key="topice.id + '_' + i + '_' + index"
        :class="['footer',{answer:topice.questionType == 'answerQuestion' && topice.orderFirst && index > 0},{answers:topice.questionType == 'answerQuestion'}]"
        ref="box"
        :style="[{height: topice.castHeight+'px'}]"
      >
        <component
          ref="answerComponent"
          :is="topice.questionType"
          :content-data="topice.content"
          :question-data="topice"
          :page-index="index"
          @hanldeStudent="hanldeStudent"
          @edit-admission-number="editAdmissionNumber"
          @edit-notices-rules="editNoticesRules"
          @current-question-hanlde-edit="subTopic_numberHanldeEdit"
          @current-question-fill-edit="subTopic_numberFillEdit"
          @hanlde-subtraction="hanldeSubtraction"
          @current-question-answer-edit="subTopic_numberAnswerEdit"
          @current-question-optional-edit="subTopic_numberOptionalEdit"
          @composition-english-edit="compositionEnglishEdit"
          @composition-language-edit="compositionLanguageEdit"
          @subtract-spacing="subtractSpacing"
          @cur-edit-non="curEditNon"
          @hanlde-subtraction-non="hanldeSubtractionNon"
        />
      </div>
      </div>
      <div class="card_footer">
          第 {{i + 1}}-{{contentData.length}} 页
      </div>
      </div>
    </div>
    <!-- 公有弹框组件 -->
    <public-dialog ref="publicDialog" />
  </div>
</template>

<script>
import { mapState, mapMutations, mapGetters} from 'vuex'
import { PAGE_HEIGHT } from '@/models/base'


import AnswerSheetTitle from '../questionContent/_answerSheetTitle' // 答题卡标题
import ObjectiveQuestion from '../questionContent/_ObjectiveQuestion' // 客观题
import FillInTheBlank from '../questionContent/_FillInTheBlank' // 填空题
import answerQuestion from '../questionContent/_answerQuestion' // 解答题
import optionalQuestion from '../questionContent/_optionalQuestion' // 选作题
import compositionEnglish from '../questionContent/_compositionEnglish' // 作文英语
import compositionLanguage from '../questionContent/_compositionLanguage' // 作文语文
import NonRresponseArea from '../questionContent/_NonRresponseAreaContent' // 非作答
import publicDialog from '../dialog/_publicDialog'


export default {
  components: {
    AnswerSheetTitle,
    ObjectiveQuestion,
    FillInTheBlank,
    answerQuestion,
    publicDialog,
    optionalQuestion,
    compositionEnglish,
    compositionLanguage,
    NonRresponseArea,
  },
  data() {
    return {
      contentData: [],
      heightArray: [],
      page_height: PAGE_HEIGHT,
      difference: 0
    }
  },
  beforeRouteLeave(to, from, next) {
    this.$confirm('正在离开本页面，本页面内所有未保存数据都会丢失', '警告', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      // 正常跳转
      next()
    }).catch(() => {
      // 如果取消跳转地址栏会变化，这时保持地址栏不变
      window.history.go(1)
    })
  },
  computed: {
    ...mapState('page', ['pageLayout', 'pageData']),
    ...mapGetters('page',['page_width','compile_pageData']),
    pageWidth() {
      return this.page_width + 40
    },
    studentInfoArr() {
      return this.contentData[0][0].content.titleInfo.filter((item) => item.checked == true)
    },
    studentInfoLength() {
      return 100 / this.studentInfoArr.length
    }
  },
  watch: {
    compile_pageData: {
      immediate: true,
      handler() {
        // return
        this.contentData = this.pageContentFunc(this.compile_pageData)
        console.log(this.contentData);
        sessionStorage.setItem('previewContent', JSON.stringify(this.contentData))
        if (this.contentData.length > 0) {
          this.$nextTick(() => {
            this.heightArray = this.$refs['box'].map(
              (item) => item.clientHeight
            )
            this.pageHeight_set(this.heightArray)
          })
        }
        localStorage.setItem('accessToken', JSON.stringify(this.compile_pageData))
      },
    },
  },
  methods: {
    ...mapMutations('pageContent', ['pageHeight_set','scoreTotal_reset','scoreTotal_sum']),
    
    hanldeStudent(Arr) {
      this.$refs.publicDialog.opened('studentTitle', Arr)
    },

    editAdmissionNumber() {
      this.$refs.publicDialog.opened('AdmissionNumber')
    },

    editNoticesRules() {
      this.$refs.publicDialog.opened('NoticesRules')
    },

    pageContentFunc(rects = []) {
      // 试卷总分清零
      this.scoreTotal_reset()

      //参数变量
      let results = []
      let currentPage = {
        height:0,
        rects:[]
      }

      //重置参数变量
      function resetCurrentPage () {
        currentPage.height = 0;
        currentPage.rects = [];
      }
      rects.forEach(rect =>{
        console.log(rect.content);
        // 总分叠加
        if(rect.content.scoreTotal){
          this.scoreTotal_sum(rect.content.scoreTotal)
        }
        //计算变量及对象追加
        let backup = {}
        let superiorGrid = 0
        let segmented = 0
        
        let segmentedArr = []
        let contentRows = rect.content.rows // 用于英语作文
        let remainderHeight = 0
        var avalibleHeight = this.page_height - currentPage.height

            remainderHeight = avalibleHeight
        // return
        // 用于客观题 填空题数组分割
        const itemObj = JSON.parse(JSON.stringify(rect))
        // 高度溢出---------------------------------------------------------------------------
        if(rect.height > avalibleHeight){
          let height = rect.height

          let curRect = this.preliminaryQuestion(rect, avalibleHeight, rect.first,segmented)
          // 是否分割当前题型
          if(curRect.pagination){
            // 客观题 填空题
            if(rect.showData && rect.showData.length){
              backup = {
                showData:itemObj.showData.splice(0, curRect.availableRow),
                first:curRect.pagination,
              }
            }

            // 问答题 选作题
            if(rect.questionType == 'optionalQuestion' || rect.questionType == 'answerQuestion' ){
              backup = {
                rows:curRect.availableRow > rect.content.rows ? rect.content.rows : curRect.availableRow > 0 ? curRect.availableRow : 0
              }
              // console.log(backup);
            }
            if(rect.questionType == 'compositionEnglish'){
              backup = {
                rows: contentRows > curRect.availableRow ? curRect.availableRow : contentRows
              }
              contentRows = contentRows > curRect.availableRow ? contentRows - curRect.availableRow : 0
            }

            if(rect.questionType == 'answerQuestion' || rect.questionType == 'FillInTheBlank'
              || rect.questionType == 'optionalQuestion'|| rect.questionType == 'compositionEnglish'){
              backup = {
                ...backup,
                remainderHeight:remainderHeight
              }
            }

            segmentedArr.push(curRect.availableRow)
            currentPage.rects.push({
              ...rect,
              castHeight:curRect.avalibleHeight,
              actualHeight: curRect.height,
              ...backup,
              segmented:segmented,
              segmentedArr:segmentedArr,
              isPagination: curRect.pagination,
            })
            if(rect.questionType == 'compositionEnglish'){
              height = rect.height - curRect.height
            }else if(rect.questionType == 'ObjectiveQuestion'){
              height = rect.height - curRect.height
            }else{
              height = rect.height - curRect.height
            }
            // 作文
            if(rect.questionType == 'compositionLanguage'){
              superiorGrid = rect.superiorGrid + curRect.availableRow * rect.lattice
              backup = {
                superiorGrid:superiorGrid
              }
              // height += this.difference
              // segmented += 1
            }

            // if(rect.questionType == 'answerQuestion' && rect.orderFirst){
            //   avalibleHeight -= this.difference
            // }

          }
          // 增加一页
          results.push(currentPage.rects)
          resetCurrentPage()
          // 剩余高度可以分占几页
          let bigPage = false
          let count = 0
          while (this.page_height < height){
            bigPage = true
            let avalibleHeight =  this.page_height
            if(!curRect.pagination){
              backup = {
                first: true
              }
              segmented = count++
            }else{
              backup = {
                first: !segmented
              }
              if(rect.questionType == 'FillInTheBlank' && avalibleHeight == 1020){
                backup = {
                  first: false
                }
              }
              segmented += 1
            }
           /*  backup = {
              first: !segmented
            }
            if(rect.questionType == 'FillInTheBlank' && avalibleHeight == 1000){
              backup = {
                first: false
              }
            }
            segmented ++ */
            let curRects = this.preliminaryQuestion(rect, avalibleHeight,backup.first,segmented)
            segmentedArr.push(curRects.availableRow)
            if(rect.showData && rect.showData.length){
              backup = {
                showData:itemObj.showData.splice(0, curRects.availableRow),
              }
            }

            // 选作题
            if(rect.questionType == 'optionalQuestion' ||
              rect.questionType == 'answerQuestion'
            ){
              let {rows} = rect.content
              // console.log(rect);
              backup = {
                rows:rows - curRect.availableRow >= 0 ? rows - curRect.availableRow : 0
              }
              // console.log(backup);
            }

            if(rect.questionType == 'compositionEnglish'){
              backup = {
                rows: contentRows > curRects.availableRow ? curRects.availableRow : contentRows
              }
              contentRows = contentRows > curRects.availableRow ? contentRows - curRects.availableRow : 0
            }

            if(rect.questionType == 'answerQuestion' || rect.questionType == 'FillInTheBlank'
              || rect.questionType == 'optionalQuestion'|| rect.questionType == 'compositionEnglish'){
              backup = {
                ...backup,
                remainderHeight:remainderHeight
              }
            }
            results.push([{
              ...rect,
              // castHeight: curRects.height,
              castHeight: curRects.avalibleHeight,
              actualHeight: curRects.height,
              // first:false,
              ...backup,
              segmented:segmented,
              segmentedArr:segmentedArr,
              isPagination: curRect.pagination,
            }]);
            height -= curRects.height
            if(rect.questionType != 'ObjectiveQuestion'){
              if(curRect.pagination){
                height += rect.marginHeight
              }
            }

            // 作文
            if(rect.questionType == 'compositionLanguage'){
              superiorGrid += curRects.availableRow * rect.lattice
              backup = {
                superiorGrid:superiorGrid
              }
              // height += this.difference
            }
          }

          //溢出剩余高度---------------------------------------------------
          segmented += 1
          //剩余高度增加 rect.marginHeight 高度 分段后加入高度差值
          currentPage.height = height
          /* currentPage.height = height + this.difference
          if(rect.questionType == 'compositionLanguage'){
            currentPage.height = height - this.difference
          }
          */
          //客观题 填空题
          if(rect.showData && rect.showData.length){
              backup = {
                showData: itemObj.showData,
              }
          }
          segmentedArr.push(itemObj.showData != undefined ? itemObj.showData.length : Math.floor(height / curRect.rowHeight))
          // 选作题
          if(rect.questionType == 'optionalQuestion' ||
              rect.questionType == 'answerQuestion'
            ){
            let {rows} = rect.content

            // console.log(rect);
            // console.log(rect.content.rows);
            // console.log(curRect);
            backup = {
              // rows:curRect.availableRow < 0  ? rows :  Math.floor(rect.height / rect.rowHeight) - curRect.availableRow
              rows: curRect.availableRow < 0  ? rows : rect.content.HorizontalLine ? rows - curRect.availableRow : Math.floor(rect.height / rect.rowHeight) - curRect.availableRow
              // rows:rows
            }
            // console.log(backup);
          }

          if(rect.questionType == 'compositionEnglish'){

            backup = {
              rows: contentRows > curRect.availableRow && !curRect.pagination ? curRect.availableRow : contentRows
            }
            contentRows = contentRows > curRect.availableRow ? contentRows - curRect.availableRow : 0
            // currentPage.height -= 12
          }

          if(rect.questionType == 'answerQuestion' || rect.questionType == 'FillInTheBlank'
              || rect.questionType == 'optionalQuestion'|| rect.questionType == 'compositionEnglish'){
            backup = {
              ...backup,
              remainderHeight:remainderHeight
            }
          }

          /* if(curRect.pagination){
            currentPage.height += 14
            if(rect.questionType != 'ObjectiveQuestion'){
            }
          } */
          if(!curRect.pagination && this.page_height > height && !bigPage ){
            if(rect.questionType == 'compositionEnglish'){
              backup = {
                rows:rect.content.rows,
              }
              // currentPage.height += 12
              // contentRows = contentRows > curRect.availableRow ? contentRows - curRect.availableRow : 0
            }
            if(rect.questionType == 'answerQuestion' || rect.questionType == 'FillInTheBlank'
              || rect.questionType == 'optionalQuestion'|| rect.questionType == 'compositionEnglish'){
                // remainderHeight = this.page_height - (rect.height + 12)
              backup = {
                ...backup,
                remainderHeight:remainderHeight
                // remainderHeight: this.page_height - (rect.height + 12)
              }
            }
            if(rect.questionType == 'FillInTheBlank' || rect.questionType == 'answerQuestion' ||rect.questionType == 'compositionEnglish'){
              segmented = 0
              // currentPage.height += 14
            }
            backup = {
              ...backup,
              first:rect.questionType == 'compositionLanguage' ? false : !curRect.pagination,
            }
          }
          if(rect.questionType == 'FillInTheBlank' || rect.questionType == 'answerQuestion' ||rect.questionType == 'compositionEnglish' || rect.questionType =='optionalQuestion'){
            // currentPage.height += 2
          }
          /* if(!curRect.pagination && bigPage ){
            if(rect.questionType == 'compositionEnglish'){
              backup = {
                rows: (contentRows > curRect.availableRow && !curRect.pagination) ? curRect.availableRow : contentRows
              }
              contentRows = contentRows > curRect.availableRow ? contentRows - curRect.availableRow : 0
              // currentPage.height -= 12
            }
            backup = {
              ...backup,
              first: curRect.pagination
            }
          } */
          // 分页段所占行数
          currentPage.rects.push({
            ...rect,
            castHeight: currentPage.height, // 分段后减去加入的差值
            actualHeight: currentPage.height,
            isPagination: curRect.pagination,
            ...backup,
            first:rect.questionType == 'compositionLanguage' ? false : !curRect.pagination,
            segmented:segmented,
            segmentedArr:segmentedArr
          })
        }else{
          
          // 这里显示不分页
          // 变量
          let backup = {}
          currentPage.height += rect.height
          // console.log(rect);
          // 选作题
          if(rect.questionType == 'optionalQuestion' ||
              rect.questionType == 'answerQuestion' ||
              rect.questionType == 'compositionEnglish'
            ){
            backup = {
              rows:rect.content.rows,
            }
            // console.log(backup);
          }

          if(rect.questionType == 'ObjectiveQuestion' || rect.questionType == 'answerQuestion' || rect.questionType == 'FillInTheBlank'
              || rect.questionType == 'optionalQuestion'|| rect.questionType == 'compositionEnglish'){
            backup = {
              ...backup,
              remainderHeight:remainderHeight
            }
          }
          currentPage.rects.push({
            ...rect,
            castHeight: rect.height,
            actualHeight: rect.height,
            ...backup,
            segmented:segmented,
            segmentedArr:segmentedArr,
            remainderHeight:avalibleHeight, // 剩余高度
            isPagination: false,
          })
        }
      })
      if(currentPage.height){
        results.push(currentPage.rects)
      }
      results.forEach(item=>{
        let totalHeight = 0
        item.forEach(s=> totalHeight += s.height)
        item[item.length - 1].isLast= true
        item[item.length - 1].lastTotalHeight= totalHeight
      })
      return results
    },
    // 设置每页最后一个分栏
    preliminaryQuestion(question,avalibleHeight,initial = true,segmented){
      // 变量
      const { marginHeight,heightTitle,rowHeight} = question
      // 边框高度 剩余内容
      // let margin = initial&&!segmented  ? heightTitle + marginHeight : marginHeight
      let margin = initial&&!segmented  ? heightTitle + marginHeight : 0
      let remainingHeight = 0
      switch(question.questionType){
        case 'answerQuestion':
          remainingHeight = avalibleHeight != 1020 ? avalibleHeight - margin : avalibleHeight
          break;
        case 'compositionEnglish':
          remainingHeight = question.first &&segmented == 0 ?  avalibleHeight - margin : avalibleHeight
          // remainingHeight = avalibleHeight - margin
          break;
        case 'compositionLanguage':
          remainingHeight = question.first &&segmented == 0 ?  avalibleHeight - margin : avalibleHeight
          break;
        default:
          remainingHeight = avalibleHeight - margin < 0 ? 0 : avalibleHeight - margin
      }
      // 剩余可容纳行数
      let availableRow = Math.floor(remainingHeight / rowHeight)
      //题型高度
      // let question_height = availableRow < 0 ? 0 : availableRow * rowHeight + margin
      let question_height = 0
        // 不等于选作题的原因-选作题内部标题有一行内容的高度
      switch(question.questionType) {
        case 'ObjectiveQuestion' :
          question_height = initial&&!segmented ?  availableRow * rowHeight + heightTitle  : availableRow * rowHeight
          break
        case 'FillInTheBlank' :
          question_height = initial&&!segmented ?  availableRow * rowHeight + heightTitle + marginHeight  : availableRow * rowHeight
          break
        case 'answerQuestion':
          question_height = avalibleHeight != 1000 ? availableRow * rowHeight + margin : availableRow * rowHeight
          break;
        case 'compositionEnglish':
          question_height = initial&&!segmented ?  availableRow * rowHeight + heightTitle + marginHeight  : availableRow * rowHeight
          break;
        case 'compositionLanguage':
          question_height = initial&&!segmented ?  availableRow * rowHeight + heightTitle + marginHeight  : availableRow * rowHeight
          break;
        default:
          question_height = availableRow * rowHeight - 8
      }

      let parameter = {
        availableRow:availableRow,
        avalibleHeight:avalibleHeight,
        height:question_height < rowHeight ? 0 : question_height,
        pagination:question_height >= question.height ? false :
          question_height <= heightTitle + marginHeight ? false : question_height < rowHeight ? false : true,
        marginHeight:marginHeight,
        rowHeight:rowHeight,
        isLast: true,
      }
      // console.log(parameter);
      return parameter
    },

    subTopic_numberHanldeEdit(id) {
      this.$refs.publicDialog.openedEdit('questionDialogs', id)
    },
    hanldeSubtraction(id, num) {
      // 选择题每组行数加减法
      this.$refs.publicDialog.change('questionDialogs', id, num)
    },
    hanldeSubtractionNon(obj, num) {
      this.$refs.publicDialog.change('NonRresponseArea', obj, num)
    },
    subTopic_numberFillEdit(id) {
      this.$refs.publicDialog.openedEdit('fillInTheBlanks', id)
    },
    subTopic_numberAnswerEdit(obj) {
      this.$refs.publicDialog.openedEdit('answerQuestion', obj)
    },
    subTopic_numberOptionalEdit(obj, id) {
      this.$refs.publicDialog.openedEdit('optionalQuestion', obj, id)
    },
    compositionEnglishEdit(obj) {
      this.$refs.publicDialog.openedEdit('compositionEnglish', obj)
    },
    compositionLanguageEdit(obj) {
      this.$refs.publicDialog.openedEdit('compositionLanguage', obj)
    },
    subtractSpacing(obj){
      this.$refs.publicDialog.changeSpacing(obj)
    },
    curEditNon(obj) {
      this.$refs.publicDialog.openedEdit('NonRresponseArea', obj)
    }
  },
}
</script>
<style lang="less" scoped>
  .seal-line-area {
    position: absolute;
    left: -90px;
    height: 1110px;
    background-color: #fff;
    top: 0px;
}
</style>

<style lang="less">
@import '~@/assets/css/variables.less';
.container-card {
  position: relative;
  padding-top: 15px;
  width: calc(100% - 330px);
  height: calc(100%);
  overflow: auto;
  float: left;
}
.page-contents {
  padding-top: 20px;
  height: 1110px;
  // overflow: hidden;
  background: @white;
  position: relative;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  .footer {
    position: relative;
    padding-left: 20px;
    padding-right: 20px;
    &.answer {
      padding-top: 0px;
    }
  }
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }

  .card_footer {
    border-top: 2px solid #f00;
    text-align: center;
    // font-size: 14px;
    line-height: 35px;
    position: absolute;
    bottom: 0;
    right: 0;
    left: 0;
    height: 70px;
    // width: 100%;
    // background: rgba(0,0,0,.3);
  }
}
.seal-line-area{
  width: 90px;
  display: flex;
  justify-content: space-around;
  align-items: stretch;
  // margin-top: -20px;
  // margin-bottom: -20px;
  // margin-right: 7px;
  border-right: 1px dashed #000;
}
.seal-line-cont{
  position: relative;
  width: 80px;
  display: flex;
  justify-content: space-between;
}
.seal-line-cont-transform{
  position: absolute;
  bottom: 80px;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  width: 985px;
  transform: rotate(-90deg) translateY(80px);
  transform-origin: left bottom;
}
.seal-line-stu{
  padding: 0;
  display: flex;
  justify-content: space-between;
  width: calc(100% - 165px);
  li{
    list-style: none;
    display: flex;
    white-space: nowrap;
    margin-right: 25px;
    span{
      border-bottom: 1px solid #000;
      width: 80%;
    }
  }
}
.seal-line-stu-code{
    border: 1px dashed #000;
    padding: 5px;
    text-align: center;
    width: 163px;
  p{
    margin: 5px 0;
    white-space: nowrap;
    &:first-child{
      font-size: 14px;
    }
    &:last-child{
      font-size: 12px;
      color: #888;
    }
  }
}
.el-select input{
  font-size: 14px;
}
</style>

