<template>
  <div class="subtopic_group_list">
    <span class="space-em">第{{data.topic}}题 题号</span>
    <el-input v-model="data.scoreNo" size="mini" @blur="changeFirstlevelSpace" />
    <span> 共 </span>
    <span v-if="isComponent == 'firstlevelItem'">
      <el-input v-model.number="data.space"
        size="mini"
        @blur="changeFirstlevelSpace"
        oninput="value=value.replace(/[^\d]/g,'')"
      />
      <span> 空 每空 </span>
      <el-input v-model="data.score"
        size="mini"
        @blur="changeFirstlevelSpace"
        onkeyup.stop.native="this.value = this.value.replace(/(\.\d{1,1})(?:.*)|[^\d.]/g, ($0, $1) => {return $1 || '';})"
      />
      <span> 分 共 {{data.sum}} 分 </span>
    </span>

    <span v-else> {{data.sum}} 分</span>

    <span class="add_groupTopic" @click.stop="addSubtopicCollection">+ 添加小题</span>
    <i class="el-icon-del" @click.stop="delSubTopicFirstlevel" >-</i>
    <span
      class="change-group"
      @click="expandCloseGroup"
    >
      <i :class="'el-icon-arrow-'+ switch_s"></i>
    </span>

    <div
      :class="['subTopic_list',switch_s]"
      v-for="subtopic in data.childGroup"
      :key="subtopic.id"
    >

      <component
        :is="isComponent"
        :subtopic-group="subtopic.childGroup"
        :subtopic="subtopic"
        :is-topic="subtopic.isTopic"
        :edit-id="editId"
        @pre-edit-last-score="preEditLastScore"
        @pre-edit-two-last-score="preEditTwoLastScore"
        @change-twoLevel-topic="changeTwoLevelTopic"
        @del-two-level-subtopic="delTwoLevelSubtopic"
        @change-status="changeStatus"
      />

    </div>
  </div>
</template>

