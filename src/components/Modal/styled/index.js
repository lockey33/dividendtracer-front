import styled from 'styled-components';

export const ModalHeaderWrapper = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
    margin-bottom: 2rem;
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
    background-color: rgba(0,0,0,0.5);
    ${props => props.isOpen && `
        z-index: 9999;
        opacity: 1;
        animation: fadeInOpacity 0.6s ease;
        @keyframes fadeInOpacity {
        0% {
            opacity: 0;
        }
        100%{
            opacity: 1;
        }
    `}
    ${props => !props.isOpen && `
        z-index: -1;
        opacity: 0;
        animation: fadeOutOpacity 0.6s ease;
        @keyframes fadeOutOpacity {
        0% {
            opacity: 1;
        }
        100%{
            opacity: 0;
        }
    `}   
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
    z-index: 999;
    max-width: 420px;
    max-height: 90vh;
    form{
        @media screen and (min-width: 760px){
            padding: 0 40px;
        }
    }
}
`