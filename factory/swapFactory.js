import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const resolve = require('path').resolve
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import Web3 from 'web3'
import ethers from 'ethers'
import ERC20 from './abis/erc20.js'
import PANCAKE from './abis/pancake.js'
import WBNB from './abis/wbnb.js'
import approveSpender from "./abis/approveSpender.js";
import config from '../config.js'
const mainNet = 'https://bsc-dataseed.binance.org/'
const mainNetSocket = 'wss://bsc-ws-node.nariox.org:443'
const quickHttp = 'https://purple-weathered-moon.bsc.quiknode.pro/4aca6a71de78877d5bdfeeaf9d5e14ef2da63250/'
const quickSocket = 'wss://purple-weathered-moon.bsc.quiknode.pro/4aca6a71de78877d5bdfeeaf9d5e14ef2da63250/'

const testNetBlockIoSocket = 'wss://bsc.getblock.io/testnet/'
const testNetBlockIo = 'https://bsc.getblock.io/testnet/'

const testNetSocket = 'wss://data-seed-prebsc-1-s1.binance.org:8545/'
const testNet = 'https://data-seed-prebsc-1-s1.binance.org:8545/'
const ganacheFork = 'http://127.0.0.1:7545'
const ganacheForkSocket = 'ws://127.0.0.1:8545'


const txDecoder = require('ethereum-tx-decoder');
const InputDataDecoder = require('ethereum-input-data-decoder');
const decoder = new InputDataDecoder(__dirname +'/abis/pancake.json');
const waitUntil = require('wait-until');
import { JSBI, WETH as WETHs, ETHER, Fraction, Pair, Price, Percent, Trade, TradeType, Route, ChainId, Currency, CurrencyAmount, Router, Fetcher, TokenAmount, Token  } from './pancakeswap-sdk-v2/dist/index.js'
import pancake from "./abis/pancake.js";
import {Contract} from "@ethersproject/contracts";
const Tx = require('ethereumjs-tx').Transaction
import Common from 'ethereumjs-common';

const BIPS_BASE = JSBI.BigInt(100)

export default class SwapFactory {

    constructor(mode, account, privateKey) {
        if(mode === "test"){
            this.chain = ChainId.BSCTESTNET
            this.mode = mode
            this.web3ws = new Web3(new Web3.providers.WebsocketProvider(testNetSocket))
            this.web3 = new Web3(new Web3.providers.HttpProvider(testNet))
            this.provider = new ethers.providers.JsonRpcProvider(testNet)
            this.signer = new ethers.Wallet(privateKey, this.provider)
            this.privateKey = privateKey
            this.WBNB = '0xae13d989dac2f0debff460ac112a837c89baa7cd'
            this.factory = '0x6725f303b657a9451d8ba641348b6761a6cc7a17'
            this.router =  '0xD99D1c33F9fC3444f8101754aBC46c52416550D1'
            this.recipient = account
            this.routerFreeContract = this.getFreeContractInstance(this.router, PANCAKE, this.provider)
            this.routerPaidContract = this.getPaidContractInstance(this.router, PANCAKE, this.provider)
        }else if(mode === "ganache"){
            this.mode = mode
            this.chain = ChainId.MAINNET
            //this.web3ws = new Web3(new Web3.providers.WebsocketProvider(ganacheForkSocket))
            this.web3 = new Web3(new Web3.providers.HttpProvider(ganacheFork))
            this.provider = new ethers.providers.JsonRpcProvider(ganacheFork)
            this.signer = new ethers.Wallet(privateKey, this.provider)
            this.privateKey = privateKey
            this.WBNB = '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c'
            this.factory = '0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73'
            this.router =  '0x10ED43C718714eb63d5aA57B78B54704E256024E'
            this.recipient = account
            this.routerFreeContract = this.getFreeContractInstance(this.router, PANCAKE, this.provider)
            this.routerPaidContract = this.getPaidContractInstance(this.router, PANCAKE, this.provider)
            this.WBNBFreeContract = this.getFreeContractInstance(this.WBNB, ERC20, this.provider)
            this.WBNBPaidContract = this.getPaidContractInstance(this.WBNB, ERC20, this.provider)
        }else{
            this.mode = mode
            this.chain = ChainId.MAINNET
            this.web3ws = new Web3(new Web3.providers.WebsocketProvider(mainNetSocket))
            this.web3 = new Web3(new Web3.providers.HttpProvider(mainNet))
            this.provider = new ethers.providers.JsonRpcProvider(mainNet)
            this.signer = new ethers.Wallet(privateKey, this.provider)
            this.privateKey = privateKey
            this.WBNB = '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c'
            this.factory = '0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73'
            this.router =  '0x10ED43C718714eb63d5aA57B78B54704E256024E'
            this.recipient = account
            this.routerFreeContract = this.getFreeContractInstance(this.router, PANCAKE, this.provider)
            this.routerPaidContract = this.getPaidContractInstance(this.router, PANCAKE, this.provider)
            this.WBNBFreeContract = this.getFreeContractInstance(this.WBNB, ERC20, this.provider)
            this.WBNBPaidContract = this.getPaidContractInstance(this.WBNB, ERC20, this.provider)
        }
        this.wallet = new ethers.Wallet(this.privateKey)
        this.approveMaxValue = "115792089237316195423570985008687907853269984665640564039457584007913129639935"
    }

