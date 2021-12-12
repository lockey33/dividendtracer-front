import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Card } from '../../Card';

export const TrackerWrapper = styled(Card)``

export const AdBlock = styled.div`
    margin-top: 1rem;
    background: rgba(255, 100, 100, 0.49);
    border-radius: 10px;
    padding: 12px 20px;
    text-align: center;
    font-family: 'DM Sans';
    font-weight: bold;
    font-size: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #FFFFFF;
    @media (max-width: 768px) {
            font-size: 14px;
    }
`

export const Button = styled.button`
    background-color: transparent;
    border: 1px solid #a9a9a9;
    border-radius: 5px;
    color: #a9a9a9;
    font-family 'DM Sans';
    font-size: 14px;
    font-weight: bold;
    padding: 5px 20px;
    text-decoration: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 10px;
    &:hover {
        background-color: #a9a9a9;
        color: #fff;
    }
`