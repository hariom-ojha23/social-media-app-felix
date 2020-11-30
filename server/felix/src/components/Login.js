import React, { useState, useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { UserContext } from "../App"
import 'react-notifications/lib/notifications.css';
import {NotificationContainer, NotificationManager} from 'react-notifications';

const Login = () => {

    const {state, dispatch} = useContext(UserContext);
    const history = useHistory();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const postData = () => {
        fetch("/login", {
            method: "post",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username,
                password
            })
        })
        .then((res) => res.json())
        .then((data) => {
            console.log(data);
            if(data.err) {
                NotificationManager.error(data.err);
            }
            else{
                localStorage.setItem("jwt", data.token)
                localStorage.setItem("user", JSON.stringify(data.user))
                dispatch({type: "USER", payload: data.user})
                NotificationManager.success('Login Successfully');
                history.push('/');
            }
        })
        .catch((err) => {
            console.log(err);
        })
    }

    return(
        <>
            <div className="authenticate">
                <div className="shadow card auth-card">
                    <h1 className="title">Felix</h1>
                    <div>
                        <i className="material-icons mt-3">account_circle</i>
                        <input className="form-control" type="text" placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>

                    <div>
                        <i className="material-icons mt-3">lock</i>
                        <input className="form-control" type="password" placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button style={{width: "80px", margin: "auto"}} className="btn btn-primary mt-3"
                    onClick={() => postData()}
                    >
                        Login
                    </button>
                    <Link className="mt-3" to="/signup">
                        <h6>Don't have an account? Create one !</h6>
                    </Link>
                    <Link className="mt-3" to="/resetPassword">
                        <h6>Forgot Password</h6>
                    </Link>
                </div>
                <NotificationContainer/>
            </div>
        </>
    )
}

export default Login;