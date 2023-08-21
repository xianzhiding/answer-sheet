<template>
  <div class="big-item">
    <span>从</span>
    <!-- <el-input v-model.number="data.start" size="mini" @blur="groupTopicHanlde"  oninput="value=value.replace(/[^\d]/g,'')" /> -->
    <!-- <el-input v-model.number="data.start" size="mini" @input="handelGetStartValue" oninput="value=value.replace(/[^\d]/g,'')" /> -->
    <el-input v-model.number="data.start" size="mini" @input="groupTopicHanlde" oninput="value=value.replace(/[^\d]/g,'')" />
    <span class="p-5"> 题到 </span>
    <el-input v-model.number="data.end" size="mini" @input="groupTopicHanlde" oninput="value=value.replace(/[^\d]/g,'')" />
    <span class="p-5"> 题 </span>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
export default {
  props: {
    formData: {
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
      let {start,end} = this.data

      let determine = this.subTopic_number_determine

      let strStart = ''
      let strEnd = ''
      /* if (determine.length > 0){
        let d_s_index = determine.findIndex(item => item.topic == start)
        let d_e_index = determine.findIndex(item => item.topic == end)

        if(!this.editId){
          if(d_s_index > -1){
            strStart = `${start}题已经存在，请勿重复添加`
          }else{ strStart = '' }
          if(d_e_index > -1){
            strEnd = `${end}题已经存在，请勿重复添加`
          }else{ strEnd = '' }
        }else{
          if(d_s_index > -1){
            if(determine[d_s_index].pid != this.data.id){
              strStart = `${start}题已经存在，请勿重复添加`
            }else { strStart = '' }
          }else{ strStart = '' }

          if(d_e_index > -1){
            if(determine[d_e_index].pid != this.data.id){
              strEnd = `${end}题已经存在，请勿重复添加`
            }else { strEnd = '' }
          }else{ strEnd = '' }
        }
      } */
      return start == 0 ? '开始题号必须大于0' :
        end == 0 ? '开始题号必须大于0' :
          start == 0 && end != null ? '开始题号不能大于结束题号' :
            start > end && end != null ? '开始题号不能大于结束题号' :
              strStart != '' ? strStart :
                strEnd != '' ? strStart : ''
    },
    tabStatus () {
      return this.verify && this.data.end  ? true : false
    },

    subTopicList(){
      const {start,end,id} = this.data
      let topicList = []
        for (let i = start; i <= end; i++) {
          let obj = {
            ...this.data,
            pid: id,
            id: `answer_${+new Date()}_${i}`,
            topic: i,
            childGroup: [],
            score: 1,
            scoreNo: i
          }
          topicList.push(obj)
        }
      return topicList
    },
  },
  watch: {
    formData: {
      immediate: true,
      handler () {
        this.data = {
          ...this.formData
        }
        if (this.data.end == '' || this.data.end == null) {
          this.data.start = this.subTopic_number
        }
      }
    }
  },
  methods: {
    ...mapMutations('questionType', [
      'subTopic_already_add', // 删除题组-小题
      'subTopic_number_calculate',
    ]),
    // handelGetStartValue(e){
    //   this.data.start = parseInt(e)
    //   this.$emit('hanlde-status', this.verify)
    //   this.$forceUpdate()
    //   this.groupTopicHanlde()
    // },
    groupTopicHanlde () {
      this.$emit('hanlde-status', this.verify)
      if (!this.tabStatus) {
        //追加近临时题组
        this.subTopic_already_add(this.subTopicList, this.data.start)
        // 抛向父级追加近数组
        this.$emit('add-answer-topic-group', { ...this.data, childGroup: this.subTopicList })
        this.subTopic_number_calculate(this.data.start)
      }
    }
  },
}
</script>

<style lang="less">
  @import '~@/assets/css/variables.less';
  .space_group_item{
    &.el-input.el-input--mini{
      width: 48px;
    }
  }
  span.add_groupTopic{
    margin-left: 20px;
    color: @main
  }
  i.el-icon-del {
    margin-left: 20px;
    font-size: 18px;
    position: relative;
    top: 3px;
    color: @main;
    padding: 0 10px;
  }
</style>

