import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const resolve = require('path').resolve
import axios from 'axios';
import coinSchema from './mongo.schemas/coinSchema.js';
import moment from 'moment';
import mongoose from "mongoose";
mongoose.connect("mongodb://localhost:27017/coinhunt", {useNewUrlParser: true});
const ethers = require("ethers");
const Web3 = require('web3');
const pancakeAbi = require('./factory/abi/pancake.json');
const wbnbAbi = require('./factory/abi/wbnb.json');
const helperAbi = require('./factory/abi/helper.json');
const approveSpenderAbi = require('./factory/abi/approveSpender.json');

const mainNet = "https://bsc-mainnet.web3api.com/v1/YG5ZXZX9AX6TA9NZAEX71SR8FAAFYPSCVX";
const mainNetBlockIo = "https://bsc.getblock.io/mainnet/?api_key=811a98b6-09f6-4fc8-a7f8-71112672ab97";
const addresses = {
    WBNB: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c', //prod
    factory: '0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73', //prod
    router: '0x10ED43C718714eb63d5aA57B78B54704E256024E', //prod
    recipient: '0x145239daBd91E2F3AD3D3A00C654c8FDa7bA5Fcc' //prod
    //recipient: '0xd19FC8336cC95e7A2cc3f859214D8e2A6467F9E9' //prod node
}
const privateKey = "ba65fb51edf8aa3e97a3beea9fdde2786a3acad63c4714da1b30313f53d99c96"; //prod

const web3 = new Web3(new Web3.providers.HttpProvider(mainNetBlockIo));
const provider = new ethers.providers.JsonRpcProvider(mainNetBlockIo)
const wallet = new ethers.Wallet(privateKey);
const account = wallet.connect(provider);
const approveMaxValue = "115792089237316195423570985008687907853269984665640564039457584007913129639935"

const router = new ethers.Contract(
    addresses.router,
    pancakeAbi,
    account
);


async function getAllCoins(){
    let allCoins = await coinSchema.find({"contracts.name": "Binance Smart Chain"})
    return allCoins
}

async function coinExist(coinId){
    let coin = await coinSchema.findOne({"id": coinId})
    if(coin == null){
        return false
    }else{
        return true // le coin n'existe pas
    }
}

async function insertNewCoins(){
    let coins = await getApprovedCoinsFromRemote()
    coins = coins.res
    let newCoins = []
    await Promise.all(coins.map(async (coin) => {
        let coinAlreadyExist = await coinExist(coin.id)
        if(!coinAlreadyExist){

            coin.insertedAtDate = moment().format('YYYY-MM-DD')
            coin.fresh = 1
            let coinsExtras = await getCoinContractFromRemote(coin.id)
            coinsExtras = coinsExtras.res[0]
            coin.links = coinsExtras.links
            coin.logo = coinsExtras.logo
            coin.contracts = coinsExtras.contracts
            newCoins.push(coin)
        }
    }))
    let newCoinsSchema = new coinSchema()
    if(newCoins.length > 0){
        newCoinsSchema.collection.insertMany(newCoins, function (err, docs) {
            if (err){
                return console.error(err);
            } else {
                console.log("Nouveaux coins insérés");
                return true
            }
        });
    }
    return false
}




function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

async function getApprovedCoinsFromRemote(){

    return axios.get("https://api.cnhnt.cc/public/getTodaysCoinsApproved")
        .then(function (response) {
            // handle success
            //console.log(response.data);
            return response.data
        })
        .catch(function (error) {
            // handle error
            console.log(error);
            return error
        })

}

async function getLowMarketCapCoins(freshOrNot, logNewCoins){
    let allCoins = await getAllCoins()
    let lowMarketCoins = []
    if(freshOrNot === true){
        freshOrNot = 1
    }else{
        freshOrNot = 0
    }
    allCoins.map((coin) => {
        if(coin.marketCap < 100000 && coin.marketCap !== 0 && coin.fresh === freshOrNot){
            lowMarketCoins.push(coin)
            if(logNewCoins){
                console.log(coin.name , coin.contracts[0].value, coin.marketCap)
            }
        }
    })

    return lowMarketCoins
}


