import React from "react";
import {GlobalContext} from '../provider/GlobalProvider';
import CheCoin from '../images/checoin.png';
import BabyCake from '../images/babycake.png';
import axios from 'axios';
import Moment from 'react-moment';
import * as moment from 'moment';
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import Loader from 'react-loader-spinner';
import ERC20 from '../abi/erc20.js';
import { ethers } from 'ethers';


class Home extends React.Component {

    state = {
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
    static contextType = GlobalContext;




    componentDidMount = async () => {
        //this.setState({wallet: ethers.utils.getAddress(this.state.wallet)})
        if(this.context.global.actions && this.context.global.state){
            await this.context.global.actions.initContracts()
            //let tokenValueInBnb = await this.context.global.actions.getTokenValueForAmount("8306881046664425", "0xacfc95585d80ab62f67a14c566c1b7a49fe91167", 18)
            //console.log(tokenValueInBnb)
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

    showDividend = async () => {
        try{
            await this.checkForm()
            if(this.state.response.status === true){

                await this.checkSum()
                this.setState({loading: true})
                let contractAbi = await this.context.global.actions.getFireBaseContractABI(this.state.address)
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

                await this.context.global.actions.pushInDatabase(this.state.address, this.state.wallet, calculatedData.globalGain, calculatedData.todayGain)
                this.context.global.actions.pushContractABI(contractAbi, this.state.address)
                this.setState({dividends: calculatedData.dividends, dividendsSave: calculatedData.dividends, globalGain: calculatedData.globalGain, todayGain: calculatedData.todayGain, fetching: true, loading: false})
                this.table.scrollIntoView({ behavior: "smooth" });

            }
        }catch(err){
            console.log('error', err)
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

    handleDate = async (date) => {
        this.setState({dateRange: date})
        await this.filterByDate(date)
    }

    filterByDate = async (date) => {
        let filteredData = []
        let dividends = (this.state.dividends.length === 0 | this.state.dividends.length !== this.state.dividendsSave ? this.state.dividendsSave : this.state.dividends)
        let momentDate = moment(date)

        let dateGain = 0
        dividends.map((row) => {
            let isCurrentDate = moment.unix(row.timestamp).isSame(momentDate, 'day')
            if (isCurrentDate) {
                dateGain += parseFloat(row.rawDollarValue)
                filteredData.push(row)
            }
        })
        this.setState({dividends: filteredData, dateGain: dateGain.toFixed(2)})
    }

    setCheCoin = async () => {
        let tracker = ethers.utils.getAddress("0xbae343c5a479b20f54e742fdbb8d5202a0f5d85f")
        this.setState({address: "0x54626300818e5c5b44db0fcf45ba4943ca89a9e2",tracker: tracker})
    }


    setCake = async () => {
        let tracker = ethers.utils.getAddress("0x363621Cb1B32590c55f283432D91530d77cf532f")
        this.setState({address: "0xdb8d30b74bf098af214e862c90e647bbb1fcc58c",tracker: tracker})
    }

    render() {
        return (
            <div className="pageContent container flex column">
                {this.state.loading === true &&
                    <Loader
                        className="loader"
                        type="Puff"
                        color="#009879"
                        height={100}
                        width={100}
                    />
                }
                <div className="sponsorContainer w-100 flex column justify-center align-center smallMarginTop">
                    <div className="sponsorContent w-50 justify-center flex">
                        <span>Want your ad here ? contact us at dividendtracer@gmail.com</span>
                    </div>
                </div>
                <div className="featuring w-100 flex column justify-center align-center">
                    <div style={{marginTop: "2%"}} className="title">
                        <h1>Trending tokens with rewards</h1>
                    </div>

                    <div className="flex w-100 justify-center trendingIcons">
                        <img id="checoin" onClick={() => this.setCheCoin()} height={100} src={CheCoin}/>
                        <img id="babycake" onClick={() => this.setCake()} height={100} src={BabyCake}/>
                    </div>
                    <div className="text">
                        <span style={{fontSize: "12px"}}> Click on one icon to set the token address automatically</span>
                    </div>
                </div>

                <div className="w-100 flex column align-center justify-center smallMarginTop">
                    <div className="w-65 flex column">
                        <div className="flex column align-center">
                            <div style={{paddingBottom: "4%"}} className="w-70 flex column">
                                <span className="smallBothMargin">Token Address</span>
                                <input onChange={(e) => this.handleAddress(e)} className="w-100" name="address"
                                       placeholder="Token address" value={this.state.address}/>
                                <span className="smallBothMargin">Wallet Address</span>
                                <input onChange={(e) => this.handleWallet(e)} className="w-100" name="wallet"
                                       placeholder="Your wallet address" value={this.state.wallet}/>
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
                            </div>
                            {this.state.response.status === false &&
                                <div className="flex w-100 justify-center smallPaddingBottom">
                                    <span style={{textAlign: "center"}}>{this.state.response.message}</span>
                                </div>
                            }

                            <div className="flex w-100 justify-center smallPaddingBottom">
                                <button id="showDividend" className="coolButton " onClick={() => this.showDividend()}> Show my dividends
                                </button>
                            </div>

                        </div>
                    </div>
                </div>

                <div className="tableContainer w-100 flex column align-center justify-center smallMarginTop">
                    <div className="w-65 flex column align-center">
                        <div style={{paddingBottom: "4%"}} className="w-70 flex column">
                            {this.state.fetching === true &&
                            <>
                                <div ref={(el) => { this.table = el }} className="flex column">
                                    <span> Global Gains : {this.state.globalGain}</span>
                                    <span> Today Gains : {this.state.todayGain}</span>
                                    <DatePicker placeholderText="Filter by date (YYYY/MM/DD)" dateFormat="yyyy/MM/dd"
                                                selected={this.state.dateRange}
                                                onChange={(date) => this.handleDate(date)}/>

                                    {this.state.dateRange !== "" &&
                                        <div className="smallMarginTop">
                                            <span>Gains on <Moment format="YYYY/MM/DD">{this.state.dateRange}</Moment> : {this.state.dateGain} $</span>
                                        </div>
                                    }
                                </div>
                                <table  className="styled-table">
                                    <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>$ Value</th>
                                        <th>Reward Amount</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {this.state.dividends.length > 0 && this.state.dividends.map((row, i) => {
                                        return (
                                            <tr key={i}>
                                                <td><Moment unix format="YYYY/MM/DD">{row.timestamp}</Moment></td>
                                                <td>{row.dollarValue}</td>
                                                <td>{row.bnbValue}</td>
                                            </tr>
                                        )
                                    })}
                                    </tbody>
                                </table>
                            </>
                            }

                            {this.state.dividends.length === 0 && this.state.fetching === true &&
                                <div className="smallMarginTop">
                                    <span>No data</span>
                                </div>
                            }
                        </div>
                    </div>

                </div>
            </div>

        )
    }
}

export default Home;
