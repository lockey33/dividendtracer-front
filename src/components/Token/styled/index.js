import styled from 'styled-components';

export const TokenIcon = styled.img`
    width: ${props => props.size ? props.size : '60px'};
    height: ${props => props.size ? props.size : '60px'};
    border-radius: 100%;
`

export const TokenName = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: start;    
    align-self: center;
`