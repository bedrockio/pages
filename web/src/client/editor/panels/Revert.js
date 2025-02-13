import { useState, useEffect } from 'react';

import { useData } from '@data';

import { formatDate } from '@utils/date';
import { request } from '@utils/api';

import Form from '../components/Form';
import Button from '../components/Button';
import Message from '../components/Message';

export default function Revert() {
  const { loadVersions } = useData();

  const [message, setMessage] = useState('');

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(null);
  const [versions, setVersions] = useState([]);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    try {
      setError(null);
      setLoading(true);

      const versions = await loadVersions();

      const selected = versions.find((version) => {
        return version.current;
      });

      setVersions(versions);
      setSelected(selected);
      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  }

  function onVersionChange({ value }) {
    setSelected(
      versions.find((version) => {
        return version.name === value;
      }),
    );
  }

  async function onSubmit() {
    try {
      if (selected.current) {
        throw new Error('Version is already current.');
      }
      setMessage('');
      setError(null);
      setLoading(true);
      await request({
        method: 'POST',
        path: '/1/site/revert',
        body: {
          version: selected.name,
        },
      });
      setLoading(false);
      setMessage('Successfully reverted version.');
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  }

  function render() {
    return (
      <Form error={error} loading={loading} onSubmit={onSubmit}>
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
          onChange={onVersionChange}
        />
        <div style={{ marginTop: '-1.2rem' }}>
          <b>Published:</b> {selected ? formatDate(selected.publishedAt) : '-'}
        </div>
        <Form.Actions>
          <Button small disabled={!selected} onClick={onSubmit}>
            Submit
          </Button>
        </Form.Actions>
      </Form>
    );
  }

  return render();
}
