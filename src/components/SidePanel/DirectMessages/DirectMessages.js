import React, { Component } from 'react';

import './DirectMessages.css';

class DirectMessages extends Component {
    state = {
        users: []
    }
    render() {
        const { users } = this.state;

        return (
            <div className="direct-messages">
                <div className="direct-messages__header">
                    <span className="direct-messages__header--title"><i className="fa fa-envelope" aria-hidden="true"></i>DIRECT MESSAGES ({ users.length })</span>
                </div>
            </div>
        )
    }
}
  
export default DirectMessages;