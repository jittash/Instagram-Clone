import React, { useState, useEffect, useContext } from 'react'
import { userContext } from '../../App'
import { Link } from 'react-router-dom'

const Home = () => {

    //Using context to get user details preventing a user like a post multiple times
    const { state, dispatch } = useContext(userContext)

    //Fetching posts
    const [data, setdata] = useState([])
    useEffect(() => {
        fetch('/allPost', {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        }).then(res => res.json())
            .then(result => {
                console.log(result)
                setdata(result.posts) //Result is an object containing posts array
            })
    }, [])

    //Network Request for like post
    const likePost = (id) => {
        fetch('/like', {
            method: 'put',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('jwt')
            },
            body: JSON.stringify({
                postId: id
            })
        }).then(res => res.json())
            .then(result => {
                //console.log(result)

                //To change likes value dynamically without refresh
                const newData = data.map(item => {
                    if (item._id === result._id)
                        return result
                    else
                        return item
                })
                setdata(newData)
            }).catch(err => console.log(err))
    }

    //Network Request for unlike post
    const unlikePost = (id) => {
        fetch('/unlike', {
            method: 'put',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('jwt')
            },
            body: JSON.stringify({
                postId: id
            })
        }).then(res => res.json())
            .then(result => {
                console.log(result)

                //To change likes value dynamically without refresh
                const newData = data.map(item => {
                    if (item._id === result._id)
                        return result
                    else
                        return item
                })
                setdata(newData)
            }).catch(err => console.log(err))
    }

    const makeComment = (text, postId) => {
        fetch('/comment', {
            method: 'put',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('jwt')
            },
            body: JSON.stringify({
                postId: postId,
                text: text
            })
        }).then(res => res.json())
            .then(result => {
                console.log(result)

                const newData = data.map(item => {
                    if (item._id === result._id)
                        return result
                    else
                        return item
                })
                setdata(newData)
            }).catch(err => console.log(err))
    }

    const deletePost = (postid) => {
        fetch(`/deletepost/${postid}`, {
            method: 'delete',
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('jwt')
            }
        }).then(res => res.json())
            .then(result => {
                console.log(result)

                const newData = data.filter(item => {
                    return item._id !== result._id
                })
                setdata(newData)
            })
    }


    return (
        <div className='home'>
            {
                //Map over posts to get each post
                data.map(item => {
                    return (
                        <div className='card home-card' key={item._id}>
                            <h5 style = {{ padding:'5px' }}>
                                <Link to={item.postedBy._id !== state._id ? '/profile/' + item.postedBy._id : '/profile'}>
                                    {item.postedBy.name}
                                </Link>

                                {
                                    //Check whether id of logged in user and post creator id is same
                                    item.postedBy._id === state._id
                                    && <i className='material-icons' style={{
                                        float: 'right'
                                    }}
                                        onClick={() => deletePost(item._id)}
                                    >delete</i>
                                }

                            </h5>

                            <div className='card-image'>
                                <img alt='' src={item.photo} />
                            </div>

                            <div className='card-content'>
                                <i className="material-icons" style={{ color: "red" }}>favorite</i>

                                {
                                    //Logic to prevent a user like a post multiple times

                                    item.likes.includes(state._id) ?
                                        <i class="material-icons"
                                            onClick={() => unlikePost(item._id)} >thumb_down</i>
                                        : <i class="material-icons"
                                            onClick={() => likePost(item._id)}>thumb_up</i>
                                }

                                <h6>{item.likes.length} likes</h6>
                                <h6>{item.title}</h6>
                                <p>{item.body}</p>

                                {
                                    item.comments.map(record => {
                                        return (
                                            <h6 key={record._id}><span style={{ fontWeight: "500" }}>{record.postedBy.name}</span>{record.text}</h6>
                                        )
                                    })
                                }

                                <form onSubmit={(e) => {
                                    e.preventDefault()
                                    makeComment(e.target[0].value, item._id)
                                }}>
                                    <input type='text' placeholder='Add a comment' />
                                </form>

                            </div>
                        </div>
                    );
                })
            }

        </div>
    );
}

export default Home;