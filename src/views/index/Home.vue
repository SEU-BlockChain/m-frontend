<template>
  <div class="animation-wrap">
    <div class="head">WeChain</div>
    <var-swipe class="swipe" :autoplay="3000">
      <var-swipe-item>
        <img src="https://varlet-varletjs.vercel.app/cat.jpg">
      </var-swipe-item>
      <var-swipe-item>
        <img src="https://varlet-varletjs.vercel.app/cat2.jpg">
      </var-swipe-item>
      <var-swipe-item>
        <img src="https://varlet-varletjs.vercel.app/cat3.jpg">
      </var-swipe-item>
    </var-swipe>

    <div class="random">
      <div>随机话题</div>
      <div class="random-body"></div>
    </div>

    <div class="all-topic">
      <div class="find">
        <var-input class="search-input" placeholder="搜索" :hint="false" :line="false" v-model="search" @input="filter">
          <template #prepend-icon>
            <var-icon @click="filter" name="magnify-plus-outline"/>
          </template>
        </var-input>
      </div>
    </div>

  </div>
</template>

<script>
  export default {
    name: "Home",
    emits: ["active"],
    data() {
      return {
        search: ""
      }
    },
    methods: {
      filter() {

      }
    },
    created() {
      this.$emit("active", 0)
    },
    activated() {
      this.$emit("active", 0)
    }
  }
</script>

<style scoped>
  .head {
    height: 44px;
    line-height: 44px;
    font-weight: bold;
    padding-left: 10px;
    font-size: 18px;
    background-color: white;
  }


  .swipe {
    border-radius: 5px;
  }

  .swipe img {
    width: 100%;
    height: 200px;
    object-fit: cover;
    pointer-events: none;
  }

  .random {
    padding: 5px;
    background-color: white;
  }

  .random-body {
    height: 30px;
  }

  .all-topic {
    padding: 5px;
    background-color: white;
  }

  .find {
    width: 100%;
  }

  .search-input {
    background-color: #f6f6f6;
    padding: 0 10px;
    border-radius: 15px;
  }

</style>