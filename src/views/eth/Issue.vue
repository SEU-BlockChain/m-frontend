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
                  <div class="info-value">
                    {{Number(prediction_info._totalShare)/prediction_info._options.length+Number(prediction_info._totalPool)*prediction_info._options.length}}
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
          <var-tab>{{prediction_info._settled?"我的":"买入"}}</var-tab>
          <var-tab v-if="!prediction_info._settled">卖出</var-tab>
          <var-tab>流动池</var-tab>
        </var-tabs>

        <var-tabs-items v-model:active="active">
          <var-tab-item>
            <div @click="buy_selected=k" v-for="(option,k) in prediction_info._options">
              <div class="price"
                   :class="{buy_active:buy_selected===k&&!prediction_info._settled||(Number(prediction_info._correct)===k&&prediction_info._settled)}">
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

            <div v-if="state===1">
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
                    <div class="estimate-value">
                      {{(Number(long_estimate.amount)/Number(long_estimate.share)).toFixed(3)}}
                    </div>
                  </var-space>

                  <var-button :disabled="buy_disable" block type="success" style="padding: 15px;margin-top: 10px;"
                              @click="buy_share">购买
                  </var-button>
                </div>

              </transition>
            </div>
          </var-tab-item>

          <var-tab-item v-if="!prediction_info._settled">
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

            <div v-if="state===1">
              <div class="input" v-if="this.wallet.address">
                <a-input-number v-model="sell_num" :hide-button="true" placeholder="请输入卖出份数" size="large" allow-clear
                                @input="sell_estimate">
                  <template #append>
                    份
                  </template>
                </a-input-number>
              </div>
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
            <div v-if="state===1">

              <div class="input" v-if="this.wallet.address">
                <a-input-number @input="change_pool" :hide-button="true" placeholder="购买流动池份额" size="large" allow-clear>
                  <template #append>
                    PMB
                  </template>
                </a-input-number>
                <var-button block type="info" :disabled="!pool_num" style="padding: 15px;margin-top: 10px;"
                            @click="buy_pool">购买流动池
                </var-button>
              </div>
            </div>
          </var-tab-item>
        </var-tabs-items>
      </div>

    </var-pull-refresh>

    <Transition name="slide-fade">
      <div class="all-comment var-elevation--5" v-if="prediction_info">
        <var-sticky z-index="0" :offset-top="0">
          <div class="select">
            <div class="comment-text">
              评论区
            </div>

            <div class="order">
              <var-menu :offset-y="25" :offset-x="-10" v-model:show="show_order">
                <div @click="show_order = !show_order">{{order_text}}</div>
                <template #menu>
                  <div class="menu">
                    <var-cell @click="change_order(order)" v-for="order in order_list">{{order.text}}
                    </var-cell>
                  </div>
                </template>
              </var-menu>
              <var-icon name="menu-down"/>
            </div>

          </div>
          <var-divider margin="0"/>
        </var-sticky>
        <var-list
          :finished="root_comment_finished"
          v-model:loading="root_comment_loading"
          @load="root_comment_load"
        >
          <div v-for="root_comment in root_comment_list">
            <common-comment-card
              :parent="null"
              :comment="root_comment"
              :show_comment_num="true"
              @onClickOption="open_comment_option"
              @onClickContent="open_comment_editor"
              @onVote="vote_comment"
              @onClickUser="click_user"
              @onClickImg="click_img"
            >
              <template v-if="root_comment.comment_num" #children-comment>
                <div class="children-wrap" @click="open_children_comment(root_comment)">
                  <simple-comment-card
                    :comment="children_comment"
                    v-for="children_comment in root_comment.children_comment"
                  />
                  <div class="comment-tip" v-if="root_comment.comment_num>2">全部{{root_comment.comment_num}}条评论...</div>
                </div>
              </template>
            </common-comment-card>
            <var-divider margin="0" :inset="60"/>
          </div>
        </var-list>
      </div>
    </Transition>

    <div v-if="prediction_info" class="interact var-elevation--5">
      <div class="fake" @click="open_editor(null,null)">
        我有话要说...
      </div>
    </div>

    <var-popup style="border-radius: 10px 10px 0 0" overlay-class="mask" position="bottom" v-model:show="show_editor">
      <div v-if="target" class="comment">回复:{{target.author.username}}</div>
      <div v-else class="comment">发表评论</div>
      <comment-editor ref="editor"/>
      <var-space align="center" justify="end" style="padding: 10px">
        <var-button
          size="small"
          type="info"
          @click="submit_comment"
        >
          发布
        </var-button>
      </var-space>
    </var-popup>

    <var-popup position="bottom" v-model:show="show_comment_option">
      <div class="option" v-if="is_option_comment_self">
        <div class="option-item" @click="delete_comment">
          <var-icon name="trash-can-outline" size="25"/>
          <div class="option-text">删除</div>
        </div>
      </div>
      <div class="option" v-else>
        <div class="option-item">
          <var-icon name="alert-outline" size="25"/>
          <div class="option-text">举报</div>
        </div>
      </div>
    </var-popup>

    <var-popup position="bottom" style="border-radius: 5px 5px 0 0;width: 100vw" v-model:show="show_children_comment">
      <div class="children-detail">
        <div class="children-detail-head">
          <div class="children-detail-title">评论详情</div>
          <var-icon size="25" name="window-close" @click="show_children_comment=false"/>
        </div>
        <common-comment-card
          :parent="null"
          :comment="opened_comment"
          :show_comment_num="true"
          @onClickOption="open_comment_option"
          @onClickContent="open_comment_editor"
          @onVote="vote_comment"
          @onClickUser="click_user"
          @onClickImg="click_img"
        />
        <var-divider/>
        <var-list
          :finished="children_comment_finished"
          v-model:loading="children_comment_loading"
          @load="children_comment_load"
        >
          <div v-for="children_comment in children_comment_list">
            <common-comment-card
              :parent="opened_comment"
              :comment="children_comment"
              :show_comment_num="false"
              @onClickOption="open_comment_option"
              @onClickContent="open_comment_editor"
              @onVote="vote_comment"
              @onClickConversationDetail="load_conversation"
              @onClickUser="click_user"
              @onClickImg="click_img"
            />
            <var-divider inset="60" margin="0"/>
          </div>
        </var-list>
        <div style="height: 200px"/>
      </div>
    </var-popup>
    <var-popup style="border-radius: 10px;width: 80vw;max-height: 80vh" position="center" v-if="conversation_list"
               v-model:show="show_conversation">
      <common-comment-card
        :parent="opened_comment"
        :comment="conversation"
        :show_comment_num="false"
        :hide_conversation="k!==0"
        @onClickOption="open_comment_option"
        @onClickContent="open_comment_editor"
        @onVote="vote_comment"
        @onClickConversationDetail="load_conversation"
        v-for="(conversation,k) in conversation_list"
        @onClickUser="click_user"
        @onClickImg="click_img"
      />
    </var-popup>
  </div>
