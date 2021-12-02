import React, {useEffect} from 'react';
import Moment from 'react-moment';
import { useTable, usePagination } from 'react-table'
import {Box, Heading, Text, Flex} from "rebass";
import DatePicker from "react-datepicker";
import * as moment from 'moment';
import { PageButton, StyledTable } from './styled';

export const TableWrapper = ({data}) => {

    const [dateRange, setDateRange] = React.useState("");
    const [dateGain, setDateGain] = React.useState("");
    const [dividends, setDividends] = React.useState([]);
    const [previousDividends, setPreviousDividends] = React.useState([]);

    useEffect(() => {
        let newDate = data.map(item => {
            return {
                ...item,
                tokenValue: parseFloat(item.rawTokenValue).toFixed(3),
                dollarValue: parseFloat(item.rawDollarValue).toFixed(0),
                date: new Date(parseInt(item.timestamp)*1000).toLocaleDateString()
            }
        }).sort((a,b) => {return new Date(parseInt(b.timestamp)*1000) - new Date(parseInt(a.timestamp)*1000)});
        setDividends(newDate);
        setPreviousDividends(newDate);
    }, [])
    
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
                    accessor: 'tokenValue',
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
        pageOptions,
        gotoPage,
        state: { pageIndex },
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
            return row;
        })
        setDividends(filteredData)
        setDateGain(dateGain.toFixed(2))
    }

    return(
        <>
        <Box mb={3}>
            <Heading mb={2} fontFamily={'DM Sans'} fontSize={[2, 4]} color="white">Filter by date</Heading>
            <Box alignItems="center" display="inline-flex">
                <DatePicker id="datePicker" placeholderText="YYYY/MM/DD" dateFormat="yyyy/MM/dd"
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
                        return <td {...cell.getCellProps()}>{cell.render('Cell')} {(cell.column.Header === 'Rewards' && '$') || (cell.column.Header === 'Tokens' && 'BNB')}</td>
                    })}
                </tr>
                )
            })}
            </tbody>
        </StyledTable>
        <Box mt={4}>
            <Flex justifyContent="center">
                <Box>
                   {pageOptions.map((page, i) => (
                        <PageButton id={`pagination-${i}`}  key={page} className={pageIndex === page ? 'active' : ''} onClick={() => gotoPage(page)}>
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