<template>
  <div class="wrap">
    <var-space justify="space-between" align="center">
      <var-space direction="column" size="mini">
        <div class="title">{{title}}</div>
        <div class="tip">
          <span>经验值</span>
          <span style="color: #ffaa00;">+{{single}}</span>
          <span>，每日获取{{times}}次</span>
        </div>
      </var-space>
      <div style="width: 30vw;">
        <a-progress status="warning" :percent="current/times">
          <template v-slot:text="scope">
            {{current}}/{{times}}次
          </template>
        </a-progress>
      </div>
    </var-space>
  </div>
  <var-divider margin="0"/>
</template>

<script>
  export default {
    name: "ProgressTaskCard",
    props: {
      title: null,
      single: null,
      times: null,
      current: null,
    }
  }
</script>

<style scoped>
  .wrap {
    padding: 14px;
  }

  .title {
  }

  .tip {
    font-size: 13px;
    color: #888;
  }
</style>