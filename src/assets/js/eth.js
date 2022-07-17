import Web3 from 'web3'
import abi from "./abi";


class Wallet {
  init = false
  web3 = null
  market = null

  address = null
  PMB = null


  constructor() {
    this.getWeb3().then(web3 => {
      this.web3 = web3
      return new Promise(resolve => resolve(web3))
    }).then(web3 => {
      this.market = new web3.eth.Contract(abi.predictionMarket, "0x9c8dc95BB304B25C07575B582D5De6990c49f3d2")
      return new Promise(resolve => resolve())
    }).then(() => {
      this.getAccount(this.address)
      this.init = true
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
      this.address = "0xFFfda3aa37351504B12aA69E510d37Fe497d1df4"
      return new Web3("https://poa.eth.seutools.com")
    }
  }

  getAccount(address) {
    this.address = address
    this.market.methods.balanceOf(address).call().then(res => {
      this.PMB = res
      console.log(res);
    })
  }
}

export default {
  Wallet,
}