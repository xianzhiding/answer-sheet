<template>
  <div class="last-topic_boxs">
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
        default: ()=>{}
      },
      isTopic:{
        type:Boolean,
        default:true
      }
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
            ...this.subtopic,
            isTopic:this.isTopic
          }
        }
      }
    },

    methods: {
      preEditLastScore() {
        let {score} = this.data
        let scoreVal = score ? score.toString().match(/^\d+(?:\.\d{0,1})?/) : score
        this.$emit('pre-edit-two-last-score',{
          ...this.data,
          score:Number(scoreVal)
        })
      }
    },
  }
</script>

<style lang="less">
  .last-topic_boxs{
    margin-left: 40px;
    span,
    .el-input--mini{
      margin-left: 10px;
    }

    display: none;

    &.down{
      display:block
    }
  }
</style>