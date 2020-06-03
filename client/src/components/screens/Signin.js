import React, { useState,useContext } from 'react'
import { Link, useHistory } from 'react-router-dom'
import M from 'materialize-css'
import { userContext } from '../../App'

const Signin = () => {
    const { state,dispatch } = useContext(userContext)
    const history = useHistory()
    const [email, setemail] = useState('');
    const [password, setpassword] = useState('');
    //Making Network Request
    const PostData = () => {
        fetch('/signin', {
            method: "post",
            headers:{
                "Content-Type":"application/json",
            },
            body:JSON.stringify({
                email: email,
                password: password
            })
        }).then(res=>res.json())
        .then(data=>{
            console.log(data);
            if(data.error){
                M.toast({html: data.error,classes:"#c62828 red darken-3"});
            }
            else{
                //Saving token and user details in local storage
                localStorage.setItem("jwt",data.token)
                localStorage.setItem("user",JSON.stringify(data.user))
                //Dispatch will go to reducer
                dispatch({ type:'USER',payload:data.user })
                M.toast({html: "Signed in success",classes:"#43a047 green darken-1"});

                //Navigating the user to profile after successfull login
                history.push('/');
            }      
        }).catch(err=>console.log(err))
    }
    return (
        <div className='mycard'>
            <div className='card auth-card .input-field'>
                <h2>Jitmagram</h2>
                <input type='text' placeholder='Email'
                    value={email}
                    onChange={(e) => setemail(e.target.value)} />
                <input type='password' placeholder='Password'
                    value={password}
                    onChange={(e) => setpassword(e.target.value)}
                />

                <button className="btn waves-effect waves-light #64b5f6 blue darken-1"
                    onClick={() => PostData()}>Login
                </button>
                <h5><Link to='/signup' >Don't have an Account?</Link></h5>
            </div>
        </div>
    );
}

export default Signin;