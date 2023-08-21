<template>
  <el-dialog
    class="newAdd-content"
    title="编辑注意事项"
    :visible.sync="openedFrame"
    :width="'360px'"
    :before-close="closeFrame"
    :show-close="false"
    :close-on-click-modal="false"
  >
    <div class="item-style">
      <div class="demo-input-suffix critical_score">
        <el-input
          type="textarea"
          :rows="2"
          placeholder="请输入内容"
          v-html="NoticesRules">
        </el-input>
        <div class="label-Warning">{{ labelWarning }}</div>
      </div>
    </div>
    <div class="dialog-footer">
      <el-button type="cancel" @click="closeFrame">取 消</el-button>
      <el-button type="confirm" :disabled="isdisabledFn" @click="preCreateTitle">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import { PRECAUTIONS } from '@/models/base'
export default {
  data () {
    return {
      openedFrame: false,
      isdisabledFn: false,
      minAdmission: 4, // 最小数
      labelWarning: ' ', // 请输入4~12之间的整数,
      NoticesRules: PRECAUTIONS
    }
  },
  computed: {
    ...mapState('titleSet', ['noticesRules']),
    ...mapState('page', ['pageLayout','pageData']),
  },
  watch: {
    noticesRules (val) {
      this.NoticesRules = val.join(',')
    }
  },
  mounted () {
    this.NoticesRules = this.noticesRules
  },
  methods: {
    ...mapMutations('titleSet', ['editNoticesRules']),
    ...mapMutations('pageContent', ['pageData_edit']),
    closeFrame () {
      this.openedFrame = false
    },
    openedFrameFunc () {
      this.openedFrame = true
    },
    preCreateTitle () {
      let answerTitle = this.pageData[0]
      this.editNoticesRules(this.NoticesRules)
      this.pageData.splice(0,1,{
        ...answerTitle,
        content:{
          ...answerTitle.content,
          noticesRules: this.NoticesRules
        }
      })
      this.closeFrame()
    },
    changeValueFunc (e) {
      const val = parseInt(e)
      // if (val < this.minAdmission || val > this.maxAdmission || e == '') {
      //   this.labelWarning = '请输入4~' + this.maxAdmission + '之间的整数'
      //   this.isdisabledFn = true
      // } else {
      //   this.labelWarning = ''
      //   this.isdisabledFn = false
      // }
    },
  },
}
</script>

<style lang="less">
.item-style {
  padding: 10px 0;
}
.demo-input-suffix {
  display: flex;
  position: relative;
  label {
    width: 120px;
    line-height: 37px;
  }
  input {
    height: 30px !important;
    line-height: 30px !important;
    font-size: 14px !important;
    width: 80%;
    display: inline-table;
  }
  .label-Warning {
    color: red;
    position: absolute;
    top: 40px;
    font-size: 12px;
    left: 88px;
  }
}
.padding__inner{
  input.el-input__inner{
    padding: 16px 0;
    font-size: 20px !important;
  }
}
</style>
