import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Modal, Form, Input, Icon, Button } from 'semantic-ui-react';
import firebase from '../../../firebase';

import { setCurrentChannel, setPrivateChannel } from '../../../store';

import './Starred.css';

class Starred extends Component {
    state = {
        user: this.props.currentUser,
        usersRef: firebase.database().ref('users'),
        activeChannel: '',
        starredChannels: []
    }

    componentDidMount() {
        const { user } = this.state;

        if(user) {
            this.addListeners(user.uid);
        } 
    }

    addListeners = userId => {
        this.state.usersRef
            .child(userId)
            .child('starred')
            .on('child_added', snap => {
                const starredChannel = {id: snap.key, ...snap.val()};
                this.setState({
                    starredChannels: [...this.state.starredChannels, starredChannel]
                });
            });
        
        this.state.usersRef
            .child(userId)
            .child('starred')
            .on('child_removed', snap => {
                const channelToRemove = {id: snap.key, ...snap.val()};
                const filteredChannels = this.state.starredChannels.filter(channel => {
                    return channel.id !== channelToRemove.id; 
                });

                this.setState({ starredChannels: filteredChannels });
            });
    }

    setActiveChannel = channel => {
        this.setState({ activeChannel: channel.id });
    }

    changeChannel = channel => {
        this.setActiveChannel(channel)
        this.props.setCurrentChannel(channel);
        this.props.setPrivateChannel(false);
    }

    render() {
        const { starredChannels, activeChannel } = this.state;

        return (
            <div>
                <div className="starred__header">
                    <span className="starred__header--title"><i className="fa fa-star" aria-hidden="true"></i>STARRED ({ starredChannels.length })</span>
                </div>
                
                <ul className="starred-channels">
                    {
                        starredChannels.length && starredChannels.map((channel, ind) => {
                            return (
                                <li 
                                    className={
                                        channel.id === activeChannel 
                                        ? "starred-channel--active starred-channel"
                                        : "starred-channel"
                                    }
                                    key={ind}
                                    onClick={() => this.changeChannel(channel)}
                                >
                                # {channel.name}
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
        },
    }
}
  
export default connect(null, mapDispatch)(Starred);
