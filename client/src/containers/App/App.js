import React, { Component } from 'react';
import './App.css';
import { BrowserRouter as Router, Link, } from 'react-router-dom';
import { Spinner } from 'components';

export default class App extends Component {

  componentWillMount () {
    this.props.fetchUser();
  }

  render() {
    const { user } = this.props;

    if (user.loading) {
      return (
        <div className="App">
          <Spinner />
        </div>
      )
    }

    return (
      <Router>
        <div className="App">
          <header className="App-header">
            <div className="App-title">Logs</div>
          </header>
          {this.props.routes}
        </div>
      </Router>
    );
  }
}
