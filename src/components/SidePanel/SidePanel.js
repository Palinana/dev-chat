import React, { Component } from 'react';
import { Menu } from 'semantic-ui-react';
import UserPanel from './UserPanel/UserPanel';
import Channels from './Channels/Channels';
import DirectMessages from './DirectMessages/DirectMessages';
import Starred from './Starred/Starred';

import './SidePanel.css';

class SidePanel extends Component {
    state = {
        activeChannel: ''
    }

    setActiveChannel = channel => {
        this.setState({ activeChannel: channel });
    }

    render() {
        const { currentUser } = this.props;

        return (
            <div className="side-panel">
                <UserPanel currentUser={currentUser}/>
                <Channels currentUser={currentUser} activeChannel={this.state.activeChannel} setActiveChannel={this.setActiveChannel}/>
                <Starred currentUser={currentUser} />
                <DirectMessages currentUser={currentUser} activeChannel={this.state.activeChannel} setActiveChannel={this.setActiveChannel}/>
            </div>
        )
    }
}
  
export default SidePanel;