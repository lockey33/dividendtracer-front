import {GlobalProvider} from "./provider/GlobalProvider";
import AppRouter from "./router/Router";
import {Helmet, HelmetProvider } from "react-helmet-async";
import { WalletProvider } from "./provider/WalletProvider";
import { Web3ReactProvider } from '@web3-react/core'
import Web3 from 'web3'
import { LocaleStorageProvider } from "./provider/LocalStorageProvider";
import { UserProvider } from "./provider/UserProvider";

export default function App() {
  
  function getLibrary(provider) {
    return new Web3(provider)
  }
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <LocaleStorageProvider>
        <UserProvider>
          <WalletProvider>
            <GlobalProvider>
                <HelmetProvider>
                    <Helmet>
                        <title>DividendTracer</title>
                    </Helmet>
                    <AppRouter />
                </HelmetProvider>
            </GlobalProvider>
          </WalletProvider>
          </UserProvider>
      </LocaleStorageProvider>
    </Web3ReactProvider>
  );
}