</template>

<script>
  import * as echarts from "echarts"
  import CommentEditor from "components/input/CommentEditor";
  import CommonCommentCard from "components/card/CommonCommentCard";
  import SimpleCommentCard from "components/card/SimpleCommentCard";

  export default {
    name: "Issue",
    components: {
      CommentEditor,
      CommonCommentCard,
      SimpleCommentCard
    },
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
      },
      show_comment_option(newValue) {
        this.$tools.mutex(newValue, () => {
          this.show_comment_option = false
        })
      },
      show_editor(newValue) {
        this.$store.commit("toggle_hide")
        if (!newValue) {
          this.parent = this.target == null
          this.share = false
        }
        this.$tools.mutex(newValue, () => {
          this.show_editor = false
        })
      },
      show_conversation(newValue) {
        if (!newValue) {
          this.conversation_list = []
        }
        this.$tools.mutex(newValue, () => {
          this.show_conversation = false
        })
      },
      show_children_comment(newValue) {
        if (!newValue) {
          this.opened_comment = null
        }
        this.$tools.mutex(newValue, () => {
          this.show_children_comment = false
        })
      },
    },
    data() {
      return {
        is_refresh: false,
        wallet: this.$store.state.wallet,
        prediction_info: null,
        address: this.$route.params.address.toUpperCase(),
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
        content: "",

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
        share: false,

        parent: null,
        target: null,
        show_editor: false,
        root_comment_list: [],
        root_comment_next: null,
        root_comment_loading: false,
        root_comment_finished: false,

        children_comment_list: [],
        children_comment_next: null,
        children_comment_loading: false,
        children_comment_finished: false,

        show_comment_option: false,
        is_option_comment_self: false,

        opened_comment: null,
        show_children_comment: false,

        show_conversation: false,
        conversation_list: []
      }
    },
    methods: {
      click_user(id) {
        this.$router.push(`/user/${id}`)
      },
      click_img(images) {
        this.$store.commit("set_image_preview", images)
      },
      load_conversation(comment) {
        this.show_conversation = true
        if (!this.conversation_list.length) {
          this.conversation_list.push(comment)
        }
        this.$request.api.get(
          `/issue/${this.address}/comment/${this.opened_comment.id}/children_comment/${comment.target_id}`
        ).then(res => {
          if (res.data.code === 116) {
            this.conversation_list.unshift(res.data.result)
          } else {
            this.$tip({
              content: res.data.msg,
              type: "warning",
              duration: 1000
            })
          }
        }).catch(err => {
          if (err.response.status === 404) {
            this.$tip({
              content: "评论不存在",
              type: "warning",
              duration: 1000
            })
          }
        })
      },

      children_comment_load() {
        this.$request.api.get(
          this.children_comment_next || `/issue/${this.address}/comment/${this.opened_comment.id}/children_comment/`,
        ).then(res => {
          if (res.data.code === 117) {
            for (let i of res.data.result.results) {
              this.children_comment_list.push(i)
            }
            this.children_comment_next = res.data.result.next
            this.children_comment_loading = false
            this.children_comment_finished = !Boolean(this.children_comment_next)
          } else {
            this.$tip({
              content: res.data.msg,
              type: "warning",
              duration: 1000,
            })
          }
        })
      },
      open_children_comment(parent) {
        this.children_comment_clear()
        this.opened_comment = parent
        this.show_children_comment = true
      },
      vote_comment(is_up, comment) {
        if (!this.$store.state.is_login) {
          this.$router.push({path: "/login", query: {bakc: true}})
          return
        }
        this.$request.api.post(
          `/issue/${this.address}/comment/${comment.id}/vote/`,
          {
            is_up
          }).then(res => {
          if (res.data.code !== 125) {
            this.$tip({
              content: res.data.msg,
              type: "warning",
              duration: 1000
            })
          } else {
            this.$calc.up_down(is_up, comment)
          }
        })
      },
      open_comment_option(comment) {
        this.is_option_comment_self = comment.author.id === this.$store.state.user.id
        this.option_comment = comment
        this.show_comment_option = true
      },
      open_comment_editor(parent, target) {
        this.open_editor(parent, target)
      },
      delete_comment() {
        this.$dialog("是否删除评论").then(res => {
          if (res !== "confirm") return;
          let url
          if (this.opened_comment) {
            url = `/issue/${this.address}/comment/${this.opened_comment.id}/children_comment/${this.option_comment.id}`
          } else {
            url = `/issue/${this.address}/comment/${this.option_comment.id}/`
          }
          this.$request.api.delete(
            url
          ).then(res => {
            if (res.data.code === 119) {
              this.$tip({
                content: "已删除",
                type: "success",
                duration: 1000
              })
              let new_root_comment_list = []
              if (this.opened_comment) {
                for (let i of this.children_comment_list) {
                  if (i.id !== this.option_comment.id) {
                    new_root_comment_list.push(i)
                  }
                }
                this.children_comment_list = new_root_comment_list
              } else {
                for (let i of this.root_comment_list) {
                  if (i.id !== this.option_comment.id) {
                    new_root_comment_list.push(i)
                  }
                }
                this.root_comment_list = new_root_comment_list
              }
              this.show_comment_option = false
            } else {
              this.$tip({
                content: res.data.msg,
                type: "warning",
                duration: 1000
              })
            }
          })
        })
      },
      root_comment_clear() {
        this.root_comment_list = []
        this.root_comment_finished = false
        this.root_comment_loading = true
        this.root_comment_next = null
      },
      children_comment_clear() {
        this.children_comment_list = []
        this.children_comment_finished = false
        this.children_comment_next = null
      },
      root_comment_reload() {
        this.root_comment_clear()
        this.root_comment_load()
      },
      change_order(order) {
        this.ordering = order.ordering
        this.order_text = order.text
        this.show_order = false
        this.root_comment_clear()
        this.root_comment_reload()
      },
      submit_comment() {
        if (this.$refs.editor.editor.isEmpty()) return;

        if (!this.parent) {
          this.$request.api.post(
            `/issue/${this.address}/comment/`,
            {
              content: this.$refs.editor.editor.getHtml(),
              share: this.share
            }
          ).then(res => {
            if (res.data.code === 118) {
              this.$tip({
                content: "评论成功",
                type: "success",
                duration: 1000,
              })
              this.show_editor = false
              res.data.result.new = true
              this.root_comment_list.unshift(res.data.result)
            } else {
              this.$tip({
                content: res.data.msg,
                type: "warning",
                duration: 1000,
              })
            }
          })
        } else {
          this.$request.api.post(
            `/issue/${this.address}/comment/${this.parent.id}/children_comment/`,
            {
              content: this.$refs.editor.editor.getHtml(),
              target_id: this.target?.id,
              share: this.share
            }
          ).then(res => {
            if (res.data.code === 118) {
              this.$tip({
                content: "评论成功",
                type: "success",
                duration: 1000,
              })
              res.data.result.new = true
              if (this.target) {
                this.children_comment_list.push(res.data.result)
              } else {
                this.parent.comment_num++
                this.children_comment_list.push(res.data.result)
                this.parent.children_comment.push(res.data.result)
              }
              this.show_editor = false
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
      open_editor(parent, target) {
        if (!this.$store.state.is_login) {
          this.$router.push({path: '/login', query: {back: true}})
          return
        }
        this.parent = parent
        this.target = target
        this.show_editor = true
      },
      root_comment_load() {
        let url = `/issue/${this.address}/comment/?ordering=${this.ordering}`
        this.$request.api.get(
          this.root_comment_next || url,
        ).then(res => {
          if (res.data.code === 117) {
            for (let i of res.data.result.results) {
              this.root_comment_list.push(i)
            }
            if (res.data.result.next) {
              this.root_comment_next = res.data.result.next
            }
            this.root_comment_finished = !Boolean(res.data.result.next)
            this.root_comment_loading = false
          } else {
            this.$tip({
              content: res.data.msg,
              type: "warning",
              duration: 1000,
            })
          }
        })
      },
      change_pool(value) {
        this.pool_num = value
      },
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
                if (err.message === "Returned error: authentication needed: password or unlock") {
                  this.$store.commit("eth_login", true)
                  return
                }

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
                if (err.message === "Returned error: authentication needed: password or unlock") {
                  this.$store.commit("eth_login", true)
                  return
                }

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
                if (err.message === "Returned error: authentication needed: password or unlock") {
                  this.$store.commit("eth_login", true)
                  return
                }

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
            this.get_my_change()
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
                  value: current_length ? lines[line_id].points[current_length - 1].value : Number(this.prediction_info._init_amount),
                  total: Number(total)
                })
              }
            }
          }
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
      },
      get_my_change() {
        this.prediction.getPastEvents('LongOptionEvent', {
          fromBlock: 0,
          toBlock: 'latest',
        }).then(res => {
          console.log(res);
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
    mounted() {
      let that = this
      document.addEventListener("scroll", () => {
        that.show_order = false
      })
    },
    created() {
      this.prediction = new this.wallet.web3.eth.Contract(this.$abi.binaryPrediction, this.address)
      this.reload()
    }
  }
</script>

<style scoped>

  .children-wrap {
    background-color: #f4f5f9;
    border-radius: 5px;
  }

  .children-detail {
    height: 85vh;
    padding: 10px;
  }

  .children-detail-head {
    line-height: 40px;
    display: flex;
    justify-content: space-between;
  }

  .children-detail-title {
    font-size: 16px;
  }

  .comment-tip {
    text-align: right;
    line-height: 20px;
    font-size: 13px;
    color: #666666;
  }

  .option {
    padding: 10px;
    display: flex;
    justify-content: left;
  }

  .option-item {
    margin: 0 10px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .order {
    display: flex;
    justify-content: right;
    line-height: 44px;
    font-size: 14px;
  }

  .menu {
    background-color: white;
  }

  .all-comment {
    margin-top: 10px;
    min-height: 80vh;
    background-color: white;
    padding-bottom: 200px;
  }

  .select {
    background-color: white;
    z-index: 10;
    display: flex;
    line-height: 44px;
    justify-content: space-between;
  }


  .comment {
    font-size: 14px;
    margin: 9px;
    color: #666;
  }

  .interact {
    position: fixed;
    display: flex;
    justify-content: space-between;
    left: 0;
    bottom: 0;
    width: 100vw;
    padding: 5px;
    background-color: #f6f6f6;
    z-index: 100;
  }

  .fake {
    background-color: white;
    margin: 0 8px;
    padding: 7px 10px;
    font-size: 14px;
    flex-grow: 1;
    border-radius: 2px;
    color: #777777;
  }

  .settle {
    margin: 10px 10px 0;
    border-radius: 5px;
    border: 1px solid #f0f1f5;
    background-color: white;
    padding: 10px;
  }

  .comment-text {
    padding-left: 20px;
    font-weight: bold;
    color: #4ebaee;
  }

  .comment {
    background-color: white;
    margin-top: 20px;
    border-radius: 10px 10px 0 0;
  }

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
