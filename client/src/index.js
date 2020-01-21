import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import App from './App.js';
import Login from './Login.js';
import GetData from './GetData';
import * as serviceWorker from './serviceWorker';
import Detail from './Detail.js';
import { Route, Router,  BrowserRouter } from 'react-router-dom';

class Index extends Component {
    render () {
      return (
        <BrowserRouter>
          <div>
            <Route path="/" component={App} exact />
            <Route path="/login" component={Login} />
            <Route path="/get_data" component={GetData}  />
          </div>
        </BrowserRouter>
      )
    }
  }
  
  
  ReactDOM.render(<Index />, document.getElementById('root'));

serviceWorker.unregister();
