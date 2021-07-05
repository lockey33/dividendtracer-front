import React from "react";
import {GlobalContext, StateConsumer} from '../provider/GlobalProvider';
import axios from 'axios';
import socketIOClient from "socket.io-client";
import chartLogo from "../images/poocoinLogo.png";
const apiUrl = "http://localhost:8080"

const socket = socketIOClient(apiUrl);


class Home extends React.Component {

    state = {
        tokens: [],
        listenInterval: null
    }

    static contextType = GlobalContext;


    componentDidMount = async () => {
        await this.listenTokens()
    }

    numberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    reset = async () => {
        const deleteTokens = await axios.get(apiUrl + "/deleteTokens")
        this.setState({tokens: []})
        console.log("reset")
    }

    reRoll = async (e) => {

        let button = e.target
        button.disabled = true
        button.style = "background-color: grey"

        setTimeout(() => {
            button.disabled = false
            button.style = "background-color: #0a81d1ff"
        }, 2000)
        await this.deleteAllIntervals()
        await this.listenTokens()
        console.log('rerolled', this.state.tokens)
    }

    listenTokens = async () => {
        const timer = 4000
        let tokens = await this.getActiveTokens()
        const listenInterval = setInterval(async () => {
            await this.getActiveTokens()
        }, timer)

        this.setState({listenInterval})
    }

    listenTokensManually = async () => {
        const timer = 4000
        let tokens = await this.getActiveTokens()
        await axios.post(apiUrl + "/listenTokens", {tokens: tokens, timer: timer})
        const listenInterval = setInterval(async () => {
           await this.getActiveTokens()
        }, timer)

        this.setState({listenInterval})
    }

    getActiveTokens = async () => {
        let tokens = await axios.get(apiUrl + "/getTokens")
        tokens = tokens.data
        console.log(tokens)
        await this.setState({tokens: tokens})
        return tokens
    }

    deleteAllIntervals = async () => {
        await clearInterval(this.state.listenInterval)
        await axios.get(apiUrl + "/stopListen")
        console.log("stop")
    }

    render() {
        return (
            <div className="container flex column">
                <div className="flex justify-center">
                    <div className="flex w-50 rollContainer justify-center smallPaddingTop">
                        <button className="coolButton" onClick={(e) => this.reRoll(e)}> Re-roll</button>
                    </div>
                    <div className="flex w-50 rollContainer justify-center smallPaddingTop">
                        <button className="coolButton" onClick={() => this.deleteAllIntervals()}> Stop</button>
                    </div>
                    <div className="flex w-50 rollContainer justify-center smallPaddingTop">
                        <button className="coolButton" onClick={() => this.reset()}> Reset</button>
                    </div>
                </div>
                <div className="w-100 flex flexWrap justify-center smallMarginTop">
                    {this.state.tokens && Object.entries(this.state.tokens).map(([index,token]) => {
                        const poocoin = "https://poocoin.app/tokens/" + token.contract
                        return (
                            <div key={index} className="dataBox column">
                                <div className="dataBoxHeader flex column">
                                    <div className="flex space-between" style={{height: 20}}>
                                        <span>{token.name}</span>
                                        <div className="externalLinks">
                                            <a target="_blank" href={poocoin}>
                                                <img src={chartLogo} />
                                            </a>
                                        </div>
                                    </div>
                                    <div className="flex">
                                        <span>MarketCap: {this.numberWithCommas(token.marketCap)} $ (include burned tokens)</span>
                                    </div>
                                    <div className="flex">
                                        <span>TokenPrice: {token.price} $</span>
                                    </div>
                                </div>

                                <div className="dataBoxContent">
                                        {token.fluctuation && token.fluctuation.map((tokenFluctuation, index) => {
                                            const key = index + "tokenInfos"
                                            return (
                                                <div key={key}>
                                                    <span>{tokenFluctuation.date} : {tokenFluctuation.pourcentage}</span>
                                                </div>
                                            )
                                        })}
                                        <span></span>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

        )
    }
}

export default Home;
