import React, {useContext, useEffect} from 'react';
import {Flex, Box, Text} from 'rebass';
import { Button } from '../../Tracker/styled';
import { Results } from '../Results';
import { VscDebugRestart } from 'react-icons/vsc';
import {useHistory} from 'react-router-dom';
import { TokenSymbolWrapper } from '../../Token/TokenSymbol';
import { Card } from '../../Card';
import { useTokenInfo } from '../../../hooks/useTokenInfo';
import { GlobalContext } from '../../../provider/GlobalProvider';
import { useSearchHistory } from '../../../hooks/useSearchHistory';

export const TokenCard = ({ token }) => {

    let {tokenName, tokenSymbol} = useTokenInfo(token);
    const context = useContext(GlobalContext);
    const {addToSearchHistory} = useSearchHistory();

    useEffect(() => {
        if(tokenName && tokenSymbol){
            context.global.actions.pushInDatabase(token, tokenName, tokenSymbol);
            addToSearchHistory(token, tokenName, tokenSymbol);
        }
    }, [tokenName, tokenSymbol]);

    return(
        <Card>
            <TokenSymbolWrapper token={token} />
        </Card>
    )
}

export const GainsGard = ({ globalGain, todayGain, transactions }) => {
    return(
        <Card>
            <Flex flex={1} justifyContent="space-around" alignItems="center" flexDirection="row">
                <Flex sx={{gap: '5px'}} flexDirection="column" alignItems="center">
                    <Text color="#B1B5C4" fontSize={['12px', 3]} fontFamily={'DM Sans'}>Total profit</Text>
                    <Text color="white" fontSize={[2, 4]} fontFamily={'ABeeZee'}>{globalGain} $</Text>
                </Flex>
                <Flex sx={{gap: '5px'}} flexDirection="column" alignItems="center">
                    <Text color="#B1B5C4" fontSize={['12px', 3]} fontFamily={'DM Sans'}>Today</Text>
                    <Text color="white" fontSize={[2, 4]}  fontFamily={'ABeeZee'}>{todayGain} $</Text>
                </Flex>
                <Flex sx={{gap: '5px'}} flexDirection="column" alignItems="center">
                    <Text color="#B1B5C4" fontSize={['12px', 3]} fontFamily={'DM Sans'}>Transactions</Text>
                    <Text color="white" fontSize={[2, 4]}  fontFamily={'ABeeZee'}>{transactions}</Text>
                </Flex>
            </Flex>
        </Card>
)
    }

export const ResultsContainer = ({dividendsSave, token, wallet, dividends, globalGain, todayGain}) => {
    
    const history = useHistory();
    const restart = () => {
        history.push('/')
    }

    return(
        <Flex width={'100%'} alignItems="start" flexDirection='column'>
            <Results dividendsSave={dividendsSave} token={token} wallet={wallet} dividends={dividends} globalGain={globalGain} todayGain={todayGain} />
        </Flex>
    )
}