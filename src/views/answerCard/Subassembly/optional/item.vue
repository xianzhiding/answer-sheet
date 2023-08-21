<template>
  <div class="optional_list">
    <span class="item-left">{{optionalData.topic}}</span>
    <span class="item-right">{{optionalData.score}}分</span>
  </div>
</template>

<script>
export default {
  props: {
    optionalData: {
      type: Object,
      default: () => { }
    },
  },
}
</script>

<style lang="less" scoped>
.optional_list {
  span {
    display: inline-block;
    width: 50%;
    text-align: left;
    font-size: 14px;
    height: 39px;
    line-height: 39px;
    border-bottom: 1px solid #888;
    &.item-left {
      text-align: left;
      text-indent: 1em;
    }
    &.item-right {
      text-align: right;
      width: calc(50% - 1em);
      padding-right: 1em;
    }
  }
}
</style>