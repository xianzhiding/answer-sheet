<!--
 * @Description: 
 * @Author: dingxianzhi
 * @Email: dingxz@moofen.cn
 * @Date: 2022-01-21 15:03:27
 * @LastEditTime: 2022-09-06 14:23:33
-->
<template>
  <el-dialog
    class="newAdd-content"
    title="编辑试卷标题"
    :visible.sync="openedFrame"
    :width="'500px'"
    :before-close="closeFrame"
    :show-close="false"
    :close-on-click-modal="false"
    center
  >
    <div class="item-style">
      <el-checkbox
        v-for="(item, i) in studentTitle"
        :key="i"
        v-model="item.checked"
        @change="changeCheckFunc"
      >{{ item.name }}</el-checkbox>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="closeFrame">取 消</el-button>
      <el-button type="primary" :disabled="isdisabledFn" @click="preCreateTitle">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { mapState } from 'vuex'
export default {
  data () {
    return {
      openedFrame: false,
      isdisabledFn: false,
      studentTitle: []
    }
  },
  computed: {
    ...mapState('page', ['pageData']),
    ...mapState('page', ['pageLayout']),
  },
  methods: {

    closeFrame () {
      this.openedFrame = false
    },
    openedFrameFunc (obj) {
      this.studentTitle = obj
      this.openedFrame = true
    },
    changeCheckFunc() {
      const result = this.studentTitle.filter(item => item.checked)
      if (result.length > 5) {
        this.isdisabledFn = true
        this.$message({
          showClose: true,
          message: '最多选择五个学生显示信息',
          type: 'error'
        })
      } else {
        this.isdisabledFn = false
      }
    },
    preCreateTitle () {
      const {column,paperSpec} = this.pageLayout
      let cur = this.pageData[0]
      let obj = {}
      if(column == 3 && paperSpec == "A3"){
        let long = this.studentTitle.filter(item => item.checked).length
            long = Math.ceil(long / 3)
            console.log(long);
        // obj = {
        //   checkHeight:long * 40
        // }
      }
      this.pageData.splice(0,1,{
        ...cur,
        ...obj,
        content:{
          ...cur.content,
          titleInfo:this.studentTitle
        }
      })
      this.closeFrame()
    },
  },
}
</script>

<style lang="less" scoped>
.item-style {
  padding: 10px 0;
}
</style>

