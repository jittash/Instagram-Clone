import React, { useState, useEffect } from 'react'
import M from 'materialize-css'
import { useHistory } from 'react-router-dom'

const CreatePost = () => {
    const history = useHistory()
    const [title, settitle] = useState('')
    const [body, setbody] = useState('')
    const [image, setimage] = useState('')
    const [url, seturl] = useState('')

    //Callback function inside use effect will execute only when url is updated
    useEffect(() => {
        if (url) {

            //Network request to create post    
            fetch('/createPost', {
                method: "post",
                headers: {
                    "Content-Type": "application/json",
                    
                    //Passing Authorization to verify Login
                    "Authorization": "Bearer " + localStorage.getItem("jwt")
                },
                body: JSON.stringify({
                    title: title,
                    body: body,
                    url: url
                })
            }).then(res => res.json())
                .then(data => {
                    console.log(data);
                    if (data.error) {
                        M.toast({ html: data.error, classes: "#c62828 red darken-3" });
                    }
                    else {
                        M.toast({ html: "Post created success", classes: "#43a047 green darken-1" });
                        //Navigating the user to profile after successfull login
                        history.push('/');
                    }
                }).catch(err => console.log(err))
        }
    },[url])

    const postDetails = () => {
        //To upload files
        const data = new FormData()
        data.append("file", image)   //  append image
        data.append("upload_preset", "jitmagram")
        data.append("cloud_name", "mernc")
        //Network Request to API base url of cloud
        fetch("https://api.cloudinary.com/v1_1/mernc/image/upload", {
            method: "post",
            body: data
        }).then(res => res.json())
            .then(data => {
                seturl(data.url)
                //console.log(data)
            })
            .catch(err => {
                console.log(err)
            })

    }
    return (
        <div className='card input-field'>
            <input type='text' placeholder='title'
                value={title}
                onChange={(e) => settitle(e.target.value)}
            />
            <input type='text' placeholder='body'
                value={body}
                onChange={(e) => setbody(e.target.value)}
            />
            <div className="file-field input-field">
                <div className="btn #64b5f6 blue darken-1">
                    <span>Upload Image</span>
                    <input type="file" onChange={(e) => setimage(e.target.files[0])} />
                </div>
                <div className="file-path-wrapper">
                    <input className="file-path validate" type="text" />
                </div>
            </div>
            <button className="btn waves-effect waves-light #64b5f6 blue darken-1k"
                onClick={() => postDetails()}>Submit Post
            </button>
        </div>
    );
}
export default CreatePost