import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import App from './App.js';
import Login from './Login.js';
import GetData from './GetData';
import * as serviceWorker from './serviceWorker';
import user_form from './user_form.js';
import UserManagement from './UserManagement';
import NoMatch from './NoMatch.js';
import { Route, Router,  BrowserRouter } from 'react-router-dom';

class Index extends Component {
    render () {
      return (
        <BrowserRouter>
          <div>
              <Route path="/" component={App} exact />
              <Route path="/viewquote" component={GetData} />
              <Route path="/login" component={Login} />
              <Route path="/adduser" component={user_form}  />
              {/* <Route path="*" exact={true} component={NoMatch}/> */}
              <Route path="/UserManagement" component={UserManagement}  />
          </div>
        </BrowserRouter>
      )
    }
  }
  
  
  ReactDOM.render(<Index />, document.getElementById('root'));

serviceWorker.unregister();
