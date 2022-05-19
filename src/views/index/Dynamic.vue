<template>
  <div class="animation-wrap">dynamic</div>
</template>

<script>
  export default {
    name: "Dynamic",
    emits: ["active"],
    created() {
      this.$emit("active", 2)
    }
  }
</script>

<style scoped>

</style>