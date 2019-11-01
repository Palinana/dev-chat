import React, { Component } from 'react';

import './MessagesHeader.css';

class MessagesHeader extends Component {
    render() {
        const { channelName, numUniqueUsers, channelMessages } = this.props;
        
        return (
            <div className="messages__header">
                <div className="messages__header-name">{channelName}</div>
                <div className="messages__header-stats">
                    <div className="messages__header-stats--users">{numUniqueUsers}</div>
                    <div className="messages__header-stats--messages">{channelMessages}</div>
                </div>
            </div>
        )
    }
}

export default MessagesHeader;