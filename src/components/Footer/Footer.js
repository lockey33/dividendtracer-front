import React from 'react';
import { FaTelegramPlane, FaTwitter } from 'react-icons/fa';
import { Flex, Text } from 'rebass';
import { TelegramButton } from '../Header/styled';

export const Footer = () => {

    return(
        <footer className="footer">
            <Flex justifyContent="center" alignItems="center" flexDirection="column">
                <Text mb={3} fontSize={[2, 3, 4]} fontWeight="bold" color="white">
                    Join our community
                </Text>
            </Flex>
            <Flex alignItems="center" justifyContent="center" sx={{gap: '15px'}}>
                <TelegramButton rel="noreferrer" target="_blank" href="https://t.me/DividendTracer">Telegram <FaTelegramPlane /></TelegramButton>
                <TelegramButton>Twitter <FaTwitter /></TelegramButton>
            </Flex>
            <Flex mt={3} alignItems="center" justifyContent="center" sx={{gap: '15px'}}>
                <Text fontSize='13px' color="white">© 2021 DividendTracer</Text>
            </Flex>
        </footer>

    )
}