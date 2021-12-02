import React, {useEffect, createRef} from 'react';
import {Flex, Text, Box, Heading} from "rebass";
import styled from "styled-components";
import "react-datepicker/dist/react-datepicker.css";
import {registerables, Chart} from "chart.js"
import { TableWrapper } from '../Table/Table';

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

const ChartWrapper = ({dividends}) => {

    const chartRef = React.createRef();
    dividends.reverse();
    const setChart = () => {
        var data = {
            labels: [],
            datasets: [
                {
                    label: 'Rewards',
                    data: [],
                    tension: 1,
                    fill: true,
                },    
            ]
        };

        let profit = dividends.reverse().map(a => Number(a.rawDollarValue)).map((_, i, a) => a.slice(0, i + 1).reduce((a, b) => {return a + b}))
        for(var i = 0; i < profit.length; i++) {
            data.labels.push(new Date(parseInt(dividends[i].timestamp) * 1000).toLocaleDateString());
            data.datasets[0].data.push(profit[i]);
        }

        const myChartRef = chartRef.current.getContext('2d');

        var gradient = myChartRef.createLinearGradient(0, 0, 0, 300);
        gradient.addColorStop(0, 'rgba(48, 224, 161, 0.3)');   
        gradient.addColorStop(1, 'rgba(12, 12, 12, 0)');

        Chart.register(...registerables);
        new Chart(myChartRef, {
            type: "line",
            data: data,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                elements: {
                    line: {
                        borderJoinStyle: 'bevel',
                        borderWidth: 2.5,
                        borderColor: 'rgba(138, 255, 108, 1)',
                        backgroundColor: gradient,
                    },
                    point:{
                        backgroundColor: 'transparent',
                        borderColor: "transparent"
                    },
                },
                scales:{
                    x: {
                        display: false
                    },
                    y: {
                        display: false
                    }
                },
                plugins: {   
                    legend: {
                      display: false
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false
                     },
                },
            },
            plugins: [{
                afterDatasetsDraw: function(chart, easing) {
                    if (chart.tooltip && chart.tooltip.opacity === 1) {
                        const ctx = chart.ctx;
                        const x = chart.tooltip.caretX;
                        const topY = chart.scales.y.top;
                        const bottomY = chart.scales.y.bottom;
            
                        ctx.save();
                        ctx.beginPath();
                        ctx.moveTo(x, topY);
                        ctx.lineTo(x, bottomY);
                        ctx.lineWidth = 2;
                        ctx.strokeStyle = 'rgba(255,255,255,0.5)';
                        ctx.fillStyle = gradient;
                        ctx.stroke();
                        ctx.restore();
                    }
                }
            }]
        });
    }

    const useMountEffect = (a) => useEffect(a, [])

    useMountEffect(() => {
        setChart();
    }, []);

    return(
        <canvas
            id="chart"
            ref={chartRef}
        />
    )

} 

export const Results = ({ dividends, globalGain, todayGain, token, wallet}) => {
    return(
        <Box width={'100%'}>
            <Box width={'100%'} py={4}>
                <Flex justifyContent="space-between" flexDirection="column">
                    <Flex sx={{gap: '8px', flexWrap: 'wrap'}} mb={3} alignItems="center">
                        <Text color="#B1B5C4" fontSize={2} display="flex" alignItems="center" gap={2} fontFamily={'DM Sans'}>Token : </Text>
                        <AddressLink>{token}</AddressLink>
                    </Flex>
                    <Flex sx={{gap: '8px', flexWrap: 'wrap'}} alignItems="center">
                        <Text color="#B1B5C4" fontSize={2} fontFamily={'DM Sans'}>Wallet : </Text>
                        <AddressLink target="_blank" href={`https://bscscan.com/address/${wallet}`}>{wallet}</AddressLink>
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