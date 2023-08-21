<template>
<!-- 选择题 -->
  <div class="question-info">
    <div
      class="question-title"
      ref="tinyeditor"
      v-if="questionData.first"
      :style="{'height':maxHeight + 'px'}"
    >
      <tiny-vue class="title-span"
        v-model="content"
        @input="changeContent"
        ref="tinyMCE"
        :max-height="maxHeight"
        :readonly="readonly"
      />
    </div>

    <div v-if="!previewIs" class="question_array">
      <div class="question_editOrDel">
        <span  class="btn_addSub_name">每组行数</span>
        <span class="btn_addSub" @click="hanldeSubtraction(questionData.id,1)">-</span>
        <span class="btn_addSub_info" >{{data.rows}}</span>
        <span class="btn_addSub" @click="hanldeSubtraction(questionData.id,2)">+</span>
        <span class="layui-btn layui-btn-xs" @click="subTopic_numberHanldeEdit(questionData.id)">编辑</span>
        <span class="layui-btn layui-btn-xs" @click="delHanlde(questionData.id)">删除</span>
      </div>
    </div>
    <div :class="['question-wrap',{question_array_colum:pageLayout.asColumn}]" v-for="(itemGroup,index) in groupData"
        :key="index">
      <div class="question-groups"
      :key="i"
      v-for="(item,i) in itemGroup"
      >
        <div
          v-for="row in item"
          :key="row.id"
          class="group_item"
        >
          <span class="topic-num">{{row.scoreNo}}</span>
          <span
            v-for="(list,index) in row.selectBox"
            :key="index"
            class="sketch"
          >
            
            <span><svg width="18" height="11" xmlns="http://www.w3.org/2000/svg">
              <rect height="11" width="18" y="0" x="0" stroke="#000000" fill="#ffffff"/>
              <text text-anchor="start" font-size="9" y="8.58939" x="5.86114" stroke-width="0" stroke="#000" fill="#000000">{{ list }}</text>
            </svg></span>
            <!-- <span>[<i>{{list}}</i>]</span> -->
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations,mapGetters } from 'vuex'

import tinyVue from '@/components/tinymce'

export default {
  components: {
    tinyVue,
  },
  props: {
    contentData: {
      type: Object,
      default: () => { }
    },
    questionData: {
      type: Object,
      default: () => { }
    },
    previewWidth:{
      type: Number,
      default: 0
    },
    previewIs: {
      type: Boolean,
      default: false
    },
    readonly: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      data: {},
      isEditor: false,
      content: '',
      quilleditor:false,
      pageLayout:this.contentData.pageLayout,
      maxHeight:24
    }
  },
  computed: {
    ...mapState('page', ['pageData']),
    ...mapGetters('question',['options']),

    topicBox(){
      const {singleChoice,checkChoice,judgmentChoice} = this.data.group
      return [
        ...singleChoice.map(group => group.childGroup).flat(),
        ...checkChoice.map(group => group.childGroup).flat(),
        ...judgmentChoice.map(group => group.childGroup).flat(),
      ]
    },

    groupData () {
      // return this.questionData.showData.flat()
      return this.questionData.showData
    },
  },
  watch: {
    contentData: {
      immediate: true,
      handler () {
        this.data = {
          ...this.contentData
        }
        this.pageLayout = this.contentData.pageLayout
      }
    },
    questionData:{
      immediate: true,
      handler () {
        this.content = ''
        let {number,topicName,scoreTotal} = this.data

        if(!this.questionData.titleContent){
          // this.content = `<p><span>${this.options[number].label}.</span><span>${topicName}</span><span class='p-5'>(${scoreTotal}分)</span></p>`
          this.content = `${this.options[number].label}.${topicName} (${scoreTotal})分`
        }else{
          // this.content = this.questionData.titleContent.replace(/<br>/ig,'\n').replace(/<br\/>/ig,'\n')
          this.content = this.questionData.titleContent
        }
        this.maxHeight = this.questionData.heightTitle
      }
    }
  },
  mounted () {

  },
  methods: {
    ...mapMutations('page', ['pageData_del',]),

    ...mapMutations('questionType', [
      'subTopic_already_del',
      'subTopic_number_calculate',
      'subTopic_determine_clean',
    ]),

    ...mapMutations('page', [
      'pageData_edit_title'
    ]),

    delHanlde (id) { // 删除大题-小题数
      const index = this.pageData.findIndex((itme) => itme.id === id)
      if (index > -1) {
        this.subTopic_already_del(this.topicBox)
        this.topicBox.forEach(question => {
          this.subTopic_determine_clean(question.topic)
        })

        this.pageData_del(index)
        this.subTopic_number_calculate()
      }
    },

    subTopic_numberHanldeEdit (id) {
      this.$emit('current-question-hanlde-edit', id)
    },

    hanldeEditor () {
      this.isEditor = true
      this.quilleditor = true
    },

    hanldeSubtraction (id, num) {
      this.$emit('hanlde-subtraction', id, num)
    },

    changeContent(obj){
    
      const {val,tinyHeight} = obj
      const index = this.pageData.findIndex(question => question.id == this.questionData.id)
      let height = val ? tinyHeight + 2 : 2
      this.maxHeight = height // 最大高度
      if(index > -1){
        let curObj = this.pageData[index]
        let data = {
          question:{
            ...curObj,
            // titleContent:val.replace(/\n/g, '<br>'),
            titleContent:val,
            heightTitle:height,
            height:{
              ...curObj.height,
              titleH:height + curObj.marginHeight
            }
          },
          index:index,
        }
        this.pageData_edit_title(data)
      }

    }
  },
}
</script>

