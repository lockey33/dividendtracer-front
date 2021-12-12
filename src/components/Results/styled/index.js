import {Flex, Box, Text} from 'rebass';
import { Button } from '../../Tracker/styled';
import { Results } from '../Results';
import { VscDebugRestart } from 'react-icons/vsc';
import {useHistory} from 'react-router-dom';
import { TokenSymbolWrapper } from '../../Token/TokenSymbol';
import { Card } from '../../Card';

export const TokenCard = ({ token }) => {
    return(
        <Card>
            <TokenSymbolWrapper token={token} />
        </Card>
    )
}

export const GainsGard = ({ globalGain, todayGain }) => {
    return(
        <Card>
            <Flex flex={1} justifyContent="space-around" alignItems="center" flexDirection="row">
                <Flex sx={{gap: '5px'}} flexDirection="column" alignItems="center">
                    <Text color="#B1B5C4" fontSize={[1, 3]} fontFamily={'DM Sans'}>Total profit</Text>
                    <Text color="white" fontSize={[4]} fontFamily={'ABeeZee'}>{globalGain}</Text>
                </Flex>
                <Flex sx={{gap: '5px'}} flexDirection="column" alignItems="center">
                    <Text color="#B1B5C4" fontSize={[1, 3]} fontFamily={'DM Sans'}>Today</Text>
                    <Text color="white" fontSize={[4]}  fontFamily={'ABeeZee'}>{todayGain}</Text>
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
            {/* <Flex justifyContent={'start'} alignItems={'center'}>
                <Button id="startAgainTop" onClick={() => restart()}>
                    Start again <VscDebugRestart />
                </Button>
            </Flex> */}
            <Results dividendsSave={dividendsSave} token={token} wallet={wallet} dividends={dividends} globalGain={globalGain} todayGain={todayGain} />
            {/* <Flex mt={2} justifyContent={'start'} alignItems={'center'}>
                <Button id="startAgainBottom" onClick={() => restart()}>
                    Start again <VscDebugRestart />
                </Button>
            </Flex> */}
        </Flex>
    )
}