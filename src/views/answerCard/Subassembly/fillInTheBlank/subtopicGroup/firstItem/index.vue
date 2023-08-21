<!--
 * @Description: 
 * @Author: dingxianzhi
 * @Email: dingxz@moofen.cn
 * @Date: 2022-01-21 15:03:27
 * @LastEditTime: 2022-02-17 11:44:56
-->
<template>
  <div class="last-topic_box">
    <span>第</span>
    <span> {{ data.spaceNum }} </span>
    <span> 空 </span>
    <el-input v-model="data.score" size="mini" @blur="preEditLastScore"
      onkeyup="this.value = this.value.replace(/(\.\d{1,1})(?:.*)|[^\d.]/g, ($0, $1) => {return $1 || '';})"
    />
    <span> 分</span>
  </div>
</template>

<script>
  export default {
    props: {
      subtopic: {
        type: Object,
        default: ()=> {}
      },
    },

    data() {
      return {
        data: {}
      }
    },

    watch: {
      subtopic: {
        immediate: true,
        handler () {
          this.data = {
            ...this.subtopic
          }
        }
      }
    },

    methods: {
      preEditLastScore() {
        let {score} = this.data
        let scoreVal = score ? score.toString().match(/^\d+(?:\.\d{0,1})?/) : score
        this.$emit('pre-edit-last-score',{
          ...this.data,
          score:Number(scoreVal)
        })
      }
    },
  }
</script>

<style lang="less">
  .last-topic_box{
    margin-left: 40px;
    span,
    .el-input--mini{
      margin-left: 10px;
    }

  }
</style>