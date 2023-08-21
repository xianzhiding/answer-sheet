<!--
 * @Description: 
 * @Author: dingxianzhi
 * @Email: dingxz@moofen.cn
 * @Date: 2022-01-21 15:03:23
 * @LastEditTime: 2023-02-07 09:26:24
-->
<template>
  <div id="app">
    <div class="group_heads" v-show="!down">
      <span>{{title}}</span>
    </div>
    <router-view />
  </div>
</template>

<script>
export default {
  computed:{
    title() {
      return this.$route.name == 'preview' ? '答题卡预览' : '制作答题卡'
    },

    down() {
      return this.$route.query.down ? 1 : this.$route.name != '/' && this.$route.name != 'Home' && this.$route.name != 'preview' ? 1 : 0
    }
  },
}
</script>


<style lang="less">
@import '~@/assets/css/variables.less';
#app {
  height: 100%;
}
.group_heads {
  height: 50px;
  line-height: 50px;
  width: 100%;
  background-color: @main;
  position: sticky;
  z-index: 10;
  text-align: center;
  color: @white;
  font-size: 16px;
  top: 0;
}

.miniScoreHeight{
  display: flex;
  flex-direction: row-reverse;
  border-bottom: 1px solid #000;
  .item{
    height: 24px;
    flex: 1;
    text-align: center;
    box-sizing: border-box;
      // border-top: 1px solid #000;
      border-left: 1px solid #000;
      font-size: 12px;
      line-height: 24px;
    &:first-child{
      // border-right: 1px solid #000;
    }
    &:last-child{
      border-left-width: 0
    }
  }
}
.mce-content-body {
  border: none !important;
  &.mce-edit-focus {
      outline: none;
      border: none !important;
      box-shadow: none;
  }
}
.question-title {
 .el-input--medium{
    font-size: 16px !important;
    .el-input__inner,.el-textarea__inner{
      font-size: 16px;
      color: #000;
      padding-left: 3px !important;
      border-radius: 0;
      border-style: solid !important;
      text-align: left;
      min-height: 30px !important;
      height: 30px;
    }
  }
  div{
    line-height: 28px;
  }
/*   .el-textarea.el-input--medium textarea.el-textarea__inner{
    min-height: 30px !important;
    height: 30px !important;
    color: #000;
  } */
}
</style>

