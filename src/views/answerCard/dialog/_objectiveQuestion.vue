<template>
  <el-dialog
    class="newAdd-content"
    :title="title"
    :visible.sync="openedFrame"
    :width="'600px'"
    :before-close="closeFrame"
    :close-on-click-modal="false"
    center
  >
    <div class="item-box">
      <el-row>
        <el-col :span="12" class="select-item">
          <div class="label">大题题号:</div>
          <hj-select
            :items="options"
            size="mini"
            :value="editingData.number"
            @change="changeQuestionBig"
          ></hj-select>
        </el-col>
        <el-col :span="12" class="select-item">
          <div class="label">题目:</div>
          <el-input
            v-model="editingData.topicName"
            size="mini"
            placeholder="请输入内容"
          ></el-input>
        </el-col>
        <el-col :span="24" class="select-item">
          <div class="label">每组题数:</div>
          <el-input
            v-model.number="editingData.rows"
            size="mini"
            placeholder="请输入内容"
          ></el-input>
        </el-col>
      </el-row>
      <!-- 题型编辑区 -->
      <tab-pane-box
        :edit-id="editQuestionId"
        :question-group="editingData.group"
        :as-column="asColumn"
        @group-verify-status="groupVerifyStatus"
        @update-group-subTopic="updateGroupSubTopic"
        @pre-edit-subtopic="preEditSubtopic"
        @add-group-question="addGroupQuestion"
        @del-subtopic-group="delSubtopicGroup"
      />
      <!-- 题型编辑区 -->
      <div class="condition_box Insert_box" v-show="editQuestionId == ''">
        <el-checkbox v-model="editingData.InsertTitle"
          >插入添加题目</el-checkbox
        >
        <div
          :class="[
            'questionNumber_big_exist_style',
            { Fade: !editingData.InsertTitle },
          ]"
        >
          <span>插入到第</span>
          <hj-select
            :items="questionNumber_big_exist"
            size="mini"
            :value="existNumber"
            @change="changeSelectexistBig"
          />
          <span>大题后</span>
        </div>
        <el-checkbox
          :class="['Postpone', { Fade: !editingData.InsertTitle }]"
          v-model="editingData.Postpone"
          >大题号自动顺延</el-checkbox
        >
        <div class="Insert_Mask" v-show="!editingData.InsertTitle"></div>
      </div>
    </div>
    <div class="error-message" v-if="errorMessage">{{ errorVal }}</div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="closeFrame">取 消</el-button>
      <el-button
        type="primary"
        :disabled="isdisabledFn"
        @click="preCreateQuestion"
        >确 定</el-button
      >
    </div>
  </el-dialog>
</template>

