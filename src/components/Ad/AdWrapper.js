import React from 'react';
import {Heading, Box} from "rebass";
import styled from 'styled-components';
import SNKRSGif from '../../images/ads/snkrs.gif';

const AdWrapper = styled.a`
    border-radius: 10px;
    overflow: hidden;
    text-decoration: none;
    cursor: pointer;
    img{
        width: 100%;
    }
`

const PromoteMessage = () => <Box color="#B1B5C4" sx={{'a': {color: 'inherit', textDecoration: 'none'}}} fontSize={1} fontFamily='DM Sans' mt={2} textAlign="center">Want to promote your token ? Contact us at <a href="mailto:dividendtracer@gmail.com"><strong>dividendtracer@gmail.com</strong></a></Box>

export const Ads = () => {
    return (
        <>
            <AdWrapper target='_blank' href="https://www.green-snkrs.com">
                <img src={SNKRSGif} alt="" />
            </AdWrapper>
            <PromoteMessage />
        </>
    );
};