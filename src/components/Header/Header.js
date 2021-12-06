import React from "react";
import ReactTooltip from 'react-tooltip';
import {ReactComponent as Logo} from "../../images/bills.svg";
import {ReactComponent as Dots} from "../../images/dots.svg";
import {ReactComponent as Docs} from "../../images/docs.svg";
import {ReactComponent as Ask} from "../../images/ask.svg";
import {ReactComponent as Coffee} from "../../images/coffee.svg";
import {HeaderWrapper, LogoWrapper, ActionsWrapper, OptionsWrapper, OptionsButton, OptionsMenuWrapper, OptionsMenu, WalletButton, TelegramButton} from "./styled";
import { ModalContact } from "../Modal/Modal";
import {FaTelegramPlane} from 'react-icons/fa';
import {Flex} from "rebass"
import { GlobalContext } from "../../provider/GlobalProvider";
import { WalletWrapper } from "./Wallet";


const Header = () => {
    
    const [isOptionsOpen, setIsOptionsOpen] = React.useState(false);
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [modalTitle, setModalTitle] = React.useState('');

    return (
        <>
        <HeaderWrapper justifyContent="space-between" alignItems="center">
            <LogoWrapper href="/">
                <Logo />
                <h1>Dividend Tracer</h1>
            </LogoWrapper>
            <ActionsWrapper>
                <Flex alignItems="center" color="white">
                    <TelegramButton id="telegramHeader" rel="noreferrer" target="_blank" href="https://t.me/DividendTracer">Join our telegram <FaTelegramPlane color="white" /></TelegramButton>
                </Flex>
                <WalletWrapper />
                <OptionsWrapper onMouseEnter={() => setIsOptionsOpen(true)} onMouseLeave={() => setIsOptionsOpen(false)}>
                    <OptionsButton id="openMenuTop">
                        <Dots />
                    </OptionsButton>
                        {isOptionsOpen &&
                            <OptionsMenuWrapper>
                                <OptionsMenu>
                                    <a id="telegramMenu" rel="noreferrer" target="_blank" href="https://t.me/DividendTracer">Join our telegram <FaTelegramPlane /></a>
                                    <div id="contactUs" onClick={() => {setIsModalOpen(true); setModalTitle('Contact us')}}>Contact us <Ask /></div>
                                    <div id="requestFeatures" onClick={() => {setIsModalOpen(true); setModalTitle('Request features')}}>Request features <Coffee /></div>
                                    <div id="legalsMenu">Legal & privacy <Docs /></div>
                                </OptionsMenu>
                            </OptionsMenuWrapper>
                        }
                </OptionsWrapper>
            </ActionsWrapper>
        </HeaderWrapper>
        { isModalOpen &&
            <ModalContact title={modalTitle} onClose={() => setIsModalOpen(false)} />
        }
        </>
    );
}

export default Header;