import React from 'react'
import { GlobalContext } from "../provider/GlobalProvider"
import { ethers } from 'ethers'
import moment from 'moment'

const useGetData = async(tracker, wallet) => {
    const context = React.useContext(GlobalContext)
    const latest = await context.global.state.web3.eth.getBlockNumber()
    let url = "https://api.bscscan.com/api?module=account&action=txlistinternal&address=" + wallet + "&startblock=0&endblock=" + latest + "&sort=asc&apikey=JA73AMF9FJTNR1XV6GCITABDQT1XS4KJI7"
    const response = await axios.get(url)
    let data = response.data.result
    let dividends = []
    data.map((transaction) => {
        if (ethers.utils.getAddress(transaction.from) === tracker) {
            transaction.bnb = true
            dividends.push(transaction)
        }
        return transaction;
    })
    if(dividends.length === 0){
        let url = "https://api.bscscan.com/api?module=account&action=tokentx&address="+wallet+"&startblock=0&endblock="+latest+"&sort=asc&apikey=JA73AMF9FJTNR1XV6GCITABDQT1XS4KJI7"
        const response = await axios.get(url)
        const bepTokensData = response.data.result
        bepTokensData.map((bepData) => {
            if (ethers.utils.getAddress(bepData.from) === tracker) {
                dividends.push(bepData)
            }
            return bepData;
        })

    }

    return dividends
}

const checkSum = async (wallet, address) => {
    wallet = ethers.utils.getAddress(wallet.trim())
    address = ethers.utils.getAddress(address.trim())
    return wallet, address
}

export const useShowDividend = async (wallet, token, customTracker) => {
    const context = React.useContext(GlobalContext)
    try{
        await checkSum(wallet, token);
        let contractAbi = await context.global.actions.getContractABI(token)
        let tracker = await context.global.actions.getTracker(token, contractAbi);
        if(customTracker !== "" && tracker === false){
            tracker = customTracker
        }else if(customTracker !== "" && tracker !== false){
            customTracker = tracker
        }else if(tracker === false){
            throw 'dividendTracker'
        }

        tracker = tracker

        let calculatedData = await useCalculate(tracker, wallet);
        return calculatedData
    }catch(err){
        if(err === "dividendTracker"){                
           return {tracker: "", response: {status: false, type: "dividendTracker", message: "Dividend tracker address not found for this contract, please enter manually the dividend Tracker address"}}
        }else{
            console.log(err)
        }
    }

}

const useCalculate = async(tracker, wallet) => {
    const context = React.useContext(GlobalContext)
    let data = await useGetData(tracker, wallet)
    let dividends = []
    let bnbPrice = await context.global.actions.getBnbPrice()
    bnbPrice = bnbPrice.ethusd
    let todayGain = 0
    let globalGain = 0
    await Promise.all(data.map(async(transaction) => {
        console.log(transaction)
        if (ethers.utils.getAddress(transaction.from) === tracker) {
            let tokenAddress = transaction.contractAddress
            let tokenParsedValue = transaction.value
            let dollarValue = null
            let tokenValue = null
            if(transaction.hasOwnProperty('bnb')){
                tokenValue = await context.global.actions.readableValue(transaction.value, 18)
                dollarValue = tokenValue * bnbPrice
            }else{
                let tokenDecimals = await context.global.actions.getTokenDecimals(tokenAddress)
                tokenValue = await context.global.actions.readableValue(transaction.value, tokenDecimals)
                let tokenValueInBnb = await context.global.actions.getTokenValueForAmount(tokenParsedValue, tokenAddress, tokenDecimals)
                dollarValue = parseFloat(tokenValueInBnb)
                dollarValue = dollarValue * bnbPrice
            }

            let object = {
                timestamp: transaction.timeStamp,
                rawDollarValue: dollarValue.toFixed(4),
                dollarValue: dollarValue.toFixed(4) + " $",
                rawTokenValue: tokenValue,
                bnbValue: tokenValue + " " + (transaction.tokenSymbol ? transaction.tokenSymbol : "BNB")
            }
            globalGain += dollarValue

            let isCurrentDate = moment.unix(transaction.timeStamp).isSame(moment(), 'day')
            if (isCurrentDate) {
                todayGain += dollarValue
            }
            dividends.push(object)
        }
    }))

    globalGain = globalGain.toFixed(2) + " $"
    todayGain = todayGain.toFixed(2) + " $"
    dividends.sort(function (x, y) {
        return y.timestamp - x.timestamp;
    })

    return {dividends: dividends, globalGain: globalGain, todayGain: todayGain}
}