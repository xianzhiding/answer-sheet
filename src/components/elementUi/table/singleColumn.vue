<template>

  <el-table-column
    v-if="!column.childen"
    :prop="column.prop"
    :label="column.label"
    :width="column.width"
    :min-width="column.minWidth"
    :align="column.align"
    :fixed="column.fixed"
    :sortable="column.sortable"
    show-overflow-tooltip
    :render-header="column.require?renderHeader:null"
    :filters="column.filters ? column.filters : null"
    :filter-method="column.filterMethod ? column.filterMethod : null"
    :filter-placement="column.filterPlacement ? column.filterPlacement : null">
      <template slot-scope="scope">
        <span
          v-if="column.type==='Html'"
          v-html="columnHtml(scope.row,column.prop)"
          :class="font_colorT(scope.row,column.prop)"
        >{{column.prop}}</span>
        <el-button
          v-if="column.type==='Text'"
          type="text"
          @click="hanldeJump(scope.row,column)"
          :class="[{'text_button':scope.row[prop] != undefined || scope.row[prop] != '',},font_colorT(scope.row,column.prop)]"
          v-html="columnHtml(scope.row,column.prop)"
        >{{column.prop}}</el-button>

        <!-- 排序操作区域 -->
        <template v-if="column.type==='iconRank'">
          <span
            v-for="(icon,i) in  column.iconList"
            :key="i"
            v-html="columnIcon(scope.row,icon.beforeIcon,icon.afterIcon,icon.unit)"
          >  </span>
        </template>

        <!-- 操作区域 -->
        <template
          v-if="column.type==='operateBtn'"
        >
          <el-button
            v-for="(btn,i) in  column.btnList"
            :key="i"
            :disabled="btn.isDisabled && btn.isDisabled(scope.row)"
            :type="btn.type"
            :size="btn.size || size"
            :icon="btn.icon"
            class="btn_column"
            :class="font_operateBtn(scope.row,column)"
            @click="btn.handle(scope.row,scope.$index)"
          >
            <template v-if="scope.row.scale == '0%' || scope.row.tscore == '缺考'"> -- </template>
            <template v-else>{{btn.label}}</template>
          </el-button>
        </template>

        <template v-if="column.type ==='pop_Btn'">
          <el-button
            v-for="(btn,i) in  column.btnList"
            :key="i"
            :disabled="btn.isDisabled && btn.isDisabled(scope.row)"
            :type="btn.type"
            :size="btn.size || size"
            :icon="btn.icon"
            v-html="columnHtml(scope.row,column.prop)"
            class="pop_Btn"
            :class="font_colorT(scope.row,column.prop)"
            @click="btn.handle(scope.row,column)"
          >{{column.prop}}</el-button>
        </template>

      </template>
    </el-table-column>

  <!-- 合并行 -->
  <el-table-column
    v-else
    :label="column.label"
    :align="column.align"
  >
    <template
      v-for="(ele,index) in column.childen"
    >
      <el-table-column
      :key="`${i}_${index}`"
      :prop="ele.prop"
      :label="ele.label"
      :width="ele.width"
      :min-width="ele.minWidth"
      :align="ele.align"
      :fixed="ele.fixed"
      :sortable="ele.sortable"
      show-overflow-tooltip
      :render-header="ele.require?renderHeader:null"
      :filters="ele.filters ? ele.filters : null"
      :filter-method="ele.filterMethod ? ele.filterMethod : null"
      :filter-placement="ele.filterPlacement ? ele.filterPlacement : null">
      <template slot-scope="scope">
        <template v-if="ele.fontSize">
          <span
            v-if="ele.type==='Html'"
            v-html="columnHtml(scope.row,ele.prop)"
            :class="[classFun(scope.row,ele),font_colorT(scope.row,column.prop)]"
          >{{ele.prop}}</span>

        </template>
        <template v-else>
          <span
            v-if="ele.type==='Html'"
            v-html="columnHtml(scope.row,ele.prop)"
            :class="font_colorT(scope.row,ele.prop)"
          >{{ele.prop}}</span>
        </template>
        <template v-if="ele.type ==='Text' && ele.url != undefind">
          <el-button
            type="text" class="text_button"
            v-html="columnHtml(scope.row,ele.prop)"
            @click="hanldeJump(scope.row,ele)"
            :class="font_colorT(scope.row,ele.prop)"
          >{{ele.prop}}</el-button>
        </template>
        <template v-else-if="ele.type ==='Text'">
          <el-button
            type="text" class="text_button"
            v-html="columnHtml(scope.row,ele.prop)"
            :class="font_colorT(scope.row,ele.prop)"
          >{{ele.prop}}</el-button>
        </template>

        <template v-if="ele.type ==='popBtn'">
          <el-button
            type="text" class="text_button"
            v-html="columnHtml(scope.row,ele.prop)"
            :class="font_colorT(scope.row,ele.prop)"
            @click="hanldePopFunc(scope.row,ele)"
          >{{ele.prop}}</el-button>
        </template>

        <template v-if="ele.type ==='pop_Btn'">
          <el-button
            v-for="(btn,i) in  ele.btnList"
            :key="i"
            :disabled="btn.isDisabled && btn.isDisabled(scope.row)"
            :type="btn.type"
            :size="btn.size || size"
            :icon="btn.icon"
            v-html="columnHtml(scope.row,ele.prop)"
            class="pop_Btn"
            :class="font_colorT(scope.row,ele.prop)"
            @click="btn.handle(scope.row,ele)"
          >{{ele.prop}}</el-button>
        </template>

        <template v-if="ele.type ==='Jump'">
          <el-button
            v-for="(btn,i) in  ele.btnList"
            :key="i"
            :disabled="btn.isDisabled && btn.isDisabled(scope.row)"
            :type="btn.type"
            :size="btn.size || size"
            :icon="btn.icon"
            class="pop_Btn"
            v-html="columnHtml(scope.row,ele.prop)"
            :class="font_colorT(scope.row,ele.prop)"
            @click="btn.handle(scope.row,ele)"
          >{{ele.prop}}</el-button>
        </template>

        <!-- @click="hanlde" -->
      </template>
      </el-table-column>
    </template>
  </el-table-column>
