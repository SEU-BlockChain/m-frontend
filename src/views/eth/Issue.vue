<template>
  <div class="animation-wrap">
    <var-app-bar
      color="white"
      text-color="#333"
      title-position="center"
      :elevation="false"
    >
      <template #left>
        <var-button
          round
          text
          color="transparent"
          text-color="#333"
          @click="this.$router.return('/home')"
        >
          <var-icon name="chevron-left" :size="24"/>
        </var-button>
      </template>
      <template #default>
        <div class="title">预测详情</div>
      </template>
    </var-app-bar>

    <var-divider margin="0"/>
    <var-pull-refresh v-model="is_refresh" @refresh="reload">
      <div class="info" v-if="prediction_info">

        <transition name="bloom" appear>
          <div>
            <var-space align="center" :wrap="false">
              <var-image
                style="border: 1px solid #f0f1f5"
                radius="50%"
                height="40px"
                width="40px"
                :src="this.$settings.cos_url+prediction_info._info.icon"
              />
              <div class="desc">{{prediction_info._info.desc}}</div>
            </var-space>

            <var-space justify="space-between" align="center">
              <var-space>
                <var-space justify="start" align="center" size="mini">
                  <div class="info-text">总体量:</div>
                  <div class="info-value">{{Number(prediction_info._totalShare)+Number(prediction_info._totalPool)*2}}
                  </div>
                </var-space>

                <var-space justify="start" align="center" size="mini">
                  <div class="info-text">流动池:</div>
                  <div class="info-value">{{prediction_info._totalPool}}</div>
                </var-space>

                <var-space justify="start" align="center" size="mini">
                  <div class="info-text">权益池:</div>
                  <div class="info-value">{{prediction_info._equity}}</div>
                </var-space>
              </var-space>
              <div class="state" :class="['state0','state1','state2','state3'][state]">
                {{["未开始","进行中","待结算","已结束"][state]}}
              </div>
            </var-space>

            <div class="address">
              <div>地址:{{this.$route.params.address}}</div>
              <div>创建者:{{prediction_info._owner}}</div>
            </div>
          </div>
        </transition>

        <a-divider style="margin: 5px 0"/>

        <transition name="bloom" appear>
          <div id="chart-wrap">
            <div id="chart"/>
          </div>
        </transition>
      </div>

      <div class="panel" v-if="prediction_info">
        <var-tabs v-model:active="active">
          <var-tab>买入</var-tab>
          <var-tab>卖出</var-tab>
          <var-tab>流动池</var-tab>
        </var-tabs>

        <var-tabs-items v-model:active="active">
          <var-tab-item>
            <div @click="buy_selected=k" v-for="(option,k) in prediction_info._options">
              <div class="price" :class="{buy_active:buy_selected===k}">
                <var-space justify="space-between">
                  <div>{{option.desc}}</div>
                  <div>{{(Number(option.share)/Number(prediction_info._totalShare)).toFixed(3)}}</div>
                </var-space>
              </div>

              <div class="amount">
                <var-space justify="space-between">
                  <div class="my-share">当前持有{{position.share?.[k]??0}}份</div>
                  <div class="total-share">共{{option.share}}份</div>
                </var-space>
              </div>
            </div>

            <a-divider/>
            <div class="input" v-if="this.wallet.address">
              <a-input-number v-model="buy_num" :hide-button="true" placeholder="请输入购买份数" size="large" allow-clear
                              @input="buy_estimate">
                <template #append>
                  份
                </template>
              </a-input-number>
            </div>

            <transition name="bloom" appear>
              <div class="estimate" v-if="long_estimate.show">
                <var-space justify="space-between">
                  <div class="estimate-text">消耗PMB</div>
                  <div class="estimate-value">{{long_estimate.amount}}</div>
                </var-space>
                <div class="equity">(含手续费{{long_estimate.equity}})</div>

                <var-space justify="space-between">
                  <div class="estimate-text">均价</div>
                  <div class="estimate-value">{{(Number(long_estimate.amount)/Number(long_estimate.share)).toFixed(3)}}
                  </div>
                </var-space>

                <var-button :disabled="buy_disable" block type="success" style="padding: 15px;margin-top: 10px;"
                            @click="buy_share">购买
                </var-button>
              </div>

            </transition>
          </var-tab-item>

          <var-tab-item>
            <div @click="sell_selected=k" v-for="(option,k) in prediction_info._options">
              <div class="price" :class="{sell_active:sell_selected===k}">
                <var-space justify="space-between">
                  <div>{{option.desc}}</div>
                  <div>{{(Number(option.share)/Number(prediction_info._totalShare)).toFixed(3)}}</div>
                </var-space>
              </div>

              <div class="amount">
                <var-space justify="space-between">
                  <div class="my-share">当前持有{{position.share?.[k]??0}}份</div>
                  <div class="total-share">共{{option.share}}份</div>
                </var-space>
              </div>
            </div>

            <a-divider/>
            <div class="input" v-if="this.wallet.address">
              <a-input-number v-model="sell_num" :hide-button="true" placeholder="请输入卖出份数" size="large" allow-clear
                              @input="sell_estimate">
                <template #append>
                  份
                </template>
              </a-input-number>
            </div>

            <transition name="bloom" appear>
              <div class="estimate" v-if="short_estimate.show">
                <var-space justify="space-between">
                  <div class="estimate-text">获得PMB</div>
                  <div class="estimate-value">{{short_estimate.amount}}</div>
                </var-space>

                <var-space justify="space-between">
                  <div class="estimate-text">单价</div>
                  <div class="estimate-value">
                    {{(Number(short_estimate.amount)/Number(short_estimate.share)).toFixed(3)}}
                  </div>
                </var-space>

                <var-button :disabled="sell_disable" block type="danger" style="padding: 15px;margin-top: 10px;"
                            @click="sell_share">卖出
                </var-button>
              </div>
            </transition>
          </var-tab-item>

          <var-tab-item>
            <div class="pool-wrap">
              <var-progress
                :value="(100*position.pool/prediction_info._totalPool).toFixed(0)"
                line-width="20"
                color="#ff9f00" track-color="#f5cb90"
              />
              <var-space justify="space-between">
                <div class="tip">我的:{{position.pool??0}}</div>
                <div class="tip">全部:{{prediction_info._totalPool}}</div>
              </var-space>
            </div>

            <a-divider/>
            <div class="input" v-if="this.wallet.address">
              <a-input-number v-model="pool_num" :hide-button="true" placeholder="购买流动池份额" size="large" allow-clear>
                <template #append>
                  PMB
                </template>
              </a-input-number>
              <var-button block type="info" :disabled="!pool_num" style="padding: 15px;margin-top: 10px;"
                          @click="buy_pool">购买流动池
              </var-button>
            </div>

          </var-tab-item>
        </var-tabs-items>
      </div>

      <div style="height: 30vh"></div>
    </var-pull-refresh>
  </div>
