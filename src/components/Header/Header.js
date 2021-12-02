import React from "react";
import ReactTooltip from 'react-tooltip';
import {ReactComponent as Logo} from "../../images/bills.svg";
import {ReactComponent as Dots} from "../../images/dots.svg";
import {ReactComponent as Docs} from "../../images/docs.svg";
import {ReactComponent as Ask} from "../../images/ask.svg";
import {ReactComponent as Coffee} from "../../images/coffee.svg";
import {HeaderWrapper, LogoWrapper, ActionsWrapper, OptionsWrapper, OptionsButton, OptionsMenuWrapper, OptionsMenu, WalletButton} from "./styled";

const Header = () => {

    const [isOptionsOpen, setIsOptionsOpen] = React.useState(false);

    return (
        <HeaderWrapper justifyContent="space-between" alignItems="center">
            <LogoWrapper>
                <Logo />
                <h1>Dividend Tracer</h1>
            </LogoWrapper>
            <ActionsWrapper>
                <WalletButton data-place="bottom" data-tip='Coming Soon'>
                    Connect Wallet
                    <ReactTooltip />
                </WalletButton>
                <OptionsWrapper onMouseEnter={() => setIsOptionsOpen(true)} onMouseLeave={() => setIsOptionsOpen(false)}>
                    <OptionsButton>
                        <Dots />
                    </OptionsButton>
                        { isOptionsOpen &&
                            <OptionsMenuWrapper>
                                <OptionsMenu>
                                    <a href="#">Contact us <Ask /></a>
                                    <a href="#">Request features <Coffee /></a>
                                    <a href="#">Legal & privacy <Docs /></a>
                                </OptionsMenu>
                            </OptionsMenuWrapper>
                        }
                </OptionsWrapper>
            </ActionsWrapper>
        </HeaderWrapper>
    );
}

export default Header;