// complex component with combination of react hooks with browser MediaRecorder and mediaDevices api
// check this repo for more info on this api 
// https://gist.github.com/prof3ssorSt3v3/48621be79794a8a3adeed7971786d4d8
import React, { useReducer, useEffect, useRef, useContext } from 'react';

import { AppContext } from '../../context/app-context';

import Modal from '../Modal/Modal';

import './SingleQuestion.css';
import close from '../../assets/img/close.png';
import swap from '../../assets/img/swap.png';

const initialState = {
    cameraBlocked: false,
    cameraErrorMessage: '',
    cameraOpened: false,
    stream: null,
    mediaRecorder: undefined,
    recording: false,
    doneRecording: false,
    timer: 5, // will be changed by props
    cameraOptions: {
        audio: {
            latency: 0.02, 
            echoCancellation: false, 
            noiseSuppression: false,
            mozNoiseSuppression: false, 
            autoGainControl: false,
            mozAutoGainControl: false,
            volume: 1.0         
        }, 
        video: {
            facingMode: { 
                exact: 'user' 
            }
        }
    },
    fileToSend: null
}

const cameraReducer = (state, action) => {
    switch(action.type) {
        case 'CAMERA_OPEN':
            return {
                ...state,
                cameraOpened: true,
                mediaRecorder: new MediaRecorder(action.stream),
                stream: action.stream,
                timer: action.timer
            };
        case 'CHANGE_CAMERA': 
            return {
                ...state,
                mediaRecorder: undefined,
                stream: null,
                cameraOptions: {
                    ...state.cameraOptions,
                    video: {
                        ...state.cameraOptions.video,
                        facingMode: {
                            exact: action.camera
                        }
                    }
                }
            }
        case 'CAMERA_CLOSE': 
            return {
                ...state,
                cameraOpened: false,
                mediaRecorder: undefined,
                stream: null,
                recording: false,
                doneRecording: false,
                timer: action.timer
            }
        case 'START_RECORDING':
            return {
                ...state,
                recording: true
            }
        case 'STOP_RECORDING':
            return {
                ...state,
                recording: false,
                doneRecording: true
            }
        case 'RECORD_NEW':
            return {
                ...state,
                doneRecording: false,
                timer: action.timer
            }
        case 'UPDATE_TIMER':
            return {
                ...state,
                timer: action.timer
            }
        case 'CAMERA_BLOCKED':
            // show message that user cant use this app
            return {
                ...state,
                cameraOpened: false,
                mediaRecorder: undefined,
                stream: null,
                recording: false,
                doneRecording: false, 
                cameraBlocked: true,
                cameraErrorMessage: action.message
            };
        case 'CAMERA_BLOCKED_DISMISS':
            return {
                ...state,
                cameraBlocked: false,
                cameraErrorMessage: ''
            }
        case 'ADD_FILE': 
            return {
                ...state,
                fileToSend: action.file
            }
        default:
            throw new Error('Camera Reducer error');
    }
}

