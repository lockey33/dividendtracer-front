import React from "react";
import axios from "axios";

export const useUser = (account) => {

    const createUser = () => {
        axios({
            method: 'post',
            url: 'https://159.223.127.45:3001/v1/users/createUser',
            data: {
                address: account
            }
        })
        .then(res => {
            console.log('user saved');
        })
        .catch(err => {            
            
        });
    }

    return {
        createUser
    }
}
