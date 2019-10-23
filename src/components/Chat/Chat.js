import React, { Component } from 'react';
import { Grid, Form, Segment, Button, Header, Message, Icon } from 'semantic-ui-react';

import ColorPanel from '../ColorPanel/ColorPanel';
import SidePanel from '../SidePanel/SidePanel';
import Messages from '../Messages/Messages';

import './Chat.css';

class Chat extends Component {
    render() {
        return (
            <Grid columns="equal" className="chat">
                <ColorPanel />
                <SidePanel />
                <Grid.Column style={{marginLeft: 320}}>
                    <Messages />
                </Grid.Column>
            </Grid>
        )
    }
}

export default Chat;
