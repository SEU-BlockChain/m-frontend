<template>
  <var-chip size="mini" style="--chip-mini-padding:0" :round="false" color="transparent">
    <template #default>
      <img :src="require(`../../assets/img/lv/lv${rank.level}.svg`)" class="level" alt="">
    </template>
  </var-chip>
</template>

<script>
  export default {
    name: "LevelChip",
    props: {
      experience: null,
      round: null
    },
    data() {
      return {
        rank: null
      }
    },
    created() {
      this.rank = this.$calc.calc_rank(this.experience)
    }
  }
</script>

<style scoped>
  .level {
    width: 26px;
  }
</style>