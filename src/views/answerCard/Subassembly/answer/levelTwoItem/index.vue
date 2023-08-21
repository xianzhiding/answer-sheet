<template>
<div class="answer-sub-group">
  <div class="space_group_list">
      <span class="space_group_title">{{data.scoreNo}}</span>
      <el-input v-model="data.score"
        :disabled="isDisable" size="mini"
        class="space_group_items"
        @blur="preEditTwoSubtopic"
        onkeyup.stop.native="this.value = this.value.replace(/(\.\d{1,1})(?:.*)|[^\d.]/g, ($0, $1) => {return $1 || '';})"
      />
      <span> 分</span>
      <span class="add_groupTopic" @click.stop="addLastAnswerItem">+ 添加小题</span>
      <i class="el-icon-del " @click.stop="delSubItem" >-</i>
  </div>
  <div class="last-group">
    <level-three-item
      v-for="(item,i) in childGroup"
      :key="i"
      :last-item-data="item"
      @pre-edit-points-answer-group="preEditPointsAnswerGroup"
      @pre-edit-last-subtopic="preEditLastSubtopic"
    />
  </div>
</div>
</template>

<script>
import levelThreeItem from '../levelThreeItem'
function  reducer(obj, count = 0){
  if (obj.childGroup && obj.childGroup.length) {
    return obj.childGroup.reduce((acc, item) => {
        return reducer(item, acc);
    }, count);
  }
  return count + obj.score
}
export default {
  props: {
    subChildData: {
      type: Object,
      default: () => { }
    },
  },
  components: {
    levelThreeItem,
  },
  data () {
    return {
      data: {}
    }
  },
  computed: {
    childGroup () {
      return this.data.childGroup
    },

    isDisable(){
      let {childGroup} = this.data
      return childGroup && childGroup.length ? true : false
    }
  },
  watch: {
    subChildData: {
      immediate: true,
      handler () {
        this.data = {
          ...this.subChildData,
          score:reducer(this.subChildData,0)
        }
      }
    }
  },
  methods: {
    addLastAnswerItem () {
      let temporaryArr = JSON.parse(JSON.stringify(this.data.childGroup)) || []
      let {pid,fid,id,topic, scoreNo} = this.data
      let long = temporaryArr.length + 1
      let subObj = {
        ...this.data,
        fid: pid,
        sid: fid,
        pid: id,
        id: `answerLast_${+new Date()}_${topic}_${long}`,
        topic: `${topic}.${long}`,
        scoreNo: `${scoreNo}.${long}`,
        score: 1
      }
      temporaryArr.push({ ...subObj, childGroup: [] })

      this.$emit('pre-edit-two-subtopic', { ...this.data, childGroup: temporaryArr })

    },

    preEditTwoSubtopic(){
      let {score} = this.data
      let scoreVal = score ? score.toString().match(/^\d+(?:\.\d{0,1})?/) : score
      this.$emit('pre-edit-two-subtopic', {
        ...this.data,
          score:Number(scoreVal)
        })
    },

    delSubItem () {
      this.$emit('pre-edit-two-subtopic', this.data, true)
    },

    preEditPointsAnswerGroup (obj, isDel = false) {
      // 三级小题下的小题
      this.$emit('pre-edit-points-answer-group', obj, isDel)
    },

    preEditLastSubtopic(subtopic){
      //最后一级
      this.$emit('pre-edit-last-subtopic',subtopic)
    }
  },
}
</script>

<style lang="less">
  .space_group_items {
    margin-left: 36%;
  }
  .space_group_list {
    width: 100%;
  }
  .el-collapse {
    border-bottom: none;
  }
  .last-group{
    .answer-last-group{
      background-color:#f2f2f3;
    }
  }
  .answer-sub-group{
    .points-item{
      background-color: #fcfcfc;
    }
  }
  .space_group_item{
    &.el-input.el-input--mini{
      width: 48px;
    }
  }
</style>