const SingleQuestion = props => {

    const appContext = useContext(AppContext);

    const cameraElement = useRef(null);
    const recordedVideo = useRef(null);

    const [ camera, dispatch ] = useReducer(cameraReducer, initialState);
    const { 
        cameraBlocked, 
        cameraErrorMessage,
        cameraOpened,
        stream, 
        timer, 
        mediaRecorder, 
        recording, 
        doneRecording, 
        cameraOptions,
        fileToSend
    } = camera;

    // camera support will be checked before init of this component

    const initCamera = () => {

        navigator.mediaDevices.getUserMedia(cameraOptions).
        then(stream => {
            dispatch({ type: 'CAMERA_OPEN', stream, timer: props.question.answerTime });
            cameraElement.current.srcObject = stream;
            // to disable echo of audio, mute vide src - it will be recorded!
            cameraElement.current.volume = 0; 
            cameraElement.current.muted = 0;
        })
        .catch(err => { // maybie user have camera support but permission is denied
            dispatch({ type: 'CAMERA_BLOCKED', message: `${err.name} ${err.message}` });
        });
    }

    const swapCameraHandler = () => {
        const camera = cameraOptions.video.facingMode.exact === 'user' ? 'environment' : 'user';
        stopCamera();
        dispatch({ type: 'CHANGE_CAMERA', camera });
    }

    // when facingMode in state changes user want to change camera
    // useEffect to track changes for facingMode
    // but first make sure it wont run on first render, because it will open camera on its own
    const firstRender = useRef(true);
    useEffect(() => {
        if(firstRender.current) {
            firstRender.current = false;
            return;
        }

        initCamera();
    }, [cameraOptions.video.facingMode.exact]); 
    
    const stopCamera = () => {
        if(stream) {
            stream.getTracks().forEach(val => {
                val.stop();
            });
        }
    }

    const closeCameraHandler = () => {
        stopCamera();
        dispatch({ type: 'CAMERA_CLOSE', timer: 5 }); 
    }

    // Video recording, start, stop and effect
    const recordVideoHandler =  () => {
        if(mediaRecorder.state !== 'recording') {
            dispatch({ type: 'START_RECORDING' }); 
            mediaRecorder.start();
        }
    }
    const stopVideoRecordingHandler = () => {
        if(mediaRecorder.state !== 'inactive') {
            dispatch({ type: 'STOP_RECORDING' });
            mediaRecorder.stop();
        }
    }
    
    // camera recording functionality
    useEffect(() => {
        if(mediaRecorder) {
            let chunks = [];
            mediaRecorder.onstart = () => {
                const newTimer = camera.timer - 1; 
                /* 
                    i dont fully understand behaviour of setinterval with useeffect and media recorder
                    the flow of counting: 
                    after 1 second with below function update_timer will change timer
                    when timer changes we have use effect bellow this use effect
                    that effect will setInterval for timer
                */
                setTimeout(() => {
                    dispatch({ type: 'UPDATE_TIMER', timer: newTimer });
                }, 1000 );                
            }

            // recording
            mediaRecorder.ondataavailable = e => {
                chunks.push(e.data);
            }
            // on stop we have object in memory, transfer it into file and put in state 
            mediaRecorder.onstop = async e => {
                const blob = new Blob( chunks, { 'type' : 'video/mp4;', lastModified: Date.now() });
                chunks = []; 
                const videoURL = window.URL.createObjectURL(blob); 
                // if clicked close icon when recording, recordedVideo.current will be null
                if(recordedVideo.current) {
                    recordedVideo.current.src = videoURL;
                }
                const file = new File([blob], `${appContext.state.auth.userEmail}-${Date.now()}` ); // this is file name

                dispatch({ type: 'ADD_FILE', file });
            }
        }
    }, [mediaRecorder]);  

    // timer functionality
    useEffect(() => {
        if(mediaRecorder && recording) { 
            // it will fire at start and we dont have mediaRecorder at start
            // also it will continue runing after 0, so check if recording variable is true
            if(timer === 0) {
                dispatch({ type: 'STOP_RECORDING' });
                mediaRecorder.stop();
            } else {
                let timerInterval;
                timerInterval = setInterval(() => {
                    dispatch({ type: 'UPDATE_TIMER', timer: timer - 1 });
                }, 1000);
    
                return () => {
                    clearInterval(timerInterval);
                }
            }
        }
    }, [timer]);

    // This effect will run when next question is inited in parent component
    // it will reset whole camera so user can see next question
    useEffect(() => {
        stopCamera();
        dispatch({ type: 'CAMERA_CLOSE', timer: props.question.answerTime });
    }, [props.currentQuestion]);

    const recordAgainHandler = () => {
        recordedVideo.current.src = null;
        cameraElement.current.srcObject = stream;
        dispatch({ type: 'RECORD_NEW', timer: props.question.answerTime });
    };

    const submitVideoHandler = () => props.submitAnswer(fileToSend);

    return (
        <div className="single-question">
            {cameraBlocked && <Modal type='camera' message={cameraErrorMessage} dismiss={() => dispatch({ type: 'CAMERA_BLOCKED_DISMISS'})} /> }
            {cameraOpened && (
                <div className="capture-container">
                    <div className="camera-cta">
                        <img src={close} onClick={closeCameraHandler} className='close-camera-icon' />
                        <div className="timer">
                            {!doneRecording && timer}
                        </div>
                        {!recording && !doneRecording && <img src={swap} onClick={swapCameraHandler} className='swap-camera-icon' /> }
                    </div>
                    <div className="video">
                        <video autoPlay ref={cameraElement} className={`${cameraOptions.video.facingMode.exact === 'environment' ? 'environment' : ''}`} />
                        {recording ?  <button className="camera-button recording btn btn-primary" onClick={stopVideoRecordingHandler}>Arrêter</button> : 
                        <button className={`camera-button btn btn-primary ${doneRecording ? 'hide' : ''}`} onClick={recordVideoHandler} >Commencer</button> }
                    </div>
                    <div className={`recorded-video ${doneRecording ? 'show' : ''}`}>
                        <video className="recorded" ref={recordedVideo} autoPlay loop className={`${cameraOptions.video.facingMode.exact === 'environment' ? 'environment' : ''}`} />
                        <button className="btn btn-danger repeat" onClick={recordAgainHandler}>
                            Reprendre
                        </button>
                        <button className="btn btn-primary submit" onClick={submitVideoHandler}>
                            Enregistrer
                        </button>
                    </div>
                </div>
            )}
            <p className="question-content">
                {props.question.content}
            </p>
            <button className="btn btn-primary" onClick={initCamera}>
                Répondre en vidéo
            </button>
        </div>
    )
};

export default SingleQuestion;