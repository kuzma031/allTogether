import React from 'react';

import './Modal.css';

const Modal = props => { 

    const serverLayout = (
        <div className="modal">
            <p>Ooops, there is some problem with this action. </p>
            <p>If this continue, please contact admin.</p>
            <span>Error: {props.message}</span>
        </div>
    );

    const cameraLayout = (
        <div className="modal">
            <p>
                Looks like you blocked your camera permission.
            </p>
            <br />
            <p>
                Please allow this app to use camera in browser settings and refresh page.
            </p>
            <br />
            <span>
                {props.message}
            </span>
        </div>
    );

    const uploadingLayout = (
        <div className="modal">
            {props.message}
        </div>
    );
        
    let layout;

    switch(props.type) {
        case 'server':
            layout = serverLayout;
            break;
        case 'camera':
            layout = cameraLayout;
            break;
        case 'uploading': 
            layout = uploadingLayout;
            break;
        default:
            throw new Error('Error component error');
    }

    return (
        <div className="modal-wrapper" onClick={props.dismiss}> 
            {layout}
        </div>
    );
}

export default Modal; 