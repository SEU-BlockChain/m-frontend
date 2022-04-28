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
    methods: {
      calc_rank() {
        let experience = Number(this.experience)
        if (experience < 50) return {level: 0, experience, total: 50}
        if (experience < 120) return {level: 1, experience, total: 120}
        if (experience < 300) return {level: 2, experience, total: 300}
        if (experience < 800) return {level: 3, experience, total: 800}
        if (experience < 2000) return {level: 4, experience, total: 2000}
        if (experience < 5000) return {level: 5, experience, total: 5000}
        return {level: 6, experience, total: "--"}
      }
    },
    created() {
      this.rank = this.calc_rank()
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