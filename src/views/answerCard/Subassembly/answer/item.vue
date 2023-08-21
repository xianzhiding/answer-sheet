<!--
 * @Description: 
 * @Author: dingxianzhi
 * @Email: dingxz@moofen.cn
 * @Date: 2022-01-21 15:03:27
 * @LastEditTime: 2022-07-15 14:06:20
-->
<template>
<!-- 分值item -->
  <div class="points_list">
    <span class="points-em">{{pointsData.scoreNo}}</span>
    <el-input
      v-model="pointsData.score"
      @blur="preEditScore"
      size="mini" class="points_list_input"
      onkeyup="this.value = this.value.replace(/(\.\d{1,1})(?:.*)|[^\d.]/g, ($0, $1) => {return $1 || '';})"
    />
    <span > 分  </span>
    <i class="el-icon-del list-del" @click="delLastSubtopic">-</i>
  </div>
</template>

<script>
export default {
  props: {
    pointsItemData: {
      type: Object,
      default: () => { }
    },
  },

  data () {
    return {
      pointsData: {},
      isDel:false, // 是否删除
    }
  },

  watch: {
    pointsItemData: {
      immediate: true,
      handler () {
        this.pointsData = {
          ...this.pointsItemData
        }
      }
    }
  },

  methods: {
    delLastSubtopic () {
      this.isDel = true
      this.preEditScore()
    },

    preEditScore(){
      let {score} = this.pointsData
      let scoreVal = score ? score.toString().match(/^\d+(?:\.\d{0,1})?/) : score
      this.$emit('pre-edit-last-subtopic',{
        del:this.isDel,
        obj:{
          ...this.pointsData,
          score:Number(scoreVal)
        }
      })
    }
  },
}
</script>

<style lang="less" >
  .points_list {
    width: 100%;
    .points-em{
      position: relative;
      left: 3em;
    }
    .el-input--mini {
      width: 48px;
      margin: 0 10px;
    }
    .points_list_input {
      margin-left: 64%;
    }
  }
  .el-icon-del.list-del {
    margin-top: 0px;
    right: 80px !important;
    height: 30px;
    line-height: 30px;
    cursor: pointer;
    position: unset;
  }
  .el-collapse {
    border-bottom: none;
  }
</style>