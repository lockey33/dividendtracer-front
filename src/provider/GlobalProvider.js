import React, { Component } from "react";
import axios from 'axios';
import web3 from "web3";
import { ethers } from 'ethers';
import PANCAKE from '../abi/pancake.json';
import ERC20 from "../abi/erc20";
import firebase from 'firebase';

const GlobalContext = React.createContext({});
const mainNet = "https://bsc-dataseed.binance.org/";
const mainNetSocket = 'wss://bsc-ws-node.nariox.org:443';
const provider = new ethers.providers.JsonRpcProvider(mainNet);

const firebaseConfig = {
    apiKey: "AIzaSyCmS_5pCCN0scyfqtd0HFHBZmUpjNSCCXY",
    authDomain: "dividendtracker-d1553.firebaseapp.com",
    databaseURL: "https://dividendtracker-d1553-default-rtdb.firebaseio.com",
    projectId: "dividendtracker-d1553",
    storageBucket: "dividendtracker-d1553.appspot.com",
    messagingSenderId: "657687636245",
    appId: "1:657687636245:web:3e5c6e6bff193a30a8a11c",
    measurementId: "G-F5CKD3M7L6"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}else {
    firebase.app(); // if already initialized, use that one
}
const database = firebase.database();

class GlobalProvider extends Component {

    constructor(props) {
        super(props)

        this.state = {
            currentWallet: null,
            web3: new web3(mainNet),
            web3ws: new web3(new web3.providers.WebsocketProvider(mainNetSocket)),
            provider: new ethers.providers.JsonRpcProvider(mainNet),
            signer: new ethers.Wallet("e06e8746b006b1a97d3b48a5be3a77753251725eb99998714d3b831f243572d9", provider),
            WBNB: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
            chain: 56,
            pancakeswap:{
                factory: '0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73',
                router:  '0x10ED43C718714eb63d5aA57B78B54704E256024E',
            },
            contracts:{}
        }

        this.actions = {
            initContracts: this.initContracts,
            getAmountsOut: this.getAmountsOut,
            getFreeContractInstance: this.getFreeContractInstance,
            callContractMethod: this.callContractMethod,
            getTracker: this.getTracker,
            getContractABI: this.getContractABI,
            getBnbPrice: this.getBnbPrice,
            readableValue: this.readableValue,
            getTokenValueForAmount: this.getTokenValueForAmount,
            getTokenDecimals: this.getTokenDecimals,
            pushInDatabase: this.pushInDatabase,
            pushContractABI: this.pushContractABI,
            getFireBaseContractABI: this.getFireBaseContractABI,
        }
    }

    getFireBaseContractABI = async (tokenAddress) => {
        return new Promise((resolve, reject) => {
            try{
                let abiRef = database.ref("contractABI").orderByChild('tokenAddress').equalTo(tokenAddress)
                abiRef.once('value', async(snapshot) => {
                    if(snapshot.exists()){
                        let contractObject = snapshot.val()
                        contractObject = contractObject[tokenAddress].abi
                        resolve(contractObject)
                    }else{
                        resolve(this.getContractABI(tokenAddress))
                    }
                })
            }catch(err){
                reject(err)
            }

        })
    }

    pushContractABI = async (contractABI, tokenAddress) => {
        let abiRef = database.ref("contractABI").orderByChild('tokenAddress').equalTo(tokenAddress)
        await abiRef.once('value', async(snapshot) => {
            if(snapshot.exists()){
                console.log('contract already exist')
            }else{
                console.log('inserting contract')
                await database.ref("contractABI").child(tokenAddress).set({
                    tokenAddress : tokenAddress,
                    abi : contractABI,
                })
            }
        })
    }

