import React from 'react';

const QuestionsLine = props => {

    let layout = [];
    for(let i = 0; i < props.total; i++) {
        layout.push(
            <span key={i} className={`${i < props.current ? 'done' : ''} ${i === props.current ? 'current' : ''}`}>
                {i + 1}
            </span>
        );
    }

    return (
        <div className="questions-line">
            <div className="questions-line-finished" style={{ width: `calc( (${props.total === props.current + 1 ? 100 : (100/props.total) * props.current}%) + ${props.current === 0 ? '0px' : '37px'} )` }} />
            {layout}
        </div>
    )
};

export default QuestionsLine;