import styled from 'styled-components';

export const StyledTable = styled.table`
    width: 100%;
    color: white;
    td, th{
        text-align: left;
        padding: 10px 0;
    }
    thead > tr:first-child{
        display: none;
    }
    tr{
        >:first-child{
            width: 50%;
        }
        >:nth-child(2){
            width: 25%;
            text-align: right;
        }
        >:nth-child(3){
            width: 25%;
            text-align: right;
        }
        @media (max-width: 768px) {
            display: flex;
            font-size: 14px;
            >:first-child{
                flex: 1;
                width: auto;
            }
            >:nth-child(2){
                flex: 1;
                width: auto;
            }
            >:nth-child(3){
                flex: 1;
                width: auto;
            }
        }
    }
    thead{
        position: relative;
        ::before{
            content: "";
            display: block;
            width: 100%;
            height: 1px;
            background: #fff;
            bottom: 0;
            position: absolute;
        }
    }
`

export const PageButton = styled.button`
    background: #669566;
    border: solid 1px transparent;
    border-radius: 3px;
    height: 30px;
    width: 30px;
    margin: 0 10px;
    font-family: 'DM Sans';
    font-weight: bold;
    font-size: 14px;
    color: #FFFFFF;
    margin-left: auto;
    cursor: pointer;    
    &:hover {
        border: solid 1px #6CF057;
    }
    &.active{
        background: #6CF057;
        color: #fff;
        border: solid 1px #6CF057;
    }
`