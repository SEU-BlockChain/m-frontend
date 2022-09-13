<template>
  <div class="wrap" :class="{'new':comment.new}">
    <div class="head">
      <div class="info" @click.stop="this.$router.push(`/user/${comment.author.id}`)">
        <div class="name">
          {{comment.author.username}}
        </div>
        <div v-if="article&&comment.author.id===article.author.id">
          <var-chip size="mini" type="warning" :round="false"> 楼主</var-chip>
        </div>
      </div>
      <div class="time">{{this.$calc.filters.date(comment.comment_time)}}</div>
    </div>
    <div class="w-container" v-html="this.$xss(comment.content)"/>
  </div>
</template>

<script>
  export default {
    name: "SimpleCommentCard",
    props: {
      comment: null,
      article: null
    }
  }
</script>

<style scoped>
  .head {
    display: flex;
    justify-content: space-between;
  }

  .info {
    display: flex;
    justify-content: left;
  }

  .name {
    color: #4ebaee;
  }

  .time {
    font-size: 14px;
    color: #666666;
  }

  .wrap {
    padding: 10px;
  }
</style>
