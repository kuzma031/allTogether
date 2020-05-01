import React, { createContext, useState } from 'react';

import url from '../constants/apiUrl';

export const AdminContext = createContext({});

const AdminContextProvider = props => {

    const [ state, setState ] = useState({
        users: [],
        questions: [],
        options: {
            logo: '',
            startMessage: {
                heading: 'test',
                message: ''
            },
            endMessage: {
                heading: '',
                message: ''
            }
        },
        done: false,
        error: false,
        message: ''
    });

    const addUser = async (email, password, confirmPassword, userType) => {
        try {
            const add = await fetch(`${url}/user/add-new`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email,
                    password,
                    confirmPassword,
                    userType
                })
            });

            const res = await add.json();

            console.log(res)
            
            if(!res.success) { 
                actionFail(res.message);
            } else {
                actionSuccess(res.message);
            }

        } catch(err) {
            window.alert('Something went wrong. Contact developer');
        }
    }

    const getAllUsers = async () => {
        try {
            const getUsers = await fetch(`${url}/user/all`);

            const res = await getUsers.json();

            setState({
                ...state,
                users: res.users
            });

        } catch(err) {  
            window.alert('Something went wrong. Contact developer');
        }
    }

    const deleteUser = async id => {
        try {
            const deleteUser = await fetch(`${url}/user/delete`, {
                method: 'POST',
                headers: {
                    'Content-Type' : 'application/json'
                },
                body: JSON.stringify({
                    id
                })
            });

            const res = await deleteUser.json();

            if(res.success) {
                setState({
                    ...state,
                    users: res.users
                });
            } else {
                window.alert('Something went wrong. Contact developer');
            }

        } catch(err) {
            window.alert('Something went wrong. Contact developer');
        }
    }

    const getAllQuestions = async () => {
        try {
            const getQuestions = await fetch(`${url}/questions`);

            const res = await getQuestions.json();

            if(res.success) {
                setState({
                    ...state,
                    questions: res.questions
                });
            } else {
                window.alert('Something went wrong. Contact developer');
            }


        } catch(err) {
            window.alert('Something went wrong. Contact developer');
        }
    }

    const addQuestion = async (content, answerTime) => {
        try {
            const addQuestion = await fetch(`${url}/add-question`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    content, answerTime
                })
            });

            const res = await addQuestion.json();

            if(!res.success) {
                actionFail(res.message);
            } else {
                actionSuccess(res.message);
            }

        } catch(err) {  
            window.alert('Something went wrong. Contact developer');
        }
    }

    const editQuestion = async (id, content, answerTime) => {
        try {
            const editQuestion = await fetch(`${url}/edit-question`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id, content, answerTime
                })
            });

            const res = await editQuestion.json();

            if(!res.success) {
                actionFail(res.message); 
            } else {
                const stateQuestions = [...state.questions];
                const index = stateQuestions.findIndex(q => q._id === id);
                stateQuestions[index].content = res.question.content;
                stateQuestions[index].answerTime = res.question.answerTime;

                actionSuccess(res.message); // this will also update questions
            }

        } catch(err) {  
            window.alert('Something went wrong. Contact developer');
        }
    }

    const deleteQuestion = async id => {
        try {
            const deleteQuestion = await fetch(`${url}/delete-question`, {
                method: 'POST',
                headers: {
                    'Content-Type' : 'application/json'
                },
                body: JSON.stringify({ id })
            });

            const res = await deleteQuestion.json();

            if(res.success) {
                setState({
                    ...state,
                    questions: res.questions
                });
            } else {
                window.alert('Something went wrong. Contact developer');
            }

        } catch(err) {
            window.alert('Something went wrong. Contact developer');
        }
    }

    const actionFail = message => {
        setState({
            ...state,
            done: false,
            error: true,
            message
        });
        clearMessageWithTimeout();
    }

    const actionSuccess = message => {
        setState({
            ...state,
            done: true,
            error: false,
            message
        });
        clearMessageWithTimeout();
    }

    const clearMessage = () => {
        setState({
            ...state,
            done: false,
            error: false,
            message: ''
        });
    }

    const clearMessageWithTimeout = () => {
        setTimeout(() => {
            setState({
                ...state,
                done: false,
                error: false,
                message: ''
            });
        }, 1200);
    }

    return (
        <AdminContext.Provider value={{
            state, 
            addUser,
            getAllUsers,
            deleteUser,
            getAllQuestions,
            addQuestion,
            editQuestion,
            deleteQuestion,
            clearMessage
            }}>
            {props.children}
        </AdminContext.Provider>
    )
}

export default AdminContextProvider;