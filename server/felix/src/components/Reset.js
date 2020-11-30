import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import 'react-notifications/lib/notifications.css';
import {NotificationContainer, NotificationManager} from 'react-notifications';

const ResetPassword = () => {

    const history = useHistory();
    const [email, setEmail] = useState("");

    const postData = () => {
        fetch("/password-reset", {
            method: "post",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email
            })
        })
        .then((res) => res.json())
        .then((data) => {
            if(data.err) {
                NotificationManager.error(data.err);
            }
            else{
                NotificationManager.success(data.message);
                history.push('/login');
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
                        <i className="material-icons mt-3">email</i>
                        <input className="form-control" type="email" placeholder="Enter Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <button style={{width: "150px", margin: "auto"}} className="btn btn-primary mt-3"
                    onClick={() => postData()}
                    >
                        Reset Password
                    </button>
                </div>
                <NotificationContainer/>
            </div>
        </>
    )
}

export default ResetPassword;