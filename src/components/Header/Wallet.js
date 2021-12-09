import React from "react";
import { GlobalContext } from "../../provider/GlobalProvider";
import { AccountAddress, AccountIcon, AccountWrapper, WalletButton, WalletButtonWrapper } from "./styled";
import {IoPower} from "react-icons/io5";
import {Flex} from "rebass";
import { MetamaskButton, WalletConnectButton } from "./styled";
import { Modal } from "../Modal/Modal";
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon'

export const WalletWrapper = () => {
    
    const context = React.useContext(GlobalContext);
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const formatAddress = (address) => {
        return address.substring(0, 6) + "..." + address.substring(address.length - 6);
    }

    const connect = async(type) => {
        await context.wallet.actions.connect(type)
        .then(() => {
            setIsModalOpen(false);
        })
    }

    return(
        <>
            {!context.wallet.state.currentAccount ?
                    <WalletButtonWrapper>
                        <WalletButton onClick={() => setIsModalOpen(true)}>
                            Connect Wallet
                        </WalletButton>
                    </WalletButtonWrapper>

            :
                <AccountWrapper>
                    <AccountAddress>{formatAddress(context.wallet.state.currentAccount)}</AccountAddress>
                    <AccountIcon onClick={() => context.wallet.actions.disconnect()}>
                        <Jazzicon
                            diameter={40}
                            seed={jsNumberForAddress(context.wallet.state.currentAccount)}
                        />
                        <IoPower/>
                    </AccountIcon>
                </AccountWrapper>
            }
            {isModalOpen &&
                <Modal onClose={() => setIsModalOpen(false)}>
                    <Flex sx={{gap: '15px'}} alignItems="center" justifyContent="center" flexDirection="column">
                        <MetamaskButton onClick={() => connect('injected')}>Metamask</MetamaskButton>
                        <WalletConnectButton onClick={() => connect('walletconnect')}>WalletConnect</WalletConnectButton>
                    </Flex>
                </Modal>
            }
        </>
    )
}