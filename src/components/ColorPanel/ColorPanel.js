import React, { Component } from 'react';

import './ColorPanel.css';

class ColorPanel extends Component {
    render() {
        return (
            <div className="color-panel">
                <button className="color-panel__btn">
                    <i className="fa fa-plus fa-lg"></i>
                </button>
            </div>
        )
    }
}
  
export default ColorPanel;
