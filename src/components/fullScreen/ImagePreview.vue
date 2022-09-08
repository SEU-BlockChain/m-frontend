<template>
  <var-image-preview
    style="transition-duration: 0.5s"
    closeable
    :images="this.$store.state.image_preview.images"
    v-model:show="show_image_preview"
  >
    <template #extra>
      <var-icon
        name="menu"
        :size="22"
        color="#fff"
        @click="preview_menu_show = true"
      />
      <var-action-sheet :actions="actions" v-model:show="preview_menu_show" @select="handleSelect"/>
    </template>
  </var-image-preview>
</template>

<script>
  export default {
    name: "ImagePreview",
    watch: {
      show_image_preview(show) {
        this.$tools.mutex(show, () => {
          this.$store.commit('close_image_preview')
        })
      },
      preview_menu_show(show) {
        this.$tools.mutex(show, () => {
          this.preview_menu_show = false
        })
      }
    },
    data() {
      return {
        preview_menu_show: false,
        actions: [
          {
            id: 1,
            name: '下载',
            icon: 'download'
          },
          {
            id: 2,
            name: '浏览器中查看',
            icon: 'content-copy'
          },
        ]
      }
    },
    computed: {
      show_image_preview: {
        get() {
          return this.$store.state.image_preview.show
        },
        set(newVal) {
          this.$store.commit('close_image_preview')
        }
      }
    },
    methods: {
      handleSelect(action) {
        let url = this.$store.state.image_preview.images[0]
        switch (action.id) {
          case 1:
            this.$tools.downloadImage(url)
            break
          case 2:
            try {
              plus.runtime.openURL(url);
              e.preventDefault()
            } catch (e) {
              window.open(url)
            }
            break
        }
      },
    }
  }
</script>

<style scoped>

</style>
