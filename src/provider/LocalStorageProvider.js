import React from 'react';

const LocaleStorageContext = React.createContext();

class LocaleStorageProvider extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            watchlist: [],
            searchHistory: [],
        };

        this.actions = {
            addToWatchlist: this.addToWatchlist,
            removeFromWatchlist: this.removeFromWatchlist,
            addToSearchHistory: this.addToSearchHistory,
            removeFromSearchHistory: this.removeFromSearchHistory,
        }
    }

    addToWatchlist = (tokenAddress, tokenName) => {
       let watchlist = localStorage.getItem('watchlist');
        watchlist = watchlist ? JSON.parse(watchlist) : [];
        if(watchlist.some(o => o.address !== tokenAddress)){
            let newWatchlist = {address: tokenAddress, name: tokenName};
            watchlist.push(newWatchlist);
            localStorage.setItem('watchlist', JSON.stringify(watchlist));
            this.setState({watchlist});
        }
        return;
    }

    removeFromWatchlist = (tokenInfo) => {
        let watchlist = localStorage.getItem('watchlist');
        watchlist = watchlist ? JSON.parse(watchlist) : [];
        watchlist = watchlist.filter(item => item.symbol !== tokenInfo.symbol);
        localStorage.setItem('watchlist', JSON.stringify(watchlist));
        this.setState({watchlist});
    }

    addToSearchHistory = (tokenAddress, tokenName) => {
        let searchHistory = localStorage.getItem('searchHistory');
        searchHistory = searchHistory ? JSON.parse(searchHistory) : [];
        if(!(searchHistory.some(o => o.address === tokenAddress))){
            let newSearchHistory = {address: tokenAddress, name: tokenName};
            searchHistory.push(newSearchHistory);
            localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
            this.setState({searchHistory});
        }
    }

    removeFromSearchHistory = (tokenAddress) => {
        let searchHistory = localStorage.getItem('searchHistory');
        searchHistory = searchHistory ? JSON.parse(searchHistory) : [];
        searchHistory = searchHistory.filter(item => item.address !== tokenAddress);
        localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
        this.setState({searchHistory});
    }

    clearStorage = () => {
        localStorage.removeItem('watchlist');
        localStorage.removeItem('searchHistory');
        this.setState({watchlist: [], searchHistory: []});
    }

    componentDidMount(){
        // this.clearStorage();
    }

    render(){
        return (
            <LocaleStorageContext.Provider value={{state: this.state, actions: this.actions}}>
                {this.props.children}
            </LocaleStorageContext.Provider>
        );
    }
}

export {LocaleStorageContext, LocaleStorageProvider};