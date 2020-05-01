import React, { useState, useEffect, useContext } from 'react';

import { AdminContext } from '../../../context/admin-context';

const AddUser = props => {

    const adminContext = useContext(AdminContext);

    const [ state, setState ] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        userType: 'normal'
    });

    useEffect(() => {
        adminContext.clearMessage();
    }, []);

    useEffect(() => {
        setState({
            email: '',
            password: '',
            confirmPassword: '',
            userType: 'normal'
        });

    }, [adminContext.state.done]);

    const formSubmitHandler = e => {
        e.preventDefault();

        adminContext.addUser(state.email, state.password, state.confirmPassword, state.userType);
    }

    return (
        <form className="form" onSubmit={formSubmitHandler}>
            <h4 className='admin-header'>
                Add User
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
                onChange={e => setState({ ...state, email: e.target.value })}
                />
            </div> 
            <div className="form-control">
                <label htmlFor="password">
                    Password
                </label>
                <input type="password" 
                id="password"
                name="password"
                placeholder="name@domain.com" 
                value={state.password}
                onChange={e => setState({ ...state, password: e.target.value })}
                />
            </div> 
            <div className="form-control">
                <label htmlFor="confirmPassword">
                    Confirm Password
                </label>
                <input type="password" 
                id="confirmPassword"
                name="confirmPassword"
                placeholder="name@domain.com" 
                value={state.confirmPassword}
                onChange={e => setState({ ...state, confirmPassword: e.target.value })}
                />
            </div> 
            <div className="form-control">
                <select name="user_type" onChange={e => setState({ ...state, userType: e.target.value })}>
                    <option value="normal">
                        Normal User
                    </option>
                    <option value="admin">
                        Admin
                    </option>
                </select>
            </div>
            {adminContext.state.error ? (
                <p className="server-message fail">{adminContext.state.message}</p>
            ) : (
                adminContext.state.message.length > 0 ? <p className="server-message success">{adminContext.state.message}</p> : null
            )}
            
            <button className="btn btn-primary">
                Add
            </button> 
        </form>
    )
}

export default AddUser;