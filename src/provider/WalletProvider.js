import React, {useEffect, useState} from 'react';
import { LocaleStorageContext } from './LocalStorageProvider';
import { UserContext } from './UserProvider';


const WalletContext = React.createContext({});

const WalletProvider = ({children}) => {
    
    const [currentAccount, setCurrentAccount] = useState(null);
    const context = React.useContext(UserContext);
    const checkWalletIsConnected = async() => { 
        const { ethereum } = window;

        if(!ethereum){
            console.log("No wallet detected");
        }else{
            console.log("Wallet detected");
            const accounts = await ethereum.request({ method: 'eth_accounts' });
            if(accounts.length > 0){
                setCurrentAccount(accounts[0]);
            }else{
                console.log("No accounts detected");
            }
            ethereum.on('accountsChanged', function (accounts) {
                setCurrentAccount(accounts[0]);
            })
        } 

    }

    const connectWalletHandler = async() => {

        const { ethereum } = window;

        if(!ethereum){
            console.log("Please install MetaMask");
        }else{
            try{
                const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
                context.user.actions.createUser(accounts[0]);
                setCurrentAccount(accounts[0]);
            }catch(error){
                console.log(error);
            }
        }
     }

    const disconnectWalletHandler = async() => {
        const { ethereum } = window;

        if(!ethereum){
            console.log("Please install MetaMask");
        }else{
            try{
                await ethereum.request({
                    method: "eth_requestAccounts",
                    params: [{eth_accounts: {}}]
                })
                setCurrentAccount(null);
            }catch(error){
                console.log(error);
            }
        }
    }

    useEffect(() => {
        checkWalletIsConnected();      
    }, []);

    const state = {
        currentAccount
    }

    const actions = {
        checkWalletIsConnected,
        connectWalletHandler,
        disconnectWalletHandler
    }

    return (
        <WalletContext.Provider value={{wallet: {state: state, actions: actions}, locale: context.locale, user: context.user}}>
            {children}
        </WalletContext.Provider>
    )
}

export {WalletContext, WalletProvider};
