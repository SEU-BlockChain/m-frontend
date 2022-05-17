<template>
  Stars
</template>

<script>
  export default {
    name: "Stars",
    emits: ["active"],
    created() {
      this.$emit("active", 3)
    }
  }
</script>

<style scoped>

</style>