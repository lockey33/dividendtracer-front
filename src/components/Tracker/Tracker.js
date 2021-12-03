import React from "react";
import { GlobalContext } from "../../provider/GlobalProvider";
import axios from 'axios';
import * as moment from 'moment';
import { ethers } from 'ethers';
import { Results } from "./Results";
import { CustomLoader } from "../Loader/Loader";
import {Box, Flex, Text, Heading} from 'rebass';
import { VscDebugRestart } from "react-icons/vsc";
import { SubmitButton, ItemForm, FormWrapper, Input, ErrorMessage } from "../Forms/styled";
import {TrackerWrapper, AdBlock, Button} from './styled';
import { Form } from "../Forms/TrackerForm";


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
            errorToken: false,
            errorWallet: false,
        }
    }

    componentDidMount = async () => {
        //this.setState({wallet: ethers.utils.getAddress(this.state.wallet)})
        if(this.context.global.actions && this.context.global.state){
            await this.context.global.actions.initContracts()
            let trending = await this.context.global.actions.getTrendingTokens()
            this.setState({trending: trending})
        }

        if(this.context.wallet.state && this.context.wallet.actions){
            return this.context.wallet.state.currentAccount ? this.setState({wallet: this.context.wallet.state.currentAccount}) : this.setState({wallet: ''});
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
            return transaction;
        })
        if(dividends.length === 0){
            let url = "https://api.bscscan.com/api?module=account&action=tokentx&address="+this.state.wallet+"&startblock=0&endblock="+latest+"&sort=asc&apikey=JA73AMF9FJTNR1XV6GCITABDQT1XS4KJI7"
            const response = await axios.get(url)
            const bepTokensData = response.data.result
            bepTokensData.map((bepData) => {
                if (ethers.utils.getAddress(bepData.from) === this.state.tracker) {
                    dividends.push(bepData)
                }
                return bepData;
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
        if(this.state.wallet === "" && this.state.address === ""){
            this.setState({response: {status: false, message: "Please enter value for all the inputs"}, errorWallet: true, errorToken: true})
        }else if(await this.checkAddress(this.state.wallet) === false || this.state.wallet === ''){
            this.setState({response: {status:false}, errorWallet: true})
        }else if(await this.checkAddress(this.state.address) === false || this.state.address === ''){
            this.setState({response: {status:false},  errorToken: true})
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

    handleTracker = async (e) => {
        this.setState({customTracker:  e.target.value})
    }

    handleAddress = async (e) => {
        this.setState({errorToken: false, address: e.target.value});        

    }

    handleWallet = async (e) => {
        this.setState({errorWallet: false, wallet:  e})
    }

    restart = async () => {
        this.setState({
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
            errorWallet: false,
            errorToken: false,
        })
    }

    render(){
        return(
            <Box width={'100%'} my={[4, 5]}>
                {!this.state.fetching &&
                    <AdBlock><span>Make sure to disable your ad blocker in order to use our tracker</span></AdBlock>
                }
                <TrackerWrapper>
                {this.state.loading ? 
                    <Flex width={'100%'} alignItems="center" flexDirection='column'>
                        <CustomLoader /> 
                        <Text color="white" mt={3} fontFamily="DM Sans">Calculating your dividends...</Text>
                    </Flex>
                    : 
                    !this.state.fetching ?
                        <Form action={this.showDividend} handleAddress={this.handleAddress} handleTracker={this.handleTracker} handleWallet={this.handleWallet} response={this.state.response} customTracker={this.state.customTracker} errorWallet={this.state.errorWallet} errorToken={this.state.errorToken} />
                        :
                        <Flex width={'100%'} alignItems="start" flexDirection='column'>
                            <Flex justifyContent={'start'} alignItems={'center'}>
                                <Button id="startAgainTop" onClick={() => this.restart()}>
                                    Start again <VscDebugRestart />
                                </Button>
                            </Flex>
                            <Results dividendsSave={this.state.dividendsSave} token={this.state.address} wallet={this.state.wallet} dividends={this.state.dividends} globalGain={this.state.globalGain} todayGain={this.state.todayGain} />
                            <Flex mt={2} justifyContent={'start'} alignItems={'center'}>
                                <Button id="startAgainBottom" onClick={() => this.restart()}>
                                    Start again <VscDebugRestart />
                                </Button>
                            </Flex>
                        </Flex>
                }
                </TrackerWrapper>
            </Box>
        )
    }

}