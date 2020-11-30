import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../App';
import { Link, useHistory } from 'react-router-dom';


const Explore = () => {

    const [data, setData] = useState([]);
    const [show, setShow] = useState(false);

    const { state, dispatch }  = useContext(UserContext);
    const history = useHistory()

    const toggle = () => setShow(!show);

    useEffect(() => {
        fetch('/post/newsfeed', {
            headers: {
                "Authorization": "bearer " + localStorage.getItem("jwt")
            }
        })
        .then((res) => res.json())
        .then((result) => {
            console.log(result.posts)
            setData(result.posts)
        })
        .catch((err) => console.log(err))
    }, []);

    //for like and dislike

    const Like = (id) => {
        fetch('/post/like', {
            method: 'put',
            headers: {
                "Content-Type": "application/json",
                "Authorization": "bearer " + localStorage.getItem("jwt")
            },
            body : JSON.stringify({
                postId: id
            })
        })
        .then((res) => res.json())
        .then((result) => {
            const newData = data.map((item) => {
                if(item._id === result._id) {
                    return result
                }
                else {
                    return item
                }
            })
            setData(newData)
        })
        .catch((err) => console.log(err))
    }

    const Unlike = (id) => {
        fetch('/post/unlike', {
            method: 'put',
            headers: {
                "Content-Type": "application/json",
                "Authorization": "bearer " + localStorage.getItem("jwt")
            },
            body : JSON.stringify({
                postId: id
            })
        })
        .then((res) => res.json())
        .then((result) => {
            const newData = data.map((item) => {
                if(item._id === result._id) {
                    return result
                }
                else {
                    return item
                }
            })
            setData(newData)
        })
        .catch((err) => console.log(err))
    }

    // for add Comment

    const addComment = (text, postId) => {
        fetch('/post/comment', {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                postId,
                text
            })
        })
        .then((res) => res.json())
        .then((result) => {
            console.log(result)
            const newData = data.map((item) => {
                if(item._id === result._id) {
                    return result
                }
                else {
                    return item
                }
            })
            setData(newData)
        })
        .catch((err) => console.log(err))
    }

    // for deleting a post
    
    const deletePost = (postid) => {
        fetch('/post/delete/' + postid, {
            method: "delete",
            headers: {
                Authorization: "bearer " + localStorage.getItem("jwt")
            }
        })
        .then((res) => res.json())
        .then((result) => {
            console.log(result)
            const newData = data.filter(item => {
                return (item._id !== result._id)
            })
            setData(newData)
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
            <div className="posts">
            {   
                data.map((item) => {
                    return(
                        <div key={item._id} className="shadow-sm card home-card">
                            <div style={{padding: "10px 10px 0", display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                                <h6 style={{fontWeight: "500"}}>
                                    <Link className="link" to={ item.author._id !== state._id? `/profile/${item.author._id}`: "/profile" }>
                                        <img className="rounded-circle mr-2 dp" style={{width: "7%"}} src={item.author.photo} alt={item.author.username}></img>
                                        {item.author.username}
                                    </Link>
                                </h6>
                                {
                                    show?
                                    <div className="d-flex">
                                        <i className="material-icons mr-3">mode_edit</i>
                                        <i className="material-icons" onClick={() => {
                                            deletePost(item._id)
                                            toggle()
                                        }}>delete</i>
                                    </div> :
                                    <div>
                                    {item.author._id === state._id && <i style={{fontWeight: "500"}} className="material-icons"
                                    // onClick={() => deletePost(item._id)}
                                    onClick={() => toggle()}
                                    >more_horiz</i>}
                                    </div> 
                                }
                            </div>
                            <div>
                                <img className="card-img" src={item.photo} alt="post" />
                            </div>
                            <div className="card-body">

                                {item.likes.includes(state._id) 
                                ?
                                <i className="material-icons mr-2" style={{color: "red", fontSize: "28px"}}
                                onClick={() => (Unlike(item._id))}
                                >favorite</i> 
                                : 
                                <i className="material-icons mr-2" style={{fontSize: "28px"}}
                                onClick={() => (Like(item._id))}
                                >favorite_border</i>
                                }
                                <i className="material-icons"  style={{fontSize: "26px"}} onClick={() => onPostSelect(item._id)}>chat_bubble_outline</i>

                                <h6 style={{fontWeight: "500"}}>{item.likes.length} likes</h6>
                                <h6 style={{fontWeight: "450"}}><span style={{fontWeight: "500"}}>{item.author.username}</span> {item.title}</h6>
                                <p>all comments . .</p>
                                {
                                    item.comments.map((record) => {
                                        return(
                                            <h6 style={{fontWeight: "450"}} key={record._id}>
                                                <span style={{fontWeight: "500"}}>{record.author.username}</span> {record.text}
                                            </h6>
                                        )
                                    })
                                }
                                <form onSubmit={(e) => {
                                    e.preventDefault()
                                    addComment(e.target[0].value, item._id)
                                    e.target.reset()
                                }}>
                                    <input type="text" className="form-control" placeholder="Add Comment" />
                                </form>
                            </div>
                        </div>
                    )
                })
            }
            </div>
        </>
        
    )
}

export default Explore;