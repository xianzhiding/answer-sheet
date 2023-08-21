<template>
  <el-tabs v-bind="$attrs" v-on="$listeners">
    <el-tab-pane
      v-for="(item,index) in tabPane"
      :key="index"
      :label="item.label"
      :name="item.name"
    >
      <slot></slot>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
  export default {
    props: {
      tabPane: {
        type: Array,
        default: () => []
      },
    },
  }
</script>

<style lang="less">
@import '~@/assets/css/variables.less';
.el-tabs__item{
  &:hover{
    color:@mainFont
  }
  &.is-active{
    color:@mainFont
  }
}
.el-tabs__active-bar{
  background-color: transparent !important
}
.el-tabs__nav-scroll {
    background: @chart;
}
.el-tabs__item{
  // padding: 0 0;
  // margin: 0 5px 0 15px;
}
.el-tabs__header{
  margin:  0 0
}
.el-tabs__nav-wrap{
  &::after{
    height: 0;
  }
}
</style>