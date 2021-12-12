import React, { useEffect } from 'react';
import {Flex, Text, Box} from "rebass";
import "react-datepicker/dist/react-datepicker.css";
import { TableWrapper } from '../Table/Table';
import { ChartWrapper } from '../Chart/Chart';

export const Results = ({ dividends, globalGain, todayGain, token, wallet}) => {

    return(
        <Box width={'100%'}>
            <Flex justifyContent="space-between">
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