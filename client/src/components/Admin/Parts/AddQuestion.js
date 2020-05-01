import React, { useState, useEffect, useContext } from 'react';

import { AdminContext } from '../../../context/admin-context';

const AddQuestion = props => {

    const adminContext = useContext(AdminContext);

    const [ state, setState ] = useState({
        question: '',
        answerTime: ''
    });

    useEffect(() => {
        adminContext.clearMessage();
    }, []);

    useEffect(() => {
        setState({
            question: '',
            answerTime: ''
        });

    }, [adminContext.state.done]);

    const formSubmitHandler = e => {
        e.preventDefault();

        adminContext.addQuestion(state.question, state.answerTime);
    }

    return (
        <form className="form" onSubmit={formSubmitHandler}>
            <h4 className='admin-header'>
                Add Question
            </h4>
            <div className="form-control">
                <label htmlFor="question">
                    Question 
                </label>
                <textarea 
                id="question" 
                name="question" 
                rows="10"
                value={state.question} 
                onChange={e => setState({...state, question: e.target.value })}/>
            </div> 
            <div className="form-control">
                <label htmlFor="answerTime">
                    Answer Time ( in seconds )
                </label>
                <input type="number" 
                id="answerTime"
                name="answerTime"
                value={state.answerTime}
                onChange={e => setState({ ...state, answerTime: e.target.value })}
                />
            </div> 
            {adminContext.state.error ? (
                <p className="server-message fail">{adminContext.state.message}</p>
            ) : (
                adminContext.state.message.length > 0 ? <p className="server-message success">{adminContext.state.message}</p> : null
            )}
            
            <button className="btn btn-primary">
                Add Question
            </button> 
        </form>
    )
}

export default AddQuestion;