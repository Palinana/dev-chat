import React, { Component } from 'react';
import { Menu } from 'semantic-ui-react';
import UserPanel from '../UserPanel/UserPanel';
import Channels from '../Channels/Channels';
import DirectMessages from '../DirectMessages/DirectMessages';
import Starred from '../Starred/Starred';

import './SideMenu.css';

class SideMenu extends Component {
    constructor(props) {
        super(props);
    
        this.setWrapperRef = this.setWrapperRef.bind(this);
        this.handleClickOutside = this.handleClickOutside.bind(this);
    }
    
    componentDidMount() {
        document.addEventListener('mousedown', this.handleClickOutside);
    }
    
    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClickOutside);
    }
    
    /**  Set the wrapper ref */
    setWrapperRef(node) {
        this.wrapperRef = node;
    }
    
    /** Alert if clicked on outside of element */
    handleClickOutside(event) {
        if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
            this.props.handleMenu()
        }
    }
    render() {
        const { currentUser } = this.props;

        return (
            <div className="side-menu" ref={this.setWrapperRef}>
                <UserPanel currentUser={currentUser}/>
                <Channels currentUser={currentUser}/>
                <Starred currentUser={currentUser} />
                <DirectMessages currentUser={currentUser}/>
            </div>
        )
    }
}
  
export default SideMenu;