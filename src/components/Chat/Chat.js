import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Grid, Form, Segment, Button, Header, Message, Icon } from 'semantic-ui-react';

import ColorPanel from '../ColorPanel/ColorPanel';
import SidePanel from '../SidePanel/SidePanel';
import Messages from '../Messages/Messages';

import './Chat.css';

const Chat = ({ currentUser }) => (
    // <Grid columns="equal" className="chat">
    //     <ColorPanel />
    //     <SidePanel currentUser={currentUser}/>
    //     <Grid.Column style={{marginLeft: 320}}>
    //         <Messages />
    //     </Grid.Column>
    // </Grid>
    <div className="chat">
        <ColorPanel />
        <SidePanel currentUser={currentUser}/>
        <Messages />
    </div>
)

const mapState = state => {
    return {
        currentUser: state.user
    }
}

export default connect(mapState, null)(Chat);
