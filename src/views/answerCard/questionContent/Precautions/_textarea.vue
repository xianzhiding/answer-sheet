<!--
 * @Description: 
 * @Author: dingxianzhi
 * @Email: dingxz@moofen.cn
 * @Date: 2022-06-01 10:12:23
 * @LastEditTime: 2022-08-26 10:19:40
-->
<template>
  <el-input
    type="textarea"
    placeholder="请输入答题卡标题"
    v-model="textareaVal"
    @change="editPrecautionsTitile"
    resize="none"
    ref="textarea"
    autosize
    id="inputs"
  />
</template>

<script>
import { mapMutations, mapState } from 'vuex'
export default {
  props: {
    textareaData: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      textareaVal: this.textareaData.replace(/<br>/ig,'\n').replace(/<br\/>/ig,'\n'),
      // textareaVal: this.textareaData,
    }
  },
  computed: {
    ...mapState('page', ['pageData','pageLayout']),
  },
  methods: {
    ...mapMutations('page', ['pageData_edit']),
    editPrecautionsTitile(e) {
      // var long=(e.replace(/\n/g, '<br>').split('<br>')).length-1
      // let height = long * 40 + 40
      // console.log(this.$refs.textarea.textareaStyle);
      // let height = parseInt(this.$refs.textarea.textareaStyle.height.replace(/[^0-9]/ig, ''))
      let height = parseInt(this.$refs.textarea.textareaStyle.height)
      // if(this.pageLayout.asAbPaper && height < 78)
      // console.log(height);
      let answerTitle = this.pageData[0]
      this.pageData_edit({
        ...answerTitle,
        heightTitle: this.pageLayout.asAbPaper && height < 78 ? 78 : height < 40 ? 40 : height,
        layoutChange:false,
        content: {
          ...answerTitle.content,
          textVal: e.replace(/\n/g, '<br>'),
        },
      })
      console.log({
        ...answerTitle,
        heightTitle: this.pageLayout.asAbPaper && height < 78 ? 78 : height < 40 ? 40 : height,
        layoutChange:false,
        content: {
          ...answerTitle.content,
          textVal: e.replace(/\n/g, '<br>'),
        },
      });
    },
  },
}
</script>
