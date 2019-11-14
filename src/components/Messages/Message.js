import React from 'react';
import formatDate from 'date-fns/format';

import './Message.css';

const isOwnMessage = (message, user) => {
    return message.user.id === user.uid ? 'message__row message--self' : 'message__row message--other'
}

const userDetails = (message, user) => {
    return message.user.id !== user.uid ? 'message__details-info info--self' : 'message__details-info info--other'
}

const isImage = (message) => {
    return message.hasOwnProperty('image') && !message.hasOwnProperty('content');
}

const userImage = (message, user) => {
    return message.user.id === user.uid ? 'message__details-image image--self' : 'message__details-image image--other'
}

const convertTime = timestamp => {
    let currentDate = new Date(timestamp);
    return formatDate(currentDate,`h:mm '${currentDate.getHours() >= 12 ? 'PM' : 'AM'}'`)
};


const Message = ({ message, user, showDay, date }) => { 
    return (
        <div className={isOwnMessage(message, user)}>
            {
                showDay && (
                    <div className="day">
                        <div className="day__line"/>
                        <div className="day__text">{date}</div>
                        <div className="day__line"/>
                    </div>
                )
            }
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
                        <div className="message__details-time">{convertTime(message.timestamp)}</div>
                    </div> 
                    
                    { isImage(message) ? 
                        <div className={userImage(message, user)}>
                            <img src={message.image} />
                        </div> :
                        <div className="message__details-text">{message.content}</div> 
                    }
                </div>
            </div>
        </div>
    )
}

export default Message;