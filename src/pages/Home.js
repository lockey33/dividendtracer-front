import React from "react";
import {GlobalContext} from '../provider/GlobalProvider';
import axios from 'axios';
import bscScan from '../images/bscscan.svg';
import Modal from '../components/Modal';
import Moment from 'react-moment';
import * as moment from 'moment';
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import Loader from 'react-loader-spinner';
const apiUrl = "http://localhost:8080"


class Home extends React.Component {

    state = {
        presaleAddress: "",
        contributeAmount: "",
        gasPrice: "",
        gasLimit: "",
        presaleStartTime: "",
        snipeWalletAddress: "",
        countDown: "",
        isModalOpen: false,
        snipeModal: false
    }

    static contextType = GlobalContext;


    componentDidMount = async () => {
        if(this.context.global.actions){ // on attend que le contexte se charge
            await this.context.global.actions.init()
        }

        if(this.context.global.state.currentAccount){
            console.log(this.context.global.state.bddWallet.paymentWallet)
            if(this.context.global.state.bddWallet.premium === false){
                await this.context.global.actions.listenPayment()
                await this.refreshData(10000, true)

            }else{
                await this.context.global.actions.listenBnb()
                await this.refreshData(60000)
            }
        }

    }



    refreshData = async (timer, waitPayment = false) => {
        setInterval(async () => {
            await this.context.global.actions.checkWallet(this.context.global.state.currentAccount)
            if(waitPayment === true && this.context.global.state.bddWallet.premium === false){
                const balance = parseFloat(this.context.global.state.bddWallet.paymentWallet.balance)
                const required = parseFloat("0.095")
                if(balance >= required){
                    console.log('paid', balance, required)
                    await this.context.global.actions.setPremiumNow(this.context.global.state.bddWallet.paymentWallet.address, this.context.global.state.bddWallet.buyerAddress)
                    await this.context.global.actions.checkWallet(this.context.global.state.bddWallet.buyerAddress)
                }
            }

        }, timer)
    }

    forceSnipeWallets = async() => {
        const response = await axios.post(apiUrl + '/createSnipeWallets', {walletAddress: this.context.global.state.currentAccount})
        return response
    }

    handlePresale = (e) => {
        const input = e.target
        const presaleAddress = input.value
        this.setState({presaleAddress})
    }

    handleContribute = (e) => {
        const input = e.target
        const contributeAmount = input.value
        this.setState({contributeAmount})
    }

    handleGasPrice = (e) => {
        const input = e.target
        const gasPrice = input.value
        this.setState({gasPrice})
    }
    handleGasLimit = (e) => {
        const input = e.target
        const gasLimit = input.value
        this.setState({gasLimit})
    }

    handleLogs = async (walletAddress) => {
        let wallet = this.context.global.state.bddWallet

        wallet.snipeWallets.map((wallet) => {
            if(wallet.address === walletAddress){
                if(wallet.showLogs === true){
                    wallet.showLogs = false
                }else{
                    wallet.showLogs = true
                }
            }
            return wallet.showLogs
        })
        await this.context.global.actions.updateWalletState(wallet)

    }

    handlePrivateKey = async (walletAddress) => {
        let wallet = this.context.global.state.bddWallet

        wallet.snipeWallets.map((wallet) => {
            if(wallet.address === walletAddress){
                if(wallet.showPrivateKey === true){
                    wallet.showPrivateKey = false
                }else{
                    wallet.showPrivateKey = true
                }
            }
            return wallet.showPrivateKey
        })
        await this.context.global.actions.updateWalletState(wallet)

    }

    launchSnipe = async () => {
        console.log('launch')
        const snipeWallet = this.state.snipeWalletAddress
        let snipeWalletBalance = 0
        this.context.global.state.bddWallet.snipeWallets.map((wallet) => {
            if(wallet.address === snipeWallet){
                snipeWalletBalance = wallet.balance
            }
            return nul
        })
        const contributeAmount = this.state.contributeAmount
        console.log(snipeWalletBalance, contributeAmount)
        let funds = false
        if(parseFloat(snipeWalletBalance) >= parseFloat(contributeAmount)){
            funds = true
        }
        if(this.context.global.state.bddWallet.premium === true && funds === true){
            await this.context.global.actions.snipe(this.state)
            this.closeSnipeModal()
            await this.context.global.actions.checkWallet(this.context.global.state.currentAccount)
        }else if(funds === false){
            alert('Insufficient funds, please send BNB to your snipe wallet')
        }else{
            alert('You need a premium account to snipe')
        }
    }

    connectWallet = async () => {
        await this.context.global.actions.connect()
    }
    openModal() {
        this.setState({ isModalOpen: true })
    }

