import React from 'react';
import Type from './Field_type';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import logo from './vtglogo.jpg';
import $ from "jquery";

var latestGroup = [];

class App extends React.Component {
  state = {
    groups: [],
    registrationNumber : 0
  }

  componentDidMount() {
    fetch('/get/forminfo')
      .then((res) => res.json()
        .then((data) => {
          data.map((group) => {
            latestGroup.push(group)
          })
          this.setState({ groups: latestGroup })
        })
      )

      fetch('/get/formdata')
      .then((res) => res.json()
        .then((data) => {
            this.setState({registrationNumber : data.length + 1})
        })
      )  
  }

  submit = () => {
    var fieldsInJsons = [];
    this.state.groups.map((json) => {
        json.fields.map((field) => {
            if(field.mandatory)
            {
              fieldsInJsons.push(field.fieldName)
            }

            if(field.subField)
            {
              field.subField.map((subField) => {
                if(subField.mandatory)
                {
                  fieldsInJsons.push(subField.fieldName)
                }

                if(subField.subField)
                {
                  subField.subField.map((subSubField) => {
                    if(subSubField.mandatory)
                    {
                      if(subSubField.fieldType === "text")
                        fieldsInJsons.push(subSubField.fieldName)
                      else
                       fieldsInJsons.push(subField.fieldName)
                    }
                  })
                }
              })
            }
          })   
        })

       
    var croppedState = this.state;
    var count = 0;
    delete croppedState.groups;
    delete croppedState.registrationNumber;

    var keysOfCroppedState = Object.keys(croppedState);

    console.log(keysOfCroppedState, fieldsInJsons)

    if(keysOfCroppedState.length > 0 )
    {
      for(let i = 0 ; i < fieldsInJsons.length ; i++)
      {
        if(croppedState.hasOwnProperty(fieldsInJsons[i]) === false || croppedState[fieldsInJsons[i]] === "")
        {
           count = count + 1;  
        }
      }
    }
    else{
      count = count + 1;
    }

    if(count === 0)
    {
      fetch('/post/data', {
        method: 'POST',
        body: JSON.stringify({
          data: croppedState
        }),
        headers: { "Content-Type": "application/json" }
      })
        .then(function (response) {
          return response.json()
        }).then((body) => {
              alert("done")
        });
    }
  }
 
  setNewServerInfo = (info) => {
    var groups = this.state.groups;
    groups[4].fields.push(info);
    this.setState({ groups : groups});
  }

  setNewServer = (info) => {
    var groups = this.state.groups;
    groups[4].fields.map((fields) => {
      fields.subField.push(info);
    })
    this.setState({ groups : groups});
  }

  setStateFunction = (fieldName, fieldValue) => {
      this.setState({[fieldName]: fieldValue})
  }

  delConnectivitySubField = (fieldName) => {
    let temp = this.state;
    delete temp[fieldName]
    this.setState({temp});
  }

  changeFullGroup = (fullGroup) => {
    this.setState({groups : fullGroup}, ()=>console.log(this.state.groups))
  }

  arrowFunction(groupKey) {
    var groups = this.state.groups;
    groups[groupKey].toggleActive = !groups[groupKey].toggleActive;
    this.setState({groups});
  }

  render() {

    $( document ).ready(function() {
      $('.state-country').parent().removeClass('col-md-3');
      $('.state-country').parent().addClass('col-md-6');
  });

  $( document ).ready(function() {
    $('.row').parent().removeClass('col-md-3');
    $('.row').parent().addClass('col-md-12');
});

$( document ).ready(function() {
  $('#migrationbetween_field').parent().removeClass('col-md-3');
  $('#migrationbetween_field').parent().addClass('col-md-6');
});

    return (
      <div>
          <div className="header">
              <img src={logo} className="logo"></img>
          </div>
          
          <div className="container-fluid">
           
              <div className="group">
              <label className="request-no" >Request No. <span>{this.state.registrationNumber}</span></label>
                {
                  latestGroup.map((group, groupKey) => (
                    (group.isActive ? (
                      <div>
                          <div className="box" id={group.groupLabel} name={group.groupName}>
                              <h4 className="box-head" onClick={this.arrowFunction.bind(this, groupKey)} data-toggle="collapse" data-target={'#' + group.groupName}  >
                                  {group.groupLabel}
                                  <i  id={group.toggleActive + '_test'} className={group.toggleActive ? "fa fa-angle-up" : "fa fa-angle-down"}></i>
                              </h4>
                              <div className="box-body collapse show" id={group.groupName}>
                                  <div className="row">
                                      {
                                        group.fields.map((field, fieldKey) => (
                                          <div className="field-align col-md-3">
                                              <Type group={group} changeFullGroup={this.changeFullGroup} field={field}  fieldKey={fieldKey} stateGroups={this.state.groups} addNewServer={this.setNewServer} addNewServerInfo={this.setNewServerInfo} func={this.setStateFunction} delConnectivitySubField={this.delConnectivitySubField} /> 
                                          </div>
                                        ))
                                      }
                                  </div>
                              </div>
                          </div>
                      </div>
                      ) : (null))
                  ))
                }
              </div>
          </div>
          <div className="box-footer">
              <button className="submit-btn btn btn-success" onClick={this.submit}>Submit</button>
          </div>
      </div>
  )
  }
}

export default App;