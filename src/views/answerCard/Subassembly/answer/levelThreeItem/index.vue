<template>
<div class="answer-last-group">
  <div class="space_group_list">
      <span class="space_group_title">{{lastData.scoreNo}}</span>
      <el-input v-model="lastData.score"
        :disabled="isDisable" size="mini" class="space_group_items"
        @blur="preEditThreSubtopic"
        onkeyup.stop.native="this.value = this.value.replace(/(\.\d{1,1})(?:.*)|[^\d.]/g, ($0, $1) => {return $1 || '';})"
      />
      <span> 分</span>
      <span class="add_groupTopic" @click="pointsAnswerGroup">+ 添加小题</span>
      <i class="el-icon-del " @click="delLastItem">-</i>
  </div>
  <div class="points-item">
    <points-item
      v-for="(item,i) in pointsData"
      :key="i"
      :points-item-data="item"
      @pre-edit-last-subtopic="preEditLastSubtopic"
    />
  </div>
</div>
</template>

<script>
import pointsItem from '../item'
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
    lastItemData: {
      type: Object,
      default: () => { }
    },
  },
  components: {
    pointsItem,
  },
  data () {
    return {
      lastData: {}
    }
  },
  computed: {
    pointsData () {
      return this.lastData.childGroup
    },

    isDisable(){
      let {childGroup} = this.lastItemData
      return childGroup && childGroup.length ? true : false
    }
  },
  watch: {
    lastItemData: {
      immediate: true,
      handler () {
        this.lastData = {
          ...this.lastItemData,
          score:reducer(this.lastItemData,0)
        }
      }
    }
  },
  methods: {
    pointsAnswerGroup () {
      let temporaryArr = JSON.parse(JSON.stringify(this.lastData.childGroup))
      let {sid,fid,pid,id,topic,scoreNo} = this.lastData
      let long = temporaryArr.length + 1

      let subObj = {
        ...this.lastData,
        spId: sid,
        sid: fid,
        fid: pid,
        pid: id,
        id: `answerPoints_${+new Date()}_${topic}_${long}`,
        topic: `${topic}.${long}`,
        scoreNo: `${scoreNo}.${long}`,
        score: 1
      }
      temporaryArr.push({ ...subObj, childGroup: [] })

      this.$emit('pre-edit-points-answer-group', { ...this.lastData, childGroup: temporaryArr })
    },
    delLastItem () {
      this.$emit('pre-edit-points-answer-group', this.lastData, true)
    },

    preEditThreSubtopic(){
      let {score} = this.lastData
      let scoreVal = score ? score.toString().match(/^\d+(?:\.\d{0,1})?/) : score
      this.$emit('pre-edit-points-answer-group', {
          ...this.lastData,
          score:Number(scoreVal)
        })
    },

    preEditLastSubtopic(subtopic){
      this.$emit('pre-edit-last-subtopic',subtopic)
    }
  },
}
</script>

<style lang="less" >
.el-collapse {
  border-bottom: none !important;
}
.space_group_title {
  position: relative;
  width: 100px;
  display: inline-block;
  text-indent: 1em;
}
</style>
<style lang="less" scoped>
.space_group_items {
  margin-left: 36%;
}
.answer-last-group{
  width:100%;
}
.space_group_title{
  position: relative;
  left: 1em;
}
.space_group_item{
  &.el-input.el-input--mini{
    width: 48px;
  }
}
</style>