import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Modal, Form, Input, Icon, Button } from 'semantic-ui-react';
import firebase from '../../../firebase';

import { setCurrentChannel, setPrivateChannel } from '../../../store';

import './Channels.css';

class Channels extends Component {
    state = {
        user: this.props.currentUser,
        activeChannel: '',
        channels: [],
        channelName: '',
        channelDetails: '',
        modal: false,
        channelsRef: firebase.database().ref('channels'),
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
        });
    }

    setFirstChannel = () => {
        const firstChannel = this.state.channels[0];

        if(this.state.firstLoad && this.state.channels.length > 0) {
            this.props.setCurrentChannel(firstChannel);
            this.setActiveChannel(firstChannel);
        }
        this.setState({ firstLoad: false });
    }

    removeListners = () => {
        this.state.channelsRef.off();
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
        this.setActiveChannel(channel)
        this.props.setCurrentChannel(channel);
        this.props.setPrivateChannel(false);
    }

    setActiveChannel = channel => {
        this.setState({ activeChannel: channel.id });
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
        const { channels, modal, activeChannel } = this.state;
        return (
            <React.Fragment>
                <div>
                    <div className="channels">
                        <span className="channels__title"><i className="fa fa-exchange" aria-hidden="true"></i>CHANNELS ({channels.length})</span>
                        <i className="fa fa-plus" onClick={this.openModal}></i>
                    </div>
                    
                    <ul className="channel">
                        {
                            channels.length && channels.map((channel, ind) => {
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
                                    # {channel.name}
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
