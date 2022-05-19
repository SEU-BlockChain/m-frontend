<template>
  <Toolbar
    :editor="editor"
    :defaultConfig="toolbarConfig"
    :mode="mode"
  />
  <Editor
    style="height: 250px; overflow-y: scroll;width: 100vw"
    v-model="valueHtml"
    :defaultConfig="editorConfig"
    :mode="mode"
    @onCreated="handleCreated"
  />
</template>

<script>
  import '@wangeditor/editor/dist/css/style.css'
  import Snackbar from "@varlet/ui/es/snackbar";
  import {Editor, Toolbar} from '@wangeditor/editor-for-vue'

  export default {
    name: "CommentEditor",
    components: {
      Toolbar,
      Editor
    },
    data() {
      return {
        editor: null,
        valueHtml: "",
        toolbarConfig: {
          toolbarKeys: [
            "color",
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
            "undo",
            "redo",
          ]
        },
        editorConfig: {
          autoFocus: false,
          placeholder: '请输入内容...',
          MENU_CONF: {
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
                Authorization: this.$cookies.get("token")
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
      }
    },
    beforeUnmount() {
      const editor = this.editor
      if (editor == null) return
      editor.destroy()
    }
  }
</script>

<style scoped>


</style>

<style>

</style>