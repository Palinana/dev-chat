import React, { Component } from 'react';

import './MessagesHeader.css';

class MessagesHeader extends Component {
    render() {
        const { channelName, numUniqueUsers, channelMessages, handleSearchChange, searchLoading } = this.props;
        
        return (
            <div className="messages__header">
                <div className="messages__header-info">
                    <div className="messages__header-info__name">{channelName}</div>
                    <div className="messages__header-info__stats">
                        <div className="messages__header-info__stats--users">{numUniqueUsers}</div>
                        <div className="messages__header-info__stats--messages">{channelMessages}</div>
                    </div>
                </div>

                <div className="messages__header__search">
                    <form className="messages__header__search-form" >
                        <input 
                            type="text" 
                            name="search"
                            placeholder="Search" 
                            onChange={handleSearchChange}
                            loading={searchLoading}
                        />
                        { searchLoading ? 
                            <div className="messages__header__search--loader">Loading...</div> :
                            <button className="messages__header__search--btn" type="submit">
                                <img alt="send-icon" className="messages__header__search--image" src={require('../../Assets/Images/search.svg')} />
                            </button>
                        }
                        {/* <button className="messages__header__search--btn" type="submit">
                            <img alt="send-icon" className="messages__header__search--image" src={require('../../Assets/Images/search.svg')} />
                        </button> */}
                    </form>
                </div>
            </div>
        )
    }
}

export default MessagesHeader;