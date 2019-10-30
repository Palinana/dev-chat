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


const Message = ({ message, user }) => { 
    return (
          <div className={isOwnMessage(message, user)}>
            <div class="message__container">
                { 
                    message.user.id !== user.uid ? 
                        <div className="message__image">
                            <img src={message.user.avatar}/>
                        </div>
                        : null
                }
                
                <div class="message__details">
                    <div class="message__details-text">{message.content}</div> 
                    <div className={userDetails(message, user)}>
                        <div class="message__details-name">{message.user.name}</div>
                        <div class="message__details-time">{timeFromNow(message.timestamp)}</div>
                    </div> 
                </div>
            </div>
        </div>
    )
}

export default Message;