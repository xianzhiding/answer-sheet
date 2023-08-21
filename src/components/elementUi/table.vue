<!--表格分页组件 -->
<template v-if="isShowTable">
    <section class="ces-table-page">
        <!-- 数据表格 -->
        <section class="ces-table">
            <el-table ref="cesTable" :data="tabledata" :size="size" :height="theight"
                              v-loading="loading"
                              :border="isBorder"
                              :defaultSelections="defaultSelections"
                              highlight-current-row
                              @current-change="CurrentRowChange"
                              row-class-name="hj-table-row"
                              header-row-class-name="hj-table-th-row"
                              :row-height="rowHeight"
                              v-bind="$attrs" v-on="$listeners">
                <el-table-column v-if="isSelection" type="selection" align="center"></el-table-column>
                <el-table-column v-if="isIndex" type="index" :label="indexlabel" align="center" width="50" :fixed="indexFixed"></el-table-column>
                <!-- 数据栏 -->
                <el-table-column v-for="(item,index) in tablecols"
                  :key="index"
                  :prop="item.prop"
                  :label="item.label"
                  :width="item.width"
                  :min-width="item.minWidth"
                  :align="item.align"
                  :fixed="item.fixed"
                  :sortable="item.sortable"
                  show-overflow-tooltip
                  :render-header="item.require?renderHeader:null"
                  :filters="item.filters ? item.filters : null"
                  :filter-method="item.filterMethod ? item.filterMethod : null"
                  :filter-placement="item.filterPlacement ? item.filterPlacement : null">
                  <template slot-scope="scope">
                    <!-- html -->
                    <span v-if="item.type==='Html'" v-html="item.html(scope.row)" :style="item.itemStyle ? item.itemStyle(scope.row): ''"></span>
                    <!-- 按钮 -->
                    <span v-if="item.type==='Button'">
                      <el-button v-for="(btn,index) in item.btnList"
                        :key="index"
                        v-show="!btn.isShow || (btn.isShow && btn.isShow(scope.row))"
                        :disabled="btn.isDisabled && btn.isDisabled(scope.row)"
                        :type="btn.type"
                        :size="btn.size || size"
                        :icon="btn.icon"
                        @click="btn.handle(scope.row,scope.$index)">{{btn.label}}</el-button>
                    </span>
                    <!-- 文字按钮 -->
                    <span v-if="item.type==='Text'">
                        <el-button v-for="(btn,index) in item.btnList"
                          :key="index"
                          v-show="typeof btn.isShow === 'function' ? btn.isShow(scope.row) : (typeof btn.isShow === 'boolean' ? btn.isShow : (!btn.isShow))"
                          :disabled="btn.isDisabled && btn.isDisabled(scope.row)"
                          type="text"
                          :size="btn.size || size"
                          @click="btn.handle(scope.row)"
                          class="text-btn"
                          v-bind:class="[btn.color]"
                        >{{btn.label}}</el-button>
                    </span>
                    <!-- 输入框 -->
                    <el-input v-if="item.type==='Input'" v-model="scope.row[item.prop]" :size="size"
                      :disabled="btn.isDisabled && btn.isDisabled(scope.row)"
                      @focus="item.focus && item.focus(scope.row)"></el-input>
                    <!-- 下拉框 -->
                    <el-select v-if="item.type==='Select'" v-model="scope.row[item.prop]" :size="size"
                      :props="item.props"
                      :disabled="btn.isDisabled && btn.isDisabled(scope.row)"
                      @change='item.change && item.change(scope.row)'>
                        <el-option v-for="op in item.options" :label="op[item.props.label]"
                          :value="op[item.props.value]" :key="op[item.props.value]"></el-option>
                    </el-select>
                    <!-- 单选 -->
                    <el-radio-group v-if="item.type==='Radio'" v-model="scope.row[item.prop]"
                        :disabled="btn.isDisabled && btn.isDisabled(scope.row)"
                        @change='item.change && item.change(scope.row)'>
                        <el-radio v-for="rad in item.radios" :label="rad.value" :key="rad">{{rad.label}}</el-radio>
                    </el-radio-group>
                    <!-- 复选框 -->
                    <el-checkbox-group v-if="item.type==='Checkbox'" v-model="scope.row[item.prop]"
                      :disabled="btn.isDisabled && btn.isDisabled(scope.row)"
                      @change='item.change && item.change(scope.row)'>
                        <el-checkbox v-for="ra in item.checkboxs" :label="ra.value" :key="ra">{{ra.label}}</el-checkbox>
                    </el-checkbox-group>
                    <!-- 评价 -->
                    <el-rate v-if="item.type==='Rate'" v-model="scope.row[item.prop]"
                      :disabled="btn.isDisabled && btn.isDisabled(scope.row)"
                      @change='item.change && item.change(scope.row)'></el-rate>
                    <!-- 开关 -->
                    <el-switch v-if="item.type==='Switch'" v-model="scope.row[item.prop]"
                      :disabled="btn.isDisabled && btn.isDisabled(scope.row)"
                      @change='item.change && item.change(scope.row)'></el-switch>
                    <!-- 图像 -->
                    <img v-if="item.type==='Image'&&scope.row[item.prop]!==''" :src="scope.row[item.prop]" @click="item.handle && item.handle(scope.row)"/>
                    <!-- 滑块 -->
                    <el-slider v-if="item.type==='Slider'" v-model="scope.row[item.prop]"
                      :disabled="btn.isDisabled && btn.isDisabled(scope.row)"
                      @change='item.change && item.change(scope.row)'></el-slider>
                    <!--表格图片-->
                    <div class="hj-table-image"  v-if="item.type==='tableImage'">
                        <div class="sm-img r-img" v-if="scope.row[item.prop].rImg" @click="item.viewImg(scope.row)">
                            <img :src="scope.row[item.prop].rImg" alt="">
                        </div>
                        <div class="sm-img p-img" v-if="scope.row[item.prop].pImg" @click="item.viewCheckImg(scope.row)">
                            <img :src="scope.row[item.prop].pImg" alt="">
                            <span>待审</span>
                        </div>
                        <div class="sm-btn" v-if="!scope.row[item.prop].rImg && !scope.row[item.prop].pImg">
                            <hj-button v-if="!scope.row[item.prop].denyUpload" type="function" class="add upload-btn" @click="item.uploadViewImg(scope.row)">点击上传</hj-button>
                        </div>
                    </div>
                    <!-- 状态字段 -->
                    <span v-if="item.type==='status'"
                          :class="scope.row[item.prop] === '未通过' ? 'red-status' : scope.row[item.prop] === '已通过' ? 'green-status' : scope.row[item.prop] === '待审核' ? 'orange-status' : ''">{{scope.row[item.prop]}}</span>
                    <!-- 默认 -->
                    <span v-if="!item.type"
                          :style="item.itemStyle ? item.itemStyle(scope.row): ''"
                          :class="{error: resultTable && !scope.row.success}">{{(item.formatter && item.formatter(scope.row)) || scope.row[item.prop]}}</span>
                  </template>
                </el-table-column>
            </el-table>
        </section>
        <!-- 分页 -->
        <section class="ces-pagination" v-if='isPagination'>
            <el-pagination
              class="page-left"
              @current-change="handleCurrentChange"
              @size-change="handleSizeChange"
              layout="total,sizes ,slot"
              :page-sizes="pageSizes"
              :page-size="pagination.pageSize"
              :current-page="pagination.pageNum"
              :total="pagination.total"
              popper-class="hj-page-select">
                <button type="button" :disabled="firstDisabled" @click="jumpPage('first')" class="btn-prev">
                  <i class="el-icon el-icon-d-arrow-left"></i>
                </button>
            </el-pagination>
            <el-pagination
              class="page-right"
              @current-change="handleCurrentChange"
              @size-change="handleSizeChange"
              layout="prev, pager, next,slot,jumper"
              :page-sizes="pageSizes"
              :page-size="pagination.pageSize"
              :current-page="pagination.pageNum"
              :total="pagination.total"
              popper-class="hj-page-select">
                <button type="button" :disabled="lastDisabled" @click="jumpPage('last')" class="btn-next">
                  <i class="el-icon el-icon-d-arrow-right"></i>
                </button>
            </el-pagination>
        </section>

    </section>
