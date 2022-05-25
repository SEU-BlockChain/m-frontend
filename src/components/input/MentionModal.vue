<template>
  <div id="mention-modal" :style="style">
    <var-input
      ref="input"
      id="search"
      class="search"
      :hint="false"
      :line="false"
      placeholder="搜索用户"
      v-model="search"
      @input="reload"
    />
    <var-list
      style="--list-finished-height:25px"
      :finished="finished"
      v-model:loading="loading"
      @load="load"
      :immediate-check="false"
    >
      <div :key="item" v-for="item in list">
        <div class="user" @click="insertMentionHandler(item.id,item.username)">
          <div class="username">{{item.username}}</div>
          <var-chip size="mini" :round="false" type="info">ID:{{item.id}}</var-chip>
        </div>
      </div>
    </var-list>
  </div>
</template>

<script>
  export default {
    name: 'MentionModal',
    data() {
      return {
        style: {},
        search: '',
        finished: false,
        loading: false,
        list: []
      }
    },
    methods: {
      reload() {
        if (!this.search) return
        this.finished = false
        this.list = []
        this.loading = true
        this.next = null
        this.load()
      },
      insertMentionHandler(id, name) {
        this.$emit('insertMention', id, name)
        this.$emit('hideMentionModal') // 隐藏 modal
      },
      load() {
        this.$request.api.get(
          this.next || `/user/info/?search=${this.search}`
        ).then(res => {
          if (res.data.code === 142) {
            this.total = res.data.result["count"]
            for (let i of res.data.result.results) {
              this.list.push(i)
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
    mounted() {
      const domSelection = document.getSelection()
      const domRange = domSelection?.getRangeAt(0)
      if (domRange == null) return
      const rect = domRange.getBoundingClientRect()

      if (rect.left > 0.5 * window.screen.width) {
        this.style.right = `${window.screen.width - rect.right + 20}px`
      } else {
        this.style.left = `${rect.left + 5}px`
      }
      if (rect.top + 300 > window.screen.height) {
        this.style.bottom = `${window.screen.height - rect.bottom - 15}px`
      } else {
        this.style.top = `${rect.top - 15}px`
      }
      this.$refs.input.focus()

      setTimeout(() => {
      }, 1000)
    },

  }
</script>
<style>
  #mention-modal {
    border-radius: 3px;
    position: fixed;
    border: 1px solid #ccc;
    background-color: #fff;
    padding: 5px;
    overflow: scroll;
    width: 50vw;
    max-height: 200px;
  }

  #mention-modal input {
    width: 100px;
    outline: none;
  }

  #mention-modal ul {
    padding: 0;
    margin: 0;
  }

  #mention-modal ul li {
    list-style: none;
    cursor: pointer;
    padding: 3px 0;
    text-align: left;
  }

  #mention-modal ul li:hover {
    text-decoration: underline;
  }

  .search {
    border: 1px solid #ccc;
    border-radius: 2px;
    padding: 0 5px;
  }

  .user {
    display: flex;
    padding: 5px;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #eee;
  }

  .username {
    font-size: 14px;
  }
</style>