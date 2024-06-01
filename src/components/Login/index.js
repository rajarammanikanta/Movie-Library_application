import { Component } from "react";   
import { signInWithEmailAndPassword } from "firebase/auth";
import {auth} from '../firebase'
import {toast} from 'react-toastify'

import './index.css'

class Login extends Component{  
    state={email: '',password: ''}        


    getUsername=(event)=>{
        this.setState({email: event.target.value})
    }

    getPassword=(event)=>{
        this.setState({password: event.target.value})
    }
  
     handleSubmit=async(e)=>{
        const{email,password}=this.state
        e.preventDefault();  
    
        try{
          await signInWithEmailAndPassword(auth,email,password);
          window.location.href="/";
          toast.success("User Logged In Successfully!!",{position: "top-center"});
    
        }
        catch(error){
          console.log(error.message); 
          toast.error(error.message,{position: "bottom-center"});
        }
    
      }
    
    render(){
        const{email,password}=this.state   
        return(
          <form className="overall-form-container" onSubmit={this.handleSubmit}>
       
    
            <div className="form-contianer">
            <div className="heading-container">
            <h1>Movie Library</h1>
           </div>
                <div className="username-container">
                    <label htmlFor="username" className="label">Email Id</label>
                    <input type="text" placeholder="Username" id="username"  className="username" value={email} onChange={this.getUsername}/>
                    
                </div> 
                <div className="username-container">
                    <label htmlFor="password" className="label">Password</label>
                    <input type="password" placeholder="password" id="password" className="username" value={password} onChange={this.getPassword}/>
                    
                </div>  
                <div className="button-container">
                    <button type="submit" className="login-button">Login</button>  
                </div>  
                <div>
                    <p className="new-user">👉New User <a href="/signup" className="new-user">Register here</a></p>
                </div>
            </div>
      
          </form>
        )
    }
}



export default Login