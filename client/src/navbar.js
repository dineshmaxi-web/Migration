import React from 'react';
import './navbar.css';

class Navbar extends React.Component {
    redirectViewQuotePage = () => {
        window.location = "/viewquote"
    }

    redirectUserManagementPage = () => {
        window.location = "/usermanagement"
    }

    redirectLogoutPage = () => {
        window.location = "/login"
    }

    render() {
        return (
            <nav class="navbar navbar-expand-md bg-dark navbar-dark">
                <img src="http://www.virtualtechgurus.com/wp-content/uploads/2018/03/VTG-logo_50h-white.png" width="150" onClick={this.redirectViewQuotePage}></img>
                <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#collapsibleNavbar">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="collapsibleNavbar">
                    <ul class="navbar-nav">
                        <li class="nav-item">
                           <a class="nav-link" onClick={this.redirectViewQuotePage}><i className="fa fa-eye"></i> Quote View</a>
                        </li>
                        <li class="nav-item dropdown">
                          <a class="nav-link dropdown-toggle" id="navbardrop" data-toggle="dropdown">
                             <i className="fa fa-cog"></i> Settings
                          </a>
                        <div class="dropdown-menu">
                            <a class="dropdown-item" onClick={this.redirectUserManagementPage}><i className="fa fa-user"></i> User Management</a>
                        </div>
                        </li>  
                    </ul>
                    <ul class="navbar-nav ml-auto">
                        <li class="nav-item"><a class="nav-link" onClick={this.redirectLogoutPage}><i className="fa fa-sign-out"></i> Logout</a></li>
                    </ul>
                </div>  
            </nav>
        )
    }
}

export default Navbar