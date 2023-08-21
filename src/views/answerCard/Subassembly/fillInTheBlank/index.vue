<template>
  <div class="space_box">
    <question-group
      v-for="(subTopic, index) in questionGroups"
      :key="index"
      :subTopic="subTopic"
      :edit-id="editId"
      @del-question-group="delQuestionGroup"
      @pre-edit-question-group="preEditQuestionGroup"
      @change-status="changeStatus"
    />
    <div class="add_question" @click="addsubTopicGroup">+ 分段添加小题</div>
    <div class="question-group">
      <subtopic-group
        v-for="(subtopic, index) in groupChild"
        :key="index"
        :group-subtopic="subtopic"
        :edit-id="editId"
        @add-subTopic-collection="addSubTopicCollection"
        @change-level="changeLevel"
        @change-firstlevel-space="changeFirstlevelSpace"
        @change-twoLevel-topic="changeTwoLevelTopic"
        @del-subtopic-firstlevel="delSubTopicFirstlevel"
        @pre-edit-last-score="preEditLastScore"
        @del-two-level-subtopic="delTwoLevelSubtopic"
        @pre-edit-two-last-score="preEditTwoLastScore"
        @change-status="changeStatus"
      />

    </div>
  </div>
</template>

<script>
  import { mapState} from 'vuex'
  import questionGroup from '../fillInTheBlank/group'
  import subtopicGroup from './subtopicGroup/'

  export default {
    components: {
      questionGroup,
      subtopicGroup
    },

    props: {
      groupData: {
        type: Array,
        default: () => []
      },
      editId:{
        type: String,
        default: ''
      },
    },

    data () {
      return {
        activeNames: [],
        questionGroups: []
      }
    },

    computed: {
      ...mapState('questionType', [
        'subTopic_number',
      ]),

      groupChild () {
        return this.groupData.map(question => question.childGroup).flat()
      }

    },

    watch: {
      groupData: {
        immediate: true,
        handler () {
          this.questionGroups = [...this.groupData]
        }
      }
    },

    methods: {
      addsubTopicGroup() {
        let group = {
          start: this.subTopic_number,
          end: null,
          score: null,
          space: 1,
          id: `spaceTopic_${+new Date()}`,
          childGroup: [],
        }
        this.$emit('add-subTopic-group',group)
      },

      preEditQuestionGroup(obj){
        this.$emit('pre-edit-question-group',obj)
      },

      delQuestionGroup(id){
        this.$emit('del-question-group',id)
      },

      changeStatus(val){
        this.$emit('change-status',val)
      },

      addSubTopicCollection(obj){
        //添加小题
        this.$emit('add-subTopic-collection',obj)
      },

      changeLevel(obj){
        //改变层级规则
        this.$emit('change-level',obj)
      },

      delSubTopicFirstlevel (obj) {
        // 删除一级小题号
        this.$emit('del-subtopic-firstlevel', obj)
      },

      delTwoLevelSubtopic(obj){
        // 删除二级小题
        this.$emit('del-two-level-subtopic',obj)
      },

      preEditLastScore(obj) {
        // 编辑最后一级分数
        this.$emit('pre-edit-last-score',obj)
      },

      preEditTwoLastScore(obj){
        // 二级最后一级分数
        this.$emit('pre-edit-two-last-score',obj)
      },

      changeFirstlevelSpace (obj) {
        // 分值分数修改
        this.$emit('change-firstlevel-space', obj)
      },

      changeTwoLevelTopic(obj){
        // 多空小题段修改编辑
        this.$emit('change-twoLevel-topic', obj)
      },

      //------------------------------------------
      //旧

      addSubtopicFirstlevel (obj) {
        // 添加小题空格数
        this.$emit('add-subtopic-firstlevel', obj)
      },

      hanldeLastTopicDel (obj) {
        // 删除小题last题组item
        this.$emit('hanlde-last-topic-del', obj)
      },
      changeLastSubTopicScore (obj, oldObj) {
        // last-sub分值改变
        this.$emit('change-last-sub-topic-score', obj, oldObj)
      }

    },
  }
</script>

<style lang="less">
  .space_box,
  .add_question {
    margin-top: 20px;
  }
  .question-group {
    width: 100%;
    height: 260px;
    overflow: auto;
    border: 1px solid #888;
    margin-top: 15px;
  }
</style>