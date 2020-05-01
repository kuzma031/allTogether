import React, { useState, useEffect } from 'react';

import url from '../../../constants/apiUrl';

const Answers = props => {

    const [ state, setState ] = useState({
        fetching: true,
        questions: [],
        answers: []
    });

    const getAnswers = async () => {
        try {
            const id = props.match.params.id;

            const fetchAnswers = await fetch(`${url}/user/answers/${id}`);

            const res = await fetchAnswers.json();

            if(!res.success) {
                setState({
                    questions: [],
                    answers: [],
                    fetching: false
                });
            } else {
                setState({
                    questions: res.questions,
                    answers: res.answers,
                    fetching: false
                });
            }
        } catch(err) {
            setState({
                questions: [],
                answers: [],
                fetching: false
            });
        }
    }

    useEffect(() => {
        getAnswers();
    }, []);

    return !state.fetching ? (
        <div className="answers-container">
            {state.answers.length > 0 ? (
                state.questions.map(question => { 
                    const answer = state.answers.find(answer => answer.questionId === question._id);
                    return (
                        <div className="answer" key={question._id}>
                            <h5 className="question-header">{question.content}</h5>
                            <div className="answer-video">
                                {answer ? <video src={answer.mediaUrl} controls></video> : null}
                            </div>
                        </div>
                    )
                })
            ): <h4>no answers for this user</h4> }
        </div>
    ) : null
}

export default Answers;