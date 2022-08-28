<template>
  <div class="animation-wrap">
    <var-app-bar
      class="app-bar"
      color="white"
      text-color="#333"
      title-position="left"
    >
      <template #left>
        <var-button
          round
          text
          color="transparent"
          text-color="#333"
          @click="this.$router.return('/vote')"
        >
          <var-icon name="chevron-left" :size="30"/>
        </var-button>
      </template>
      <template #default>
        <div class="head-text">投票详情</div>
      </template>
      <template #right>
        <var-button
          v-if="vote&& vote.creator.id===this.$store.state.user.id"
          round
          text
          color="transparent"
          text-color="#333"
          @click="delete_vote"
        >
          <var-icon name="trash-can-outline"/>
        </var-button>
      </template>
    </var-app-bar>

    <div style="height: 54px;"/>
    <div class="wrap" v-if="vote">
      <var-card class="card" style="border-radius: 10px">
        <template #extra>
          <div class="content">
            <span class="text" :state="state">{{["未开始","进行中","已结束"][state]}}</span>
            <span class="delta-time" v-if="state===0">{{this.$calc.filters.date_delta(this.vote.start_time)}}后开始</span>
            <span class="delta-time" v-if="state===1">剩余{{this.$calc.filters.date_delta(this.vote.end_time)}}</span>

            <div class="title">{{vote.title}}</div>
            <var-space justify="space-between">
              <div class="time">开始:{{(new this.$calc.DateParser(vote.start_time)).all()}}</div>
              <div class="time">结束:{{(new this.$calc.DateParser(vote.end_time)).all()}}</div>
            </var-space>

            <div class="options">
              <div v-if="vote.opened&&!vote.show">
                <a-checkbox-group @change="select" v-model="selected" :disabled="vote.voted">
                  <template v-for="choice in vote.choice" :key="choice">
                    <a-checkbox :value="choice.id">
                      <template #checkbox="{ checked }">
                        <var-space
                          align="center"
                          class="custom-checkbox-card"
                          :class="{ 'custom-checkbox-card-checked': checked }"
                        >
                          <div class="custom-checkbox-card-mask">
                            <div class="custom-checkbox-card-mask-dot"/>
                          </div>
                          <div class="custom-checkbox-card-title">
                            {{ choice.content }}
                          </div>
                        </var-space>
                      </template>
                    </a-checkbox>
                  </template>
                </a-checkbox-group>
                <var-space class="tip" justify="center">
                  <div v-if="vote.max_num===vote.min_num">请选择{{vote.max_num}}项,投票后查看结果</div>
                  <div v-else>最少选择{{vote.min_num}}项,最多选择{{vote.max_num}}项,投票后查看结果</div>
                </var-space>
                <br>
                <var-button
                  v-if="!vote.voted && this.$store.state.is_login"
                  block
                  size="small"
                  type="success"
                  :disabled="disabled" @click="submit">
                  确定
                </var-button>
              </div>

              <div v-else-if="vote.opened&&vote.show">
                <a-checkbox-group @change="select" v-model="selected" :disabled="Boolean(vote.voted)">
                  <template v-for="choice in vote.choice" :key="choice">
                    <a-checkbox :value="choice.id">
                      <template #checkbox="{ checked }">
                        <var-space
                          :style="`background: linear-gradient(to right, #9fd4ee 0%,#9fd4ee ${(100*choice.num/vote.num).toFixed()}%,white ${(100*choice.num/vote.num+1).toFixed()}%,white 100%)`"
                          align="center"
                          justify="space-between"
                          class="custom-checkbox-card"
                          :class="{ 'custom-checkbox-card-checked': checked }"
                        >
                          <var-space align="center">
                            <div class="custom-checkbox-card-mask">
                              <div class="custom-checkbox-card-mask-dot"/>
                            </div>
                            <div class="custom-checkbox-card-title">
                              {{ choice.content }}
                            </div>
                          </var-space>

                          <div class="portion">{{choice.num}}/{{vote.num}}</div>
                        </var-space>
                      </template>
                    </a-checkbox>
                  </template>
                </a-checkbox-group>
                <var-space class="tip" justify="center">
                  <div v-if="vote.max_num===vote.min_num">请选择{{vote.max_num}}项</div>
                  <div v-else>最少选择{{vote.min_num}}项,最多选择{{vote.max_num}}项</div>
                </var-space>
                <br>
                <var-button
                  v-if="!vote.voted && this.$store.state.is_login"
                  block
                  size="small"
                  type="success"
                  :disabled="disabled" @click="submit">
                  确定
                </var-button>
              </div>

              <div v-else-if="!vote.show">
                <a-checkbox-group @change="select" v-model="selected" disabled>
                  <template v-for="choice in vote.choice" :key="choice">
                    <a-checkbox :value="choice.id">
                      <template #checkbox="{ checked }">
                        <var-space
                          align="center"
                          justify="space-between"
                          class="custom-checkbox-card"
                          :class="{ 'custom-checkbox-card-checked': checked }"
                        >
                          <var-space align="center">
                            <div class="custom-checkbox-card-mask">
                              <div class="custom-checkbox-card-mask-dot"/>
                            </div>
                            <div class="custom-checkbox-card-title">
                              {{ choice.content }}
                            </div>
                          </var-space>
                        </var-space>
                      </template>
                    </a-checkbox>
                  </template>
                </a-checkbox-group>
              </div>

              <div v-else>
                <a-checkbox-group @change="select" v-model="selected" disabled>
                  <template v-for="choice in vote.choice" :key="choice">
                    <a-checkbox :value="choice.id">
                      <template #checkbox="{ checked }">
                        <var-space
                          :style="`background: linear-gradient(to right, #9fd4ee 0%,#9fd4ee ${(100*choice.num/vote.num).toFixed()}%,white ${(100*choice.num/vote.num+1).toFixed()}%,white 100%)`"
                          align="center"
                          justify="space-between"
                          class="custom-checkbox-card"
                          :class="{ 'custom-checkbox-card-checked': checked }"
                        >
                          <var-space align="center">
                            <div class="custom-checkbox-card-mask">
                              <div class="custom-checkbox-card-mask-dot"/>
                            </div>
                            <div class="custom-checkbox-card-title">
                              {{ choice.content }}
                            </div>
                          </var-space>

                          <div class="portion">{{choice.num}}/{{vote.num}}</div>
                        </var-space>
                      </template>
                    </a-checkbox>
                  </template>
                </a-checkbox-group>
              </div>

            </div>
            <br>
            <simple-author-card :author="vote.creator"></simple-author-card>
          </div>
        </template>
      </var-card>
    </div>

  </div>
