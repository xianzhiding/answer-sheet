
<template>
  <el-checkbox v-bind="$attrs" v-on="$listeners">{{ title }}</el-checkbox>
</template>

<script>
  export default {
    props: {
      title: {
          default () {
              return '备选项'
          },
          type: String
      }
    },
  }
</script>

<style lang="less">
@import '~@/assets/css/variables.less';
  .hj-checkbox .el-checkbox__inner{
      border: solid 1px @font-909;
  }
  .hj-checkbox .is-checked .el-checkbox__inner{
      background-color: @main;
      border-color: @mainFont;
  }
  .hj-checkbox .el-checkbox__label {
      padding-left: 3px;
  }
  .hj-checkbox .is-checked+.el-checkbox__label{
      color: @font-333;
  }
  .el-checkbox__input.is-focus .el-checkbox__inner{
    border-color: @main !important
  }
</style>