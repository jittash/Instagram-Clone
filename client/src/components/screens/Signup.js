import React, { useState, useEffect } from 'react'
import { Link, useHistory } from 'react-router-dom'
import M from 'materialize-css'

const Signup = () => {
    const history = useHistory()
    const [name, setname] = useState('');
    const [email, setemail] = useState('');
    const [password, setpassword] = useState('');
    const [image, setimage] = useState('')
    const [url, seturl] = useState('')
    //Execute only when pic is updated
    useEffect(()=>{
        if(url){
            uploadfields()
        }
    },[url])

    //  Function for profile pic if user has uploaded it
    const uploadPic = () =>{
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
    //  Function if user has not added profile pic
    const uploadfields = () =>{
        fetch('/signup', {
            method: "post",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: name,
                email: email,
                password: password,
                pic:url
            })
        }).then(res => res.json())
            .then(data => {
                if (data.error) {
                    M.toast({ html: data.error, classes: "#c62828 red darken-3" })
                    console.log(data)
                }
                else {
                    M.toast({ html: data.message, classes: "#43a047 green darken-1" })
                    //Navigating the user to login after successfull login
                    history.push('/signin')
                }
            }).catch(err => console.log(err))
    }

    //Making Network Request
    const Postdata = () => {
        if(image){
            uploadPic()
        }else{
            uploadfields()
        }    
    }

    return (
        <div className='mycard'>
            <div className='card auth-card .input-field'>
                <h2>Jitmagram</h2>
                <input type='text' placeholder='name'
                    value={name}
                    onChange={e => setname(e.target.value)} />
                <input type='text' placeholder='email'
                    value={email}
                    onChange={e => setemail(e.target.value)} />
                <input type='password' placeholder='password'
                    value={password}
                    onChange={e => setpassword(e.target.value)} />

                <div className="file-field input-field">
                    <div className="btn #64b5f6 blue darken-1">
                        <span>Upload Pic</span>
                        <input type="file" onChange={(e) => setimage(e.target.files[0])} />
                    </div>
                    <div className="file-path-wrapper">
                        <input className="file-path validate" type="text" />
                    </div>
                </div>

                <button className="btn waves-effect waves-light #64b5f6 blue darken-1"
                    onClick={() => Postdata()} >Signup
                </button>
                <h5><Link to='/signin' >Already have an Account?</Link></h5>
            </div>
        </div>
    );
}

export default Signup;