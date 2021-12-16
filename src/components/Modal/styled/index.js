import styled from 'styled-components';

export const ModalHeaderWrapper = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
    margin-bottom: 1rem;
    button{
        border: none;
        background: transparent;
        cursor: pointer;
        color: white;
        font-size: 30px;
        &:hover{
            opacity: 0.5;
        }
    }   
`

export const ModalWrapper = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,0.8);
    z-index: 9;
`

export const ModalInner = styled.div`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 100%;
    max-width: 500px;
    background-color: rgb(25, 27, 31);
    border-radius: 15px;
    box-shadow: 0 0 10px rgba(0,0,0,0.5);
    padding: 10px 20px 40px;
    z-index: 99;
    max-width: 500px;
    max-height: 90vh;
    form{
        @media screen and (min-width: 760px){
            width: 90%;
        }
    }
    li{
        font-size: 16px;
        @media screen and (max-width: 760px){
            font-size: 14px;
        }
    }
    @media screen and (max-width: 760px){
       width: 80%;
    }
}
`