    closeModal= async () => {
        this.setState({ isModalOpen: false })
        const bddWallet = this.context.global.state.bddWallet

        bddWallet.snipeWallets.map((wallet) => {
            wallet.showPrivateKey = false
            wallet.showLogs = false

            return wallet
        })

        await this.context.global.actions.updateWalletState(bddWallet)
    }

    handlePresaleStartTime = async (date) => {
        this.setState({presaleStartTime: date})
    }

    openSnipeModal(){
        if(!this.state.presaleAddress || !this.state.contributeAmount || !this.state.gasLimit || !this.state.gasLimit || !this.state.presaleStartTime || !this.state.snipeWalletAddress){
            alert("Please fill in all the fields of the form")
        }else{
            this.setState({snipeModal: true})
            let eventTime= moment(this.state.presaleStartTime)
            let currentTime = moment()

            console.log(eventTime)
            console.log('time',currentTime)

            let diff = moment(eventTime).diff(currentTime);
            let duration  = moment.duration(diff)

            setInterval(() =>{
                currentTime = moment()
                diff = moment(eventTime).diff(currentTime);
                duration  = moment.duration(diff)
                this.setState({countDown: duration._data.hours + ":" + duration._data.minutes + ":" + duration._data.seconds})
            }, 1000);
        }
    }
    closeSnipeModal() {
        this.setState({ snipeModal: false })
    }

    handleSnipeWallet = async (event) => {
        this.setState({snipeWalletAddress: event.target.value})
    }


