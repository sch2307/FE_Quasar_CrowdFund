<template>
  <q-page class="container" style="background: #343E59">
    <sign-metamask />
  </q-page>
</template>

<script>
import signMetamask from "components/signMetamask";
export default {
  name: 'PageIndex',
  components: { signMetamask }
}
</script>
