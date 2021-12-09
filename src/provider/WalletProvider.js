import React, {useEffect, useState, useCallback} from 'react';
import { UserContext } from './UserProvider';
import { useWeb3React } from "@web3-react/core"
import { InjectedConnector } from '@web3-react/injected-connector'
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'
import {isMobile} from 'react-device-detect'


const WalletContext = React.createContext({});

const WalletProvider = ({children}) => {
    
    const context = React.useContext(UserContext);
    const { active, account, library, connector, activate, deactivate, error } = useWeb3React();

    const walletConnect = new WalletConnectConnector({
        rpc: { 1: 'https://mainnet.infura.io/v3/5ac444b3c8014807ae1d035e482d996f', 56: 'https://bsc-dataseed.binance.org/' },
        qrcode: true
    })

    const injected = new InjectedConnector({
        supportedChainIds: [1, 3, 4, 5, 42, 56],
      })

    const resetWalletConnector = () => {
        if (
            walletConnect &&
            walletConnect instanceof WalletConnectConnector &&
            walletConnect.walletConnectProvider?.wc?.uri
          ) {
            walletConnect.walletConnectProvider = undefined
          }
    }

    const connect  = async(type) => {
        if(type === "walletconnect"){
            await activate(walletConnect).catch((err) => {
                resetWalletConnector();
              });
        }else if(type === "injected"){
            await activate(injected)
        }
    };

    const disconnect = async() => {
        try {
            deactivate()
        }catch(error){
            console.log(error)
        }
    }

    const state = {
        currentAccount: account
    }

    const actions = {
        connect,
        disconnect
    }

    return (
        <WalletContext.Provider value={{wallet: {state: state, actions: actions}, locale: context.locale, user: context.user}}>
            {children}
        </WalletContext.Provider>
    )
}

export {WalletContext, WalletProvider};
