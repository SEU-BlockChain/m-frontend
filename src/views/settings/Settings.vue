<template>
  <div class="animation-wrap">
    <var-button @click="logout">退出登陆</var-button>
  </div>
</template>

<script>
  export default {
    name: "Settings",
    methods: {
      logout() {
        this.$dialog({
          message: "确认退出登陆？",
        }).then(res => {
          if (res === "confirm") {
            localStorage.removeItem("token")
            this.$store.commit("logout")
            this.$router.replace("/")
          }
        })
      },
    }
  }
</script>

<style scoped>

</style>