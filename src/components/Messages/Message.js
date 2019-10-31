import React from 'react';
import moment from 'moment';

import './Message.css';

const isOwnMessage = (message, user) => {
    return message.user.id === user.uid ? 'message__row message--self' : 'message__row message--other'
}

const userDetails = (message, user) => {
    return message.user.id !== user.uid ? 'message__details-info info--self' : 'message__details-info info--other'
}

const timeFromNow = timestamp => moment(timestamp).fromNow();

const isImage = (message) => {
    return message.hasOwnProperty('image') && !message.hasOwnProperty('content');
}

const Message = ({ message, user }) => { 
    return (
          <div className={isOwnMessage(message, user)}>
            <div className="message__container">
                { 
                    message.user.id !== user.uid ? 
                        <div className="message__image">
                            <img src={message.user.avatar}/>
                        </div>
                        : null
                }
                
                <div className="message__details">
                    
                    <div className={userDetails(message, user)}>
                        <div className="message__details-name">{message.user.name}</div>
                        <div className="message__details-time">{timeFromNow(message.timestamp)}</div>
                    </div> 
                    
                    { isImage(message) ? 
                        <img src={message.image} className="message__details-image"/> :
                        <div className="message__details-text">{message.content}</div> 
                    }
                </div>
            </div>
        </div>
    )
}

export default Message;