<template>
  <div class="big-item">
    <span>从</span>
    <!-- <el-input v-model.number="data.start" size="mini" @blur="preQuestiongroup" oninput="value=value.replace(/[^\d]/g,'')" /> -->
    <el-input v-model.number="data.start" size="mini" oninput="value=value.replace(/[^\d]/g,'')" />
    <span>题到</span>
    <el-input v-model.number="data.end" size="mini" @blur="preQuestiongroup" oninput="value=value.replace(/[^\d]/g,'')" />
    <span>题,每题</span>
    <el-input v-model="data.score" size="mini" @blur="preQuestiongroup" onkeyup="this.value = this.value.replace(/(\.\d{1,1})(?:.*)|[^\d.]/g, ($0, $1) => {return $1 || '';})" />
    <span>分,少选</span>
    <el-input v-model="data.lessScore" size="mini" @blur="preQuestiongroup" onkeyup="this.value = this.value.replace(/(\.\d{1,1})(?:.*)|[^\d.]/g, ($0, $1) => {return $1 || '';})"/>
    <span>得分,每题</span>
    <el-input v-model.number="data.select" size="mini" @blur="preQuestiongroup"  oninput="value=value.replace(/[^\d]/g,'')"/>
    <span>个选项</span>
    <i class="el-icon-delete" @click="delSubtopicGroup" ></i>
  </div>
</template>

<script>
  import { mapMutations, mapState } from 'vuex'
  import {LETTER_LIST} from '@/models/base'

  export default {
    props: {
      group: {
        type: Object,
        default: () => { }
      },
      activeName:{
        type:String,
        default:''
      },
      editId:{
        type: String,
        default: '',
      }
    },

    data() {
      return {
        data: {},
        letterList:LETTER_LIST
      }
    },

    computed: {
      ...mapState('questionType', [
        'subTopic_number',
        'subTopic_number_already',
        'subTopic_number_determine',
      ]),

      selectBox(){
        return this.activeName == 'judgmentChoice' ? ['T','F'] :
                this.letterList.slice(0,this.data.select)
      },

      selectWdith(){
        return 42 + this.data.select * 26
      },

      verify(){
        const {start,end,score} = this.data
        let scoreVal = score ? parseFloat(score) : score
        let already = this.subTopic_number_already
        let determine = this.subTopic_number_determine
        let strStart = ''
        let strEnd = ''

          /* if(determine.length){
            let start_d_val = determine.find(item => item.topic == start)
            let end_d_val = determine.find(item => item.topic == end)
            if(start_d_val != undefined && start_d_val.pid != this.data.id){
                strStart = `${start_d_val.topic}题已经存在，请勿重复添加`
            }
            if(end_d_val != undefined && end_d_val.pid != this.data.id){
              strEnd = `${end_d_val.topic}题已经存在，请勿重复添加`
            }
            if(this.bulletArray.length){
              let start_b_val = this.bulletArray.find(item => item.topic == start)
              let end_b_val = this.bulletArray.find(item => item.topic == end)
                  if(start_b_val != undefined){
                      strStart = ''
                  }
                  if(end_b_val != undefined){
                    strEnd = ''
                  }
            }
          }

          if(already.length){
            let start_a_val = already.find(item => item.topic == start)
            let end_a_val = already.find(item => item.topic == end)
            if(start_a_val != undefined && start_a_val.pid != this.data.id){
              strStart = `${start_a_val.topic}题已经存在，请勿重复添加`
            }
            if(end_a_val != undefined && end_a_val.pid != this.data.id){
              strEnd = `${end_a_val.topic}题已经存在，请勿重复添加`
            }
          } */

        return strStart != '' ? strStart :
                strEnd != '' ? strEnd :
                  start == 0 ? '开始题号必须大于0':
                    start > end ? '开始题号不能大于结束题号':
                      end == 0 ? '结束题号必须大于0' :
                        scoreVal == null ? '分数不能为空' : ''
      },

      verifyStatus(){
        return this.verify && this.data.end  ? true : false
      },

      subTopicList(){
        const {start,end,score,lessScore,select} = this.data
        let scoreVal = score ? score.toString().match(/^\d+(?:\.\d{0,1})?/) : score
        let lessScoreVal = lessScore ? lessScore.toString().match(/^\d+(?:\.\d{0,1})?/) : lessScore

        let group = []
        for (let index = start; index <= end; index++) {
          let subtopic = {
            select:select,
            end:end,
            start:start,
            score:Number(scoreVal),
            lessScore:Number(lessScoreVal),
            pid: this.data.id,
            id: 'check_' + index,
            topic: index,
            scoreNo: index,
            selectBox:this.selectBox,
            width:this.selectWdith,
          }
          group.push(subtopic)
        }
        return group
      }
    },

    watch: {
      group: {
        immediate: true,
        handler () {
          let {score,lessScore} = this.group
          this.data = {
            ...this.group,
            score: score == 0 ? null:score,
            lessScore: lessScore == 0 ? null:lessScore,
          }
        },
        deep:true
      }
    },

    methods: {
      ...mapMutations('questionType', [
        'subTopic_already_add',
        'already_pid_clean',
        'subTopic_number_calculate',
      ]),

      change(){
        let {start,end} = this.data
        this.data = {
          ...this.data,
          start:!end ? this.subTopic_number:start,
        }
      },

      delSubtopicGroup() {
        this.$emit('del-subtopic-group',{type:this.activeName,subtopic:this.data})
      },

      preQuestiongroup(){
        const {score,select,pid,lessScore} = this.data
        let scoreVal = score ? score.toString().match(/^\d+(?:\.\d{0,1})?/) : score
        let lessScoreVal = lessScore ? lessScore.toString().match(/^\d+(?:\.\d{0,1})?/) : lessScore

        this.$emit('group-verify-status', {
          str:this.verify,
          status:this.verifyStatus
        })

        if (!this.verifyStatus && this.verify == ''){

          let itemObj = {
            type: 'checkChoice',
            data: {
              ...this.data,
              score:Number(scoreVal),
              lessScore:Number(lessScoreVal),
              select: typeof(select)=='string' ? 4 : select <= 0 ? 1: select,
              start: parseInt(this.data.start),
              childGroup: this.subTopicList
            }
          }
          this.$emit('update-group-subTopic',itemObj)
          // 先清除临时题组
          this.already_pid_clean(pid)
          // 后添加
          this.subTopic_already_add(this.subTopicList)
          this.subTopic_number_calculate()
        }
      }
    },
  }
</script>