<script>

  import firstlevelItem from './firstItem'
  import towlevelItem from './twoItem'

  function reducer(obj, count = 0){
    if (obj.childGroup && obj.childGroup.length) {
      return obj.childGroup.reduce((acc, item) => {
          return reducer(item, acc);
      }, count);
    }
    return count + obj.score
  }
  export default {
    components: {
      firstlevelItem,
      towlevelItem
    },

    props: {
      groupSubtopic: {
        type: Object,
        default: ()=>{}
      },

      editId:{
        type:String,
        default:''
      }
    },

    data() {
      return {
        data: {},
        switch_s:'right',
        off:''
      }
    },

    computed: {
      isComponent() {
        let {Multistage} = this.groupSubtopic
        return !Multistage ? 'firstlevelItem' : 'towlevelItem'
      },

      spaceGroup (){
        let Arr =[]
        let {scoreNo,space,score,pid,id,topic} = this.data
        let scoreVal = score ? score.toString().match(/^\d+(?:\.\d{0,1})?/) : score

        for (let index = 1; index < space + 1; index++) {
          let subtopic = {
            topic:topic,
            scoreNo: scoreNo,
            score:Number(scoreVal),
            id:`sid_${+new Date()}_${index}`,
            pid:id,
            sid:pid,
            isTopic:index == 1 ? true : false,
            space:index,
            spaceNum:index,
            smallTopic: index+1
          }
          Arr.push(subtopic)
        }
        return Arr
      },
    },

    watch: {
      groupSubtopic: {
        immediate: true,
        handler () {
          let sum ={}
          if(this.isComponent == 'firstlevelItem'){
            let tScore = this.groupSubtopic.childGroup.map(question => question.score)
                                .reduce((accumulator, currentValue) => accumulator + currentValue)
            sum = {sum:tScore}
          }else{
            sum = {sum:reducer(this.groupSubtopic,0)}
          }
          let {scoreNo,topic} = this.groupSubtopic
          this.data = {
            ...this.groupSubtopic,
            scoreNo: scoreNo ? scoreNo : topic,
            ...sum
          }
          if(!this.off){
            this.switch_s = this.data.level ? 'down':'right'
          }else{this.off=''}
        }
      }
    },

    methods: {
      changeFirstlevelSpace(){
        // 一级空格
        this.off = this.switch_s
        let {score,space, scoreNo} = this.data
        let scoreNoVal = scoreNo ? scoreNo.toString() : scoreNo
        let scoreVal = score ? score.toString().match(/^\d+(?:\.\d{0,1})?/) : score
            scoreVal = Number(scoreVal)

        if(space && space >= 1 && scoreVal >= 1){

          this.$emit('change-firstlevel-space', {
            ...this.data,
            scoreNo:scoreNoVal,
            score:Number(scoreVal),
            childGroup:this.spaceGroup
          })
        }else{
          let errorVal = ''
          if(!space || space <= 0){
            errorVal = '每题空格数必须为正整数'
          }

          if(score <= 0){
            errorVal = '分数必须大于0'
          }

          this.$emit('change-status',errorVal)
        }


      },

      changeTwoLevelTopic(obj){
        // 多空小题段修改编辑
        this.$emit('change-twoLevel-topic', obj)
      },

      addSubtopicCollection(){
        let {childGroup,level,Multistage,end,id,pid,score,space,start,sum,topic, scoreNo} = this.data

        if(!level){
          this.switch_s = 'down'
        }

        if(!Multistage){
          this.$emit('add-subTopic-collection',{
            end:end,
            id:id,
            pid:pid,
            score:score,
            scoreNo:scoreNo,
            space:space,
            start:start,
            sum:sum,
            topic:topic,
            level:true,
            childGroup:this.subtopicGroup(this.data),
            Multistage:true
          })
        }else{
          childGroup.push(...this.subtopicGroup(this.data,childGroup.length + 1))
          this.$emit('add-subTopic-collection',this.data)
        }

      },

      delSubTopicFirstlevel(){
        // 删除一级小题
        this.$emit('del-subtopic-firstlevel', {...this.data,score:Number(this.data.score.toString().match(/^\d+(?:\.\d{0,1})?/))})
      },

      delTwoLevelSubtopic(obj){
        // 删除二级小题
        this.$emit('del-two-level-subtopic',obj)
      },

      expandCloseGroup(){
        // 展开关闭小题层级
        if(this.switch_s == 'right'){
          this.switch_s = 'down'
        }else{
          this.switch_s = 'right'
        }
      },

      // $emit---------------------------------
      preEditLastScore(obj) {
        // 编辑最后一级分数
        this.$emit('pre-edit-last-score',obj)
      },

      preEditTwoLastScore(obj){
        // 二级最后一级分数
        this.$emit('pre-edit-two-last-score',obj)
      },

      changeStatus(val){
        this.$emit('change-status',val)
      },

      //----------------------------------
      subtopicGroup(data,smallTopic = 1){
        let end = 1
        let Arr = []
        for(let i = 1 ; i < end + 1;i++){
          let sid = `sid_${+new Date()}_${i}`
          Arr.push({
            id:sid,
            pid:data.id,
            sid:data.pid,
            smallTopic:smallTopic + i,
            topic:data.topic,
            score:data.score,
            scoreNo:data.scoreNo,
            space:1,
            level: false,
            sum: 1,
            childGroup:[{
              id:`lid_${+new Date()}`,
              pid:sid,
              sid:data.id,
              lid:data.pid,
              sum:1,
              score:data.score,
              scoreNo:data.scoreNo,
              smallTopic: smallTopic,
              topic:data.topic,
              spaceNum:1,
            }]
          })
        }
        return Arr
      },

    },
  }
</script>

<style lang="less">
  @import '~@/assets/css/variables.less';

  .subtopic_group_list{
    width: 100%;
    position: relative;
    min-height: 40px;
    line-height: 40px;
    border-bottom:1px solid #ddd;

    .space-em{
      margin-left: 1em;
    }

    .subTopic_list{
      border-top: 1px solid #ddd;
      width: 98%;
      margin-left: 1%;
      display: none;
    }

    .subTopic_list.down{
      display: block;
    }

    .add_groupTopic {
      font-size: 16px;
      color: @main;
      position: absolute;
      right: 60px;
      min-width: 90px;
      cursor: pointer;
    }

    i.el-icon-del {
      position: absolute;
      right: 30px;
      font-size: 18px;
      color: @main;
      width: 28px;
      text-align: center;
      line-height: 40px;
      cursor: pointer;
    }

    .change-group {
        display: inline-block;
        position: absolute;
        right: 10px;
        line-height: 40px;
        font-size: 18px;
        cursor: pointer;
    }

    &:last-child{
      border-bottom:none
    }

    .el-input--mini {
      width: 48px;
    }
  }
</style>