import React, {useEffect, useState} from "react";
import { GlobalContext } from "../../provider/GlobalProvider";
import { AccountAddress, AccountIcon, AccountWrapper, WalletButton } from "./styled";
import { CustomBlockies } from "./styled/blockies";
import {IoPower} from "react-icons/io5";


export const WalletWrapper = () => {
    const context = React.useContext(GlobalContext);

    const formatAddress = (address) => {
        return address.substring(0, 6) + "..." + address.substring(address.length - 6);
    }

    return(
        <>
            {!context.wallet.state.currentAccount ?
                <WalletButton id="walletButton" onClick={() => context.wallet.actions.connectWalletHandler()}>
                    Connect Wallet
                </WalletButton>
            :
                <AccountWrapper>
                    <AccountAddress>{formatAddress(context.wallet.state.currentAccount)}</AccountAddress>
                    <AccountIcon onClick={() => context.wallet.actions.disconnectWalletHandler()}>
                        <CustomBlockies
                            seed={context.wallet.state.currentAccount}
                        />
                        <IoPower/>
                    </AccountIcon>
                </AccountWrapper>
            }
        </>
    )
}