<style lang="less">
@import '~@/assets/css/variables.less';
.mce-content-body{
  outline: none;
}
.el-dialog__headerbtn{
  font-size: 24px;
  top: 18px
}
.question-title {
  border: 1px solid transparent;
  line-height: 22px;
  font-size: 14px;
  overflow: auto;
  &:hover {
    border-color: @main;
  }
}
.question-info:hover{
.question_array {
      visibility: visible;
    }
}
.question_array {
  position: relative;
  display: flex;
  flex-wrap: wrap;
  visibility: hidden;
  .question_editOrDel {
    position: absolute;
    right: 40px;
    // top: -10px;
    z-index: 99;
    span {
      margin-left: 10px;
    }
  }
}

.question-wrap{
  display: flex;
  flex-wrap: wrap;
  .question-groups {
    padding: 5px 0;
  }
  .group_item {
    display: table-header-group;
    height: 20px;
    line-height: 20px;
    span.topic-num {
      font-size: 12px;
      width: 42px;
      text-align: right;
      display: inline-block;
    }
    span.sketch {
      padding-left: 8px;
      width: 26px;
      i {
        font-style: normal;
        padding: 0 1px;
      }
      span {
        // position: relative;
        // top: -1px;
        // font-size: 12px;
        // margin-left: 5px;
      }
    }
    border-bottom: none;
  }
  .question_editOrDel {
    position: absolute;
    right: 40px;
    top: -10px;
    display: none;
    z-index: 99;
    span {
      margin-left: 10px;
    }
  }
  &:hover {
    .question_editOrDel {
      display: block;
    }
  }
}
.question_array_colum{
  position: relative;
  display: flex;
  flex-wrap: wrap;
  .question-groups {
    display: flex;
    padding-left: 10px;
  }
  .group_item {
    width: 26px;
    height: auto;
    line-height: 20px;
    text-align: center;
    span{
      display: block;
      text-align: center;
    }
    span.topic-num {
      width: auto;
    }
    span.sketch {
      margin-left: 0;
      span {
        margin-left: 0;
      }
    }
  }
}
.btn_addSub,
.btn_addSub_info{
  display: inline-block;
  padding: 0 5px;
  height: 21px;
  min-width: 12px;
  line-height: 20px;
  border:1px solid  @main;
  color: @main;
  text-align: center;
  position: relative;
  cursor: pointer;
  top: 0px;
  font-size: 12px;
}
.btn_addSub_info{
  min-width: 14px;
}
.btn_addSub_name{
  font-size: 14px;
  color: @main;
  position: relative;
    top: 0px;
}
.question-info{
  position: relative;
  .ql-editor{
    padding: 0 0;
    position: relative;
  }
  .ql-toolbar{
    &.ql-snow{
      padding: 0;
      position: absolute;
      top: -26px;
      z-index: 99;
      background: #fff;
      width: 100%;
    }
  }
}
</style>

