import React from "react";

import './Skeleton.css';

export const Skeleton = () => {
    return (
        <div className="skeleton">
            <div className="skeleton-left">
                <div className="skeleton__avatar-left" />
                <div className="skeleton__author-left" />
                <div className="skeleton__details-left" />
            </div>
            <div className="skeleton-right">
                <div className="skeleton__avatar-right" />
                <div className="skeleton__author-right" />
                <div className="skeleton__details-right" />
            </div>
        </div>
    );
};

export default Skeleton;
