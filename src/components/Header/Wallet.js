import React, { useEffect } from "react";
import { GlobalContext } from "../../provider/GlobalProvider";
import { AccountAddress, AccountIcon, AccountWrapper, WalletButton } from "./styled";
import {IoPower} from "react-icons/io5";
import {Flex} from "rebass";
import { MetamaskButton, WalletConnectButton } from "./styled";
import { Modal } from "../Modal/Modal";
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon'
import { formatAddress } from "../../utils/format";

export const WalletButtonWrapper = () => {

    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const context = React.useContext(GlobalContext);
    const account = context.wallet.state.currentAccount;

    const connect = async(type) => {
        await context.wallet.actions.connect(type)
        .then(() => {
            setIsModalOpen(false);
            context.user.actions.init(account);
        });
    }

    return(
        <>
            <WalletButton onClick={() => setIsModalOpen(true)}>
                Connect Wallet
            </WalletButton>

            <Modal onClose={() => setIsModalOpen(false)} isOpen={isModalOpen}>
                <Flex sx={{gap: '15px'}} alignItems="center" justifyContent="center" flexDirection="column">
                    <MetamaskButton onClick={() => connect('injected')}>Metamask</MetamaskButton>
                    <WalletConnectButton onClick={() => connect('walletconnect')}>WalletConnect</WalletConnectButton>
                </Flex>
            </Modal>

        </>
    )
}


export const WalletWrapper = () => {
    
    const context = React.useContext(GlobalContext);
    const account = context.wallet.state.currentAccount;

    const disconnect = async() => {
        await context.wallet.actions.disconnect()
        .then(() => {
            context.user.actions.reset()
        });
    }

    return(
        <>
            {!account ?
                <WalletButtonWrapper />
            :
                <AccountWrapper>
                    <AccountAddress>{formatAddress(account)}</AccountAddress>
                    <AccountIcon onClick={() => disconnect()}>
                        <Jazzicon
                            diameter={40}
                            seed={jsNumberForAddress(account)}
                        />
                        <IoPower/>
                    </AccountIcon>
                </AccountWrapper>
            }            
        </>
    )
}