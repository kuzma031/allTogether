import React, { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { AppContext } from '../../context/app-context';

import Layout from '../Layout/Layout';
import Modal from '../Modal/Modal';

const ForgorPassword = props => {

    const [ email, changeEmail ] = useState('');

    const appContext = useContext(AppContext);
    const serverResponse = appContext.state.serverResponse;
    const authResponse = appContext.state.auth.serverResponse;

    useEffect(() => {
        appContext.clearMessage();
    }, []);

    const submitFormHandler = async e => {
        e.preventDefault();

        appContext.requirePasswordReset(email);
    }

    return (
        <Layout gradientHeader>
            {serverResponse.error && <Modal type='server' message={serverResponse.message} dismiss={appContext.dismissError} />}
            <form className="form" onSubmit={submitFormHandler}>
                <h4 className="form-message">
                    Please enter email to reset password
                </h4>
                <div className="form-control">
                    <label htmlFor="email">
                        Email
                    </label>
                    <input type="email" 
                    id="email"
                    name="email"
                    placeholder="name@domain.com" 
                    value={email} 
                    onChange={e => changeEmail(e.target.value)}/>
                </div>  
                <div className="btn-container">
                    {authResponse.error && <p className="server-message fail">{authResponse.message}</p> }
                    {authResponse.message.length > 0 && !authResponse.error 
                    && <p className="server-message success">{authResponse.message}</p>}
                    <button className="btn btn-primary">
                        S’identifier
                    </button> 
                </div>
                <Link className="form-link" to="/login">
                    Login
                </Link>
            </form>
        </Layout>
    )
}

export default ForgorPassword;