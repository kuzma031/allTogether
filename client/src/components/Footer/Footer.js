import React from 'react';

import { LogoGrey } from '../Logos/Logos';

import oze from '../../assets/img/oze.png';
import lifeShare from '../../assets/img/life_share.png';

const Footer = props => {

    return (
        <footer className={`footer ${props.withLogo ? 'with-logo' : ''}`}>
            {props.withLogo && (
                <LogoGrey />
            )}
            <div className="footer-content">
                <img src={oze} alt="oze logo"/>
                <img src={lifeShare} alt="life share logo"/>
            </div>
        </footer>
    )
}

export default Footer;