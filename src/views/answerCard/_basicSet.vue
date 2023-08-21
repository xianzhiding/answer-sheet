<template>
  <div class="btn-content">
    <div class="basis-title">
      <span>设置答题卡基础信息</span>
    </div>
    <div class="basis_checkbox">
      <el-checkbox
        class="mb-2"
        :model="pageLayout.asSecret"
        label="false"
        @change="handleSecret"
        >密封线</el-checkbox
      >
      <el-row class="mb-3">
        <el-col :span="10" :push="2"
        v-if="!pageLayout.asSecret"
          ><el-radio v-model="pageLayout.schNumType" :label="1" @change="handleSchNumType"
            >考号填涂区</el-radio
          ></el-col
        >
        <el-col :span="10" :push="2"
        v-if="!pageLayout.asSecret"
          ><el-radio v-model="pageLayout.schNumType" :label="2" @change="handleSchNumType"
            >条形码</el-radio
          ></el-col
        >
        <el-col :span="10" :push="2"
        v-if="!pageLayout.asSecret"
          ><el-checkbox v-model="pageLayout.asNoteExist" @change="handleNoteExist"
            >注意事项</el-checkbox
          ></el-col
        >
        <el-col :span="10" :push="2"
        v-if="!pageLayout.asSecret"
          ><el-checkbox v-model="pageLayout.asLackMark" @change="handleLackMark"
            >缺考标记</el-checkbox
          ></el-col
        >
      </el-row>
      <el-row>
        <el-col :span="10" :push="2"
          ><el-checkbox v-model="pageLayout.asAbPaper" @change="handleAbPaper"
            >存在AB卷</el-checkbox
          ></el-col
        >
        <el-col :span="10" :push="2"
          ><el-checkbox v-model="pageLayout.asRedCard" @change="handleRedCard"
            >红色答题卡</el-checkbox
          ></el-col
        >
        <el-col :span="12" :push="2"
          ><el-checkbox v-model="pageLayout.asColumn" @change="hanldeObjectiveColumn"
            >客观题竖向排列</el-checkbox
          ></el-col
        >
        <!-- <el-col :span="12"
          ><el-checkbox v-model="pageLayout.asBlock" @change="handleBlock"
            >分区答题卡</el-checkbox
          ></el-col
        > -->
      </el-row>
    </div>
    <div class="basis-title" v-if="pageLayout.asType == 2">
      <span>先阅后扫设置</span>
    </div>
    <div class="basis_checkbox" v-if="pageLayout.asType == 2">
      <el-row>
        <el-col :span="24"
          ><el-checkbox v-model="pageLayout.asRegularMark" @change="handleRegularMark"
            >显示打分规范</el-checkbox
          ></el-col
        >
        <el-col :span="24"><el-checkbox v-model="pageLayout.asScorePoint" label="1" @change="handleScorePoint">填空题打分框模式</el-checkbox></el-col>
        <div v-if="pageLayout.asScorePoint">
        <el-col :span="10" :push="2"
          ><el-radio v-model="pageLayout.asEachMark" :label="1" @change="handleEachMark"
            >填空题每空打分</el-radio
          ></el-col
        >
          <el-col :span="10" :push="2"
            ><el-radio v-model="pageLayout.asEachMark" :label="2" @change="handleEachMark"
              >填空题分别打分</el-radio
            ></el-col
          >
        </div>
        <el-col :span="12"
          ><el-radio v-model="pageLayout.asScoreMode" :label="1" @change="handleAsScoreMode"
            >加分模式</el-radio
          ></el-col
        >
        <el-col :span="12"
          ><el-radio v-model="pageLayout.asScoreMode" :label="2" @change="handleAsScoreMode"
            >减分模式</el-radio
          ></el-col
        >
      </el-row>
    </div>
    <div class="basis-title">
      <span>添加题目</span>
    </div>
    <div class="basis_checkbox basic_btn">
      <el-button type="primary" plain @click="questionDialog">客观题</el-button>
      <el-button type="primary" plain @click="fillInTheBlank">填空题</el-button>
      <el-button type="primary" plain @click="answerQuestion">解答题</el-button>
      <el-button type="primary" plain @click="compositionEnglish">作文(英)</el-button>
      <el-button type="primary" plain @click="compositionLanguage">作文(语)</el-button>
      <el-button type="primary" plain @click="NonRresponseArea">非作答</el-button>
      <el-button style="margin-left:0" v-if="pageLayout.asType == 1" type="primary" plain @click="optionalQuestion">选做题</el-button>
    </div>
    <div class="basis_checkbox basic_btn save-btn">
      <el-button type="success" @click="handlePreviewLink">预览</el-button>
      <el-button type="primary" @click="handleSaveBtn">保存</el-button>
      <el-button type="danger" @click="handleDownloadLayer">下载</el-button>
      <!-- <el-button type="warning" @click="handleStructureLayer" style="margin-left: 0;">结构</el-button> -->
    </div>
    <public-dialog ref="publicDialog" />
    <el-dialog title="提示" :visible.sync="openeDownloadLayer" :width="'400px'" :close-on-click-modal="false" center>
      <div class="Prompt_info">
        <div><i class="el-icon-question"></i>是否保存当前答题卡并下载？</div>
        <div style="color: #f00; margin-left: 0px">注：下载后答题卡将不能再修改。</div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="closeDownloadLayer">取 消</el-button>
        <el-button size="small" type="primary" @click="handelDownload">保存并下载</el-button>
      </div>
    </el-dialog>
    <el-dialog title="提示" :visible.sync="openeStructureLayer" :width="'400px'" :close-on-click-modal="false" center>
      <div class="Prompt_info">
        <div><i class="el-icon-question"></i>是否保存当前答题卡并显示结构?？</div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="closeStructureLayer">取 消</el-button>
        <el-button size="small" type="primary" @click="handleStructure">保存显示结构</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapState,mapGetters, mapMutations} from 'vuex'
