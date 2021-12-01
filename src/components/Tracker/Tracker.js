import React from "react";
import styled from "styled-components";
import { GlobalContext } from "../../provider/GlobalProvider";
import axios from 'axios';
import * as moment from 'moment';
import { ethers } from 'ethers';
import { Results } from "./Results";

const TrackerWrapper = styled.div`
    display: flex;
    background: #23262F;
    border-radius: 10px;
    padding: 40px 50px;
    margin-top: 1rem;
    margin-bottom: 3rem;
    @media (max-width: 768px) {
        padding: 40px;
    }
`

const AdBlock = styled.div`
    margin-top: 1rem;
    background: rgba(255, 100, 100, 0.49);
    border-radius: 10px;
    padding: 12px 20px;
    text-align: center;
    font-family: 'DM Sans';
    font-weight: bold;
    font-size: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #FFFFFF;
`

const SubmitButton = styled.button`
    background: #669566;
    border: solid 1px transparent;
    display: block;
    margin: 0 auto;
    border-radius: 10px;
    padding: 10px 20px;
    font-family: 'DM Sans';
    font-weight: bold;
    font-size: 16px;
    color: #FFFFFF;
    margin-left: auto;
    cursor: pointer;
    transition: all 0.3s ease-in-out;
    &:hover {
        border: solid 1px #6CF057;
    }
`

const ItemForm = styled.div`
    display: flex;
    flex-direction: column;
    align-items: stretch;
    margin-bottom: 2rem;
    label{
        color: white;
        font-family: 'DM Sans';
        font-weight: bold;
        font-size: 16px;
        margin-bottom: 10px;
    }
`

const Form = styled.form`
    width: 100%;
`

const Input = styled.input`
    padding: 20px;
    border-radius: 10px;
    background: rgba(119, 126, 144, 1);
    color: white;
    font-family: 'DM Sans';
    font-weight: bold;
    font-size: 16px;
    border: solid 1px transparent;
    &::placeholder{
        color: rgba(255, 255, 255, 0.5);
    }
    &:focus, &:active, &:focus-visible{
        outline: none;
        border: solid 1px #6CF057;
    }
`

export class Tracker extends React.Component {

    static contextType = GlobalContext;

    constructor(props) {
        super(props);
        this.state = {
            trending: [],
            response: {},
            tracker: "",
            customTracker: "",
            address: "",
            wallet: "",
            loading: false,
            dividends: [],
            dividendsSave: [],
            todayGain: 0,
            globalGain: 0,
            dateGain: 0,
            dateRange: "",
            fetching: false,
    
        }
    }

    componentDidMount = async () => {
        //this.setState({wallet: ethers.utils.getAddress(this.state.wallet)})
        if(this.context.global.actions && this.context.global.state){
            await this.context.global.actions.initContracts()
            let trending = await this.context.global.actions.getTrendingTokens()
            this.setState({trending: trending})
        }

    }

    getData = async() => {
        const latest = await this.context.global.state.web3.eth.getBlockNumber()
        let url = "https://api.bscscan.com/api?module=account&action=txlistinternal&address=" + this.state.wallet + "&startblock=0&endblock=" + latest + "&sort=asc&apikey=JA73AMF9FJTNR1XV6GCITABDQT1XS4KJI7"
        const response = await axios.get(url)
        let data = response.data.result
        let dividends = []
        data.map((transaction) => {
            if (ethers.utils.getAddress(transaction.from) === this.state.tracker) {
                transaction.bnb = true
                dividends.push(transaction)
            }
        })
        if(dividends.length === 0){
            let url = "https://api.bscscan.com/api?module=account&action=tokentx&address="+this.state.wallet+"&startblock=0&endblock="+latest+"&sort=asc&apikey=JA73AMF9FJTNR1XV6GCITABDQT1XS4KJI7"
            const response = await axios.get(url)
            const bepTokensData = response.data.result
            bepTokensData.map((bepData) => {
                if (ethers.utils.getAddress(bepData.from) === this.state.tracker) {
                    dividends.push(bepData)
                }
            })

        }

        return dividends
    }

    checkAddress = async (address) => {
        try{
            ethers.utils.getAddress(address.trim())
            return true
        }catch(err){
            return false
        }
    }

    checkForm = async() => {
        if(this.state.wallet === "" || this.state.address === ""){
            this.setState({response: {status: false, message: "Please enter value for all the inputs"}})
        }else if(await this.checkAddress(this.state.wallet) === false){
            this.setState({response: {status:false, message: "Wallet address incorrect"}})
        }else if(await this.checkAddress(this.state.address) === false){
            this.setState({response: {status:false, message: "Token address incorrect"}})
        }else{
            this.setState({response: {status:true, message: "ok"}})
        }

    }

    checkSum = async () => {
        let wallet = ethers.utils.getAddress(this.state.wallet.trim())
        let address = ethers.utils.getAddress(this.state.address.trim())
        this.setState({wallet: wallet, address: address})
    }

