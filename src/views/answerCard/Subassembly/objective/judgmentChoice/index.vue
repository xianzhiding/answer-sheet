<template>
  <div>
    <div class="big-question-box">
      <choice-tabs
        v-for="group in groupData"
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
      <template v-for="group in groupData">
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
          select: 2,
          id: `judgment_${+new Date()}`,
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

<style lang="less" scoped>
</style>