import publicDialog from './dialog/_publicDialog'
import { QUESTION_NUMBERS } from '@/models/base'
import bus from './../../utils/eventBus.js'


export default {
  components: {
    publicDialog,
  },
  data() {
    return {
      checked: false,
      openeDownloadLayer: false,
      openeStructureLayer: false,
      openedFrame: true,
      saveBtnStuta:false,
      structureStatus:false,
      acid:'',
      returnIsNew:'',
      returnAcid:'',
      options: QUESTION_NUMBERS.map((label,value)=>({label,value})),
    }
  },
  computed: {
    ...mapState('page', ['pageLayout', 'pageData','IsNew']),
    ...mapState('pageContent', ['scoreTotal']),
    ...mapState('questionType',['subTopic_number_determine']),
    ...mapGetters('page',['page_width','compile_pageData']),

    pageWidth() {
      const {column,paperSpec} = this.pageLayout
      return column === 3 && paperSpec == 'A3'
        ? 520
        : 785
    },

    textVal(){
      const {content} = this.compile_pageData[0]
      return content.textVal
    },

    pageNum() {
      const {column,paperSpec} = this.pageLayout
      return column === 3 && paperSpec == 'A3' ? 3 :
      column === 1 && paperSpec == 'A4' ? 1 :2
    },

    questionLsit () {
      // 重新结构数据
      let sorted = this.$lodash.groupBy(this.compile_pageData, function(item){
        return item.questionType == 'answerQuestion' && item.objId

      })

      let Arr = []
      Object.values(sorted).forEach(element => {
        if(element[0].questionType == 'answerQuestion'){
          let obj = {
            ...element[0],
            showData:element
          }
          Arr.push(obj)
        }else{
          Arr = [...Arr,...element]
        }
      })
      return Arr
    },

    answerSheetData() {
      let obj = {}
      let questionArr = []
      this.questionLsit.forEach(question => {
        if(question.questionType == 'AnswerSheetTitle'){
          let {content} = question

          let edit = {}
          if(this.acid){
            edit = {
              'acid':this.acid,
              IsNew:false
            }
          }else{
            edit = {
              IsNew:true
            }
          }
          /* let items = JSON.parse(localStorage.getItem('accessToken')).map(item=>{
            if(item.content){
              {
                item.content
              }
            }
          })
          */
          let items = []
          JSON.parse(localStorage.getItem('accessToken')).forEach(item=> {
            if(item.questionType !=="AnswerSheetTitle"){
              if(item.itemGroup){
                [...item.itemGroup].forEach(s=>{
                  items.push({
                    sectionNo: QUESTION_NUMBERS[item.content.number],
                    sectionName: item.content.topicName,
                    questionNo: s.scoreNo,
                    score: s.score
                  })
                })
              }else{
                items.push({
                  sectionNo: QUESTION_NUMBERS[item.content.number],
                  sectionName: item.content.topicName,
                  questionNo: item.questionNo,
                  score: item.score
                }) 
              }
            }
          })
          obj = {
            // 'IsNew':this.returnIsNew == '' ? this.IsNew : this.returnIsNew,// 新增 false 编辑
            'name': content.textVal,
            'totalScore': this.scoreTotal,
            'exnum': content.titleRows,
            // 'admissionName': content.admissionName,
            // 'noticesRules': PRECAUTIONS,
            'studentInfos': content.titleInfo.filter(item => item.checked).map(item => item.name).toString(),
            'content': JSON.parse(localStorage.getItem('accessToken')),
            // 'QBAnswCardPartition':[
            //   {
            //     'seq': 1,
            //     'describe': "第1卷选择题",
            //     'totalScore': this.scoreTotal,
            //     'QBAnswCardTopic':[]
            //   }
            // ],
            'items': items.sort((a,b)=>{return a.questionNo - b.questionNo}),
            'remark':this.subTopic_number_determine,
            'pageLayout': this.pageLayout,
            ...edit
          }
        }else {
          switch(question.questionType){
            case 'ObjectiveQuestion':
              questionArr.push(this.objectiveTopic(question))
              break;
            case 'FillInTheBlank':
              questionArr.push(this.FillInTheBlankTopic(question))
              break;
            case 'optionalQuestion':
              questionArr.push(this.optionalTopic(question))
              break;
            case 'compositionEnglish':
              questionArr.push(this.compositionTopic(question))
              break;
            case 'compositionLanguage':
              questionArr.push(this.languageTopic(question))
              break;
            default:
              questionArr.push(this.answerTopic(question))
          }
        }
      })
      return obj;
      obj = {
        ...obj,
        QBAnswCardPartition:[
          {
            ...obj.QBAnswCardPartition[0],
          QBAnswCardTopic:questionArr
          }
        ]
      }
      return obj
    },

  },

  watch: {
    $route: {
      handler: function() {
        let acid = sessionStorage.getItem('acid')
        if (acid) {
          this.acid = acid
        }
      },
      immediate: true
    },
    /* $route: {
      handler: function(route) {
        const query = route.query
        if (query) {
          this.acid = query.acid
        }
      },
      immediate: true
    } */
  },

  // mounted() {
  //     document.cookie = 'ExamEmpSessionID=519d5085b94e4b1c8bcfffa56f0f566b'
  // },

  methods: {
    ...mapMutations("page", [
      "pageLayout_change",
      "reset_pageData",
      'pageData_edit_header'
    ]),
    questionDialog() {
      this.$refs.publicDialog.opened('questionDialogs')
    },
    fillInTheBlank() {
      this.$refs.publicDialog.opened('fillInTheBlanks')
    },
    answerQuestion() {
      this.$refs.publicDialog.opened('answerQuestion')
    },
    optionalQuestion() {
      this.$refs.publicDialog.opened('optionalQuestion')
    },
    compositionEnglish() {
      this.$refs.publicDialog.opened('compositionEnglish')
    },
    compositionLanguage() {
      this.$refs.publicDialog.opened('compositionLanguage')
    },
    NonRresponseArea() {
      this.$refs.publicDialog.opened('NonRresponseArea')
    },
    handlePreviewLink() {
      let previewContent = JSON.parse(sessionStorage.getItem('previewContent'))
      if(this.pageLayout.column === 1&&previewContent.length>2) return alert('答题卡已超过两页，请返回修改');
      if(this.pageLayout.column === 2&&previewContent.length>4) return alert('答题卡已超过两页，请返回修改');
      if(this.pageLayout.column === 3&&previewContent.length>6) return alert('答题卡已超过两页，请返回修改');
      // 跳转至预览页面
      let routeTwo = this.$router.resolve(
        {
          name: 'preview',
          query: {pageWidth: this.pageWidth,pageNum:this.pageNum}
        }
      )
      window.open(routeTwo.href, '_blank')
    },
    openDownloadLayer () {
      this.openeDownloadLayer = true
    },
    closeDownloadLayer () {
      this.openeDownloadLayer = false
    },
    handleDownloadLayer(){
      this.openDownloadLayer()
    },
    handelDownload(){
      this.closeDownloadLayer()
      this.saveBtnStuta = true
      this.handleSaveBtn()
    },
    openStructureLayer () {
      this.openeStructureLayer = true
    },
    closeStructureLayer () {
      this.openeStructureLayer = false
    },
    handleStructureLayer(){
      this.openStructureLayer()
    },
    handleStructure(){
      this.closeStructureLayer()
      this.structureStatus = true
      this.handleSaveBtn()
    },
    handleSaveBtn(){
      let that = this;
      let previewContent = JSON.parse(sessionStorage.getItem('previewContent'))
      if(this.pageLayout.column === 1&&previewContent.length>2) return alert('答题卡已超过两页，请返回修改');
      if(this.pageLayout.column === 2&&previewContent.length>4) return alert('答题卡已超过两页，请返回修改');
      if(this.pageLayout.column === 3&&previewContent.length>6) return alert('答题卡已超过两页，请返回修改');
      // 保存
      let obj =  JSON.parse(JSON.stringify({
        ...this.answerSheetData,
        IsNew:this.returnIsNew == '' ? this.answerSheetData.IsNew : false
      }))

      if(this.textVal !=''){
        const loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        })
        if(this.returnIsNew != ''){
          obj.IsNew = this.returnIsNew
        }
        let data = {
          content: JSON.stringify(obj),
          asName: obj.name,
          asLayout: obj.pageLayout.column,
          asType: obj.pageLayout.asType,
          paperSpec: obj.pageLayout.paperSpec,
          verNo: 2,
          pageWidth: this.pageWidth,
          pageNum:this.pageNum,

          // asName: i.title,
          // asLayout: u.blockCount,
          // asType: u.isScorePoint+1,
          // paperSpec: u.pageSize,
        }
        // return
        if(this.acid){
          data.id = this.acid
        }
        let url = this.acid ? mfc.getContextPath()+'/as/update' : mfc.getContextPath()+'/as/create'
        $.post(url, {data:JSON.stringify(data)}).then(res=>{
          let id = this.acid ? this.acid : res.data.id;
          sessionStorage.setItem('acid', id)
          if(res.code === 0){
            this.$message({
              message: '保存成功',
              type: 'success'
            })
            if(this.saveBtnStuta){
              // 下载
              let routeTwo = this.$router.resolve(
                {
                  name: 'preview',
                  query: {pageWidth: this.pageWidth,pageNum:this.pageNum,down:1}
                }
              )
              window.open(routeTwo.href, '_blank')
              const pdfUrl = mfc.getContextPath() + '/as/exportPdf/'+ id;
              mfc.down(pdfUrl,null,"GET",data.asName+".pdf");
              // alert('下载成功')
              // http://localhost:9090/moofen-nep/web/dist/index.html?acid=84#/preview?pageWidth=520&pageNum=3&down=1
              // var id = this.acid?this.acid:res.data.id;
              // if(res.data){
              //     getId.id = res.data.id
              // }
            

              this.saveBtnStuta = false
            }
            if(this.structureStatus){
              var url = mfc.getContextPath() + '/as/structure/'+ id;
              $.get(url).then( (sData)=> {
                if(sData.code === 0) {
                  // mfc.modal("结构", template('answerSheetStructureTpl', {data: sData.data}));
                  this.structureStatus = false
                }
              }).fail(()=>{
                this.structureStatus = false
              })
            }
            this.returnIsNew = res.data.ResponseContent.IsNew
            this.returnAcid = res.data.ResponseContent.acid
            this.acid = res.data.ResponseContent.acid
            loading.close()
          }
        }).fail(()=>{
          this.saveBtnStuta = false
          loading.close()
        })
      }else{
        this.$message({
          message: '答题卡标题不能为空!',
          type: 'warning'
        });
      }
    },

    objectiveTopic(question){
      // 客观题
      let {content,showData} = question
      let obj = {
        'num':content.number,
        'name':content.topicName,
        'type':"客观题",
        'totalScore':content.scoreTotal,
      }
      // let topicList = showData.flat().flat()
      // obj = {
      //   ...obj,
      //   QBAnswCardQuestions:topicList.map(item => {
      //       let type = '单选题'
      //       if(item.id.indexOf('check') != -1){
      //         type = '多选题'
      //       }else if(item.id.indexOf('judgment') != -1){
      //         type = '判断题'
      //       }else{
      //         type = '单选题'
      //       }

      //       return {
      //         'qnum':item.topic,
      //         'type':type,
      //         'score': item.score,
      //         'optionnum':item.select
      //       }
      //   })
      // }
      return obj
    },

    FillInTheBlankTopic(question){
      // 客观题
      let {content,showData} = question
      let obj = {
        'num':content.number,
        'name':content.topicName,
        'type':'主观题',
        'totalScore':content.scoreTotal,
      }
      // let topicList = showData.flat().flat()
      // obj = {
      //   ...obj,
      //   QBAnswCardQuestions:topicList.map(item => {
      //       return {
      //         'qnum':item.lid !=undefined ? `${item.topic}.${item.spaceNum}.${item.smallTopic}` : item.Multistage != undefined ? `${item.topic}` : `${item.topic}.${item.spaceNum}`,
      //         'type':'填空题',
      //         'score': item.score,
      //       }
      //   })
      // }

      return obj
    },

    optionalTopic(question){
      // 选作题
      let {content} = question
      let obj = {
        'num':content.number,
        'name':content.topicName,
        'type':'主观题',
        'totalScore':content.scoreTotal,
      }
      let topicList = content.group.map(question => question.childGroup).flat().map(item => item.topic)

      // obj = {
      //   ...obj,
      //   QBAnswCardQuestions:[{
      //     'qnum':`${topicList[0]}-${topicList[topicList.length - 1]}`,
      //     'type':'选作题',
      //     'score': content.scoreTotal,
      //   }]
      // }

      return obj
    },

    compositionTopic(question){
      // 作文（英）
      let {content} = question
      let obj = {
        'num':content.number,
        'name':content.topicName,
        'type':'主观题',
        'totalScore':content.scoreTotal,
      }

      // obj = {
      //   ...obj,
      //   QBAnswCardQuestions:[{
      //     'qnum':content.topic,
      //     'type':'作文(英)',
      //     'score': content.scoreTotal,
      //   }]
      // }

      return obj
    },

    languageTopic(question){
      // 作文（语）
      let {content} = question
      let obj = {
        'num':content.number,
        'name':content.topicName,
        'type':'主观题',
        'totalScore':content.scoreTotal,
      }

      // obj = {
      //   ...obj,
      //   QBAnswCardQuestions:[{
      //     'qnum':content.topic,
      //     'type':'作文(语)',
      //     'score': content.scoreTotal,
      //   }]
      // }
      return obj
    },

    answerTopic(question) {
      let {content,showData} = question
      let obj = {
        'num':content.number,
        'name':content.topicName,
        'type':'主观题',
        'totalScore':question.scoreTotal,
      }

      // obj = {
      //   ...obj,
      //   QBAnswCardQuestions:showData.map(ele => {
      //     return {
      //       'qnum':ele.topic,
      //       'type':'解答题',
      //       'score': ele.score,
      //     }
      //   })
      // }
      return obj
    },
    // 密封线
    handleSecret(e) {
      this.pageLayout.asSecret = e;
      this.pageLayout_change(this.pageLayout);
      if(e){
        this.pageData[0].contentHeight = 0
      }else{
        this.pageData[0].contentHeight = 293
      }
      localStorage.setItem('accessToken', JSON.stringify(this.compile_pageData))
      this.reset_pageData(this.pageData);

    },
    // 填写布局
    handleSchNumType(e) {
      this.pageLayout.schNumType = e;
      this.pageLayout_change(this.pageLayout);
      localStorage.setItem('accessToken', JSON.stringify(this.compile_pageData))
    },
    // 注意事项
    handleNoteExist(e) {
      this.pageLayout.asNoteExist = e;
      this.pageLayout_change(this.pageLayout);
      if(e && this.pageLayout.column !== 3){
        this.pageData[0].checkHeight = 40
      }else if(e && this.pageLayout.column === 3){
        this.pageData[0].checkHeight = 80
      }else{
        this.pageData[0].checkHeight = 0
      }
      this.reset_pageData(this.pageData);
    },
    // 缺考标记
    handleLackMark(e) {
      this.pageLayout.asLackMark = e;
      this.pageLayout_change(this.pageLayout);
      localStorage.setItem('accessToken', JSON.stringify(this.compile_pageData))
    },
    // 存在AB卷
    handleAbPaper(e) {
      this.pageLayout.asAbPaper = e;
      this.pageLayout_change(this.pageLayout);
      this.pageData[0].heightTitle = e && this.pageData[0].heightTitle < 78 ? 78 : this.pageData[0].heightTitle < 40 ? 40 : 40
      // console.log(this.pageData[0]);
      this.reset_pageData(this.pageData);
    },
    // 红色答题卡
    handleRedCard(e) {
      this.pageLayout.asRedCard = e;
      this.pageLayout_change(this.pageLayout);
      localStorage.setItem('accessToken', JSON.stringify(this.compile_pageData))
    },
    // 客观题竖向排列
    hanldeObjectiveColumn(e) {
      this.pageLayout.asColumn = e;
      this.pageLayout_change(this.pageLayout);
      localStorage.setItem('accessToken', JSON.stringify(this.compile_pageData))
      bus.$emit('objectiveColumn', e)
      // console.log(this.pageData);
      this.pageData.forEach(item => {
        if(item.questionType == 'ObjectiveQuestion'){
          item.asColumn = e
        }
      });
      this.reset_pageData(this.pageData);
    },
    // 分区答题卡
    handleBlock(e) {
      this.pageLayout.asBlock = e;
      this.pageLayout_change(this.pageLayout);
    },
    
    // 显示打分规范 norm
    handleRegularMark(e) {
      this.pageLayout.asRegularMark = e;
      if(e){
        this.pageData[0].regularMarkHeight = 80
        if(this.pageLayout.asScorePoint){
          this.pageData[0].scorePointHeight = 35
        }
      } else{
        this.pageData[0].regularMarkHeight = 0
        this.pageData[0].scorePointHeight = 0
      }
      this.pageLayout_change(this.pageLayout);
      this.reset_pageData(this.pageData)
    },
    handleScorePoint(e) {
      this.pageLayout.asScorePoint = e;
      if(e&&this.pageLayout.asRegularMark){
        if(this.pageLayout.asEachMark == 2 && this.pageLayout.column === 3){
          this.pageData[0].scorePointHeight = 30
        }else{
          this.pageData[0].scorePointHeight = 35
        }
      }else{
        this.pageData[0].scorePointHeight = 0
      }
      this.pageLayout_change(this.pageLayout);
      this.reset_pageData(this.pageData)
    },
    // 填空题每空打分
    handleEachMark(e) {
      this.pageLayout.asEachMark = e;
      if(this.pageLayout.asRegularMark){
        if(e==2 && this.pageLayout.column === 3){
          this.pageData[0].scorePointHeight = 30
        }else{
          this.pageData[0].scorePointHeight = 35
        }
      }
      this.pageLayout_change(this.pageLayout);
      this.reset_pageData(this.pageData)
    }
    ,handleAsScoreMode(e){
      this.pageLayout.asScoreMode = e;
      localStorage.setItem('accessToken', JSON.stringify(this.compile_pageData))
      this.pageLayout_change(this.pageLayout);
      this.reset_pageData(this.pageData)
    }
  },
}
</script>

