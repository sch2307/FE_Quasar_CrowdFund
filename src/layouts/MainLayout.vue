<template>
  <q-layout view="hHh LpR lFf">
    <q-header elevated class="bg-custom-blue-dark text-white">
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="leftDrawerOpen = !leftDrawerOpen"
        />
        <q-toolbar-title>
          KMU Tree Funding
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      elevated
      content-class="bg-custom-blue-dark"
    >
      <q-list class="text-white">
        <q-item-label header>Menu</q-item-label>
        <q-item clickable to="/" exact active-class="text-purple-3">
          <q-item-section avatar>
            <q-icon name="fas fa-home"/>
          </q-item-section>
          <q-item-section>
            <q-item-label>홈</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable to="/Dashboard" exact active-class="text-purple-3">
          <q-item-section avatar>
            <q-icon name="fas fa-sign-in-alt"/>
          </q-item-section>
          <q-item-section>
            <q-item-label>메타마스크 로그인</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable to="/FundStatus" exact active-class="text-purple-3">
          <q-item-section avatar>
            <q-icon name="fas fa-chart-bar"/>
          </q-item-section>
          <q-item-section>
            <q-item-label>펀딩 현황 조회</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable tag="a" target="_blank" href="https://youtu.be/zOEHw71rMVw">
          <q-item-section avatar>
            <q-icon name="fab fa-youtube"/>
          </q-item-section>
          <q-item-section>
            <q-item-label>YouTube 로 이동하기</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable tag="a" target="_blank" href="https://github.com/sch2307/FE_Quasar_CrowdFund">
          <q-item-section avatar>
            <q-icon name="fab fa-github"/>
          </q-item-section>
          <q-item-section>
            <q-item-label>GitHub 로 이동하기</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view/>
    </q-page-container>
  </q-layout>
</template>

<script>
export default {
  name: 'MainLayout',
  setup() {
    return {
      leftDrawerOpen: false,
    }
  }
}
</script>

<style>
.bg-custom-blue-dark {
  background: #2B2D3E;
}
</style>
