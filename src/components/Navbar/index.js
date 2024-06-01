import { Component } from "react";   
import {auth,db} from '../firebase'  
import {doc,getDoc} from 'firebase/firestore'
import {toast} from 'react-toastify'

import './index.css'

class Navbar extends Component{  

    state={userDetails: []}

    componentDidMount(){
        this.fetchUserData()
    }


     fetchUserData=async()=>{
        
        auth.onAuthStateChanged(async(user)=>{
            console.log(user);  
    
            const docRef=doc(db,"Users",user.uid);  
            const docSnap=await getDoc(docRef); 
    
            if(docSnap.exists()){
               this.setState({userDetails: docSnap.data()})
            }
            else{
                console.log("User is not logged in");
            }
        })
       }  
    
  handleLogout=async()=>{
        await auth.signOut();
        window.location.href="/login";  
        toast.success("Successfully Logout!!",{position: "top-center"})
    
    }



    render(){
        const{userDetails}=this.state  
        console.log(userDetails)
        const{firstName}=userDetails
        const firstChar = firstName ? firstName.charAt(0).toUpperCase() : '';
        return(  
            <div className="header-container">
                <div className="profile-container">
                    <div className="user-image">
                        <p>{firstChar}</p>
                    </div>
                <p className="welcome-user-heading">Welcome, {firstName}</p>  
                </div>
                
                <div>
                    <p className="movie-main-heading">🎥 <span className="span">Movie</span> Library</p>
                </div>
               <div>
                <button type="button" className="login-button" onClick={this.handleLogout}>Logout</button>
               </div>
            </div>

        )
    }
}




export default Navbar