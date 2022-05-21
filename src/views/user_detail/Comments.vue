<template>
  <profile-comment-list/>
</template>

<script>
  import ProfileCommentList from "components/List/ProfileCommentList";

  export default {
    name: "Comments",
    components: {
      ProfileCommentList
    },
    emits: ["active"],
    created() {
      this.$emit("active", 1)
    }
  }
</script>

<style scoped>

</style>