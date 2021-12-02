import styled from 'styled-components';
import {Flex, Box} from "rebass";

export const HeaderWrapper = styled(Flex)`
    padding: 20px 40px;
    @media (max-width: 768px) {
        padding: 20px 20px;
    }
`

export const LogoWrapper = styled.div`
    display: flex;
    align-items: center;
    gap: 20px;
    font-family: 'DM Sans';
    color: white;
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
    opacity: 0.5;
    cursor: pointer;
    @media (min-width: 768px) {
        font-size: 18px;
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
    a{
        display: flex;
        flex: 1 1 0%;
        flex-direction: row;
        align-items: center;
        padding: 0.5rem;
        justify-content: space-between;
        color: rgb(195, 197, 203);
        text-decoration: none;
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