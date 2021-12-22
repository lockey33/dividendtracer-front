import {GlobalProvider} from "./provider/GlobalProvider";
import AppRouter from "./router/Router";
import {Helmet, HelmetProvider } from "react-helmet-async";
import { useWeb3React, Web3ReactProvider } from '@web3-react/core';
import { GelatoProvider } from "@gelatonetwork/limit-orders-react";
import Web3 from 'web3';
import { Provider } from 'react-redux';
import store from "./store";

export default function App() {
  
  const { library, chainId, account } = useWeb3React();

  function getLibrary(provider) {
    return new Web3(provider)
  }

  return (
    <Provider store={store}>
    <Web3ReactProvider getLibrary={getLibrary}>
      <GelatoProvider
        library={library}
        chainId={chainId}
        account={account ?? undefined}>
        <GlobalProvider>
            <HelmetProvider>
                <Helmet>
                    <title>DividendTracer</title>
                </Helmet>
                <AppRouter />
            </HelmetProvider>
        </GlobalProvider> 
        </GelatoProvider>         
    </Web3ReactProvider>
    </Provider>
  );
}


