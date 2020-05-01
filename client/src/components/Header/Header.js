import React, { useContext } from 'react';

import { AppContext } from '../../context/app-context';

import { LogoWhite } from '../Logos/Logos';

import lifeShare from '../../assets/img/life_share.png';

const Header = props => {

    const appContext = useContext(AppContext);
    const logo = appContext.state.options.logo;

    return (
        <header className={`header ${props.gradient ? 'gradient' : ''}`}>
            {
                props.gradient ? (
                    <React.Fragment>
                        <LogoWhite />
                        <div className="by">
                            <span>
                                by
                            </span>
                            <img src={lifeShare} alt="life share logo"/>
                        </div>
                    </React.Fragment>
                ) : (
                    <img src={logo} alt="rma logo" className="app-logo"/>
                )
            }
        </header>
    )
}

export default Header;