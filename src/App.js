import React, { Component } from 'react';
import logo from './logo.svg';
import ServicesHOC from "./ServicesHOC";

import './App.scss';

class App extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      user: {},
      error: null,
      authenticated: false
    };
  }

  componentDidMount() {
    fetch('http://localhost:3000/auth/login/success', {
      method: "GET",
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Credentials": true
      }
    })
      .then(response => {
        if (response.status == 200) return response.json();
        throw new Error("failed to authenticate user");
      })
      .then(responseJson => {
        this.setState({
          authenticated: true, 
          user: responseJson.user
        })
      })
      .catch(error => {
        this.setState({
          authenticated: false,
          error: "Failed to authenticate user"
        })
      });
  }

  // updateOpportunity() {
  //   console.log('updating the task!');
  //   fetch('http://localhost:3000/updateTask', { method: 'PUT' })
  //     .then(response => { 
  //       console.log(response); 
  //     })
  //     .catch( e => {          
  //       console.log(e);
  //     });
  // }

  render() {
    const { authenticated } = this.state;
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          { !authenticated && <a className="App-link" href="http://localhost:3000/auth/current" > Log In </a> }
          { authenticated && <a className="App-link" href="http://localhost:3000/auth/logout" > Log Out </a> }
        </header>
        {/* <div>
          <button className="link" onClick={this.updateOpportunity}>
              Update
          </button>
        </div> */}
        <div><ServicesHOC /></div>
      </div>
    );
  }
}

export default App;
