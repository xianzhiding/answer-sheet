<template>
  <div>
    <div class="Guide_bar">
      <div class="allscore">
        当前总分：
        <span>{{scoreTotal}}</span> 分
      </div>
      <div class="layout-box">
        <div class="layout-top">
          <span>布局</span>
          <span class="layout-edit" @click="modifyLayoutFunc">修改</span>
        </div>
        <div class="layout-bottom">
          <div>{{paperSpec}}</div>
          <div>{{column}}</div>
	        <div>{{asType}}</div>
        </div>
      </div>
      <div class="note">
        <p>注意事项：</p>
        <p>1，输入法切换为半角模式</p>
      </div>
    </div>
    <set-dialog ref="editorLayout" :prop-layout="layouts ? layouts : pageLayout"/>

    <el-dialog title="提示" :visible.sync="openedPrompt" :width="'400px'" :close-on-click-modal="false" center>
      <div class="prompt-info">
        <i class="el-icon-question"></i>修改后将会清空所有手动修改的内容，确定修改吗？
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="closePrompt">取 消</el-button>
        <el-button size="small" type="primary" @click="PromptFunc">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapState,mapMutations} from 'vuex'
import { LAYOUT_COLUMNS,LAYOUT_SIZE, LAYOUT_ASTYPE } from '@/models/base'

import setDialog from './dialog/_setDialog'
export default {
  components: {
    setDialog,
  },
  data () {
    return {
      openedPrompt: false,
      acid:'',
      layouts:{
        paperSpec: 'A3',
        asType: 1,
        column: 3
      }
    }
  },
  computed: {
    ...mapState('pageContent', ['scoreTotal']),
    ...mapState('page', ['pageLayout','pageData']),
    column(){
      let index = LAYOUT_COLUMNS.findIndex(obj => obj.id == this.pageLayout.column)
      if(index > -1){
        return LAYOUT_COLUMNS[index].content
      }return '两栏'
    },

    paperSpec() {
      let index = LAYOUT_SIZE.findIndex(obj => obj.id == this.pageLayout.paperSpec)
      if(index > -1){
        return LAYOUT_SIZE[index].content
      } return 'A3/B4/8K纸'
	},
    asType() {
      let index = LAYOUT_ASTYPE.findIndex(obj => obj.id == this.pageLayout.asType)
      if(index > -1){
        return LAYOUT_ASTYPE[index].content
      } return '先扫后阅(网阅)'
    }
  },
  watch: {
    $route: {
      handler: function() {
        let acid = sessionStorage.getItem('acid')
        if (acid) {
          this.acid = acid
        }
      },
      immediate: true
    },
    
    // $route: {
    //   handler: function(route) {
    //     const query = route.query
    //     // sessionStorage.getItem('acid')
    //     if (query.acid) {
    //       this.acid = query.acid
    //     }
    //   },
    //   immediate: true
    // },
  },

  mounted () {
    if(this.acid == ''){
      this.$refs.editorLayout.openRForm(1)
    }else{
      this.editAnswerSheet()
    }
  },

  methods: {
    ...mapMutations('page', ['reset_pageData','change_isNew','pageLayout_change']),
    ...mapMutations('questionType',['subTopic_calculate_determine','subTopic_number_calculate','subTopic_already_add']),
    ...mapMutations('titleSet',['editTextarea']),

    closePrompt () {
      this.openedPrompt = false
    },

    openPrompt () {
      this.openedPrompt = true
    },

    PromptFunc () {
      this.$refs.editorLayout.openRForm(2)
      this.closePrompt()
      // 编辑后更改标题
      this.editTextarea(this.pageData[0].content.textVal)
      // sessionStorage.setItem('switchtype', true)
    },

    modifyLayoutFunc () {
      // 打开修改弹出框
      this.openPrompt()
    },
    editAnswerSheet() {
      // 编辑答题卡
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      $.get(mfc.getContextPath()+'/as/get/'+this.acid).then((res) => {
        const {data} = res
        if(res.code === 0){
          let obj = JSON.parse(data.content)
          localStorage.setItem('accessToken', JSON.stringify(obj.content))
          this.reset_pageData(obj.content) // 重新赋值
          this.subTopic_calculate_determine(obj.remark)
          this.subTopic_already_add(obj.remark)
          this.change_isNew(obj.IsNew)
          this.pageLayout_change(obj.pageLayout)
          this.layouts = {
            paperSpec: obj.pageLayout.paperSpec,
	          asType: obj.pageLayout.asType,
            column:obj.pageLayout.column
          }
          let slef = this
          setTimeout( () => {
            slef.subTopic_number_calculate()
          },2000);

          loading.close()
        }
      }).catch(function () {
          loading.close()
      });
    }
  },
}
</script>

<style lang="less">
@import "~@/assets/css/variables.less";
.Guide_bar {
  position: fixed;
  left: 7px;
  z-index: 2;
  margin-top: 15px;
  width: 120px;
  .allscore {
    font-size: 14px;
  }
  .layout-box {
    border: 1px solid @main;
    // min-width: 93px;
    background: @white;
    margin-top: 10px;
    // font-size: 14px;
  }
  .layout-top {
    background-color: @font-f7f8;
    padding: 5px 8px;
  }
  .layout-top {
    background-color: @font-f7f8;
    padding: 5px 8px;
  }
  .layout-edit {
    color: @mainFont !important;
    cursor: pointer;
    float: right;
  }
  .layout-bottom {
    background-color: @white;
    padding: 10px 8px;
    line-height: 22px;
  }
}
.note{
  margin-top: 5px;
  color:#f00; 
  font-size: 12px; 
  // width: 100px; 
  background-color: #fff; 
  border: 1px solid #4587E7;
  padding: 5px;
  p{
    margin-top: 0;
  }
}
.prompt-info {
  font-size: 14px;
  i {
    font-size: 16px;
    color: @warning;
    margin-right: 5px;
  }
}
</style>
