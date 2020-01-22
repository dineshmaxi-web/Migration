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
    customerContactInformation: {
      country: "United States",
      state: "Texas",
    },
    opportunityInformation: {
      startDate: new Date(),
      completionDate: new Date()
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
    this.setState({ groups: copyGroup, registrationNumber: copyRegistrationNumber, showSuccess: copyShowSuccess }, () => console.log(this.state.groups))


    //Show Required enabling
    for (let i = 0; i < fieldsInJsons.length; i++) {
      console.log(fieldsInJsons.length)
      for (let j = 0; j < finalValues.length; j++) {
        if (fieldsInJsons[i] === finalValues[j]) {
          countForShowRequired = countForShowRequired + 1;
        }
      }

      if (countForShowRequired === 0) {
        // console.log("called before setstate")
        copyGroup.map((json) => {
          json.fields.map((field) => {
            if (fieldsInJsons[i] === field.fieldName && field.mandatory) {
              field.showRequired = true;
            }

            if (field.subField) {
              field.subField.map((subField) => {
                if (fieldsInJsons[i] === subField.fieldName && subField.mandatory) {
                  subField.showRequired = true;
                }

                if (subField.subField) {
                  subField.subField.map((subSubField) => {
                    if (fieldsInJsons[i] === subSubField.fieldName && subSubField.mandatory) {
                      if (subSubField.fieldType === "text") {
                        subSubField.showRequired = true;
                      }
                      else {
                        subField.showRequired = true;
                      }
                    }
                  })
                }
              })
            }
          })
        })
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
    var keysFourthSection = []
    if (fieldValue === "") {
      delete stateVariables[groupName][fieldName];
      this.setState(stateVariables, () => console.log(this.state));
    }
    else {
      if (stateVariables[groupName]) {
        stateVariables[groupName][fieldName] = fieldValue;
        this.setState(stateVariables, () => {
          if (groupName == "ServersinMigrationScope") {
            this.disableSelectedValue();
          }
        });
      }
      else {
        this.setState({
          [groupName]: { [fieldName]: fieldValue }
        }, () => {
          if (groupName == "ServersinMigrationScope") {
            this.disableSelectedValue();
          }
        })
      }
    }
  }

  disableSelectedValue = () => {
    var fourthSectionValues = Object.values(this.state.ServersinMigrationScope);

    var group = this.state.groups;
    group[4].fields.map(function (grpVal, grpKey) {
      grpVal.subField.map(function (grpSubField) {
        if (fourthSectionValues.indexOf(grpSubField.fieldLabel) == -1) {
          grpSubField.disabled = false;
        } else {
          grpSubField.disabled = true;
        }
      })
    })

    this.setState({ group })
  }

  delFifthSecState = () => {
    var wholeState = this.state;

    delete wholeState["ServersinMigrationScope"]
    this.setState(wholeState, () => console.log(this.state))
  }

  delSubField = (groupName, fieldName1, fieldName2) => {
    let temp = this.state;

    if (temp.hasOwnProperty(groupName)) {
      delete temp[groupName][fieldName1];
      delete temp[groupName][fieldName2];
      this.setState(temp, () => console.log(this.state));
    }
  }

  changeFullGroup = (fullGroup) => {
    this.setState({ groups: fullGroup })
  }

  arrowFunction(groupKey) {
    var groups = this.state.groups;
    groups[groupKey].toggleActive = !groups[groupKey].toggleActive;
    this.setState({ groups });
  }

  render() {

    $(document).ready(function () {
      $('.state-country').parent().removeClass('col-md-3');
      $('.state-country').parent().addClass('col-md-6');
    });

    $(document).ready(function () {
      $('.row').parent().removeClass('col-md-3');
      $('.row').parent().addClass('col-md-12');
    });

    $(document).ready(function () {
      $('#migrationbetween_field').parent().removeClass('col-md-3');
      $('#migrationbetween_field').parent().addClass('col-md-6');
    });

    $(document).ready(function () {
      $('.connectivity-algn').parent().removeClass('col-md-3');
      $('.connectivity-algn').parent().addClass('col-md-6');
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
              <form>
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
                      <h4 className="box-head" onClick={this.arrowFunction.bind(this, groupKey)} data-toggle="collapse" data-target={'#' + group.groupName}  >
                        {group.groupLabel}
                        <i id={group.toggleActive + '_test'} className={group.toggleActive ? "fa fa-angle-up" : "fa fa-angle-down"}></i>
                      </h4>
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