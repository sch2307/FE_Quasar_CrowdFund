<template>
  <div class="q-pa-md"></div>
</template>

<script>
export default {
  name: "AlertComponents",
  props: ['type', 'message', 'open'],
  data() {
    return {}
  },

  watch: {
    open(newValue) {
      if (newValue) {
        this.registerAlert()
      }
    },
  },

  methods: {
    registerAlert : function () {
      this.$q.notify({
        type: this.type,
        message: this.message,
        position: 'top',
        multiLine: true,
        timeout: 5000
      })
    }
  }
}
</script>

<style scoped>

</style>
