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
        
        if(this.state.userName === "Zenfra" && this.state.password === "zenfra")
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
            <div className="wrapper fadeInDown">
                
                <div id="formContent">
                    <div className="fadeIn first">
                        <img src={logo} id="icon" alt="User Icon" />
                        </div>
                        <form onSubmit={this.handleLogin}>
                            <input type="text" id="login" name="userName" className="fadeIn second" minLength="4" maxLength="20" placeholder="Username" 
                            onChange={this.handleChangeUserName, this.onChangeHandler} value={this.state.UserName} required/>
                            <input type="password" id="password" className="fadeIn third" name="password" minLength="4" placeholder="Password" onChange={this.onChangeHandler} required/>
                            {this.state.showErrorMessage &&
                                    <i>Provide valid informations</i>
                            }
                            <input type="submit"  className="fadeIn fourth" value="Log In" />
                        </form>
                        <div id="formFooter">
                        </div>
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