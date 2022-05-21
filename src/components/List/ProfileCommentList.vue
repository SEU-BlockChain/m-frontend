<template>
  <div class="wrap">
    <var-list
      :finished="finished"
      v-model:loading="loading"
      @load="load"
    >
      <div class="container " v-for="comment in comment_list">
        <div class="comment" @click="this.$router.push(`/bbs/article/${comment.article.id}`)">
          <div class="content">
            <common-comment-card :comment="comment" :hide_head="true"/>
          </div>
          <div class="article">{{this.$calc.filters.max_width(comment.article.title,20)}}</div>
        </div>
        <var-divider margin="0"/>
      </div>
    </var-list>
  </div>

</template>

<script>
  import CommonCommentCard from "../card/CommonCommentCard";

  export default {
    name: "ProfileCommentList",
    components: {CommonCommentCard},
    props: {
      author_id: null,
    },
    data() {
      return {
        comment_list: [],
        next: null,
        loading: false,
        finished: false,
      }
    },
    methods: {
      load() {
        this.$request.api.get(
          this.next || `/user/self/comment`,
        ).then(res => {
          if (res.data.code === 117) {
            for (let i of res.data.result.results) {
              this.comment_list.push(i)
            }
            this.next = res.data.result.next
            this.loading = false
            this.finished = !Boolean(this.next)
          } else {
            this.$tip({
              content: res.data.msg,
              type: "warning",
              duration: 1000,
            })
          }
        })
      }
    },
  }
</script>

<style scoped>
  .container {
    background-color: white;
    border-radius: 5px;
  }

  .wrap {
    background-color: #fafafa;
  }

  .comment {
    display: flex;
    padding: 0 10px;
    justify-content: space-between;
    align-items: center;
  }

  .content {
    width: 80vw;
  }

  .article {
    width: 20vw;
    font-size: 12px;
    color: #777;
    padding: 10px;
    background-color: #f0f1f5;
    border-radius: 5px;
  }
</style>