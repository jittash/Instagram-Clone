import React, { useEffect,createContext,useReducer,useContext } from 'react'
import Navbar from './components/navbar'
import { BrowserRouter,Route, Switch, useHistory } from 'react-router-dom'
import './App.css'
import Home from './components/screens/Home'
import Signin from './components/screens/Signin'
import Signup from './components/screens/Signup'
import Profile from './components/screens/Profile'
import CreatePost from './components/screens/CreatePost'
import { reducer,initialstate } from './reducers/userReducer'
import UserProfile from './components/screens/UserProfile'
import subscribeUserPost from  './components/screens/subscribeUserPost'

export const userContext = createContext()

const Routing = () => {

  const history = useHistory()

  const { state,dispatch } = useContext(userContext)

  useEffect(()=>{
    const user = JSON.parse(localStorage.getItem("user"))
    //console.log(user)
    if(user){
      dispatch({ type:"USER",payload:user })
      //history.push('/')
    }
    else{
      history.push('/signin')
    }
  },[])

  return (
    <Switch>
      <Route exact path = '/' component = { Home }/> 
      <Route path = '/signin' component = { Signin }/> 
      <Route path = '/signup' component = { Signup }/> 
      <Route exact path = '/profile' component = { Profile }/>  
      <Route path = '/create' component = { CreatePost }/>
      <Route path = '/profile/:userid' component = { UserProfile }/> 
      <Route path = '/myfollowingpost' component = { subscribeUserPost } />
    </Switch>
  );
}

function App() {
  const [state,dispatch] = useReducer(reducer,initialstate)
  return (
    <div className="App">
    <userContext.Provider value={{ state,dispatch }}>
    <BrowserRouter>
      <Navbar/>
      <Routing/>
      
    </BrowserRouter>
    </userContext.Provider>
  
    </div>
  );
}

export default App;
