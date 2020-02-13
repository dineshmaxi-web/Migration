import React from 'react';
import './user_form.css';
import GetData from './GetData.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import logo from './vtglogo.jpg';
import Login from './Login.js';
import Modal from 'react-modal';
import EmailValidator from 'email-validator';
import UserManagement from './UserManagement';

var count = 0;

class UserForm extends React.Component {
    state = {
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        userQuote: "",
        showErrorMessage : false,
        modalIsOpen: false,
        showRequiredFirstName : false,
        showRequiredLastName : false,
        showRequiredEmail : false,
        showRequiredPassWord : false
    }

    onChangeHandler = (e) => {
       

        if(e.target.name === "firstName")
        {
            if(e.target.value.match(/^[A-Za-z .]+$/)) {
                this.setState({firstName : e.target.value})
                this.setState({ showRequiredFirstName: false })
            }
            else {
                this.setState({ showRequiredFirstName: true })
            }
        }

        if(e.target.name === "lastName")
        {
            if(e.target.value.match(/^[A-Za-z .]+$/)) {
                this.setState({lastName : e.target.value})
                this.setState({ showRequiredLastName: false })
            }
            else {
                this.setState({ showRequiredLastName: true })
            }
        }

        if(e.target.name === "email")
        {
            if(EmailValidator.validate(e.target.value)) {
                this.setState({email : e.target.value})
                this.setState({ showRequiredEmail: false })
            }
            else {
                this.setState({ showRequiredEmail: true })
            }
        }

        if(e.target.name === "password")
        {
            if(e.target.value !== "") {
                this.setState({password : e.target.value})
                this.setState({ showRequiredPassWord: false })
            }
            else {
                this.setState({ showRequiredPassWord: true })
            }
        }

        if(e.target.name === "userQuote")
        {
            this.setState({userQuote : e.target.value})
        }
    }
    
    closeModal = () =>{
      window.location = "/UserManagement"
    }

    openModal = () => {

        var {firstName, lastName, email, password, userQuote} = this.state;
        console.log(firstName,lastName,email,password,userQuote, this.state.password);
        if(firstName !== "" && lastName !== "" && email !== "" && password !== "" && userQuote !== "")
        {
            count = 0;
        }
        else{
            count = 1;
        }

        var finalValue = {
            firstName : firstName,
            lastName : lastName,
            email : email,
            password : password,
            userQuote : userQuote
        }
        if(count === 0){
            fetch('/post/adduser', {
                method: 'POST',
                body: JSON.stringify({
                data: finalValue
                }),
                headers: { "Content-Type": "application/json" }
            })
            .then(function (response) {
                return response.json();
            }).then(() => {
                this.setState({ modalIsOpen: true });
            });
        }
        else{
            count = 0;
        }
    }

    handleUser = (e) => {
        window.location = "/UserManagement"
    }

    render() {
        return (
            <div id="register">
            <div className="header">
            <img src={logo} className="logo"></img>
            </div>
            <div className="container-fluid">
                <div className="user-box">
                <h4 className="userbox-head">Add new user
                    <button type="submit" class="btn-success adduser-btn" onClick={this.openModal}>
                      Save & Close <i class="fa fa-save"></i>
                    </button>
                   <button type="submit" class="btn-danger back-btn" onClick={this.closeModal}>
                     Back <i class="fa fa-save"></i>
                    </button>
                    <Modal
                        isOpen={this.state.modalIsOpen}
                        contentLabel="Example Modal"
                        ariaHideApp={false}
                        className="userModal-box">
                        <div className="Modalbody">
                            User Added Successfully!<br/>
                            <div>
                                <button className="btn-success done-btn" onClick={this.handleUser}>Done <i class="fa fa-thumbs-up"></i></button>
                            </div>
                        </div>
                    </Modal>
                </h4>
                <div className="userbox-body">
                    <div className="row">
                        <div className="col-md-4">
                            <label className="user-label">First Name</label>
                            <input type="text" id="login" name="firstName" className="" placeholder="First name" 
                            onChange={this.onChangeHandler} />
                            {
                                (this.state.showRequiredFirstName ? <div style={{color:"red"}}>Invalid First Name</div> : null)
                            }
                        </div>
                        <div className="col-md-4">
                            <label className="user-label">Last Name</label>
                            <input type="text" id="login" name="lastName" className="" placeholder="Last name" 
                            onChange={this.onChangeHandler} />
                            {
                                (this.state.showRequiredLastName ?  <div style={{color:"red"}}>Invalid Last Name</div> : null)
                            }
                        </div>
                        <div className="col-md-4">
                            <label className="user-label ">Email Address</label>
                            <input type="email" id="login" name="email" className="" placeholder="Email Address" 
                            onChange={this.onChangeHandler} />
                            {
                                (this.state.showRequiredEmail ?  <div style={{color:"red"}}>Invalid Email Address</div> : null)
                            }
                        </div>
                        <div className="col-md-4">
                            <label className="user-label">Password</label>
                            <input type="password" id="password" className="" name="password"  placeholder="Password" onChange={this.onChangeHandler} />
                            {
                                (this.state.showRequiredPassWord ?  <div style={{color:"red"}}>Invalid Password</div> : null)
                            }
                        </div>
                        <div className="col-md-4">
                            <label className="user-label ">User Quote</label>
                            <select name="userQuote" className="" onChange={this.onChangeHandler}>
                                <option selected disabled>Select Server</option>
                                <option>VmWare</option>
                                <option>AIX</option>
                                <option>Windows</option>
                                <option>Linux</option>
                                <option>Solaris</option>
                                <option>HP-UX</option>
                            </select>
                            {
                                (this.state.showErrorMessage ? "required" : null)
                            }
                        </div>
                    </div>
                </div>
                </div>
            </div>
            </div>
        )
    }
}


export default UserForm;