import React, { useEffect, useState, useContext } from 'react';
import { UserContext } from '../App';
import { Modal, ModalBody, ModalHeader } from 'reactstrap';
import { useHistory } from 'react-router-dom';


const Profile = () => {

    const [ photo, setPhoto ] = useState([]);
    const { state, dispatch } = useContext(UserContext)
    const [modal, setModal] = useState(false);
    const [image, setImage] = useState("")

    const history = useHistory();

    const toggle = () => setModal(!modal);

    useEffect(() => {
        fetch('/post/mypost', {
            headers: {
                "Authorization": "bearer " + localStorage.getItem("jwt")
            }
        })
        .then((res) => res.json())
        .then((result) => {
            setPhoto(result.post)
        })
    }, [])

    useEffect(() => {
        if(image) {
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
                console.log(data)
                fetch('/user/updatePhoto', {
                    method: "put",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": "bearer " + localStorage.getItem("jwt")
                    },
                    body: JSON.stringify({
                        photo: data.url
                    })
                })
                .then((res) => res.json())
                .then((result) => {
                    localStorage.setItem("user", JSON.stringify({...state, photo: result.photo}))
                    dispatch({type: "UPDATEPHOTO", payload: result.photo})
                })
                .catch((err) => {
                    console.log(err)
                })
            })
            .catch((err) => {
                console.log(err);
            })
        }
    }, [image])

    const change = (file) => {
        setImage(file);
        document.getElementById("validate").innerHTML = file.name;
        toggle();
    }

    const onPostSelect = (postid) => {
        console.log(postid)
        const path = `/post/${postid}`;
        history.push({
            pathname: path,
            state: {postid}
        })
    }

    return(
        <>
        {
            state? 
            <div className="container profile">
            <div className="info2" style={{
                display: "flex",
                justifyContent: "space-around",
                margin: "20px 0px 0px",
                borderBottom: "1px solid grey",
                padding: "10px 0"
            }}>
                <div className="col-4 profile-pic">
                    <img className="profile-pic" style={{width: "160px", height: "160px", borderRadius: "50%"}}
                        src={state? state.photo:". . ."} alt={state? state.username: "loading.."}
                    />
                </div>
                <div className="col-8"> 
                    <h3 style={{fontWeight: "350"}}>{state? state.username: "loading.."}</h3>
                    <h6 className="mt-3">{state? state.email: "loading.."}</h6>
                    <div className="info mt-3">
                        <div className="d-flex">
                            <h6 className="mr-3">{state? photo.length: "0"} posts</h6>
                            <h6 className="mr-3">{state? state.followers.length: "0"} followers</h6>
                            <h6>{state? state.following.length: "0"} following</h6>
                        </div>
                    </div>
                    <i onClick={toggle} className=" material-icons mt-3">mode_edit</i>
                    
                </div>
            </div>
            <div className="info1" style={{ margin: "10px 0"}} >
                <div style={{ display: "flex" , justifyContent: "space-between", width: "100%", borderBottom: "1px solid grey" }}>
                    <h6>{state? photo.length: "0"} posts</h6>
                    <h6>{state? state.followers.length: "0"} followers</h6>
                    <h6>{state? state.following.length: "0"} following</h6>
                </div>
            </div>
            
            <div className="gallery">
                {
                    photo.map(item => {
                        return(
                            <img onClick={() => onPostSelect(item._id)} key={item._id} key={item._id} className="item" src={item.photo} alt={item.title}/>
                        )
                    })
                }
            </div>
        </div>
        :
        <div style={{margin: "100px 46%", display: "inline-block"}}>
            <div className="spinner-border text-primary mx-auto" role="status">
            <span className="sr-only">Loading...</span>
            </div>
        </div>
        }
        <Modal centered isOpen={modal} toggle={toggle} fade={true}>
            <ModalHeader>Edit Information</ModalHeader>
            <ModalBody>
                <h5>Change Profile Pic</h5>
                    <div>
                        <div className="col-12">
                            <div>
                                <div className="custom-file mt-4">
                                    <input type="file" className="custom-file-input" id="uploadFile"
                                        onChange={(e) => change(e.target.files[0])}
                                    />
                                    <label id="validate" className="custom-file-label" htmlFor="uploadFile">Profile Photo</label>
                                </div>
                            </div>
                        </div>
                    </div>
                </ModalBody>
        </Modal>
        </>

    )
}

export default Profile;