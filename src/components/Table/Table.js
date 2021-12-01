import React, {useEffect} from 'react';
import styled from 'styled-components';
import Moment from 'react-moment';
import { useTable, usePagination } from 'react-table'
import {Box, Heading, Text, Flex} from "rebass";
import DatePicker from "react-datepicker";
import * as moment from 'moment';

const StyledTable = styled.table`
    width: 100%;
    color: white;
    td, th{
        text-align: left;
        padding: 10px 0;
    }
    thead > tr:first-child{
        display: none;
    }
    tr{
        >:first-child{
            width: 50%;
        }
        >:nth-child(2){
            width: 25%;
            text-align: right;
        }
        >:nth-child(3){
            width: 25%;
            text-align: right;
        }
    }
    thead{
        position: relative;
        ::before{
            content: "";
            display: block;
            width: 100%;
            height: 1px;
            background: #fff;
            bottom: 0;
            position: absolute;
        }
    }
`

const PageButton = styled.button`
    background: #669566;
    border: solid 1px transparent;
    border-radius: 3px;
    height: 30px;
    width: 30px;
    margin: 0 10px;
    font-family: 'DM Sans';
    font-size: 14px;
    color: #FFFFFF;
    margin-left: auto;
    cursor: pointer;    
    &:hover {
        border: solid 1px #6CF057;
    }
    &.active{
        background: #6CF057;
        color: #fff;
        border: solid 1px #6CF057;
    }
`

export const TableWrapper = ({data}) => {

    const [dateRange, setDateRange] = React.useState("");
    const [dateGain, setDateGain] = React.useState("");
    const [dividends, setDividends] = React.useState([]);
    const [previousDividends, setPreviousDividends] = React.useState([]);

    useEffect(() => {
        let newDate = [...data].reverse().map(item => {
            return {
                ...item,
                date: new Date(parseInt(item.timestamp)*1000).toLocaleDateString()
            }
        });
        setDividends(newDate);
        setPreviousDividends(newDate);
    }, [data])
    
    const columns = React.useMemo(() => [
          {
            Header: 'Profit',
            columns: [
                {
                    Header: 'Date',
                    accessor: 'date',
                  },
                  {
                    Header: 'Rewards',
                    accessor: 'dollarValue',
                  },
                  {
                    Header: 'Tokens',
                    accessor: 'bnbValue',
                  },
            ],
          },
    ], []);

      const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        prepareRow,
        page,
        canPreviousPage,
        canNextPage,
        pageOptions,
        pageCount,
        gotoPage,
        nextPage,
        previousPage,
        setPageSize,
        state: { pageIndex, pageSize },
      } = useTable({columns, data: dividends, initialState: { pageIndex: 0 }}, usePagination);

    const handleDate = async (date) => {
        if(date == null){
            setDateRange("")
            setDividends(previousDividends)
        }else{
            setDateRange(date)
            await filterByDate(date)
        }
    }

    const filterByDate = async (date) => {
        let filteredData = []
        let momentDate = moment(date)
        let dateGain = 0
        dividends.map((row) => {
            let isCurrentDate = moment.unix(row.timestamp).isSame(momentDate, 'day')
            if (isCurrentDate) {
                dateGain += parseFloat(row.rawDollarValue)
                filteredData.push(row)
            }
        })
        setDividends(filteredData)
        setDateGain(dateGain.toFixed(2))
    }

    return(
        <>
        <Box mb={3}>
            <Heading mb={2} fontFamily={'DM Sans'} fontSize={[2, 4]} color="white">Filter by date</Heading>
            <Box alignItems="center" display="inline-flex">
                <DatePicker placeholderText="YYYY/MM/DD" dateFormat="yyyy/MM/dd"
                    selected={dateRange}
                    onChange={(date) => handleDate(date)}
                    isClearable={true}
                    />
            </Box>
            {dateRange !== '' && 
                <Text mt={3} color="white" fontSize={2}>Profit on <Moment format='YYYY/MM/DD'>{dateRange}</Moment> : <strong>{dateGain} $</strong></Text>
            }
        </Box>
        <StyledTable {...getTableProps()}>
            <thead>
                {headerGroups.map(headerGroup => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map(column => (
                        <th {...column.getHeaderProps()}>{column.render('Header')}</th>
                    ))}
                    </tr>
                ))}
            </thead>
            <tbody {...getTableBodyProps()}>
            {page.map((row, i) => {
                prepareRow(row)
                return (
                <tr {...row.getRowProps()}>
                    {row.cells.map(cell => {
                        return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                    })}
                </tr>
                )
            })}
            </tbody>
        </StyledTable>
        <Box mt={4}>
            <Flex justifyContent="center">
                <Box>
                   {pageOptions.map(page => (
                        <PageButton key={page} className={pageIndex === page ? 'active' : ''} onClick={() => gotoPage(page)}>
                            {page}
                        </PageButton>
                   )
                    )}
                </Box>
            </Flex>
        </Box>
        </>
    )

}