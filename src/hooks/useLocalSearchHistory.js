import React, { useEffect } from 'react';

export const useLocalSearchHistory = () => {

    const [localSearchHistory, setSearchHistory] = React.useState([]);
    
    const addToLocalSearchHistory = (tokenAddress, tokenName, symbol) => {
        let searchHistory = localStorage.getItem('searchHistory');
        searchHistory = searchHistory ? JSON.parse(searchHistory) : [];
        if(!(searchHistory.some(o => o.address === tokenAddress))){
            let newSearchHistory = {address: tokenAddress, name: tokenName, symbol: symbol};
            searchHistory.push(newSearchHistory);
            localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
            setSearchHistory(searchHistory);
        }
    }

    const removeFromLocalSearchHistory = (tokenAddress) => {
        let searchHistory = localStorage.getItem('searchHistory');
        searchHistory = searchHistory ? JSON.parse(searchHistory) : [];
        searchHistory = searchHistory.filter(item => item.address !== tokenAddress);
        localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
        setSearchHistory(searchHistory);
    }

    const getSearchHistory = () => {
        let searchHistory = localStorage.getItem('searchHistory');
        searchHistory = searchHistory ? JSON.parse(searchHistory) : [];
        searchHistory = searchHistory.reverse();
        setSearchHistory(searchHistory);
        return searchHistory;
    }

    useEffect(() => {
        getSearchHistory();
    }, [])
    
    return {
        localSearchHistory,
        addToLocalSearchHistory,
        removeFromLocalSearchHistory,
    };
}