    showDividend = async (e) => {
        e.preventDefault();
        try{
            await this.checkForm()
            if(this.state.response.status === true){

                await this.checkSum()
                this.setState({loading: true})
                //let contractAbi = await this.context.global.actions.getFireBaseContractABI(this.state.address)
                //TODO en attendant d'avoir les contrats de nouveaux stockés en BDD j'appel direct l'API, a voir si ça passe ...
                let contractAbi = await this.context.global.actions.getContractABI(this.state.address)
                let tracker = await this.context.global.actions.getTracker(this.state.address, contractAbi)
                if(this.state.customTracker !== "" && tracker === false){
                    tracker = this.state.customTracker
                }else if(this.state.customTracker !== "" && tracker !== false){
                    this.setState({customTracker: tracker})
                }
                else if(tracker === false){
                    throw 'dividendTracker'
                }

                this.setState({tracker: tracker})


                let calculatedData = await this.calculate()
                //TODO ces 2 lignes servent a stocker les contrats dans firebase, a remplacer au plus vite
                //await this.context.global.actions.pushInDatabase(this.state.address, this.state.wallet, calculatedData.globalGain, calculatedData.todayGain)
                //this.context.global.actions.pushContractABI(contractAbi, this.state.address)
                this.setState({dividends: calculatedData.dividends, dividendsSave: calculatedData.dividends, globalGain: calculatedData.globalGain, todayGain: calculatedData.todayGain, fetching: true, loading: false})
                // this.table.scrollIntoView({ behavior: "smooth" });

            }
        }catch(err){
            console.log(err)
            this.setState({loading: false})
            if(err === "dividendTracker"){
                this.setState({tracker: "", response: {status: false, type: "dividendTracker", message: "Dividend tracker address not found for this contract, please enter manually the dividend Tracker address"}})
            }else{
                alert('An error occured, please retry')
            }
        }

    }

    calculate = async() => {
        let data = await this.getData()
        let dividends = []
        let bnbPrice = await this.context.global.actions.getBnbPrice()
        bnbPrice = bnbPrice.ethusd
        let todayGain = 0
        let globalGain = 0
        let profit = 0;
        await Promise.all(data.map(async(transaction) => {
            if (ethers.utils.getAddress(transaction.from) === this.state.tracker) {
                let tokenAddress = transaction.contractAddress
                let tokenParsedValue = transaction.value
                let dollarValue = null
                let tokenValue = null
                if(transaction.hasOwnProperty('bnb')){
                    tokenValue = await this.context.global.actions.readableValue(transaction.value, 18)
                    dollarValue = tokenValue * bnbPrice
                }else{
                    let tokenDecimals = await this.context.global.actions.getTokenDecimals(tokenAddress)
                    tokenValue = await this.context.global.actions.readableValue(transaction.value, tokenDecimals)
                    let tokenValueInBnb = await this.context.global.actions.getTokenValueForAmount(tokenParsedValue, tokenAddress, tokenDecimals)
                    dollarValue = parseFloat(tokenValueInBnb)
                    dollarValue = dollarValue * bnbPrice
                }

                let object = {
                    timestamp: transaction.timeStamp,
                    rawDollarValue: dollarValue.toFixed(4),
                    dollarValue: dollarValue.toFixed(4) + " $",
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

    handleTracker = async (e) => {
        this.setState({customTracker:  e.target.value})
    }

    handleAddress = async (e) => {
        this.setState({address: e.target.value})

    }

    handleWallet = async (e) => {
        this.setState({wallet:  e.target.value})
    }

    render(){
        console.log(this.state)
        return(
            <>
                {!this.state.fetching &&
                    <AdBlock><span>Make sure to disable your ad blocker in order to use our tracker</span></AdBlock>
                }
                <TrackerWrapper>
                {!this.state.fetching ?
                    <Form  action="">
                        <ItemForm>
                            <label htmlFor="item">Token address</label>
                            <Input onChange={(e) => this.handleAddress(e)} type="text" name="tokenaddr" placeholder="0x..." />
                        </ItemForm>
                        <ItemForm>
                            <label htmlFor="item">Wallet address</label>
                            <Input onChange={(e) => this.handleWallet(e)} type="text" name="walletaddr" placeholder="0x..." />
                        </ItemForm>
                        <SubmitButton onClick={(e) => this.showDividend(e)} type="submit">Track your dividend</SubmitButton>
                        {this.state.response.status === false && this.state.response.hasOwnProperty("type") && this.state.response.type === "dividendTracker"  &&
                                    <div className="smallBothMargin">
                                        <span>Dividend Tracker Address</span>
                                        <input className="w-100 smallMarginTop" onChange={(e) => this.handleTracker(e)}  name="wallet"
                                            placeholder="Dividend tracker address (check on your rewards tx)" value={this.state.customTracker}/>
                                    </div>
                                }
                                {this.state.customTracker !== ""  && this.state.response.status === true &&
                                    <div className="smallBothMargin">
                                        <span>Dividend Tracker Address</span>
                                        <input className="w-100 smallMarginTop" onChange={(e) => this.handleTracker(e)}  name="wallet"
                                               placeholder="Dividend tracker address (check on your rewards tx)" value={this.state.customTracker}/>
                                    </div>
                                }
                            {this.state.response.status === false &&
                                <div className="flex w-100 justify-center smallPaddingBottom">
                                    <span style={{textAlign: "center"}}>{this.state.response.message}</span>
                                </div>
                            }
                    </Form>
                    :
                    <>
                        <Results dividendsSave={this.state.dividendsSave} token={this.state.address} wallet={this.state.wallet} dividends={this.state.dividends} globalGain={this.state.globalGain} todayGain={this.state.todayGain} />
                    </>
                }
                </TrackerWrapper>
            </>
        )
    }

}