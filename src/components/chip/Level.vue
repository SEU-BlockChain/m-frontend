<template>
  <div class="wrap">
    <div class="clear-fix">
      <div class="level left">Lv.{{rank.level}}</div>
      <div class="experience right">{{rank.experience}}/{{rank.total}}</div>
    </div>
    <var-progress :value="100*rank.experience/rank.total" />
  </div>
</template>

<script>
  export default {
    name: "Level",
    props: {
      experience: null,
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
  .wrap {
    width: 120px;
  }


  .experience {
    font-size: 12px;
    line-height: 20px;
  }

  .level {
    font-size: 13px;
    line-height: 20px;
    font-weight: bold;
  }

</style>