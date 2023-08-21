<template>
  <div>
    <div class="big-question-box">
      <choice-tabs
        v-for="group in questionGroup"
        :key="group.id"
        :group="group"
        :active-name="activeName"
        :edit-id="editId"
        @group-verify-status="groupVerifyStatus"
        @update-group-subTopic="updateGroupSubTopic"
        @del-subtopic-group="delSubtopicGroup"
        ref="choiceTabs"
      />
    </div>
    <div class="add_question" @click="addGroupQuestion()">+ 分段添加小题</div>
    <div class="question-group">
      <template v-for="group in questionGroup">
        <div :key="group.id" class="group_item">
          <choice-group
            v-for="item in group.childGroup"
            :key="item.topice"
            :subtopic="item"
            @pre-edit-subtopic="preEditSubtopic"
          />
        </div>
      </template>
    </div>

  </div>
</template>

<script>
  import choiceTabs from './tabs'
  import choiceGroup from './groupItem'
  import {mapState } from 'vuex'
  export default {
    components: {
      choiceTabs,
      choiceGroup
    },

    props: {
      groupData: {
        type: Array,
        default: () => [],
      },
      activeName:{
        type:String,
        default:''
      },
      editId:{
        type: String,
        default: '',
      }
    },

    data() {
      return {
        questionGroup:[]
      }
    },

    computed: {
      ...mapState('questionType',['subTopic_number']),
    },

    watch: {
      groupData: {
        immediate: true,
        handler () {
          this.questionGroup = {
            ...this.groupData
          }
        }
      }
    },

    methods: {
      hanldeClick() {

      },

      change(){
        this.$refs.choiceTabs[0].change()
      },

      addGroupQuestion(){
        let group ={
          start: this.subTopic_number,
          end: null,
          score: null,
          select: 4,
          id: `single_${+new Date()}`,
          childGroup: [],
        }
        this.$emit('add-group-question',{type:this.activeName,groupTopic:group})
      },

      preEditSubtopic(subtopic){
        this.$emit('pre-edit-subtopic',subtopic)
      },

      groupVerifyStatus(verify){
        this.$emit('group-verify-status', verify)
      },

      updateGroupSubTopic(group){
        this.$emit('update-group-subTopic',group)
      },

      delSubtopicGroup(subtopic) {
        this.$emit('del-subtopic-group',subtopic)
      },
    },
  }
</script>

<style lang="less">
  @import '~@/assets/css/variables.less';
  .add_question {
    color: @main;
    cursor: pointer;
    width: 100px;
  }
  .big-question-box {
    margin-bottom: 20px;
  }
  .big-item,
  .group_item_right {
    position: relative;
    display: flex;
    input {
      width: 48px;
      height: 28px;
    }
    .el-input--mini {
      width: 48px;
    }
    span {
      position: relative;
      top: 5px;
      margin: 0 3px;
    }
    .el-icon-delete {
      position: absolute;
      right: 0;
      top: 5px;
      font-size: 18px;
      cursor: pointer;
    }
  }
  .group_item {
    width: 100%;
    height: 39px;
    line-height: 39px;
    border-bottom: 1px solid #888;
    display: contents;
  }
  .group_item:last-child {
    .el-row:last-child {
      border-bottom: none;
    }
  }

  .group_item_right {
    text-align: right;
    position: relative;
    span {
      top: 0px;
      margin: 0 5px;
    }
    > div {
      position: absolute;
      right: 0;
    }
  }
  .question_tabtitle {
    text-indent: 1em;
  }
  .big-item:nth-child(n + 2) {
    margin-top: 10px;
  }
  .el-tabs__header.is-top {
    .el-input--mini .el-input__inner {
      text-align: center;
    }
  }
</style>