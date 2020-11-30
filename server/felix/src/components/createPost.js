import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import 'react-notifications/lib/notifications.css';
import {NotificationManager} from 'react-notifications';

const CreatePost = () => {

    const history = useHistory();
    const [title, setTitle] = useState("");
    const [photo, setPhoto] = useState("");
    const [url, setUrl] = useState("");
    
    useEffect(() => {
        if(url) {
            fetch("/post/create", {
                method: "post",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "bearer " + localStorage.getItem("jwt")
                },
                body: JSON.stringify({
                    title,
                    photo: url
                })
            })
            .then((res) => res.json())
            .then((data) => {
                if(data.err) {
                    NotificationManager.error(data.err);
                }
                else{
                    NotificationManager.success("Post Created Successfully !!");
                    history.push('/explore');
                }
            })
            .catch((err) => {
                console.log(err);
            })
        }
    },[url])

    const change = (file) => {
        setPhoto(file);
        document.getElementById("validate").innerHTML = file.name
    }

    const postDetails = () => {
        const data = new FormData();
        data.append("file", photo);
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

    return(
        <>
        <div className="create">
            <div className="card input-filled"
            style={{
                margin: "30px auto",
                maxWidth: "500px",
                padding: "20px",
                textAlign: "center"
            }}
            >
                <h4 className="card-title">Create Post</h4><hr />
                <div className="mt-4">
                    <input className="form-control" type="text" placeholder="Caption" 
                    value={title}
                    onChange={(e) => {
                        setTitle(e.target.value)
                    }}
                />
                </div>
                <div>
                    <div className="custom-file mt-4">
                        <input type="file" className="custom-file-input" id="uploadFile" onChange={(e) => change(e.target.files[0])}></input>
                        <label id="validate" className="custom-file-label" htmlFor="uploadFile">Upload Image</label>
                    </div>
                </div>
                <button style={{width: "40%", margin: "20px auto"}} className="btn btn-primary" 
                    onClick={() => postDetails() }
                >
                    Create Post
                </button>
            </div>
        </div>
        </>
    )
}

export default CreatePost;