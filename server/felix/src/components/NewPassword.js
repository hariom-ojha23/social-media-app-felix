import React, { useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import 'react-notifications/lib/notifications.css';
import {NotificationContainer, NotificationManager} from 'react-notifications';

const NewPassword = () => {

    const history = useHistory();
    const [password, setPassword] = useState("");
    const {token} = useParams();
    
    const postData = () => {
        fetch("/newPassword", {
            method: "post",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                password,
                token
            })
        })
        .then((res) => res.json())
        .then((data) => {
            console.log(data);
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
                        <i className="material-icons mt-3">lock</i>
                        <input className="form-control" type="password" placeholder="Enter new password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button style={{width: "80px", margin: "auto"}} className="btn btn-primary mt-3"
                    onClick={() => postData()}
                    >
                        Submit
                    </button>
                </div>
                <NotificationContainer/>
            </div>
        </>
    )
}

export default NewPassword;