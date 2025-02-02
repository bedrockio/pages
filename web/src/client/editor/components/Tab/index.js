import React, { Children } from 'react';

import bem from '@utils/bem';

import Pane from './Pane';

import './tab.less';

class Tab extends React.Component {
  static name = 'EditorTab';

  constructor(props) {
    super(props);
    this.state = {
      active: props.active || 0,
    };
  }

  getElements() {
    return Children.toArray(this.props.children);
  }

  render() {
    return (
      <div className={this.getBlockClass()}>
        {this.renderMenu()}
        {this.renderActivePane()}
      </div>
    );
  }

  renderMenu() {
    const { active } = this.state;
    return (
      <div className={this.getElementClass('menu')}>
        {this.getElements().map((el, i) => {
          const isActive = active === i;
          return (
            <div
              className={this.getElementClass(
                'menu-item',
                isActive ? 'active' : null,
              )}
              onClick={() => {
                this.setState({
                  active: i,
                });
              }}
              key={el.key}>
              {' '}
              {el.props.title}
            </div>
          );
        })}
        <div className={this.getElementClass('menu-spacer')} />
      </div>
    );
  }

  renderActivePane() {
    const { active } = this.state;
    const elements = this.getElements();
    const pane = elements[active];
    if (pane) {
      return (
        <div className={this.getElementClass('pane')}>
          {pane.props.children}
        </div>
      );
    }
  }
}

Tab.Pane = Pane;

export default bem(Tab);
