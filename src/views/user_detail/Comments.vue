<template>
  <profile-comment-list @onClickImg="click_img"/>
</template>

<script>
  import ProfileCommentList from "components/list/ProfileCommentList";

  export default {
    name: "Comments",
    components: {
      ProfileCommentList
    },
    emits: ["active"],
    methods: {
      click_img(images) {
        this.$store.commit("set_image_preview", images)
      }
    },
    created() {
      this.$emit("active", 1)
    },
    activated() {
      this.$emit("active", 1)
    }
  }
</script>

<style scoped>

</style>
