import React from 'react';
import './success_page.css';


class NoMatch extends React.Component {

    render()
    {
        return (
            <div id="success-body">
              <div className="wrapper">
                <div id="success-formContent">
                  <div class="icon-box" style={{backgroundColor : "orange"}}>
                    <i class="fa fa-frown-o"></i>
                  </div><br />
                  <form>
                    <div>
                      <h4 style={{color : "orange"}}>Page Not Found <i class="fa fa-frown-o"></i></h4>
                    </div>
                    <div>
                      <p style={{color : "lightgreen"}}>Check other pages <i class="fa fa-smile-o"></i></p>
                    </div>
                  </form>
                </div>
              </div>
            </div>
        )
    }

}

export default NoMatch;
