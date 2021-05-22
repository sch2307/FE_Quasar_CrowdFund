<template>
  <div class="column justify-center window-height">
    <div class="col-4 self-center text-center" >
      <img
       alt="Quasar logo"
       :src="require('../assets/chain_icon.png')"
       style="width: 300px"
     >
    </div>
    <div class="col-4">
      <p class="text-h3 text-white text-weight-bold full-width text-center">
        KMU Tree Funding 에 오신 것을 환영합니다.
      </p>
      <p class="text-h5 text-grey-6 text-weight-medium full-width text-center">
        메뉴를 선택해 펀딩을 시작해보세요.
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: "introduceComponents"
}
</script>

<style scoped>

</style>