    async getAccountBalance(){
        let balance = await this.provider.getBalance(this.wallet.address)
        console.log('account balance', balance)
        return balance
    }

    async getFreeContractInstance(contractAdress, abi, signerOrProvider = this.provider){
        const contract = new ethers.Contract(contractAdress, abi, signerOrProvider)
        return contract
    }

    async getPaidContractInstance(contractAdress, abi, signerOrProvider = this.provider){
        const contract = new ethers.Contract(contractAdress, abi, signerOrProvider)
        return contract
    }

    async callContractMethod(contractInstance, methodName, options = {}, transactionOptions){
        let resultOfCall = null
        let owner = this.recipient
        let spender = this.router
        let swapMethod = methodName
        if(methodName.includes('swap')){
            methodName = "router"
        }
        if(options.hasOwnProperty("spender")){
            spender = options.spender
        }
        switch(methodName){
            case "getAmountsIn":
            case "getAmountsOut":
                resultOfCall = await contractInstance[methodName](options.balanceTokenIn, [options.tokenIn, options.tokenOut])
                break;
            case "deposit":
                resultOfCall = await contractInstance[methodName](options)
                break;
            case "allowance":
                resultOfCall = await contractInstance[methodName](owner, spender)
                break;
            case "approve":
                resultOfCall = await contractInstance[methodName](spender, options.value)
                break;
            case "balanceOf":
                resultOfCall = await contractInstance[methodName](owner)
                break;
            case "router":
                resultOfCall = await contractInstance[swapMethod](...options, transactionOptions)
                break;
            default:
                resultOfCall = await contractInstance[methodName]()
                break;
        }

        return resultOfCall
    }

    async estimateGasForContract(contractInstance, methodName){
        let estimatedGas = await contractInstance.estimateGas[methodName]
        return estimatedGas
    }

    async formatAmount(parsedAmount){
        if(parsedAmount === 0){
            console.log("Le token n'est pas encore dans mon portefeuille")
            return 0
        }
        if(parsedAmount instanceof CurrencyAmount){
            return parsedAmount.toExact()
        }else{
            return parsedAmount.toSignificant(6)
        }
    }

    async getToken(address, decimals){
        if(this.mode === "test"){
            return new Token(ChainId.BSCTESTNET, address, decimals)
        }
        if(this.WBNB == address){
            return ETHER
        }
        return new Token(ChainId.MAINNET, address, decimals)
    }

    async fetchPair(inputTokenInstance, outputTokenInstance){

        let pair = await Fetcher.fetchPairData(inputTokenInstance, outputTokenInstance, this.provider)
        const route = new Route([pair], WETHs[inputTokenInstance.chainId])

        let pairData = {
            tokenPriceInBnb: route.midPrice.toSignificant(6), // 1 token = tant de bnb
            bnbPriceForOneToken: route.midPrice.invert().toSignificant(6), // 1 bnb = tant de tokens
            route: route,
            pair: pair
        }

        return pairData
    }

    async parseAmount(value, currency, tokenContractInstance){
        const decimals = await this.callContractMethod(tokenContractInstance, 'decimals')
        const typedValueParsed = ethers.utils.parseUnits(value, decimals).toString()
        if (typedValueParsed !== '0') {
            return currency instanceof Token
                ? new TokenAmount(currency, JSBI.BigInt(typedValueParsed))
                : CurrencyAmount.ether(JSBI.BigInt(typedValueParsed))
        }
    }

