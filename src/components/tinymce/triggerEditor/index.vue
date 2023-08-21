<template>
  <section :id="'tinymce_'+ editorId"
  >
    <!-- <slot></slot> -->
  </section>
</template>

<script>
  import '../tinymce.min.js'
  import '../themes/silver/theme.min.js'
  import '../langs/zh_CN.js'
  import '../icons/default/icons.min.js'
  import '../plugins/image/plugin.min.js'
  import '../plugins/imagetools/plugin.min.js'
  import '../plugins/charmap/plugin.min.js'
  import '../plugins/code/plugin.min.js'
  import '../plugins/lineheight/plugin.min.js'
  import '../plugins/paste/plugin.min.js'
  import '../plugins/powerpaste/plugin.min.js'
  import '../plugins/kityformula-editor/plugin.min.js'
  // import '../plugins/tiny_mce_wiris/plugin.min.js'
  // import '../plugins/wiris/mathtype-tinymce5/plugin.min.js'
  export default {
    props: {
      html:{
        type: String,
        default: ''
      },

      readonly: {
        type: Number,
        default: 0
      }
    },

    model: {
        prop : 'html',
        event: 'text-changed' // 编辑器的内容发生变化后触发, 参数为编辑的 HTML
    },

    data() {
      return {
        editor: null,
        toolbar:'fontsizeselect lineheight undo redo bold italic underline underscoreButton indent outdent superscript subscript alignleft aligncenter alignright removeformat charmap code image paste tiny_mce_wiris_formulaEditor tiny_mce_wiris_formulaEditorChemistry',
        uploadMode : 0,
        editorId:new Date().getTime(),
        obj:{}
      }
    },
    beforeDestroy() {
      // 销毁编辑器
      // this.editor.remove();
    },
    watch: {
      html:{
        immediate: true,
        handler () {
          if(this.editor){
            this.editor.setContent(this.html)
          }
        }
      }
    },
    mounted() {
      this.initTiny()
    },
    methods: {
      initTiny(){
        const self = this
        tinymce.init({
          selector:`#tinymce_${this.editorId}`,
          height: 400,
          readonly:this.readonly,
          inline:true,
          toolbar: this.toolbar,
          fontsize_formats: '11px 12px 14px 16px 18px',
          plugins: 'image charmap paste lineheight tiny_mce_wiris',
          external_plugins: {
            'tiny_mce_wiris' : 'https://www.moofen.net/assets/mathType/wiris/mathtype-tinymce5/plugin.min.js'
          },
          advlist_bullet_styles: "circle, square",
          content_style: "img {max-width:100%;}",
          autoresize_max_height: 20,
          language: 'zh_CN',
          content_css: false,
          // auto_focus: true,
          menubar: false,
          paste_data_images: true,
          images_file_types: 'jpeg,jpg,png,gif,bmp,webp',
          paste_enable_default_filters: true,
          paste_word_valid_elements: "table[width],tr,td[colspan|rowspan|width],th[colspan|rowspan|width],thead,tfoot,tbody,h1,h2,h3,h4,h5,img,p",
          paste_auto_cleanup_on_paste : true,
          paste_remove_styles: true,
          paste_remove_styles_if_webkit: true,
          paste_strip_class_attributes: true,
          paste_retain_style_properties: "color",
          paste_webkit_styles: "color",
          paste_convert_word_fake_lists: false,
          paste_merge_formats: true,
          lineheight_formats : '1 1.5 2 2.5',
          paste_postprocess: function(plugin, args) {
            args.node.childNodes.forEach(item => {
              // item.setAttribute('class','question_line')
              // item.removeAttribute('style')
              args.content = item.childNodes
            })
          },
          setup: function(editor) {
            // 创建工具栏按钮
            // 添加上传图片按钮
            editor.ui.registry.addButton('image', { icon: 'image', title: '插入图片', onclick: () => {
            } });

            // 编辑器内容发生变化后更新 html 的内容
            editor.on('blur', (e) => {
              let obj = {
                val:editor.getContent(),
                tinyHeight:document.getElementById(e.target.id).offsetHeight,
                tinyId:e.target.id
              }
              // 判断是否使用了公式插件
              let wrs_stack = document.querySelectorAll("div.wrs_stack")
              if(wrs_stack.length <= 0){
                self.$emit('tinymce-change', obj)
              }
            })
            /* underscore button that just inserts the date  自动添加下划线 */
            editor.ui.registry.addButton('underscoreButton', {
              icon: 'straight-line',
              tooltip: '自动添加下划线',
              onAction: () => {
                editor.insertContent('<span style="text-decoration: underline">&ensp;&ensp;&ensp;&ensp;</span>');
              }
            });
            // 注册一个工具栏按钮名称
            editor.ui.registry.addButton('tiny_mce_wiris', {
              tooltip: '公式插件',
              onAction: function () {

              }
            });
          },
          images_upload_handler (blobInfo, success, failure){
            var file = blobInfo.blob();
            let formData = new FormData()
            formData.append('file',file, file.name)
            // formData.append('mediaDir','web/dist')
            let url = mfc.getContextPath() + '/as/image/upload'
            $.ajax({
              url : url,
              type : 'POST',
              cache : false,
              data : formData,
              processData : false,
              contentType : false,
              success : function(s) {
                success(s.data)
              },
              error : function(e) {
                failure('上传失败！')
              }
            });
          }
        }).then(editors => {
          // let ele = document.querySelector('#tinymce_'+ this.editorId)
          setTimeout(() => {
            this.editor = editors[0]
            this.editor.setContent(this.html)
          }, 1000);
          // if(ele){
          //   ele.innerHTML = this.html
          // }
        })
      },
      editorHtml(){
        if(this.editor){
          // console.log(document.querySelector('#tinymce_'+ this.editorId));
          // console.log('editor',this.editor);
          this.editor.setContent(this.html)
        }
      },
    },
  }
</script>

<style lang="less">
  @import url('../skins/ui/oxide/skin.min.css');
  @import url('../skins/ui/oxide/content.min.css');
  .tox {
    .tox-tbtn--bespoke{
      .tox-tbtn__select-label{
        width: 4em;
      }
    }
    .tox-tbtn{
      height: 30px;
    }
    .tox-toolbar__group{
      height: 30px;
      border-bottom: 1px solid #ddd;
    }
  }
  .rich-text {
      // 微调 Full featured 的编辑器阴影, 工具栏阴影
      .mce-tinymce {
          box-shadow: 0 0px 1px rgba(0, 0, 0, 0.25);

          .mce-top-part::before {
              box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
          }
      }

      // inline 模式的边框和得到焦点的样式
      .mce-content-body {
          padding: 8px;
          border: 1px solid #DDD;
          border-radius: 3px;

          &.mce-edit-focus {
              outline: none;
              border-color: #47a4f5;
              box-shadow: 2px 2px 3px rgba(0, 0, 0, 0.1) inset;
          }
      }

      .mce-notification {
          display: none;
      }
  }

  // 工具栏样式: 缩小字体, 修改按钮的 hover 背景色等
  .mce-panel {
      border: none !important;

      .mce-toolbar .mce-btn-group {
          padding: 0;

          &:not(:first-child) {
              margin-left: 0;
          }

          .mce-btn {
              margin-left: 0;

              &:hover {
                  border-color: transparent;
                  background: #808695;
                  color: white;

                  .mce-ico, button {
                      color: white;
                  }
              }

              .mce-ico {
                  font-size: 14px;
              }
          }
      }
  }
</style>