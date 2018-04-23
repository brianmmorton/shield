/* @flow */

import { compose } from 'recompose'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { login } from 'store/user'

import Login from './Login';

const mapStateToProps = ({ user, }) => ({ user, });

const mapActionsToProps = { login }

export default compose(
  connect(
    mapStateToProps,
    mapActionsToProps,
  ),
  withRouter
)(Login)
