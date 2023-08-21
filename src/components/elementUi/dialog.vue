<!--
 * @Description: 
 * @Author: dingxianzhi
 * @Email: dingxz@moofen.cn
 * @Date: 2022-06-01 10:12:12
 * @LastEditTime: 2022-06-22 11:51:51
-->
<template>
  <!-- <div class="hj-dialog"> -->
    <el-dialog
      v-bind="$attrs"
      v-on="$listeners"
      :title="title"
      :close-on-click-modal="closeOnClickModal"
    >
      <slot></slot>
    </el-dialog>
  <!-- </div> -->
</template>

<script>
import { Dialog } from 'element-ui'
export default {
  name: 'hjDialog',
  props: {
    title: { type: String },
    closeOnClickModal: {
      type: Boolean,
      default: false,
    },
    dialogDrag: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {}
  },
  methods: {},
  mounted() {},
  components: {
    elDialog: Dialog,
  },
}
</script>

<style lang="less">
@import '~@/assets/css/variables.less';
.el-dialog__header {
  text-align: center;
  padding: 10px 0;
  // background-color: @main;
}
.el-dialog__headerbtn {
  top: 10px;
  right: 12px;
}
.el-dialog__title {
  color: @font-333;
}
.el-dialog__headerbtn .el-dialog__close {
  /* color: white; */
  font-size: 23px;
}
.public-dialog .el-button {
  padding: 8px 15px;
}
.el-dialog__body {
  text-align: left;
  padding: 10px 20px 15px;
}

.dialog-footer {
  text-align: right;
  padding-top: 20px;
}
.dialog-footer > div {
  display: inline-block;
}
.dialog-footer > div:nth-of-type(1) {
  margin-right: 15px;
}
</style>
