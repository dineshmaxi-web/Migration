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
        showRegister: false,
        showForgetPass: false,
        UserName: ""
    }
    handleLogin = (e) => {
        e.preventDefault();
        this.setState({showHome : true})
        this.setState({showLogin : false})
    }

    handleChangeUserName = (e) =>{
        if(e.target.value.match("^[a-z0-9_]*$")!=null) {
            this.setState({UserName: e.target.value});
          }
    }

    handleRegister = (e) => {
        e.preventDefault();
        this.setState({showRegister : true})
        this.setState({showLogin : false})
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
                            <input type="text" id="login" className="fadeIn second" minLength="5" maxLength="20" name="login" placeholder="Username" 
                            onChange={this.handleChangeUserName} value={this.state.UserName} required/>
                            <input type="password" id="password" className="fadeIn third" name="login" minLength="6" placeholder="Password" required/>
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