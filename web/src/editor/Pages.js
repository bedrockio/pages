import React from 'react';

import { DataContext } from '@stores/data';

import Form from '@components/Form';
import Icon from '@components/Icon';
import Message from '@components/Message';

const PAGE_TYPES = [
  {
    label: 'Article',
    value: 'article',
  },
  {
    label: 'Legal',
    value: 'legal',
  },
];

export default class Pages extends React.Component {
  static contextType = DataContext;

  constructor(props) {
    super(props);
    this.state = {
      selected: null,
      error: null,
      loading: false,
      message: '',
    };
  }

  onPageChange = ({ index }) => {
    const { pages } = this.context;
    this.setState({
      message: '',
      selectedIndex: index,
      selected: pages[index],
    });
  };

  onAddClick = () => {
    this.setState({
      message: '',
      selected: {},
    });
  };

  onRemoveClick = () => {
    const { selectedIndex } = this.state;
    this.context.removePage(selectedIndex);
    this.setState({
      message: 'Page removed.',
      selected: null,
    });
  };

  onCancelClick = () => {
    this.setState({
      message: '',
      selected: null,
    });
  };

  setField = ({ name, value }) => {
    this.setState({
      selected: {
        ...this.state.selected,
        [name]: value,
      },
    });
  };

  onSubmit = async () => {
    const { selectedIndex, selected } = this.state;
    const { pages } = this.context;
    try {
      this.setState({
        error: null,
        message: '',
      });
      if (!selected.name) {
        throw new Error('Name required.');
      } else if (!selected.type) {
        throw new Error('Type required.');
      } else if (!selected.path) {
        throw new Error('Path required.');
      } else if (!selected.path.startsWith('/')) {
        throw new Error('Path must start with a slash.');
      }
      if (selectedIndex != null) {
        this.context.updatePage(selectedIndex, selected);
        this.setState({
          selected: null,
          message: 'Updated page.',
          selectedIndex: null,
        });
      } else {
        const existing = pages.find((page) => {
          return page.name === selected.name;
        });
        if (existing) {
          throw new Error('A page with that name already exists.');
        }
        this.context.addPage(selected);
        this.setState({
          selected: null,
          message: 'Added new page.',
        });
      }
    } catch (error) {
      this.setState({
        error,
      });
    }
  };

  render() {
    const { loading } = this.state;
    return (
      <Form loading={loading} onSubmit={this.onSubmit}>
        {this.renderError()}
        {this.renderMessage()}
        {this.renderSelector()}
        {this.renderSelected()}
        {this.renderActions()}
      </Form>
    );
  }

  renderSelector() {
    const { selected } = this.state;
    const { pages } = this.context;
    if (!selected) {
      return (
        <Form.Select
          label="Pages"
          options={pages.map((page) => {
            const { name } = page;
            return {
              label: name,
              value: name,
            };
          })}
          onChange={this.onPageChange}
        />
      );
    }
  }

  renderSelected() {
    const { selected } = this.state;
    if (selected) {
      return (
        <React.Fragment>
          <Form.Input
            name="name"
            label="Name"
            value={selected.name}
            onChange={this.setField}
            autoFocus
          />
          <Form.Input
            name="path"
            label="Path"
            value={selected.path}
            onChange={this.setField}
          />
          <Form.Select
            name="type"
            label="Type"
            options={PAGE_TYPES}
            value={selected.type}
            onChange={this.setField}
          />
          <Form.Toggle
            name="nav"
            label="Show in Nav"
            value={selected.nav}
            onChange={this.setField}
          />
        </React.Fragment>
      );
    }
  }

  renderMessage() {
    const { message } = this.state;
    if (message) {
      return <Message success>{message}</Message>;
    }
  }

  renderError() {
    const { error } = this.state;
    if (error) {
      return <Message error>{error.message}</Message>;
    }
  }

  renderActions() {
    const { selected, selectedIndex } = this.state;
    if (selected) {
      return (
        <Form.Actions>
          {selectedIndex != null && (
            <Form.Actions left>
              <Form.Button small negative onClick={this.onRemoveClick}>
                <Icon name="trash editor" />
              </Form.Button>
            </Form.Actions>
          )}
          <Form.Button small onClick={this.onCancelClick}>
            Cancel
          </Form.Button>
          <Form.Button submit small primary>
            Submit
          </Form.Button>
        </Form.Actions>
      );
    } else {
      return (
        <Form.Actions>
          <Form.Button small onClick={this.onAddClick}>
            Add
          </Form.Button>
        </Form.Actions>
      );
    }
  }
}
