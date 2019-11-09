import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Grid, Form, Segment, Button, Header, Message, Icon } from 'semantic-ui-react';

import SidePanel from '../SidePanel/SidePanel';
import SideMenu from '../SidePanel/SideMenu/SideMenu';
import Messages from '../Messages/Messages';

import './Chat.css';

class Chat extends Component {
    state = {
        menuActive: false
    }

    handleMenu = () => {
        this.setState({ menuActive: !this.state.menuActive });
    }
    
    render() {
        const { menuActive } = this.state;
        const { currentUser, currentChannel, isPrivateChannel } = this.props;

        return (
            <div className="chat">
                { menuActive ? 
                    <SideMenu currentUser={currentUser} handleMenu={this.handleMenu} key={currentUser && currentUser.id}/> :
                    <SidePanel currentUser={currentUser} key={currentUser && currentUser.id}/>
                }
                <Messages 
                    currentChannel={currentChannel} 
                    currentUser={currentUser} key={currentUser && currentUser.id}
                    key={currentChannel && currentChannel.id}
                    isPrivateChannel={isPrivateChannel}
                    handleMenu={this.handleMenu}
                />
            </div>
        )
    }
}

const mapState = state => {
    return {
        currentUser: state.user,
        currentChannel: state.channels.currentChannel,
        isPrivateChannel: state.channels.isPrivateChannel
    }
}

export default connect(mapState, null)(Chat);
