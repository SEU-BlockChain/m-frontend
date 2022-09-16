<template>
  <div class="article-container">
    <profile-article-list @onClickImg="click_img"/>
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
    methods: {
      click_img(images) {
        this.$store.commit("set_image_preview", images)
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
