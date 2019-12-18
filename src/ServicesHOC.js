import React, { Component } from 'react';
import { DateUtils } from 'react-day-picker';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import Button from '@material-ui/core/Button'
import SimpleOpportunityTable from './SimpleOpportunityTable'

import 'react-day-picker/lib/style.css';

const SERIVCES_URL = 'http://localhost:3000/tasks';

class ServicesHOC extends Component {
    constructor(props) {
        super(props);
        this.handleDayChange = this.handleDayChange.bind(this);
        this.handleResetClick = this.handleResetClick.bind(this);
        this.state = this.getInitialState();
    }

    getInitialState() {
        return {
            from: null,
            to: null,
            lastFetch: {
                from: null,
                to: null
            },
            isFetching: false,
            items: []
        }
    }

    handleDayChange(day) {
        // Store the original range
        const { from, to } = this.state;
        const range = DateUtils.addDayToRange(new Date(day), this.state);

        // Update if range differs.
        if ( range.from != from || range.to != to ) {
            this.setState({ ...this.state, ...range });
        }
    }

    handleResetClick() {
        this.setState(this.getInitialState());
    }

    render() {
        const { from, to, items } = this.state;

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
                    <p>
                        {!from && !to && 'Please select the first day.'}
                        {from && !to && 'Please select the last day.'}
                        {from && to && `Selected from ${from.toLocaleDateString()} to ${to.toLocaleDateString()}`}{' '}
                        {from && to && (
                            <Button className="link" onClick={this.handleResetClick}>
                                Reset
                            </Button>
                        )}
                    </p>
                    <div style={{float: 'left'}}>
                        <DayPickerInput onDayChange={this.handleDayChange} />
                    </div>
                    <div style={{float: 'left'}}>
                        <DayPickerInput onDayChange={this.handleDayChange} />
                    </div>
                </div>
                <div style={{clear: 'both'}}>
                    <SimpleOpportunityTable data = {items} columns={columns} isFetching = {this.state.isFetching} />
                </div>
            </div>
        )
    };

    componentDidUpdate() {
        const { from, to, lastFetch } = this.state;
        if ( from != lastFetch.from && to != lastFetch.to ) {
            this.fetchUsers();
        }
    }

    fetchUsers() {
        const { from, to } = this.state;

        this.setState({lastFetch: {from, to}, isFetching: true});

        let params = {};
        if ( from != null ) {
            params.startDate = from.getTime();
        }
        if ( to != null ) {
            params.endDate = to.getTime();
        }
        const paramString = new URLSearchParams(params);
            
        fetch(SERIVCES_URL + "?" + paramString.toString(), { method: 'GET' })
            .then(response => response.json())
            .then(result => {
                this.setState({items: result, isFetching: false});
            })
            .catch( e => { 
                console.log(e);
                this.setState({isFetching: false});
            });
    }
}

export default ServicesHOC;