    render() {
        let walletNumber = 0

        return (
            <div className="container flex column">

                <div className="w-100  buttonContainer flex justify-right smallMarginTop smallMarginBottom">
                    {this.context.global.state.currentAccount && this.context.global.state.bddWallet &&
                        <button onClick={() =>
                            this.connectWallet()} style={{width: "15%",lineHeight: "17px"}} className="coolButton smallMarginRight">
                            {this.context.global.state.currentAccount ?
                                "Connected: " + this.context.global.state.bddWallet.truncBuyerAddress : "Connect Wallet"}

                        </button>
                    }
                </div>
                {this.context.global.state.bddWallet !== null && this.context.global.state.bddWallet.premium === false &&
                <div className="w-100 premiumContainer flex column buttonContainer smallMarginTop flex align-center justify-center smallMarginBottom">
                    <div className="w-65 flex column">
                        <div className="flex justify-center premiumBanner">
                            <h3>
                                You need a premium account to snipe
                            </h3>
                        </div>
                        <div className="flex column snipeWallet">
                            <div className="wrapper flex column">
                                <div className="sniperWalletHeader flex justify-center">
                                    <h3> Payment wallet (This wallet is unique)</h3>
                                    <a rel="noreferrer" target="_blank" href={"https://bscscan.com/address/" + this.context.global.state.bddWallet.paymentWallet.address}>
                                        <img alt="bscLogo" className="logoBsc" src={bscScan} width={50}/>
                                    </a>
                                </div>
                                <span>Address : {this.context.global.state.bddWallet.paymentWallet.address}</span>
                                <div className="flex">
                                    <span>BNB balance : {this.context.global.state.bddWallet.paymentWallet.balance}</span>
                                </div>
                                <div className="flex">
                                    <span>Status : {this.context.global.state.bddWallet.premium === false ? "Waiting payment" : "Paid"} </span>
                                    <Loader
                                        type="ThreeDots"
                                        color="white"
                                        height={45}
                                        width={30}
                                    />
                                </div>
                                <div className="flex column align-center justify-center">
                                    <h4>Send 0.5 BNB to this address to get premium </h4>
                                    <span style={{textAlign: 'center'}}>Premium account allow you to launch snipe when you want</span>
                                    <span>(3 snipes max at the same time)</span>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
                }
                <div className="snipeWalletContainer w-100 flex justify-center">
                    <div className="w-65 flex space-between">
                        {this.context.global.state.bddWallet && this.context.global.state.bddWallet.snipeWallets.map((wallet, index) => {
                            walletNumber++
                            const bscLink = "https://bscscan.com/address/" + wallet.address
                            return(
                                <div key={index} className="w-30 flex column snipeWallet">
                                    <div className="wrapper flex column">
                                        <div className="sniperWalletHeader flex justify-center">
                                            <h3> Snipe-wallet {walletNumber}</h3>
                                            <a rel="noreferrer" target="_blank" href={bscLink}>
                                                <img alt="bscLogo" className="logoBsc" src={bscScan} width={50}/>
                                            </a>
                                        </div>
                                        <span>Address : {wallet.truncAddress}</span>
                                        <span>BNB balance : {wallet.balance}</span>
                                        <span>Status : {wallet.state}</span>
                                        <div className="flex column align-center smallMarginTop">
                                            <button  onClick={() => this.handleLogs(wallet.address)} className="coolButton smallCoolButton reverseColor mediumMarginBottom">Check logs</button>
                                            <button onClick={() => this.handlePrivateKey(wallet.address)} className="coolButton reverseColor smallCoolButton" >{wallet.showPrivateKey === true ? "Hide privateKey" : "Show privateKey"}</button>
                                        </div>

                                    </div>
                                    <Modal isOpen={wallet.showPrivateKey} onClose={() => this.closeModal()}>
                                        <div className="modalHeader">
                                            <h3>Private Key : </h3>
                                        </div>
                                        <div className="modalContent">
                                            <p>{wallet.privateKey}</p>
                                        </div>
                                        <div className="modalFooter">
                                            <button onClick={() => this.closeModal()} className="coolButton">Close</button>
                                        </div>
                                    </Modal>
                                    <Modal isOpen={wallet.showLogs} onClose={() => this.closeModal()}>
                                        <div className="modalHeader">
                                            <h3>Logs : </h3>
                                        </div>
                                        <div className="modalContent">
                                            {wallet.logs.map((log, index) => {
                                                return(
                                                    <div key={index}>
                                                        <span>
                                                            <Moment unix format="YYYY/MM/DD HH:MM:ss">{log.date}</Moment> : {log.text}
                                                        </span>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                        <div className="modalFooter">
                                            <button onClick={() => this.closeModal()} className="coolButton">Close</button>
                                        </div>
                                    </Modal>
                                </div>
                            )
                        })}
                    </div>
                </div>

                <div className="w-100 sniperLaunch flex column align-center justify-center smallMarginTop">
                    <div className="w-65 flex column">
                        <div className="flex justify-center premiumBanner">
                            <h3>
                                Launch Snipe
                            </h3>
                        </div>
                        <div className="snipeContainer flex column align-center">
                            <div style={{paddingBottom: "4%"}} className="w-70 smallWrapper flex column">
                                <input onChange={(e) => {this.handlePresale(e)}} className="w-100" name="presaleAddress" placeholder="Presale address" value={this.state.presaleAddress} />
                                <input onChange={(e) => {this.handleContribute(e)}}  className="w-100" name="bnbAmount" placeholder="Contribute (example: 0.1 BNB)" value={this.state.contributeAmount} />
                                <input onChange={(e) => {this.handleGasPrice(e)}}  className="w-100" name="bnbAmount" placeholder="gasPrice (example: 5)" value={this.state.gasPrice} />
                                <input onChange={(e) => {this.handleGasLimit(e)}}  className="w-100" name="bnbAmount" placeholder="gasLimit (example: 500000)" value={this.state.gasLimit} />
                                <DatePicker placeholderText="Presale Start Time (available on DxSale)" showTimeSelect dateFormat="Pp" timeIntervals="1" selected={this.state.presaleStartTime} onChange={(date) => this.handlePresaleStartTime(date)} />
                                <select onChange={(event) => this.handleSnipeWallet(event)}>
                                    <option>Choose a snipe wallet to make this snipe</option>
                                    {this.context.global.state.bddWallet && this.context.global.state.bddWallet.snipeWallets.map((wallet, index) => {
                                        if(wallet.state === "available"){
                                            return(
                                                <option key={index} value={wallet.address}>{wallet.address}</option>
                                            )
                                        }
                                        return null
                                    })}
                                </select>
                            </div>

                            <div className="flex w-100 rollContainer justify-center smallPaddingBottom">
                                <button className="coolButton reverseColor" onClick={() => this.openSnipeModal()}> Snipe this presale</button>
                            </div>
                            <div className="flex w-100 rollContainer justify-center smallPaddingTop">
                                <div className="w-70">
                                    <span>Please verify the minimum BNB amount for the presale, or your snipe will fail.</span>
                                </div>
                            </div>
                            <Modal isOpen={this.state.snipeModal} onClose={() => this.closeSnipeModal()}>
                                <div className="modalHeader">
                                    <h3>Please verify below informations : </h3>
                                </div>
                                <div className="modalContent flex justify-center">
                                    <span>Presale start in : {this.state.countDown}</span>
                                    <span>BNB amount : {this.state.contributeAmount} </span>
                                </div>
                                <div className="modalFooter">
                                    <button onClick={() => this.launchSnipe()} className="coolButton">Confirm snipe</button>
                                </div>
                            </Modal>
                        </div>
                    </div>
                </div>
            </div>

        )
    }
}

export default Home;
