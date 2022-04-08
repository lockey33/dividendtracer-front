import React from 'react';
import { FaTelegramPlane, FaTwitter } from 'react-icons/fa';
import { Flex, Text } from 'rebass';
import { TelegramButton } from '../Header/styled';

export const Footer = () => {

    return(
        <footer className="footer">
            <Flex pt={[4, 0]} justifyContent="center" alignItems="center" flexDirection="column">
                <Text mb={3} fontSize={[2, 3, 4]} fontWeight="bold" color="white">
                    Join the PonySwap community
                </Text>
            </Flex>
            <Flex alignItems="center" justifyContent="center" sx={{gap: '15px'}}>
                <TelegramButton rel="noreferrer" target="_blank" href="https://t.me/ponyswapEN">Telegram <FaTelegramPlane /></TelegramButton>
                <TelegramButton rel="noreferrer" target="_blank" href="https://twitter.com/ponyswapdex">Twitter <FaTwitter /></TelegramButton>
            </Flex>
            <Flex mt={3} mb={[2, 4]} alignItems="center" justifyContent="center" sx={{gap: '15px'}}>
                <Text fontSize='13px' color="white">© 2022 - DividendTracer by <a style={{color: 'inherit', textDecoration: "underline"}} href="https://ponyswap.org">ponyswap.org</a></Text>
            </Flex>
        </footer>

    )
}