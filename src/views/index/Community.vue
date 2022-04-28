<template>
  community
</template>

<script>
  export default {
    name: "Community",
    emits: ["active"],
    created() {
      this.$emit("active", 1)
    }
  }
</script>

<style scoped>

</style>