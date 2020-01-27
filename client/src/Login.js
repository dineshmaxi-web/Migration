import React from 'react';
import './Login.css';
import GetData from './GetData.js';
import Register from './Register.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import logo from './vtglogo.jpg';
import Forget_pass from './Forget_pass.js';


class Login extends React.Component {
    state = {
        showLogin : true,
        showHome : false,
        userName: "",
        password: "",
        showErrorMessage : false
    }
    handleLogin = (e) => {
        e.preventDefault();
        
        if(this.state.userName === "zenfra" && this.state.password === "zenfra")
        {
            this.setState({showHome : true})
            this.setState({showLogin : false})
            
        }
        else{
            this.setState({showErrorMessage : true});
        }
    }

    handleChangeUserName = (e) =>{
        if(e.target.value.match("^[a-zA-Z_]*$")!=null) {
            this.setState({UserName: e.target.value});
          }
    }

    handleRegister = (e) => {
        e.preventDefault();
        this.setState({showRegister : true})
        this.setState({showLogin : false})
    }

    onChangeHandler = (e) => {
        this.setState({showErrorMessage : false});
        if(e.target.name === "userName")
        {
            this.setState({userName : e.target.value}, ()=>console.log(this.state.userName))
        }
        if(e.target.name === "password")
        {
            this.setState({password : e.target.value}, ()=>console.log(this.state.password))
        }
        
    }

    handleForgetPass = (e) => {
        e.preventDefault();
        this.setState({showForgetPass : true})
        this.setState({showLogin : false})
    }

    render() {
        if(this.state.showForgetPass){
            return(
                <Forget_pass />
            )
        }
        if(this.state.showLogin)
        {
        return (
        <div id="body">
            <div className="wrapper">
                <div id="formContent">
                    <div className="fadeIn first">
                        <img src={logo} id="icon" alt="User Icon" />
                        </div>
                        <form onSubmit={this.handleLogin} className="login-form">
                        <label className="user-label fadeIn five">User Name</label>
                            <input type="text" id="login" name="userName" className="fadeIn second" placeholder="Username" 
                            onChange={this.handleChangeUserName, this.onChangeHandler} value={this.state.UserName} />
                            <label className="user-label fadeIn five">Password</label>
                            <input type="password" id="password" className="fadeIn third" name="password"  placeholder="Password" onChange={this.onChangeHandler} />
                            {this.state.showErrorMessage &&
                                    <i>Provide valid informations</i>
                            }
                            <button type="submit" class="fadeIn fourth">
                            Log In <i class="fa fa-sign-in" style={{color: "white"}} ></i>
                            </button>
                            {/* <input type="submit"  className="fadeIn fourth" value="Log In" /> */}
                        </form>
                        
                </div>
            </div>
        </div>
        )
        }
        if(this.state.showHome){
            return(
                <GetData />
            )
        }
    }
}


export default Login;