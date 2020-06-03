import React, { useContext } from 'react';
import { Link, useHistory } from 'react-router-dom'
import { userContext } from '../App';

const Navbar = () => {
    const history = useHistory()
    const { state, dispatch } = useContext(userContext)

    const renderList = () => {
        //State contains user details
        if (state) {
            return [
                <li><Link to="/profile">Profile</Link></li>,
                <li><Link to="/create">Add post</Link></li>,
                <li><Link to="/myfollowingpost">My following Posts</Link></li>,
                //Logout button
                <li>
                    <button className="btn #c62828 red darken-3"
                        onClick={() => {
                            localStorage.clear()
                            dispatch({ type: "CLEAR" })
                            history.push('/signin')
                        }}>Logout
            </button></li>
            ]
        }
        else {
            return [
                <li><Link to="/signin">Signin</Link></li>,
                <li><Link to="/signup">Signup</Link></li>
            ]
        }
    }
    return (
        <nav>
            <div className="nav-wrapper white">
                <Link to={state ? '/' : '/signin'} className="brand-logo">Jitmagram</Link>
                <ul id="nav-mobile" className="right hide-on-med-and-down">
                    {renderList()}

                </ul>
            </div>
        </nav>
    );
}

export default Navbar;