import React from 'react'
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table-next'

//import '../css/Table.css'
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';

function rowClassNameFormat(row, rowIdx) {
    return rowIdx % 2 === 0 ? 'Gold-Row' : 'Silver-Row';
}

const SimpleOpportunityTable = (props) => {
    return (
        <div>
            {/* <BootstrapTable data={props.data} 
                            trClassName={rowClassNameFormat}>
                <TableHeaderColumn isKey dataField='id' />               
                <TableHeaderColumn dataField='name' />
                <TableHeaderColumn dataField='username' />
            </BootstrapTable> */}
            <p>{props.isFetching ? 'Fetching Opportunities...' : ''}</p>
        </div>
    )
};

export default SimpleOpportunityTable