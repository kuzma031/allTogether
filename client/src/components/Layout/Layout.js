import React from 'react';

import Header from '../Header/Header';
import Footer from '../Footer/Footer';

const Layout = props => {
    return (
        <main className="layout">
            <Header gradient={props.gradientHeader}/>
                <div className="layout-content">
                    {props.children}
                </div>
            <Footer withLogo />
        </main>
    )
}

export default Layout;