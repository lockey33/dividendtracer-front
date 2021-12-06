import styled from 'styled-components';

export const ModalHeaderWrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0.5rem 1rem;
    position: relative;
    margin-bottom: 2rem;
    button{
        position: absolute;
        right: 0;
        padding: 0.5rem;
        border: none;
        background: transparent;
        cursor: pointer;
        color: white;
        font-size: 30px;
        &:hover{
            background: rgba(0,0,0,0.1);
        }
    }   
`

export const ModalWrapper = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,0.5);
    z-index: 100;
`

export const ModalInner = styled.div`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 80%;
    max-width: 500px;
    background-color: #23262F;
    border-radius: 15px;
    box-shadow: 0 0 10px rgba(0,0,0,0.5);
    padding: 1rem 1rem 3rem;
    form{
        padding: 0 40px;
    }
`