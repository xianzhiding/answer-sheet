<template>
  <div class="page-content preview-content" :class="downs ? 'down_style' : ''" ref="pageContent" >
    <div class="main-info">
      <div v-for="(pages, i) in contentData" :key="i" 
        :class="['page_card',
        {'page_column-1':pageNum == 1&&!isAsSecret},
        {'page_column-2':pageNum == 2&&!isAsSecret},
        {'page_column-3':pageNum == 3&&!isAsSecret},
        {'page_column_line-1':pageNum == 1&&isAsSecret},
        {'page_column_line-2':pageNum == 2&&isAsSecret},
        {'page_column_line-3':pageNum == 3&&isAsSecret}]" 
        :style="{width:pageNum == 1 ? '825px' : '1650px', height:pageNum == 1&&isAsSecret &&'1251px'}">
        <div v-if="isAsSecret" class="seal-line-area">
          <div class="seal-line-cont">
            <div class="seal-line-cont-transform">
              <ul class="seal-line-stu">
                <li 
                  v-for="(titleInfo, index) in studentInfoArr"
                  :key="index"
                  :style="{width: studentInfoLength + '%'}"
                >{{titleInfo.name}}：<span></span></li>
              </ul>
            <div class="seal-line-stu-code" v-if="isAsSecret&&schNumType">
              <p>贴条形码区</p>
              <p>贴二维码/条形码，勿贴出框外</p>
            </div>
            </div>
          </div>
          <!-- <div class="seal-line-line"><svg width="2" height="1165" fill="none" xmlns="http://www.w3.org/2000/svg"><path stroke-dasharray="5,5" d="M0 0v1104" stroke="#000" stroke-width="2"></path></svg></div> -->
        </div>
        <div class="page_card-content"
         >
         <!-- :style="{width:pageNum == 1&&isAsSecret ? '700px':pageNum == 1 ? '825px' : isAsSecret ? (1650 - 97) +'px': '1650px'}" -->
          <div :class="['previewCanvas']">
            <div :style="{
                marginTop:'0',
                position: 'absolute', 
                top: '20px', 
                left: i>0? '0': '50%',
                marginLeft: i<1?'-75px': '200px'
              }">
              <svg
              
              xmlns="http://www.w3.org/2000/svg"
              version="1.1" width="27" height="17" 
              :style="{

              }">
                <rect data-v-3e8cfbb0="" x="0" y="1" width="30" height="17" stroke="#000000" fill="#000000" style="fill-opacity: 1;"></rect></svg>
                <svg
              xmlns="http://www.w3.org/2000/svg"
              version="1.1" width="27" height="17" 
              :style="{
                marginLeft: '100px'
              }">
                <rect data-v-3e8cfbb0="" x="0" y="1" width="30" height="17" stroke="#000000" fill="#000000" style="fill-opacity: 1;"></rect></svg>
            </div>
            <!-- <svg
              xmlns="http://www.w3.org/2000/svg"
              version="1.1" width="27" height="17" 
              :style="{
                position: 'absolute', 
                top: '20px', 
                left: i>0? (i*50)+50+'px': '50px',
              }">
                <rect data-v-3e8cfbb0="" x="0" y="1" width="27" height="17" stroke="#000000" fill="#000000" style="fill-opacity: 1;"></rect></svg> -->
            <div class="left" style="flex-shrink:1">
              <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="30" height="30">
                <rect x="0" y="1" width="30" height="17" style="fill-opacity: 1;" stroke="#000000" fill="#000000"></rect>
              </svg>
            </div>
            <div class="right" style="flex-shrink:1">
              <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="30" height="30">
                <rect x="0" y="1" width="30" height="17" style="fill-opacity: 1;" stroke="#000000" fill="#000000"></rect>
              </svg>
            </div>
          </div>
            <!-- :style="{
              width: pageNum == 1&&isAsSecret? '710px' :pageWidth + 'px',
              position: 'relative',
              marginLeft:isAsSecret ? '10px' : a == 0 ?  paperSpec == 'A3' ? '48px' : paperSpec =='A4' ? '35px' : 'none' :'30px'
            }" -->
          <div
            v-for="(pagesCrad, a) in pages"
            :key="a"
            :class="[
              'page_info_itme',
              {
                answer: pagesCrad.first != undefined && pagesCrad.first == false,
              },
            ]"
          >
              <div class="pages">
            <div
              v-for="(question, index) in pagesCrad"
              :key="index"
              :class="['footer',
              {answerSheetTitle:question.questionType == 'AnswerSheetTitle'},
                {answer:question.questionType == 'answerQuestion' && question.orderFirst && index > 0},
                {answers:question.questionType == 'answerQuestion'||question.questionType == 'FillInTheBlank'}
              ]"
              :style="{'top':question.top+'px', 'height': question.questionType == 'AnswerSheetTitle' ? (question.height +'px') : 'auto'}"
            >
              <!-- <div class="locating-point locating-point-x" v-if="question.questionType == 'AnswerSheetTitle'&& question.content.pageLayout.schNumType == 1&& !question.content.pageLayout.asSecret" style="top: -50px">
                <ul>
                  <li v-for="(item) in question.content.titleRows" :key="item"></li>
                </ul>
              </div>
              <div class="locating-point locating-point-y" v-if="question.questionType == 'AnswerSheetTitle'&& question.content.pageLayout.schNumType == 1&& !question.content.pageLayout.asSecret" :style="[{bottom: question.regularMarkHeight+question.scorePointHeight + 3+'px'}]">
                <ul>
                  <li v-for="(item) in 10" :key="item"></li>
                </ul>
              </div> -->
              <component
                :is="question.questionType"
                :content-data="question.content"
                :question-data="question"
                :preview-is="true"
                :preview-content="true"
                :page-index="index"
                :preview-width="parseInt(pageWidth)"
                :readonly="1"
              />
            </div>
              </div>
            <!-- <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="27" height="17" style="position: absolute;top: -50px;left: -1px;">
                <rect x="0" y="1" width="27" height="17" style="fill-opacity: 1;" stroke="#000000" fill="#000000"></rect>
              </svg> -->
          </div>
          <div class="previewCanvas bottom">
            <div class="left">
              <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="30" height="30">
                <rect x="0" y="1" width="30" height="17" style="fill-opacity: 1;" stroke="#000000" fill="#000000"></rect>
              </svg>
            </div>

            <div class="card_footer" :style="{width:pageNum == 1 ? '100%' : '100%',position:'relative'}">
                第 {{ i + 1 }} 页 共 {{ contentData.length }} 页
            </div>
            <div class="right">
              <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="30" height="30">
                <rect x="0" y="1" width="30" height="17" style="fill-opacity: 1;" stroke="#000000" fill="#000000"></rect>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import { PAGE_HEIGHT, AREA_NUMBERS } from '@/models/base'
