import styled from 'styled-components';

export const TrackerWrapper = styled.div`
    display: flex;
    background: #23262F;
    border-radius: 10px;
    padding: 40px 50px;
    margin-top: 1rem;
    @media (max-width: 768px) {
        padding: 40px 15px;
    }
`

export const AdBlock = styled.div`
    margin-top: 1rem;
    background: rgba(255, 100, 100, 0.49);
    border-radius: 10px;
    padding: 12px 20px;
    text-align: center;
    font-family: 'DM Sans';
    font-weight: bold;
    font-size: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #FFFFFF;
    @media (max-width: 768px) {
            font-size: 14px;
    }
`

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
    color: #FFFFFF;
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
        &:not(:nth-child(2)) {
            margin-bottom: 1rem;
        }
        label{
            font-size: 14px;
        }
    }
`

export const Form = styled.form`
    width: 100%;
`

export const Input = styled.input`
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
    &:-webkit-autofill {
        -webkit-text-fill-color: white;
        transition: background-color 5000s ease-in-out 0s;
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

export const Button = styled.button`
    background-color: transparent;
    border: 1px solid #a9a9a9;
    border-radius: 5px;
    color: #a9a9a9;
    font-family 'DM Sans';
    font-size: 14px;
    font-weight: bold;
    padding: 5px 20px;
    text-decoration: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 10px;
    &:hover {
        background-color: #a9a9a9;
        color: #fff;
    }
`