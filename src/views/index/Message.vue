<template>
  <div class="animation-wrap">
    <div class="head">
      <div class="option">

      </div>
    </div>
  </div>
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
  .head {
    position: fixed;
    left: 0;
    top: 0;
    background-color: #fafafa;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 50px;
    padding: 0 10px;
    z-index: 10;
  }

  .head {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
</style>