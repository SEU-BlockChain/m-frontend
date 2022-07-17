<template>
  <div class="article-container">
    <profile-article-list @onClickImg="click_img" :author_id="this.$store.state.user.id"/>
    <var-image-preview style="transition-duration: 0.5s" closeable :images="images" v-model:show="show_img"/>
  </div>
</template>

<script>
  import ProfileArticleList from "../../components/list/ProfileArticleList";

  export default {
    name: "Articles",
    components: {ProfileArticleList},
    emits: [
      "active"
    ],
    watch: {
      show_img(newValue, oldValue) {
        this.$calc.mutex(this.$store, newValue, oldValue)
      },
    },
    data() {
      return {
        images: [],
        show_img: false
      }
    },
    methods: {
      click_img(images) {
        this.images = images
        this.show_img = true
      }
    },
    created() {
      this.$emit("active", 0)
    },
    activated() {
      this.$emit("active", 0)
    }
  }
</script>

<style scoped>
  .article-container {
    padding-bottom: 50px;
    background-color: #fafafa;
  }
</style>