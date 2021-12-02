import React from 'react';
import {Flex, Text, Box} from "rebass";
import styled from "styled-components";
import "react-datepicker/dist/react-datepicker.css";
import { TableWrapper } from '../Table/Table';
import { ChartWrapper } from '../Chart/Chart';

const AddressLink = styled.a`
    color: #fff;
    font-family 'ABeeZee';
    font-size: 16px;
    ${'' /* flex: 1; */}
    ${'' /* min-width: 0; */}
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    text-decoration: none;
    @media screen and (max-width: 768px) {
        font-size: 12px;
    }
` 

export const Results = ({ dividends, globalGain, todayGain, token, wallet}) => {
    return(
        <Box width={'100%'}>
            <Box width={'100%'} py={4}>
                <Flex justifyContent="space-between" flexDirection="column">
                    <Flex sx={{gap: '8px', flexWrap: 'wrap'}} mb={3} alignItems="center">
                        <Text color="#B1B5C4" fontSize={2} display="flex" alignItems="center" gap={2} fontFamily={'DM Sans'}>Token : </Text>
                        <AddressLink id="tokenBscscan" target="_blank" href={`https://bscscan.com/address/${token}`}>{token}</AddressLink>
                    </Flex>
                    <Flex sx={{gap: '8px', flexWrap: 'wrap'}} alignItems="center">
                        <Text color="#B1B5C4" fontSize={2} fontFamily={'DM Sans'}>Wallet : </Text>
                        <AddressLink id="walletBscscan" target="_blank" href={`https://bscscan.com/address/${wallet}`}>{wallet}</AddressLink>
                    </Flex>
                </Flex>
            </Box>
            <Flex justifyContent="space-between">
                <Flex flex={1} justifyContent="center" flexDirection="column">
                    <Flex sx={{gap: '5px'}} mb={3} flexDirection="column">
                        <Text color="#B1B5C4" fontSize={[1, 3]} display="flex" alignItems="center" gap={2} fontFamily={'DM Sans'}>Total profit : </Text>
                        <Text color="white" fontSize={[4]} fontFamily={'ABeeZee'}>{globalGain}</Text>
                    </Flex>
                    <Flex sx={{gap: '5px'}} flexDirection="column">
                        <Text color="#B1B5C4" fontSize={[1, 3]} fontFamily={'DM Sans'}>Today : </Text>
                        <Text color="white" fontSize={[4]}  fontFamily={'ABeeZee'}>{todayGain}</Text>
                    </Flex>
                </Flex>
                <Flex flex={1} justifyContent="center">
                    <Box w={'65%'}>
                        <ChartWrapper dividends={dividends} />
                    </Box>
                </Flex>
            </Flex>
            <Box mt={5} mb={3} width={'100%'}>
                <TableWrapper data={dividends} />
            </Box>
        </Box>
    )
}