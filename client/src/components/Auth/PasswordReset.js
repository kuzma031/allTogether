import React, { useState, useContext, useEffect } from 'react';
import { Redirect } from 'react-router-dom';

import { AppContext } from '../../context/app-context';

import Layout from '../Layout/Layout';
import Modal from '../Modal/Modal';

const PasswordReset = props => {

    const [ state, setState ] = useState({
        password: '',
        confirm: ''
    });

    const appContext = useContext(AppContext);
    const serverResponse = appContext.state.serverResponse;
    const authResponse = appContext.state.auth.serverResponse;

    useEffect(() => {
        appContext.clearMessage();
    }, []);

    const submitFormHandler = async e => {
        e.preventDefault();
        const token = props.match.params.token;
        appContext.resetPassword(token, state.password, state.confirm);
    }

    return authResponse.payload ? ( // we will have this if password is changed successfully
        <Redirect to={{ pathname: '/login', state: authResponse.payload }} />
    ) : (
        <Layout gradientHeader>
            {serverResponse.error && <Modal type='server' message={serverResponse.message} dismiss={appContext.dismissError} />}
            <form className="form" onSubmit={submitFormHandler}>
                <h4 className="form-message">
                    Please enter new password
                </h4>
                <div className="form-control">
                    <label htmlFor="password">
                        New Password
                    </label>
                    <input type="password" 
                    id="password"
                    name="password"
                    value={state.password} 
                    onChange={e => setState({ ...state, password: e.target.value })}/>
                </div> 
                <div className="form-control">
                    <label htmlFor="confirm_password">
                        Confirm New Password
                    </label>
                    <input type="password" 
                    id="confirm_password"
                    name="confirm_password"
                    value={state.confirm} 
                    onChange={e => setState({ ...state, confirm: e.target.value })}/>
                </div>  
                <div className="btn-container">
                    {authResponse.error && <p className="server-message fail">{authResponse.message}</p> }
                    {authResponse.message.length > 0 && !authResponse.error 
                    && <p className="server-message success">{authResponse.message}</p>}
                    <button className="btn btn-primary">
                        Reset
                    </button> 
                </div>
            </form>
        </Layout>
    ) 
};

export default PasswordReset;