</template>

<script>
  export default {
    props: {
      column: {
        type: Object,
        default: ()=> {}
      },
      isShow:{
        type: String,
        default: ''
      }
    },

    data() {
      return {
        columnHtml: (row,prop) => {

          return row[prop]  == null ? '--' : row[prop]
        },
        classFun: (row,prop) => {
          let classStr = ''
          let noClick = ' '
          if(prop.typeIndex == '1'){
            classStr = Number(prop.fullScore) <= Number(row[prop.prop]) ? 'correct' : 'error'
          }else if(prop.typeIndex == '0'){
            classStr = Number(prop.fullScore) <= Number(row[prop.prop]) ? 'correct' : 'error'
          }

          noClick = row[prop]  == null ? ' noClick' : ''
          return classStr + noClick
        },
        font_colorT: (row,prop) => {
          return row[prop]  == null ? 'transparent' : row[prop] == 0 ? 'zero_style' : row.totalscore == '缺考' ? 'missed_exam' : ''
        },

        font_operateBtn:(row)=>{
          return row.scale == '0%' || row.tscore == '缺考' ? 'font_operateBtn' : ''
        },

        columnIcon:(row,beforeIcon,afterIcon,unit) => {
          let classStr = row[afterIcon] > 0 ? 'el-icon-top' : 'el-icon-bottom'
          return row[beforeIcon]  == null && row[afterIcon] == null ? `--` :
                  `<span class="icon_span left">${row[beforeIcon] == null ? '--' : row[beforeIcon] }</span> <i class="columnIcon ${classStr}"></i> <span class="icon_span right">${row[afterIcon] == null ? '--' : row[afterIcon]}</span> ${unit}`
        },
      }
    },

    methods: {

      hanldeJump(row,parameter){
        let tsid = row.tsid
        if(row.jump == 1){
          if(parameter.subject){
            tsid = row['tsid_'+ parameter.subject]
          }

          if(row.totalscore != '缺考'){
            window.open(`${parameter.url}?tid=${row.tid}&tsid=${tsid}&tnumber=${row.tnumber}`)
          }
        }
      },

      hanldePopFunc(row,ele){
        // 弹出框分数
        let obj = {}
        if(ele.asid){
          obj = {
            asid:ele.asid
          }
        }
        if(row.tqid){
          obj = {
            tqid:row.tqid,
            type:ele.type_p
          }
        }

        if(ele.p_name){
          obj = {
            segmentName:ele.p_name,
            step:ele.p_step,
            type:ele.p_type,
          }
        }

        if(ele.p_rank){
          obj = {
            rankName:ele.p_rank,
            type:ele.p_type,
          }
        }
        let cid = row.cid

        if(ele.classObj){
          cid = row['cid_'+ ele.classObj]
        }

        if(row.scid){ // 学校id
          obj = {
            scid:row.scid,
            asid:ele.asid
          }
        }

        this.$emit('hanlde-pop-func',{
          tid:ele.tid,
          tsid:ele.tsid,
          cid:cid,
          ...obj
        })
      }
    },
  }
</script>

<style lang="less" >
  @import '~@/assets/css/variables.less';
  .el-button--medium.text_button{
    width:auto;
    padding: 0 15px;
    height:auto;
    line-height:28px;
    font-size:14px;
    position: relative;
    top: -1px;
  }
  .el-button--text{
    color:@main
  }
  span.correct{
    color:@main
  }
  span.error{
    color:@error
  }
  .el-button--medium.text_button.transparent{
    color: @font-909;
    &:hover{
      color: @font-909
    }
  }

  button.el-button.btn_column.el-button--default.el-button--medium{
    height: 28px;
    line-height: 28px;
    margin: 0;
    border: none;
    background: @bc_tr;
    margin-bottom: 5px;
    color: @main;
  }
  i.columnIcon.el-icon-top{
    color:@main;
  }
  i.columnIcon.el-icon-bottom{
    color:@error;
  }
  span.icon_span {
    display: inline-block;
    min-width: 32px;
    &.left{
      text-align:right
    }
    &.right{
      text-align:left
    }
  }
  .el-table th, .el-table tr th {
    height: 35px;
  }
  button.el-button.el-button--default.el-button--medium.pop_Btn{
    border: none;
    margin: 0;
    text-align: center;
    width: auto;
    padding: 0 10px;
    height: 28px;
    line-height: 28px;
    color: @main;
  }
  button.el-button.pop_Btn.el-button--default.el-button--medium.transparent {
    cursor: text;
    color: @font-888;
    &:hover{
      background-color: transparent !important;
      color: @font-888 !important;
    }
  }
  button.el-button.el-button--text.el-button--medium.text_button.missed_exam {
    cursor: text;
    color: @font-888;
    &:hover{
      color: @font-888 !important;
    }
  }
</style>