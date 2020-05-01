import React from 'react';

export const LogoWhite = props => {
    return <div className={`logo logo-white ${props.big ? 'logo-big' : 'logo-normal'}`}> <span className="all">All</span> <span className="together">Together</span> </div>
}

export const LogoGrey = props => {
    return <div className={`logo logo-grey`}> <span className="all">All</span> <span className="together">Together</span> </div>
}

export const LogoImage = props => {
    return <h2>Logo Image</h2>
}