async function getCoinContractFromRemote(id){
   return axios.get("https://api.cnhnt.cc/public/getCoinById/" + id)
        .then(function (response) {
            // handle success
            //console.log(response.data);
            return response.data
        })
        .catch(function (error) {
            // handle error
            console.log(error);
        })

}

function readableNumber(number){
    number = number / Math.pow(10, 18)
    return number.toFixed(4)
}

function calculateIncrease(originalAmount, newAmount){
    let increase = newAmount - originalAmount   // 100 - 70 = 30
    //console.log(newAmount , originalAmount)
    increase = increase / originalAmount  //  30/ 70
    increase = increase * 100
    increase = Math.round(increase)
    return increase
}

async function listenPriceOfCoin(tokenOut, tokenOutName){

    let tokenIn = "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c"
    let contractTokenIn = new ethers.Contract(tokenIn, wbnbAbi, account)
    //let balanceTokenIn = await contractTokenIn.balanceOf(addresses.recipient)
    let balanceTokenIn = ethers.utils.parseUnits("1", 'ether');
    //console.log(tokenOut)
    let amounts = await checkLiquidity(balanceTokenIn, tokenIn, tokenOut)
    let initialAmountIn = readableNumber(amounts[0])
    let initialAmountOut = readableNumber(amounts[1])
    if(amounts !== false){
        await createIntervalForCoin(balanceTokenIn,tokenIn, tokenOut, initialAmountIn, initialAmountOut, tokenOutName)
    }
}

async function createIntervalForCoin(balanceTokenIn, tokenIn, tokenOut, initialAmountIn, initialAmountOut, tokenOutName){
    let waitProfit = setInterval(async function(){
        let amounts = await router.getAmountsOut(balanceTokenIn, [tokenIn, tokenOut]);
        let actualAmountIn = readableNumber(amounts[0])
        let actualAmountOut = readableNumber(amounts[1])
        let increasePourcentage = calculateIncrease(initialAmountOut, actualAmountOut)
        console.log('----------------')
        console.log('\x1b[36m%s\x1b[0m', "increasePourcentage : "+ increasePourcentage + "% " + tokenOut + " " + tokenOutName);
        console.log('----------------')


        if(increasePourcentage >= 50){
            //console.log("La valeur du token " + tokenOut + "a augmenté de : " + increasePourcentage +"%,  envoi de l'ordre d'achat en cours")
            //clearInterval(waitProfit)
            //return console.log("Vendu avec profit")
        }
    }, 1000);

}

async function checkLiquidity(balanceTokenIn, tokenIn, tokenOut) {

    try {
        return await router.getAmountsOut(balanceTokenIn, [tokenIn, tokenOut]);
    } catch (err) {
        //console.log("pas de liquidité")
        return false
    }
}

function cleanCoinContract(contract){

    let cleanContract = contract.toString()

    if(contract.includes("#")){
        cleanContract = contract.split("#")[0]
    }

    if(contract.includes(" ")){
        cleanContract = contract.split(" ")[1]
    }

    return cleanContract
}

async function getSomeCoins(){
    let coins = coinSchema.find({insertedAtDate: "2021-05-19", "contracts.name": "Binance Smart Chain" })
    return coins
}

async function waitProfitableCoin(logNewCoins){
    let newCoinsInserted = await insertNewCoins()
    if(newCoinsInserted === false){
        console.log('new coins poto')
        let coins = await getLowMarketCapCoins(true, logNewCoins)
        //let coins = await getSomeCoins()
        //console.log(coins)
        coins.map(async (coin) => {
            //console.log(coin.name + "    " + coin.contracts[0].value + "  " + coin.marketCap)
            if(!coin.contracts[0].value.includes("https")){
              await listenPriceOfCoin(cleanCoinContract(coin.contracts[0].value), coin.name)
            }
        })
    }else{
        console.log("pas encore de nouveaux coins")
    }
}


waitProfitableCoin(false)
