import React, { useState, useEffect, useContext } from 'react'
import { userContext } from '../../App'
import { useParams } from 'react-router-dom'

const Profile = () => {
    const [userProfile, setProfile] = useState(null)
    const { state, dispatch } = useContext(userContext)
    const { userid } = useParams()
    //console.log(userid)
    const [showfollow, setshowfollow] = useState(state?!state.following.includes(userid):true)
    useEffect(() => {
        fetch(`/user/${userid}`, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        }).then(res => res.json())
            .then(result => {
                console.log(result)

                setProfile(result)
            })
    }, [])

    //Network Request to follow user
    const followUser = () => {
        fetch('/follow', {
            method: 'put',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('jwt')
            },
            body: JSON.stringify({
                followid: userid
            })
        }).then(res => res.json())
            .then(data => {
                console.log(data)
                dispatch({ type: "UPDATE", payload: { following: data.follwing, followers: data.followers } })
                localStorage.setItem('user', JSON.stringify(data))
                setProfile((prevState) => {

                    //Warning!Complicated logic below - update only followers in real time
                    return {
                        ...prevState,
                        user: {
                            ...prevState.user,
                            followers: [...prevState.user.followers, data._id]
                        }
                    }
                })
                setshowfollow(false)
            })
    }

    //Network Request to unfollow user
    const unfollowUser = () => {
        fetch('/unfollow', {
            method: 'put',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('jwt')
            },
            body: JSON.stringify({
                unfollowid: userid
            })
        }).then(res => res.json())
            .then(data => {
                //console.log(data)
                dispatch({ type: "UPDATE", payload: { following: data.follwing, followers: data.followers } })
                localStorage.setItem('user', JSON.stringify(data))

                setProfile((prevState) => {
                    const newFollower = prevState.user.followers.filter(item=>item !== data._id)
                    //Warning!Complicated logic below - update only followers in real time
                    return {
                        ...prevState,
                        user: {
                            ...prevState.user,
                            followers:  newFollower //[...prevState.user.followers, data._id]
                        }
                    }
                })
                setshowfollow(true)
            })
    }

    return (
        <>
            {userProfile ?
                <div style={{ maxWidth: "550px", margin: "0px auto" }}>
                    <div style={{

                        display: "flex",
                        justifyContent: "space-around",
                        margin: "18px 0px",
                        borderBottom: "1px solid grey"
                    }}>
                        <div>
                            <img style={{ width: "160px", height: "160px", borderRadius: "80px" }}
                                src={ userProfile.user.pic }
                                alt=""
                            />
                        </div>
                        <div>
                            <h4>{userProfile.user.name}</h4>
                            <h5>{userProfile.user.email}</h5>
                            <div style={{ display: "flex", justifyContent: "space-between", width: "108%" }}>
                                <h6>{userProfile.posts.length} Posts</h6>
                                <h6>{userProfile.user.followers.length} Followers</h6>
                                <h6>{userProfile.user.following.length} Following</h6>
                            </div>

                            {
                                showfollow ?
                                    <button style = {{
                                        margin:'10px'
                                    }}
                                    className="btn waves-effect waves-light #64b5f6 blue darken-1"
                                        onClick={() => followUser()}>Follow
                                    </button>
                                    :
                                    <button style = {{
                                        margin:'10px'
                                    }} 
                                    className="btn waves-effect waves-light #64b5f6 blue darken-1"
                                        onClick={() => unfollowUser()}>UnFollow
                                    </button>
                            }


                        </div>
                    </div>

                    <div className="gallery">
                        {userProfile.posts.map(item => {
                            return (
                                <img className='item' src={item.photo} alt={item.title} key={item._id} />
                            );
                        })}
                    </div>
                </div>
                :
                <h2>Loading!..</h2>}
        </>
    );
}

export default Profile;