import React, { useEffect, useState, useContext } from 'react';
import { UserContext } from '../App';
import { useParams, useHistory } from 'react-router-dom';
import { Button } from 'reactstrap';

const Profile = () => {

    const [ profile, setProfile ] = useState(null);
    const { state, dispatch } = useContext(UserContext);
    const { userid } = useParams();

    const history = useHistory();

    const [showfollow, setShowFollow] = useState(state? !state.following.includes(userid): true);

    useEffect(() => {
        fetch(`/user/${userid}`, {
            headers: {
                "Authorization": "bearer " + localStorage.getItem("jwt")
            }
        })
        .then((res) => res.json())
        .then((result) => {
            console.log(result)
            setProfile(result)
        })
    }, [])


    // follow user

    const followUser = () => {
        fetch('/user/follow', {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                followId: userid
            })
        })
        .then((res) => res.json())
        .then((data) => {
            console.log(data)
            dispatch({ type: "UPDATE", payload: {following: data.following, followers: data.followers}})
            localStorage.setItem("user", JSON.stringify(data))
            setProfile((prevState) => {
                return({
                    ...prevState,
                    user: {
                        ...prevState.user,
                        followers: [...prevState.user.followers, data._id]
                    }
                })
            })
            setShowFollow(false)
        })
    }

    // unfollow User

    const unfollowUser = () => {
        fetch('/user/unfollow', {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                unfollowId: userid
            })
        })
        .then((res) => res.json())
        .then((data) => {
            console.log(data)
            dispatch({ type: "UPDATE", payload: {following: data.following, followers: data.followers}})
            localStorage.setItem("user", JSON.stringify(data))
            setProfile((prevState) => {
                const newFollower = prevState.user.followers.filter((item => item !== data._id))
                return({
                    ...prevState,
                    user: {
                        ...prevState.user,
                        followers: newFollower
                    }
                })
            })
            setShowFollow(true)
        })
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
        {profile ?
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
                    src={profile.user.photo} alt={profile.user.username}
                />
            </div>
            <div className="col-8">
                <h3 style={{fontWeight: "350"}}>{profile.user.username}</h3>
                <h6 className="mt-3">{profile.user.email}</h6>
                <div className="info mt-3">
                    <div className="d-flex">
                        <h6 className="mr-3">{profile.posts.length} posts</h6>
                        <h6 className="mr-3">{profile.user.followers.length} followers</h6>
                        <h6>{profile.user.following.length} following</h6>
                    </div>
                </div>
                {
                    showfollow ?
                    <Button color="primary" style={{width: "80px", margin: "auto"}} className=" text-white mt-3"
                    onClick={() => followUser()}
                    >
                        Follow
                    </Button>
                    :
                    <Button color="primary" style={{width: "100px", margin: "auto"}} className=" text-white mt-3"
                    onClick={() => unfollowUser()}
                    >
                        Unfollow
                    </Button>
                }
            </div>
        </div>
        <div className="info1" style={{ margin: "10px 0"}} >
            <div style={{ display: "flex" , justifyContent: "space-between", width: "100%", borderBottom: "1px solid grey" }}>
                <h6>{profile.posts.length} posts</h6>
                <h6>{profile.user.followers.length} followers</h6>
                <h6>{profile.user.following.length} following</h6>
            </div>
        </div>
        
        <div className="gallery">
            {
                profile.posts.map(item => {
                    return(
                        <img onClick={() => onPostSelect(item._id)} key={item._id} className="item" src={item.photo} alt={item.title}/>
                    )
                })
            }
        </div>
    </div>
        :
        <div style={{margin: "100px 48%", display: "inline-block"}}>
            <div className="spinner-border text-primary mx-auto" role="status">
            <span className="sr-only">Loading...</span>
            </div>
        </div>}
        </>

    )
}

export default Profile;