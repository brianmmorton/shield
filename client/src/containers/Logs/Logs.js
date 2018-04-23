import React, { Component } from 'react';
import moment from 'moment';
import { Spinner } from 'components';
import { Table } from 'reactstrap';

export default class Logs extends Component {

  componentWillMount () {
    this.props.fetchLogs();
  }

  render () {
    const { logs, } = this.props;
    console.log(logs.data);
    return (
      <div style={{ width: '100%', textAlign: 'center', paddingTop: 20 }}>
        {logs.loading && <Spinner text='Loading logs...' />}
        <Table>
          <thead>
            <tr>
              <th>Log Id</th>
              <th>Device Id</th>
              <th>Device Type</th>
              <th>Start</th>
              <th>End</th>
              <th>Attachments</th>
            </tr>
          </thead>
          <tbody>
            {logs.data.map(log =>
              <tr key={log.id} style={{ margin: '0 auto' }}>
                <td>{log._id}</td>
                <td>{log.device._id}</td>
                <td>{log.device.type}</td>
                <td>{moment(log.start).format('ddd MMM Do, hh:mm:ss a')}</td>
                <td>{moment(log.end).format('ddd MMM Do, hh:mm:ss a')}</td>
                <td>{log.attachments.length} attachments</td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>
    )
  }
}
