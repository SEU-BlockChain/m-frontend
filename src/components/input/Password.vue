<template>
  <div style="height: 80px;width: 100%">
    <var-input
      type="password"
      :placeholder="placeholder || '密码'"
      :rules="rules"
      v-model="password"
      blur-color="#bbb"
      @input="$emit('update:password',password)"
    />
  </div>
</template>

<script>
  export default {
    name: "password",
    props: {
      placeholder: null,
      password: String,
      confirm: null
    },
    emits: ["update:password"],
    computed: {
      rules() {
        return this.confirm ? this.$settings.validators.confirm_password(this.confirm) : this.$settings.validators.password
      }
    }
  }
</script>

<style scoped>

</style>