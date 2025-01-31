import React from 'react';

import Form from '@components/Form';
import Button from '@components/Button';
import Message from '@components/Message';

import { request } from '@utils/api';
import { formatDate } from '@utils/date';

export default class Revert extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      message: '',
      error: null,
      loading: false,
      selected: null,
      versions: [],
    };
  }

  componentDidMount() {
    this.loadVersions();
  }

  loadVersions = async () => {
    try {
      this.setState({
        error: null,
        loading: true,
      });
      const { data: versions } = await request({
        method: 'GET',
        path: '/1/site/versions',
      });

      const selected = versions.find((version) => {
        return version.current;
      });

      this.setState({
        versions,
        selected,
        loading: false,
      });
    } catch (error) {
      this.setState({
        error,
        loading: false,
      });
    }
  };

  onVersionChange = ({ value }) => {
    const { versions } = this.state;
    this.setState({
      selected: versions.find((version) => {
        return version.name === value;
      }),
    });
  };

  onSubmit = async () => {
    try {
      const { selected } = this.state;
      if (selected.current) {
        throw new Error('Version is already current.');
      }
      this.setState({
        message: '',
        error: null,
        loading: true,
      });
      await request({
        method: 'POST',
        path: '/1/site/revert',
        body: {
          version: selected.name,
        },
      });
      this.setState({
        loading: false,
        message: 'Successfully reverted version.',
      });
    } catch (error) {
      this.setState({
        error,
        loading: false,
      });
    }
  };

  render() {
    const { loading, error, message, selected, versions } = this.state;
    return (
      <Form error={error} loading={loading} onSubmit={this.onSubmit}>
        {message && <Message success>{message}</Message>}
        <Form.Select
          label="Version"
          value={selected?.name}
          options={versions.map((version) => {
            const { name, current } = version;
            const label = current ? `${name} - current` : name;
            return {
              label: label,
              value: name,
            };
          })}
          onChange={this.onVersionChange}
        />
        <div>
          <b>Published:</b> {selected ? formatDate(selected.publishedAt) : '-'}
        </div>
        <Form.Actions>
          <Button small disabled={!selected} onClick={this.onSubmit}>
            Submit
          </Button>
        </Form.Actions>
      </Form>
    );
  }
}
