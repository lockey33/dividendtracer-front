import React, { useEffect } from "react";
import { GlobalContext } from "../provider/GlobalProvider";
import { ERC20 } from "../abi/erc20";

export const useTokenInfo = (token) => {
    const context = React.useContext(GlobalContext);
    const [tokenName, setTokenName] = React.useState("");
    const [tokenSymbol, setTokenSymbol] = React.useState("");

    const getTokenName = async() => {
        const tokenContract = await context.global.actions.getFreeContractInstance(token, ERC20)
        const tokenName = await context.global.actions.callContractMethod(tokenContract, "name");
        return tokenName
    }

    const getTokenSymbol = async () => {
        const tokenContract = await context.global.actions.getFreeContractInstance(token, ERC20)
        const tokenSymbol = await context.global.actions.callContractMethod(tokenContract, "symbol");
        return tokenSymbol
    }

    useEffect(() => {
        async function fetchData() {
            setTokenName(await getTokenName());
            setTokenSymbol(await getTokenSymbol());
        }
        fetchData();
        return () => {
            setTokenName("");
            setTokenSymbol("");
        }
    }, [token])    

    return {tokenName, tokenSymbol} 

}