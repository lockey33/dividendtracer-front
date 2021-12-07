import React, { useEffect } from 'react';
import { Heading, Flex, Box } from 'rebass';
import { GlobalContext } from '../../provider/GlobalProvider';
import { FormWrapper, ItemForm, ErrorMessage, Input, SubmitButton, AutoComplete, SearchHistoryWrapper, SearchHistory } from './styled';


export const Form = ({action, handleAddress, handleWallet, errorWallet, errorToken}) => {

    return(
        <FormWrapper  action="">
            <Heading fontFamily="DM Sans" color="white" fontSize={[3, 4]} mb={3} mt={0} textAlign="center">Start tracking your dividends</Heading>
            <InputTracker handleAddress={handleAddress} errorToken={errorToken} />
            <InputWallet handleWallet={handleWallet} errorWallet={errorWallet} />
            <SubmitButton id="searchDividendBtn" onClick={(e) => action(e)} type="submit">Track your dividend</SubmitButton>
        </FormWrapper>
    )
}

function useOutsideAlerter(ref, setShowSearchhistory) {
    useEffect(() => {
        function handleClickOutside(event) {
            if (ref.current && !ref.current.contains(event.target)) {
                setShowSearchhistory(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [ref]);
}

const InputTracker = ({handleAddress, errorToken}) => {

    const [showSearchhistory, setShowSearchhistory] = React.useState(false);
    const [selectedToken, setSelectedToken] = React.useState('');
    const inputRef = React.createRef();
    const wrapperRef = React.useRef(null);

    const handleClick = (token) => {
        setShowSearchhistory(false);
        setSelectedToken(token);
    }

    useEffect(() => {
        if(selectedToken) {
            inputRef.current.value = selectedToken;
            handleAddress(selectedToken)        
        }
    }, [selectedToken])

    useOutsideAlerter(wrapperRef, setShowSearchhistory);
    
    return(
        <ItemForm>
            <label htmlFor="item">Token address</label>
            <SearchHistoryWrapper ref={wrapperRef}>
                <Input ref={inputRef} autoComplete="off" onFocus={() => setShowSearchhistory(true)} className={errorToken ? 'error' : ''} onChange={(e) => handleAddress(e.target.value)} type="text" name="tokenaddr" placeholder="0x..." required />
                {showSearchhistory &&
                    <SearchHistory handleClick={handleClick} isOpen={showSearchhistory} />
                }
            </SearchHistoryWrapper>
            <ErrorMessage>{errorToken ? 'Please check token address' : ''}</ErrorMessage>
        </ItemForm>
    )
}

export const InputWallet = ({handleWallet, errorWallet}) => {
    
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
        <ItemForm>
            <label htmlFor="item">Wallet address</label>
            <Input className={errorWallet ? 'error' : ''} ref={walletInputRef}  onChange={(e) => handleWallet(e.target.value)} type="text" name="walletaddr" placeholder="0x..." required />
            {errorWallet ? <ErrorMessage>Please check your wallet address</ErrorMessage> : null}
            <Box>
                {currentAccount ? <Box sx={{'&:hover':{opacity: 0.5, cursor: 'pointer'}}} display="inline-block" fontFamily="DM Sans" fontSize={[1]} color="white" onClick={() => changeWallet()} mt={2}>{wallet !== '' ? 'Use another wallet' : 'Use your wallet'}</Box> : null}
            </Box>
        </ItemForm>
    )
}