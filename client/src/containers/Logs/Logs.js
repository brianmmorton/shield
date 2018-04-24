import React, { Component } from 'react';
import moment from 'moment';
import qs from 'query-string';
import { Table, DatePicker, Select, Spin, InputNumber, } from 'antd';

import { Spinner } from 'components';

export default class Logs extends Component {

  componentWillMount () {
    this._fetch();
  }

  componentWillReceiveProps (props) {
    if (props.location.search !== this.props.location.search) {
      this._fetch(props);
    }
  }

  _fetch (props = this.props) {
    const query = qs.parse(props.location.search);
    this.props.fetchLogs(query);
  }

  render () {
    const { logs, location, history, } = this.props;
    const query = qs.parse(location.search);

    return (
      <div style={{ width: '100%', padding: 20 }}>
        <div style={{ marginBottom: 15, display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: 900 }}>
          <DatePicker
            placeholder='Start Time'
            disabled={logs.loading}
            value={moment(query.start)}
            format='ddd MMM Do, hh:mm:ss a'
            style={{ width: 300 }}
            onChange={date => history.push({
              pathname: location.pathname,
              search: qs.stringify({ ...query, start: date.utc().format(), })
            })}
          />
          <DatePicker
            placeholder='End Time'
            disabled={logs.loading}
            value={moment(query.end)}
            format='ddd MMM Do, hh:mm:ss a'
            style={{ width: 300 }}
            onChange={date => history.push({
              pathname: location.pathname,
              search: qs.stringify({ ...query, end: date.utc().format(), })
            })}
          />
          <Select
            style={{ width: 80 }}
            placeholder='Generation'
            value={query.generation}
            onChange={generation => history.push({
              pathname: location.pathname,
              search: qs.stringify({ ...query, generation, })
            })}
          >
            {Array.apply(null, { length: 100 }).map((d, i) =>
              <Select.Option key={i + ''}>{i}</Select.Option>
            )}
          </Select>
          <InputNumber
            min={0}
            max={29}
            placeholder='Min Duration'
            value={query.min_duration}
            onChange={min_duration => history.push({
              pathname: location.pathname,
              search: qs.stringify({ ...query, min_duration, })
            })}
          />
          <InputNumber
            min={1}
            max={30}
            placeholder='Max Duration'
            value={query.max_duration}
            onChange={max_duration => history.push({
              pathname: location.pathname,
              search: qs.stringify({ ...query, max_duration, })
            })}
          />
        </div>
        <Spin spinning={logs.loading}>
          <Table
            expandedRowRender={log =>
              log.attachments.map((attachment, index) =>
                <div key={attachment.url} style={{ padding: 6 }}>
                  {index + 1}. <a href={attachment.url} target='_blank'>{attachment.filename}</a>
                </div>
              )
            }
            columns={[
              {
                title: 'Log Id',
                dataIndex: '_id',
                key: '_id',
              },
              {
                title: 'Device Id',
                dataIndex: 'device.id',
                key: 'device.id',
              },
              {
                title: 'Generation',
                dataIndex: 'device.generation',
                key: 'device.generation',
              },
              {
                title: 'Start',
                dataIndex: 'start',
                key: 'start',
                render: d => moment(d).format('ddd MMM Do, hh:mm:ss a')
              },
              {
                title: 'End',
                dataIndex: 'end',
                key: 'end',
                render: d => moment(d).format('ddd MMM Do, hh:mm:ss a')
              },
              {
                title: 'Duration',
                dataIndex: 'duration',
                key: 'duration',
                render: d => `${Math.round(d / 60)} min`
              },
              {
                title: 'Attachments',
                dataIndex: 'attachments.length',
                key: 'attachments.length',
              },
            ]}
            dataSource={logs.data}
          />
        </Spin>
      </div>
    )
  }
}
