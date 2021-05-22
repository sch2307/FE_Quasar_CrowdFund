<template>
  <q-page class="container" style="background: #343E59">
    <fund-status-components />
  </q-page>
</template>

<script>
import FundStatusComponents from "components/fundStatusComponents";

export default {
  name: "fundStatus",
  components: { FundStatusComponents },
}
</script>

<style scoped>

</style>
