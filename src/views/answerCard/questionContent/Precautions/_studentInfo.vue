<!--
 * @Description: 
 * @Author: dingxianzhi
 * @Email: dingxz@moofen.cn
 * @Date: 2022-02-22 17:46:36
 * @LastEditTime: 2022-03-01 18:27:11
-->
<template>
  <el-row class="student-list">
    <div
      v-for="(item, i) in studentInfoArr"
      :key="i"
      class="title-item"
    >
      <span>{{ item.name }}</span>
      <span />
    </div>
    <el-button type="primary" size="mini" class="titke-edit" v-show="!previewIs" @click="editStudentInfoColumn">编辑</el-button>
    <!-- <span
          v-show="!previewIs"
          class="titke-edit"
          @click="editStudentInfoColumn"
          >编辑</span
        > -->
  </el-row>
</template>

<script>
export default {
  components: {},
  props: {
    previewIs: {
      type: Boolean,
      default: false,
    },
    titleInfo:{
      type:Array,
      default: () => []
    }
  },
  data() {
    return {
      studentInfoList: [],
    }
  },
  computed: {
    studentInfoArr() {
      return this.titleInfo.filter((item) => item.checked == true)
    },
  },
  watch: {
    titleInfo(val) {
      this.studentInfoList = JSON.parse(JSON.stringify(val))
    },
  },
  mounted() {
    this.studentInfoList = JSON.parse(JSON.stringify(this.titleInfo))
  },
  methods: {
    editStudentInfoColumn() {
      this.$emit('hanldeStudent', this.studentInfoList)
    },
  },
}
</script>

<style lang="scss" scoped></style>
