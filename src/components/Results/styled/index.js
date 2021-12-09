import {Flex, Box} from 'rebass';
import { Button } from '../../Tracker/styled';
import { Results } from '../Results';
import { VscDebugRestart } from 'react-icons/vsc';
import {useHistory} from 'react-router-dom';

export const ResultsContainer = ({dividendsSave, token, wallet, dividends, globalGain, todayGain}) => {
    
    const history = useHistory();
    const restart = () => {
        history.push('/')
    }
    
    return(
        <Flex width={'100%'} alignItems="start" flexDirection='column'>
            <Flex justifyContent={'start'} alignItems={'center'}>
                <Button id="startAgainTop" onClick={() => restart()}>
                    Start again <VscDebugRestart />
                </Button>
            </Flex>
            <Results dividendsSave={dividendsSave} token={token} wallet={wallet} dividends={dividends} globalGain={globalGain} todayGain={todayGain} />
            <Flex mt={2} justifyContent={'start'} alignItems={'center'}>
                <Button id="startAgainBottom" onClick={() => restart()}>
                    Start again <VscDebugRestart />
                </Button>
            </Flex>
        </Flex>
    )
}