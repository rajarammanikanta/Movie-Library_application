import { Component } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase";
import { setDoc, doc } from "firebase/firestore";
import { toast } from "react-toastify";
import "./index.css";

class SignUp extends Component {
  state = { email: "", password: "", fname: "", lname: "" };  

  getFname=(event)=>{
    this.setState({fname: event.target.value})
  }

  getLname=(event)=>{
    this.setState({lname: event.target.value})
  }

  getPassword=(event)=>{
    this.setState({password: event.target.value})
  }

  getUsername=(event)=>{
    this.setState({email: event.target.value})
  }

  handleRegister = async (e) => {  
    const{email,password,fname,lname}=this.state 
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      const user = auth.currentUser;
      if (user) {
        await setDoc(doc(db, "Users", user.uid), {
          email: user.email,
          firstName: fname,
          lastName: lname,
        });
      }
      this.setState({email:'',password:'',fname:'',lname:''})
      console.log(user);
      toast.success("User registered successfully", { position: "top-center" });
    } catch (error) {
      console.log(error.message);
      toast.error(error.message, { position: "bottom-center" });
    }
  };

  render() {
    const{email,password,fname,lname}=this.state
    return (
      <form className="overall-form-container" onSubmit={this.handleRegister}>
        <div className="form-contianer1">
          <div className="heading-container">
            <h1>Movie Library</h1>
          </div>
          <div className="username-container">
            <label htmlFor="fname" className="label">
              FirstName
            </label>
            <input
              type="text"
              placeholder="FirstName"
              id="fname"
              className="username"
              onChange={this.getFname} 
              value={fname}
            />
          </div>
          <div className="username-container">
            <label htmlFor="lname" className="label">
              LastName
            </label>
            <input
              type="text"
              placeholder="LastName"
              id="lname"
              className="username"  
              onChange={this.getLname} 
              value={lname}
            />
          </div>
          <div className="username-container">
            <label htmlFor="username" className="label">
              Email Id
            </label>
            <input
              type="text"
              placeholder="Username"
              id="username"
              className="username"  
              onChange={this.getUsername}  
              value={email}
            />
          </div>
          <div className="username-container">
            <label htmlFor="password" className="label">
              Password
            </label>
            <input
              type="password"
              placeholder="password"
              id="password"
              className="username"  
              onChange={this.getPassword} 
              value={password}
            />
          </div>
          <div className="button-container">
            <button type="submit" className="login-button">
              SignUp
            </button>
          </div>
          <div>
            <p className="new-user">
              👉Existing User{" "}
              <a href="/login" className="new-user">
                Login here
              </a>
            </p>
          </div>
        </div>
      </form>
    );
  }
}

export default SignUp;
