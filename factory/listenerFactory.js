import Web3 from 'web3'
import ethers from 'ethers'
import config from '../config.js'
const mainNet = 'https://bsc-dataseed.binance.org/'
const mainNetSocket = 'wss://bsc-ws-node.nariox.org:443'

const quickHttp = 'https://purple-weathered-moon.bsc.quiknode.pro/4aca6a71de78877d5bdfeeaf9d5e14ef2da63250/'
const quickSocket = 'wss://purple-weathered-moon.bsc.quiknode.pro/4aca6a71de78877d5bdfeeaf9d5e14ef2da63250/'

import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const resolve = require('path').resolve
const txDecoder = require('ethereum-tx-decoder');

const Tx = require('ethereumjs-tx').Transaction
import SwapFactory from "./swapFactory.js";
import ERC20 from './abis/erc20.js'
import PANCAKE from './abis/pancake.js'

export default class ListenerFactory {

    constructor() {
        this.swapFactory = new SwapFactory("prod", config.dragmoon.mainNetAccount,  config.dragmoon.mainNetKey)
        this.socket = mainNetSocket
    }


    async getSomeTokens(){
        this.pendingTransaction() // pas d'await vu qu'on va avoir plusieurs tokens
    }


    async pendingTransaction(){
        console.log('start listening of tx ...')
        const web3Socket = new Web3(this.socket);
        let subscription = web3Socket.eth
            .subscribe("pendingTransactions", function(error, result) {})
            .on("data", async(transactionHash)  => {
                const transaction = await web3Socket.eth.getTransaction(transactionHash)
                if (transaction) {
                    try{
                        await this.parseTransactionData(transaction, transactionHash, subscription);
                    }catch(err){

                    }
                }
            })


    }
    async parseTransactionData(transaction, tx, subscription){
        const fnDecoder = new txDecoder.FunctionDecoder(PANCAKE);
        const result = fnDecoder.decodeFn(transaction.input);
        const signature = result['signature']
        const signatureHash = result['sighash']
        if(signature.includes("swap")){
            const pathLength = result["path"].length
            const tokenIn = result["path"][0]
            const tokenOut = ethers.utils.getAddress(result["path"][pathLength - 1])
            //console.log(tx)
            //console.log(result)
            this.getTokenIncrease(tokenOut) // pas d'await pour ne pas bloquer les autres tokens
        }
    }

    async getTokenIncrease(tokenOut, targetIncrease = 50){
        let tokensCount = 0
        if(tokenOut !== this.swapFactory.WBNB && tokensCount <= 10){
            const balanceTokenIn = ethers.utils.parseUnits("1", "ether")
            const routerContractInstance = await this.swapFactory.getPaidContractInstance(this.swapFactory.router, PANCAKE, this.swapFactory.signer)
            const tokenOutContractInstance =  await this.swapFactory.getFreeContractInstance(tokenOut, ERC20)
            const tokenOutDecimals = await this.swapFactory.callContractMethod(tokenOutContractInstance, "decimals")
            console.log(tokenOut)
            let amounts = null
            try{
                amounts = await this.swapFactory.checkLiquidity(routerContractInstance, balanceTokenIn, this.swapFactory.WBNB, tokenOut) // pour 1 bnb, combien
                let initialAmountIn = this.swapFactory.readableValue(amounts[0].toString(), 18)
                let initialAmountOut = this.swapFactory.readableValue(amounts[1].toString(), tokenOutDecimals) //
                const waitProfit = setInterval(async() => {
                    tokensCount++
                    let amounts = await this.checkLiquidity(routerContractInstance, balanceTokenIn, this.swapFactory.WBNB, tokenOut)
                    let actualAmountOut = this.swapFactory.readableValue(amounts[1].toString(), tokenOutDecimals)
                    let pourcentageFluctuation = this.swapFactory.calculateIncrease(initialAmountOut, actualAmountOut)
                    console.log('\x1b[36m%s\x1b[0m', "decreasePourcentage : "+ pourcentageFluctuation + "% " + tokenOut + " " + tokenOut);
                    console.log(pourcentageFluctuation, targetIncrease)
                }, 10000)
            }catch(err){
                console.log(err)
            }
        }

    }

