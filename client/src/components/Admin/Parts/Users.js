import React, { useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { AdminContext } from '../../../context/admin-context';

const Users = props => {

    const adminContext = useContext(AdminContext);

    useEffect(() => {
        adminContext.getAllUsers();
    }, []);

    return (
        <table>
            <thead>
                <tr>
                    <th>
                        Email
                    </th>
                    <th>
                        User Type
                    </th>
                    <th>
                        Videos
                    </th>
                    <th>
                        Delete
                    </th>
                </tr>
            </thead>
            <tbody>
                {
                    adminContext.state.users.map(user => (
                        <tr key={user._id}>
                            <td>
                                {user.email}
                            </td>
                            <td>
                                {user.userType}
                            </td>
                            <td>
                                <Link to={`/admin/user/${user._id}`}>
                                    Videos
                                </Link>
                            </td>
                            <td className="pointer" onClick={() => adminContext.deleteUser(user._id)}>
                                Delete
                            </td>
                        </tr>
                    ))
                }
            </tbody>
        </table>
    )
}

export default Users;