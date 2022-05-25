<template>
  <div class="animation-wrap">
    <var-app-bar class="app-bar" color="white" text-color="#333" title="系统通知">
      <template #left>
        <var-button
          round
          text
          color="transparent"
          text-color="#333"
          @click="this.$router.return('/message')"
        >
          <var-icon name="chevron-left" :size="24"/>
        </var-button>
      </template>
    </var-app-bar>

    <div class="container">
      <var-list
        :finished="finished"
        v-model:loading="loading"
        @load="load"
        :immediate-check="false"
      >
        <div v-for="system in system_list">
          <div v-if="remove.indexOf(system.id)===-1">
            <div class="wrap">
              <div class="w-container" v-html="this.$xss(system.content)"/>
              <div class="foot">
                <div class="time">{{this.$calc.filters.date(system.time)}}</div>
                <img
                  class="delete"
                  @click.stop="delete_system(system)"
                  src="~assets/img/delete.svg"
                  height="16"
                  alt="">
              </div>
            </div>
          </div>
        </div>
      </var-list>
    </div>
  </div>
</template>

<script>
  export default {
    name: "System",
    data() {
      return {
        loading: true,
        finished: false,
        system_list: [],
        next: null,
        remove: []
      }
    },
    methods: {
      delete_system(system) {
        this.$dialog("是否删除记录").then(res => {
          if (res !== "confirm") return;
          this.$request.api.delete(
            `message/system/${system.id}/`,
          ).then(res => {
            if (res.data.code === 146) {
              this.$tip({
                content: "已删除记录",
                type: "success",
                duration: 1000,
              })
              this.remove.push(system.id)
            } else {
              this.$tip({
                content: res.data.msg,
                type: "warning",
                duration: 1000,
              })
            }
          })
        })
      },
      load() {
        this.$request.api.get(
          this.next || `/message/system`
        ).then(res => {
          if (res.data.code === 145) {
            for (let i of res.data.result.results) {
              this.system_list.push(i)
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
  .app-bar {
    width: 100vw;
    position: fixed;
    left: 0;
    top: 0;
    z-index: 100;
  }

  .container {
    padding-top: 54px;
    min-height: 120vh;
    background-color: #f6f6f6;

  }

  .wrap {
    background-color: white;
    padding: 10px;
    margin-bottom: 5px;
    border-radius: 3px;
  }

  .foot {
    display: flex;
    justify-content: space-between;
  }

  .time {
    font-size: 12px;
    color: #999;
  }
</style>