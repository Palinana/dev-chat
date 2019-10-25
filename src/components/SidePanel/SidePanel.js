import React, { Component } from 'react';
import { Menu } from 'semantic-ui-react';
import UserPanel from './UserPanel';
import Channels from './Channels';

import './SidePanel.css';

class SidePanel extends Component {
    render() {
        const { currentUser } = this.props;

        return (
            // <Menu size="large" inverted fixed="left" vertical style={{ background: '#4c3c4c' }}>
            //     <UserPanel currentUser={currentUser}/>
            // </Menu>
            <div className="side-panel">
                <UserPanel currentUser={currentUser}/>
                <Channels currentUser={currentUser}/>
            </div>
        )
    }
}
  
export default SidePanel;