import React, { Component } from 'react';
import SimpleOpportunityTable from './SimpleOpportunityTable'

const SERIVCES_URL = 'http://localhost:3000/current/services';

class ServicesHOC extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isFetching: false,
            items: []
        };
    }

    render() {

        const columns = [{
            dataField: 'id',
            text: 'ID'
        }, {
            dataField: 'name',
            text: 'Name'
        }, {
            dataField: 'opportunity_name',
            text: 'Opportunity'
        }, {
            dataField: 'starts_at',
            text: 'Start'
        }, {
            dataField: 'ends_at',
            text: 'End'
        }];
        
        return (
            <SimpleOpportunityTable data = {this.state.items} columns={columns} isFetching = {this.state.isFetching} />
        )
    };

    componentDidMount() {
        this.fetchUsers();
    }

    fetchUsers() {
        this.setState({...this.state, isFetching: true});
        fetch(SERIVCES_URL, { method: 'GET' })
            .then(response => response.json())
            .then(result => {
                console.log( result );
                this.setState({items: result, isFetching: false});
            })
            .catch( e => { 
                console.log(e);
                this.setState({...this.state, isFetching: false});
            });
    }
}

export default ServicesHOC;
