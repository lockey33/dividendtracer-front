import React, {useEffect} from 'react';
import { GlobalContext } from '../../provider/GlobalProvider';
import { TokenIcon, TokenName } from './styled';
import {Flex, Text, Box} from "rebass";
import {FaRegStar, FaStar} from 'react-icons/fa';
import styled from 'styled-components';

export const getCoin = (coin) => {
    try{
        coin = coin.toLowerCase();
        let icon = require('../../images/coins/'+coin+'.png');
        return icon.default
    }
    catch(err){
        let icon = require('../../images/coins/not-found.svg');
        return icon.default
    }
}

const AddressLink = styled.a`
    color: #B1B5C4;
    font-family 'ABeeZee';
    margin-top: 4px;
    font-size: 14px;
    text-decoration: none;
    &:hover{
        opacity: 0.8;
    }
    @media screen and (max-width: 768px) {
        font-size: 12px;
    }
`


export const TokenSymbolWrapper = ({ token }) => {

    const [icon, setIcon] = React.useState('');
    const [symbol, setSymbol] = React.useState('');
    const [tokenName, setTokenName] = React.useState('');
    const [isInWatchList, setIsInWatchlist] = React.useState(false);
    const context = React.useContext(GlobalContext)

    const getTokenInfo = async() => {
        let symbol = await context.global.actions.getTokenSymbol(token);
        let name = await context.global.actions.getTokenName(token);
        return {name, symbol};
    }

    const saveWatchlist = async() => {
        if(context.wallet.state.currentAccount){
            if(!isInWatchList){
                await context.user.actions.addToWatchlist(context.wallet.state.currentAccount, token, tokenName, symbol);
                setIsInWatchlist(true);
            }else{
                await context.user.actions.removeFromWatchlist(context.wallet.state.currentAccount, token);
                setIsInWatchlist(false);
            }
        }else{
            if(!isInWatchList){
                await context.locale.actions.addToWatchlist(token, tokenName, symbol);
                setIsInWatchlist(true);
            }else{
                await context.locale.actions.removeFromWatchlist(token);
                setIsInWatchlist(false);
            }
        }
    }


    const checkWatchlist = async() => {
        if(context.wallet.state.currentAccount){
            let isInWatchlist = await context.user.actions.isInWatchlist(context.wallet.state.currentAccount, token);
            setIsInWatchlist(isInWatchlist);
        }else{
            let watchlist = await context.locale.actions.getWatchlist();
            let isInWatchlist = watchlist.some(item => item.address === token);
            setIsInWatchlist(isInWatchlist)
        }
    }

    useEffect(() => {
        checkWatchlist();
        getTokenInfo().then(info => { 
            setIcon(getCoin(info.symbol));
            setTokenName(info.name);
            setSymbol(info.symbol);
        });
    }, [token])

    return (
        <Flex alignItems="center" mb={3} sx={{gap: '15px'}}>
            <Box sx={{'&:hover':{opacity: 0.8, cursor: 'pointer'}}} onClick={saveWatchlist}>
                {isInWatchList ? <FaStar color="#B1B5C4" size={26} /> : <FaRegStar color="#B1B5C4" size={26} />}
            </Box>
            <Flex sx={{gap: '15px'}}>
                <TokenIcon className="token-symbol" src={icon} />
                <TokenName>
                    <Flex justifyContent="space-between" alignItems="center">
                        <Text color="white" fontSize={4} fontWeight='bold' fontFamily={'ABeeZee'}>{tokenName}</Text>
                    </Flex>
                    <AddressLink href={`https://www.bscscan.com/address/${token}`} target="_blank">{token}</AddressLink>
                </TokenName>
            </Flex>
        </Flex>
    )
}