</template>

<script>
  import * as echarts from "echarts"

  export default {
    name: "Issue",
    watch: {
      buy_selected(v1, v2) {
        if (v1 !== v2) {
          this.long_estimate.show = false
          this.buy_num = null
        }
      },
      sell_selected(v1, v2) {
        if (v1 !== v2) {
          this.short_estimate.show = false
          this.sell_num = null
        }
      }
    },
    data() {
      return {
        is_refresh: false,
        wallet: this.$store.state.wallet,
        prediction_info: null,
        address: this.$route.params.address,
        active: 0,
        position: {
          share: [],
          pool: null
        },
        buy_selected: 0,
        buy_num: null,
        long_estimate: {
          amount: 0,
          share: 0,
          equity: 0,
          show: false
        },
        sell_selected: 0,
        sell_num: null,
        short_estimate: {
          amount: 0,
          share: 0,
          equity: 0,
          show: false
        },
        pool_num: null,

        buy_disable: true,
        sell_disable: true,
      }
    },
    methods: {
      buy_estimate(value) {
        if (value) {
          this.prediction.methods.longOptionEstimate(this.buy_selected, value).call({
            from: this.wallet.address
          }).then(res => {
            this.long_estimate.show = true
            this.long_estimate.amount = res._amount
            this.long_estimate.share = value
            this.long_estimate.equity = res._equity
            this.buy_disable = false
          }).catch(err => {
            switch (err.message) {
              case "Returned error: execution reverted: no enough token":
                this.$tip({
                  content: "PMB不足",
                  type: "warning",
                  duration: 1000
                })
            }
            this.buy_disable = true
          })
        } else {
          this.long_estimate.show = false
          this.buy_num = null
          this.buy_disable = true
        }
      },
      sell_estimate(value) {
        if (value !== undefined) {
          this.prediction.methods.shortOptionEstimate(this.sell_selected, value).call({
            from: this.wallet.address
          }).then(res => {
            this.short_estimate.show = true
            this.short_estimate.amount = res._amount
            this.short_estimate.share = value
            this.short_estimate.equity = res._equity
            this.sell_disable = false
          }).catch(err => {
            switch (err.message) {
              case "Returned error: execution reverted: insufficient share":
                this.$tip({
                  content: "没有足够的份数",
                  type: "warning",
                  duration: 1000
                })
            }
            this.sell_disable = true
          })
        } else {
          this.short_estimate.show = false
          this.sell_num = null
          this.sell_disable = true
        }
      },
      buy_share() {
        this.$dialog(`确定花费${this.long_estimate.amount}购买${this.long_estimate.share}份${this.prediction_info._options[this.buy_selected].desc}吗`).then(res => {
          if (res === "confirm") {
            this.prediction.methods.longOption(this.buy_selected, this.buy_num).send({
              from: this.wallet.address
            }).then(res => {
              this.reload()
              this.long_estimate.show = false
              this.buy_num = null
              this.$tip({
                content: "已购买",
                type: "success",
                duration: 1000
              })
            }).catch(err => {
                this.$tip({
                  content: `购买失败${err.message}`,
                  type: "warning",
                  duration: 2000
                })
              }
            )
          }
        })
      },
      sell_share() {
        this.$dialog(`确定卖出${this.short_estimate.share}份${this.prediction_info._options[this.sell_selected].desc}获取${this.short_estimate.amount} PMB吗`).then(res => {
          if (res === "confirm") {
            this.prediction.methods.shortOption(this.sell_selected, this.sell_num).send({
              from: this.wallet.address
            }).then(res => {
              this.reload()
              this.short_estimate.show = false
              this.sell_num = null
              this.$tip({
                content: "已卖出",
                type: "success",
                duration: 1000
              })
            }).catch(err => {
                this.$tip({
                  content: `卖出失败${err.message}`,
                  type: "warning",
                  duration: 2000
                })
              }
            )
          }
        })
      },
      buy_pool() {
        this.$dialog(`确定买入${this.pool_num}的流动性吗`).then(res => {
          if (res === "confirm") {
            this.prediction.methods.longPool(this.pool_num).send({
              from: this.wallet.address
            }).then(res => {
              this.reload()
              this.short_estimate.show = false
              this.buy_num = null
              this.$tip({
                content: "以买入流动池",
                type: "success",
                duration: 1000
              })
            }).catch(err => {
                this.$tip({
                  content: `买入失败${err.message}`,
                  type: "warning",
                  duration: 2000
                })
              }
            )
          }
        })
      },
      get_info() {
        return this.prediction.methods.predictionInfo().call()
      },
      get_position() {
        for (let i in this.prediction_info._options) {
          this.prediction.methods.shareOf(this.wallet.address, i).call().then(res => {
            this.position.share[i] = res
          })
        }
        this.prediction.methods.poolOf(this.wallet.address).call().then(res => {
          this.position.pool = res
        })
      },
      reload() {
        this.get_info().then(res => {
          this.prediction_info = res
          this.get_change()

          if (this.wallet.address) {
            this.get_position()
          }
          this.is_refresh = false
        })
      },
      get_change() {
        let lines = []

        for (let i of this.prediction_info._options) {
          lines.push({
            name: i.desc,
            points: []
          })
        }

        this.prediction.getPastEvents('ShareChangeEvent', {
          fromBlock: 0,
          toBlock: 'latest'
        }).then(res => {
          for (let record of res) {
            record = record.returnValues
            let option_id = Number(record.optionId)
            let current_length = lines[option_id].points.length
            let total
            if (current_length) {
              total = Number(lines[option_id].points[current_length - 1].total) - Number(lines[option_id].points[current_length - 1].value) + Number(record.share)
            } else {
              total = Number(this.prediction_info._init_amount) * this.prediction_info._options.length
            }
            for (let line_id = 0; line_id < lines.length; line_id++) {
              if (line_id === Number(option_id)) {
                lines[line_id].points.push({
                  timestamp: record.timestamp,
                  value: Number(record.share),
                  total: Number(total)
                })
              } else {
                lines[line_id].points.push({
                  timestamp: record.timestamp,
                  value: current_length ? lines[line_id].points[current_length - 1].value : this.prediction_info._init_amount,
                  total: Number(total)
                })
              }
            }
          }

          let that = this
          let parentTag = document.getElementById("chart-wrap")
          let chartTag = document.createElement("div")
          chartTag.setAttribute("id", "chart")
          parentTag.innerHTML = ""
          parentTag.appendChild(chartTag)
          let charts = echarts.init(document.getElementById("chart"))
          charts.resize({height: '400px'})
          charts.setOption({
            tooltip: {
              trigger: 'axis'
            },
            legend: {
              data: lines.map(x => x.name)
            },
            grid: {
              left: '3%',
              right: '4%',
              bottom: '20px',
              containLabel: true
            },

            toolbox: {
              feature: {
                saveAsImage: {}
              }
            },

            xAxis: {
              type: 'time',
              boundaryGap: false,
            },

            yAxis: {
              type: 'value',
              min: 0,
              max: 1,
            },

            series: lines.map(x => {
              return {
                name: x.name,
                type: 'line',
                symbol: "none",
                smooth: true,
                data: x.points.map(y => [Number(y.timestamp) * 1000, (y.value / y.total).toFixed(3)])
              }
            })
          })
        })
      }
    },
    computed: {
      state() {
        let now = Math.round(new Date().getTime() / 1000)
        let start = Number(this.prediction_info._info.start)
        let end = Number(this.prediction_info._info.end)
        let settled = this.prediction_info._settled
        if (now < start) {
          return 0
        } else if (start <= now && now < end) {
          return 1
        } else if (end <= now && !settled) {
          return 2
        } else {
          return 3
        }
      }
    },
    created() {
      this.prediction = new this.wallet.web3.eth.Contract(this.$abi.binaryPrediction, this.address)
      this.reload()
    }
  }
