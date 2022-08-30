<template>
  <div class="animation-wrap">
    <var-pull-refresh v-model="is_refresh" @refresh="refresh">

      <div class="head">OurChain</div>
      <var-swipe class="swipe" :autoplay="3000" v-if="banner_list.length">
        <var-swipe-item v-for="banner in banner_list" @click="this.$router.push(banner.url)">
          <img :src="this.$settings.cos_url+`static/${banner.img}`">
        </var-swipe-item>
      </var-swipe>

      <div class="all-topic" v-if="total!==null">
        <var-list
          :finished="finished"
          v-model:loading="loading"
          @load="load_address"
        >
          <div v-for="address in address_list">
            <issue-detail-card :address="address"></issue-detail-card>
          </div>
        </var-list>
      </div>
    </var-pull-refresh>

    <var-button v-if="this.$store.state.user?.is_staff" class="add-issue" type="success" round @click="add_issue">
      <var-icon size="28" name="plus"/>
    </var-button>

    <var-popup v-model:show="add_issue_show" style="border-radius: 5px">
      <var-card class="card">
        <template #extra>
          <div class="add-wrap">
            <var-space direction="column" align="center" justify="center">
              <div class="add-title">创建话题</div>

              <var-uploader
                style="width: 100px;margin: 0 calc(50% - 50px)"
                v-model="_"
                :maxlength="1"
                :maxsize="1024*1024"
                accept="image/jpeg,image/gif,image/png,image/bmp"
                @after-read="upload"
                @oversize="oversize"/>

              <var-input
                style="padding: 10px"
                :hint="false"
                placeholder="描述"
                v-model="desc"
              />
              <var-input
                style="padding: 10px"
                :hint="false"
                placeholder="开始日期"
                v-model="start"
              />
              <var-input
                style="padding: 10px"
                :hint="false"
                placeholder="结束日期"
                v-model="end"
              />
              <var-input
                style="padding: 10px"
                :hint="false"
                placeholder="初始金额"
                v-model="init_amount"
              />
              <var-input
                style="padding: 10px"
                :hint="false"
                placeholder="选项"
                v-model="options"
              />

              <var-button style="padding:0 20px" size="small" block type="success" @click="create_topic">创建</var-button>
            </var-space>
          </div>
        </template>
      </var-card>
    </var-popup>
  </div>
</template>

<script>
  import IssueDetailCard from "../../components/card/IssueDetailCard";

  export default {
    name: "Home",
    components: {IssueDetailCard},
    emits: ["active"],
    data() {
      return {
        search: "",
        address_list: [],
        wallet: this.$store.state.wallet,
        add_issue_show: false,
        title: "",
        icon: "",
        _: [],
        desc: "",
        start: "",
        end: "",
        init_amount: null,
        options: "",
        total: null,
        finished: false,
        loading: false,
        next: null,
        current_page: null,
        is_refresh: false,
        banner_list: []
      }
    },
    methods: {
      add_issue() {
        this.add_issue_show = true
      },
      upload(file) {
        let forms = new FormData()
        forms.append('file', file.file)
        this.$request.api.post(
          "common/image/issue/",
          forms,
          {headers: {'Content-Type': 'multipart/form-data'}}
        ).then(res => {
          if (res.data.code === 167) {
            this.icon = res.data.result.data
          } else {
            this.$tip({
              content: res.data.msg,
              type: "warning",
              duration: 2000,
            })
          }
        })
      },
      create_topic() {
        console.log([
          Number(this.init_amount),
          [
            (new Date(this.start)).getTime() / 1000,
            (new Date(this.end)).getTime() / 1000,
            this.desc,
            this.icon,
          ],
          this.options.split(" ")
        ])
        this.wallet.market.methods.createBinaryPrediction(
          this.init_amount,
          [
            (new Date(this.start)).getTime() / 1000,
            (new Date(this.end)).getTime() / 1000,
            this.desc,
            this.icon,
          ],
          this.options.split(" ")
        ).send({
          from: this.wallet.address
        }).then(res => {
          console.log(res);
        })
      },
      oversize() {
        this.$tip({
          content: "图片不超过1MB",
          type: "warning",
          duration: 2000,
        })
      },
      load_address() {
        if (this.current_page === null) {
          this.current_page = Math.floor((this.total - 1) / 10 + 1)
        }
        this.wallet.market.methods.getRange(this.current_page).call().then(res => {
          let data = res.filter(x => x !== "0x0000000000000000000000000000000000000000").reverse()
          for (let i of data) {
            this.address_list.push(i)
          }
          this.loading = false
          this.current_page--
          if (this.current_page === 0) {
            this.finished = true
          }
          if (this.current_page === Math.floor((this.total - 1) / 10) && this.current_page) {
            this.wallet.market.methods.getRange(this.current_page).call().then(res => {
              let data = res.filter(x => x !== "0x0000000000000000000000000000000000000000").reverse()
              for (let i of data) {
                this.address_list.push(i)
              }
              this.loading = false
              this.current_page--
              if (this.current_page === 0) {
                this.finished = true
              }
            })
          }
        })
      },
      refresh() {
        this.wallet.market.methods.total().call().then(res => {
          this.total = res
          this.finished = false
          this.loading = false
          this.next = null
          this.current_page = null
          this.address_list = []
          this.load_address()
          this.is_refresh = false
        })
      }
    },
    created() {
      this.$emit("active", 0)
      this.wallet.market.methods.total().call().then(res => {
        this.total = res
      })
      this.$request.api.get('/common/sticky/banner?category=0').then(res => {
        if (res.data.code === 177) {
          this.banner_list = res.data.result.banner
        } else {
          this.$tip({
            content: res.data.msg,
            type: "warning",
            duration: 1000,
          })
        }
      })
    },
    activated() {
      this.$emit("active", 0)
    }
  }
</script>

<style scoped>
  .head {
    height: 44px;
    line-height: 44px;
    font-weight: bold;
    padding-left: 10px;
    font-size: 18px;
    background-color: white;
  }


  @media screen and (min-width: 840px) {
    .swipe {
      border-radius: 5px;
      height: 232px;
    }
  }

  @media screen and (max-width: 840px) {
    .swipe {
      border-radius: 5px;
      height: 50vw;
    }

    .swipe img {
      height: 50vw;
      width: 100%;
      object-fit: fill;
    }
  }

  .swipe img {
    height: 232px;
    pointer-events: none;
  }


  .all-topic {
    padding: 3px 3px 30vh;
    min-height: 100vh;
  }

  .add-issue {
    position: fixed;
    right: 15px;
    bottom: 120px;
  }

  .add-wrap {
    width: 80vw;
    padding: 20px 20px 40px;
  }

  .add-title {
    font-size: 16px;
    font-weight: bold;
    text-align: center;
    color: #666666;
    margin: 10px;
  }
</style>