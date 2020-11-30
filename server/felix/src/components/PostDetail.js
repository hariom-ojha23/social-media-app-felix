import React, { useState, useEffect, useContext } from 'react';
import { Link, useParams } from 'react-router-dom';
import { UserContext } from '../App';

const PostDetail = () => {

    const { state, dispatch }  = useContext(UserContext);

    const [ Post, setPost ] = useState([]);
    const {postid} = useParams();

    useEffect(() => {
        fetch(`/post/${postid}`, {
            headers: {
                "Authorization": "bearer " + localStorage.getItem("jwt")
            }
        })
        .then((res) => res.json())
        .then((result) => {
            console.log(result.post)
            setPost(result.post);
        })
        .catch((err) => console.log(err))
    }, [])

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
            const newData = Post.map((item) => {
                if(item._id === result._id) {
                    return result
                }
                else {
                    return item
                }
            })
            setPost(newData)
            console.log(Post)
        })
        .catch((err) => console.log(err))
    }

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
            const newData = Post.map((item) => {
                if(item._id === result._id) {
                    return result
                }
                else {
                    return item
                }
            })
            setPost(newData)
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
            const newData = Post.map((item) => {
                if(item._id === result._id) {
                    return result
                }
                else {
                    return item
                }
            })
            setPost(newData)
        })
        .catch((err) => console.log(err))
    }

    return(
        <div>
            {
                Post?
                Post.map((item) => {
                    return(
                        <div key={item._id} className="container1">
                            <div className="postDetail">
                                <div className="col-12 d-flex">
                                    <div className="imgCard card d-none d-md-flex justify-content-center col-md-7 col-lg-8 p-0">
                                        <img className="card-img" src={item.photo} alt="post" />
                                    </div>
                                    <div className="commentCard card col-12 col-md-5 col-lg-4  p-0">
                                        <div style={{padding: "10px 10px 0", display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                                            <h6 style={{fontWeight: "500"}}>
                                                <Link className="link" to={ item.author._id !== state._id? `/profile/${item.author._id}`: "/profile" }>
                                                    <img className="rounded-circle mr-2 dp" style={{width: "10%"}} src={ item.author.photo} alt={ item.author.username}></img>
                                                    { item.author.username}
                                                </Link>
                                            </h6>
                                        </div><hr style={{margin: "0"}} />
                                        <div style={{minHeight: "300px", maxHeight: "300px", overflow: "auto"}}>
                                            {
                                                item.comments.map((record) => {
                                                    return(
                                                        <h6 className="p-2" style={{fontWeight: "450", fontSize: "15px"}} key={record._id}>
                                                            {record.author.photo} <span className="mr-2" style={{fontWeight: "500"}}>{record.author.username}</span> {record.text}
                                                        </h6>
                                                    )
                                                })
                                            }
                                        </div><hr style={{margin: "0"}} />

                                        <div className="p-2">
                                            {item.likes.includes(state._id) 
                                            ?
                                            <i className="material-icons" style={{color: "red", fontSize: "28px"}}
                                            onClick={() => (Unlike(item._id))}
                                            >favorite</i> 
                                            : 
                                            <i className="material-icons" style={{fontSize: "28px"}}
                                            onClick={() => (Like(item._id))}
                                            >favorite_border</i>
                                            }

                                            <h6 style={{fontWeight: "500"}}>{item.likes.length} likes</h6>
                                        </div><hr style={{margin: "0"}} />

                                        <div className="p-2">
                                            <form onSubmit={(e) => {
                                                e.preventDefault()
                                                addComment(e.target[0].value, item._id)
                                                e.target.reset()
                                        
                                            }}>
                                                <input type="text" className="form-control" placeholder="Add Comment" />
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <hr />
                        </div>
                    )
                })
                :
                <div style={{margin: "100px 45%", display: "inline-block"}}>
                    <div className="spinner-border text-primary mx-auto" role="status">
                    <span className="sr-only">Loading...</span>
                    </div>
                </div>
            }
        </div>
        
    );
}

export default PostDetail;





        