import React, {useEffect, useState, useCallback, useMemo, memo} from 'react';
import { UserContext } from '../provider/UserProvider';
import { useWeb3React } from "@web3-react/core"
import { InjectedConnector } from '@web3-react/injected-connector'
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'

export const useWeb3Wallet = () => {
    
    const context = React.useContext(UserContext);
    const {active, account, activate, deactivate} = useWeb3React();
    const accountSaved = sessionStorage.getItem('accountSaved') || false;
    const isConnected = localStorage.getItem('isConnected') || false;
    
    const walletConnect = new WalletConnectConnector({
        rpc: {56: 'https://bsc-dataseed.binance.org/'},
        qrcode: true
    })

    const injected = new InjectedConnector({
        supportedChainIds: [1, 3, 4, 5, 42, 56],
    })

    useEffect(() => {
        injected.isAuthorized().then(async(isAuthorized) => {
            if (isAuthorized && isConnected) {
                setTimeout(() => activate(injected), 1);
            }
        })  
    }, [isConnected])

    const resetWalletConnector = () => {
        if (
            walletConnect &&
            walletConnect instanceof WalletConnectConnector &&
            walletConnect.walletConnectProvider?.wc?.uri
          ) {
            walletConnect.walletConnectProvider = undefined
          }
    }

    const connect = async(type) => {
        if(type === "walletconnect"){
            await activate(walletConnect)
            .catch(() => {
                resetWalletConnector();
            });
            localStorage.setItem('isConnected', true);
        }else if(type === "injected"){
            await activate(injected)
            localStorage.setItem('isConnected', true);
        }

    };

    const disconnect = async() => {
        try {
            localStorage.removeItem('isConnected');
            deactivate()
        }catch(error){
            console.log(error)
        }
    }

    useEffect(() => {
        if(account && !accountSaved) {
            context.user.actions.createUser(account);
            sessionStorage.setItem('accountSaved', true);
        }
        return () => {}
    }, [account])

    return {
        connect,
        disconnect,
        account,
        active
    }
}
