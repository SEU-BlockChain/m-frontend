<template>
  <div class="article-container">
    <profile-article-list :author_id="this.$store.state.user.id"/>
  </div>
</template>

<script>
  import ProfileArticleList from "../../components/List/ProfileArticleList";

  export default {
    name: "Articles",
    components: {ProfileArticleList},
    emits: [
      "active"
    ],
    created() {
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