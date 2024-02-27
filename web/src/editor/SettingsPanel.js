import React from 'react';

import { DataContext } from 'stores/data';

import Modal from 'components/Modal';
import Button from 'components/Button';
import Icon from 'components/Icon';
import Tab from 'components/Tab';

import bem from 'utils/bem';

import Trigger from './Trigger';
import Pages from './Pages';
import Publish from './Publish';
import Revert from './Revert';

import './settings-panel.less';

@bem
export default class SettingsPanel extends React.Component {
  static contextType = DataContext;

  constructor(props) {
    super(props);
    this.state = {
      focusedTrigger: null,
    };
  }

  toggle = () => {
    this.setState({
      open: !this.state.open,
    });
  };

  onDiscardClick = async () => {
    await this.context.reset();
    this.setState({
      open: false,
    });
  };

  onLogoutClick = () => {
    localStorage.clear();
    document.location = '/';
  };

  onTriggerEnter = (name) => {
    this.setState({
      focusedTrigger: name,
    });
  };

  onTriggerLeave = () => {
    this.setState({
      focusedTrigger: null,
    });
  };

  onClose = () => {
    this.setState({
      open: false,
    });
  };

  render() {
    const { open } = this.state;
    if (open) {
      return this.renderPanel();
    } else {
      return this.renderTrigger();
    }
  }

  renderPanel() {
    const { open } = this.state;
    return (
      <Modal
        open={open}
        onClose={this.onClose}
        className={this.getBlockClass()}>
        <Modal.Content style={{ minHeight: '250px' }}>
          <Tab>
            <Tab.Pane title="Pages">
              <Pages />
            </Tab.Pane>
            <Tab.Pane title="Publish">
              <Publish />
            </Tab.Pane>
            <Tab.Pane title="Revert">
              <Revert />
            </Tab.Pane>
          </Tab>
        </Modal.Content>
        <Modal.Actions>
          <div
            className={this.getElementClass('triggers')}
            onMouseLeave={this.onTriggerLeave}>
            <Trigger
              name="Discard Changes"
              icon={<Icon name="trash editor" small />}
              onEnter={this.onTriggerEnter}
              onClick={this.onDiscardClick}
            />
            <Trigger
              name="Logout"
              icon={<Icon name="logout editor" small />}
              onEnter={this.onTriggerEnter}
              onClick={this.onLogoutClick}
            />
            {this.renderFocusedTrigger()}
          </div>
          <Button onClick={this.onClose} primary>
            Done
          </Button>
        </Modal.Actions>
      </Modal>
    );
  }

  renderTrigger() {
    return (
      <div className={this.getElementClass('trigger')} onClick={this.toggle}>
        <Icon name="settings editor" />
      </div>
    );
  }

  renderFocusedTrigger() {
    const { focusedTrigger } = this.state;
    return <div className="trigger-label">{focusedTrigger}</div>;
  }
}
