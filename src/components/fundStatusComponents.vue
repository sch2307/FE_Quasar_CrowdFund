<template>
  <q-page class="flex flex-center">
    <alert-components :type="state.alertProps.type" :message="state.alertProps.message" :open="state.alertProps.open"/>
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
            <div class="q-pa-lg">
              <div class="q-gutter-sm">
                <div class="text-center">
                  <p class="text-h4 text-accent text-weight-bold">펀딩 하기</p>
                  <p class="text-subtitle1">펀딩하고 싶은 금액을 입력해주세요.</p>
                </div>
                <div class="q-ma-3">
                  <q-input color="orange" standout bottom-slots disable v-model="state.fundName" counter clearable/>
                  <q-input color="orange" standout bottom-slots v-model="state.fundWei" label="목표금액(Wei)" counter
                           clearable/>
                </div>
                <div class="text-center">
                  <span class="q-pa-sm">
                    <q-btn unelevated flat color="primary" label="생성하기" @click="execFund"/>
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
      <div class="text-h3 q-pa-sm text-amber text-center text-accent text-weight-bold">펀딩 현황</div>
      <div class="text-h5 q-mb-lg text-white text-center">유저들의 펀딩 현황을 살펴보세요 !</div>

      <div class="row items-center">
        <div v-for="fundChild in state.fundList" v-bind:key="fundChild.id" class="col-4 col-sm-6">
          <q-card flat>
            <q-card-section class="bg-indigo text-white">
              <div class="row items-center no-wrap">
                <div class="col">
                  <div class="q-mb-sm text-h4 text-amber text-weight-bold">펀딩명 : {{ fundChild.fund.name }}</div>
                  <div class="text-subtitle1 text-weight-bold">
                    펀딩 상태 :
                    {{
                      convertFundStr(fundChild.fund.status,
                        fundChild.expiredTime,
                        convertAmount(fundChild.fund.totalAmount, fundChild.fund.goalAmount))
                    }}</div>
                  <div class="text-subtitle1 text-weight-bold">펀딩 종료 시간 : {{
                      Unix_timestamp(fundChild.fund.deadline)
                    }}
                  </div>
                  <div class="q-mb-md text-subtitle1 text-weight-bold">투자자 : {{ fundChild.fund.numInvestors }}명</div>
                  <div class="text-subtitle1 text-light-blue-2 text-weight-bold">목표금액/현재금액 :
                    {{ fundChild.fund.goalAmount }} wei / {{ fundChild.fund.totalAmount }} wei
                  </div>
                </div>
                <apex-multiple-radial-bars
                  :series="[convertAmount(fundChild.fund.totalAmount, fundChild.fund.goalAmount)]"/>
              </div>
            </q-card-section>
            <q-card-actions align="center" :class="fundChild.fund.ended || fundChild.expiredTime ? 'bg-indigo' : ''">
              <div v-if="fundChild.fund.ended || fundChild.expiredTime">
                <div class="q-pa-sm text-subtitle2 text-white">이미 펀딩이 종료되었어요.</div>
              </div>
              <div v-else>
                <q-btn text flat class="text-amber" @click="openFund(fundChild.id, fundChild.fund.name)">펀딩하기</q-btn>
                <q-btn text flat class="text-amber" @click="checkGoalFund(fundChild.id)">검사하기</q-btn>
              </div>
            </q-card-actions>
          </q-card>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import useChainInfo from "src/state/chains";
import {
  computed,
  onBeforeMount,
  onBeforeUnmount,
  onBeforeUpdate,
  onMounted,
  onUnmounted,
  onUpdated,
  reactive
} from "@vue/composition-api";
import Web3 from "web3";
import ApexMultipleRadialBars from "components/charts/ApexRadialBar";
import AlertComponents from "components/AlertComponents";

