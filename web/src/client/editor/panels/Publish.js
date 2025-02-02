import { useState } from 'react';

import { useData } from '@data';

import Form from '../components/Form';
import Button from '../components/Button';
import Message from '../components/Message';

const { ENV_NAME } = global.env;

export default function Publish() {
  const { publish, canPublish } = useData();

  const [version, setVersion] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState(null);

  async function onSubmit() {
    setError(null);
    try {
      if (!version) {
        throw new Error('Version name is required.');
      }
      setLoading(true);
      await publish(version);
      setMessage(getPublishedMessage());
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  }

  function getPublishedMessage() {
    if (ENV_NAME === 'development') {
      return 'Site published.';
    } else {
      return 'Site published. Deployment may take up to 5 minutes.';
    }
  }

  function renderMessage() {
    if (message) {
      return <Message success>{message}</Message>;
    } else if (!canPublish()) {
      return <Message>No changes to publish.</Message>;
    }
  }

  return (
    <Form
      onSubmit={onSubmit}
      error={error}
      loading={loading}
      disabled={!canPublish()}>
      {renderMessage()}
      <Form.Input label="Version Name" value={version} setValue={setVersion} />
      <Form.Actions>
        <Button small onClick={onSubmit}>
          Submit
        </Button>
      </Form.Actions>
    </Form>
  );
}
