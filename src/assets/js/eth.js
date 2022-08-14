import Web3 from 'web3'
import abi from "./abi";


class Wallet {
  init = false
  web3 = null
  market = null
  address = null
  PMB = null
  SEUB = null
  mode = 0//read-only
  SEUB_FAUCET = "0x1c78eDe9AC8F1A86B9C3B26e960C740141B64F09"
  PMB_FAUCET = "0x608C628B656bA2f31064EabC30d9db92B57661C5"
  MARKET = "0x3340D735d2B38e6Df75fF13547Ca24C167959a7E"

  constructor() {
  }

  init_wallet() {
    this.web3 = new Web3("https://poa.eth.seutools.com")
    this.market = new this.web3.eth.Contract(abi.predictionMarket, this.MARKET)

    return this.getWeb3().then(web3 => {
      this.web3 = web3
      return new Promise(resolve => resolve(web3))
    }).then(web3 => {
      this.market = new web3.eth.Contract(abi.predictionMarket, this.MARKET)
      return new Promise(resolve => resolve())
    }).then(() => {
      if (this.address) {
        this.getAccount(this.address)
      }
      this.init = true
      return new Promise(resolve => resolve(this.address))
    })
  }

  async getWeb3() {
    if (window.ethereum) {
      const web3 = new Web3(window.ethereum);
      this.address = (await window.ethereum.enable())[0]
      window.ethereum.on("accountsChanged", address_list => {
        this.getAccount(address_list[0])
      })
      return web3
    } else {
      return new Web3("https://poa.eth.seutools.com")
    }
  }

  getAccount(address) {
    console.log(address);
    this.address = address
    this.market.methods.balanceOf(address).call().then(res => {
      console.log(res);
      this.PMB = res
      this.mode = 1
    })
    this.web3.eth.getBalance(address).then(res => {
      this.SEUB = this.web3.utils.fromWei(res, "ether")
    })
  }

  logout() {
    this.address = this.PMB = this.SEUB = null
    this.mode = 0
  }
}

export default {
  Wallet,
}