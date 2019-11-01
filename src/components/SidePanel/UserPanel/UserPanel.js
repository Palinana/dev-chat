import React, { Component } from 'react';
import { Grid, Header, Icon, Dropdown, Image } from 'semantic-ui-react';
import firebase from '../../../firebase';

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
