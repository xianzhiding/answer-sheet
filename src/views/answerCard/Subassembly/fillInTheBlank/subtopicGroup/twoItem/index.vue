<template>
  <div class="sub-item-group" @click="clickFun">
    <span class="tig" @click.stop="clickFun">({{data.smallTopic - 1}}) 共 </span>
    <el-input v-model.number="data.space" size="mini" @blur="changeSpaceValue"  oninput="value=value.replace(/[^\d]/g,'')"/>
    <span @click.stop="clickFun"> 空 每空 </span>
    <el-input v-model="data.score" size="mini" @blur="changeSpaceValue"  onkeyup="this.value = this.value.replace(/(\.\d{1,1})(?:.*)|[^\d.]/g, ($0, $1) => {return $1 || '';})" />
    <span @click.stop="clickFun"> 分 共 {{data.sum}} 分 </span>
    <i class="el-icon-circle-clos" @click.stop="delTwoLevelSubtopic" >删除</i>
    <span
      class="change-group"
      @click="expandCloseGroup"
    >
      <i :class="'el-icon-arrow-'+ switch_s"></i>
    </span>
    <last-item
      :class="switch_s"
      v-for="subtopic in data.childGroup"
      :key="subtopic.id"
      :subtopic="subtopic"
      @pre-edit-two-last-score="preEditTwoLastScore"
    />
  </div>

</template>


<script>
  import lastItem from './item.vue'

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
      lastItem,
    },
    props: {
      subtopic: {
        type: Object,
        default: () => {}
      },
    },

    data() {
      return {
        data: {},
        switch_s:'right',
        off:''
      }
    },

    watch: {
      subtopic: {
        immediate: true,
        handler () {
          this.data = {
            ...this.subtopic,
            sum:reducer(this.subtopic,0)
          }
          if(!this.off){
            this.switch_s = this.data.level ? 'down':'right'
          }else{this.off=''}
        }
      }
    },

    methods: {
      changeSpaceValue() {
        this.off = this.switch_s
        let {score,space} = this.data
        let scoreVal = score ? score.toString().match(/^\d+(?:\.\d{0,1})?/) : score
            scoreVal = Number(scoreVal)

        if(space && space >= 1 && scoreVal >= 1){
          this.$emit('change-twoLevel-topic', {
            ...this.data,
            score:Number(scoreVal)
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

      delTwoLevelSubtopic(){
        this.$emit('del-two-level-subtopic',this.data)
      },

      clickFun(){},

      expandCloseGroup(){
        if(this.switch_s == 'right'){
          this.switch_s = 'down'
        }else{
          this.switch_s = 'right'
        }
      },

      preEditTwoLastScore(obj) {
        // 编辑最后一级分数
        this.$emit('pre-edit-two-last-score',obj)
      }
    },
  }
</script>

<style lang="less">
  @import '~@/assets/css/variables.less';
  .sub-item-group{
    position: relative;

    .tig{margin-left: 20px;}
    i.el-icon-circle-clos {
      position: absolute;
      right: 40px;
      line-height: 40px;
      color: @main;
      cursor: pointer;
    }
    border-bottom: 1px solid #ddd;

    &:last-child{
      border-bottom: none
    }
  }
</style>