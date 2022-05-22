<template>
  <div class="container">
    <common-comment-card
      @comment_option="comment_option"
      :comment_num="true"
      :comment="root_comment"
      :article="article"
      @comment_click="handle_click">
      <template #children-comment>
        <div v-if="root_comment.comment_num" @click.stop="show_children_detail=true" class="root-comment">
          <simple-comment-card :comment="comment" :article="article" v-for="comment in root_comment.children_comment"/>
        </div>
      </template>
    </common-comment-card>


  </div>
  <var-popup position="bottom" style="border-radius: 5px 5px 0 0;width: 100vw" v-model:show="show_children_detail">
    <div class="children-detail">
      <div class="children-detail-head">
        <div class="children-detail-title">评论详情</div>
        <var-icon size="25" name="window-close" @click="show_children_detail=false"/>
      </div>
      <common-comment-card
        @comment_option="comment_option"
        :comment_num="true"
        :comment="root_comment"
        :article="article"
        @comment_click="handle_click"/>
      <var-divider/>
      <var-list
        :finished="finished"
        v-model:loading="loading"
        @load="load"
      >
        <div v-for="children_comment in children_comment_list">
          <common-comment-card
            @comment_option="comment_option"
            @comment_click="handle_click"
            :parent="root_comment"
            :article="article"
            :target="children_comment"
            :comment_num="false"
            :comment="children_comment"
            :key="children_comment.id"/>
          <var-divider inset="60" margin="0"/>
        </div>
      </var-list>
      <div style="height: 200px"/>
    </div>
    <div id="comment"/>
  </var-popup>

</template>

<script>
  import CommonCommentCard from "./CommonCommentCard";
  import SimpleCommentCard from "./SimpleCommentCard";
  import SimpleUserCard from "./SimpleUserCard";
  import SimpleAuthorCard from "./SimpleAuthorCard";

  export default {
    name: "CommentCard",
    components: {SimpleAuthorCard, SimpleUserCard, SimpleCommentCard, CommonCommentCard},
    props: {
      root_comment: null,
      article: null
    },
    data() {
      return {
        show_children_detail: false,
        finished: false,
        loading: false,
        next: null,
        children_comment_list: []
      }
    },
    emits: ["comment_click", "comment_option"],
    methods: {
      handle_click(parent, target) {
        this.$emit('comment_click', parent, target)
      },
      load() {
        this.$request.api.get(
          this.next || `/bbs/article/${this.article.id}/comment/${this.root_comment.id}/children_comment/`,
        ).then(res => {
          if (res.data.code === 117) {
            for (let i of res.data.result.results) {
              this.children_comment_list.push(i)
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
      },
      comment_option(is_self, comment) {
        this.$emit("comment_option", is_self, comment)
      }
    }
  }
</script>

<style scoped>
  .container {
    padding: 10px;
    display: flex;
    justify-content: space-between;
  }

  .root-comment {
    background-color: #f6f6f6;
    border-radius: 5px;
    padding: 10px;
  }
</style>