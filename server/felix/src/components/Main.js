import React, { useEffect, useContext } from 'react';
import NavbarComponent from './Navbar';
import { Switch, Redirect, Route, useHistory } from 'react-router-dom';
import Home from './Home';
import Login from './Login';
import Profile from './Profile';
import SignUp from './Signup';
import CreatePost from './createPost';
import Explore from './Explore';
import UserProfile from './UserProfile';
import PostDetail from './PostDetail';
import ResetPassword from './Reset';
import NewPassword from './NewPassword';
import { UserContext } from '../App';
import { NotificationContainer } from 'react-notifications';



const Routing = () => {

    const history = useHistory();
    const {state, dispatch} = useContext(UserContext)
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"))
        if(user) {
            dispatch({ type: "USER", payload: user})
        }
        else {
            if(!history.location.pathname.startsWith('/resetPassword')) {
                history.push('/login')
            }
        }
    },[])


    return(
        <Switch>
            <Route exact path="/"><Home /></Route>
            <Route path="/create"><CreatePost /></Route>
            <Route path="/login" ><Login /></Route>
            <Route path="/signup"><SignUp /></Route>
            <Route exact path="/profile"><Profile /></Route>
            <Route exact path="/post/:postid"><PostDetail /></Route>
            <Route path="/profile/:userid"><UserProfile /></Route>
            <Route path="/explore"><Explore /></Route>
            <Route exact path="/resetPassword"><ResetPassword /></Route>
            <Route path="/resetPassword/:token"><NewPassword /></Route>
            <Redirect to="/" />
        </Switch>
    )
}



const Main = () => {

    return(
        <div>
            <NavbarComponent />
            <Routing />
            <NotificationContainer/>
        </div>
    );
}

export default Main;