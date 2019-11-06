import React, { Component } from 'react';
import { Menu } from 'semantic-ui-react';
import UserPanel from './UserPanel/UserPanel';
import Channels from './Channels/Channels';
import DirectMessages from './DirectMessages/DirectMessages';
import Starred from './Starred/Starred';

import './SidePanel.css';

class SidePanel extends Component {
    render() {
        const { currentUser } = this.props;

        return (
            <div className="side-panel">
                <UserPanel currentUser={currentUser}/>
                <Channels currentUser={currentUser}/>
                <Starred />
                <DirectMessages currentUser={currentUser}/>
            </div>
        )
    }
}
  
export default SidePanel;