import qs from 'qs'

import AnswerSheetTitle from './questionContent/_answerSheetTitle' // 答题卡标题
import ObjectiveQuestion from './questionContent/_ObjectiveQuestion' // 客观题
import FillInTheBlank from './questionContent/_FillInTheBlank' // 填空题
import answerQuestion from './questionContent/_answerQuestion' // 解答题
import optionalQuestion from './questionContent/_optionalQuestion' // 选作题
import compositionEnglish from './questionContent/_compositionEnglish' // 作文英语
import compositionLanguage from './questionContent/_compositionLanguage' // 作文语文
import NonRresponseArea from './questionContent/_NonRresponseAreaContent' // 非作答
// import { URL } from '../../utils/config.js'

export default {
  components: {
    AnswerSheetTitle,
    ObjectiveQuestion,
    FillInTheBlank,
    answerQuestion,
    optionalQuestion,
    compositionEnglish,
    compositionLanguage,
    NonRresponseArea,
  },
  data() {
    return {
      contentData: [],
      ces: '',
      pageData:JSON.parse(localStorage.getItem('accessToken')),
      pageWidth:this.$route.query.pageWidth,
      pageNum:this.$route.query.pageNum,
      down:this.$route.query.down,
      page_height:PAGE_HEIGHT,
      difference:0,
      svgWidth:110,
      titleVal:'',
      paperSpec:'A3',
      area_number: AREA_NUMBERS,
      pageLayout: {},
      status: false
    }
  },

  computed: {
    downs() {
      return this.$route.query.down ? 1 : 0
    },
    studentInfoArr() {
      return this.pageData[0].content.titleInfo.filter((item) => item.checked == true)
    },
    studentInfoLength() {
      return 100 / this.studentInfoArr.length
    },
    isAsSecret(){
      return this.pageData[0].content.pageLayout.asSecret
    }
    ,schNumType(){
      return this.pageData[0].content.pageLayout.schNumType != 1
    }
  },

  watch: {
    pageData: {
      immediate: true,
      handler() {
        if(this.downs){
          if(!this.status){
            localStorage.removeItem('accessToken')
            const str = location.href;
            let {acid} = str.queryURLParams()
            if(!acid){
              acid = sessionStorage.getItem('acid')
            }
            $.get(mfc.getContextPath()+'/as/get/'+acid).then((res) => {
              this.status = true
              if(res.code === 0){
                let obj = JSON.parse(res.data.content)
                localStorage.setItem('accessToken', JSON.stringify(obj.content))
                this.pageData = obj.content
                const {content} = this.pageData[0]
                this.titleVal = content.textVal
                this.paperSpec = content.pageLayout.paperSpec
                this.pageLayout = content.pageLayout
                let data = this.pageContentFunc(this.pageData)
                if(this.pageNum == 1){
                  this.contentData = data.map(obj => ([obj]))
                }else{
                  const num = this.pageNum //分割长度
                  const times = Math.ceil(data.length / num)
                  const newArr = []
                  for(let i = 0; i <= times; i++){
                    if(i*num >= data.length){
                    break
                  }
                  newArr.push(data.slice(i*num, (i+1)*num))
                  }
                  this.contentData = newArr
                }
              }
            })
          }
        }
        else{
          const {content} = this.pageData[0]
          this.titleVal = content.textVal
          this.paperSpec = content.pageLayout.paperSpec
          this.pageLayout = content.pageLayout
          let data = this.pageContentFunc(this.pageData)
          if(this.pageNum == 1){
            this.contentData = data.map(obj => ([obj]))
          }else{
            const num = this.pageNum //分割长度
            const times = Math.ceil(data.length / num)
            const newArr = []
            for(let i = 0; i <= times; i++){
              if(i*num >= data.length){
              break
            }
            newArr.push(data.slice(i*num, (i+1)*num))
            }
            this.contentData = newArr
          }
        }
        
      },
    },
  },

  mounted () {
    let slef = this
    if(this.downs){
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      setTimeout( () => {
        this.generatorImage()
        loading.close()
      },5000);
    }

  },

  methods: {
    ...mapMutations('pageContent', ['pageHeight_set']),

    pageContentFunc(rects = []) {
      var results = []
      // currentPage.height 总高度
      var currentPage = {height:0,rects:[]}

      //重置高度
      function resetCurrentPage () {
        currentPage.height = 0;
        currentPage.rects = [];
      }

      rects.forEach(rect =>{
        //计算变量及对象追加
        let backup = {}
        let superiorGrid = 0
        let segmented = 0
        let segmentedArr = []
        let contentRows = rect.content.rows // 用于英语作文
        let remainderHeight = 0
        var avalibleHeight = this.page_height - currentPage.height
            remainderHeight = avalibleHeight

        // 用于客观题 填空题数组分割
        const itemObj = JSON.parse(JSON.stringify(rect))
        // 高度溢出---------------------------------------------------------------------------
        if(rect.height > avalibleHeight){
          

          let height = rect.height
          let curRect = this.preliminaryQuestion(rect, avalibleHeight,rect.first,segmented)
          // 是否分割当前题型
          if(curRect.pagination){

            // 客观题 填空题
            if(rect.showData && rect.showData.length){
              backup = {
                showData:itemObj.showData.splice(0, curRect.availableRow),
                first:curRect.pagination
              }
            }

            // 选作题
            if(rect.questionType == 'optionalQuestion' ||
              rect.questionType == 'answerQuestion'
            ){
              backup = {
                rows:curRect.availableRow > rect.content.rows ? rect.content.rows : curRect.availableRow > 0 ? curRect.availableRow : 0
              }
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
              segmentedArr:segmentedArr
            })
            if(rect.questionType == 'compositionEnglish'){
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
              backup = {
                rows:rows - curRect.availableRow >= 0 ? rows - curRect.availableRow : 0
              }
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
              segmentedArr:segmentedArr
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
            backup = {
              rows:curRect.availableRow < 0  ? rows :  rows - curRect.availableRow
            }
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
          // 分页段所占行数
          currentPage.rects.push({
            ...rect,
            castHeight: currentPage.height, // 分段后减去加入的差值
            actualHeight: currentPage.height,
            ...backup,
            first:rect.questionType == 'compositionLanguage' ? false : !curRect.pagination,
            segmented:segmented,
            segmentedArr:segmentedArr
          })

        }else{
          // 变量
          let backup = {}
          // currentPage.height += rect.height + this.difference
          currentPage.height += rect.height

          // 选作题
          if(rect.questionType == 'optionalQuestion' ||
              rect.questionType == 'answerQuestion' ||
              rect.questionType == 'compositionEnglish'
            ){
            backup = {
              rows:rect.content.rows,
            }
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
          })
        }
      })

      if(currentPage.height){
        results.push(currentPage.rects)
      }

      return results
    },

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
      }
      return parameter
    },
    // 下载
    generatorImage(){
      /* let htmlText = document.documentElement.outerHTML //document.getElementsByTagName('html')[0].outerHTML
      this.$nextTick(()=>{
        if(this.htmlText != ''){
          const loading = this.$loading({
            lock: true,
            text: 'Loading',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          })
          htmlText = document.documentElement.outerHTML
          this.$http.post('/FileUpLoad/SaveHtml',
              qs.stringify({'htmlText':htmlText,'AnswerCardName':this.titleVal}),
              {
                baseURL: URL.SERVICE_UPLOAD_PICTURE,
              }
              ).then(({data}) => {
                if(data.ReturnCode == 9998){ // http://localhost:60044
                  window.location.href = `/Assembly/AnswerCard/DownLoadAnswerCard?htmlUrl=${data.ReturnInfo}&AnswerCardName=${this.titleVal}&paperSpec=${this.paperSpec}`
                  loading.close()
                }
              })
            .catch(() => { // 请求失败处理
              loading.close()
            })
        }
      }) */
      
    }
  },
}
</script>

