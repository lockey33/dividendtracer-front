import React from "react";
import ReactTooltip from 'react-tooltip';
import {ReactComponent as Logo} from "../../images/bills.svg";
import {ReactComponent as Dots} from "../../images/dots.svg";
import {ReactComponent as Docs} from "../../images/docs.svg";
import {ReactComponent as Ask} from "../../images/ask.svg";
import {ReactComponent as Coffee} from "../../images/coffee.svg";
import {HeaderWrapper, LogoWrapper, ActionsWrapper, OptionsWrapper, OptionsButton, OptionsMenuWrapper, OptionsMenu, WalletButton} from "./styled";
import { Modal } from "../Modal/Modal";

const Header = () => {

    const [isOptionsOpen, setIsOptionsOpen] = React.useState(false);
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [modalTitle, setModalTitle] = React.useState('');

    return (
        <>
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
                                    <a onClick={() => {setIsModalOpen(true); setModalTitle('Contact us')}}>Contact us <Ask /></a>
                                    <a onClick={() => {setIsModalOpen(true); setModalTitle('Request features')}}>Request features <Coffee /></a>
                                    <a>Legal & privacy <Docs /></a>
                                </OptionsMenu>
                            </OptionsMenuWrapper>
                        }
                </OptionsWrapper>
            </ActionsWrapper>
        </HeaderWrapper>
        { isModalOpen &&
            <Modal title={modalTitle} onClose={() => setIsModalOpen(false)} />
        }
        </>
    );
}

export default Header;