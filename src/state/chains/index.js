import { computed, ref } from '@vue/composition-api'

const state = ref({
  contractInstance: null,
  coinbase: null,
  balance: '0',

  /* 연동시 필요한 정보 */
  address: '0x06E16f12DBFBB71ccb5eAf937899Ed02c0281C92',
  abiobj: [
    {
      "constant": false,
      "inputs": [
        {
          "name": "_fundId",
          "type": "uint256"
        }
      ],
      "name": "checkGoalReached",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "_name",
          "type": "string"
        },
        {
          "name": "_duration",
          "type": "uint256"
        },
        {
          "name": "_goalAmount",
          "type": "uint256"
        }
      ],
      "name": "createSmartTreeFunding",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "_fundId",
          "type": "uint256"
        }
      ],
      "name": "fund",
      "outputs": [],
      "payable": true,
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "name": "_name",
          "type": "string"
        },
        {
          "name": "_duration",
          "type": "uint256"
        },
        {
          "name": "_goalAmount",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "name": "treeId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "name": "name",
          "type": "string"
        },
        {
          "indexed": false,
          "name": "duration",
          "type": "uint256"
        },
        {
          "indexed": false,
          "name": "goalAmount",
          "type": "uint256"
        }
      ],
      "name": "NewTreeFund",
      "type": "event"
    },
    {
      "constant": true,
      "inputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "funds",
      "outputs": [
        {
          "name": "name",
          "type": "string"
        },
        {
          "name": "numInvestors",
          "type": "uint256"
        },
        {
          "name": "deadline",
          "type": "uint256"
        },
        {
          "name": "status",
          "type": "string"
        },
        {
          "name": "ended",
          "type": "bool"
        },
        {
          "name": "goalAmount",
          "type": "uint256"
        },
        {
          "name": "totalAmount",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "name": "",
          "type": "uint256"
        },
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "fundsToInvestors",
      "outputs": [
        {
          "name": "addr",
          "type": "address"
        },
        {
          "name": "amount",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "fundsToOwner",
      "outputs": [
        {
          "name": "",
          "type": "address"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "getFundsCount",
      "outputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    }
  ],
})

export default function useChainInfo() {
  const setContractInstance = (contractInstance) => {
    state.value.contractInstance = contractInstance
  }

  const setBalance = (balance) => {
    state.value.balance = balance
  }

  const setCoinbase = (coinbase) => {
    state.value.coinbase = coinbase
  }

  const getAddress = () => {
    return state.value.address
  }

  const getAbiObject = () => {
    return state.value.abiobj
  }

  const getContractInstance = () => {
    return state.value.contractInstance
  }

  const getBalance = () => {
    return state.value.balance
  }

  const getCoinbase = () => {
    return state.value.coinbase
  }

  return {
    setContractInstance,
    setBalance,
    setCoinbase,
    getAddress,
    getAbiObject,
    getContractInstance,
    getBalance,
    getCoinbase,
    contractInstance: computed(() => state.value.contractInstance),
    balance: computed(() => state.value.balance),
    coinbase: computed(() => state.value.coinbase),
    address: computed(() => state.value.address),
    abiobj: computed(() => state.value.abiobj),
  }
}
