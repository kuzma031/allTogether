import React from 'react';
import { Switch, Link, Route, Redirect } from 'react-router-dom';

import AddUser from './Parts/AddUser';
import Users from './Parts/Users';
import Questions from './Parts/Questions';
import AddQuestion from './Parts/AddQuestion';
import Answers from './Parts/Answers';
import Options from './Parts/Options';

import './Admin.css';

import AdminContextProvider from '../../context/admin-context';

const Admin = props => {
    return (
        <div className="admin-wrapper">
            <h2 className="text-center main-header">
                AllTogether Admin
            </h2>
            <div className="admin-container">
                <div className="admin-menu">
                    <ul>
                        <li>
                            <Link to='/admin'>All Users</Link>
                        </li>
                        <li>
                            <Link to='/admin/add-user'>Add User</Link>
                        </li>
                        <li>
                            <Link to='/admin/questions'>Questions</Link>
                        </li>
                        <li>
                            <Link to='/admin/add-question'>Add Question</Link>
                        </li>
                        <li>
                            <Link to='/admin/options'>Options</Link>
                        </li>
                    </ul>
                </div>
                <div className="admin-content">
                    <AdminContextProvider>
                        <Switch>
                            <Route exact path='/admin' component={Users} />
                            <Route path='/admin/add-user' component={AddUser} />
                            <Route path='/admin/questions' component={Questions} />
                            <Route path='/admin/add-question' component={AddQuestion} />
                            <Route path='/admin/user/:id' component={Answers} />
                            <Route path='/admin/options' component={Options} />
                            <Redirect from ='*' to ='/admin' />
                        </Switch>
                    </AdminContextProvider>
                </div>
            </div>
        </div>
    )
}

export default Admin;