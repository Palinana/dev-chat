import React, { Component } from 'react';
import { Grid, Header, Icon, Dropdown, Image } from 'semantic-ui-react';
import firebase from '../../firebase';

import './UserPanel.css';

class UserPanel extends Component {
    state = {
        user: this.props.currentUser
    }

    dropdownOprions = () => [
        {
            key: 'user',
            text: <span>Sign in as <strong>{this.state.user.displayName}</strong></span>,
            disable: true
        },
        {
            key: 'avatar',
            text: <span>Change Avatar</span>
        },
        {
            key: 'logout',
            text: <span onClick={this.handleLogout}>Logout</span>
        }
    ]

    handleLogout = () => {
        firebase.auth().signOut()
            .then()
    }

    render() {
        const { user } = this.state;
        return (
            // <Grid style={{ background: '#4c3c4c' }}>
            //     <Grid.Column>
            //         <Grid.Row style={{ padding: '1.2em', margin: '0' }}>
            //             <Header inverted fixed="left" as="h2">
            //                 <Icon name="code"/>
            //                 DevChat
            //             </Header>
            //         </Grid.Row>
            //         <Header inverted fixed="left" as="h4" style={{ padding: '1.5em', margin: '0' }}>
            //             <Dropdown 
            //                 trigger={
            //                     <span>
            //                         <Image src={user.photoURL} spaced="right" avatar/>
            //                         {user.displayName}
            //                     </span>
            //                 } 
            //                 options={this.dropdownOprions()}/>
            //         </Header>
            //     </Grid.Column>
            // </Grid>
            <div className="user-panel">
                <h1 className="user-panel__title">DevChat</h1>
                <Dropdown 
                    trigger={
                        <span className="user-panel__user">
                            <Image src={user.photoURL} spaced="right" avatar/>
                            {user.displayName}
                        </span>
                    } 
                    options={this.dropdownOprions()}
                    className="user-panel__toggle"
                />
            </div>
        )
    }
}

export default UserPanel;
