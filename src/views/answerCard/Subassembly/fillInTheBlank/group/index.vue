<template>
  <div class="big-item">
    <span>从</span>
    <!-- <el-input v-model.number="data.start" size="mini" @blur="preEditQuestionGroup" oninput="value=value.replace(/[^\d]/g,'')"/> -->
    <el-input v-model.number="data.start" size="mini" oninput="value=value.replace(/[^\d]/g,'')"/>
    <span>题到</span>
    <el-input v-model.number="data.end" size="mini" @blur="preEditQuestionGroup" oninput="value=value.replace(/[^\d]/g,'')"/>
    <span>题,每空</span>
    <el-input v-model="data.score" size="mini" @blur="preEditQuestionGroup"  onkeyup="this.value = this.value.replace(/(\.\d{1,1})(?:.*)|[^\d.]/g, ($0, $1) => {return $1 || '';})" />
    <span>分,每题</span>
    <el-input v-model.number="data.space" size="mini" @blur="preEditQuestionGroup" oninput="value=value.replace(/[^\d]/g,'')"/>
    <span>空</span>
    <i class="el-icon-delete" @click="delQuestionGroup" ></i>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
export default {
  props: {
    subTopic: {
      type: Object,
      default: () => { }
    },
    editId:{
      type: String,
      default: ''
    },
  },

  data () {
    return {
      data: {}
    }
  },

  computed: {
    ...mapState('questionType', [
      'subTopic_number',
      'subTopic_number_already',
      'subTopic_number_determine', // 确定小题数值
    ]),

    verify () {
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
                  // start > end ? '开始题号不能大于结束题号':
                    end == 0 ? '结束题号必须大于0' :
                      scoreVal == null ? '分数不能为空' : ''
    },

    tabStatus () {
      return this.verify && this.data.end  ? true : false
    },

    subTopicList(){
      const {scoreNo, score,end,space,start,id} = this.data
      let scoreVal = score ? score.toString().match(/^\d+(?:\.\d{0,1})?/) : score
      let group = []
      for (let index = start; index <= end; index++) {

        let subtopic = {
          ...this.data,
          score: Number(scoreVal),
          pid: id,
          id: `subTopic_${+new Date()}_${index}`,
          topic: index,
          scoreNo: scoreNo ? scoreNo : index,
          sum: score * space,
          level:false,
        }
        group.push(subtopic)
      }
      return group
    },

    subTopicSpace(){
      return this.subTopicList.map((topic) => {
        const {scoreNo, end,start,id,sum,space,score,level,pid} = topic
        let Arr = []
        for(let a= 1; a < topic.space + 1;a++){
          Arr.push(a)
        }

        return {
          end:end,
          start:start,
          id:id,
          pid:pid,
          level:level,
          score:score,
          space:space,
          sum:sum,
          topic:topic.topic,
          scoreNo:scoreNo,
          Multistage:false,
          childGroup:Arr.map((i) => {
            return {
                Multistage:false,
                id:`sid_${+new Date()}_${i}`,
                pid:topic.id,
                sid:topic.pid,
                isTopic:true,
                spaceNum:i,
                scoreNo:scoreNo,
                smallTopic:topic.topic,
                topic:topic.topic,
                score:topic.score,
            }
          })
        }
      })
    },
  },

  watch: {
    subTopic: {
      immediate: true,
      handler () {
        let {start,end} = this.subTopic
        this.data = {
          ...this.subTopic,
          start:!end ? this.subTopic_number : start
        }
      }
    }
  },

  methods: {
    ...mapMutations('questionType', [
      'subTopic_number_calculate',
      'subTopic_already_add',
    ]),

    preEditQuestionGroup () {

      this.$emit('change-status', this.verify)
      const {start, score} = this.data
      let startVal = start ? start.toString().match(/^\d+(?:\.\d{0,1})?/) : start
      let scoreVal = score ? score.toString().match(/^\d+(?:\.\d{0,1})?/) : score
      // return;
      if (!this.tabStatus) {
        let obj = {
          ...this.data,
          childGroup: this.subTopicSpace,
          start:Number(startVal),
          score:Number(scoreVal)
        }
        this.$emit('pre-edit-question-group',obj)
        // 弹框临时小题数
        const temporaryArr = this.subTopicList.map(item => ({ ...item, subtopic: 1 }))
        this.subTopic_already_add(temporaryArr)
        // temporaryArr
        this.subTopic_number_calculate()
      }
    },

    delQuestionGroup () {
      // 题组删除
      this.$emit('del-question-group', this.data.id)
    },

  },
}
</script>

<style lang="less">
  .el-input--mini .el-input__inner{
    padding: 0 0;
    text-align: center;
  }
</style>