import React, { useState, useEffect, useMemo } from 'react';

import url from '../../../constants/apiUrl';

const Options = props => {

    const [ state, setState ] = useState({
        logo: '',
        newLogo: undefined,
        startMessage: {
            heading: '',
            message: ''
        },
        endMessage: {
            heading: '',
            message: ''
        },
        message: '',
        logoMessage: ''
    });

    useEffect(() => {
        const getOptions = async () => {
            try {
                const fetchOptions = await fetch(`${url}/options`);
    
                const res = await fetchOptions.json();
    
                if(res.success) {
                    setState({
                        ...state,
                        logo: res.options.logo,
                        startMessage: {
                            heading: res.options.startMessage.heading,
                            message: res.options.startMessage.message
                        },
                        endMessage: {
                            heading: res.options.endMessage.heading,
                            message: res.options.endMessage.message
                        }
                    });
                } else {
                    window.alert('Something went wrong. Contact developer');
                }
    
            } catch(err) {
                window.alert('Something went wrong. Contact developer');
            }
        }

        getOptions();
    }, []);

    const changeLogoHandler = async e => {
        e.preventDefault();

        if(state.newLogo) {
            try {

                const formData = new FormData();

                formData.append('logo', state.newLogo);

                const updateLogo = await fetch(`${url}/change-logo`, {
                    method: 'POST',
                    body: formData
                });

                const res = await updateLogo.json();
                
                if(!res.success) {
                    setState({
                        ...state,
                        logoMessage: res.message
                    });
                    clearMessage();
                } else {
                    setState({
                        ...state,
                        logo: res.options.logo,
                        logoMessage: res.message
                    });
                }
            } catch(err) {
                window.alert('Something went wrong. Contact developer');
            }
        } else {
            setState({
                ...state,
                logoMessage: 'Please add new logo'
            });
            clearMessage();
        }
    }

    const changeMessagesHandler = async e => {
        e.preventDefault();
        const startMessage = state.startMessage;
        const endMessage = state.endMessage;
        try {
            const sendMessages = await fetch(`${url}/change-messages`, {
                method: 'POST',
                headers: {
                    'Content-Type' : 'application/json'
                },
                body: JSON.stringify({
                    startMessage,
                    endMessage
                })
            });

            const res = await sendMessages.json();
            if(!res.success) {
                setState({
                    ...state,
                    message: res.message
                });
                clearMessage();
            } else {
                setState({
                    ...state,
                    message: res.message
                });
                clearMessage();
            }

        } catch(err) {
            window.alert('Something went wrong. Contact developer');
        }
    }

    const clearMessage = () => {
        setTimeout(() => {
            setState({
                ...state,
                message: '',
                logoMessage: ''
            });
        }, 1400);
    }
    
    const logo = useMemo(() => {
        return <img src={state.logo} className='admin-logo'/>;
    }, [state.logo]);

    return (
        <div className="options-container">
            <form className="form" onSubmit={changeLogoHandler}>
                <h4 className='admin-header'>
                    Change Logo
                </h4>    
                <h3>Current Logo</h3>
                {logo}
                <h3>New Logo</h3>
                <input type="file" onChange={e => setState({ ...state, newLogo: e.target.files[0] })} />    
                <p style={{ marginTop: '10px'}}>Logo should be of type .png</p>        
                <button className="btn btn-primary" style={{ marginTop: '10px'}}>
                    Change Logo
                </button> 
            </form>
            {state.logoMessage.length > 0 && state.logoMessage}
            <h4 className='admin-header' style={{ marginTop: '20px'}}>
                Change messages
            </h4>
            <hr/>
            <form className="form" onSubmit={changeMessagesHandler}>
                <h4 className='admin-header'>
                    Start message
                </h4>
                <div className="form-control">
                    <label htmlFor="startHeading">
                        Heading
                    </label>
                    <input type="text" 
                    id="startHeading"
                    name="startHeading"
                    value={state.startMessage.heading}
                    onChange={e => setState({ ...state, startMessage: { ...state.startMessage, heading: e.target.value } })}/>
                </div> 
                <div className="form-control">
                    <label htmlFor="message">
                        Message
                    </label>
                    <textarea 
                    id="message" 
                    name="message" 
                    rows="10"
                    value={state.startMessage.message} 
                    onChange={e => setState({ ...state, startMessage: { ...state.startMessage, message: e.target.value } })}/>
                </div> 
                <h4 className='admin-header'>
                    End message
                </h4>
                <div className="form-control">
                    <label htmlFor="startHeading">
                        Heading
                    </label>
                    <input type="text" 
                    id="startHeading"
                    name="startHeading"
                    value={state.endMessage.heading}
                    onChange={e => setState({ ...state, endMessage: { ...state.endMessage, heading: e.target.value } })}/>
                </div> 
                <div className="form-control">
                    <label htmlFor="message">
                        Message
                    </label>
                    <textarea 
                    id="message" 
                    name="message" 
                    rows="10"
                    value={state.endMessage.message} 
                    onChange={e => setState({ ...state, endMessage: { ...state.endMessage, message: e.target.value } })}/>
                </div>
                {state.message.length > 0 && state.message}
                <button className="btn btn-primary">
                    Change Messages
                </button> 
            </form>
        </div>
    )
}

export default Options;