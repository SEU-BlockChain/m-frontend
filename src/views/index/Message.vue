<template>
  <div class="animation-wrap">message</div>
</template>

<script>
  export default {
    name: "Message",
    emits: ["active"],
    created() {
      this.$emit("active", 3)
    }
  }
</script>

<style scoped>

</style>