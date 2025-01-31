import React from 'react';

import { DataContext } from '@stores/data';

import Icon from '@components/Icon';

import { canEdit } from '@utils/editor';

import SettingsPanel from './SettingsPanel';
import EditFieldModal from './EditFieldModal';
import EditCollectionModal from './EditCollectionModal';

import icons from './assets/icons.svg';

import './editor.less';

Icon.useSet(icons, 'editor');

export class Editor extends React.Component {
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
