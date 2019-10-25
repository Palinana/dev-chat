import React, { Component } from 'react';
import { Modal, Form, Input, Icon, Button } from 'semantic-ui-react';
import firebase from '../../firebase';

import './Channels.css';

class Channels extends Component {
    state = {
        user: this.props.currentUser,
        channels: [],
        channelName: '',
        channelDetails: '',
        modal: false,
        channelsRef: firebase.database().ref('channels')
    }

    openModal = () => this.setState({ modal: true });

    closeModal = () => this.setState({ modal: false });

    addChannel = () => {
        const { channelsRef, channelName, channelDetails, user } = this.state;

        const key = channelsRef.push().key;
        const newChannel = {
            id: key,
            name: channelName,
            ditails: channelDetails,
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

        return (
            <React.Fragment>
                <div>
                    <div className="channels">
                        <i class="fa fa-exchange" aria-hidden="true"></i>
                        <span className="channels__title">CHANNELS ({channels.length})</span>
                        <i class="fa fa-plus" onClick={this.openModal}></i>
                    </div>
                    
                    <ul>
                        <li>
                            
                        </li>
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
  
export default Channels;
