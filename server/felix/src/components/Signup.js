import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import 'react-notifications/lib/notifications.css';
import {NotificationManager} from 'react-notifications';

const SignUp = () => {

    const history = useHistory();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [url, setUrl] = useState(undefined);
    const [image, setPhoto] = useState("");
        
    useEffect(() => {
        if(url) {
            uploadFields()
        }
    },[url])

    const uploadPic = () => {
        const data = new FormData();
        data.append("file", image);
        data.append("upload_preset", "felix23");
        data.append("cloud_name", "harry23");
        fetch("https://api.cloudinary.com/v1_1/harry23/image/upload", {
            method: "post",
            body: data,
        })
        .then((res) => res.json())
        .then((data) => {
            setUrl(data.url);
        })
        .catch((err) => {
            console.log(err);
        })
    }

    const uploadFields = () => {
        if (!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)) {
            NotificationManager.error('Invalid Email');
            return;
        }
        fetch("/signup", {
            method: "post",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username,
                password,
                email,
                photo: url
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

    const postData = () => {
        if(image) {
            uploadPic()
        }
        else{
            uploadFields()
        }
        
    }

    const change = (file) => {
        setPhoto(file);
        document.getElementById("validate").innerHTML = file.name
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
                    <i className="material-icons mt-3">mail</i>
                    <input className="form-control" type="email" placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                </div>

                <div>
                    <i className="material-icons mt-3">lock</i>
                    <input className="form-control" type="password" placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <div>
                    {/* <div id="upload-file" className="mt-4">
                        <label className="mr-3">Profile Photo</label>
                        <input id="uploadImage" type="file"
                        onChange={(e) => setPhoto(e.target.files[0])}
                        />
                    </div> */}
                    <div className="custom-file mt-4">
                        <input type="file" className="custom-file-input" id="uploadFile" onChange={(e) => change(e.target.files[0])}></input>
                        <label id="validate" className="custom-file-label" htmlFor="uploadFile">Profile Photo</label>
                    </div>
                </div>
                <button style={{width: "80px", margin: "auto"}} className="btn btn-primary mt-3"
                    onClick={() => postData()}
                    >
                        SignUp
                </button>
                <Link className="mt-3" to="/login">
                    <h6>ALready have an account ?</h6>
                </Link>
            </div>
        </div>
        </>
    )
}

export default SignUp;