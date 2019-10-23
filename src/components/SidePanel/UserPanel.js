import React, { Component } from 'react';
import { Grid, Header, Icon, Dropdown } from 'semantic-ui-react';
import firebase from '../../firebase';

class UserPanel extends Component {
    dropdownOprions = () => [
        {
            key: 'user',
            text: <span>Sign in as <strong>User</strong></span>,
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
        return (
            <Grid style={{ background: '#4c3c4c' }}>
                <Grid.Column>
                    <Grid.Row style={{ padding: '1.2em', margin: '0' }}>
                        <Header inverted fixed="left" as="h2">
                            <Icon name="code"/>
                            DevChat
                        </Header>
                    </Grid.Row>
                    <Header inverted fixed="left" as="h4" style={{ padding: '1.5em', margin: '0' }}>
                        <Dropdown trigger={
                            <span>User</span>
                        } options={this.dropdownOprions()}/>
                    </Header>
                </Grid.Column>
            </Grid>
        )
    }
}
  
export default UserPanel;
