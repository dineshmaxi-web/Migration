import React from 'react';
import './user_form.css';
import GetData from './GetData.js';
import Register from './Register.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import logo from './vtglogo.jpg';
import Login from './Login.js';
import Forget_pass from './Forget_pass.js';
import Modal from 'react-modal';
import EmailValidator from 'email-validator';

class UserForm extends React.Component {
    state = {
        showUserPage : true,
        showHome: false,
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
            var minLength=8;
            if(e.target.value > minLength){
            if(e.target.value.match(/^[0-9 .\b]+$/)) {
                this.setState({password : e.target.value})
                this.setState({ showRequiredPassWord: false })
            }
            else {
                this.setState({password : ""})
                this.setState({ showRequiredPassWord: true })
            }
        }
        }
    }
    
    openModal = (e) => {
         this.setState({ modalIsOpen: true });
    }

    handleSubmit = (e) => {
        this.setState({showUserPage : true, modalIsOpen: true, showModal: true})
    }

    handleUser = (e) => {
        this.setState({showUserPage : false, modalIsOpen: false,showHome:true})
        window.location.reload();
    }

    render() {

        if(this.state.showHome){
            return (
                <GetData />
            )
        }
    
        if(this.state.showUserPage)
        {
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
        <Modal
        isOpen={this.state.modalIsOpen}
        contentLabel="Example Modal"
        ariaHideApp={false}
        className="userModal-box">
        <div className="Modalbody">
        User Added Successfully!<br/>
        <div><button className="btn-success done-btn" onClick={this.handleUser}>Done <i class="fa fa-thumbs-up"></i></button></div>
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
        <select className="" onChange={this.handleChangeUserName, this.onChangeHandler}>
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
        if(this.state.showLogin){
            return(
                <Login />
            )
        }
    }
}


export default UserForm;