    async parseCurrency(value){
        const typedValueParsed = ethers.utils.parseUnits(value, 18).toString()
        if (typedValueParsed !== '0') {
            return new CurrencyAmount.ether(JSBI.BigInt(typedValueParsed))
        }
    }

    async parseToken(value, tokenInstance, tokenContractInstance){
        const decimals = await this.callContractMethod(tokenContractInstance, 'decimals')
        const typedValueParsed = ethers.utils.parseUnits(value, decimals).toString()
        if (typedValueParsed !== '0') {
            return new TokenAmount(tokenInstance, JSBI.BigInt(typedValueParsed))
        }
        return 0
    }

    readableValue(value, decimals){
        let customValue = value / Math.pow(10, decimals)
        return customValue.toFixed(6) // attention j'ai modifier ici, avant c'etait 4
    }

    readableBnb(value){
        let customValue = value / Math.pow(10, 18)
        return customValue.toString()
    }

    async makeDepositOfWBNB(tokenInContractInstance, inputAmount){
        try{
            const deposit = await this.callContractMethod(tokenInContractInstance, "deposit", { value: `0x${inputAmount.raw.toString(16)}` })
            const waitDeposit = await deposit.wait()
        }catch(err){
            console.log('deposit failed', err)
            process.exit()
        }

        return true
    }

    async checkTokenBalance(tokenContractInstance, tokenInstance, readable){
        const balanceOfToken = await this.callContractMethod(tokenContractInstance, 'balanceOf', this.recipient)
        console.log(this.recipient)
        console.log('balacne', balanceOfToken)
        if(tokenContractInstance.address === this.WBNB){
            if(balanceOfToken.isZero()){
                console.log('Aucun WBNB disponible pour le trade')
                return
                //process.exit()
            }
            if(readable){
                const balance = await this.parseCurrency(balanceOfToken.toString())
                return await this.formatAmount(balance)
            }
            return await this.parseCurrency(balanceOfToken.toString())
        }

        if(readable){
            const balance = await this.parseToken(balanceOfToken.toString(), tokenInstance, tokenContractInstance)
            return await this.formatAmount(balance)
        }
        return await this.parseToken(balanceOfToken.toString(), tokenInstance, tokenContractInstance)
    }

    async approveIfNeeded(tokenInContractInstance, value, gasLimit, gasPrice){
        let allowanceTokenIn = await this.getAllowance(tokenInContractInstance)
        console.log('allowance', allowanceTokenIn)
        //const allowanceTokenIn = ethers.BigNumber.from(0)
        try{
            if(allowanceTokenIn.lt(value)){
                console.log('no allowance for token in')
                let abi = ["function approve(address _spender, uint256 _value) public returns (bool success)"]
                let contract = new ethers.Contract(tokenInContractInstance.address, abi, this.signer)
                const tx = await contract.approve(this.router, this.approveMaxValue, {gasLimit: gasLimit, gasPrice: gasPrice})
                let waitApprovedIn = await tx.wait()
                allowanceTokenIn = await this.getAllowance(tokenInContractInstance)
                console.log('allowance', allowanceTokenIn)
            }
            console.log('money allowed for tokens')
        }catch(err){
            console.log('approve error', err)
            return false
        }

        return true
    }

    async getTradeOptions(allowedSlippage, feeOnTransfer = false){
        return {
            allowedSlippage: new Percent(JSBI.BigInt(allowedSlippage), BIPS_BASE),
            ttl: 60 * 20,
            recipient: await this.checkSum(this.recipient),
            feeOnTransfer: feeOnTransfer
        }
    }

    calculateGasMargin(value){
        return value.mul(ethers.BigNumber.from(10000).add(ethers.BigNumber.from(1000))).div(ethers.BigNumber.from(10000))
    }

    async getAllowance(contract){
        const allowance = this.callContractMethod(contract, 'allowance')
        return allowance
    }

    async checkSum(address){
        return ethers.utils.getAddress(address)
    }