<script>
  import {mapGetters,mapState,mapMutations } from 'vuex'
  import tabPaneBox from '../Subassembly/objective'
  import bus from './../../../utils/eventBus.js'
  export default {
    components: {
      tabPaneBox,
    },
    data() {
      return {
        titleContent:'',
        openedFrame: false,
        existNumber: null,
        preEditData:{
          number: 1,
          topicName: '选择题',
          rows: 5,
          startQuestion: 1,
          InsertTitle: false,
          Postpone: false,
          group:{
            singleChoice:[{
              start: 1,
              end: null,
              score: null,
              select: 4,
              id: 'singleBox0',
              childGroup: [],
            },],
            checkChoice:[
              {
                start: 1,
                end: null,
                score: null,
                lessScore: null,
                select: 4,
                id: 'checkbox0',
                childGroup: [],
              },
            ],
            judgmentChoice:[
              {
                start: 1,
                end: null,
                score: null,
                select: 2,
                id: 'judgment0',
                childGroup: [],
              },
            ],
          }
        },
        editingData:{},
        InitialData:{},
        editQuestionId: '',
        orders:0,
        errorVal: '',
        ContentHeight: 0, // 内容高度
        //标题附加高度
        heightTitle:24,
        marginHeight:0,
        rowHeight:20,
        titleH:24,
        asColumn: false
      }
    },
    computed: {

      ...mapState('questionType',[
        'subTopic_number',
      'subTopic_number_already',
      'subTopic_number_determine',]),

      ...mapState('page',['pageLayout','pageData']),
      ...mapGetters('page',['page_width','questionNumber_big_exist','questionOrder']),
      ...mapGetters('question',['options']),
      // ...mapGetters('questionType',['subTopic_number']),

      questionNumber_big(){
        return this.questionNumber_big_exist.length
      },

      title(){
        return  !this.editQuestionId ? '新增客观题' : '编辑客观题'
      },

      questionGroup(){
        const {singleChoice,checkChoice,judgmentChoice} = this.editingData.group
        return [
          ...singleChoice.map(group => group.childGroup).flat(),
          ...checkChoice.map(group => group.childGroup).flat(),
          ...judgmentChoice.map(group => group.childGroup).flat(),
        ].map(item => {return {...item,number:this.editingData.number}})
      },

      isdisabledFn(){
        return this.questionGroup.length > 0 && !this.errorMessage ? false :true
      },

      errorMessage() {
        return this.errorVal != '' ? true : false
      },


      rowGroup(){
        // 每行所占小题
        let result = []
        let {rows} = this.editingData
        for (var i = 0; i < this.questionGroup.length; i += rows) {
          result.push(this.questionGroup.slice(i, i + rows))
        }
        return result
      },

      scoreTotal(){
        return this.questionGroup.map(topic => topic.score).reduce((acc,cur) => acc + cur)
      },

    },

    watch: {
      preEditData: {
        immediate: true,
        handler() {
          //变量更改
          let Increase = {}
          if(!this.editQuestionId){
            Increase = {
              number: this.questionNumber_big,
            }
            this.existNumber =
            this.questionNumber_big_exist.length
              ? this.questionNumber_big_exist[0].value
              : null
          }
          this.editingData = {
            ...this.preEditData,
            ...Increase
          }
        }
      },

      questionGroup:{
        immediate: true,
        handler(){
          this.subTopic_already_reset()
          if(this.questionGroup.length > 0){
            this.subTopic_already_add(this.questionGroup)
          }else{
            this.subTopic_already_add(this.subTopic_number_determine)
          }
          this.subTopic_number_calculate()
        }
      }
    },

    mounted() {
      this.InitialData = JSON.parse(JSON.stringify(this.preEditData))
      bus.$on('objectiveColumn', (status)=>{
        // console.log(status);
        this.asColumn = status
        // self.$nextTick(()=>{
        //   self.preCreateQuestion()
        // })

      })
    },

    methods: {
      ...mapMutations('questionType', [
        'subTopic_number_calculate',
        'subTopic_already_add', // 小题数组
        'subTopic_already_del', // 删除题组-小题
        'subTopic_calculate_determine', // 储存确定题型
        'subTopic_determine',
        'subTopic_already_reset', // 清空
        'subTopic_determine_pid_clean',
      ]),

      ...mapMutations('pageContent', [
        'Add_bulletArray',
        'clear_bulletArray'
      ]),

      ...mapMutations('page', [
        'pageData_add',
        'pageData_edit',
        'pageData_insert',
      ]),

      opened() {
        this.preEditData = JSON.parse(
          JSON.stringify({
          ...this.preEditData,
          number: this.questionNumber_big,
          group:{
              singleChoice:this.preEditData.group.singleChoice
                .map(topic => !topic.end ? {...topic,start:this.subTopic_number}:topic),
              checkChoice:this.preEditData.group.checkChoice
                .map(topic => !topic.end ? {...topic,start:this.subTopic_number}:topic),
              judgmentChoice:this.preEditData.group.judgmentChoice
                .map(topic => !topic.end ? {...topic,start:this.subTopic_number}:topic)
            }
          })
        )

        this.openedFrame = true
        this.clear_bulletArray()
        this.subTopic_already_reset() // 清空
        this.subTopic_already_add(this.subTopic_number_determine)
        this.subTopic_number_calculate()
      },

      openedEdit(id){
        let current = this.pageData.filter((item) => item.id === id)
        this.preEditData = JSON.parse(JSON.stringify(current[0].content))
        this.editQuestionId = id
        this.orders = current.order
        this.openedFrame = true
        this.clear_bulletArray()
        this.subTopic_number_calculate()
      },

      closeFrame() {
        // 取消弹框
        this.errorVal = ''
        this.preEditData = this.InitialData
        this.openedFrame = false
        this.subTopic_number_calculate()
      },

      change(id, num){
        console.log(id);
        console.log(num);
        // 改变row数量
        let current = this.pageData.filter((item) => item.id === id)
        this.preEditData = JSON.parse(JSON.stringify(current[0].content))
        this.editQuestionId = id
        let rows = this.preEditData.rows
        if (num == 1) {
          // 1减法 2加法
          if (rows > 1) {
            rows -= 1
          } else {
            rows = 1
          }
        } else {
          if (rows < 10) {
            rows += 1
          } else {
            rows = 10
          }
        }
        this.preEditData.rows = rows
        this.editingData.rows = rows
        this.titleContent = current[0].titleContent?current[0].titleContent:''
        this.$nextTick(()=>{
          this.preCreateQuestion()
        })
      },
      changeColumn(status){
        console.log(status);
      },
      changeQuestionBig(num){
        console.log(num);
        this.preEditData = {
          ...this.preEditData,
          number:num
        }
      },

      changeSelectexistBig(e){
        this.existNumber = e
      },

      preCreateQuestion(){
        // 清空缓存
        window.localStorage.clear()
        // 保存题型
        // console.log(this.asColumn);
        const { rows,InsertTitle,Postpone, group} = this.editingData
        // console.log(group);
        // console.log([...group.checkChoice[0].childGroup, ...group.singleChoice[0].childGroup]);
        // let objectSelect = Math.max(...[...group.checkChoice[0].childGroup, ...group.singleChoice[0].childGroup].map(item=> item.select))
        // console.log(objectSelect);
        // console.log(rows);
        let questionId = `objective_${+new Date()}`

        var questionObj = {
            heightTitle: this.heightTitle,
            marginHeight: this.marginHeight,
            rowHeight: this.rowHeight * rows + 10,
            id: questionId,
            // heightGroup:{
            //   rowGroup:this.rowGroup,
            //   titleH:this.heightTitle
            // },
            rowGroup:this.rowGroup,
            // titleH:this.heightTitle,
            itemGroup: this.questionGroup,
            height:0,
            questionType: 'ObjectiveQuestion',
            content: {
              ...this.editingData,
              scoreTotal:this.scoreTotal,
              pageLayout:this.pageLayout
            },
            order: this.questionOrder,
            showData:[],
            first: true,
            // titleContent:this.titleContent?this.titleContent:'',
            titleContent:'',
            asColumn:this.asColumn
          }
        if (this.editQuestionId == '') {
          if (InsertTitle && this.questionNumber_big_exist.length ){
              let select = this.questionNumber_big_exist[this.existNumber]
              let data = {
                obj: {
                  ...questionObj,
                },
                bigId: select.id,
                SelfOrder: Postpone || false,
              }
            this.pageData_insert(data)
          }else{
            this.pageData_add(questionObj)
          }
        }else{
          this.subTopic_determine_pid_clean(this.questionGroup[0].pid)
          questionObj.id = this.editQuestionId
          this.pageData_edit({...questionObj,order:this.orders,titleContent:this.titleContent?this.titleContent:''})
        }
        // 小题数组追加数据
        this.subTopic_determine({number:this.editingData.number})
        this.subTopic_calculate_determine(this.questionGroup)
        this.subTopic_already_add(this.questionGroup)
        // guan bi - 清楚数据
        this.preEditData = JSON.parse(JSON.stringify(this.InitialData))

        //------------------------------------
        this.openedFrame = false // 关闭弹窗
      },

      groupVerifyStatus(verify){
        this.errorVal = verify.str
      },

      updateGroupSubTopic(groupObj){
        // 编辑题组
        let obj = this.editingData
        let {type,data} = groupObj
        let {group} = obj

        let curGroup = group[type]
        let index = curGroup.findIndex(group => group.id == data.id)


        if(index > -1){
          curGroup.splice(index,1,data)
        }
      },

      preEditSubtopic(subtopic){
        //编辑小题号
        let obj = this.editingData
        let {type,data} = subtopic

        let curGroup = obj.group[type]
        let index = curGroup.findIndex(group => group.id == data.pid)

        if(index > -1){
          let childrenGroup = curGroup[index].childGroup
          let cIndex = childrenGroup.findIndex(topic => topic.id == data.id)

          if(cIndex > -1){
            childrenGroup.splice(cIndex,1,data)
          }
        }
      },

      addGroupQuestion(groupSubTopic){
        //添加分段小题组
        let {type,groupTopic} = groupSubTopic
        let obj = JSON.parse(JSON.stringify(this.preEditData))

        obj.group[type].push(groupTopic)

        this.$nextTick(()=>{
          this.preEditData = JSON.parse(JSON.stringify(obj))
        })
      },

      delSubtopicGroup(groupSubTopic){
        // 删除题组
        let {type,subtopic} = groupSubTopic
        let obj = JSON.parse(JSON.stringify(this.preEditData))
        let curGroup = obj.group[type]

        let index = curGroup.findIndex(group => group.id == subtopic.id)

        if(index > -1){
          curGroup.splice(index,1)
          this.$nextTick(()=>{

            this.Add_bulletArray(groupSubTopic.subtopic.childGroup)
            this.preEditData = JSON.parse(JSON.stringify(obj))
          })
          this.errorVal = ''
        }

      }
    },
  }
</script>

