import React from 'react';
import './Login.css';
import Login from './Login';
import 'bootstrap/dist/css/bootstrap.min.css';
import logo from './vtglogo.jpg';


class Register extends React.Component {
    state = {
        showLogin : false,
        showRegister : true,
        UserName: "",
        email: ""
    }

    handleLogin = (e) => {
        e.preventDefault();
        this.setState({showRegister : false})
        this.setState({showLogin : true})
    }

    render() {
        if(this.state.showRegister)
        return (
        <div id="body">
            <div className="wrapper fadeInDown">
                <div id="formContent">
                    <div className="fadeIn first">
                        <img src={logo} id="icon" alt="User Icon" />
                        </div>
                        <form onSubmit={this.handleLogin}>
                            <input type="text" id="register" className="fadeIn second" minLength="5" maxLength="20" name="register" placeholder="Username" required/>
                            <input type="email" id="email" className="fadeIn second" name="email" placeholder="email" required/>
                            <input type="password" id="password" className="fadeIn third" name="login" minLength="6" placeholder="Password" required/>
                            <input type="submit"  className="fadeIn fourth" value="Sign Up" />
                        </form>
                        <div id="formFooter">
                            Already have a account <a className="underlineHover" onClick={this.handleLogin} href="#">Login</a>
                        </div>
                </div>
            </div>
        </div>
        )
        if(this.state.showLogin){
            return (
                <Login />
            )
        }
        }
}


export default Register;