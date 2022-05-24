<template>
  collection
</template>

<script>
  export default {
    name: "Collection",
    emits: ["active"],
    created() {
      this.$emit("active", 2)
    },
    activated() {
      this.$emit("active", 2)
    }
  }
</script>

<style scoped>

</style>