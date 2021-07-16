import React from "react";
import {GlobalContext} from '../provider/GlobalProvider';
import axios from 'axios';
import bscScan from '../images/bscscan.svg';
import Modal from '../components/Modal';

const apiUrl = "http://localhost:8080"


class Home extends React.Component {

    state = {
        presaleAddress: "",
        contributeAmount: "",
        isModalOpen: false
    }

    static contextType = GlobalContext;


    componentDidMount = async () => {
        await this.context.global.actions.init()
        if(this.context.global.actions && this.context.global.state.currentAccount){
            await this.context.global.actions.listenBnb()
            await this.refreshData()
        }

    }

    refreshData = async () => {
        setInterval(async () => {
            await this.context.global.actions.checkWallet(this.context.global.state.currentAccount)
        }, 60000)
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
        await this.context.global.actions.snipe(this.state)
    }

    connectWallet = async () => {
        await this.context.global.actions.connect()
    }
    openModal() {
        this.setState({ isModalOpen: true })
    }

    closeModal() {
        this.setState({ isModalOpen: false })
    }



    render() {
        let walletNumber = 0

        return (
            <div className="container flex column">
                <button onClick={() => this.openModal()}>Open modal</button>
                <Modal isOpen={this.state.isModalOpen} onClose={() => this.closeModal()}>
                    <h3>Modal title</h3>
                    <p>Content</p>
                </Modal>
                <div className="w-100 flex justify-right smallMarginTop ">
                    {this.context.global.state.currentAccount &&
                    <button onClick={() =>
                        this.connectWallet()} style={{width: "15%",lineHeight: "17px"}} className="coolButton smallMarginRight">
                        {this.context.global.state.currentAccount ?
                            this.context.global.state.currentAccountTrunc : "Connect Wallet"}

                    </button>
                    }
                    <button onClick={() => this.forceSnipeWallets()} style={{width: "15%",lineHeight: "17px"}} className="coolButton smallMarginRight">Create snipe wallets</button>

                </div>

                <div className="w-100 flex justify-center">
                    {this.context.global.state.bddWallet && this.context.global.state.bddWallet.snipeWallets.length > 0 &&
                        <h2>Snipe Wallets :</h2>
                    }
                </div>
                <div className="snipeWalletContainer w-100 flex justify-center">
                    {this.context.global.state.bddWallet && this.context.global.state.bddWallet.snipeWallets.map((wallet, index) => {
                        walletNumber++
                        const bscLink = "https://bscscan.com/address/" + wallet.address
                        return(
                            <div key={index} className="w-30 flex column snipeWallet smallVerticalMargin">
                                <div className="wrapper flex column">
                                    <div className="sniperWalletHeader flex justify-center">
                                        <h3> Wallet {walletNumber}</h3>
                                        <a rel="noreferrer" target="_blank" href={bscLink}>
                                            <img alt="bscLogo" className="logoBsc" src={bscScan} width={50}/>
                                        </a>
                                    </div>
                                    <span>BNB balance : {wallet.balance}</span>
                                    <span>Status : available</span>
                                    <button  onClick={() => this.handleLogs(wallet.address)} className="sniperWalletButtons">Check logs</button>
                                    {wallet.showLogs === true &&
                                    <div>
                                        <span>{wallet.logs.date} : {wallet.logs.text}</span>
                                    </div>
                                    }
                                    <button onClick={() => this.handlePrivateKey(wallet.address)} className="sniperWalletButtons" >{wallet.showPrivateKey === true ? "Hide privateKey" : "Show privateKey"}</button>
                                    {wallet.showPrivateKey === true &&
                                        <span>{wallet.privateKey}</span>
                                    }
                                </div>
                            </div>
                        )
                    })}
                </div>

                <div className="w-100 flex column justify-center align-center smallMarginTop">
                    <input onChange={(e) => {this.handlePresale(e)}} className="w-40" name="presaleAddress" placeholder="Presale address" value={this.state.presaleAddress} />
                    <input onChange={(e) => {this.handleContribute(e)}}  className="w-40" name="bnbAmount" placeholder="Contribute (example: 0.1 BNB)" value={this.state.contributeAmount} />
                </div>
                <div className="flex w-100 rollContainer justify-center smallPaddingTop">
                    <button className="coolButton" onClick={() => this.launchSnipe()}> Snipe this presale</button>
                </div>
                <div className="flex w-100 rollContainer justify-center smallPaddingTop">
                    <span>Please verify the minimum BNB amount for the presale, or your snipe will fail.</span>
                </div>

            </div>

        )
    }
}

export default Home;