export default {
  name: "fundStatusComponents",
  components: {AlertComponents, ApexMultipleRadialBars},
  setup(props, context) {

    const state = reactive({
      dialog: false,
      loading: true,
      maximizedToggle: false,
      isDevelopment: false,
      fundList: [],

      alertProps: {
        type: 'positive',
        message: '',
        open: false,
      },

      fundId: null,
      fundName: null,
      fundWei: null,
    })

    const cloneFundCard = async function () {
      const {getContractInstance} = useChainInfo()
      const fundCnt = await getContractInstance().methods['getFundsCount']().call()

      for (let i = 0; i < fundCnt; i++) {
        const fund = await getContractInstance().methods['funds(uint256)'](i).call()
        const expiredTime = checkTime(fund.deadline)
        state.fundList.push(
          {
            id: i,
            expiredTime: expiredTime,
            fund
          }
        )
      }
      if (state.isDevelopment) {
        console.log(state.fundList)
      }
    }

    const checkGoalFund = async function (id) {
      const { getContractInstance } = useChainInfo()
      window.accounts = await ethereum.request({ method: 'eth_requestAccounts' })

      try {
        if (getContractInstance() != null) {
          const value = await getContractInstance().methods['checkGoalReached(uint256)'](id).send({
            from: accounts[0]
          })
          if (state.isDevelopment) {
            console.log(value)
          }
        }
      } catch (error) {
        alert('Transaction 생성 중 문제가 발생되었습니다 !')
        if (state.isDevelopment) {
          console.log(error)
        }
      }
    }

    const checkTime = function (unixTime) {
      const date = new Date().getTime()

      /* 만약에, 현재 시간보다 펀딩 시간이 더 크다면 종료된 것으로 판단 */
      if (date > unixTime) {
        return true;
      } else {
        return false;
      }
    }

    const execFund = async function () {
      const {getContractInstance} = useChainInfo()
      window.accounts = await ethereum.request({method: 'eth_requestAccounts'})

      try {
        if (getContractInstance() != null) {
          const value = await getContractInstance().methods['fund(uint256)'](state.fundId).send({
            from: accounts[0],
            value: Number(state.fundWei)
          })
          openAlert('positive', "펀딩에 성공했어요 !")
        }
        state.dialog = false
      } catch (error) {
        alert('Transaction 생성 중 문제가 발생되었습니다 !')
        if (state.isDevelopment) {
          console.log(error)
        }
      }
    }

    const openFund = function (cardId, cardName) {
      state.fundId = cardId
      state.fundName = cardName
      state.dialog = true
    }

    const openAlert = function (type, message) {
      state.alertProps = {
        type: type,
        message: message,
        open: true
      }

      /* 5초 후에, 플래그 변경 */
      setTimeout(() => {
        state.alertProps = {
          type: null,
          message: null,
          open: false
        }
      }, 5000)
    }

    const convertFundStr = function (str, isExpiredTime, percentage) {
      let tmp = ''
      if (str.includes('Campaign Failed') || (isExpiredTime && percentage < 100)) {
        tmp = '펀딩에 성공하지 못했어요.'
      } else if (str.includes('Funding') && !isExpiredTime) {
        tmp = '펀딩 중'
      } else if (str.includes('Campaign Succeeded') || (isExpiredTime && percentage >= 100)) {
        tmp = '펀딩에 성공했어요 !'
      }
      return tmp
    }

    const convertAmount = function (totalAmount, goalAmount) {
      const tmpAmount = (totalAmount / goalAmount) * 100
      return parseInt(tmpAmount)
    }

    const Unix_timestamp = function (time) {
      const date = new Date(time * 1000)
      const year = date.getFullYear()
      const month = "0" + (date.getMonth() + 1)
      const day = "0" + date.getDate()
      const hour = "0" + date.getHours()
      const minute = "0" + date.getMinutes()
      const seconds = "0" + date.getSeconds()

      return year + "년 " + month.substr(-2) + "월 " + day.substr(-2) + "일 " + hour.substr(-2) + "시 "
        + minute.substr(-2) + "분 " + seconds.substr(-2) + "초"
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

        /* CompositionApi - state 에 저장 */
        setContractInstance(contractInstance)

        /* 만약, 지갑주소 연결되어 있으면 카드를 클론 */
        cloneFundCard()
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
      cloneFundCard,
      openAlert,
      openFund,
      execFund,
      checkTime,
      checkGoalFund,
      convertFundStr,
      convertAmount,
      Unix_timestamp
    }
  },

  created() {
    this.$q.loading.show({
      backgroundColor: 'purple-10',
      delay: 0
    })

    setTimeout(() => {
      this.$q.loading.hide()
    }, 5000)
  }
}
</script>

<style scoped>
.row > div {
  padding: 10px 15px;
}
</style>
