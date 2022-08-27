<template>
  <div class="vote-wrap" v-if="vote" @click="this.$router.push(`/vote/${vote.id}`)">
    <div class="title">{{vote.title}}</div>
    <div class="state">
      <div>创建人:{{vote.creator.username}}</div>
      <var-space align="center" justify="center">
        <div class="time" v-if="state===0">{{this.$calc.filters.date_delta(this.vote.start_time)}}后开始</div>
        <div class="time" v-if="state===1">剩余{{this.$calc.filters.date_delta(this.vote.end_time)}}</div>
        <div class="text" :state="state">{{["未开始","进行中","已结束"][state]}}</div>
      </var-space>
    </div>


  </div>
</template>

<script>
  export default {
    name: "VoteCard",
    props: {
      vote: null
    },
    computed: {
      state() {
        let now = new Date()
        let start = new Date(this.vote.start_time)
        let end = new Date(this.vote.end_time)
        if (now < start) {
          return 0
        } else if (start < now && now < end) {
          return 1
        } else {
          return 2
        }
      },
    }
  }
</script>

<style scoped>
  .state {
    display: flex;
    padding: 10px 0;
    font-size: 12px;
    align-items: center;
    justify-content: space-between;
  }

  .text[state="0"] {
    color: #4ebaee;
    border: 1px solid #4ebaee;
    border-radius: 5px;
    padding: 2px 4px;
  }

  .text[state="1"] {
    color: #05b16a;
    border: 1px solid #05b16a;
    border-radius: 5px;
    padding: 2px 4px;
  }

  .text[state="2"] {
    color: red;
    border: 1px solid red;
    border-radius: 5px;
    padding: 2px 4px;
  }

  .time {
    margin-right: 10px;
  }

  .vote-wrap {
    background-color: whitesmoke;
    padding: 0 10px;
  }

  .title {
    font-size: 20px;
    line-height: 24px;
    padding-top: 10px;
  }
</style>