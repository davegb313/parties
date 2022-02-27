import React from "react";

import "./Avatar.css";

const Avatar = props => {
    return (
        <div className="avatar">
            <img 
                src={props.image}
                alt={props.alt}
                style={{ width: props.width, height: props.height}} 
            />
        </div>
    );
};

export default Avatar;