<template>
  <el-tabs v-model="activeName" type="border-card" @tab-click="hanldeClick" class="card_top">
    <template  v-for="(item, i) in tabPaneData">
      <el-tab-pane
        :key="i"
        :label="item.label"
        :name="item.name"
        :disabled="isdisabled"
      >
        <component
          :is="item.name"
          :active-name="item.name"
          :edit-id="editId"
          :group-data="grouptopic[item.name]"
          @group-verify-status="groupVerifyStatus"
          @update-group-subTopic="updateGroupSubTopic"
          @pre-edit-subtopic="preEditSubtopic"
          @add-group-question="addGroupQuestion"
          @del-subtopic-group="delSubtopicGroup"
          ref="componentTabs"
        />
      </el-tab-pane>
    </template>
  </el-tabs>
</template>

<script>
  import singleChoice from '../objective/singleChoice'
  import checkChoice from '../objective/checkChoice'
  import judgmentChoice from '../objective/judgmentChoice'

  import {OBJECTIVE_QUESTION} from '@/models/base'

  export default {
    components: {
      singleChoice,
      checkChoice,
      judgmentChoice
    },
    props: {
      questionGroup: {
        type: Object,
        default: () => { },
      },
      editId:{
        type: String,
        default: '',
      }
    },
    data() {
      return {
        activeName: 'singleChoice',
        grouptopic:{},
        errorStr:'',
        verifyStatus:false,
        tabPaneData:OBJECTIVE_QUESTION
      }
    },
    computed: {
      isdisabled(){
        return this.errorStr != '' && this.verifyStatus ? true : false
      },
    },
    watch: {
      questionGroup: {
        immediate: true,
        handler () {
          this.grouptopic = {
            ...this.questionGroup
          }
        }
      }
    },
    methods: {
      hanldeClick(tab) {
        this.activeName = tab.name

        if(this.grouptopic[tab.name].length){
          this.$refs.componentTabs[tab.index].change()
        }
      },

      groupVerifyStatus(verify){
        this.verifyStatus = verify.status
        this.errorStr = verify.str
        this.$emit('group-verify-status', verify)
      },

      updateGroupSubTopic(group){
        this.$emit('update-group-subTopic',group)
      },

      preEditSubtopic(subtopic){
        this.$emit('pre-edit-subtopic',subtopic)
      },

      addGroupQuestion(group){
        this.$emit('add-group-question',group)
      },

      delSubtopicGroup(subtopic) {
        this.$emit('del-subtopic-group',subtopic)
        this.errorStr = ''
      },
    },
  }
</script>

<style lang="less">
@import '~@/assets/css/variables.less';
.select-item {
  display: flex;
  .label {
    width: 70px;
    position: relative;
    top: 4px;
  }
}
.select-item:last-child {
  margin-top: 20px;
  .el-input.el-input--mini {
    width: 130px;
  }
}
.hj-select {
  width: 130px;
}
.card_top {
  margin-top: 20px;
}
.el-tabs--border-card {
  box-shadow: none !important;
}
.el-tabs--border-card>.el-tabs__header{
  background-color: transparent !important;
}
.error-message {
  color: @error;
  font-size: 14px;
}
.question-group {
  .group_item:last-child {
    .el-row:last-child {
      border-bottom: none;
    }
  }
}

.Insert_box {
  margin-top: 10px;
  position: relative;
  .Insert_Mask {
    position: absolute;
    width: 80%;
    height: 28px;
    right: 0;
    top: 0;
  }
}
.questionNumber_big_exist_style {
  display: inline-block;
  .hj-select {
    display: inline-block;
    margin: 0 5px;
  }
}
.Postpone {
  margin-left: 20px;
}
.questionNumber_big_exist_style.Fade,
.Postpone.Fade {
  color: @font-999;
}
</style>