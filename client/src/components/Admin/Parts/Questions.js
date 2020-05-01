import React, { useEffect, useContext, useState } from 'react';

import { AdminContext } from '../../../context/admin-context';

const Questions = props => {

    const [ state, setState ] = useState({
        editing: false,
        id: null,
        content: '',
        answerTime: ''
    });

    const adminContext = useContext(AdminContext);

    useEffect(() => {
        adminContext.getAllQuestions();
    }, []);

    const editQuestionInit = (id, content, answerTime) => {
        setState({
            ...state,
            editing: !state.editing,
            id,
            content,
            answerTime
        })
    }

    const formSubmitHandler = e => {
        e.preventDefault();

        adminContext.editQuestion(state.id, state.content, state.answerTime);
    }

    return (
        <React.Fragment>
            <table>
                <thead>
                    <tr>
                        <th>
                            Question Content
                        </th>
                        <th>
                            Answer Time
                        </th>
                        <th>
                            Edit
                        </th>
                        <th>
                            Delete
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {
                        adminContext.state.questions.map(question => (
                            <tr key={question._id}>
                                <td>
                                    {question.content}
                                </td>
                                <td>
                                    {question.answerTime}
                                </td>
                                <td className="pointer" onClick={() => editQuestionInit(question._id, question.content, question.answerTime)}>
                                    Edit
                                </td>
                                <td className="pointer" onClick={() => adminContext.deleteQuestion(question._id)}>
                                    Delete
                                </td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
            {state.editing && (
                <form className="form" onSubmit={formSubmitHandler} style={{ marginTop: '30px', paddingTop: '10px'}}>
                    <hr/>
                    <h4 className='admin-header'>
                        Edit Question
                    </h4>
                    <div className="form-control">
                        <label htmlFor="question">
                            Question 
                        </label>
                        <textarea 
                        id="question" 
                        name="question" 
                        rows="10"
                        value={state.content} 
                        onChange={e => setState({...state, content: e.target.value })}/>
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
                        Edit Question
                    </button> 
                </form>
            )}
        </React.Fragment>
    )
}

export default Questions;