</script>

<style scoped>
  .pool-wrap {
    padding: 20px 20px 0;
  }

  .equity {
    margin-bottom: 10px;
    display: flex;
    flex-direction: row-reverse;
    font-size: 12px;
    color: #888888;
  }

  .animation-wrap {
    background-color: #f9f9f9;
  }

  .title {
    color: #1652f0;
    font-size: 18px;
    font-weight: bold;
  }

  .info {
    margin: 10px;
    border-radius: 5px;
    border: 1px solid #f0f1f5;
    background-color: white;
    padding: 10px;
  }

  .panel {
    border-radius: 5px;
    border: 1px solid #f0f1f5;
    background-color: white;
    margin: 10px;
  }

  .desc {
    font-size: 18px;
    line-height: 24px;
    font-weight: 500;
  }

  .info-text {
    font-size: 12px;
    line-height: 12px;
    color: #888888;
  }

  .info-value {
    font-size: 15px;
    line-height: 12px;
    color: black;
  }

  .price {
    margin: 10px 20px 3px;
    background-color: #f5f5f5;
    padding: 10px;
    font-size: 16px;
    border-radius: 3px;
    font-family: "85W";
  }

  .input {
    margin: 10px 20px;
  }

  .amount {
    margin: 0 24px;
  }

  .total-share {
    font-size: 13px;
    color: #888888;
  }

  .my-share {
    font-size: 13px;
    color: #4ebaee;
  }

  .estimate {
    margin: 10px 24px;
  }

  .estimate-text {
    line-height: 20px;
  }

  .estimate-value {
    color: #477aff;
    font-weight: bold;
  }

  .buy_active {
    background-color: #05b16a;
    color: white;
  }

  .sell_active {
    background-color: red;
    color: white;
  }

  .state {
    font-size: 12px;
    text-align: center;
    padding: 3px 0;
    margin: 5px;
    border-radius: 2px;
    color: #f6f6f6;
    background-color: #05b16a;
    width: 50px;
  }

  .state0 {
    background-color: #4ebaee;
  }


  .state1 {
    background-color: #05b16a;
  }

  .state2 {
    background-color: red;
  }


  .state3 {
    background-color: #888888;
  }

  .address {
    font-size: 10px;
    color: #aaaaaa;
  }

  .tip {
    line-height: 20px;
    font-size: 12px;
    color: #333;
  }
</style>