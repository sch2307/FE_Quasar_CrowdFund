<template>
  <q-page class="flex flex-center">
    <div class="q-pa-md q-gutter-sm">
      <q-dialog
        v-model="state.dialog"
        :maximized="state.maximizedToggle"
        transition-show="slide-up"
        transition-hide="slide-down"
      >
        <q-card class="bg-blue-grey-1 text-black" style="width: 700px; max-width: 80vw;">
          <q-bar>
            <q-space/>

            <q-btn dense flat icon="minimize" @click="state.maximizedToggle = false" :disable="!state.maximizedToggle">
              <q-tooltip v-if="state.maximizedToggle" content-class="bg-white text-primary">축소</q-tooltip>
            </q-btn>
            <q-btn dense flat icon="crop_square" @click="state.maximizedToggle = true" :disable="state.maximizedToggle">
              <q-tooltip v-if="!state.maximizedToggle" content-class="bg-white text-primary">확대</q-tooltip>
            </q-btn>
            <q-btn dense flat icon="close" v-close-popup>
              <q-tooltip content-class="bg-white text-primary">닫기</q-tooltip>
            </q-btn>
          </q-bar>
          <q-card-section>
            <div class="q-pa-md">
              <div class="q-gutter-sm">
                <div class="text-center">
                  <p class="text-h4 text-accent text-weight-bold">Tree Fund 생성하기</p>
                  <p class="text-subtitle1">새로운 Tree Fund를 생성합니다! 다음과 같은 정보를 입력해주세요 !</p>
                </div>
                <div class="q-ma-3">
                  <q-input color="orange" standout bottom-slots v-model="state.fundName" label="이름" counter clearable/>
                  <q-input color="orange" standout bottom-slots v-model="state.fundTime" label="기간(초)" counter clearable/>
                  <q-input color="orange" standout bottom-slots v-model="state.fundWei" label="목표금액(Wei)" counter
                           clearable/>
                </div>
                <div class="text-center">
                  <span class="q-pa-sm">
                    <q-btn unelevated flat color="primary" label="생성하기" @click="createNewTreeFund"/>
                  </span>
                  <span class="q-pa-sm">
                    <q-btn unelevated flat label="취소하기" @click="state.dialog = false"/>
                  </span>
                </div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </q-dialog>
    </div>
    <div class="q-pa-md q-gutter-sm">
      <div v-if="state.coinbase === null">
        <div class="text-h3 q-pa-sm text-amber text-center text-accent text-weight-bold">Metamask 를 통해 로그인 하세요 !</div>
        <div class="text-h5 q-pa-sm text-white text-center">아래 버튼을 눌러 연결해보세요 !</div>
        <div class="text-center q-pa-md">
          <q-btn unelevated color="info" size="xl" label="지갑 연결 하기" @click="registerMetamask"/>
        </div>
      </div>
      <div v-else>
        <div class="text-h3 q-pa-sm text-amber text-center text-accent text-weight-bold">지갑이 정상적으로 연결되었어요 !</div>
        <div class="text-h5 q-mb-lg text-white text-center">새로운 펀딩을 시작해보세요 !</div>
        <q-card flat bordered class="bg-white">
          <q-card-section horizontal>
            <q-card-section class="q-pt-xs">
              <div class="text-h6 q-mt-sm q-mb-xs">나의 블록체인 정보</div>
              <div class="text-caption text-grey">COINBASE : {{ state.coinbase }}</div>
              <div class="text-caption text-grey">BALANCE : {{ state.balance }} wei</div>
            </q-card-section>
          </q-card-section>

          <q-separator></q-separator>
          <q-card-actions>
            <q-space/>
            <q-btn flat unelevated color="orange" label="새로운 펀딩 만들기" @click="state.dialog = true"/>
          </q-card-actions>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
import Web3 from 'web3'
import {
  computed,
  ref,
  onBeforeMount,
  onBeforeUnmount,
  onBeforeUpdate,
  onMounted,
  onUnmounted,
  onUpdated, reactive
} from "@vue/composition-api";
import useChainInfo from "src/state/chains";

export default {
  name: 'signMetamask',
  setup(props, context) {

    const state = reactive({
      loading: true,
      dialog: false,
      isDevelopment: false,
      maximizedToggle: false,

      fundName: null,
      fundTime: null,
      fundWei: null,

      balance: computed(() => balance.value),
      coinbase: computed(() => coinbase.value),
    })

    const {balance, coinbase} = useChainInfo()

    const registerMetamask = async function () {
      const {setCoinbase, setBalance} = useChainInfo()
      window.accounts = await ethereum.request({method: 'eth_requestAccounts'})

      /* 지갑 주소 정보를 불러온다 */
      const coinbase = await window.web3.eth.getCoinbase()
      setCoinbase(coinbase)

      /* Balance 정보를 불러온다. */
      const balance = parseInt(await window.web3.eth.getBalance(window.accounts[0]), 10)
      setBalance(balance)
    }

    const createNewTreeFund = async function () {
      const {getContractInstance} = useChainInfo()
      window.accounts = await ethereum.request({method: 'eth_requestAccounts'})
      try {
        const cardFundId = state.fundName
        const fundTime = state.fundTime
        const weiAmount = state.fundWei

        if (getContractInstance() != null) {
          const value = await getContractInstance().methods['createSmartTreeFunding(string,uint256,uint256)'](cardFundId, fundTime, weiAmount).send({from: accounts[0]});
          if (state.isDevelopment) {
            console.log(value)
          }
          /* 추후에 finally 에서 닫을 수 있도록 변경 */
          state.dialog = false
        }
      } catch (error) {
        alert("Transaction 생성 중 문제가 발생되었습니다 !")
        if (state.isDevelopment) {
          console.log(error)
        }
      }
    }

    onBeforeMount(() => {
      if (state.isDevelopment) {
        console.log('[LIFECYCLE] beforeMount')
      }
    })

    onMounted(() => {
      const {setContractInstance, getAbiObject, getAddress} = useChainInfo()
      if (window.ethereum) {
        window.web3 = new Web3(window.ethereum)
        const contractInstance = new window.web3.eth.Contract(getAbiObject(), getAddress())
        setContractInstance(contractInstance)
      } else if (window.web3) {
        window.web3 = new Web3(web3.currentProvider)
      } else {
        window.alert('Non-Ethereum browser detected. You should consider trying Metamask !')
      }
      if (state.isDevelopment) {
        console.log('[LIFECYCLE] mounted')
      }
    })

    onBeforeUpdate(() => {
      if (state.isDevelopment) {
        console.log('[LIFECYCLE] beforeUpdate')
      }
    })

    onUpdated(() => {
      if (state.isDevelopment) {
        console.log('[LIFECYCLE] updated')
      }
    })

    onBeforeUnmount(() => {
      if (state.isDevelopment) {
        console.log('[LIFECYCLE] beforeDestroy')
      }
    })

    onUnmounted(() => {
      if (state.isDevelopment) {
        console.log('[LIFECYCLE] destroyed')
      }
    })

    return {
      state,

      registerMetamask,
      createNewTreeFund
    }
  },
}
</script>

<style scoped>
</style>
