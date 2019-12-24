import React, { Component } from 'react';
import ServicesHOC from "./ServicesHOC";

import { withStyles } from '@material-ui/core/styles';

import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import Link from '@material-ui/core/Link'
import IconButton from '@material-ui/core/IconButton'
import MenuIcon from '@material-ui/icons/Menu'

import './App.scss';

const useStyles = theme => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
});

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
    /*credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Credentials": true
      }*/

    fetch('/auth/login/success', { method: "GET" })
      .then(response => {
        if (response.status === 200) return response.json();
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
    const { classes } = this.props;
    const { authenticated } = this.state;
    return (
      <div className={classes.root}>
        <AppBar position="static">
          <Toolbar>
            <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" className={classes.title}>
              Scheduler
            </Typography>
            { authenticated ? 
              <Link color="inherit" href="/auth/logout">Log Out</Link> : 
              <Link color="inherit" href="/auth/current">Log In</Link> }
          </Toolbar>
        </AppBar>
        <ServicesHOC />
      </div>
    );
  }
}

export default withStyles(useStyles)(App);
