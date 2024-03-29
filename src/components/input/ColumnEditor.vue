<template>
  <Toolbar
    :editor="editor"
    :defaultConfig="toolbarConfig"
    :mode="mode"
  />
  <Editor
    style="height: 100%;min-height: 500px; overflow-y: hidden;"
    v-model="valueHtml"
    :defaultConfig="editorConfig"
    :mode="mode"
    @onCreated="handleCreated"
    @onChange="$emit('onChange')"
  />
</template>

<script>
  import '@wangeditor/editor/dist/css/style.css'
  import Snackbar from "@varlet/ui/es/snackbar";
  import {Editor, Toolbar} from '@wangeditor/editor-for-vue'

  export default {
    name: "ColumnEditor",
    components: {
      Toolbar,
      Editor,
    },
    emits: ["onChange"],
    data() {
      return {
        editor: null,
        valueHtml: "",
        toolbarConfig: {
          toolbarKeys: [
            "headerSelect",
            "color",
            "bold",
            {
              "key": "group-justify",
              "title": "对齐",
              "iconSvg": "<svg viewBox=\"0 0 1024 1024\"><path d=\"M768 793.6v102.4H51.2v-102.4h716.8z m204.8-230.4v102.4H51.2v-102.4h921.6z m-204.8-230.4v102.4H51.2v-102.4h716.8zM972.8 102.4v102.4H51.2V102.4h921.6z\"></path></svg>",
              "menuKeys": [
                "justifyLeft",
                "justifyRight",
                "justifyCenter",
              ]
            },
            "insertLink",
            {
              "key": "group-image",
              "title": "图片",
              "iconSvg": "<svg viewBox=\"0 0 1024 1024\"><path d=\"M959.877 128l0.123 0.123v767.775l-0.123 0.122H64.102l-0.122-0.122V128.123l0.122-0.123h895.775zM960 64H64C28.795 64 0 92.795 0 128v768c0 35.205 28.795 64 64 64h896c35.205 0 64-28.795 64-64V128c0-35.205-28.795-64-64-64zM832 288.01c0 53.023-42.988 96.01-96.01 96.01s-96.01-42.987-96.01-96.01S682.967 192 735.99 192 832 234.988 832 288.01zM896 832H128V704l224.01-384 256 320h64l224.01-192z\"></path></svg>",
              "menuKeys": [
                "insertImage",
                "uploadImage"
              ]
            },
            "insertTable",
            "divider",
            "undo",
            "redo",
            "fullScreen",
            "clearStyle"
          ]
        },
        editorConfig: {
          hoverbarKeys: {
            text: [],
            link: {
              menuKeys: [
                'editLink', 'unLink', // 默认的配置可以通过 `editor.getConfig().hoverbarKeys.link` 获取
                'convertToLinkCard' // 增加 '转为链接卡片'菜单
              ],
            }
          },
          autoFocus: false,
          placeholder: '请输入内容...',
          EXTEND_CONF: {
            mentionConfig: {},
          },
          MENU_CONF: {
            convertToLinkCard: {
              async getLinkCardInfo(linkText, linkUrl) {
                return {
                  title: linkText,
                  iconImgSrc: "https://tools.ly522.com/ico/favicon.php?url=" + linkUrl
                }
              }
            },
            insertImage: {
              checkImage(src) {
                if (src.indexOf('http') !== 0) {
                  return '图片网址必须以 http/https 开头';
                }
                return true;
              }
            },
            uploadImage: {
              server: this.$settings.api_url + "common/image/article/",
              fieldName: 'file',
              maxFileSize: 5 * 1024 * 1024,
              maxNumberOfFiles: 1,
              allowedFileTypes: ['image/*'],
              headers: {
                Authorization: window.localStorage.getItem("token")
              },
              base64LimitKB: 5,
              customInsert(result, insertFn) {
                if (result.code === 123) {
                  let url = "https://bc-1304907527.cos.ap-nanjing.myqcloud.com/" + result.result.data
                  insertFn(url)
                } else {
                  Snackbar({
                    content: result.msg,
                    type: "warning",
                    duration: 1000,
                  })
                }
              },
            }
          }
        },
        mode: 'default',
      }
    },
    methods: {
      handleCreated(editor) {
        this.editor = Object.seal(editor)
      },
    },
    beforeUnmount() {
      const editor = this.editor
      if (editor == null) return
      editor.destroy()
    }
  }
</script>

<style scoped>
  .mask {
    width: 100vw;
    height: 100vh;
    position: fixed;
    left: 0;
    top: 0;
    z-index: 1000;
  }

</style>
<style>

  .w-e-image-container {
    margin: 0;
  }

  .w-e-textarea-link-card-container {
    width: 90vw;
    margin: 0 auto;
  }
  .w-e-textarea-link-card-text-container{
    padding-left: 10px;
  }
</style>
