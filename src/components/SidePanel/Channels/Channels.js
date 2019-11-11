import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Modal, Form, Input, Icon, Button } from 'semantic-ui-react';
import firebase from '../../../firebase';

import { setCurrentChannel, setPrivateChannel } from '../../../store';

import './Channels.css';

class Channels extends Component {
    state = {
        user: this.props.currentUser,
        channels: [],
        channel: null,
        channelName: '',
        channelDetails: '',
        modal: false,
        channelsRef: firebase.database().ref('channels'),
        messagesRef: firebase.database().ref('messages'),
        typingRef: firebase.database().ref('typing'),
        notifications: [],
        firstLoad: true
    }

    componentDidMount() {
        this.addListeners();
    }

    componentWillMount() {
        this.removeListners();
    }

    addListeners = () => {
        let loadedChannels = [];
        this.state.channelsRef.on('child_added', snap => {
            loadedChannels.push(snap.val());
            this.setState({ channels: loadedChannels }, () => this.setFirstChannel());
            this.addNotificationListener(snap.key);
        });
    }

    //listening for new messages added to any channels
    addNotificationListener = channelId => {
        this.state.messagesRef.child(channelId).on('value', snap => {
            if(this.state.channel) {
                this.handleNotifications(channelId, this.state.channel.id, this.state.notifications, snap);
            }
        });
    }

    handleNotifications  = (channelId, currentChannelId, notifications, snap) => {
        let lastTotal = 0;

        let index = notifications.findIndex(notification => notification.id === channelId);
        if(index !== -1) {
            if(channelId !== currentChannelId) {
                lastTotal = notifications[index].total;

                if(snap.numChildren() - lastTotal > 0) {
                    notifications[index].count = snap.numChildren() - lastTotal;
                }
            }
            notifications[index].lastKnownTotal = snap.numChildren();
        }
        else {
            notifications.push({
                id: channelId,
                total: snap.numChildren(),
                lastKnownTotal: snap.numChildren(),
                count: 0
            });
        }

        this.setState({ notifications });
    }

    setFirstChannel = () => {
        const firstChannel = this.state.channels[0];

        if(this.state.firstLoad && this.state.channels.length > 0) {
            this.props.setCurrentChannel(firstChannel);
            this.props.setActiveChannel(firstChannel.id);

            this.setState({ channel: firstChannel });
        }
        this.setState({ firstLoad: false });
    }

    removeListners = () => {
        this.state.channelsRef.off();
        this.state.channels.forEach(channel => {
            this.state.messagesRef.child(channel.id).off()
        })
    }

    openModal = () => this.setState({ modal: true });

    closeModal = () => this.setState({ modal: false });

    addChannel = () => {
        const { channelsRef, channelName, channelDetails, user } = this.state;

        const key = channelsRef.push().key;
        const newChannel = {
            id: key,
            name: channelName,
            details: channelDetails,
            createdBy: {
                name: user.displayName,
                avatar: user.photoURL
            }
        };

        channelsRef
            .child(key)
            .update(newChannel)
            .then(() => {
                this.setState({ channelName: '', channelDetails: '' });
                this.closeModal();
                console.log('added channel')
            })
            .catch(err => {
                console.log(err)
            })
    }

    changeChannel = channel => {
        this.props.setActiveChannel(channel.id);
        this.state.typingRef
            .child(this.state.channel.id)
            .child(this.state.user.uid)
            .remove()
        this.clearNotifications();
        this.props.setCurrentChannel(channel);
        this.props.setPrivateChannel(false);
        this.setState({ channel });
    }

    clearNotifications = () => {
        let index = this.state.notifications.findIndex(notification => notification.id === this.state.channel.id);

        if(index !== -1) {
            let updatedNotifications = [...this.state.notifications];
            updatedNotifications[index].total = this.state.notifications[index].lastKnownTotal;
            updatedNotifications[index].count = 0;
            this.setState({ notifications: updatedNotifications });
        }
    }

    getNotificationsCount = channel => {
        let count = 0;

        this.state.notifications.forEach(notification => {
            if(notification.id === channel.id) {
                count = notification.count;
            }
        });

        if(count > 0) return count;
    }

    handleChange = event => {
        this.setState({ [event.target.name]: event.target.value })
    }

    handleSubmit = event => {
        event.preventDefault();
        if(this.isFormValid(this.state)) {
            this.addChannel();
        }
    }

    isFormValid = ({ channelName, channelDetails }) => channelName && channelDetails;

    render() {
        const { channels, modal } = this.state;
        const {  activeChannel } = this.props;

        return (
            <React.Fragment>
                <div>
                    <div className="channels">
                        <span className="channels__title"><i className="fa fa-exchange" aria-hidden="true"></i>CHANNELS ({channels.length})</span>
                        <i className="fa fa-plus" onClick={this.openModal}></i>
                    </div>
                    
                    <ul className="channel">
                        {
                            channels.length > 0 && channels.map((channel, ind) => {
                                return (
                                    <li 
                                        className={
                                            channel.id === activeChannel 
                                            ? "channel--active channel__name"
                                            : "channel__name"
                                        }
                                        key={ind}
                                        onClick={() => this.changeChannel(channel)}
                                    >
                                    <span className="channel__name-name"># {channel.name}</span>
                                    {this.getNotificationsCount(channel) && (
                                        <div className="channel__name-notification">
                                            <span>{this.getNotificationsCount(channel)}</span>
                                        </div>
                                    )}
                                    </li>
                                )
                            })
                        }
                    </ul>
                </div>
                
                    <Modal basic open={modal} onClose={this.closeModal}>
                        <Modal.Header>Add a Channel</Modal.Header>
                        <Modal.Content>
                            <Form onSubmit={this.handleSubmit}>
                                <Form.Field>
                                    <Input 
                                        fluid 
                                        label="Name of Channel"
                                        name="channelName"
                                        onChange={this.handleChange}
                                        />
                                </Form.Field>

                                <Form.Field>
                                    <Input 
                                        fluid 
                                        label="About the Channel"
                                        name="channelDetails"
                                        onChange={this.handleChange}
                                        />
                                </Form.Field>
                            </Form>
                        </Modal.Content>
                        
                        <Modal.Actions>
                            <Button color='green' inverted onClick={this.handleSubmit}>
                                <Icon name='checkmark' /> Add
                            </Button>
                            <Button basic color='red' inverted onClick={this.closeModal}>
                                <Icon name='remove' /> Cancel
                            </Button>
                        </Modal.Actions>
                    </Modal>
            </React.Fragment>
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
  
export default connect(null, mapDispatch)(Channels);
