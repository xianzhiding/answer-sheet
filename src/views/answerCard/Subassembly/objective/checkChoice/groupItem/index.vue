<!--
 * @Description: 
 * @Author: dingxianzhi
 * @Email: dingxz@moofen.cn
 * @Date: 2022-01-21 15:03:27
 * @LastEditTime: 2022-02-17 10:31:31
-->
<template>
  <el-row >
    <el-col :span="8">
      <div style="display: flex">
        <span class="question_tabtitle" style="white-space: nowrap;">第{{data.topic}}题</span><span style="margin-left: 10px;">题号</span>
        <el-input style="width: 50px; margin-left: 5px;" v-model="data.scoreNo" size="mini" @blur="preEditSubtopic" />
      </div>
    </el-col>
    <el-col :span="16" class="group_item_right">
      <div>
        <!-- <el-input v-model="data.score" size="mini" @blur="preEditSubtopic" onkeyup="this.value = this.value.replace(/(\.\d{1,1})(?:.*)|[^\d.]/g, ($0, $1) => {return $1 || '';})"/> -->
        <el-input v-model="data.score" size="mini" onkeyup="this.value = this.value.replace(/(\.\d{1,1})(?:.*)|[^\d.]/g, ($0, $1) => {return $1 || '';})"/>
        <span>分,少选得</span>
        <el-input v-model="data.lessScore" size="mini" @blur="preEditSubtopic" :max="data.score" onkeyup="this.value = this.value.replace(/(\.\d{1,1})(?:.*)|[^\d.]/g, ($0, $1) => {return $1 || '';})" />
        <span>分</span>
        <el-input v-model.number="data.select" size="mini" @blur="preEditSubtopic" oninput="value=value.replace(/[^\d]/g,'')" />
        <span>个选项</span>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import {LETTER_LIST} from '@/models/base'

export default {
  props: {
    subtopic: {
      type: Object,
      default: () => { },
    },
  },

  data () {
    return {
      data: {},
      letterList:LETTER_LIST
    }
  },

  computed: {

    selectBox(){
      return this.activeName == 'judgmentChoice' ? ['T','F'] :
              this.letterList.slice(0,this.data.select)
    },

    selectWdith(){
      return 42 + this.data.select * 26
    },
  },

  watch: {
    subtopic: {
      immediate: true,
      handler () {
        let {topic, scoreNo, score,lessScore,select} = this.subtopic
        this.data = {
          ...this.subtopic,
          scoreNo: scoreNo ? scoreNo : topic,
          score: score == 0 ? '' : score,
          lessScore:lessScore == 0 ? null: lessScore,
          select: typeof(select)=='string' ? 4 : select <= 0 ? 1: select,
        }
      }
    }
  },

  methods: {
    preEditSubtopic () {
      const {topic, scoreNo, score,select,lessScore} = this.data
      let scoreNoVal = scoreNo ? scoreNo.toString() : scoreNo
      let scoreVal = score ? score.toString().match(/^\d+(?:\.\d{0,1})?/) : score
      let lessScoreVal = lessScore ? lessScore.toString().match(/^\d+(?:\.\d{0,1})?/) : lessScore

      if(scoreVal !='' && select !=''){

        this.$emit('pre-edit-subtopic', {
          type:'checkChoice',
          data:{
            ...this.data,
            select: typeof(select)=='string' ? 4 : select <= 0 ? 1: select,
            scoreNo:scoreNoVal,
            score:Number(scoreVal),
            lessScore:Number(lessScoreVal),
            selectBox:this.selectBox,
            width:this.selectWdith,
          }
        })
      }
    },
  },
}
</script>

<style lang="less" scoped>
.group_item {
  .el-row {
    border-bottom: 1px solid #888;
  }
}
</style>
