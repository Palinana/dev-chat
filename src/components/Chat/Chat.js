import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Grid, Form, Segment, Button, Header, Message, Icon } from 'semantic-ui-react';

import ColorPanel from '../ColorPanel/ColorPanel';
import SidePanel from '../SidePanel/SidePanel';
import Messages from '../Messages/Messages';

import './Chat.css';

const Chat = ({ currentUser, currentChannel, isPrivateChannel }) => (
    <div className="chat">
        <ColorPanel />
        <SidePanel currentUser={currentUser} key={currentUser && currentUser.id}/>
        <Messages 
            currentChannel={currentChannel} 
            currentUser={currentUser} key={currentUser && currentUser.id}
            key={currentChannel && currentChannel.id}
            isPrivateChannel={isPrivateChannel}
        />
    </div>
)

const mapState = state => {
    console.log(state)
    return {
        currentUser: state.user,
        currentChannel: state.channels.currentChannel,
        isPrivateChannel: state.channels.isPrivateChannel
    }
}

export default connect(mapState, null)(Chat);