<style lang="less">
@import '~@/assets/css/variables.less';
.btn-content {
  width: 320px;
  float: right;
  border-left: 1px solid @shadow;
  height: 100%;
  background: @white;
}
.basis-title {
  border-left: none;
  border-right: none;
  background-color: @bf-f7;
  height: 40px;
  line-height: 40px;
  text-align: left;
  font-size: 16px;
  font-weight: 700;
  padding: 0 30px;
  border-bottom: 1px solid @bs-e3;
}
.basis_checkbox {
  padding: 20px 0;
  border-bottom: 1px solid @shadow;
  padding-left: 15px;
  .el-col{
    margin-bottom: 5px;
  }
}
.el-button--medium {
  padding: 0 0;
  width: 90px;
  padding: 0;
  height: 38px;
  line-height: 36px;
}
.basis_checkbox.basic_btn {
  padding: 15px 0;
  padding-left: 15px;
  .el-button{
    margin-bottom: 10px;
  }
  .el-button:nth-child(4){
    margin-left: 0;
  }
}
// .el-button--primary {
//   // background-color: @main !important;
//   // border-color: @main !important;
// }

// .el-button:hover {
//   // color: @main !important;
//   // border-color: @bc_hover !important;
//   // background-color: @mainHover !important;
// }
.el-checkbox__input.is-checked .el-checkbox__inner,
.el-checkbox__input.is-indeterminate .el-checkbox__inner {
  background-color: @main !important;
  border-color: @main !important;
}
.el-checkbox__input.is-checked + .el-checkbox__label {
  color: @main !important;
}
// .el-button + .el-button {
//   // margin-left: 0;
// }
button.el-button.el-button--default.el-button--medium {
  margin-top: 10px;
  margin-left: 10px;
}
.basis_checkbox.basic_btn.save-btn {
  .el-button + .el-button {
    margin-left: 10px;
  }
}
</style>
