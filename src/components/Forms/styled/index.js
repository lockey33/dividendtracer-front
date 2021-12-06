import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import {Flex} from "rebass"

export const SubmitButton = styled.button`
    background: #669566;
    border: solid 1px transparent;
    display: block;
    margin: 0 auto;
    border-radius: 10px;
    padding: 10px 20px;
    font-family: 'DM Sans';
    font-weight: bold;
    font-size: 16px;
    color: #6CF057;
    margin-left: auto;
    cursor: pointer;
    transition: all 0.3s ease-in-out;
    &:hover {
        border: solid 1px #6CF057;
    }
`

export const ItemForm = styled.div`
    display: flex;
    flex-direction: column;
    align-items: stretch;
    margin-bottom: 2rem;
    label{
        color: white;
        font-family: 'DM Sans';
        font-weight: bold;
        font-size: 16px;
        margin-bottom: 10px;        
    }
    @media (max-width: 768px) {
            margin-bottom: 1.5rem;
        label{
            font-size: 14px;
        }
    }
`

export const FormWrapper = styled.form`
    width: auto;
    flex: 1;
`

export const Input = styled.input`
    padding: 20px;
    border-radius: 10px;
    background: rgba(119, 126, 144, 1);
    color: white;
    font-family: 'DM Sans';
    font-weight: bold;
    font-size: 16px;
    width: -webkit-fill-available;
    border: solid 1px transparent;
    &.error{
        border: solid 1px #ff4545;
    }
    &::placeholder{
        color: rgba(255, 255, 255, 0.5);
    }
    &:focus, &:active, &:focus-visible{
        outline: none;
        &:not(:disabled){
            border: solid 1px #6CF057;
        }
   }
   @media (max-width: 768px) {
        font-size: 14px;
        padding: 15px 20px;
    }
    &:-webkit-autofill {
        -webkit-text-fill-color: white;
        transition: background-color 5000s ease-in-out 0s;
    }
    &:disabled{
        opacity: 0.5;
    }
`


export const Textarea = styled.textarea`
    padding: 20px;
    border-radius: 10px;
    background: rgba(119, 126, 144, 1);
    color: white;
    font-family: 'DM Sans';
    font-weight: bold;
    font-size: 16px;
    border: solid 1px transparent;
    &.error{
        border: solid 1px #ff4545;
    }
    &::placeholder{
        color: rgba(255, 255, 255, 0.5);
    }
    &:focus, &:active, &:focus-visible{
        outline: none;
        border: solid 1px #6CF057;
    }
    @media (max-width: 768px) {
        font-size: 14px;
        padding: 15px 20px;
    }
`

export const ErrorMessage = styled.div`
    color: #ff4545;
    font-family: 'DM Sans';
    font-weight: bold;
    font-size: 16px;
    margin-top: 10px;
    @media (max-width: 768px) {
        font-size: 14px;
    }
`

const StyledSearchHistory = styled.div`
    position: absolute;
    width: 100%;
    min-height: 20vh;
    padding-top: 2rem;
    background: black;
    bottom: 0;
    z-index: 1;
    transform: translateY(95%);
    display: ${props => props.isOpen ? 'block' : 'none'};
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
`

export const SearchHistoryWrapper = styled.div`
    position: relative;
    width: 100%;
    input{
        position: relative;
        z-index: 2;
    }
`

const SearchHistoryItem = styled.div`
    padding: 10px 20px;
    border-radius: 10px;
    color: white;
    font-family: 'DM Sans';
    font-weight: bold;
    font-size: 14px;
    cursor: pointer;
    display: flex;
    align-items: center;
    &:hover{
        cursor: pointer;
    }
    @media (max-width: 768px) {
        font-size: 12px;
        padding: 10px 15px;
    }
`

export const SearchHistory = ({isOpen}) => {

    const [searchHistory, setSearchHistory] = useState([]);

    const getSearchHistory = () => {
        const searchHistory = localStorage.getItem('searchHistory');
        if(searchHistory){
            setSearchHistory(JSON.parse(searchHistory));
        }
    }

    useEffect(() => {
        getSearchHistory();
    }, [isOpen])

    return (
        <StyledSearchHistory isOpen={isOpen}>
            {searchHistory.length > 0 &&
                searchHistory.map((item, index) => {
                    return (
                        <SearchHistoryItem key={index} style={{color: 'white'}}>
                            <Flex alignItems="center" sx={{gap: '15px'}}>
                                {item.address}
                            </Flex>
                        </SearchHistoryItem>
                    )
                })               
            }
        </StyledSearchHistory>
    )
}