import React from 'react';
import './user_form.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import logo from './vtglogo.jpg';
import Modal from 'react-modal';
import EmailValidator from 'email-validator';
import UserManagement from './UserManagement';

var count = 0;
var servers = ["VmWare","AIX","Windows","Linux","Solaris","HP-UX"]
class UserForm extends React.Component {
    state = {
        id : this.props.fields._id,
        firstName: this.props.fields.firstName,
        lastName: this.props.fields.lastName,
        email: this.props.fields.email,
        password: this.props.fields.password,
        userQuote: this.props.fields.userQuote,
        showErrorMessage : false,
        modalIsOpen: false,
        showRequiredFirstName : false,
        showRequiredLastName : false,
        showRequiredEmail : false,
        showRequiredPassWord : false,
        showUserManagementPage : false,
        showEditUserPage : true
    }

    onChangeHandler = (e) => {
       

        if(e.target.name === "firstName")
        {
            console.log(e.target.value)
            if(e.target.value.match(/^[A-Za-z .]+$/)) {
                this.setState({firstName : e.target.value,  showRequiredFirstName: false})
            }
            else {
                this.setState({firstName : e.target.value, showRequiredFirstName: true })
            }
        }

        if(e.target.name === "lastName")
        {
            if(e.target.value.match(/^[A-Za-z .]+$/)) {
                this.setState({lastName : e.target.value,  showRequiredLastName: false})
            }
            else {
                this.setState({lastName : e.target.value, showRequiredLastName: true })
            }
        }

        if(e.target.name === "email")
        {
            if(EmailValidator.validate(e.target.value)) {
                this.setState({email : e.target.value, showRequiredEmail: false })
            }
            else {
                this.setState({email : e.target.value, showRequiredEmail: true })
            }
        }

        if(e.target.name === "userQuote")
        {
            this.setState({userQuote : e.target.value})
        }
    }
    

    openModal = (e) => {

        var {id, firstName, lastName, email, password, userQuote} = this.state;
        if(firstName !== "" && lastName !== "" && email !== "" && userQuote !== "")
        {
            count = 0;
        }
        else{
            count = 1;
        }
        
        var finalValue = {
            id : id,
            firstName : firstName,
            lastName : lastName,
            email : email,
            password : password,
            userQuote : userQuote
        }

        if(count === 0){
            fetch('/update/user', {
                method: 'POST',
                body: JSON.stringify({
                data: finalValue
                }),
                headers: { "Content-Type": "application/json" }
            })
            .then((response) => {
                this.setState({modalIsOpen: true});
            })
        }
        else{
            count = 0;
        }
    }

    closeModal = () =>{
        window.location = "/UserManagement"
    }

    handleUser = (e) => {
        window.location = "/UserManagement"
    }

    render() {

        if(this.state.showUserManagementPage){
            return (
                <UserManagement />
            )
        }
    
        if(this.state.showEditUserPage)
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
                    </button><button type="submit" class="btn-danger back-btn" onClick={this.closeModal}>
                     Back <i class="fa fa-save"></i>
                    </button>
                    <Modal
                        isOpen={this.state.modalIsOpen}
                        contentLabel="Example Modal"
                        ariaHideApp={false}
                        className="userModal-box">
                        <div className="Modalbody">
                            User Edited Successfully!<br/>
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
                            <input type="text" id="login" value={this.state.firstName} name="firstName" className="" placeholder="First name" 
                            onChange={this.onChangeHandler} />
                            {
                                (this.state.showRequiredFirstName ? <div style={{color:"red"}}>Invalid First Name</div> : null)
                            }
                        </div>
                        <div className="col-md-4">
                            <label className="user-label">Last Name</label>
                            <input type="text" id="login" name="lastName" value={this.state.lastName} className="" placeholder="Last name" 
                            onChange={this.onChangeHandler} />
                            {
                                (this.state.showRequiredLastName ?  <div style={{color:"red"}}>Invalid Last Name</div> : null)
                            }
                        </div>
                        <div className="col-md-4">
                            <label className="user-label ">Email Address</label>
                            <input type="email" id="login" name="email" value={this.state.email} className="" placeholder="Email Address" 
                            onChange={this.onChangeHandler} />
                            {
                                (this.state.showRequiredEmail ?  <div style={{color:"red"}}>Invalid Email Address</div> : null)
                            }
                        </div>
                        <div className="col-md-4">
                            <label className="user-label ">User Quote</label>
                            <select name="userQuote" value={this.state.userQuote} className="" onChange={this.onChangeHandler}>
                                <option selected>{this.state.userQuote}</option>
                                {
                                    servers.map(server => (
                                        ((server !== this.state.userQuote) ? (<option>{server}</option>) : (null))
                                    ))
                                }
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
}


export default UserForm;