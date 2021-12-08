import axios from 'axios';
import React from  'react';
import { LocaleStorageContext } from './LocalStorageProvider';

const UserContext = React.createContext({});

class UserProvider extends React.Component {

    static contextType = LocaleStorageContext;
    constructor(props){
        super(props);
        this.state = {
            watchlist: [],
            searchHistory: [],
            fetched: false,
        }

        this.actions = {
            createUser: this.createUser,
            getUser: this.getUser,
            getUserSearchHistory: this.getUserSearchHistory,            
            getUserWatchlist: this.getUserWatchlist,
            addToSearchHistory: this.addToSearchHistory,
            removeFromWatchlist: this.removeFromWatchlist,
            addToWatchlist: this.addToWatchlist,
            isInWatchlist: this.isInWatchlist,
            removeFromSearchHistory: this.removeFromSearchHistory,
            fetchSearchHistory: this.fetchSearchHistory,
        }
    }        

    createUser = async(address) => {
        axios({
            method: 'post',
            url: 'http://localhost:3001/v1/users/createUser',
            data: {
                address: address
            }
        })
        .then(res => {
            console.log('user saved');
        })
        .catch(err => {
            // console.log(err);
            this.getUser(address);
        });
    }

    getUser = async(address) => {
        axios({
            method: 'get',
            url: 'http://localhost:3001/v1/users/getUserByAddress',
            data: {
                address: address
            }
        })
        .then(res => {
            return res.data;
        })
        .catch(err => {
            console.log('user not found');
        })
    }

    getUserSearchHistory = async (address) => {
        let data = await axios({
            method: 'post',
            url: 'http://localhost:3001/v1/users/getUserSearchHistory',
            data: {
                address: address
            }
        })
        .then(res => {
            return res.data;
        })
        .catch(err => {
            console.log('user not found');
        })
        this.setState({searchHistory: data});
        this.fetchSearchHistory(address);
        return data;
    }

    addToSearchHistory = async(wallet, tokenAddress, tokenName, symbol) => {
        this.context.actions.addToSearchHistory(tokenAddress, tokenName, symbol);
        axios({
            method: 'post',
            url: 'http://localhost:3001/v1/users/addToSearchHistory',
            data: {
                address: wallet,
                tokenAddress: tokenAddress,
                tokenName: tokenName,
                symbol: symbol
            }
        })
        .then(res => {
            let {data} = res
            this.setState({searchHistory: data});            
        })
        .catch(err => {
            console.log(err);
        });
    }

    fetchSearchHistory = async(address) => {
        let localData = this.context.actions.getSearchHistory();
        
        if(localData.length === 0 && this.state.searchHistory.length > 0){
            return this.state.searchHistory.map(item => {
                this.context.actions.addToSearchHistory(item.address, item.name, item.symbol);
            });
        }else if(this.state.searchHistory.length === 0 && localData.length > 0){
            return localData.map(item => {
                return this.addToSearchHistory(address, item.address, item.name, item.symbol);
            });
        }else{
            return localData.map(item => {
                this.state.searchHistory.map(item2 => {
                    if(item.address !== item2.address){
                        return this.addToSearchHistory(address, item.address, item.name, item.symbol);
                    }
                })
            });
        }
    }
    
    removeFromSearchHistory = async(wallet, tokenAddress) => {
        this.context.actions.removeFromSearchHistory(tokenAddress);
        axios({
            method: 'post',
            url: 'http://localhost:3001/v1/users/removeFromSearchHistory',
            data: {
                address: wallet,
                tokenAddress: tokenAddress
            }
        })
        .then(res => {
            this.setState({searchHistory: res.data});
            console.log('removed from search list');
        })
        .catch(err => {
            console.log(err);
        })
    }

    addToWatchlist = async(wallet, tokenAddress, tokenName, symbol) => {
        axios({
            method: 'post',
            url: 'http://localhost:3001/v1/users/addToWatchlist',
            data: {
                address: wallet,
                tokenAddress: tokenAddress,
                tokenName: tokenName,
                symbol: symbol
            }
        })
        .then(res => {
            this.setState({watchlist: res.data});
            console.log('added to watchlist');
        })
        .catch(err => {
            console.log(err);
        })
    }

    removeFromWatchlist = async(wallet, tokenAddress) => {
        await axios({
            method: 'post',
            url: 'http://localhost:3001/v1/users/removeFromWatchlist',
            data: {
                address: wallet,
                tokenAddress: tokenAddress
            }
        })
        .then(res => {
            this.setState({watchlist: res.data});
            console.log(res)
        })
        .catch(err => {
            console.log(err);
        })
    }

    getUserWatchlist = async(address) => {
        let userWatchlist = await axios({
            method: 'post',
            url: 'http://localhost:3001/v1/users/getUserWatchlist',
            data: {
                address: address
            }
        })
        .then(res => {
            return res.data;
        })
        .catch(err => {
            console.log('user not found');
        })
        this.setState({watchlist: userWatchlist});        
        return userWatchlist;
    }

    isInWatchlist = async(address, tokenAddress) => {
        let isInWatchlist = await this.getUserWatchlist(address)
        .then(res => {
            let isInWatchlist = res.some(item => item.address === tokenAddress);
            return isInWatchlist;
        })
        .catch(err => {
            console.log(err);
        })
        return isInWatchlist
    }


    render(){
        return (
            <UserContext.Provider value={{user: {state: this.state,actions: this.actions}, locale: this.context }}>
                {this.props.children}
            </UserContext.Provider>
        )
    }
}

export {UserContext, UserProvider};