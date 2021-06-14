import SwapFactory from "./factory/swapFactory.js";
import config from "./config.js";
import ethers from "ethers";
import ListenerFactory from "./factory/listenerFactory.js";
const mainNetSocket = 'wss://bsc-ws-node.nariox.org:443'

const listener = new ListenerFactory()
listener.pendingTransaction(mainNetSocket)

