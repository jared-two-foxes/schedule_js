import React, { Component } from 'react';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import SimpleOpportunityTable from './SimpleOpportunityTable'

import 'react-day-picker/lib/style.css';

const SERIVCES_URL = 'http://localhost:3000/current/services';

class ServicesHOC extends Component {
    constructor(props) {
        super(props);
        this.state = {
            start: null,
            end: null,
            isFetching: false,
            items: []
        };
    }

    render() {

        const columns = [{
            dataField: 'id',
            text: 'ID'
        }, {
            dataField: 'opportunity_subject',
            text: 'Opportunity'
        }, {
            dataField: 'name',
            text: 'Name'
        }, {
            dataField: 'starts_at',
            text: 'Start'
        }, {
            dataField: 'ends_at',
            text: 'End'
        }];
        
        return (
            <div>
                <div style={{float: 'right'}}>
                    <div style={{float: 'left'}}>
                        <p>Please type a start date: </p>
                        <DayPickerInput onDayChange={day => this.setState({...this.state, start: day})} />
                    </div>
                    <div style={{float: 'left'}}>
                        <p>Please type an end date: </p>
                        <DayPickerInput onDayChange={day => this.setState({...this.state, end: day})} />
                    </div>
                </div>
                <div style={{clear: 'both'}}>
                    <SimpleOpportunityTable data = {this.state.items} columns={columns} isFetching = {this.state.isFetching} />
                </div>
            </div>
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