    async buyFast(tokenIn, tokenOut, value, allowedSlippage, gasPrice, gasLimit, feeOnTransfer){
        const tokenOutContractInstance = await this.getFreeContractInstance(tokenOut, ERC20)
        const routerContractInstance =  await this.getPaidContractInstance(this.router, PANCAKE, this.signer)
        const tokenOutDecimals = await this.callContractMethod(tokenOutContractInstance, "decimals")

        const tokenInInstance = new Token(this.chain, tokenIn, 18)
        const tokenOutInstance = new Token(this.chain, tokenOut, tokenOutDecimals)
        const pairData = await this.fetchPair(tokenInInstance, tokenOutInstance)
        const pair = pairData.pair
        const route = new Route([pair], tokenInInstance)

        const typedValueParsed = ethers.utils.parseUnits(value.toString(), 18)
        const trade = new Trade(route, new TokenAmount(tokenInInstance, typedValueParsed), TradeType.EXACT_INPUT)
        const tradeOptions = await this.getTradeOptions(allowedSlippage, feeOnTransfer)

        gasPrice = ethers.utils.parseUnits(gasPrice.toString(), 'gwei')

        const swap = Router.swapCallParameters(trade, tradeOptions, true, false)
        const transactionOptions = {gasPrice: gasPrice, gasLimit: gasLimit}
        transactionOptions.value = ethers.utils.parseUnits(value.toString(), 'ether')
        console.log(swap)
        this.approveIfNeeded(tokenOutContractInstance, ethers.utils.parseUnits(this.approveMaxValue), 1000000, gasPrice)
        const result = await this.callContractMethod(routerContractInstance, swap.methodName, swap.args, transactionOptions)
        const confirm = await result.wait()
        console.log('acheté')
        return confirm
    }

    async swap(typeOfSwap = null, tokenIn, tokenOut, value, allowedSlippage = 12, gasPrice, gasLimit, feeOnTransfer = false){
        //Contracts
        const tokenInContractInstance =  await this.getFreeContractInstance(tokenIn, ERC20)
        const tokenOutContractInstance = await this.getFreeContractInstance(tokenOut, ERC20)
        const routerContractInstance =  await this.getPaidContractInstance(this.router, PANCAKE, this.signer)

        //Tokens
        const tokenInDecimals = await this.callContractMethod(tokenInContractInstance, "decimals")
        const tokenOutDecimals = await this.callContractMethod(tokenOutContractInstance, "decimals")
        const tokenInInstance = new Token(this.chain, tokenIn, tokenInDecimals)
        const tokenOutInstance = new Token(this.chain, tokenOut, tokenOutDecimals)
        let pairData = await this.fetchPair(tokenInInstance, tokenOutInstance)
        //Pair and route
        const pair = pairData.pair
        const route = new Route([pair], tokenInInstance)

        //await this.makeDepositOfWBNB(paidTokenInContractInstance, new CurrencyAmount.ether(JSBI.BigInt(1)))

        const checkTokenInBalance = await this.checkTokenBalance(tokenInContractInstance, tokenInInstance, true)
        //const checkTokenOutBalance = await this.checkTokenBalance(tokenOutContractInstance, tokenOutInstance, true)
        console.log('balance tokenIn', checkTokenInBalance)
        //console.log('balance tokenOut', checkTokenOutBalance)

        //manage sell/buy value
        let typedValueParsed = ethers.utils.parseUnits(value.toString(), tokenInDecimals)
        if(typeOfSwap === "sell"){
            console.log('selling')
            typedValueParsed = await this.parseToken(checkTokenInBalance, tokenInInstance, tokenInContractInstance)
            typedValueParsed = typedValueParsed.toSignificant(6)
        }
        let bnbValue = CurrencyAmount.ether(JSBI.BigInt(typedValueParsed))
        //Create trade
        const trade = new Trade(route, new TokenAmount(tokenInInstance, typedValueParsed), TradeType.EXACT_INPUT)
        const tradeOptions = await this.getTradeOptions(allowedSlippage, feeOnTransfer)
        gasPrice = ethers.utils.parseUnits(gasPrice.toString(), 'gwei')
        //approval
        if(typeOfSwap !== "buy"){
            await this.approveIfNeeded(tokenInContractInstance, ethers.utils.parseUnits(value.toString()), 500000, gasPrice)
        }

        //create hex swap
        let etherIn = (tokenIn === this.WBNB ? true : false)
        let etherOut =  (tokenOut === this.WBNB ? true : false)

        let swap = Router.swapCallParameters(trade, tradeOptions, etherIn, etherOut)
        let transactionOptions = {gasPrice: gasPrice, gasLimit: gasLimit}
        console.log(transactionOptions)

        if(typeOfSwap !== "sell"){
            transactionOptions.value = ethers.utils.parseUnits(value.toString(), 'ether')
        }
        console.log(swap)
        //verify transaction
        try{
            let estimateGas = await routerContractInstance.estimateGas[swap.methodName](...swap.args, transactionOptions)
            console.log(estimateGas)
        }catch(err){
            console.log("gas estimation error, retry now")
            console.log(err)
            if(feeOnTransfer === false){ // si ça fail c'est peut-être qu'il faut activé le feeOnTransfer ... ou pas
                return await this.swap(typeOfSwap, tokenIn, tokenOut, value, allowedSlippage, gasPrice, gasLimit, true)
            }
        }
        let result = await this.callContractMethod(routerContractInstance, swap.methodName, swap.args, transactionOptions)
        let confirm = await result.wait()
        console.log(confirm)
        return confirm

    }



