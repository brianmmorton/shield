import React, { Component } from 'react';
import { Link, } from 'react-router-dom';

export default class Home extends Component {
  render () {
    return (
      <div>
        <h2>Welcome home!</h2>
        <br />
        <Link to='login'>Login to see todos</Link>
      </div>
    )
  }
}
