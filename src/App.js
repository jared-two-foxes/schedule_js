import React, { Component } from 'react';
import logo from './logo.svg';
import queryString from "query-string";

import OpportunitiesHOC from "./OpportunitiesHOC";

import './App.scss';

class App extends Component {
  constructor(props) {
    super(props);
    // this.state = {
    //   authorized: false
    // }
  }

  componentDidMount() {
      // var query = queryString.parse(window.location.search);
      // if (query.token) {
      //   this.setState({ ...this.state, authorized: true });
      // }
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <a className="App-link" href="http://localhost:3000/auth/current" >
            Log In
          </a>
        </header>
        {/* { this.state.authorized && <OpportunitiesHOC /> } */}
        <OpportunitiesHOC />
      </div>
    );
  }
}

export default App;
