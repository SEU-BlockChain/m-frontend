<template>
  comment
</template>

<script>
  export default {
    name: "Comments",
    emits: ["active"],
    created() {
      this.$emit("active", 1)
    }
  }
</script>

<style scoped>

</style>