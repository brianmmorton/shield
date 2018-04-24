/* @flow */

import { compose } from 'recompose'
import { connect } from 'react-redux'
import { fetch as fetchLogs } from 'store/logs'
import { withRouter } from 'react-router'

import Logs from './Logs';

const mapStateToProps = ({ user, logs, }) => ({ user, logs, });

const mapActionsToProps = { fetchLogs, }

export default compose(
  connect(
    mapStateToProps,
    mapActionsToProps,
  ),
  withRouter
)(Logs)
