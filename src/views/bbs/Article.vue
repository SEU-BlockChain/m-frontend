<template>
  <var-app-bar
    class="app-bar"
    color="#f4f5f9"
    :elevation="false"
    text-color="#333"
    title-position="center"
  >
    <template #left>
      <var-button
        round
        text
        color="transparent"
        text-color="#333"
        @click="this.$router.return('/bbs')"
      >
        <var-icon name="chevron-left" :size="24"/>
      </var-button>
    </template>
  </var-app-bar>
  {{this.$route.params.id}}
</template>

<script>
  export default {
    name: "Article"
  }
</script>

<style scoped>

</style>