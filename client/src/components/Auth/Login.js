import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';

import { AppContext } from '../../context/app-context';

import Layout from '../Layout/Layout'; 
import Modal from '../Modal/Modal';

const Login = props => {

    const [ state, setState ] = useState({
        email: '',
        password: ''
    });

    const appContext = useContext(AppContext);
    const serverResponse = appContext.state.serverResponse;
    const authResponse = appContext.state.auth.serverResponse;

    useEffect(() => {
        appContext.clearMessage();
    }, []);

    useEffect(() => { // if its redirected from change password
        if(props.location.state) setState({ ...state, email: props.location.state });
    }, [props.location.state]);

    const submitFormHandler = async e => {
        e.preventDefault();
        appContext.logIn(state.email, state.password);
    }

    return (
        <Layout gradientHeader>
            {serverResponse.error && <Modal type='server' message={serverResponse.message} dismiss={appContext.dismissError} />}
            <form className="form" onSubmit={submitFormHandler}>
                <h4 className="form-message">
                    Please log in for an account
                </h4>
                <div className="form-control">
                    <label htmlFor="email">
                        Email
                    </label>
                    <input type="email" 
                    id="email"
                    name="email"
                    placeholder="name@domain.com" 
                    value={state.email} 
                    onChange={e => setState({ ...state, email: e.target.value})}/>
                </div>  
                <div className="form-control">
                    <label htmlFor="password">
                        Password
                    </label>
                    <input type="password" 
                    id="password"
                    name="password"
                    value={state.password} 
                    onChange={e => setState({ ...state, password: e.target.value })}/>
                </div> 
                <div className="btn-container">
                    {authResponse.error && <p className="server-message fail">{authResponse.message}</p> }
                    <button className="btn btn-primary">
                        S’identifier
                    </button> 
                </div>
                <Link className="form-link" to="/forgot-password">
                    Forgot Password
                </Link>
            </form>
        </Layout>
    )
};

export default Login;