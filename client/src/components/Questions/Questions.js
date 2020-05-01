import React, { useReducer, useEffect, useContext, useMemo } from 'react';

import { AppContext } from '../../context/app-context';
import url from '../../constants/apiUrl';

import Layout from '../Layout/Layout';
import QuestionsLine from './QuestionsLine';
import SingleQuestion from './SingleQuestion';
import Modal from '../Modal/Modal';

import failImage from '../../assets/img/fail.png';
import spinner from '../../assets/img/spinner.svg';

const initialState = {
    started: false,
    currentQuestion: undefined, // will be changed
    questionsList: [],
    answers: [],
    uploading: false,
    uploadFinished: false,
    
    uploadMessage: '',
    uploadFail: false 
}

const questionsReducer = (state,action) => {
    switch(action.type) {
        case 'INIT_QUESTIONS':
            return {
                ...state,
                currentQuestion: action.answers.length,
                questionsList: action.questions,
                answers: action.answers,
                started: action.answers.length > 0 ? true : false, // if we get some answers from server, user already started answering before
                uploading: false,
                uploadMessage: ''
            }
        case 'START':
            return {
                ...state,
                started: true 
            }
        case 'NEXT_QUESTION':
            return {
                ...state,
                currentQuestion: state.currentQuestion + 1,
                uploading: false,
                uploadMessage: '',
                uploadFinished: false
            }
        case 'UPLOAD_FAIL': 
            return {
                ...state,
                uploadFail: true,
                uploadMessage: action.message
            }
        case 'UPLOAD_SUCCESS':
            return {
                ...state,
                answers: state.answers.concat(action.answer)
            }
        default: 
            throw new Error('questions error');
    }
}

const Questions = props => {

    const [ state, dispatch ] = useReducer(questionsReducer, initialState);
    const appContext = useContext(AppContext);
    
    // at start get questions from server
    useEffect(() => {
        appContext.checkCameraSupport();
        const questions = appContext.state.questions;
        const answers = appContext.state.answers;
        dispatch({ type: 'INIT_QUESTIONS', questions, answers });
    }, []);

    const initQuestionsHandler = () => {
        dispatch({ type: 'START' });
    }

    // layout at start
    const firstStepLayout = (
        <div className="question-container">
            <h3 className="big-heading">
                {appContext.state.options.startMessage.heading}
            </h3>
            <div className="instructions" dangerouslySetInnerHTML={{ __html: appContext.state.options.startMessage.message }} />
            <button className="btn btn-primary" onClick={initQuestionsHandler}>
                Démarrer
            </button>
        </div>
    );

    // layout at end of quizz
    const lastStepLayout = (
        <div className="question-container">
            {
                state.questionsList.length !== state.answers.length ? 
                (
                    <React.Fragment>
                        <p className="uploading-message">Veuillez patienter, upload en cours…</p>
                        <img src={spinner} alt="spinner" className="spinner" />
                    </React.Fragment>
                ) :
                (
                    <React.Fragment>
                        <h3 className="big-heading">
                            {appContext.state.options.endMessage.heading}
                        </h3>
                        <div className="instructions" dangerouslySetInnerHTML={{ __html: appContext.state.options.endMessage.message }} />
                    </React.Fragment>
                )
            }
        </div>
    );

    // Single question
    const submitAnswerHandler = async file => {
        // next questions is started and upload is happening in the background
        dispatch({ type: 'NEXT_QUESTION' });

        try {
            const formData = new FormData();
            
            formData.append('answer', file);
            formData.append('question', state.questionsList[state.answers.length]._id);

            const sendFile = await fetch(`${url}/user/submit-answer`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: formData,
                
            });

            const res = await sendFile.json();

            if(res.success) {
                dispatch({ type: 'UPLOAD_SUCCESS', answer: res.answer });
            } else {
                const message = (
                    <React.Fragment>
                        <p>Erreur de téléversement</p>
                        <p>{res.message}</p>
                        <span>
                            Erreur de connexion au serveur, veuillez contacter l'administrateur
                        </span>
                    </React.Fragment>
                );
                dispatch({ type: 'UPLOAD_FAIL', message });
            }

        } catch(err) {
            const message = (
                <React.Fragment>
                    <p>Erreur de téléversement.</p>
                    <p>{`${err.name} ${err.message}`}</p>
                    <span>
                        Erreur de connexion au serveur, veuillez contacter l'administrateur
                    </span>
                </React.Fragment>
            );
            dispatch({ type: 'UPLOAD_FAIL', message });
        }
    }
    
    const questionLine = useMemo(() => {
        return <QuestionsLine current={state.currentQuestion} total={state.questionsList.length}  />
    }, [state.currentQuestion]);

    return (
        <Layout>
            <div className="questions">
                {
                    !state.started ?  firstStepLayout : ( // no answers on server and its not started in state 
                        appContext.state.cameraSupport ? (
                            state.questionsList.length !== state.currentQuestion ? ( // if answers are equal to questions we are at the last step
                                <React.Fragment>
                                    {questionLine}
                                    {state.questionsList.length === 0 ? (
                                        <h2>No questions yet. Wait for administrator to add them</h2>
                                    ) : (
                                        <SingleQuestion 
                                        question={state.questionsList[state.currentQuestion]} 
                                        currentQuestion={state.currentQuestion}
                                        submitAnswer={submitAnswerHandler} /> 
                                    )}
                                </React.Fragment>
                            ) : lastStepLayout 
                        ) : (
                            <div className="no-camera">
                                <img src={failImage} alt="fail" className="fail-image" />
                                <h4>
                                    Votre appareil n’est pas compatible avec cette version !
                                </h4>
                                <p>
                                    Merci de verifier que votre navigateur accepte le partage de la camera et que votre connexion est securisée
                                </p>
                            </div>
                        )
                    )
                }
                {state.uploadFail && <Modal type='uploading' message={state.uploadMessage} dismiss={() => window.location.reload()}/>}
                <button onClick={appContext.logout} className="logout-btn">Déconnexion</button>
            </div>
        </Layout>
    )
}

export default Questions;