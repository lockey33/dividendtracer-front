import React, { useEffect } from 'react';
import { Heading, Flex, Box } from 'rebass';
import { GlobalContext } from '../../provider/GlobalProvider';
import { FormWrapper, ItemForm, ErrorMessage, Input, SubmitButton } from './styled';


export const Form = ({action, handleAddress, handleTracker, handleWallet, response, customTracker, errorWallet, errorToken}) => {
    const context = React.useContext(GlobalContext);
    const currentAccount = context.wallet.state.currentAccount;
    const walletInputRef = React.createRef();

    const [wallet, setWalletState] = React.useState('');

    const setWallet = () => {
        setWalletState(currentAccount);
        handleWallet(currentAccount)
        walletInputRef.current.value = currentAccount;
        walletInputRef.current.disabled = true;
    }

    const resetWallet = () => {
        setWalletState('');
        handleWallet('');
        walletInputRef.current.value = "";
        walletInputRef.current.disabled = false;
    }

    const changeWallet = () => {
        if (wallet === '') {
            setWallet();
        } else {
            resetWallet();
        }
    }
            
    useEffect(() => {
        if(currentAccount) {
            setWallet();
        }else{
            resetWallet();
        }
    }, [currentAccount])

    return(
        <FormWrapper  action="">
            <Heading fontFamily="DM Sans" color="white" fontSize={[3, 4]} mb={3} mt={0} textAlign="center">Start tracking your dividends</Heading>
            <ItemForm>
                <label htmlFor="item">Token address</label>
                <Input className={errorToken ? 'error' : ''} onChange={(e) => handleAddress(e)} type="text" name="tokenaddr" placeholder="0x..." required />
                <ErrorMessage>{errorToken ? 'Please check token address' : ''}</ErrorMessage>
            </ItemForm>
            <ItemForm>
                <label htmlFor="item">Wallet address</label>
                <Input className={errorWallet ? 'error' : ''} ref={walletInputRef} onChange={(e) => handleWallet(e.target.value)} type="text" name="walletaddr" placeholder="0x..." required />
                {errorWallet ? <ErrorMessage>Please check your wallet address</ErrorMessage> : null}
                <Box>
                    {currentAccount ? <Box sx={{'&:hover':{opacity: 0.5, cursor: 'pointer'}}} display="inline-block" fontFamily="DM Sans" fontSize={[1]} color="white" onClick={() => changeWallet()} mt={2}>{wallet !== '' ? 'Use another wallet' : 'Use your wallet'}</Box> : null}
                </Box>
            </ItemForm>
            {response.status === false && response.hasOwnProperty("type") && response.type === "dividendTracker"  &&
                <ItemForm>
                    <label htmlFor="item">Dividend Tracker Address</label>
                    <Input onChange={(e) => handleTracker(e)} type="text" name="tracker" placeholder="Dividend tracker address (check on your rewards tx)" value={customTracker} />
                </ItemForm>
            }
            {customTracker !== ""  && response.status === true &&
                <ItemForm>
                    <label htmlFor="item">Dividend Tracker Address</label>
                    <Input onChange={(e) => handleTracker(e)} type="text" name="tracker" placeholder="Dividend tracker address (check on your rewards tx)" value={customTracker} />
                </ItemForm>
            }
            <SubmitButton id="searchDividendBtn" onClick={(e) => action(e)} type="submit">Track your dividend</SubmitButton>
        </FormWrapper>
    )
}