import React from 'react';
import { InjectedConnector } from '@web3-react/injected-connector'
import { useWeb3React } from "@web3-react/core"

const WalletContext = React.createContext({});

const WalletProvider = ({children}) => {
    const injected = new InjectedConnector({
        supportedChainIds: [1, 3, 4, 5, 42],
    })
    const { activate, active, deactivate, account } = useWeb3React();

    const connect = () => {
        try{
            if (active) {
                return;
            }
            activate(injected, true);
        } catch (err) {
            console.log(err);
        }
    }

    const disconnect = () => {
        try{
           deactivate();
        } catch (err) {
            console.log(err);
        }
    }

    const actions = {
        connect,
        disconnect
    }

    const state = {
        account,
        active
    }

    return (
        <WalletContext.Provider value={{actions: actions, state: state}}>
            {children}
        </WalletContext.Provider>
    )
}

export {WalletContext, WalletProvider};
