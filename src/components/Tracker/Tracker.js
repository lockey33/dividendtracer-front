import React from "react";
import { GlobalContext } from "../../provider/GlobalProvider";
import axios from 'axios';
import * as moment from 'moment';
import { ethers } from 'ethers';
import { Results } from "../Results/Results";
import { CustomLoader } from "../Loader/Loader";
import {Box, Flex, Text, Heading} from 'rebass';
import { VscDebugRestart } from "react-icons/vsc";
import { TrackerWrapper, AdBlock, SubmitButton, ItemForm, Form, Input, Button, ErrorMessage } from "./styled";


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
        this.setState({errorToken: false, address: e.target.value});        

    }

    handleWallet = async (e) => {
        this.setState({errorWallet: false, wallet:  e.target.value})
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
            <Box width={'100%'} my={[4, 5]}>
                <AdBlock><span>Make sure to disable your ad blocker in order to use our tracker</span></AdBlock>
                <TrackerWrapper>
                    <Form  action="">
                        <Heading fontFamily="DM Sans" color="white" fontSize={[3, 4]} mb={3} mt={0} textAlign="center">Start tracking your dividends</Heading>
                        <ItemForm>
                            <label htmlFor="item">Token address</label>
                            <Input className={this.state.errorToken ? 'error' : ''} onChange={(e) => this.handleAddress(e)} type="text" name="token" placeholder="0x..." required />
                            <ErrorMessage>{this.state.errorToken ? 'Please check token address' : ''}</ErrorMessage>
                        </ItemForm>
                        <ItemForm>
                            <label htmlFor="item">Wallet address</label>
                            <Input className={this.state.errorWallet ? 'error' : ''} onChange={(e) => this.handleWallet(e)} type="text" name="wallet" placeholder="0x..." required />
                            <ErrorMessage>{this.state.errorWallet ? 'Please check your wallet address' : ''}</ErrorMessage>
                        </ItemForm>
                        <SubmitButton id="searchDividendBtn" onClick={(e) => this.results(e)} type="submit">Track your dividend</SubmitButton>
                    </Form>
                </TrackerWrapper>
            </Box>
        )
    }
}