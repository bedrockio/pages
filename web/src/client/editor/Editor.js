import React from 'react';

import { DataContext } from '@data';

import { canEdit } from '@utils/editor';

import Icon from '../components/Icon';

import SettingsPanel from './panels/Settings';
import EditFieldModal from './modals/EditFieldModal';
import EditCollectionModal from './modals/EditCollectionModal';

import icons from './assets/icons.svg';

import './editor.less';

Icon.useSet(icons, 'editor');

export default class Editor extends React.Component {
  static contextType = DataContext;

  constructor(props) {
    super(props);
    this.state = {
      settingsOpen: false,
    };
  }

  render() {
    if (!canEdit()) {
      return null;
    }
    return (
      <React.Fragment>
        <SettingsPanel />
        <EditFieldModal />
        <EditCollectionModal />
      </React.Fragment>
    );
  }
}
