import React from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
// import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';

function rowClassNameFormat(row, rowIdx) {
    return rowIdx % 2 === 0 ? 'Gold-Row' : 'Silver-Row';
}

const SimpleOpportunityTable = ({data, isFetching }) => {
    
    const columns = [{
        dataField: 'id',
        text: 'ID'
    }, {
        dataField: 'subject',
        text: 'Subject'
    }];

    return (
        <div>
            <BootstrapTable keyField='id' data={ data } columns={ columns } />

            <p>{isFetching ? 'Fetching Opportunities...' : ''}</p>
        </div>
    )
};

export default SimpleOpportunityTable