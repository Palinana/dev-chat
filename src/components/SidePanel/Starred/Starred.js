import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Modal, Form, Input, Icon, Button } from 'semantic-ui-react';

import { setCurrentChannel, setPrivateChannel } from '../../../store';

import './Starred.css';

class Starred extends Component {
    state = {
        activeChannel: '',
        starredChannels: []
    }

    setActiveChannel = channel => {
        this.setState({ activeChannel: channel.id });
    }

    changeChannel = channel => {
        this.setActiveChannel(channel)
        this.props.setCurrentChannel(channel);
        this.props.setPrivateChannel(false);
    }

    render() {
        const { starredChannels } = this.state;

        return (
            <div>
                <div className="starred__header">
                    <span className="starred__header--title"><i className="fa fa-star" aria-hidden="true"></i>STARRED ({ starredChannels.length })</span>
                </div>
                
                <ul className="starred-channels">
                    {
                        starredChannels.length && starredChannels.map((channel, ind) => {
                            return (
                                <li 
                                    // className={
                                    //     channel.id === activeChannel 
                                    //     ? "starred-channel--active starred-channel"
                                    //     : "starred-channel"
                                    // }
                                    key={ind}
                                    onClick={() => this.changeChannel(channel)}
                                >
                                # {channel.name}
                                </li>
                            )
                        })
                    }
                </ul>
            </div>
        )
    }
}
  
const mapDispatch = dispatch => {
    return {
        setCurrentChannel(channel) {
            dispatch(setCurrentChannel(channel));
        },
        setPrivateChannel(state) {
            dispatch(setPrivateChannel(state));
        },
    }
}
  
export default connect(null, mapDispatch)(Starred);
