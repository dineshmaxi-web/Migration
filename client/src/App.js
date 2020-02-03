import React from 'react';
import Type from './Field_type';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import logo from './vtglogo.jpg';
import $ from "jquery";
import './success_page.css';
import _ from 'lodash';

var latestGroup = [];

class App extends React.Component {
  state = {
    groups: [],
    registrationNumber: 0,
    showSuccess: false,
    CustomerContactInformation: {
      country: "United States",
      state: "Texas",
    },
    OpportunityInformation: {
      startDate:  ("0" + (new Date().getMonth() + 1)).slice(-2) + "-" + ("0" + new Date().getDate()).slice(-2) +"-" + new Date().getFullYear(), 
      endDate:  ("0" + (new Date().getMonth() + 1)).slice(-2) + "-" + ("0" + new Date().getDate()).slice(-2) +"-" + new Date().getFullYear(), 
    }
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
          this.setState({ registrationNumber: data.length + 1 })
        })
      )
  }

  submit = () => {
    var fieldsInJsons = [];
    this.state.groups.map((json) => {
      json.fields.map((field) => {
        if (field.mandatory) {
          fieldsInJsons.push(field.fieldName)
        }

        if (field.subField) {
          field.subField.map((subField) => {
            if (subField.mandatory) {
              fieldsInJsons.push(subField.fieldName)
            }

            if (subField.subField) {
              subField.subField.map((subSubField) => {
                if (subSubField.mandatory) {
                  if (subSubField.fieldType === "text")
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
    fieldsInJsons.map(fieldName => {
    if(fieldName.startsWith("numberofESXHosts") &&  this.state.ServersinMigrationScope)
    {
      let lastChars = fieldName.replace('numberofESXHosts', '');
      let finalServerNumbers = "numberofservers"+lastChars;
      var fullState = this.state;
      fullState.ServersinMigrationScope[finalServerNumbers] = "";
      this.setState(fullState)
    }
    })

    // var copyStateGroups = 

    // copyGroup.map(group => {
    //   group.map(field => {
    //     if(field.showRequired)
    //     {
    //       group.toggleActive = 1;
    //     }
    //     if(field.hasOwnProperty("subField"))
    //     {
    //       field.subField.map(subField => {
    //         if(subField.showRequired)
    //         {
    //           group.toggleActive = 1;
    //         }

    //         if(subField.hasOwnProperty("subField"))
    //         {
    //           subField.subField.map(subSubField => {
    //             if(subSubField.showRequired)
    //             {
    //               group.toggleActive = 1;
    //             }
    //           })
    //         }

    //       })
    //     }
    //   })
    // })

    var copyGroup = this.state.groups;
    
    var copyRegistrationNumber = this.state.registrationNumber;
    var copyShowSuccess = this.state.showSuccess;
    var croppedState = this.state;
    var count = 0, countForShowRequired = 0;
    delete croppedState.groups;
    delete croppedState.registrationNumber;
    delete croppedState.showSuccess;

    var keysOfCroppedState = Object.keys(this.state);

    var finalValues = [];
    var finalObject = {};

    for (let i = 0; i < keysOfCroppedState.length; i++) {
      var nestedKeys = Object.keys(this.state[keysOfCroppedState[i]]);
      for (let j = 0; j < nestedKeys.length; j++) {
        finalObject[nestedKeys[j]] = this.state[keysOfCroppedState[i]][nestedKeys[j]];
        finalValues.push(nestedKeys[j])
      }
    }
  
    if (finalValues.length > 0) {
      for (let i = 0; i < fieldsInJsons.length; i++) {
        if (finalObject.hasOwnProperty(fieldsInJsons[i]) === false || finalObject[fieldsInJsons[i]] === "") {
          count = count + 1;
        }
      }
    } 
    else {
      count = count + 1;
    }

    if (count === 0) {
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
          this.setState({ showSuccess: true })
        });
    }   
      //Setting the deleted state 
      this.setState({ groups: copyGroup, registrationNumber: copyRegistrationNumber, showSuccess: copyShowSuccess })


    //Show Required enabling
    for (let i = 0; i < fieldsInJsons.length; i++) {

      for (let j = 0; j < finalValues.length; j++) {
        if (fieldsInJsons[i] === finalValues[j]) {
          countForShowRequired = countForShowRequired + 1;
        }
      }

      if (countForShowRequired === 0) {

        copyGroup.map((json) => {
          json.fields.map((field) => {
            if (fieldsInJsons[i] === field.fieldName && field.mandatory) {
              json.toggleActive = 1;
              field.showRequired = true;
            }

            if (field.subField) {
              field.subField.map((subField) => {
                if (fieldsInJsons[i] === subField.fieldName && subField.mandatory) {
                  json.toggleActive = 1;
                  subField.showRequired = true;
                }

                if (subField.subField) {
                  subField.subField.map((subSubField) => {
                    if (fieldsInJsons[i] === subSubField.fieldName && subSubField.mandatory) {
                      if (subSubField.fieldType === "text") {
                        json.toggleActive = 1;
                        subSubField.showRequired = true;
                      }
                      else {
                        json.toggleActive = 1;
                        subField.showRequired = true;
                      }
                    }
                  })
                }
              })
            }
          })
        })

        this.setState({groups : copyGroup}, ()=> console.log(this.state.groups))
      }
      countForShowRequired = 0;
    }
  }

  setNewServerInfo = (info) => {
    var groups = this.state.groups;
    groups[4].fields.push(info);
    this.setState({ groups: groups });
  }

  setNewServer = (info) => {
    var groups = this.state.groups;
    groups[4].fields.map((fields) => {
      fields.subField.push(info);
    })
    this.setState({ groups: groups });
  }

  setStateFunction = (fieldName, fieldValue, groupName) => {
    let stateVariables = this.state;
    if(fieldValue !== undefined)
    {
        if(fieldValue === "") {
          delete stateVariables[groupName][fieldName];
          this.setState(stateVariables, ()=>console.log(this.state));
        }
        else {
          if (stateVariables[groupName]) {
            stateVariables[groupName][fieldName] = fieldValue;
            this.setState(stateVariables, () => {
              console.log(this.state)
              if (groupName == "ServersinMigrationScope") {
                this.disableSelectedValue();
              }
            });
          }
          else {
            this.setState({
              [groupName]: { [fieldName]: fieldValue }
            }, () => {
              console.log(this.state)
              if (groupName == "ServersinMigrationScope") {
                this.disableSelectedValue();
              }
            })
          }
        }
      }
      else{
        delete stateVariables[groupName][fieldName];
      }
  }

  disableSelectedValue = () => {
    var fourthSectionValues = Object.values(this.state.ServersinMigrationScope);

    var group = this.state.groups;
    group[4].fields.map(function (grpVal) {
      grpVal.subField.map(function (grpSubField) {
        if (fourthSectionValues.indexOf(grpSubField.fieldLabel) == -1) {
          grpSubField.disabled = false;
        } else {
          grpSubField.disabled = true;
        }
      })
    })

    this.setState({ groups : group })
  }

  delFifthSecState = () => {
    var wholeState = this.state;

    delete wholeState["ServersinMigrationScope"]
    this.setState(wholeState)
  }

  delSubField = (groupName, fieldName1, fieldName2, fieldName3, server) => {
    let temp = this.state;
    if(groupName !== "ServersinMigrationScope" && temp.hasOwnProperty(groupName))
    {
        delete temp[groupName][fieldName1];
        delete temp[groupName][fieldName2];
        this.setState(temp, ()=>console.log(this.state));
    }
    else{
      if(temp.hasOwnProperty("ServersinMigrationScope"))
      {
        let key = Object.values(temp.ServersinMigrationScope)
        if (!key.includes(server)) {
          if (temp.hasOwnProperty(groupName)) {
            delete temp[groupName][fieldName1];
            delete temp[groupName][fieldName2];
            delete temp[groupName][fieldName3];
            this.setState(temp);
          }
        }
        this.disableSelectedValue();
      }
    }
  }

  changeFullGroup = (fullGroup) => {
    this.setState({ groups: fullGroup }, ()=>console.log(this.state.groups))
  }

  arrowFunction(groupKey) {
    var groups = this.state.groups;
    groups[groupKey].toggleActive = !groups[groupKey].toggleActive;
    this.setState({ groups });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    window.location.reload();
  }

  addNewServerInfoFunc = () => {
    var lengthOfFields = this.state.groups[4].fields.length - 1;
    var group = this.state.groups;

    let addServerNumber = Number(group[4].fields[lengthOfFields].fieldName.charAt(group[4].fields[lengthOfFields].fieldName.length - 1)) + 1;
    var copyField = {};

    group[4].fields.map((field,index) => {
      
      if(index === 0)
      {
        copyField = _.cloneDeep(field);
        copyField.fieldName = field.fieldName + "_" + addServerNumber;

        copyField.mandatory = false;
        copyField.showRequired = false;
        copyField.subField.map((copySubField) => {
          copySubField.fieldName = field.fieldName + "_" + addServerNumber;
              if(copySubField.hasOwnProperty("subField"))
              {
                  copySubField.subField.map((copySubSubField)=>{
                    copySubSubField.fieldName = copySubSubField.fieldName + "_" + addServerNumber;
                    copySubSubField.showRequired = false;
                    copySubSubField.show = false;
                    copySubSubField.mandatory = false;
                })
              }
        })
        group[4].fields.push(copyField)
        
      }
    })

    this.setState({groups : group})
  } 

  render() {

    $(document).ready(function () {
      $('.state-country').parent().removeClass('col-md-3');
      $('.state-country').parent().addClass('col-md-6');

      $('#connection_field').parent().removeClass('col-md-3');
      $('#connection_field').parent().addClass('col-md-6');

      $('.row').parent().removeClass('col-md-3');
      $('.row').parent().addClass('col-md-12');
    
      $('.connectivity-algn').parent().removeClass('col-md-3');
      $('.connectivity-algn').parent().addClass('col-md-6');
      // $('.connectivity-algn').parent().addClass('test');

      $('#zipCode_field').parent().addClass('zipcode-algn');

  $("#freeze").click(function () {
    if ($(this).is(":checked")) {
      $('#freeze_field').parent().removeClass('col-md-3');
      $('#freeze_field').parent().addClass('col-md-6');
    } else {
      $('#freeze_field').parent().removeClass('col-md-6');
      $('#freeze_field').parent().addClass('col-md-3');
    }
  });

  $("#migrationbetween").click(function () {
    if ($(this).is(":checked")) {
      $('#migrationbetween_field').parent().removeClass('col-md-3');
      $('#migrationbetween_field').parent().addClass('col-md-6');
    } else {
      $('#migrationbetween_field').parent().removeClass('col-md-6');
      $('#migrationbetween_field').parent().addClass('col-md-3');
    }
  });

});

    if (this.state.showSuccess) {
      return (
        <div id="success-body">
          <div className="header">
            <img src={logo} className="logo"></img>
          </div>
          <div className="wrapper">
            <div id="success-formContent">
              <div class="icon-box">
                <i class="fa fa-check"></i>
              </div><br />
              <form onSubmit={this.handleSubmit}>
                <div>
                  <h4>Submission Successful!</h4>
                </div>
                <div>
                  <p>We have received the information<br />
                    And will get in touch shortly</p>
                </div>
                <div class="success-footer">
                  <input type="submit" className="fadeIn fourth" value="Ok" />
                </div>
              </form>
            </div>
          </div>
        </div>
      )
    }

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
                      <div>
                    <h4 className="box-head" onClick={this.arrowFunction.bind(this, groupKey)} data-toggle="collapse" data-target={'#' + group.groupName}  >
                      <i class="fa fa-bars icon-algn1"></i> {group.groupLabel}
                      <i  id={group.toggleActive + '_test'} class={`icon-algn2 ${group.toggleActive ? "fa fa-minus" : "fa fa-plus"}`} ></i>
                        {/* <i id={group.toggleActive + '_test'} className={group.toggleActive ? "fa fa-angle-up" : "fa fa-angle-down"}></i> */}
                      </h4>
                      {
                        group.groupName === "ServersinMigrationScope" &&
                        <button id="addButton" className="btn btn-primary" name="addButton" onClick={this.addNewServerInfoFunc}>Add <i className="fa fa-plus"></i></button>
                      } 
                      </div>
                      <div className="box-body collapse show" id={group.groupName}>
                        <div className="row">
                          {
                            group.fields.map((field, fieldKey) => (
                              <div className="field-align col-md-3">
                                <Type group={group} changeFullGroup={this.changeFullGroup} field={field} fieldKey={fieldKey} stateGroups={this.state.groups} addNewServer={this.setNewServer} addNewServerInfo={this.setNewServerInfo} func={this.setStateFunction} delSubField={this.delSubField} delFifthSecState={this.delFifthSecState} state={this.state} />
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
          <button className="submit-btn btn btn-success" disabled={this.state.btnDisable} onClick={this.submit}>Submit</button>
        </div>
      </div>
    )
  }
}

export default App;