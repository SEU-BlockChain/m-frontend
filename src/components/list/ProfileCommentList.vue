<template>
  <div class="order">
    <var-menu :offset-y="25" :offset-x="-10" v-model:show="show_order">
      <div class="order-text" @click="show_order = !show_order">{{order_text}}
        <var-icon style="margin: 5px 0" name="menu-down"/>
      </div>

      <template #menu>
        <div class="menu">
          <var-cell @click="change_order(order)" v-for="order in order_list">{{order.text}}
          </var-cell>
        </div>
      </template>
    </var-menu>
  </div>

  <div class="wrap">
    <var-list
      :finished="finished"
      v-model:loading="loading"
      @load="load"
      :immediate-check="false"
    >
      <div class="comment" v-for="comment in comment_list">
        <Transition appear name="bloom">
          <comment-card
            :simple="true"
            :comment="comment"
            @onClickImg="click_img"
          />
        </Transition>
      </div>
    </var-list>
  </div>

</template>

<script>
  import CommonCommentCard from "../card/CommonCommentCard";
  import _ from "lodash";
  import CommentCard from "../card/CommentCard";

  export default {
    name: "ProfileCommentList",
    components: {CommentCard, CommonCommentCard},
    emits:["onClickImg"],
    data() {
      return {
        show_order: false,
        ordering: "-comment_time",
        order_text: "最新发布",
        order_list: [
          {
            text: "最新发布",
            ordering: "-comment_time",
          },
          {
            text: "最多点赞",
            ordering: "-up_num",
          },
          {
            text: "最多评论",
            ordering: "-comment_num",
          },
        ],
        comment_list: [],
        current: null,
        loading: true,
        finished: false,
      }
    },
    methods: {
      click_img(images) {
        this.$emit("onClickImg", images)
      },
      change_order(order) {
        this.ordering = order.ordering
        this.order_text = order.text
        this.show_order = false
        this.reload()
      },
      reload() {
        this.comment_list = []
        this.finished = false
        this.loading = true
        this.current = null
        this.load()
      },
      load() {
        this.$request.api.get(
          `/user/self/comment/?offset=${this.current || 0}&order=${this.ordering}`,
        ).then(res => {
          if (res.data.code === 182) {
            let temp = []
            for (let i of res.data.result.content.bbs) {
              temp.push({
                type: "bbs",
                ...i
              })
            }
            for (let i of res.data.result.content.special) {
              temp.push({
                type: "special",
                ...i
              })
            }
            for (let i of res.data.result.content.issue) {
              temp.push({
                type: "issue",
                ...i
              })
            }


            for (let i of _.sortBy(temp, x => {
              switch (this.ordering) {
                case "-comment_time":
                  return -(new Date(x.comment_time).getTime())
                case "-up_num":
                  return -(x.up_num)
                case "-comment_num":
                  return -(x.comment_num)
              }
            })) {
              this.comment_list.push(i)
            }
            this.current += 10
            this.loading = false
            this.finished = res.data.result.end
            this.refreshing = false
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
  .order {
    display: flex;
    justify-content: right;
    align-items: center;
    line-height: 30px;
  }

  .order-text {
    font-size: 14px;
    color: #666666;
  }

  .menu {
    background-color: white;
  }


  .wrap {
    background-color: #fafafa;
  }

  .comment {
    margin: 10px;
    background-color: white;
    box-shadow: 0 0 15px #eee;
    border-radius: 5px;
  }


</style>