<style lang="less" scoped>
html {
  background: #ffffff;
}
#app,
.page-content,
.main-info {
  background: #ffffff;
}
.page-content {
  // margin-top: 50px;
  .page_card {
    display: flex;
    flex-wrap: wrap;
    width: 1650px;
    justify-content: left;
    position: relative;
  }
  .page_column-1{
    .page_card-content{
      width: 825px;
      flex-direction: column;
    }
    .page_info_itme{
      width: 765px;
      margin-left: 30px;
    }
  }
  .page_column-2{
    .page_card-content{
      width: calc(1650px);
    }
    .page_info_itme{
      width: calc((1650px - 116px) / 2);
      margin-left: 55px;
      &:nth-child(2){
        margin-left: 30px;
      }
    }
  }
  .page_column-3{
    height: 1164px;
    .page_card-content{
      width: calc(1650px);
    }
    .page_info_itme{
      width: calc((1650px - 144px) / 3);
      margin-left: 42px;
      &:nth-child(2){
        margin-left: 30px;
      }
    }
  }
  .page_column-2,.page_column-3{
    .page_card-content{
      flex-wrap: wrap;
    }
    // .page_info_itme{
    //   margin-left: 50px;
    // }
  }
  .page_column_line-1{
    width: 885px !important;
    .page_card-content{
      width: calc(825px - 30px);
      flex-direction: column;
    }
    .page_info_itme{
      // width: calc(825px - 90px - 40px);
      width: calc(825px - 70px);
    }
  }
  .page_column_line-2{
    .page_card-content{
      width: calc(1650px - 90px);
    }
    .page_info_itme{
      width: calc((1650px - 90px - 48px) / 2);
    }

  }
  .page_column_line-3{
    .page_card-content{
      width: calc(1650px - 90px);
    }
    .page_info_itme{
      width: calc((1650px - 90px - 60px) / 3);
    }
  }
  .page_column_line-1,.page_column_line-2,.page_column_line-3{
    .page_card-content{
      flex-wrap: wrap;
    }
    .page_info_itme{
      margin-left: 10px;
    }
    .previewCanvas{
      .left{
        margin-left: 10px
      }
    }
    &:nth-child(even){
      .seal-line-area{
        order: 2;
        transform: rotateY(180deg);
        // margin-left: 7px;
        margin-right: 0;
      }
      .seal-line-cont{
        transform: rotateX(180deg);
      }
      .previewCanvas{
        .left{
          margin-left: 30px
        }
        .right{
          margin-right: 10px;
        }
        
      }
      .page_info_itme:nth-child(2){
        margin-left: 30px;
      }
    }
  }

  .page_card-content{
    display: flex;
    // padding: 0 20px;
    // flex-wrap: wrap;
    // width: 1650px;
    // justify-content: left;
    // position: relative;
    
    // &.asSecret{
    //   .previewCanvas{
    //     .left{
    //       margin-left: 10px
    //     }
    //     .right{
    //       margin-right: 35px;
    //     }
    //   }
    //   // .page_info_itme:nth-child(2){
    //   //   margin-left: 35px !important;
    //   // }
    // }
  }
  &.down_style{
    margin-top:0
  }

  .previewCanvas{
    width: 100%;
    height: 60px;
    display: flex;
    justify-content: space-between;

    .left,.right{
      margin-top: 20px;
    }
    .left{
      margin-left: 30px
    }
    .right{
      margin-right: 30px;
    }
    
  }
  
  
  .pageNum1{
    .previewCanvas div{

      &.left{
        margin-left: 35px
      }
      &.right{
        margin-right: 30px;
      }
    }
  }
}
.page_info_itme{
  .footer {
    &.answer{
      margin-top:0;
    }
    &.answerSheetTitle{
      position: relative;
    }
  }
}
.page_info_itme {
  width: 760px;
  height: 1044px;
  padding: 10px;
  border: 1px solid #888;
}
.card_footer {
  width: 100%;
  text-align: center;
  margin-top: 30px;
  font-size: 14px;
  margin-bottom: 20px;
}

.student-list{
  width: calc(100% - 16px);}
  .preview-content{
    .question-info{
      // width: calc(100% - 16px);
      &:hover{
        .question_arrays{
          display: none !important;
        }
        .question_editOrDel{
          display: none !important;
        }
      }
    }
    .question-handler{
      svg{display: none !important}
    }

    .question-title{
      &:hover{
        border-color: #fff;
      }
    }
}
</style>

<style lang="less">
.locating-point{
  position: absolute;
  ul{
    list-style: none;
    padding: 0;
    margin: 0;
    padding-top: 21px;
  }
  li{
    width: 17px;
    height: 11px;
    background-color: #000;
  }
  &.locating-point-y{
    left: -40px;
    
    li{
      margin-bottom: 9px;
    }
  }
  &.locating-point-x{
    right: 3px;
    ul{
      display: flex;
      padding-top: 0;
    }
    li{
      margin-left: 14px;
    }
  }
}
.answers{
  .content-info{
    overflow: hidden;
    p{
    padding: 0 9px;
  }
  }
}
.preview-content{
  .question-title:hover {
    border-color: transparent
  }
}
.question-item .mce-content-body{
  overflow: hidden !important;;
}

</style>
