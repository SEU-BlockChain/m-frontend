<template>
  article
</template>

<script>
  export default {
    name: "Articles",
    emits: ["active"],
    created() {
      this.$emit("active", 0)
    }
  }
</script>

<style scoped>

</style>