/* eslint-disable vue/no-unused-components */
<template>
  <div class="hj-select" v-bind:class="{'has-error':error}">
    <el-select
      v-model="value"
      v-bind="$attrs"
      v-on="$listeners"
      popper-class="hj-select-dropdown"
      placeholder="请选择"
    >
      <el-option  v-for="item in items" :key="item.value" :label="item.label" :value="item.value"></el-option>
    </el-select>
  </div>
</template>
<script>
import { Select, Option } from 'element-ui'
export default {
  name: "hjSelect",
  props: {
    items: {
      default () {
        return []
      },
      type: Array
    },
    error: {
      type: Boolean,
      default: false
    },
    value: {
      type: Number,
      default: 1
    }
  },
  components: {
    elSelect: Select,
    elOption: Option
  },
  data () {
    return {
      selectVal: this.value
    }
  },
}
</script>

<style lang="less" >
// .el-input--medium .el-input__inner {
//   height: 28px;
//   line-height: 28px;
// }
</style>