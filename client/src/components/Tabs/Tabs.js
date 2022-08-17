import React from 'react';
import { uid } from 'react-uid';
import './Tabs.css';

class Tabs extends React.Component {
  state = {
    currentTab: this.props.tabs.find((tab) => tab.active).label
  };

  switchTabs(e, tabName) {
    this.setState({
      currentTab: tabName
    });
    this.props.onTabClick(e, tabName);
  }

  render() {
    const { tabs } = this.props;
    const { currentTab } = this.state;

    return (
      <div id="profile-tabs">
        <ul>
          {tabs.map((tab, index) => (
            <li
              key={uid(tab, index)}
              onClick={(e) => this.switchTabs(e, tab.label)}
              className={currentTab === tab.label ? 'active' : ''}>
              {tab.label}
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

export default Tabs;
