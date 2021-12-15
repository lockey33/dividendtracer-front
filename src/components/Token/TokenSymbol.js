import React, {useEffect} from 'react';
import { GlobalContext } from '../../provider/GlobalProvider';
import { TokenIcon, TokenName } from './styled';
import {Flex, Text, Box} from "rebass";
import {FaRegStar, FaStar} from 'react-icons/fa';
import styled from 'styled-components';
import { useIsMobile } from '../../hooks/useIsMobile';
import { formatAddress } from '../../utils/format';
import {ReactComponent as Bscscan} from "../../assets/images/bscscan.svg";
import {useHistory} from "react-router-dom";
import ReactTooltip from 'react-tooltip';
import { CustomLoader } from '../Loader/Loader';
import { CustomBlockies, JazzIcon } from '../Header/styled/blockies';
import { useWeb3Wallet } from '../../hooks/useWeb3Wallet';
import { useWatchlist } from '../../hooks/useWatchlist';
import { useTokenInfo } from '../../hooks/useTokenInfo';

const getCoin = async (symbol) => {
    try{
        symbol = symbol.toLowerCase();
        let icon = require('../../assets/images/coins/'+symbol+'.png')
        return icon.default
    }
    catch(err){
        // console.log(err)
    }
}


export const TokenIconWrapper = ({symbol, address, size}) => {

    const [icon, setIcon] = React.useState(null);
    const [loading, setLoading] = React.useState(true);
    const isMobile = useIsMobile();

    useEffect(() => {
        async function setCoin() {
            setLoading(true);
            await getCoin(symbol)
            .then(icon => { setIcon(icon); })
            .catch(() => { console.log('err') })
            setLoading(false); 
        }
        if(symbol) setCoin();
    }, [symbol]);


    return(
        !loading ?
            <Flex alignItems="center" justifyContent="center">
                {icon ?
                    <TokenIcon className="token-symbol" size={size || null} src={icon} />
                :
                    <Flex alignItems="center" justifyContent="center" sx={{'canvas': {borderRadius: '100%', width: size ? size+' !important' : '100% !important', height: size ? size+' !important' : '100% !important'}}}>
                        <CustomBlockies seed={address} scale={isMobile ? 4 : 6} />
                    </Flex>
                }
            </Flex>
        :
        <CustomLoader size={size || 60} />
    )

}

const AddressLink = styled.div`
    color: #B1B5C4;
    font-family 'ABeeZee';
    margin-top: 4px;
    font-size: 14px;
    text-decoration: none;
    @media screen and (max-width: 768px) {
        font-size: 12px;
    }
`


export const TokenSymbolWrapper = ({ token }) => {

    const isMobile = useIsMobile();
    const {tokenName, tokenSymbol} = useTokenInfo(token);
    const {addToWatchlist, removeFromWatchlist, isInWatchlist} = useWatchlist(token, tokenName, tokenSymbol);

    const saveWatchlist = async() => {
        if(!isInWatchlist){
            addToWatchlist()
        }else{
           removeFromWatchlist()
        }
    }

    return (
        <Flex alignItems="center" justifyContent={'space-between'} width='100%' sx={{gap: '15px'}}>
            <Flex sx={{gap: '15px'}}>
                <TokenIconWrapper address={token} symbol={tokenSymbol} />
                <TokenName>
                    <Flex justifyContent="space-between" alignItems="center">
                        <Text color="white" fontSize={[2, 3, 4]} fontWeight='bold' fontFamily={'ABeeZee'}>{tokenName}</Text>
                    </Flex>
                    <AddressLink>{isMobile ? formatAddress(token, 8) : token}</AddressLink>
                </TokenName>
            </Flex>
            <Flex alignItems="center" sx={{gap: '15px'}}>
                <Box sx={{'&:hover':{opacity: 0.8, cursor: 'pointer'}}}>
                    <a data-tip="Bscscan" href={'https://bscscan.com/address/'+token} target="_blank" rel="noopener noreferrer">   
                        <Bscscan  fill='#B1B5C4' width={isMobile ? 22 : 26} height={isMobile ? 22 : 26} />
                    </a>
                    <ReactTooltip />
                </Box>
                <Box sx={{'&:hover':{opacity: 0.8, cursor: 'pointer'}}} onClick={saveWatchlist}>        
                    {isInWatchlist ? <FaStar data-tip="Remove from watchlist" color="#B1B5C4" size={isMobile ? 22 : 26} /> : <FaRegStar data-tip="Add to watchlist" color="#B1B5C4" size={isMobile ? 22 : 26} />}
                    <ReactTooltip />
                </Box>
            </Flex>
        </Flex>
    )
}