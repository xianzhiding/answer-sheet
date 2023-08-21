<template>
  <section>
    <el-table
      :data="tableData"
      :element-loading-text="loadingText"
      :border="isBorder"
      :height="autoHeight ? null : height_table + singleHeight"
      :max-height="maxHeight ? maxHeight : null"

      element-loading-spinner="el-icon-loading"
      v-loading="loading"
      :row-style="{'height': rowStyle + 'px'}"
    >
      <!-- 标题栏- 合并 -->
      <el-table-column v-if="isSelection" type="selection" align="center"></el-table-column>
      <el-table-column v-if="isIndex" type="index" :label="indexlabel" align="center" width="50" :fixed="indexFixed"></el-table-column>
      <singleColumn
        v-for="(column,i) in tablecols"
        :key="i+Math.random()"
        :column="column"
        @hanlde-pop-func="hanldePopFunc"
      />
      <!-- 标题栏- 合并 -->
    </el-table>
    <!-- 分页 -->
      <section class="ces-pagination" v-if='isPagination'>
        <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        layout="total, sizes, prev, pager, next, jumper"
        :page-sizes="pageSizes"
        :page-size="pagination.pageSize"
        :current-page="pagination.pageNum"
        :total="pagination.total"
        >
        </el-pagination>
      </section>
  </section>
</template>

<script>
  import singleColumn from './singleColumn'
  export default {
    components: {
      singleColumn,
    },
    props: {
      differenceHeight:{type: Number, default: 11},
      autoHeight: {
          type: Boolean,
          default: false
      },
      rowStyle:{
        Number,
        default: 35
      },

      theight: {type: Number, default: 500},
      maxHeight:{type: Number, default: 0},
      // 表格列配置
      tablecols: {type: Array, default: () => []},
      tableData: {type: Array, default: () => []},
      // 是否显示表格索引
      isIndex: {type: Boolean, default: true},
      // 是否显示表格复选框
      isSelection: {type: Boolean, default: false},
      indexlabel: {type: String, default: '序号'},
      indexFixed: {type: Boolean, default: false},
      // 是否显示分页
      isPagination: {type: Boolean, default: true},
      // 每页显示条数
      pageSizes: {type: Array, default: () => [15,20,30,50,100]},
      currentPage:{type: Number, default: 4},
      // 行高,为计算显示区域
      rowHeight: {
        type: Number,
        default: 30
      },
      //是否显示表格竖向边框
      isBorder: {type: Boolean, default: true},
      loading:{
        type:Boolean,
        default: false
      },
      loadingText:{
        type:String,
        default:'拼命加载中'
      },
      pagination: {type: Object, default: () => ({
        pageSize: 15,
        pageNum: 1,
        total: 0
      })},
      singleHeight:{
        Number,
        default: 0
      }
    },
    data() {
      return {
        // 分页数据
        height_table:500,
      }
    },

    watch: {
      theight: {
        immediate: true,
        handler () {
          this.height_table = this.theight
        }
      },
    },

    methods: {
      // 显示第几页
      handleCurrentChange(val) {
        this.$emit('handle-current-change',val)
      },
      // 每页显示的条数
      handleSizeChange(val) {
        this.$emit('handle-size-change',val)
      },

      hanldePopFunc(row){
        // 弹出框分数
        this.$emit('hanlde-pop-func',row)
      }

    },
  }
</script>

<style lang="less">
  @import '~@/assets/css/variables.less';

  .el-table .ascending .sort-caret.ascending{
    border-bottom-color:@main
  }
  .el-table {
    .descending {
      .sort-caret{
        &.descending{
          border-top-color:@main
        }
      }
    }
    .caret-wrapper{
      width: 17px;
    }
    .cell.el-tooltip{
      height:100%;
    }
  }

  // table分页
  .el-pagination{
    margin-top: 15px;
  }
  .el-pagination__sizes{
    .el-input{
      .el-input__inner{
        &:hover{
          border-color:@main
        }
      }
    }
  }
  .el-select-dropdown__item{
    &.selected{
      color:@main
    }
  }
  .el-pager{
    li{
      &:hover,
      &.active{
        color:@main;
        background-color: @main;
        color: @white;
      }
      background: @font-f4f5;
      margin: 0 4px;
      border-radius: 4px;
      padding: 0 0;
      color:@font-888;
      font-size: 13px;
      min-width: 30.5px;
      font-weight: 500;
    }
  }
  .el-pagination__editor{
    &.el-input{
      .el-input__inner{
        font-size: 14px;
      }
    }
  }

  .el-loading-spinner{
    i{
      color:@main
    }
    .el-loading-text{
      color:@main
    }
  }

  .el-table tbody tr:hover>td {
    background-color:@mainHover !important
  }

  .el-table--medium td, .el-table--medium th{
    padding: 0 0;
  }

  .el-table{
    td,
    th{
      padding: 0 0;
    }

    .cell{
      line-height: inherit;
    }
  }

  table tr td div:last-child{
    margin-bottom: 0;
  }

  .el-button--medium.text_button{
    padding: 0 0;
  }
  /* 解决 el-table fixed 高度不对的问题 */
.el-table td.is-hidden>* {
  visibility: visible !important;
}

.box-card .el-table__fixed-left{
  height: 100% !important;
}
.el-table__fixed-body-wrapper{
  overflow: auto;
}


.el-pagination{
  margin-top: 10px;
}
.el_table_wapper section>div .el-table__fixed{
  background: #fff;
}
.el-table th.gutter{
  display: table-cell!important;
}

button.el-button.el-button--default.el-button--medium.pop_Btn{
  background-color: transparent !important;
  font-size:14px;
  &:hover{
      color: @main !important;
      border-color: transparent !important;
      background-color: transparent !important;
  }
}
.el-button--text:focus{
  color: @main !important;
}
</style>