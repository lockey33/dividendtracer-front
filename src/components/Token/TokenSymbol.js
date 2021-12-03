import React, {useEffect} from 'react';
import { GlobalContext } from '../../provider/GlobalProvider';
import { TokenIcon, TokenName } from './styled';
import {Flex, Text, Box} from "rebass";
import {FaRegStar, FaStar} from 'react-icons/fa';
import styled from 'styled-components';

const getCoin = (coin) => {
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
    margin-top: 6px;
    font-size: 14px;
    text-decoration: none;
    @media screen and (max-width: 768px) {
        font-size: 12px;
    }
`


export const TokenSymbolWrapper = ({ token }) => {

    const [icon, setIcon] = React.useState('');
    const [tokenName, setTokenName] = React.useState('');
    const context = React.useContext(GlobalContext)

    const getTokenInfo = async() => {
        let symbol = await context.global.actions.getTokenSymbol(token);
        let name = await context.global.actions.getTokenName(token);
        return {name, symbol};
    }

    useEffect(() => {
        getTokenInfo().then(info => { 
            setIcon(getCoin(info.symbol));
            setTokenName(info.name);
        });
    }, [token])

    return (
        <Flex alignItems="center" mb={3} sx={{gap: '15px'}}>
            <Box sx={{'&:hover':{opacity: 0.5, cursor: 'pointer'}}}>
                <FaRegStar color="#B1B5C4" size={30} />
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