</template>

<script>
  import SimpleUserCard from "../../components/card/SimpleUserCard";
  import SimpleAuthorCard from "../../components/card/SimpleAuthorCard";

  export default {
    name: "Vote",
    components: {SimpleAuthorCard, SimpleUserCard},
    data() {
      return {
        vote: null,
        checked: null,
        selected: [],
        disabled: true,
      }
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
    },
    methods: {
      delete_vote() {
        this.$dialog("是否删除投票?").then(res => {
          if (res === "confirm") {
            this.$request.api.delete(
              `/vote/${this.$route.params.id}`,
            ).then(res => {
              if (res.data.code === 176) {
                this.$router.replace('/vote/')
              } else {
                this.$tip({
                  content: res.data.msg,
                  type: "warning",
                  duration: 1000,
                })
              }
            })
          }
        })
      },
      select(options) {
        if (options.length > this.vote.max_num) {
          this.$tip({
            content: `最多选择${this.vote.max_num}项!`,
            type: "warning",
            duration: 2000
          })
        }
        this.disabled = !(this.vote.min_num <= options.length && options.length <= this.vote.max_num)
      },
      submit() {
        this.$request.api.post(
          `/vote/${this.$route.params.id}/submit/`,
          {
            selected: this.selected
          }
        ).then(res => {
          if (res.data.code === 175) {
            this.load()
            this.$tip({
              content: "已投票",
              type: "success",
              duration: 1000,
            })
          } else {
            this.$tip({
              content: res.data.msg,
              type: "warning",
              duration: 1000,
            })
          }
        })
      },
      load() {
        this.$request.api.get(
          `/vote/${this.$route.params.id}`,
        ).then(res => {
          if (res.data.code === 173) {
            this.vote = res.data.result
            if (res.data.result.voted) {
              this.selected = res.data.result.voted
            }
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

  .delta-time {
    margin-left: 10px;
    font-size: 12px;
    color: #888888;
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

  .tip {
    font-size: 12px;
    color: #888888;
    margin-bottom: 20px;
  }

  .options {
    padding: 10px 0;
  }

  .app-bar {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    z-index: 100;
  }

  .head-text {
    font-family: Number, "85W", sans-serif;
    width: 100%;
    font-size: 18px;
    text-align: center;
  }

  .wrap {
    margin: 10px;
  }

  .content {
    padding: 10px;
  }

  .title {
    font-size: 16px;
    margin-top: 10px;
  }

  .time {
    font-size: 12px;
    color: #888888;
  }

  .custom-checkbox-card {
    padding: 0 10px;
    border: 1px solid var(--color-border-2);
    border-radius: 4px;
    width: 100%;
    box-sizing: border-box;
  }

  .custom-checkbox-card-mask {
    height: 14px;
    width: 14px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 2px;
    border: 1px solid var(--color-border-2);
    box-sizing: border-box;
  }

  .custom-checkbox-card-mask-dot {
    width: 8px;
    height: 8px;
    border-radius: 2px;
  }

  .custom-checkbox-card-title {
    color: var(--color-text-1);
    font-size: 14px;
    font-weight: bold;
  }

  .custom-checkbox-card:hover,
  .custom-checkbox-card-checked,
  .custom-checkbox-card:hover .custom-checkbox-card-mask,
  .custom-checkbox-card-checked .custom-checkbox-card-mask {
    border-color: rgb(var(--primary-6));
  }

  .custom-checkbox-card-checked {
    background-color: var(--color-primary-light-1);
  }

  .custom-checkbox-card:hover .custom-checkbox-card-title,
  .custom-checkbox-card-checked .custom-checkbox-card-title {
    color: rgb(var(--primary-6));
  }

  .custom-checkbox-card-checked .custom-checkbox-card-mask-dot {
    background-color: rgb(var(--primary-6));
  }
</style>

<style>
  .arco-checkbox {
    width: 100%;
    margin-top: 15px;
  }

  .arco-checkbox-group {
    width: 100%;
  }
</style>