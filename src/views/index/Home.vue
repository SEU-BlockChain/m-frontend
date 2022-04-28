<template>
  home
</template>

<script>
  export default {
    name: "Home",
    emits: ["active"],
    created() {
      this.$emit("active", 0)
    }
  }
</script>

<style scoped>

</style>