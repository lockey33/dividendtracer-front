import axios from 'axios';
import React from  'react';
import { LocaleStorageContext } from './LocalStorageProvider';

const UserContext = React.createContext({});

class UserProvider extends React.Component {

    static contextType = LocaleStorageContext;
    constructor(props){
        super(props);
        this.state = {
            
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

    getUserSearchHistory = async(address) => {
        axios({
            method: 'get',
            url: 'http://localhost:3001/v1/users/getUserSearchList',
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

    addToSearchHistory = async(wallet, tokenAddress, tokenName) => {
        axios({
            method: 'post',
            url: 'http://localhost:3001/v1/users/addToSearchHistory',
            data: {
                address: wallet,
                tokenAddress: tokenAddress,
                tokenName: tokenName
            }
        })
        .then(res => {
            console.log('added to search list');
        })
        .catch(err => {
            console.log(err);
        })
    }
    
    removeFromSearchHistory = async(wallet, tokenAddress) => {
        axios({
            method: 'post',
            url: 'http://localhost:3001/v1/users/removeFromSearchHistory',
            data: {
                address: wallet,
                tokenAddress: tokenAddress
            }
        })
        .then(res => {
            console.log('removed from search list');
        })
        .catch(err => {
            console.log(err);
        })
    }

    addToWatchlist = async(wallet, tokenAddress, tokenName) => {
        axios({
            method: 'post',
            url: 'http://localhost:3001/v1/users/addToWatchlist',
            data: {
                address: wallet,
                tokenAddress: tokenAddress,
                tokenName: tokenName
            }
        })
        .then(res => {
            console.log('added to watchlist');
        })
        .catch(err => {
            console.log(err);
        })
    }

    removeFromWatchlist = async(wallet, tokenAddress) => {
        axios({
            method: 'post',
            url: 'http://localhost:3001/v1/users/removeFromWatchlist',
            data: {
                address: wallet,
                tokenAddress: tokenAddress
            }
        })
        .then(res => {
            console.log('removed from watchlist');
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

        return userWatchlist;
    }

    isInWatchlist = async(address, tokenAddress) => {
        let isInWatchlist = await this.getUserWatchlist(address)
        .then(res => {
                let isInWatchlist = res.some(item => item.tokenAddress === tokenAddress);
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