    async swapFast(originalTransaction, victimAddress, newGasPrice, newGasLimit){
        let inputData = originalTransaction.input
        let parsedRecipientAddress = this.recipient.substring(2)
        victimAddress = victimAddress.substring(2)
        victimAddress = victimAddress.toLowerCase()
        let newData = inputData.replace(victimAddress.toLowerCase(), parsedRecipientAddress.toLowerCase())
        const common = Common.default.forCustomChain('mainnet', {
            name: 'bnb',
            networkId: 56,
            chainId: 56
        }, 'petersburg');

        let nonce = await this.web3.eth.getTransactionCount(this.recipient)
        newGasPrice = parseInt(newGasPrice) * (10 ** 9)
        newGasLimit = parseInt(newGasLimit)

        let newRawTransaction = {from: this.recipient,
            gasLimit: this.web3.utils.toHex(newGasLimit),
            gasPrice: this.web3.utils.toHex(newGasPrice),
            data: newData,
            nonce: this.web3.utils.toHex(nonce),
            to: originalTransaction.to,
            value: this.web3.utils.toHex(originalTransaction.value),
            chainId: 56
        }

        let privKey = new Buffer(this.privateKey, 'hex');
        let transaction = new Tx(newRawTransaction, {common})
        transaction.sign(privKey)

        const serializedTx = transaction.serialize().toString('hex')
        let sendTransaction = await this.web3.eth.sendSignedTransaction('0x' + serializedTx)
        console.log(sendTransaction)
        return sendTransaction
    }




    async checkLiquidity(routerContractInstance, balanceTokenIn, tokenIn, tokenOut) {
        try {
            if(balanceTokenIn == 0){
                balanceTokenIn = ethers.utils.parseUnits("1", "ether")
            }
            const options = {balanceTokenIn: balanceTokenIn, tokenIn: tokenIn, tokenOut: tokenOut} // j'ai interverti ici pour avoir un pourcentage cohérent voir commentaire dans createIntervalForCoin
            return await this.callContractMethod(routerContractInstance, "getAmountsOut", options)
        } catch (err) {
            console.log(err)
            console.log("pas de liquidité")
            return false
        }
    }

    async snipeLaunch(tokenOut, buyAmount, slippage, gasPrice, gasLimit) {
        const routerContractInstance = await this.getPaidContractInstance(this.router, PANCAKE, this.signer)
        const tokenOutContractInstance = await this.getFreeContractInstance(tokenOut, ERC20)
        const tokenOutDecimals = await this.callContractMethod(tokenOutContractInstance, "decimals")
        const tokenIn = this.WBNB
        let liquidityAvailable = false

        while(liquidityAvailable === false) {
            liquidityAvailable = await this.checkLiquidity(routerContractInstance, 0, tokenIn, tokenOut)
        }
        console.log('on achete poto')

        await this.buyFast(tokenIn, tokenOut, buyAmount, slippage, gasPrice, gasLimit, true)

        return true
    }



