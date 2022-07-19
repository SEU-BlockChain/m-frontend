<template>
  <var-card class="card">
    <template #extra>
      {{info}}
    </template>
  </var-card>
</template>

<script>
  export default {
    name: "IssueDetailCard",
    props: {
      info: null
    }
  }
</script>

<style scoped>

</style>