    async checkLiquidity(routerContractInstance, balanceTokenIn, tokenIn, tokenOut) {
        try {
            if(balanceTokenIn == 0){
                balanceTokenIn = ethers.utils.parseUnits("1", "ether")
            }
            const options = {balanceTokenIn: balanceTokenIn, tokenIn: tokenIn, tokenOut: tokenOut} // j'ai interverti ici pour avoir un pourcentage cohérent voir commentaire dans createIntervalForCoin
            return await this.swapFactory.callContractMethod(routerContractInstance, "getAmountsOut", options)
        } catch (err) {
            console.log(err)
            console.log("pas de liquidité")
            return false
        }
    }

    async parseTransactionDataForToken(transaction, tx, subscription){
        const tokenToFind = ethers.utils.getAddress("0x20d0bb7f85f9dd557b52d533c930c0a5f01b727b")
        const fnDecoder = new txDecoder.FunctionDecoder(PANCAKE);
        const result = fnDecoder.decodeFn(transaction.input);
        const signature = result['signature']
        const signatureHash = result['sighash']
        if(signature.includes("swap")){
            const pathLength = result["path"].length
            const tokenIn = result["path"][0]
            const tokenOut = ethers.utils.getAddress(result["path"][pathLength - 1])
            console.log(tx)
            console.log(tokenOut, tokenToFind)
            if(tokenOut == tokenToFind){ // je ne peux front run que si j'ai le token1
                //await this.prepareFrontRun(transaction, tx, signature, result, tokenIn, tokenOut, subscription)
            }
        }
    }

    async prepareFrontRun(transaction, tx, signature, result, tokenIn, tokenOut, subscription){
        console.log('preparing front run', transaction)
        console.log('result', result)
        try{
            let amountIn = (transaction.hasOwnProperty("value") ? transaction.value : null)
            if(tokenIn == this.WBNB){
                amountIn = await this.parseCurrency(amountIn.toString())
                amountIn = amountIn.toExact()
                amountIn = this.readableValue(amountIn, 18)
            }else{
                const tokenInContractInstance =  await this.getFreeContractInstance(tokenIn, ERC20)
                const tokenInDecimals = await this.callContractMethod(tokenInContractInstance, "decimals")
                amountIn = await this.readableValue(amountIn, tokenInDecimals)
            }

            let hexAmountOutMin = ('amountOutMin' in result ? result['amountOutMin'] : result['amountOut'])
            const tokenOutContractInstance = await this.getFreeContractInstance(tokenOut, ERC20)

            const tokenOutDecimals = await this.callContractMethod(tokenOutContractInstance, "decimals")
            let amountOutMin = hexAmountOutMin.toString()
            let readableOut = this.readableValue(amountOutMin, tokenOutDecimals)

            if(amountIn >= 0.02 && amountIn <= 0.03 ){
                let cancelSubscribe = await subscription.unsubscribe()
                console.log("ending search in mempool...")

                const gasPrice = Math.round(parseInt(this.readableValue(transaction.gasPrice, 9)))
                const gasLimit = (transaction.gas).toString()
                const confirmations = transaction.confirmations
                console.log(confirmations)
                console.log("[tx " + tx + " gas " + gasPrice + " limit " + gasLimit + " amountIn " + amountIn + " amountOutMin " + amountOutMin + " readableOut " + readableOut + " bnbPriceForOneToken" +" ]")
                const multiplier = 2
                //prepare upgraded Trade
                if((gasPrice * multiplier) <= 30){
                    let frontGas = gasPrice * multiplier
                    let frontLimit = gasLimit * 3
                    frontLimit = Math.trunc(frontLimit)
                    console.log(gasPrice * 2)
                    console.log(gasLimit * 2)

                    let fastSwap = await this.swapFast(transaction, result["to"], frontGas, frontLimit)
                    let tradeTokenToBNB = await this.swap("sell", tokenOut, this.WBNB, 100, 20, 10, frontLimit)
                }else{
                    console.log('too much gas bruh')
                    process.exit()
                }

            }
        }catch(err){
            console.log(err)
        }

    }


}