</template>

<script>
  import {Pagination, TableColumn, Button, Table} from 'element-ui'
  export default {
    name: "hjTablePagination",
    props: {
      // 表格列配置
      tablecols: {type: Array, default: () => []},
      // 表格型号：mini,medium,small
      size: {type: String, default: 'mini'},
      //表格高度
      theight: {type: Number, default: 500},
      //是否显示表格竖向边框
      isBorder: {type: Boolean, default: true},
      // loading: {type: Boolean, default: false},
      // 是否显示表格复选框
      isSelection: {type: Boolean, default: false},
      defaultSelections: {type: [Array, Object], default: () => null},
      // 是否显示表格索引
      isIndex: {type: Boolean, default: true},
      indexlabel: {type: String, default: '序号'},
      indexFixed: {type: Boolean, default: false},
      // 是否显示分页
      isPagination: {type: Boolean, default: true},

      // 请求数据地址
      url: {type: String, default: ''},
      // 是否显示表格
      isShowTable: {type: Boolean, default: false},
      // 每页显示条数
      pageSizes: {type: Array, default: () => [20, 50, 100]},
      // 数据请求前回调(用于请求前拼装查询条件,返回值必须为重组后的params)
      beforeRequest: {type: Function},
      // 数据请求异常回调
      errorRequest: {type: Function},
      // 数据渲染前回调(返回值必须是重组后的data)
      beforeRender: {type: Function},
      // 数据渲染完回调(返回表格实例)
      afterRender: {type: Function},
      // 行高,为计算显示区域
      rowHeight: {
        type: Number,
        default: 30
      },
      resultTable: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        // 表格数据
        tabledata: [],
        loading: false,
        firstDisabled: false,
        lastDisabled: false,
        // 分页数据
        pagination: {pageSize: 50, pageNum: 1, total: 0},
      }
    },
    watch: {
      'defaultSelections'(val) {
          this.$nextTick(function () {
              if (Array.isArray(val)) {
                val.forEach(row => {
                this.$refs.cesTable.toggleRowSelection(row)
                })
              } else {
                this.$refs.cesTable.toggleRowSelection(val)
              }
          })
      },
      pagination: {
        handler(newValue) {
          this.firstDisabled = newValue.pageNum <= 1
          let lastPage = newValue.total % newValue.pageSize > 0 ? Math.ceil(newValue.total / newValue.pageSize) : newValue.total / newValue.pageSize
          this.lastDisabled = newValue.pageNum >= lastPage
        },
        deep: true
      }
    },
    methods: {
        CurrentRowChange(val) {
          this.currentRow = val;
        },
        // 分页
        // 显示第几页
        handleCurrentChange(val) {
          this.pagination.pageNum = val;
          this.getTableData(this.pagination.pageSize, val);
          this.$nextTick(()=>{
            this.$refs.cesTable.bodyWrapper.scrollTop = 0;
            this.$refs.cesTable.bodyWrapper.scrollLeft = 0;
          })
        },
        clearSelection(){
          this.$refs.cesTable.clearSelection()
        },
        // 每页显示的条数
        handleSizeChange(val) {
          this.pagination.pageSize = val;
          // 在改变每页显示的条数时，要将页码显示到第一页
          this.pagination.pageNum = 1;
          this.getTableData(val, 1);
        },
        // 向后台传递分页信息，请求表格数据:pageSize每页显示的条数;pageNum显示第几页
        getTableData(pageSize, pageNum,parameter) {
          this.loading = true
          if(parameter == 'get'){
              var data = {
                pageIndex: pageNum,
                pageSize: pageSize,
              }
              if(typeof this.beforeRequest === 'function'){
                data = this.beforeRequest(data)
              }
              let Arr = {
                dptId:data.data.dptId, name: data.data.name
              }
              this.$fetch(this.url, Arr, true).then(response => {
                  let data = response;
                  if (typeof this.beforeRender === 'function') {
                    data = this.beforeRender(data)
                  }
                  this.tabledata = data.datas

                  this.pagination.total = data.recordCount
                  if (typeof this.afterRender === 'function') {
                    this.$nextTick(function () {
                      this.afterRender(this.$refs.cesTable)
                    })
                  }
                  this.$nextTick(function () {
                    this.$refs.cesTable.scrollTop = 0

                  })
                  this.loading = false
              }).catch(error => {
                this.loading = false
                if (typeof this.errorRequest === 'function') {
                    this.errorRequest(error)
                }
              })
          }else{
            let data = {
              pageIndex: pageNum,
              pageSize: pageSize,
            }
            if(typeof this.beforeRequest === 'function'){
              data = this.beforeRequest(data)
            }
            this.$post(this.url, data, true).then(response => {
              let data = response;

              if (typeof this.beforeRender === 'function') {
                  data = this.beforeRender(data)
              }
              this.tabledata = data.datas

              this.pagination.total = data.recordCount
              if (typeof this.afterRender === 'function') {
                  this.$nextTick(function () {
                      this.afterRender(this.$refs.cesTable)
                  })
              }
              this.$nextTick(function () {
                  this.$refs.cesTable.scrollTop = 0

              })
              this.loading = false
            }).catch(error => {
              this.loading = false
              if (typeof this.errorRequest === 'function') {
                  this.errorRequest(error)
              }
            })
          }
        },
        renderHeader(h, obj) {
          return h('span', {class: 'ces-table-require'}, obj.column.label)
        },
        jumpPage(page) {
          switch (page) {
            case 'first':
              page = 1
              break
            case 'last':
              page = this.pagination.total % this.pagination.pageSize > 0 ? Math.ceil(this.pagination.total / this.pagination.pageSize) : this.pagination.total / this.pagination.pageSize
              break
          }
          this.pagination.pageNum = page
          this.getTableData(this.pagination.pageSize, page)
        }
    },
    mounted() {

    },
    components: {
      elTableColumn: TableColumn,
      elPagination: Pagination,
      elButton: Button,
      elTable: Table
    }
  }
</script>
