<template>
  <div  style="height: 80px;width: 100%;">
    <var-input
      style="height: 60px"
      clearable
      :placeholder="placeholder || '11位电话号码'"
      :rules="this.$settings.validators.phone"
      v-model="phone"
      :disabled="disabled"
      blur-color="#bbb"
      @input="$emit('update:phone',phone)"
    >
      <template #prepend-icon>
        <div style="color: #000;">+86</div>
        <var-divider vertical/>
      </template>
    </var-input>
  </div>
</template>

<script>
  export default {
    name: "Phone",
    props: {
      placeholder: null,
      phone: {},
      disabled: false
    },
    emits: ["update:phone"],
  }
</script>

<style scoped>

</style>