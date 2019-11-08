import React, { Component } from 'react';
import SimpleOpportunityTable from './SimpleOpportunityTable'

const OPPORTUNITIES_SERIVCE_URL = 'http://localhost:3000/current/opportunities';

class OpportunityHOC extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isFetching: false,
            items: []
        };
    }

    render() {
        return (
            <SimpleOpportunityTable data = {this.state.items} isFetching = {this.state.isFetching} />
        )
    };

    componentDidMount() {
        this.fetchUsers();
    }

    fetchUsers() {
        console.log( 'about to attempt to pull opportunities' );

        this.setState({...this.state, isFetching: true});
        fetch(OPPORTUNITIES_SERIVCE_URL, { method: 'GET' })
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

export default OpportunityHOC;