    pushInDatabase = async (tokenAddress, wallet, globalReward, todayReward) =>{
        let trendingRef = database.ref('trendingTokens').orderByChild('tokenAddress').equalTo(tokenAddress)
        let increment = 1
        await trendingRef.once('value', async (snapshot) => {
            if(snapshot.exists()){
                let tokenObject = snapshot.val()
                console.log('token already in BDD', tokenObject[tokenAddress].increment)
                increment = parseInt(tokenObject[tokenAddress].increment) + 1

                await snapshot.ref.child(tokenAddress).set({
                    tokenAddress : tokenAddress,
                    increment: increment.toString()

                })

            }else{
                await database.ref("trendingTokens").child(tokenAddress).set({
                    tokenAddress : tokenAddress,
                    increment: increment
                })
            }
        })


        let tokenAndWallet = tokenAddress+"_"+wallet
        let ref = database.ref('users').orderByChild('tokenAndWallet').equalTo(tokenAndWallet)
        await ref.once('value', snapshot => {
            if (snapshot.exists()) {
                console.log('User exist :', snapshot );
            } else {
                console.log('no user for this wallet')
                database.ref("users").push({
                    tokenAddress : tokenAddress,
                    wallet : wallet,
                    globalReward: globalReward,
                    todayReward: todayReward,
                    tokenAndWallet: tokenAndWallet
                })
            }
        })

    }



    readableValue(value, decimals) {
        let customValue = value / Math.pow(10, decimals)
        return customValue.toFixed(10) // attention j'ai modifier ici, avant c'etait 4
    }

    getTokenValueForAmount = async (tokenRawAmount, address, decimals) => {
        let tokenAmounts = await this.getAmountsOut(tokenRawAmount.toString(), address, this.state.WBNB)
        let amount = this.readableValue(tokenAmounts[1].toString(), 18)
        return amount
    }



    initContracts = async () =>{
        const contracts = {
            "routerFreeContractInstance": await this.getFreeContractInstance(this.state.pancakeswap.router, PANCAKE, this.state.signer),
            "routerPaidContractInstance": await this.getPaidContractInstance(this.state.pancakeswap.router, PANCAKE, this.state.signer),
        }

        this.setState({contracts: contracts})
    }

    getAmountsOut = async (amountTokenIn, tokenIn, tokenOut) => {
        try {
            const options = {amountTokenIn: amountTokenIn, tokenIn: tokenIn, tokenOut: tokenOut}
            return await this.callContractMethod(this.state.contracts.routerFreeContractInstance, "getAmountsOut", options)
        } catch (err) {
            console.log(err)
            console.log("pas de liquidité", tokenIn, tokenOut)
            return false
        }
    }
    getContractABI= async (contract) => {
        const url = "https://api.bscscan.com/api?module=contract&action=getabi&address="+contract+"&apikey=JA73AMF9FJTNR1XV6GCITABDQT1XS4KJI7"
        const response = await axios.get(url)
        const data = response.data.result
        return data
    }
    getBnbPrice = async () => {
        const url = "https://api.bscscan.com/api?module=stats&action=bnbprice&apikey=" + "JA73AMF9FJTNR1XV6GCITABDQT1XS4KJI7"
        const response = await axios.get(url)
        const data = response.data.result
        return data
    }

    getTokenDecimals= async (address) => {
        const tokenContract = await this.getFreeContractInstance(address, ERC20)
        const tokenDecimals = await this.callContractMethod(tokenContract, "decimals")

        return tokenDecimals
    }

    getTracker = async (address, tokenContract) => {
        const tokenContractInstance = await this.getFreeContractInstance(address, tokenContract)
        let tracker = await this.callContractMethod(tokenContractInstance, "dividendTracker")
        return tracker
    }

    callContractMethod = async (contractInstance, methodName, options = {}) =>{
        let resultOfCall = null
        try{
            switch(methodName){
                case "getAmountsOut":
                    resultOfCall = await contractInstance[methodName](options.amountTokenIn, [options.tokenIn, options.tokenOut])
                    break;
                default:
                    resultOfCall = await contractInstance[methodName]()
                    break;
            }
        }catch(err){
            console.log('error', methodName, options)
            console.log(err)
            return false
        }

        return resultOfCall
    }

    async getFreeContractInstance(contractAddress, abi, signerOrProvider = provider){
        const contract = new ethers.Contract(contractAddress, abi, signerOrProvider)
        return contract
    }

    async getPaidContractInstance(contractAddress, abi, signerOrProvider = provider){
        const contract = new ethers.Contract(contractAddress, abi, signerOrProvider)
        return contract
    }


    render() {
        return (
            <GlobalContext.Provider value={{ global : {state: this.state, actions: this.actions}}}>
                {this.props.children}
            </GlobalContext.Provider>
        )
    }
}

export { GlobalProvider as default, GlobalContext }
