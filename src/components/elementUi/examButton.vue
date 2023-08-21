<template>
  <div class="exam_box">
    <el-button  v-bind="$attrs" v-on="$listeners">
      <slot></slot>
    </el-button>
  </div>
</template>

<script>
  export default {

  }
</script>

<style lang="less">
  @import '~@/assets/css/variables.less';
  .exam_box{
    .el-button--medium{
      padding: 0 0;
      margin: 0 0 !important;
      height: 28px;
      line-height: 28px;
    }
  }
</style>