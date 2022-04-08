import React from "react";
import { GlobalContext } from "../../provider/GlobalProvider";
import { ethers } from 'ethers';
import {Box, Text} from 'rebass';
import {AdBlock, PromotionWrapper, PromotionWrapperOrange} from './styled';
import { Form } from "../Forms/TrackerForm";
import { Card } from "../Card";
import Beans from "../../assets/images/beans.png";
import {PromotionButton, SubmitButton} from "../Forms/styled/index.js";
import {TelegramButton, TelegramButtonWhite} from "../Header/styled/index.js";
import {FaRocket, FaTelegramPlane} from "react-icons/fa";


export class Tracker extends React.Component {

    static contextType = GlobalContext;

    constructor(props) {
        super(props);
        this.state = {
            address: "",
            wallet: "",
            errorWallet: false,
            errorToken: false,
            errorForm: false,
            response: {}
        }
    }

    componentDidMount(){
        if(this.props.history.location.state){
            if(this.props.history.location.state.error === "dividendTracker"){
                this.setState({
                    address: this.props.history.location.state.address,
                    wallet: this.props.history.location.state.wallet,
                    response: {status: false, type: "dividendTracker", message: "Please check your wallet address"},
                })
                this.props.history.replace();
            }
        }
    }

    handleAddress = async (e) => {
        this.setState({errorToken: false, address: e});
    }

    handleWallet = async (e) => {
        this.setState({errorWallet: false, wallet: e})
    }

    checkAddress = async (address) => {
        try{
            ethers.utils.isAddress(address.trim())
            return true
        }catch(err){
            console.log(err);
            return false
        }
    }

    checkForm = async() => {
        if(this.state.wallet === "" && this.state.address === ""){
            this.setState({response: {status: false, message: "Please enter value for all the inputs"}, errorWallet: true, errorToken: true});
        }else if(await this.checkAddress(this.state.wallet) === false || this.state.wallet === ''){
            this.setState({response: {status:false}, errorWallet: true})
        }else if(await this.checkAddress(this.state.address) === false || this.state.address === ''){
            this.setState({response: {status:false},  errorToken: true})
        }else{
            this.setState({response: {status:true, message: "ok"}});
        }
        return;
    }

    results = async (e) => {
        e.preventDefault();
        await this.checkForm();
        if(this.state.response.status === true){
            this.props.history.push(`/results?token=${this.state.address}&wallet=${this.state.wallet}`);
            this.setState({address: "", wallet: "", errorWallet: false, errorToken: false, response: {}});
        }
    }

    render(){        
        return(
            <Box width={'100%'} mt={[3, 4]} mb={[2, 4]}>
                <PromotionWrapperOrange id={"promoContainer"} onClick={() => window.location = 'https://bakedbeans.io?ref=0x49fb7D60b23732DAe216B691B0B242EC357866DA'}>
                    <Text style={{display:"flex", flexDirection: "column", alignItems: "center"}} fontSize={["18px", "20px"]} fontFamily={"DM Sans"} color={"white"}> 📣 PROMOTION 📣 <br/>
                        <img id={"promoImage"} onClick={() => window.location = 'https://bakedbeans.io?ref=0x49fb7D60b23732DAe216B691B0B242EC357866DA'} style={{width: "100%"}} src={Beans} />
                        <small style={{fontSize: '14px', marginTop: '-10px'}}>
                            The BNB Reward Pool with the tastiest daily return and lowest dev fee ( 8% DAILY ! )
                    ️   </small>
                        <br/>
                        <PromotionButton id={"promoButton"} href={"https://bakedbeans.io?ref=0x49fb7D60b23732DAe216B691B0B242EC357866DA"}>Take your part of the cake now</PromotionButton>
                        <br/>
                        <PromotionButton id="telegramHeader" rel="noreferrer" target="_blank" href="https://t.me/BakedBeansMiner">Telegram  <FaTelegramPlane /></PromotionButton>
                    </Text>
                </PromotionWrapperOrange>
                <AdBlock><span>Make sure to disable your ad blocker in order to use our tracker</span></AdBlock>
{/*                <PromotionWrapper onClick={() => window.location = 'https://ponyswap.org'}>
                    <Text fontSize={["18px", "20px"]} fontFamily={"DM Sans"} color={"white"}>Here comes a new DEX on BSC, full of PONYs.<br/><small style={{fontSize: '14px'}}>Made with love by the DividendTracer Team. ❤️</small></Text>
                </PromotionWrapper>*/}
                <Card mt={3}>
                    <Form action={this.results} handleAddress={this.handleAddress} handleWallet={this.handleWallet} response={this.state.response} errorWallet={this.state.errorWallet} errorToken={this.state.errorToken} />
                </Card>
            </Box>
        )
    }
}