import React, { createContext, useReducer } from 'react';

import url from '../constants/apiUrl';

export const AppContext = createContext({});

const initialState = {
    serverResponse: { // this is global server response, it will propably happen in catch of async, when server is not reachable for example
        error: false,
        message: ''
    },
    cameraSupport: true,
    questions: [],
    answers: [],
    options: {},
    auth: {
        userEmail: undefined,
        userType: undefined,
        fetching: true,
        loggedIn: false,
        serverResponse: { // this is server response for auth of users, it will always happen when doing auth actions
            error: false,
            message: '',
            payload: undefined
        }
    }
}

const userReducer = (state, action) => {
    switch(action.type) {
        case 'SERVER_ERROR':
            return {
                ...state,
                serverResponse: {
                    ...state.serverResponse,
                    error: true,
                    message: action.message
                }
            }
        case 'DISMISS_SERVER_ERROR':
            return {
                ...state,
                serverResponse: {
                    ...state.serverResponse,
                    error: false,
                    message: ''
                }
            }
        case 'GET_USER_SUCCESS':
            return {
                ...state,
                questions: action.questions,
                answers: action.answers,
                options: action.options,
                auth: {
                    ...state.auth,
                    userEmail: action.user.email,
                    userType: action.user.userType,
                    fetching: false,
                    loggedIn: true,
                }
            }
        case 'GET_USER_FAIL':
            return {
                ...state,
                auth: {
                    ...state.auth,
                    fetching: false,
                    loggedIn: false
                }
            }
        case 'LOGIN_SUCCESS':
            return {
                ...state,
                questions: action.questions,
                answers: action.answers,
                options: action.options,
                auth: {
                    ...state.auth,
                    userEmail: action.user.email,
                    userType: action.user.userType,
                    fetching: false,
                    loggedIn: true,
                }
            }
        case 'LOGIN_FAIL':
            return {
                ...state,
                auth: {
                    ...state.auth,
                    serverResponse: {
                        ...state.auth.serverResponse,
                        error: true,
                        message: action.message
                    }
                }
            }
        case 'LOGOUT':
            return {
                ...state,
                questions: [],
                answers: [],
                auth: {
                    ...state.auth,
                    userEmail: undefined,
                    userType: undefined,
                    loggedIn: false
                }
            }
        case 'REQUIRE_PASSWORD_RESET_SUCCESS':
            return {
                ...state,
                auth: {
                    ...state.auth,
                    serverResponse: {
                        ...state.auth.serverResponse,
                        error: false,
                        message: action.message
                    }
                }
            }
        case 'REQUIRE_PASSWORD_RESET_FAIL':
            return {
                ...state,
                auth: {
                    ...state.auth,
                    serverResponse: {
                        ...state.auth.serverResponse,
                        error: true,
                        message: action.message
                    }
                }
            }
        case 'PASSWORD_RESET_SUCCESS':
            return {
                ...state,
                auth: {
                    ...state.auth,
                    serverResponse: {
                        ...state.auth.serverResponse,
                        payload: action.payload
                    }
                }
            }
        case 'PASSWORD_RESET_FAIL':
            return {
                ...state,
                auth: {
                    ...state.auth,
                    serverResponse: {
                        ...state.auth.serverResponse,
                        error: true,
                        message: action.message
                    }
                }
            }
        case 'CLEAR_MESSAGE':
            return {
                ...state,
                auth: {
                    ...state.auth,
                    serverResponse: {
                        error: false,
                        message: '',
                        payload: undefined
                    }
                }
            }
        case 'CAMERA_NOT_SUPPORTED':
            return {
                ...state,
                cameraSupport: false
            }
        default: 
            throw new Error('User Reducer error');
    }
}

const AppContextProvider = props => {

    const [ state, dispatch ] = useReducer(userReducer, initialState);

    const checkCameraSupport = () => {
        if(!(navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia)) {
            dispatch({ type: 'CAMERA_NOT_SUPPORTED' });
        } 
    }

    const dismissError = () => {
        dispatch({ type: 'DISMISS_SERVER_ERROR' });
    }

    const getUser = async token => {
        if(token) {
            try {
                const getUser = await fetch(`${url}/user/id/`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
    
                const res = await getUser.json();
                
                if(res.success) {
                    dispatch({ type: 'GET_USER_SUCCESS', user: res.findUser, questions: res.questions, answers: res.answers, options: res.options });
                } else {
                    dispatch({ type: 'GET_USER_FAIL' });
                    clearMessageWithDelay();
                }
            } catch(err) {
                dispatch({ type: 'GET_USER_FAIL' });
            }
        } else {
            dispatch({ type: 'GET_USER_FAIL' });
        }
    }

    const logIn = async (email,password) => {    
        try {
            const tryLogin = await fetch(`${url}/user/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email,
                    password
                })
            });

            const res = await tryLogin.json();

            if(!res.success) {
                dispatch({ type: 'LOGIN_FAIL', message: res.message });
                clearMessageWithDelay();
            } else {
                localStorage.setItem('token', res.token);
                dispatch({ type: 'LOGIN_SUCCESS', user: res.findUser, questions: res.questions, answers: res.answers, options: res.options });
            }

        } catch(err) {
            dispatch({ type: 'SERVER_ERROR', message: `${err.name}, ${err.message}` });
        }
    }

    const logout = () => {
        localStorage.removeItem('token');
        dispatch({ type: 'LOGOUT' });
    }

    const requirePasswordReset = async email => {
        try {
            const sendPasswordReset = await fetch(`${url}/user/require-password-reset`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },  
                body: JSON.stringify({ email })
            });

            const res = await sendPasswordReset.json();

            if(!res.success) {
                dispatch({ type: 'REQUIRE_PASSWORD_RESET_FAIL', message: res.message });
                clearMessageWithDelay();
            } else {
                dispatch({ type: 'REQUIRE_PASSWORD_RESET_SUCCESS', message: res.message });
            }
        } catch(err) {
            dispatch({ type: 'SERVER_ERROR', message: `${err.name}, ${err.message}` });
        }
    }

    const resetPassword = async (token, password, newPassword) => {
        try {   
            const resetPassword = await fetch(`${url}/user/change-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    token,
                    newPassword: password,
                    confirmNewPassword: newPassword
                })
            })

            const res = await resetPassword.json();

            if(!res.success) {
                dispatch({ type: 'PASSWORD_RESET_FAIL', message: res.message });
                clearMessageWithDelay();
            } else {
                dispatch({ type: 'PASSWORD_RESET_SUCCESS', payload: res.findUser.email });
            }

        } catch(err) {
            dispatch({ type: 'SERVER_ERROR', message: `${err.name}, ${err.message}` });
        }
    }

    const clearMessageWithDelay = () => {
        setTimeout(() => {
            dispatch({ type: 'CLEAR_MESSAGE' });
        }, 1600);
    }

    const clearMessage = () => {
        dispatch({ type: 'CLEAR_MESSAGE' });
    }

    return (
        <AppContext.Provider value={{
            state, 
            dismissError,
            checkCameraSupport,
            getUser,
            logIn,
            logout,
            requirePasswordReset,
            resetPassword,
            clearMessage }}>
            {props.children}
        </AppContext.Provider>
    )
}

export default AppContextProvider;