import React from 'react';
import {Heading, Box} from "rebass";
import styled from 'styled-components';

const AdWrapper = styled.div`
    margin-top: 8px;
    height: 20vh;
    background-color: #f5f5f5;
    border-radius: 10px;
`

const PromoteMessage = () => <Box color="#B1B5C4" sx={{'a': {color: 'inherit', textDecoration: 'none'}}} fontSize={1} fontFamily='DM Sans' mt={2} textAlign="center">Want to promote your token ? Contact us at <a href="mailto:dividendtracer@gmail.com"><strong>dividendtracer@gmail.com</strong></a></Box>

export const Ads = () => {
    return (
        <>
            <AdWrapper>
                
            </AdWrapper>
            <PromoteMessage />
        </>
    );
};