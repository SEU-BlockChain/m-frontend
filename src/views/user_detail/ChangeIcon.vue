<template>
  <div class="animation-wrap">
    <var-app-bar
      class="var-elevation--1"
      title-position="center"
      color="#333"
      text-color="#bbb"
    >
      <template #left>
        <div @click="this.$router.return('/edit-info')">
          <var-icon name="chevron-left" :size="24"/>
          <span>返回</span>
        </div>
      </template>
    </var-app-bar>

    <div class="background"/>
    <div class="frame">
      <img class="img" v-if="!is_change" :src="icon" alt="修改头像">
      <VuePictureCropper
        v-else
        :boxStyle="{
        width: '100%',
        backgroundColor: '#f8f8f8',
        position:'absolute'
      }"
        :img="pic"
        :options="{
        viewMode: 1,
        dragMode: 'move',
        aspectRatio: 1
      }"
      />
    </div>

    <var-row>
      <var-col :span="18" :offset="3" style="margin-top: 30px;">
        <var-button block type="info" @click="select">选择图片</var-button>
        <input type="file" id="upload" style="display: none;" name="icon" accept="image/bmp,image/jpeg,image/png">
      </var-col>
      <var-col :span="18" :offset="3" style="margin-top: 10px;">
        <var-button block type="success" @click="submit">确定</var-button>
      </var-col>
    </var-row>
  </div>
</template>

<script>
  import VuePictureCropper, {cropper} from 'vue-picture-cropper'

  export default {
    name: "ChangeIcon",
    components: {
      VuePictureCropper
    },
    data() {
      return {
        is_change: false,
        icon: this.$settings.cos_url + this.$store.state.user.icon,
        pic: null,
      }
    },
    methods: {
      select() {
        let btn = document.getElementById("upload")
        btn.click()
      },
      submit() {
        if (this.is_change) {
          cropper.getFile().then(file => {
            let form = new FormData
            form.append("icon", file)
            this.$request.api({
                method: "post",
                url: "user/self/icon/",
                data: form,
                headers: {
                  "Content-Type": "multipart/form-data",
                }
              }
            ).then(res => {
              if (res.data.code === 109) {
                this.$tip({
                  content: "修改成功，新头像需要一段时间后生效",
                  type: "success",
                  duration: 2000,
                })
                setTimeout(() => {
                  this.$router.back()
                }, 2000)
              } else {
                this.$tip({
                  content: res.data.msg,
                  type: "warning",
                  duration: 1000,
                })
              }
            })
          })
        } else {
          this.$router.return("/edit-info")
        }
      }
    },
    mounted() {
      let btn = document.getElementById("upload")
      btn.addEventListener("change", ev => {
        let files = ev.target.files
        if (files.size !== 0) {
          let file = files[0]
          if (file.size / (1024 * 1024) > 5) {
            this.$tip({
              content: "图片大小不超过5M",
              type: "warning",
              duration: 1000,
            })
          } else if (!["image/bmp", "image/jpeg", "image/png"].includes(file.type)) {
            this.$tip({
              content: "只能上传jpg,png,bmp",
              type: "warning",
              duration: 1000,
            })
          } else {
            let Reader = new FileReader()
            Reader.readAsDataURL(file)
            Reader.onload = () => {
              this.pic = Reader.result
              this.is_change = true
            }
          }
        }
      })
    }
  }
</script>

<style scoped>
  .animation-wrap{
    background-color: transparent;
  }
  .background {
    background-color: rgba(0, 0, 0, .9);
  }

  .img {
    width: 100vw;
    height: 100vw;
  }

  .frame {
    position: relative;
    overflow: hidden;
    padding-bottom: 100%;
    margin-top: 15vh;
    width: 100vw;
    height: 100vw;
    background-color: gray;
    z-index: 2;
  }
</style>