import styled from 'styled-components';
import {Flex} from "rebass";

export const HeaderWrapper = styled(Flex)`
    padding: 20px 40px;
    @media (max-width: 768px) {
        padding: 20px 20px;
    }
`

export const LogoWrapper = styled.a`
    display: flex;
    align-items: center;
    gap: 20px;
    font-family: 'DM Sans';
    color: white;
    text-decoration: none;
    cursor: pointer;
    svg{
        max-width: 60px;
        height: auto;
    }
    h1{
        margin: 0;
        @media (max-width: 768px) {
            font-size: 1.3em;
            width: 50%;
            line-height: 1em;
        }
        @media (max-width: 500px) {
        display: none;
        }
    }
    &:hover{
        text-decoration: none;
    }
`

export const ActionsWrapper = styled.div`
    display: flex;
    align-items: stretch;
    gap: 20px;
    @media (max-width: 768px) {
        gap: 10px;
    }
`

export const WalletButton = styled.button`
    background: rgba(169, 254, 167, 0.55);
    border-radius: 10px;
    padding: 10px 20px;
    border: none;
    font-family:'DM Sans';
    font-style: normal;
    font-weight: bold;
    display: flex;
    align-items: center;
    text-align: center;
    color: #6CF057;
    cursor: pointer;
    @media (min-width: 768px) {
        font-size: 18px;
    }
`

export const AccountWrapper = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
`

export const AccountAddress = styled.div`
    font-family: 'DM Sans';
    font-size: 18px;
    color: #FFFFFF;
    @media (max-width: 768px) {
        font-size: 14px;
    }
`

export const AccountIcon = styled.div`
    width: 40px;
    height: 40px;  
    border-radius: 100%;    
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    svg{
        z-index: 1000;
        position: absolute;
        color: white;
        display: none;
        width: 20px;
        height: 20px
    }
    &:hover{
        cursor: pointer;
        svg{
            display: block;
        }
        canvas{
            opacity: 0.5;
        }
    }
    canvas{
        width: 100% !important;
        height: 100% !important;
        border-radius: 100%;
    }
`

export const TelegramButton = styled.a`
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(94,94,94,0.15);
    padding: 10px 20px;
    border-radius: 10px;
    border: solid 1px transparent;
    color: #fff;
    font-size: 16px;
    gap: 15px;
    text-decoration: none;
    cursor: pointer;
    transition: all 0.3s ease;
    &:hover {        
        border: solid 1px #6CF057;
    }
    @media (max-width: 768px) {
        display: none;
    }
`

export const OptionsButton = styled.button`
    padding: 10px;
    border: solid 1px transparent;
    background: rgba(94, 94, 94, 0.15);
    border-radius: 10px;
    display: flex;
    align-items: center;
    transition: all 0.2s ease-in-out;
    cursor: pointer;
    min-height: 40px;
    height: 100%;
`

export const OptionsMenu = styled.div`
    padding: 0.5rem;
    background: #1F1F21;
    min-width: 180px;
    border-radius: 18px;
    border: 1px solid rgb(25, 27, 31);
    display: grid;
    grid-template-columns: 1fr;
    a, div{
        display: flex;
        flex: 1 1 0%;
        flex-direction: row;
        align-items: center;
        padding: 0.5rem;
        justify-content: space-between;
        color: rgb(195, 197, 203);
        text-decoration: none;
        cursor: pointer;
        svg{opacity: 0.6;}
        &:hover{
            color: white;
        }
    }
`

export const OptionsWrapper = styled.div`
    position: relative;
    &:hover{
        >button{
            border: solid 1px #6CF057;
        }
    }
`

export const OptionsMenuWrapper = styled.div`
    position: absolute;
    right: 0;
    top: 100%;
    padding-top: 20px;
`