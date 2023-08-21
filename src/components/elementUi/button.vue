<template>
  <div class="hj-button">
    <el-button v-bind="$attrs" v-on="$listeners">
      <slot></slot>
    </el-button>
  </div>
</template>

<script>
import { Button } from 'element-ui'
export default {
  name: 'hjButton',
  props: {},
  data() {
    return {}
  },
  methods: {},
  mounted() {},
  components: {
    elButton: Button,
  },
}
</script>

<style lang="less">
@import '~@/assets/css/variables.less';
.hj-button {
  display: inline-block;
}
/* 功能按钮 */
.el-button {
  font-size: 12px;
}
.el-button--function {
  padding: 6px 8px;
  padding-left: 28px;
  background-size: 14px;
  background-repeat: no-repeat;
  background-position: 8px center;
  border: 1px solid @main;
  color: @mainFont;
}
.el-button--function:focus,
.el-button--function:hover {
  color: @mainFont;
  border-color: @mainFont;
  background-color: @main;
}

/* 搜索按钮 */
.el-button--search {
  padding: 6px 18px;
  padding-left: 34px;
  background-size: 14px;
  background-repeat: no-repeat;
  background-position: 14px center;
  border: 1px solid @mainFont;
  color: @white;
  background-color: @main;
}
.el-button--search:focus,
.el-button--search:hover {
  color: @white;
  border-color: @mainFont;
  background-color: @main;
}
/* 确定按钮 */
.el-button--confirm {
  padding: 0 0;
  height: 30px;
  line-height: 30px;
  min-width: 60px;
  border: 1px solid @mainFont;
  color: @white;
  background-color: @main;
}
.el-button--confirm:focus,
.el-button--confirm:hover {
  color: @white;
  border-color: @mainFont;
  background-color: @main;
}
/* 透明按钮 */
.el-button--transparent {
  padding: 6px 13px;
  border: 1px solid @font-909;
  color: @font-333;
  background-color: @white;
}
.el-button--transparent:focus,
.el-button--transparent:hover {
  color: @font-333;
  border-color: @font-909;
  background-color: @white;
}
/*删除按钮 */
.el-button--del {
  padding: 6px 13px;
  border: 1px solid @del;
  color: @del;
  background-color: @white;
}
.el-button--del:focus,
.el-button--del:hover {
  color: @del;
  border-color: @del;
  background-color: @white; //del
}
/* 取消按钮 */
.el-button--cancel {
  padding: 0 0;
  height: 30px;
  line-height:30px;
  width: 60px;
  border: 1px solid transparent;
  color: @font-333;
  background-color: @font-f1f1;
}
.el-button--cancel:focus,
.el-button--cancel:hover {
  color: @font-333;
  border-color: @font-909;
  background-color: @font-909;
}
/* 返回按钮 */
.el-button--return {
  padding: 5px 6px;
  padding-left: 26px;
  background-size: 14px;
  background-repeat: no-repeat;
  background-position: 9px center;
  border: 1px solid @mainFont;
  color: @mainFont;
}
.el-button--return:focus,
.el-button--return:hover {
  color: @mainFont;
  border-color: @mainHover;
  background-color: @mainHover;
}
/* 删除按钮 */
.el-button--delete {
  padding: 6px 18px;
  border: 1px solid transparent;
  color:  @white;
  background-color: @del_fc;
}
.el-button--delete:focus,
.el-button--delete:hover {
  color:  @white;
  border-color: @del_6;
  background-color: @del_6;
}

.el-button:hover{
  // opacity: .8;
  // color: @white !important;
  // border-color: @main !important;
  // background-color: @main !important;
}
.el-checkbox__inner:hover {
  border-color: @mainFont;
}

.el-button--mini{
  padding: 4px 8px;
}

button.el-button.text_button.el-button--text.el-button--medium:hover {
    background-color: @bc_tr !important;
    color: @main !important;
    border-color: @bc_tr !important;
}
.el-button--text:active{
  color: @main
}
button.el-button.el-button--confirm.el-button--medium.is-disabled{
  &:hover{
    color: @bc_c0c !important;
    background-color: @white !important;
    border-color: @font-ebe !important;
  }
}

.cell.el-tooltip{
  button.el-button.text_button.el-button--text.el-button--medium:hover {
    background-color: @bc_tr !important;
    color: @main !important;
    border-color: @bc_tr !important;
  }
}

</style>
