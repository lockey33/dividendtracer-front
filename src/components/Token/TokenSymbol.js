import React, {useEffect} from 'react';
import { AddressLink, TokenIcon, TokenName } from './styled';
import {Flex, Text, Box} from "rebass";
import {FaRegStar, FaStar} from 'react-icons/fa';
import { useIsMobile } from '../../hooks/useIsMobile';
import { formatAddress } from '../../utils/format';
import {ReactComponent as Bscscan} from "../../assets/images/bscscan.svg";
import ReactTooltip from 'react-tooltip';
import { CustomLoader } from '../Loader/Loader';
import { CustomBlockies } from '../Header/styled/blockies';
import { useWatchlist } from '../../hooks/useWatchlist';
import { useTokenInfo } from '../../hooks/useTokenInfo';

export const TokenIconWrapper = ({address, size}) => {

    const [icon, setIcon] = React.useState(null);
    const {getCoin} = useTokenInfo(address);
    const isMobile = useIsMobile();

    async function init() {
        const coin = await getCoin();
        setIcon(coin);
    }

    useEffect(() => {
        init();
    }, []);


    return(
        icon ?
            <TokenIcon className="token-symbol" size={size || null} src={icon} />
        :
            <Flex alignItems="center" justifyContent="center" sx={{'canvas': {borderRadius: '100%', width: size ? size+' !important' : '100% !important', height: size ? size+' !important' : '100% !important'}}}>
                <CustomBlockies seed={address} scale={isMobile ? 4 : 6} />
            </Flex>
    )

}


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
                        <Bscscan  fill='#B1B5C4' width={26} height={26} />
                    </a>
                    <ReactTooltip />
                </Box>
                <Box sx={{'&:hover':{opacity: 0.8, cursor: 'pointer'}}} onClick={saveWatchlist}>        
                    {isInWatchlist ? <FaStar data-tip="Remove from watchlist" color="#B1B5C4" size={26} /> : <FaRegStar data-tip="Add to watchlist" color="#B1B5C4" size={26} />}
                    <ReactTooltip />
                </Box>
            </Flex>
        </Flex>
    )
}