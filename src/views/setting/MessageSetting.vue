<template>
  <div class="animation-wrap">
    <var-app-bar class="app-bar" color="white" text-color="#333" title="消息设置">
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
    </var-app-bar>
    <div style="height: 54px;"/>

    <div class="banner">消息设置</div>
    <div class="option" v-ripple="{ color: '#ccc' }" @click="edit('dynamic')">
      <div class="option-text">动态</div>
      <div class="option-tip">{{tip[settings?.dynamic]}}
        <var-icon name="chevron-right"/>
      </div>
    </div>

    <div class="option" v-ripple="{ color: '#ccc' }" @click="edit('reply')">
      <div class="option-text">回复我的</div>
      <div class="option-tip">{{tip[settings?.reply]}}
        <var-icon name="chevron-right"/>
      </div>
    </div>

    <div class="option" v-ripple="{ color: '#ccc' }" @click="edit('at')">
      <div class="option-text">@我的</div>
      <div class="option-tip">{{tip[settings?.at]}}
        <var-icon name="chevron-right"/>
      </div>
    </div>

    <div class="option" v-ripple="{ color: '#ccc' }" @click="edit('like')">
      <div class="option-text">收到的赞</div>
      <div class="option-tip">{{tip[settings?.like]}}
        <var-icon name="chevron-right"/>
      </div>
    </div>

    <div class="option" v-ripple="{ color: '#ccc' }" @click="edit('system')">
      <div class="option-text">系统消息</div>
      <div class="option-tip">{{tip[settings?.system]}}
        <var-icon name="chevron-right"/>
      </div>
    </div>

    <div class="option" v-ripple="{ color: '#ccc' }" @click="edit('private')">
      <div class="option-text">私信</div>
      <div class="option-tip">{{tip[settings?.private]}}
        <var-icon name="chevron-right"/>
      </div>
    </div>


    <var-popup style="border-radius: 2px" v-model:show="show">
      <div class="popup">
        <var-radio-group v-model="value" @change="submit">
          <div class="radio">
            <div>
              <div class="radio-text">屏蔽所有</div>
              <div class="radio-tip">不接收消息</div>
            </div>
            <var-radio :checked-value="0"/>
          </div>
          <var-divider margin="0"/>

          <div class="radio">
            <div>
              <div class="radio-text">接收但不提示</div>
              <div class="radio-tip">接收消息但没有红点提示</div>
            </div>
            <var-radio :checked-value="1"/>
          </div>
          <var-divider margin="0"/>

          <div class="radio" v-if="['dynamic','system'].indexOf(type)===-1">
            <div>
              <div class="radio-text">关注的人</div>
              <div class="radio-tip">只提示关注的人的消息</div>
            </div>
            <var-radio :checked-value="2"/>
          </div>
          <var-divider margin="0" v-if="['dynamic','system'].indexOf(type)===-1"/>

          <div class="radio">
            <div>
              <div class="radio-text">始终提醒</div>
              <div class="radio-tip">红点提醒收到的消息</div>
            </div>
            <var-radio :checked-value="3"/>
          </div>
        </var-radio-group>
      </div>
    </var-popup>
  </div>
</template>

<script>
  export default {
    name: "MessageSetting",
    data() {
      return {
        settings: null,
        show: false,
        type: null,
        tip: [
          "全部拒收",
          "都不提醒",
          "关注的人",
          "始终提醒",
        ],
        value: null
      }
    },
    methods: {
      edit(type) {
        this.type = type
        this.value = this.settings[type]
        this.show = true
      },
      submit(id) {
        this.$request.api.post(
          "/message/message_setting/",
          {
            [this.type]: id,
          }
        ).then(res => {
            if (res.data.code === 145) {
              this.$tip({
                content: "修改成功",
                type: "success",
                duration: 1000,
              })
              this.settings[this.type] = id
            }
          }
        )
      }
    },
    created() {
      this.$request.api.get(
        "/message/message_setting"
      ).then(res => {
          if (res.data.code === 144) {
            this.settings = res.data.result
          }
        }
      )
    }
  }
</script>

<style scoped>
  .banner {
    color: #333333;
    line-height: 20px;
    margin: 10px 5px 0;
    font-size: 12px;
  }

  .option {
    display: flex;
    justify-content: space-between;
    width: 100vw;
    background-color: white;
    padding: 15px;
    align-items: center;
    border-bottom: 1px solid #ddd;
    line-height: 20px;
  }

  .option-text {
    font-weight: 500;
  }

  .option-tip {
    color: #666666;
    font-size: 14px;
  }

  .app-bar {
    width: 100vw;
    position: fixed;
    left: 0;
    top: 0;
    z-index: 100;
  }

  .popup {
    width: 80vw;
    padding: 10px;
  }

  .radio {
    padding: 10px;
    align-items: center;
    width: 100%;
    display: flex;
    justify-content: space-between;
  }

  .radio-text {
    line-height: 20px;
  }

  .radio-tip {
    line-height: 16px;
    font-size: 12px;
    color: #666666;
  }
</style>