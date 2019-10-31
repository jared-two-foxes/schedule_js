import React, { Component } from 'react';
import SimpleOpportunityTable from './SimpleOpportunityTable'

//const OPPORTUNITIES_SERIVCE_URL = 'http://localhost:3000/opportunities'
const OPPORTUNITIES_SERIVCE_URL = 'https://api.current-rms.com/api/v1/opportunities';

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
        //this.timer = setInterval(()=> this.fetchUsers(), 5000); // five seconds
    }

    fetchUsers() {
        this.setState({...this.state, isFetching: true});
        fetch(OPPORTUNITIES_SERIVCE_URL)
            .then(response => response.json())
            .then(result => {
                this.state({items: result, isFetching: false});
            })
            .catch( e => { 
                console.log(e);
                this.setState({...this.state, isFetching: false});
            });
    }
}

export default OpportunityHOC;
