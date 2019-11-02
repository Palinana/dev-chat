import React, { Component } from 'react';
import { Icon } from 'semantic-ui-react';

import { connect } from 'react-redux';
import { setCurrentChannel, setPrivateChannel } from '../../../store';

import firebase from '../../../firebase';

import './DirectMessages.css';

class DirectMessages extends Component {
    state = {
        user: this.props.currentUser,
        users: [],
        usersRef: firebase.database().ref('users'),
        connectedRef: firebase.database().ref('.info/connected'),
        presenceRef: firebase.database().ref('resence'),
    }

    componentDidMount() {
        if(this.state.user) {
            this.addListeners(this.state.user.uid);
        }
    }

    addListeners = currentUserUid => {
        let loadedUsers = [];
        this.state.usersRef.on('child_added', snap => {
            if(currentUserUid !== snap.key) {
                let user = snap.val();
                user['uid'] = snap.key;
                user['status'] = 'offline';
                loadedUsers.push(user);
                this.setState({ users: loadedUsers });
            }

            this.state.connectedRef.on('value', snap => {
                if(snap.val() === true) {
                    const ref = this.state.presenceRef.child(currentUserUid);
                    ref.set(true);
                    ref.onDisconnect().remove(err => {
                        if(err !== null) {
                            console.log(err)
                        }
                    });
                }
            });
        });

        this.state.presenceRef.on('child_added', snap => {
            if(currentUserUid !== snap.key) {
                this.addStatusToUser(snap.key);
            }
        })

        this.state.presenceRef.on('child_removed', snap => {
            if(currentUserUid !== snap.key) {
                this.addStatusToUser(snap.key, false);
            }
        })
    }

    addStatusToUser = (userId, connected = true) => {
        const updatedUsers = this.state.users.reduce((acc, user) => {
            if(user.uid === userId) {
                user['status'] = `${connected ? 'online' : 'offline'}`;
            }
            return acc.concat(user);
        }, []);
        this.setState({ users: updatedUsers });
    }

    isUserOnline = user => user.status === 'online';

    changeChannel = user => {
        const channelId = this.getChannelId(user.uid);
        const channelData = {
            id: channelId,
            name: user.name
        };
        this.props.setCurrentChannel(channelData);
        this.props.setPrivateChannel(true);
    }

    getChannelId = userId => {
        const currentUserId = this.state.user.uid;
        // creating unique channel id
        return userId < currentUserId ? 
            `${userId}/${currentUserId}` :
            `${currentUserId}/${userId}`;
    }

    render() {
        const { users } = this.state;

        return (
            <div className="direct-messages">
                <div className="direct-messages__header">
                    <span className="direct-messages__header--title"><i className="fa fa-envelope" aria-hidden="true"></i>DIRECT MESSAGES ({ users.length })</span>
                </div>

                <ul className="direct-message">
                    {
                        users.length && users.map((user, ind) => {
                            return (
                                <li className="direct-messages__username"
                                    key={ind}
                                    onClick={() => this.changeChannel(user)}
                                >
                                <span className="username">@ {user.name}</span>
                                {
                                    this.isUserOnline(user) ?
                                        <i className="fas fa-circle"></i> :
                                        <i className="far fa-circle"></i>
                                }
                                </li>
                            )
                        })
                    }
                </ul>
            </div>
        )
    }
}

const mapDispatch = dispatch => {
    return {
        setCurrentChannel(channel) {
            dispatch(setCurrentChannel(channel));
        },
        setPrivateChannel(state) {
            dispatch(setPrivateChannel(state));
        }
    }
}
  
export default connect(null, mapDispatch)(DirectMessages);
