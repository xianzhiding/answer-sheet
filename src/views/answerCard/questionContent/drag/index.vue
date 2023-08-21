<template>
  <div
    class="question-item"
    :style="{
      height: contentHeight + 'px'
    }"
  >
    <div class="question-container">
      <slot></slot>
    </div>
    <div
      class="question-resize-mask"
      v-if="moved"
      :style="{
        height: maskHeight + 'px'
      }"
    />
    <div
      class="question-handler"
      v-if="!previewIs"
      :style="{
        top: contentHeight - 23 + 'px'
      }"
      ref="resizeHandler"
      @mousedown="handleResizeStart"
    >
      <svg t="1602238763767" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1305" width="32" height="32"><path d="M192 368h416v32H192zM192 496h416v32H192zM192 624h416v32H192z" fill="#4587e7" p-id="1306"></path><path d="M736 320h96L704 192 576 320h96v384h-96l128 128 128-128h-96z" fill="#4587e7" p-id="1307"></path></svg>
    </div>
    <div class="step-page" v-if="isStepPage">松开鼠标后，题目区将会跨栏</div>
  </div>
</template>

<script>
export default {
  props: {
    question: {
      type: Object,
      required: true
    },
    previewIs: {
      type: Boolean,
      default: false
    },
  },

  data () {
    return {
      height: this.question.height,
      maskHeight: this.question.first ? this.question.castHeight - this.question.heightTitle - this.question.marginHeight : this.question.castHeight,
      iconHeight: 23,
      startPos: null,
      movementX: null,
      moved: false,
      data: JSON.parse(JSON.stringify(this.question)),
      isStepPage: false
    }
  },

  computed: {
    contentHeight() {
      const {first,castHeight,heightTitle, marginHeight, segmented} = this.question
      return first&&!segmented ? castHeight - heightTitle - marginHeight : castHeight
    },

    minHeight() {
      const { first, showData,editorContent,segmented,rowHeight,heightTitle, height,  castHeight, marginHeight,rows,rowHeightArr,questionType} = this.question
      const {HorizontalLine} = this.question.content
      let heights = 0
      switch (questionType) {
        case 'compositionEnglish':
            heights = castHeight + 7
          break;
        default:
            if(editorContent[segmented] == undefined){
              if(showData && showData.length){
                heights =  showData.length * rowHeight + 7
              }else{
                // height = rows * rowHeight + 7
                heights = castHeight + 7
              }
            }else{
              if(HorizontalLine || questionType =='FillInTheBlank'){
                // let currentTinymceArr = this.convertArray_p(editorContent[segmented])
                if(rowHeightArr[segmented].length){
                  rowHeightArr[segmented].forEach(val =>{
                    heights += val
                  })
                  heights +=  7
                }else{
                  // height = currentTinymceArr.length * rowHeight + 7
                  heights = castHeight + 7
                }
              }else{
               if(first){
                //  heights = heightTitle + marginHeight + rowHeight + 7
                 heights = rowHeight + 7
               }else{
                heights = 0
               }
              }
            }
            /* if(editorContent[segmented] == undefined){
              if(showData && showData.length){
                height =  showData.length * rowHeight + 7
              }else{
                height = rows * rowHeight + 7
              }
            }else{
              let currentTinymceArr = this.convertArray_p(editorContent[segmented])
              if(rowHeightArr[segmented].length){
                rowHeightArr[segmented].forEach(val =>{
                  height += val
                })
                height +=  7
              }else{
                height = currentTinymceArr.length * rowHeight + 7
              }
            } */
          break;
      }
      return heights
    },

  },

  watch: {
    'question.height': {
      handler () {
        this.height = this.question.height
      }
    },
    question(){
      this.maskHeight= this.question.first ? this.question.castHeight - this.question.heightTitle - this.question.marginHeight : this.question.castHeight
    }
  },

  created () {
    this.handleResizeFunc = this.handleResize.bind(this)
    this.handleResizeEndFunc = this.handleResizeEnd.bind(this)
  },

  methods: {
    handleResizeStart (event) {
      this.startPos = event.clientY
      this.movementX = event.movementX
      document.body.addEventListener('mousemove', this.handleResizeFunc, false)
      document.body.addEventListener('mouseup', this.handleResizeEndFunc, false)
    },

    handleResize (event) {
      const {first,heightTitle,height,castHeight, marginHeight, isLast, lastTotalHeight} = this.question
      this.moved = true
      const deltaY = event.clientY - this.startPos
      // 最小高度为40，可以修改这个最小值
      // this.height = (first ? (castHeight - heightTitle - marginHeight)  + deltaY : castHeight + deltaY) < this.minHeight ?
      //   first ? height - castHeight + this.minHeight  : height - castHeight - heightTitle - marginHeight + this.minHeight
      //   : height + deltaY
      // this.maskHeight = Math.max( first ? (castHeight - heightTitle - marginHeight)  + deltaY : castHeight + deltaY, this.minHeight)
      this.height = this.movementX ? height - deltaY : (height + deltaY) < this.minHeight ? this.minHeight : height + deltaY
      this.maskHeight = first ? Math.max( (castHeight - heightTitle - marginHeight)  + deltaY, this.minHeight) : castHeight + deltaY
      if(isLast){
        if(lastTotalHeight + deltaY>1015){
          this.isStepPage = true
        }else{
          this.isStepPage = false
        }
      }
    },

    handleResizeEnd () {
      document.body.removeEventListener('mouseup', this.handleResizeEndFunc, false)
      document.body.removeEventListener('mousemove', this.handleResizeFunc, false)
      this.startPos = null
      if (!this.moved) return
      this.moved = false
      let curHeight = this.height < this.question.height ? this.height +  this.question.heightTitle +  this.question.marginHeight : this.height
      this.$emit('height-resize', curHeight)
      this.isStepPage = false
      // this.$emit('height-resize', height)

    },

  }
}
</script>

<style lang="less" scoped>
.question-item {
  position: relative;
  border: 1px solid #000;
  // border-top-color: #000;
  // border-bottom-color: #000;
  // border-left: 1px solid #888;
  // border-right: 1px solid #888;
  user-select: none;

  .question-resize-mask {
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    background-color: rgba(69, 135, 231, 0.5);
    z-index: 999;
  }

  // 控制块，可以自行定义其样式(主要定制其高宽，颜色，及其里面的元素)
  .question-handler {
    position: absolute;
    top: 0;
    right: 5px;
    width: 18px;
    height: 18px;
    background-color: transparent;
    visibility: hidden;
    cursor: n-resize;
    z-index: 999;

    svg{
      width: 120%;
      height: 120%;
    }
  }
  &:hover{
    .question-handler{
      visibility: visible;
    }
    .mce-edit-focus{
box-shadow: inset 2px 2px 0px #4587e7, inset -2px -4px 0px #4587e7;
    }
  }
  .mce-content-body{
    outline: none;
  }
}
.step-page{
color: #f00; border: 1px solid #f00; border-radius: 10px;position: absolute;bottom: -40px;left: 0; padding: 2px;z-index: 1;background-color: #fff;
}
</style>

