import React, { Component } from 'react';
import firebase from '../../firebase';

import './MessageForm.css';

class MessageForm extends Component {
    state = {
        message: '',
        channel: this.props.currentChannel,
        user: this.props.currentUser,
        loading: false,
        errors: []
    }

    handleChange = event => {
        this.setState({ [event.target.name]: event.target.value })
    }

    handleSubmit = event => {
        event.preventDefault();
        const { messagesRef } = this.props;
        const { message, channel } = this.state;

        if(message) {
            this.setState({ loading: true });
            messagesRef  
                .child(channel.id)
                .push()
                .set(this.createMessage())
                .then(() => {
                    this.setState({ loading: false, message: '', errors: [] })
                })
                .catch((err) => {
                    console.log(err);
                    this.setState({ loading: false, errors: this.state.errors.concat(err) })
                })
        }
        else {
            this.setState({ errors: this.state.errors.concat({ message: 'Add a message' })})
        }
    } 

    createMessage = () => {
        const message = {
            timestamp: firebase.database.ServerValue.TIMESTAMP,
            user: {
                id: this.state.user.uid,
                name: this.state.user.displayName,
                avatar: this.state.user.photoURL
            },
            content: this.state.message
        }
        return message;
    }

    render() {
        const { errors, message, loading } = this.state;
        return (
            <div className="reply-container">
                <form className="reply__form" onSubmit={this.handleSubmit}>
                    <label className="reply__label">
                        <input 
                            type="text" 
                            className={
                                errors.length && errors.some(error => error.message.includes('message')) ? 'error reply__input' : 'reply__input'
                            }
                            name="message"
                            placeholder="Write your message" 
                            value={message}
                            onChange={this.handleChange}
                        />
                        <button className="reply__btn" disabled={loading}>
                            <img alt="send-icon" className="reply__btn--submit-image" src={require('../../Assets/Images/send.svg')} />
                        </button>
                    </label>
                </form>
            </div>
        )
    }
}

export default MessageForm;