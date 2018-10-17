import React, { Component } from 'react';
import ReactDOM from 'react-dom'
import Web3 from 'web3'
import TruffleContract from 'truffle-contract'
import Counter from './Counter.json'

class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      account: '0x0',
      value: null,
      loading: true
    }

    if (typeof web3 != 'undefined') {
      this.web3Provider = window.web3.currentProvider
    } else {
      this.web3Provider = new Web3.providers.HttpProvider('http://localhost:8545')
    }
    this.web3 = new Web3(this.web3Provider)

    this.setValue = this.setValue.bind(this)
  }

  componentDidMount() {
    const counter = TruffleContract(Counter)
    counter.setProvider(this.web3Provider)

    this.web3.eth.getAccounts((error, accounts) => {
      const account = accounts[0]
      this.setState({ account })

      counter.deployed().then((instance) => {
        this.counter = instance
        return this.counter.getCounter.call()
      }).then((value) => {
        console.log('value:' + value.toNumber())
        return this.setState({ 'value': value.toNumber(), loading: false })
      })
    })
  }

  setValue() {
    this.setState({ loading: true })
    this.counter.increment({ from: this.state.account, gas: 50000 }).then((r) => {
      console.log(r);  
      var that = this;    
      setTimeout(function() {
        that.counter.getCounter.call().then((value) => {
          console.log('value:' + value.toNumber())
          return that.setState({ 'value': value.toNumber(), loading: false })
        })
      }, 5000);

      
    })
  }

  render() {
    return (
      <div class='row'>
        <div class='col-lg-12 text-center' >
          <h1>Counter</h1>
          <button onClick={this.setValue}>
            Increment
          </button>
          <br/>
          { this.state.loading
            ? <p class='text-center'>Loading...</p>
            : <p>Counter: {this.state.value}</p>
          }
        </div>
      </div>
    )
  }
}

export default App;
