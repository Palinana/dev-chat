import React, { Component } from 'react';

import MessagesHeader from './MessagesHeader';
import MessageForm from './MessageForm';
import Message from './Message';
import Typing from '../UI/Typing';
import Skeleton  from "../UI/Skeleton";
import isSameDay from 'date-fns/isSameDay'

import firebase from '../../firebase';

import './Messages.css';

export class Messages extends Component {
    state = {
        privateChannel: this.props.isPrivateChannel,
        privateMessagesRef: firebase.database().ref('privateMessages'),
        messagesRef: firebase.database().ref('messages'),
        messages: [],
        messagesLoading: true,
        channel: this.props.currentChannel,
        isChannelStarred: false,
        user: this.props.currentUser,
        usersRef: firebase.database().ref('users'),
        numUniqueUsers: '',
        searchTerm: '',
        searchLoading: false,
        searchResults: [],
        typingRef: firebase.database().ref("typing"),
        typingUsers: [],
        connectedRef: firebase.database().ref(".info/connected"),
        listeners: []
    }

    componentDidMount() {
        const { channel, user, listeners } = this.state;

        if(channel && user) {
            this.removeListeners(listeners);
            this.addListeners(channel.id);
            this.addUserStarsListener(channel.id, user.uid);
        } 
        
        if(this.messagesEnd) {
            this.scrollToBottom();
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if(this.messagesEnd) {
            this.scrollToBottom();
        }
    }

    componentWillUnmount() {
        this.removeListeners(this.state.listeners);
        this.state.connectedRef.off()
    }  

    removeListeners = listeners => {
        listeners.forEach(listener => {
          listener.ref.child(listener.id).off(listener.event)
        })
    };

    scrollToBottom = () => {
        const scrollHeight = this.messagesEnd.scrollHeight;
        const height = this.messagesEnd.clientHeight;
        const maxScrollTop = scrollHeight - height;
        this.messagesEnd.scrollTop = maxScrollTop > 0 ? maxScrollTop : 0;
    };

    addToListeners = (id, ref, event) => {
        const index = this.state.listeners.findIndex(listener => {
          return listener.id === id && listener.ref === ref && listener.event === event
        })
    
        if(index === -1) {
          const newListener = {id, ref, event};
          this.setState({listeners: this.state.listeners.concat(newListener)})
        }
    }

    addListeners = channelId => {
        this.addMessageListener(channelId);
        this.addTypingListeners(channelId);
    }

    addTypingListeners = channelId => {
        let typingUsers = [];
        this.state.typingRef.child(channelId).on("child_added", snap => {
            if (snap.key !== this.state.user.uid) {
                typingUsers = typingUsers.concat({
                    id: snap.key,
                    name: snap.val()
                });
                this.setState({ typingUsers });
            }
        });

        this.addToListeners(channelId, this.state.typingRef, 'child_added');

        this.state.typingRef.child(channelId).on("child_removed", snap => {
            const index = typingUsers.findIndex(user => user.id === snap.key);
      
            if (index !== -1) {
              typingUsers = typingUsers.filter(user => user.id !== snap.key);
              this.setState({ typingUsers });
            }
        });

        this.addToListeners(channelId, this.state.typingRef, 'child_removed');

        this.state.connectedRef.on("value", snap => {
            if (snap.val() === true) {
                this.state.typingRef
                    .child(channelId)
                    .child(this.state.user.uid)
                    .onDisconnect()
                    .remove(err => {
                        if (err !== null) {
                            console.error(err);
                        }
                    });
            }
        });
    }

    addMessageListener = channelId => {
        let loadedMessages = [];
        const ref = this.getMessagesRef();

        ref.child(channelId).on('child_added', snap => {
            loadedMessages.push(snap.val());
            this.setState({
                messages: loadedMessages,
                messagesLoading: false
            });
            this.countUniqueUsers(loadedMessages);
        });

        this.setState({
            messagesLoading: false
        });

        this.addToListeners(channelId, ref, 'child_added');
    }

    addUserStarsListener = (channelId, userId) => {
        this.state.usersRef
            .child(userId)
            .child('starred')
            .once('value')
            .then(data => {
                if(data.val() !== null) {
                    const channelIds = Object.keys(data.val());
                    const prevStarred = channelIds.includes(channelId);
                    this.setState({ isChannelStarred: prevStarred });
                }
            });
    }

    getMessagesRef = () => {
        const { messagesRef, privateMessagesRef, privateChannel } = this.state;

        return privateChannel ? privateMessagesRef : messagesRef;
    }

    handleStar = () => {
        this.setState(prevState => ({ 
            isChannelStarred: !prevState.isChannelStarred //to always have the oposite value
        }), () => this.starChannel());
    }

    starChannel = () => {
        if(this.state.isChannelStarred) {
            this.state.usersRef
                .child(`${this.state.user.uid}/starred`)
                .update({
                    [this.state.channel.id]: {
                        name: this.state.channel.name,
                        datails: this.state.channel.details,
                        createdBy: {
                            name: this.state.channel.createdBy.name,
                            avatar: this.state.channel.createdBy.avatar
                        }
                    }
                });
        }
        else {
            this.state.usersRef
                .child(`${this.state.user.uid}/starred`)
                .child(this.state.channel.id)
                .remove(err => {
                    if(err !== null) {
                        console.log(err)
                    } 
                });
        }
    }

    handleSearchChange = event => {
        this.setState({ 
            searchTerm: event.target.value,
            searchLoading: true 
        }, () => this.handleSearchMessages());
    }

    // filters messages
    handleSearchMessages = () => {
        // coping messages
        const channelMessages = [...this.state.messages];
        const regex = new RegExp(this.state.searchTerm, 'gi'); //globally and case insensitive
        const searchResults = channelMessages.reduce((acc, message) => {
            if(message.content && message.content.match(regex) || message.user.name.match(regex)) {
                acc.push(message);
            }
            return acc;
        }, [])
        this.setState({ searchResults });
        setTimeout(() => this.setState({ searchLoading: false }), 1000);
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
        messages.length > 0 && messages.map((message, index) => {
            const previous = messages[index-1];
            const showDay = this.shoudlShowDay(previous, message);
            
            return (
                <Message 
                    key={message.timestamp}
                    message={message}
                    user={this.state.user}
                    showDay={showDay}
                    date={new Date(message.timestamp).toLocaleDateString()}
                />
            )
        })
    )

    shoudlShowDay = (previous, message) => {
        const isFirst = !previous;
        if (isFirst) {
            return true;
        }

        let prevMessage = new Date(previous.timestamp);
        let currMessage = new Date(message.timestamp);

        const isNewDay = prevMessage.getDay() === currMessage.getDay()
        return !isNewDay
    }

    displayMessagesLoading = mesagesLoading =>
        mesagesLoading ? ( 
            <React.Fragment>
                {[...Array(10)].map((_, i) => (
                    <Skeleton key={i} />
                ))}
            </React.Fragment>
        ) : null;

    displayChannelName = channel => {
        return channel ? `${this.state.privateChannel ? '@' : '#'}${channel.name}` : '';
    }

    displayTotalMessagesNum = messages => messages ? `${messages.length} messages` : '';

    displayTypingUsers = typingUsers => 
        typingUsers.length > 0 && typingUsers.map((user, i) => (
            <div key={i} className="messages__typing">
                <span className="messages__typing-dots">{user.name} is typing</span> <Typing />
            </div>
        ));

    render() {
        const { messagesRef, messages, messagesLoading, channel, user, numUniqueUsers, 
            searchTerm, searchResults, searchLoading, privateChannel, isChannelStarred, 
            typingUsers } = this.state;
        
        const { handleMenu, menuActive } = this.props;

        return (
            <div className="messages">
                <MessagesHeader 
                    channelName={this.displayChannelName(channel)}
                    numUniqueUsers={numUniqueUsers}
                    channelMessages={this.displayTotalMessagesNum(messages)}
                    handleSearchChange={this.handleSearchChange}
                    searchLoading={searchLoading}
                    isPrivateChannel={privateChannel}
                    handleStar={this.handleStar}
                    isChannelStarred={isChannelStarred}
                    handleMenu={handleMenu}
                    menuActive={menuActive}
                />
                <div className="messages-list" ref={node => {this.messagesEnd = node}}>
                    {this.displayMessagesLoading(messagesLoading)}
                    { searchTerm ? 
                        this.displayMessages(searchResults) :
                        this.displayMessages(messages)
                    }
                    {this.displayTypingUsers(typingUsers)}
                </div>
                <MessageForm 
                    messagesRef={messagesRef} 
                    currentChannel={channel}
                    currentUser={user}
                    isPrivateChannel={privateChannel}
                    getMessagesRef={this.getMessagesRef}
                />
            </div>
        )
    }
}
  
export default Messages;