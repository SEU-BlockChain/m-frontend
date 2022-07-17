<template>
  <div class="animation-wrap">
    <var-app-bar
      class="app-bar"
      color="white"
      text-color="#333"
      title-position="center"
    >
      <template #left>
        <var-button
          round
          text
          color="transparent"
          text-color="#333"
          @click="this.$router.return('/profile')"
        >
          <var-icon name="chevron-left" :size="24"/>
        </var-button>
      </template>
      <template #default>
        <div class="bar-text">
          等级
        </div>
      </template>
    </var-app-bar>

    <div style="height: 54px;"/>

    <div class="head" v-if="this.$store.state.is_login">
      <div class="level">
        <img :src="require(`../../assets/img/lv/lv${rank.level}.svg`)" class="level-logo" alt="">
        <div class="progress">
          <div class="tip">
            <div>lv.{{rank.level}}</div>
            <div class="ratio">{{rank.experience}}/{{rank.total}}</div>
            <div>lv.{{rank.level===10?"--":rank.level+1}}</div>

          </div>
          <var-progress
            line-width="8"
            color="#ffe14c"
            track-color="#f2f4f5"
            :value="100*rank.experience/rank.total"
          />
        </div>
      </div>

      <var-divider/>

      <div class="today">
        <div>今日已获取经验:</div>
        <div class="has">{{total}}</div>
      </div>
    </div>

    <div class="body">
      <var-tabs v-model:active="active">
        <var-tab>获取经验</var-tab>
        <var-tab>等级成长</var-tab>
      </var-tabs>

      <var-divider margin="0"/>

      <var-tabs-items v-model:active="active">
        <var-tab-item>
          <progress-task-card
            title="每日签到"
            :single="score.sign"
            :times="1"
            :current="task.sign"
          />

          <progress-task-card
            title="论坛发帖"
            :single="score.bbs_post"
            :times="2"
            :current="task.bbs_post"
          />

          <progress-task-card
            title="专栏发帖并审核通过"
            :single="score.column_post"
            :times="5"
            :current="task.column_post"
          />

          <progress-task-card
            title="回答被采纳"
            :single="score.answer_adopted"
            :times="5"
            :current="task.answer_adopted"
          />

          <progress-task-card
            title="发评论"
            :single="score.comment"
            :times="10"
            :current="task.comment"
          />

          <progress-task-card
            title="点赞"
            :single="score.like"
            :times="10"
            :current="task.like"
          />

          <progress-task-card
            title="评论被点赞"
            :single="score.comment_liked"
            :times="10"
            :current="task.comment_liked"
          />

          <progress-task-card
            title="文章被点赞"
            :single="score.post_liked"
            :times="10"
            :current="task.post_liked"
          />

          <progress-task-card
            title="被回复"
            :single="score.commented"
            :times="10"
            :current="task.commented"
          />

          <progress-task-card
            title="被收藏"
            :single="score.stared"
            :times="10"
            :current="task.stared"
          />

        </var-tab-item>
        <var-tab-item>
          <div class="table">
            <table>
              <thead>
              <tr>
                <th>等级</th>
                <th>所需经验值</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="(experience,k) in this.$calc.experience_list">
                <td>
                  <img :src="require(`../../assets/img/lv/lv${k+1}.svg`)" style="vertical-align:middle" height="30"
                       alt="">
                </td>
                <td class="has">{{experience}}</td>
              </tr>

              <tr>
                <td>
                  <img src="../../assets/img/lv/lv10.svg" style="vertical-align:middle" height="30"
                       alt="">
                </td>
                <td class="has">360000+</td>
              </tr>
              </tbody>
            </table>
          </div>
        </var-tab-item>

      </var-tabs-items>
    </div>
  </div>
</template>

<script>
  import ProgressTaskCard from "../../components/card/ProgressTaskCard";

  export default {
    name: "Level",
    components: {ProgressTaskCard},
    data() {
      return {
        active: 0,
        total:0,
        score: {
          sign: 50,
          bbs_post: 20,
          column_post: 50,
          answer_adopted: 50,
          comment: 10,
          like: 5,
          comment_liked: 10,
          post_liked: 15,
          commented: 20,
          stared: 20
        },
        task: {
          sign: 0,
          bbs_post: 0,
          column_post: 0,
          answer_adopted: 0,
          comment: 0,
          like: 0,
          comment_liked: 0,
          post_liked: 0,
          commented: 0,
          stared: 0
        }
      }
    },
    computed: {
      rank() {
        return this.$calc.calc_rank(this.$store.state.user.experience)
      },

    },
    created() {
      this.$request.api.get('/task/info/').then(res => {
        if (res.data.code === 166) {
          this.task = res.data.result
          for (let i = 0; i < Object.values(this.score).length; i++) {
            this.total +=Object.values(this.score)[i] * Object.values(this.task)[i]
          }
        } else {
          this.$tip({
            content: "获取失败",
            type: "warning"
          })
        }
      })
    }
  }
</script>

<style scoped>
  .app-bar {
    width: 100vw;
    position: fixed;
    left: 0;
    top: 0;
    z-index: 100;
  }

  .head {
    padding: 20px 10px;
    background-color: white;
    border-radius: 0 0 5px 5px;
  }

  .level {
    padding: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }

  .level-logo {
    width: 80px;
  }

  .progress {
    width: 50vw;
  }

  .tip {
    display: flex;
    justify-content: space-between;
    height: 20px;
  }

  .ratio {
    transform: translateY(14px);
    z-index: 10
  }

  .today {
    padding: 5px;
    display: flex;
    justify-content: space-between;
  }

  .has {
    color: #fa0;
  }

  .body {
    margin-top: 30px;
    background-color: white;
    min-height: calc(100vh - 250px);
  }

  .table {
    margin: 20px;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    border: 1px solid #ebeff0;
    text-align: center;
    line-height: 40px;
  }

  thead {
    background-color: #eff6ff;
    color: #404040;
  }

  th, td {
    text-align: center;
    border: 1px solid #ebeff0;
  }

  tr:nth-child(even) {
    background-color: #fafbff;
  }

</style>