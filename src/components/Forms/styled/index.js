import React, { memo, useCallback, useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import {Flex, Heading, Text} from "rebass"
import { WalletButton } from '../../Header/styled';
import { GlobalContext } from '../../../provider/GlobalProvider';
import { Button } from '../../Tracker/styled';
import { InputWallet } from '../TrackerForm';
import { getCoin } from '../../Token/TokenSymbol';
import { TokenIcon } from '../../Token/styled';
import { CustomLoader } from '../../Loader/Loader';

export const SubmitButton = styled.button`
    background: #669566;
    border: solid 1px transparent;
    display: block;
    margin: 0 auto;
    border-radius: 10px;
    padding: 10px 20px;
    font-family: 'DM Sans';
    font-weight: bold;
    font-size: 16px;
    color: #6CF057;
    margin-left: auto;
    cursor: pointer;
    transition: all 0.3s ease-in-out;
    &:hover {
        border: solid 1px #6CF057;
    }
`

export const ItemForm = styled.div`
    display: flex;
    flex-direction: column;
    align-items: stretch;
    margin-bottom: 2rem;
    width: 100%;
    label{
        color: white;
        font-family: 'DM Sans';
        font-weight: bold;
        font-size: 16px;
        margin-bottom: 10px;        
    }
    @media (max-width: 768px) {
            margin-bottom: 1.5rem;
        label{
            font-size: 14px;
        }
    }
`

export const FormWrapper = styled.form`
    width: auto;
    flex: 1;
`

export const Input = styled.input`
    padding: 20px;
    border-radius: 10px;
    background: rgba(119, 126, 144, 1);
    color: white;
    font-family: 'DM Sans';
    font-weight: bold;
    font-size: 16px;
    width: -webkit-fill-available;
    border: solid 1px transparent;
    &.error{
        border: solid 1px #ff4545;
    }
    &::placeholder{
        color: rgba(255, 255, 255, 0.5);
    }
    &:focus, &:active, &:focus-visible{
        outline: none;
        &:not(:disabled){
            border: solid 1px #6CF057;
        }
   }
   @media (max-width: 768px) {
        font-size: 14px;
        padding: 15px 20px;
    }
    &:-webkit-autofill {
        -webkit-text-fill-color: white;
        transition: background-color 5000s ease-in-out 0s;
    }
    &:disabled{
        opacity: 0.5;
    }
`


export const Textarea = styled.textarea`
    padding: 20px;
    border-radius: 10px;
    background: rgba(119, 126, 144, 1);
    color: white;
    font-family: 'DM Sans';
    font-weight: bold;
    font-size: 16px;
    border: solid 1px transparent;
    &.error{
        border: solid 1px #ff4545;
    }
    &::placeholder{
        color: rgba(255, 255, 255, 0.5);
    }
    &:focus, &:active, &:focus-visible{
        outline: none;
        border: solid 1px #6CF057;
    }
    @media (max-width: 768px) {
        font-size: 14px;
        padding: 15px 20px;
    }
`

export const ErrorMessage = styled.div`
    color: #ff4545;
    font-family: 'DM Sans';
    font-weight: bold;
    font-size: 16px;
    margin-top: 10px;
    @media (max-width: 768px) {
        font-size: 14px;
    }
`

const StyledSearchHistory = styled.div`
    position: absolute;
    width: -webkit-fill-available;
    height: 30vh;
    overflow: scroll;
    padding: 2rem 20px;
    background: black;
    bottom: 0;
    z-index: 1;
    transform: translateY(95%);
    display: ${props => props.isOpen ? 'block' : 'none'};
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
`

export const SearchHistoryWrapper = styled.div`
    position: relative;
    width: 100%;
    input{
        position: relative;
        z-index: 2;
    }
`

const StyledSearchHistoryItem = styled.div`
    padding: 10px 10px;
    border-radius: 10px;
    color: white;
    font-family: 'DM Sans';
    font-weight: bold;
    font-size: 14px;    
    display: flex;
    align-items: center;
    position: relative;   
    justify-content: space-between;
    gap: 20px;
    &:not(:last-child)::after{
        content: '';
        position: absolute;
        height: 1px;
        background: white;
        bottom: 0;
        left: 10px;
        right: 10px;
        opacity: 0.6;
    }
    >:first-child{
        flex: 1;
        &:hover{
            cursor: pointer;
            opacity: 0.8;
        }
    }
    &:hover{
        &::after{
            opacity: 0.6;
        }
    }
    @media (max-width: 768px) {
        font-size: 12px;
        padding: 10px 15px;
    }
`

const SearchHistoryHeader = styled.div`
    padding: 10px 0;
    display: flex;
    align-items: center;
    gap: 20px;
`

const SearchHistoryAction = styled.div`
    display: flex;
    align-items: center;
    font-size: 14px;
    color: white;
    font-family: 'DM Sans';
    cursor: pointer;
    &.active{
        border-bottom: solid 1px white;
        font-weight: bold;
    }
    &:hover{
        &:not(.active){
            opacity: 0.5;
        }
    }
    @media (max-width: 768px) {
        font-size: 12px;
    }
`

const SearchHistoryItem = ({handleClick, index, item, handleRemove}) => {

    const [icon, setIcon] = React.useState(null);

    useEffect(() => {
        setIcon(getCoin(item.symbol))
    }, [item]);

    return(
        <StyledSearchHistoryItem style={{color: 'white'}}>
            <Flex onClick={() => handleClick(item.address)} alignItems="center" sx={{gap: '10px'}}>
                <TokenIcon size={'30px'} src={icon} />
                <Flex flexDirection={'column'}>
                    <Flex alignItems="center" sx={{gap: '5px'}}>
                        <span>{item.name}</span>
                        <span><small>${item.symbol}</small></span>
                    </Flex>
                    <small>{item.address}</small>
                </Flex>
            </Flex>
            <Flex sx={{'&:hover': {cursor: 'pointer', opacity: 0.5}}} onClick={() => handleRemove(item.address)} alignItems="center">
                <div>x</div>
            </Flex>
        </StyledSearchHistoryItem>
    )

}

const SearchHistoryList = ({handleClick, active}) => {

    const context = React.useContext(GlobalContext);
    const currentAccount = context.wallet.state.currentAccount;
    const [loading, setLoading] = React.useState(true);

    const removeFromSearchHistory = async(address) => {
        if(currentAccount){
            context.user.actions.removeFromSearchHistory(currentAccount, address);
        }else{
            context.locale.actions.removeFromSearchHistory(address)
        }
    }

    function loadUser(){
        if(currentAccount){
            setLoading(true);
            context.user.actions.init(currentAccount);
            setLoading(false);
        }else{
            setLoading(true);
            context.locale.actions.getSearchHistory();
            context.locale.actions.getWatchlist();
            setLoading(false);
        }
    }

    useEffect(() => {
        loadUser();
    }, []);

    return(
        !loading ?
            <>
                {active === 'search' &&
                    <>
                        {currentAccount ?
                            context.user.state.searchHistory.length > 0 ? 
                                context.user.state.searchHistory.map((item, index) => {
                                return (
                                    <SearchHistoryItem key={index} handleClick={handleClick} handleRemove={removeFromSearchHistory} index={index} item={item} />
                                )
                            })
                            :
                            <Flex alignItems="center" justifyContent="center" mt={5}>
                                <Text color="white" fontFamily='DM Sans' fontSize={[1, 2]} >No token in search history</Text>
                            </Flex>
                        :
                        context.locale.state.searchHistory.length > 0 ? 
                                context.locale.state.searchHistory.map((item, index) => {
                                return (
                                    <SearchHistoryItem key={index} handleClick={handleClick} handleRemove={removeFromSearchHistory} index={index} item={item} />
                                )
                            })
                            :
                            <Flex alignItems="center" justifyContent="center" mt={5}>
                                <Text color="white" fontFamily='DM Sans' fontSize={[1, 2]} >No token in watchlist</Text>
                            </Flex>
                    }
                    </>
                }

                {active === 'watchlist' &&
                    <>
                    {currentAccount ?
                        context.user.state.watchlist.length > 0 ?
                            context.user.state.watchlist.map((item, index) => {
                                return (
                                    <SearchHistoryItem key={index} handleClick={handleClick} handleRemove={removeFromSearchHistory} index={index} item={item} />
                                )
                            })
                            :
                            <Flex alignItems="center" justifyContent="center" mt={5}>
                                <Text color="white" fontFamily='DM Sans' fontSize={[1, 2]} >No token in search history</Text>
                            </Flex>
                        :
                            context.locale.state.watchlist.length > 0 ? 
                                context.locale.state.watchlist.map((item, index) => {
                                return (
                                    <SearchHistoryItem key={index} handleClick={handleClick} handleRemove={removeFromSearchHistory} index={index} item={item} />
                                )
                            })
                        :
                            <Flex alignItems="center" justifyContent="center" mt={5}>
                                <Text color="white" fontFamily='DM Sans' fontSize={[1, 2]} >No token in watchlist</Text>
                            </Flex>
                        }
                    </>
                }

            </>
        :
        <CustomLoader />
    )

}

export const SearchHistory = ({handleClick, isOpen}) => {
    const [active, setActive] = useState('search');
    
    return (
        <StyledSearchHistory isOpen={isOpen}>
            <SearchHistoryHeader>
                <SearchHistoryAction className={active === 'search' && 'active'} onClick={() => setActive('search')}>Search History</SearchHistoryAction>
                <SearchHistoryAction className={active === 'watchlist' && 'active'} onClick={() => setActive('watchlist')}>Watchlist</SearchHistoryAction>
            </SearchHistoryHeader>
            {isOpen && <SearchHistoryList handleClick={handleClick} active={active} />}                   
        </StyledSearchHistory>
    )
}


export const ErrorWallet = ({handleWallet, action, errorWallet}) => {

    const context = React.useContext(GlobalContext)
    const [inputValue, setInputValue] = useState(null);

    useEffect(() => {
        if(context.wallet.state.currentAccount){
            setInputValue(context.wallet.state.currentAccount);
        }else{
            setInputValue(null);
        }
    }, [context.wallet.state.currentAccount])

    return(
            <Flex flexDirection="column" width={'100%'} alignItems="center" justifyContent="center">
                <Heading mb={4} fontFamily='DM Sans' color="white" fontSize={[3, 4]}>Oops, we need your wallet address</Heading>
                {!context.wallet.state.currentAccount &&
                    <>
                        <WalletButton id="walletButton" onClick={() => context.wallet.actions.connectWalletHandler()}>
                            Connect Wallet
                        </WalletButton>
                        <Text mt={3} color="white" fontFamily='DM Sans' fontSize={[2, 3]}>or</Text>
                    </>
                }
                <InputWallet value={inputValue} handleWallet={(e) => handleWallet(e)} errorWallet={errorWallet} />
                <Button style={{padding: '10px 20px'}} onClick={action}>Show my dividends</Button>
            </Flex>
    )
}


export const ErrorTracker = ({handleTracker, action, customTracker, errorTracker}) => {

    return(
            <Flex flexDirection="column" width={'100%'} alignItems="center" justifyContent="center">
                <Heading fontFamily='DM Sans' color="white" fontSize={[3, 4]}>Oops, we need your tracker address</Heading>
                <Text mb={4}  fontFamily='DM Sans' color="white" fontSize={[1, 2]}>You cand find it in your transactions details</Text>
                <Input className={errorTracker ? 'error' : ''} onChange={(e) => handleTracker(e)} value={customTracker} />
                <Button style={{padding: '10px 20px', marginTop: '20px'}} onClick={action}>Show my dividends</Button>
            </Flex>
    )
}