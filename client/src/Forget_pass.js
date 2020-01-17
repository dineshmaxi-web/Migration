import React from 'react';
import './Login.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import logo from './vtglogo.jpg';


class forgetPassword extends React.Component {
 

    render() {
        return (
          <div className="forget-pass">
          <div class="form-gap"></div>
          <div class="container">
            <div class="row">
              <div class="col-md-4 col-md-offset-4">
                      <div class="panel panel-default">
                        <div class="panel-body">
                        <img src={logo} id="icon" alt="User Icon" />
                          <div class="text-center">
                            <h3><i class="fa fa-lock fa-4x"></i></h3>
                            <h2 class="text-center">Forgot Password?</h2>
                            <p>Reset your password</p>
                            <div class="panel-body">
              
                              <form id="register-form" role="form" autocomplete="off" class="form" method="post">
              
                                <div class="form-group">
                                  <div class="input-group">
                                    <span class="input-group-addon"><i class="fa fa-envelope icon"></i></span>
                                    <input id="email" name="email" placeholder="email address" class="form-control"  type="email" />
                                  </div>
                                </div>
                                <div class="form-group">
                                  <input name="recover-submit" class="btn btn-lg btn-primary btn-block" value="Send Mail" type="submit" />
                                </div>
                              </form>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
            </div>
          </div>
          </div>
        )
    }
}


export default forgetPassword;