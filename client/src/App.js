import React, { useEffect, useContext } from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';

import { AppContext } from './context/app-context';

import Open from './components/Open/Open';
import Questions from './components/Questions/Questions';
import Login from './components/Auth/Login';
import ForgotPassword from './components/Auth/ForgotPassword';
import PasswordReset from './components/Auth/PasswordReset';

import Admin from './components/Admin/Admin';

const App = () => {

    const appContext = useContext(AppContext);

    const auth = appContext.state.auth;
    useEffect(() => {
        const token = localStorage.getItem('token');
        appContext.getUser(token);
    }, []);

    return !auth.fetching ? ( 
        <Router>
            {auth.loggedIn ? (
                <Switch>
                    <Route exact path='/'>
                        <Questions />
                    </Route>
                    {auth.userType === 'admin' && <Route path='/admin' component={Admin} />}
                    <Redirect from="*" to="/" />
                </Switch>
            ) : (
                <Switch>
                    <Route path='/password-reset/:token' component={PasswordReset} />
                    <Route path='/login' component={Login} />
                    <Route path='/forgot-password' component={ForgotPassword} />
                    <Redirect from="*" to="/login" />
                </Switch>
            )}
        </Router>
    ) : <Open />

}

export default App;