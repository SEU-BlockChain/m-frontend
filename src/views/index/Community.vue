<template>
  <div class="animation-wrap">
    <div class="top">
      <div class="search">
        <var-input class="search-input" placeholder="搜索" :hint="false" :line="false" v-model="search" @input="filter">
          <template #prepend-icon>
            <var-icon @click="filter" name="magnify-plus-outline"/>
          </template>
        </var-input>
      </div>
      <div class="options">
        <div class="option">
          <img class="option-icon" src="~assets/img/column.svg" alt="">
          <div class="option-text">专栏</div>
        </div>
        <div class="option">
          <img class="option-icon" src="~assets/img/news.svg" alt="">
          <div class="option-text">资讯</div>
        </div>
        <div class="option">
          <img class="option-icon" src="~assets/img/ask.svg" alt="">
          <div class="option-text">问答</div>
        </div>
      </div>

      <div class="bbs">
        <var-card class="card" @click="this.$router.push('/bbs')">
          <template #extra>
            <div class="card-wrap">
              <img class="card-icon" src="~assets/img/bbs.svg" alt="">
              <div>
                <div class="card-text">讨论区</div>
                <div class="card-desc">区块链交流·见解分享</div>
              </div>
              <div class="card-enter">
                进入讨论区>
              </div>
            </div>
          </template>
        </var-card>
      </div>
    </div>

    <div class="body">
      <div class="notice">
        <var-icon name="file-document-outline"/>
        官方公告
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "Community",
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
      this.$emit("active", 1)
    },
    activated() {
      this.$emit("active", 1)
    }
  }
</script>

<style scoped>
  .search {
    width: 100vw;
    padding: 20px;
  }

  .search-input {
    background-color: white;
    padding: 0 10px;
    border-radius: 15px;
  }

  .options {
    display: flex;
    width: 100vw;
    justify-content: left;
  }

  .option {
    width: 20%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .option-icon {
    width: 40px;
    height: 40px;
  }

  .bbs {
    padding: 20px 20px 10px;
    width: 100vw;
  }

  .body {
    background-color: white;
    min-height: 100vh;
    border-radius: 10px 10px 0 0;
  }

  .notice {
    padding: 15px 10px;
    font-size: 18px;
    font-weight: bold;
    line-height: 20px;
    color: #333;
  }

  .card-wrap {
    padding: 15px 20px;
    display: flex;
    justify-content: flex-start;
  }

  .card-icon {
    width: 50px;
    margin-right: 5px;
  }

  .card-text {
    font-weight: bolder;
    line-height: 30px;
  }

  .card-desc {
    line-height: 20px;
    font-size: 12px;
    color: #999;
  }

  .card-enter {
    flex-grow: 1;
    line-height: 50px;
    font-size: 14px;
    text-align: right;
  }
</style>