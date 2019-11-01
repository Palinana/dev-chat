import React, { Component } from 'react';

import MessagesHeader from './MessagesHeader';
import MessageForm from './MessageForm';
import Message from './Message';

import firebase from '../../firebase';

import './Messages.css';

class Messages extends Component {
    state = {
        messagesRef: firebase.database().ref('messages'),
        messages: [],
        messagesLoading: true,
        channel: this.props.currentChannel,
        user: this.props.currentUser,
        numUniqueUsers: ''
    }

    componentDidMount() {
        const { channel, user } = this.state;

        if(channel && user) {
            this.addListeners(channel.id);
        } 
    }

    addListeners = channelId => {
        this.addMessageListener(channelId);
    }

    addMessageListener = channelId => {
        let loadedMessages = [];
        this.state.messagesRef.child(channelId).on('child_added', snap => {
            loadedMessages.push(snap.val());
            this.setState({
                messages: loadedMessages,
                messagesLoading: false
            });
            this.countUniqueUsers(loadedMessages);
        });
    }

    countUniqueUsers = messages => {
        const uniqueUsers = messages.reduce((acc, message) => {
            if(!acc.includes(message.user.name)) {
                acc.push(message.user.name);
            }
            return acc;
        }, []);

        const plural = uniqueUsers.length > 1 || uniqueUsers.length === 0;
        const numUniqueUsers = `${uniqueUsers.length} user${plural ? 's' : ''}`;
        this.setState({ numUniqueUsers });
    }

    displayMessages = messages => (
        messages.length > 0 && messages.map(message => (
            <Message 
                key={message.timestamp}
                message={message}
                user={this.state.user}
            />
        ))
    )

    displayChannelName = channel => channel ? `# ${channel.name}` : '';

    displayTotalMessagesNum = messages => messages ? `${messages.length} messages` : ''

    render() {
        const { messagesRef, messages, messagesLoading, channel, user, numUniqueUsers } = this.state;
        return (
            <div className="messages">
                <MessagesHeader 
                    channelName={this.displayChannelName(channel)}
                    numUniqueUsers={numUniqueUsers}
                    channelMessages={this.displayTotalMessagesNum(messages)}
                />
                <div className="messages-list">
                    {this.displayMessages(messages)}
                </div>
                <MessageForm 
                    messagesRef={messagesRef} 
                    currentChannel={channel}
                    currentUser={user}
                />
            </div>
        )
    }
}
  
export default Messages;