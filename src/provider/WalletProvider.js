import React, {useEffect, useState, useCallback} from 'react';
import { UserContext } from './UserProvider';
import { useWeb3React } from "@web3-react/core"
import { InjectedConnector } from '@web3-react/injected-connector'
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'
import {isMobile} from 'react-device-detect'


const WalletContext = React.createContext({});

const WalletProvider = ({children}) => {
    
    const context = React.useContext(UserContext);
    const {active, account, library, connector, activate, deactivate} = useWeb3React();

    const walletConnect = new WalletConnectConnector({
        rpc: {56: 'https://bsc-dataseed.binance.org/'},
        qrcode: true
    })

    const injected = new InjectedConnector({
        supportedChainIds: [56],
    })


    useEffect(() => {
        context.user.actions.createUser(account);
    }, [account])

    useEffect(() => {
        injected.isAuthorized().then(async(isAuthorized) => {
            if (isAuthorized) {
                activate(injected);
            }
        })    
    }, [])

    const switchChainToBsc = async () => {
        try {
            await window.ethereum.request({
              method: 'wallet_switchEthereumChain',
              params: [{ chainId: '0x38' }],
            });
        } catch (switchError) {
        // This error code indicates that the chain has not been added to MetaMask.
        if (switchError.code === 4902) {
            try {
                await window.ethereum.request({
                    method: 'wallet_addEthereumChain',
                    params: [{ chainId: '0x38', rpcUrl: 'https://bsc-dataseed.binance.org/' }],
                });
            } catch (addError) {
            // handle "add" error
            }
        }
        // handle other "switch" errors
        }
    }

    const resetWalletConnector = () => {
        if (
            walletConnect &&
            walletConnect instanceof WalletConnectConnector &&
            walletConnect.walletConnectProvider?.wc?.uri
          ) {
            walletConnect.walletConnectProvider = undefined
          }
    }

    useEffect(() => {
        checkChainId();
    }, [window.ethereum.networkVersion])

    const checkChainId = async() => {
        if(connector){ 
            let chainId = await connector.getChainId();
            if(chainId !== '0x38'){
                alert('Please switch to Binance Chain');
                switchChainToBsc();
            }
        }
    }

    const connect  = async(type) => {
        if(type === "walletconnect"){
            await activate(walletConnect)
            .catch((err) => {
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
