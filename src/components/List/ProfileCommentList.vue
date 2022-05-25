<template>
  <div class="wrap">
    <var-list
      :finished="finished"
      v-model:loading="loading"
      @load="load"
      :immediate-check="false"
    >
      <div class="container " v-for="comment in comment_list"
           @click="this.$router.push(`/bbs/article/${comment.article.id}`)">
        <div class="comment">
          <div class="content">
            <common-comment-card :comment="comment" :hide_head="true"/>
          </div>
        </div>
        <div class="article">{{this.$calc.filters.max_width(comment.article.title,20)}}</div>
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
        loading: true,
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
    created() {
      this.load()
    }
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
    align-items: flex-start;
  }

  .article {
    font-size: 12px;
    color: #777;
    margin: 0 10px 10px;
    padding: 10px;
    background-color: #f0f1f5;
    border-radius: 5px;
  }
</style>