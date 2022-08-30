<template>
  <transition name="bloom" appear>
    <div @click="this.$router.push(`/issue/${address}`)" v-if="prediction_info" class="card"
         :class="['card-state0','card-state1','card-state2','card-state3'][state]">
      <div class="head">

        <var-space align="start" :wrap="false" justify="space-between">
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
          <div class="state" :class="['state0','state1','state2','state3'][state]">
            {{["未开始","进行中","待结算","已结束"][state]}}
          </div>
        </var-space>

        <var-space align="center" justify="space-between" style="margin: 3px">
          <div class="date">开始:{{date(prediction_info._info.start)}}</div>
          <div class="date">截止:{{date(prediction_info._info.end)}}</div>
        </var-space>

        <var-divider dashed/>
        <var-space justify="space-around">
          <var-space v-for="option in prediction_info._options" direction="column" justify="center" align="center">
            <div class="option-text">{{option.desc}}</div>
            <div class="option-value">{{(Number(option.share)/Number(prediction_info._totalShare)).toFixed(3)}}</div>
          </var-space>
        </var-space>
        <var-divider dashed/>

        <var-space justify="space-around">
          <var-space justify="start" align="center" size="mini">
            <div class="info-text">总体量:</div>
            <div class="info-value">{{Number(prediction_info._totalShare)+Number(prediction_info._totalPool)*2}}</div>
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

        <div style="height: 10px;"/>
        <var-space>
          <div class="address">地址:{{address}}</div>
        </var-space>
      </div>
    </div>
  </transition>
</template>

<script>
  export default {
    name: "IssueDetailCard",
    props: {
      address: null,
    },
    data() {
      return {
        wallet: this.$store.state.wallet,
        prediction: null,
        prediction_info: null,
        position: {
          share: [],
          pool: null
        }
      }
    },
    methods: {
      date(timestamp) {
        let date = new this.$calc.DateParser(timestamp * 1000)
        return date.all()
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
      this.prediction.methods.predictionInfo().call().then(res => {
        this.prediction_info = res
      })
    }
  }
</script>

<style scoped>
  .card {
    background-color: white;
    padding: 2px 3px;
    margin: 3px;
    border-radius: 10px;
  }

  .desc {
    font-size: 15px;
    line-height: 18px;
    flex-grow: 1;
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

  .address {
    font-size: 10px;
    color: #aaaaaa;
  }

  .date {
    font-size: 12px;
    color: #888888;
  }

  .option-text {
    text-align: center;
    color: black;
  }

  .option-value {
    text-align: center;
    border-radius: 3px;
    font-size: 14px;
    font-weight: bold;
    padding: 3px 5px;
    color: #1652f0;
    background-color: #f0f1f5;
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

  .card-state0 {
    border: 2px solid #4ebaee;
  }

  .state0 {
    background-color: #4ebaee;
  }

  .card-state1 {
    border: 2px solid #05b16a;
  }

  .state1 {
    background-color: #05b16a;
  }

  .card-state2 {
    border: 2px solid red;
  }

  .state2 {
    background-color: red;
  }

  .card-state3 {
    border: 2px solid #888888;
  }

  .state3 {
    background-color: #888888;
  }
</style>