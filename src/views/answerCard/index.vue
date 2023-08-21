<!--
 * @Description: 
 * @Author: dingxianzhi
 * @Email: dingxz@moofen.cn
 * @Date: 2022-06-01 10:12:24
 * @LastEditTime: 2022-09-06 09:15:00
-->
<template>
  <div class="page-content">
    <answer-sheet-layout />
    <div class="main-info">
      <answer-sheet-set />
      <answer-sheet-content ref="answerContent"/>
    </div>
  </div>
</template>

<script>
import answerSheetLayout from './_pageLayout'
import answerSheetSet from './_basicSet'
import answerSheetContent from './pageConten'
export default {
  components: {
    answerSheetLayout,
    answerSheetSet,
    answerSheetContent,
  },
}
</script>
<style lang="less" scoped>
.page-content {
  position: relative;
  height: calc(100% - 50px);
}
.main-info {
  height: calc(100%);
  width: 100%;
}
</style>