    async listenPriceOfCoin(typeOfListen,tokenIn, tokenOut, tokenOutName, targetIncrease, value, sellSlippage, sellGas, gasLimit, feeOnTransfer, goOut = false){


        //let balanceTokenIn = await contractTokenIn.balanceOf(addresses.recipient)
        //console.log(tokenOut)
        const routerContractInstance = await this.getPaidContractInstance(this.router, PANCAKE, this.signer)
        const tokenOutContractInstance =  await this.getFreeContractInstance(tokenOut, ERC20)
        const tokenInContractInstance =  await this.getFreeContractInstance(tokenIn, ERC20)
        const tokenInDecimals = await this.callContractMethod(tokenInContractInstance, "decimals")
        const tokenOutDecimals = await this.callContractMethod(tokenOutContractInstance, "decimals")

        let balanceTokenIn = await this.callContractMethod(tokenInContractInstance, "balanceOf")
        let amounts = await this.checkLiquidity(routerContractInstance, balanceTokenIn, tokenIn, tokenOut) // pour 1 bnb, combien
        let initialAmountIn = this.readableValue(amounts[0].toString(), tokenInDecimals)
        let initialAmountOut = this.readableValue(amounts[1].toString(), tokenOutDecimals) //
        console.log('initialAmountIn :',initialAmountIn)
        console.log('initialAmountOut :',initialAmountOut)


        if(amounts !== false){
            const intervalAchieved = await this.createIntervalForCoin(typeOfListen, targetIncrease, balanceTokenIn,tokenIn, tokenOut, initialAmountIn, initialAmountOut, tokenOutName, tokenOutDecimals, routerContractInstance, value, sellSlippage, sellGas, gasLimit, feeOnTransfer, goOut)
            console.log("interval fini", intervalAchieved)
            if(intervalAchieved === true){
                return true
            }

        }
    }

    async createIntervalForCoin(typeOfListen, targetIncrease, balanceTokenIn, tokenIn, tokenOut, initialAmountIn, initialAmountOut, tokenOutName, tokenOutDecimals, routerContractInstance, value, sellSlippage, sellGas, gasLimit, feeOnTransfer, goOut){
        return await new Promise((resolve) => {
            const waitProfit = setInterval(async() => {
                try{
                    let amounts = await this.checkLiquidity(routerContractInstance, balanceTokenIn, tokenIn, tokenOut)
                    let actualAmountOut = this.readableValue(amounts[1].toString(), tokenOutDecimals)
                    let pourcentageFluctuation = this.calculateIncrease(initialAmountOut,actualAmountOut)


                    console.log('----------------')
                    if(typeOfListen === "buy"){
                        console.log('\x1b[36m%s\x1b[0m', "decreasePourcentage : "+ pourcentageFluctuation + "% " + tokenOut + " " + tokenOutName);
                        console.log(pourcentageFluctuation, targetIncrease)
                        if(pourcentageFluctuation <= targetIncrease && isFinite(pourcentageFluctuation)){ // vu que c'est amountsOut, je vérifie combien de tokenOut je peux avoir pour 1 BNB, c'est négatif car du coup moins je peux avoir de tokenOut, plus il a pris de la valeur
                            console.log("La valeur du token " + tokenOut + "a baissé de : " + pourcentageFluctuation +"%,  envoi de l'ordre d'achat en cours" + " cible: " + actualAmountOut + " bnb")
                            clearInterval(waitProfit)
                            console.log('buy token: ',value)
                            //await this.swap("buy",tokenOut, tokenIn, value, sellSlippage, sellGas, gasLimit, feeOnTransfer)
                            console.log("Acheté lors de la baisse")
                            resolve(true)
                        }
                    }else{
                        console.log('\x1b[36m%s\x1b[0m', "increasePourcentage : "+ pourcentageFluctuation + "% " + tokenOut + " " + tokenOutName);
                        if(pourcentageFluctuation >= targetIncrease && isFinite(pourcentageFluctuation)){ // vu que c'est amountsOut, je vérifie combien de tokenOut je peux avoir pour 1 BNB, c'est négatif car du coup moins je peux avoir de tokenOut, plus il a pris de la valeur
                            console.log("La valeur du token " + tokenOut + "a augmenté de : " + pourcentageFluctuation +"%,  envoi de l'ordre d'achat en cours" + " cible: " + actualAmountOut + " bnb")
                            clearInterval(waitProfit)
                            //await this.swap("sell",tokenOut, tokenIn, value, sellSlippage, sellGas, gasLimit, feeOnTransfer)
                            console.log("Vendu avec profit")
                            resolve(true)
                        }
                        if(goOut !== false && pourcentageFluctuation <= goOut){
                            console.log("le token mord la poussière, on se barre")
                            clearInterval(waitProfit)
                            resolve(true)
                        }

                    }
                    console.log('----------------')
                }catch(err){
                    console.log("error within interval")
                    console.log(err)
                    resolve(err)
                }

            }, 1000);
        });

    }


    calculateIncrease(originalAmount, newAmount){
        console.log(originalAmount + '-' + newAmount)
        let increase = originalAmount - newAmount   // 100 - 70 = 30
        //console.log(newAmount , originalAmount)
        increase = increase / originalAmount  //  30/ 70
        increase = increase * 100
        increase = Math.round(increase)
        return increase
    }



}
