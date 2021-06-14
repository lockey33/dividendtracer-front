import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const resolve = require('path').resolve

const {Api, TelegramClient} = require('telegram');
const {StringSession} = require('telegram/sessions');
const input = require('input') // npm i input

const apiId = 4792862
const apiHash = '1db38acb41a7c8794aaf203564281b12'
const fs = require('fs');
require.extensions['.txt'] = function (module, filename) {
    module.exports = fs.readFileSync(filename, 'utf8');
};

import SwapFactory from "../factory/swapFactory.js";
import config from "../config.js";
import ethers from "ethers";

const stringSession = require("./session.txt");

let session = new StringSession(stringSession); // fill this later with the value from session.save()

const client = new TelegramClient(session, apiId, apiHash,{});
await client.connect()
const idChannel = "BabyTigerBSC"

async function getMessagesFromChannel(client) {
    const myChannels = await client.invoke(new Api.contacts.ResolveUsername({
        username: "Kompress",
    }));

    const resolvedPeer = await client.invoke(new Api.contacts.ResolveUsername({
        username: idChannel,
    }));
    const channel = {id: resolvedPeer.chats[0].id, access_hash: resolvedPeer.chats[0].accessHash}

    const inputPeer = {
        _: 'inputPeerChannel',
        channel_id: channel.id,
        access_hash: channel.access_hash,
    };
    const LIMIT_COUNT = 3;
    const allMessages = [];

    const waitContract = await getHistoryByInterval(resolvedPeer, LIMIT_COUNT)
    console.log(waitContract)
    const swapDragmoon = new SwapFactory("prod", config.dragmoon.mainNetAccount,  config.dragmoon.mainNetKey) //dragmoon
    //const swapLanistar = new SwapFactory("prod", config.lanistar.account,  config.lanistar.key) //lanistar
    //const swapStark = new SwapFactory("prod", config.stark.account,  config.stark.key) //stark

    let token1 = ethers.utils.getAddress("0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c")
    let token2 = ethers.utils.getAddress(waitContract)

    let gasLimit = 1000000

    let buyValue = 0.02// BUY VALUE
    let buySlippage = 80 // BUY SLIPPAGE
    let buyGas = 20 // BUY GAS

    let sellValue = 100 //SELL VALUE
    let sellSlippage = 50 // SELL SLIPPAGE
    let sellGas = 25

    let targetIncrease = 200

    await swapDragmoon.snipeLaunch(token2, buyValue, buySlippage, buyGas, gasLimit)
    const increased = swapDragmoon.listenPriceOfCoin("sell", token1, token2, "new token", targetIncrease, sellValue, sellSlippage, sellGas, gasLimit, true, -20)
    await swapDragmoon.swap("sell",token2, token1, sellValue, sellSlippage, sellGas, gasLimit, true)
    console.log('vendu avec 200% de profit frelon, paye toi un grec')
    process.exit()
    //console.log('allMessages:', historyResult);

}

async function getHistoryByInterval(resolvedPeer, LIMIT_COUNT){
    return await new Promise((resolve) => {
        const waitContract = setInterval(async () => {
            const historyResult = await client.invoke(new Api.messages.GetHistory({
                peer: resolvedPeer,
                limit: LIMIT_COUNT,
            }))

            const historyCount = historyResult.count;
            historyResult.messages.map(async (data) => {
                try {
                    if (data.message.includes('0x')) {
                        let contractMessage = data.message
                        let contractPosition = contractMessage.indexOf('0x')
                        let contract = contractMessage.substring(contractPosition, contractPosition + 42)
                        clearInterval(waitContract)
                        resolve(contract)
                    }
                } catch (err) {
                    console.log('en attente du coin poto')
                }

            })
        }, 1000)
    });
}

async function getChannel() {


    const result = await client.invoke(new Api.channels.getChannels({
        id: [new Api.InputChannel("@PumpCakeOfficial")],
    }));
    console.log(result); // prints the result
}

async function getMessages(client){
    const msgs = await client.getMessages("me", {
        limit: 10,
    });
    console.log("the total number of msgs are", msgs.total);
    console.log("what we got is ", msgs.length);
    for (const msg of msgs) {
        //console.log("msg is",msg); // this line is very verbose but helpful for debugging
        console.log("msg text is : ", msg.text);
    }
}

getMessagesFromChannel(client)