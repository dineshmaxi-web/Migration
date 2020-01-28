import React from 'react';
import Modal from 'react-modal';
import { CountryDropdown, RegionDropdown } from 'react-country-region-selector';
import './App.css';
import 'flatpickr/dist/themes/material_green.css';
import Flatpickr from 'react-flatpickr';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import Input from 'react-phone-number-input/input';
import _ from 'lodash';
import $ from "jquery";
import EmailValidator from 'email-validator';

class Type extends React.Component {
  state = {
    showInstall: false,
    showDsn: false,
    showSan: false,
    showVmWare: false,
    modalIsOpen: false,
    tempVar: "",
    sendArray: "",
    country: "United States",
    state: "Texas",
    showISCSI: false,
    date: new Date(),
    phoneNumber: "",
    inValidEmail : false
  }

  selectCountry = (val) => {
    var groupName = this.props.group.groupName;

    this.setState({ country: val });
    this.props.func("country", val, groupName);
    this.props.field.showRequired = false;
  }

  selectRegion = (val) => {
    var groupName = this.props.group.groupName;

    this.setState({ state: val });
    this.props.func("state", val, groupName);
  }

  changeShowInstall = () => {
    if (this.state.showInstall)
      this.setState({ showInstall: false })
    else
      this.setState({ showInstall: true })
  }


  onChangeHandler = (fieldName, fieldValue, fieldType, event) => {

    var groupName = this.props.group.groupName;

    if(fieldType === "email")
    {
      if(EmailValidator.validate(fieldValue)){
        this.setState({inValidEmail : false})
       this.props.func(fieldName, fieldValue, groupName);
      }
      else{
        event.target.value = "";
        this.setState({inValidEmail : true})
      }
    }

    if (fieldType === "text" || fieldType === "date" || fieldType === "phoneNumber" || fieldType === "textarea") {
      if(fieldType === "date")
      {
        fieldValue = String(fieldValue[0]).substring(4, 15);
      }

      this.props.func(fieldName, fieldValue, groupName);

      //Changing show Required to true and false
      this.props.group.fields.map(field => {
        if (field.hasOwnProperty("subField")) {
          field.subField.map(subField => {
            if (subField.hasOwnProperty("subField")) {
              subField.subField.map(subSubField => {
                if (subSubField.fieldName === fieldName && fieldValue !== "") {
                  subSubField.showRequired = false;
                }
              })
            }

            if (subField.fieldName === fieldName && fieldValue !== "") {
              subField.showRequired = false;
            }
          })
        }
        else {
          if (field.fieldName === fieldName && fieldValue !== "")
            field.showRequired = false;
        }
      })

      this.props.stateGroups.map(group => {
        if (group.groupName === this.props.group.groupName) {
          group = this.props.group;
          this.props.changeFullGroup(this.props.stateGroups)
        }
      })

    }


    if (fieldType === "checkbox") {

      var groupName = this.props.group.groupName;
      if (event.target.checked) {

        this.props.func(fieldName, 1, groupName);
      
        //Changing show Required to false
        this.props.group.fields.map(field => {
          if (field.hasOwnProperty("subField")) {
            
              field.subField.map(subField => {
                if(subField.fieldType === "checkbox")
                {
                  subField.mandatory = false;
                }
                if(subField.fieldType === "text")
                {
                  subField.mandatory = true;
                }
              })
          }
        })

        this.props.stateGroups.map(group => {
          if (group.groupName === this.props.group.groupName) {
            group = this.props.group;
            this.props.changeFullGroup(this.props.stateGroups)
          }
        })
      }
      else {
        this.props.group.fields.map(field => {
          if (field.hasOwnProperty("subField")) {
            field.subField.map(subField => {
              subField.mandatory = false;
              subField.showRequired = false;
            })
          }
        })

        this.props.stateGroups.map(group => {
          if (group.groupName === this.props.group.groupName) {
            group = this.props.group;
            this.props.changeFullGroup(this.props.stateGroups)
          }
        })

        if (event.target.name === "migrationbetween") {
          this.props.delSubField(this.props.group.groupName, "destinationSiteName", "destinationSiteAddress");
        }
        if (event.target.name === "freeze") {
          this.props.delSubField(this.props.group.groupName, "when");
        }

        this.props.func(fieldName, 0, groupName);
      }
    }

  }

  changeShowDsn = () => {
    if (this.state.showDsn)
      this.setState({ showDsn: false })
    else
      this.setState({ showDsn: true })
  }

  changeShowVmWare = () => {
    if (this.state.showVmWare)
      this.setState({ showVmWare: false })
    else
      this.setState({ showVmWare: true })
  }

  openModal = () => {
    this.setState({ modalIsOpen: true });
  }

  closeModal = () => {
    this.setState({ modalIsOpen: false });
  }

  addNewServerInfoFunc = () => {
    var lengthOfFields = this.props.group.fields.length - 1;
    var copyField = {};
    var group = this.props.group;

    group.fields.map((field,index) => {
      
      if(index === 0)
      {
        copyField = _.clone(field, true);
        copyField.fieldName = field.fieldName + "_" + lengthOfFields;
        copyField.subField.map((subField)=>{
          if(index === 0){
            subField.fieldName = copyField.fieldName;
          }
        })
        this.props.group.fields.push(copyField)
      }
    })

    this.props.stateGroups[4] = group
    this.props.changeFullGroup(this.props.stateGroups)
  } 

  onChangeAddServerName = (event) => {
    if(event.target.value !== "" )
      this.setState({ tempVar: event.target.value });
  }

  onClickAddServerName = () => {
    var copyField = {};
    this.setState({ modalIsOpen: false });
    var group = this.props.group;
    group.fields.map(field => {
      copyField = _.clone(field, true);
      if(copyField.fieldName ==  copyField.subField[0].fieldName  && this.state.tempVar !== ""){
        let count = 0;
        copyField.subField.map(subSubField => {
          if(subSubField.fieldLabel.toUpperCase() === this.state.tempVar.toUpperCase())
          {
            count = count + 1;
          }
        })

        if(count === 0)
        {
          copyField.subField.push({
            fieldName : copyField.fieldName,
            fieldLabel : this.state.tempVar,
            fieldType : "option",
            disabled : false,
            isActive : 1
          })
        }
      }
      
    })   

    this.props.stateGroups[4] = this.props.group
    this.props.changeFullGroup(this.props.stateGroups)
  }

  handleSelect1 = (event) => {
    var groupName = this.props.group.groupName;
    var fieldName = event.target.name;
    var fieldValue = event.target.value;

    this.props.func(fieldName, fieldValue, groupName);

    if (fieldName === "deliverySpecific" || fieldName === "migrationType") {
  
      this.props.group.fields.map(field => {
        if (field.fieldName === fieldName) {
          field.subField.map(subField => {
            if (fieldValue === subField.fieldLabel) {
              field.showRequired = false;
            }
          })
        }
      })

      this.props.stateGroups.map(group => {
        if (group.groupName === this.props.group.groupName) {
          group = this.props.group;
          this.props.changeFullGroup(this.props.stateGroups)
        }
      })
    }

    if (fieldValue === "Fiber Channel") {
      this.setState({ showSan: true, showISCSI: false })
      let groupFour = this.props.stateGroups;
      groupFour[4].isActive = 1;

      this.props.delSubField(this.props.group.groupName, "NoofISCSI");
      this.props.field.showRequired = false;
      //Mandatory true in fifth section
      groupFour[4].fields.map(field => {

        if (groupFour[4].fields[0].hasOwnProperty("mandatory")) {
          groupFour[4].fields[0].mandatory = true;
        }

        if (field.hasOwnProperty("subFields")) {
          field.subFields.map(subField => {

            if (subField.hasOwnProperty("subFields")) {
              subField.subField.map(subSubField => {
                if (subSubField.hasOwnProperty("mandatory")) {
                  subSubField.mandatory = false;
                  subSubField.showRequired = false;
                }
              })
            }

          })
        }
      })
      this.props.changeFullGroup(groupFour);

      //Mandatory changing in own fields and subfields

      this.props.field.subField.map(subField => {
        if (subField.subField) {
          if (subField.fieldLabel === "Fiber Channel") {

            subField.subField.map(subSubField => {

              if (event.target.value === subField.fieldLabel) {
                subSubField.mandatory = true;
                subSubField.showRequired = false;
              }

              this.props.group.fields.map(field => {
                if (field.fieldName === fieldName) {
                  field = this.props.field
                  this.props.stateGroups[3] = this.props.group
                  this.props.changeFullGroup(this.props.stateGroups)
                }
              })
            })
          }
          else {
            subField.subField.map(subSubField => {
              subSubField.mandatory = false;
              subSubField.showRequired = false;

              this.props.group.fields.map(field => {
                if (field.fieldName === fieldName) {
                  field = this.props.field
                  this.props.stateGroups[3] = this.props.group
                  this.props.changeFullGroup(this.props.stateGroups)
                }
              })
            })
          }
        }
      })
    }

    if (fieldValue === "NAS") {
      this.props.delFifthSecState();
      this.props.delSubField(this.props.group.groupName, "NoofISCSI", "NoofSANPorts");

      let groupFour = this.props.stateGroups;
      this.setState({ showISCSI: false, showSan: false })
      groupFour[4].isActive = 0;
      this.props.field.showRequired = false;

      //Mandatory false in fourth section last elements
      this.props.field.subField.map(subField => {
        if (subField.subField) {
          subField.subField.map(subSubField => {
            subSubField.mandatory = false;
            subSubField.showRequired = false;

            this.props.group.fields.map(field => {
              if (field.fieldName === fieldName) {
                field = this.props.field
                this.props.stateGroups[3] = this.props.group
                this.props.changeFullGroup(this.props.stateGroups)
              }
            })
          })
        }
      })

      //Mandatory false in fifth section
      groupFour[4].fields.map(field => {
        if (field.hasOwnProperty("mandatory")) {
          field.mandatory = false;
        }

        if (field.hasOwnProperty("subFields")) {
          field.subFields.map(subField => {

            if (subField.hasOwnProperty("subFields")) {
              subField.subField.map(subSubField => {
                if (subSubField.hasOwnProperty("mandatory")) {
                  subSubField.mandatory = false;
                }
              })
            }

          })
        }
      })

      this.props.changeFullGroup(groupFour);
    }

    if (fieldValue === "ISCSI") {
      this.setState({ showISCSI: true, showSan: false })
      let groupFour = this.props.stateGroups;
      groupFour[4].isActive = 1;

      this.props.delSubField(this.props.group.groupName, "NoofSANPorts");
      this.props.field.showRequired = false;
      //Mandatory true in fifth section
      groupFour[4].fields.map(field => {

        if (groupFour[4].fields[0].hasOwnProperty("mandatory")) {
          groupFour[4].fields[0].mandatory = true;
        }

        if (field.hasOwnProperty("subFields")) {
          field.subFields.map(subField => {

            if (subField.hasOwnProperty("subFields")) {
              subField.subField.map(subSubField => {
                if (subSubField.hasOwnProperty("mandatory")) {
                  subSubField.mandatory = false;
                }
              })
            }

          })
        }
      })
      this.props.changeFullGroup(groupFour);

      //Mandatory changing
      this.props.field.subField.map(subField => {
        if (subField.subField) {
          if (subField.fieldLabel === "ISCSI") {
            subField.subField.map(subSubField => {
              if (event.target.value === subField.fieldLabel) {
                subSubField.mandatory = true;
              }

              this.props.group.fields.map(field => {
                if (field.fieldName === fieldName) {
                  field = this.props.field
                  this.props.stateGroups[3] = this.props.group
                  this.props.changeFullGroup(this.props.stateGroups)
                }
              })
            })
          }
          else {
            subField.subField.map(subSubField => {
              subSubField.mandatory = false;

              this.props.group.fields.map(field => {
                if (field.fieldName === fieldName) {
                  field = this.props.field
                  this.props.stateGroups[3] = this.props.group
                  this.props.changeFullGroup(this.props.stateGroups)
                }
              })
            })
          }
        }
      })
    }
  }

  handleSelect2 = (event) => {
    var groupName = this.props.group.groupName;
    var fieldName = event.target.name;
    var fieldValue = event.target.value;

    if (fieldValue === "VMware") {

      this.props.field.showRequired = false;

      this.props.group.fields.map(field => {
        if (field.fieldName === fieldName) {
          field = this.props.field
          this.props.stateGroups[4] = this.props.group
          this.props.changeFullGroup(this.props.stateGroups)
        }
      })

      this.setState({ [fieldValue]: fieldValue });
      this.props.func(fieldName, fieldValue, groupName);
      this.setState({ showVmWare: true });

      this.props.field.subField.map(subField => {
        if (subField.subField) {
          if (subField.fieldLabel === "VMware") {
            subField.subField.map(subSubField => {
              subSubField.mandatory = true;
              this.props.group.fields.map(field => {
                if (field.fieldName === fieldName) {
                  field = this.props.field
                  this.props.stateGroups[4] = this.props.group
                  this.props.changeFullGroup(this.props.stateGroups)
                }
              })
            })
          }
          else {
            subField.subField.map(subSubField => {
              subSubField.mandatory = false;

              this.props.group.fields.map(field => {
                if (field.fieldName === fieldName) {
                  field = this.props.field
                  this.props.stateGroups[4] = this.props.group
                  this.props.changeFullGroup(this.props.stateGroups)
                }
              })
            })
          }
        }
      })
    }
    else if (fieldValue === "Add Server") {
      this.setState({ modalIsOpen: true });
      this.setState({ showVmWare: false });

      this.props.group.fields.map(field => {
        if (field.fieldName === fieldName) {
          field = this.props.field
          this.props.stateGroups[4] = this.props.group
          this.props.changeFullGroup(this.props.stateGroups)
        }
      })
    }
    else {
      this.props.field.showRequired = false;

      this.props.group.fields.map(field => {
        if (field.fieldName === fieldName) {
          field = this.props.field
          this.props.stateGroups[4] = this.props.group
          this.props.changeFullGroup(this.props.stateGroups)
        }
      })
      this.setState({ [fieldValue]: fieldValue });
      this.setState({ showVmWare: false });
      this.props.func(fieldName, fieldValue, groupName);

      this.props.field.subField.map(subField => {
        if (subField.subField) {
          subField.subField.map(subSubField => {
            subSubField.mandatory = false;

            this.props.group.fields.map(field => {
              if (field.fieldName === fieldName) {
                field = this.props.field
                this.props.stateGroups[4] = this.props.group
                this.props.changeFullGroup(this.props.stateGroups)
              }
            })
          })
        }
      })
    }
  }

  delCurrentServer = () => {
    this.props.group.fields.map((field, index) => {
      if (field.fieldName === this.props.field.fieldName) {
        this.props.delSubField(this.props.group.groupName, field.fieldName)
        this.props.group.fields.splice(index, 1);
      }
    })

    this.props.stateGroups[4] = this.props.group;
    this.props.changeFullGroup(this.props.stateGroups);
  }

  render() {

    var fieldType = this.props.field.fieldType;
    var fieldName = this.props.field.fieldName;
    var fieldLabel = this.props.field.fieldLabel;
    var subField = this.props.field.subField;
    var placeholder = this.props.field.placeholder;
    var fieldKey = this.props.fieldKey;
    var { phoneNumber } = this.state;

    if (fieldType === "email") {
      return (
        <div id={fieldName + '_field'} name={fieldName + '_field'}>
          <label id={fieldName + '_label'} name={fieldName + '_label'}>{fieldLabel}
          </label>
          <input id={fieldName} type={fieldType} placeholder={placeholder} name={fieldName} onBlur={(e) => this.onChangeHandler(fieldName, e.target.value, fieldType, e)} />
          {
            (this.props.field.showRequired ? (<span style={{ color: "red" }}>*Required</span>) : null)
          }
          {
            (this.state.inValidEmail ? (<span style={{ color: "red" }}>Invalid Email Address</span>) : null)
          }
        </div>
      )
    }

    if (fieldType === "phoneNumber") {
      return (
        <div id={fieldName + '_field'} name={fieldName + '_field'}>
          <label id={fieldName + '_label'}>{fieldLabel}
          </label>
          <PhoneInput
            defaultCountry="US"
            placeholder="Enter phone number"
            value={phoneNumber}
            onChange={(phoneNumber) => this.onChangeHandler(fieldName, phoneNumber, fieldType, "")}/>
          {/* <Input
            className="phone-number"
            placeholder="Enter phone number"
            country="US"
            value={phoneNumber}
            onChange={(phoneNumber) => this.onChangeHandler(fieldName, phoneNumber, fieldType, "")} /> */}
          {
            (this.props.field.showRequired ? (<span style={{ color: "red" }}>*Required</span>) : null)
          }
        </div>
      )
    }

    if (fieldType === "text") {
      return (
        <div id={fieldName + '_field'} name={fieldName + '_field'}>
          <label id={fieldName + '_label'} name={fieldName + '_label'}>{fieldLabel}
          </label>
          <input id={fieldName} type={fieldType} placeholder={placeholder} name={fieldName} onChange={(e) => this.onChangeHandler(fieldName, e.target.value, fieldType, e)} />
          {
            (this.props.field.showRequired ? (<span style={{ color: "red" }}>*Required</span>) : null)
          }
        </div>
      )
    }

    if (fieldType === "textarea") {
      return (
        <div id={fieldName + '_field'} name={fieldName + '_field'}>
          <label id={fieldName + '_label'} name={fieldName + '_label'}>{fieldLabel}</label>
          <textarea id={fieldName} type={fieldType} name={fieldName} onChange={(e) => this.onChangeHandler(fieldName, e.target.value, fieldType, e)}></textarea>
          {
            (this.props.field.showRequired ? (<span style={{ color: "red" }}>*Required</span>) : null)
          }
        </div>
      )
    }

    if (fieldType === "checkbox") {
      if (subField && subField[0].fieldType === "checkbox") {
        return (
          <div id={fieldName + '_field'} name={fieldName + '_field'}>
            <label id={fieldName + '_label'}>{fieldLabel}</label>
            <input className="checkbox" type={fieldType} id={fieldName} name={fieldName} onClick={this.changeShowInstall} onChange={(e) => this.onChangeHandler(fieldName, e.target.value, fieldType, e)}></input>
            {
              (this.state.showInstall ? (
                subField.map((field) => (
                  <div id={field.fieldName + '_field'} name={field.fieldName + '_field'}>
                    <label id={field.fieldName + '_label'} name={field.fieldName + '_label'}>{field.fieldLabel}</label>
                    <input className="checkbox" id={field.fieldName} type={field.fieldType} name={field.fieldName} onChange={(e) => this.onChangeHandler(fieldName, e.target.value, fieldType, e)}></input>
                  </div>
                ))
              ) : (null))
            }
          </div>
        )
      }
      else if (subField && subField[0].fieldType === "text") {
        return (
          <div id={fieldName + '_field'} name={fieldName + '_field'}>
            <label id={fieldName + '_label'}>{fieldLabel}</label>
            <input className="checkbox" type={fieldType} id={fieldName} name={fieldName} onChange={(e) => this.onChangeHandler(fieldName, e.target.value, fieldType, e)} onClick={this.changeShowDsn}></input>
            {
              (this.props.field.showRequired ? (<span style={{ color: "red" }}>*Required</span>) : (null))
            }
            <h1>{this.props.field.showRequired}</h1>

            <div className="subfield-algn">
              {
                (this.state.showDsn ? (
                  subField.map((field) => (
                    <div id={field.fieldName + '_field'} name={field.fieldName + '_field'}>
                      <label id={field.fieldName + '_label'} name={field.fieldName + '_label'}>{field.fieldLabel}</label>

                      <input id={field.fieldName} type={field.fieldType} name={field.fieldName} onChange={(e) => this.onChangeHandler(field.fieldName, e.target.value, field.fieldType, e)}></input>
                      {
                        (field.showRequired ? (<span style={{ color: "red" }}>*Required</span>) : (null))
                      }
                    </div>
                  ))
                ) : (null))
              }
            </div>
          </div>
        )
      }
      else {
        return (
          <div id={fieldName + '_field'} name={fieldName + '_field'}>
            <label id={fieldName + '_label'}>{fieldLabel}</label>

            <input className="checkbox" type={fieldType} id={fieldName} name={fieldName} onChange={(e) => this.onChangeHandler(fieldName, e.target.value, fieldType, e)}></input>
            {/* {
              (this.props.field.showRequired ? (<span style={{ color: "red" }}>*Required</span>) : (null))
            } */}
          </div>
        )
      }
    }

    if (fieldType === "select") {
      const { country, state } = this.state;

      if (fieldName === "country") {

        return (
          <div className="state-country">
            <div id='country_field' name='country_field'>
              <label id='country_label'>Country</label>

              <CountryDropdown
                value={country}
                onChange={(val) => this.selectCountry(val)} />
              {
                (this.props.field.showRequired ? (<span style={{ color: "red" }}>*Required</span>) : (null))
              }
            </div>

            <div id='region_field' name='region_field'>
              <label id='region_label'>Region</label>
              <RegionDropdown
                country={country}
                value={state}
                onChange={(val) => this.selectRegion(val)} />
              {
                (this.props.field.showRequired ? (<span style={{ color: "red" }}>*Required</span>) : (null))
              }
            </div>

          </div>
        )
      }

      if (fieldName === "connectivity") {
        let subSubField = [];
        subField.map((field) => (
          (field.subField ? (
            subSubField.push(field.subField)
          ) : (null))
        ))

        return (
          <div className="connectivity-algn">
            <div id={fieldName + '_field'} name={fieldName + '_field'}>

              <label id={fieldName + '_label'} name={fieldName + '_label'}>{fieldLabel}</label>

              <select onChange={this.handleSelect1} id={fieldName} name={fieldName}>
                <option value="" disabled selected>{"Select " + fieldLabel}</option>
                {
                  subField.map((field) => (
                    <option id={field.fieldName} name={fieldName} value={field.fieldLabel}>{field.fieldLabel}</option>
                  ))
                }
              </select>
              {
                (this.props.field.showRequired ? (<span style={{ color: "red" }}>*Required</span>) : (null))
              }
            </div>

            {
              (this.state.showISCSI && subSubField[1][0] ? (
                <div id={subSubField[1][0].fieldName + '_field'} name={subSubField[1][0].fieldName + '_field'}>
                  <label id={subSubField[1][0].fieldName + '_label'} name={subSubField[1][0].fieldName + '_label'}>{subSubField[1][0].fieldLabel}</label>

                  <input type={subSubField[1][0].fieldType} id={subSubField[1][0].fieldName} name={subSubField[1][0].fieldName} onChange={(e) => this.onChangeHandler(subSubField[1][0].fieldName, e.target.value, subSubField[1][0].fieldType, e)}></input>
                  {
                    (subSubField[1][0].showRequired ? (<span style={{ color: "red" }}>*Required</span>) : (null))
                  }
                </div>
              ) : (null))
            }
            {
              (this.state.showSan && subSubField[0][0] ? (
                <div id={subSubField[0][0].fieldName + '_field'} name={subSubField[0][0].fieldName + '_field'}>
                  <label id={subSubField[0][0].fieldName + '_label'} name={subSubField[0][0].fieldName + '_label'}>{subSubField[0][0].fieldLabel}</label>

                  <input type={subSubField[0][0].fieldType} id={subSubField[0][0].fieldName} name={subSubField[0][0].fieldName} onChange={(e) => this.onChangeHandler(subSubField[0][0].fieldName, e.target.value, subSubField[0][0].fieldType, e)}></input>
                  {
                    (subSubField[0][0].showRequired ? (<span style={{ color: "red" }}>*Required</span>) : (null))
                  }
                </div>
              ) : (null))
            }
          </div>

        )
      }

      else if (this.props.group.groupName === "ServersinMigrationScope") {
        let subSubField = [];
        subField.map((field) => (
          (field.subField ? (
            subSubField.push(field.subField)
          ) : (null))
        ))

        return (
          <div className="row server-box">
            {
              fieldKey > 0 &&
              <button onClick={this.delCurrentServer} className="remove-btn">&times;</button>
            }
            <div className="field-align col-md-3 mt-2 " id={fieldName + '_field'} name={fieldName + '_field'}>
              {/* <button id="addButton" className="btn btn-primary" name="addButton" onClick={this.addNewServerInfoFunc}>Add</button> */}

              <label id={fieldName + '_label'} className="servers_label" name={fieldName + '_label'}>{fieldLabel}

              </label>
              <select onChange={this.handleSelect2} className="servers" id={fieldName} name={fieldName}>

                <option value="" selected disabled>{"Select " + fieldLabel}</option>
                {
                  subField.map((field) => (
                    <option id={field.fieldName} disabled={field.disabled} name={fieldName} value={field.fieldLabel}>{field.fieldLabel}</option>
                  ))
                }
                <option id="addServerOption" name="addServerOption" value="Add Server">Add Server</option>
              </select>
              {fieldKey == 0 &&
                <div>
                  <button id="addButton" className="btn btn-primary" name="addButton" onClick={this.addNewServerInfoFunc}>Add</button>
                </div>
              }
              {
                (this.props.field.showRequired ? (<span className="span-algn" style={{ color: "red" }}>*Required</span>) : (<span></span>))
              }

            </div>
            <div>
              <Modal
                isOpen={this.state.modalIsOpen}
                onRequestClose={this.closeModal}
                contentLabel="Example Modal"
                ariaHideApp={false}
                className="Modal-box"
              >
                <div className="box-head">
                <button className="closeModal-btn btn-danger" id="closeModal" name="closeModal" onClick={this.closeModal}>Cancel <i class="fa fa-remove"></i></button>
                <button className="btn btn-success" id="addServerBtn" name="addServerBtn" onClick={this.onClickAddServerName}>save&close <i class="fa fa-save"></i></button>
                <label className="server-label" id="serverLabel" name="ServerLabel">Add New Server</label>
                </div>
                <div className="modalbody">
                <div class="input-group">
                  <input type="text" className="form-control" id="ServerName" name="serverName" placeholder="Add New Server here" onChange={this.onChangeAddServerName} />
                  <div class="input-group-append">
                </div>
                </div>
                </div>
              </Modal>
            </div>
            <div className="field-align align col-md-9">
              {
                (this.state.showVmWare && subSubField ? (
                  subSubField.map((field) => (
                    field.map((field) => (
                      <div className="field-align col-md-4" id={field.fieldName + '_field'} name={field.fieldName + '_field'}>
                        <label id={field.fieldName + '_label'} name={field.fieldName + '_label'}>{field.fieldLabel}</label>
                        <input type={field.fieldType} id={field.fieldName} name={field.fieldName} onChange={(e) => this.onChangeHandler(field.fieldName, e.target.value, field.fieldType, e)}></input>
                        {
                          (field.showRequired ? (<span className="span-algn" style={{ color: "red" }}>*Required</span>) : (<span></span>))
                        }
                      </div>
                    ))
                  ))
                ) : (null))
              }
            </div>
          </div>
        )
      }
      if (fieldName === "deliverySpecific" || fieldName === "migrationType") {

        return (
          <div id={fieldName + '_field'} name={fieldName + '_field'}>
            <label id={fieldName + '_label'} name={fieldName + '_label'}>{fieldLabel}</label>

            <select onChange={this.handleSelect1} id={fieldName} name={fieldName}>
              <option value="" disabled selected>{"Select " + fieldLabel}</option>
              {
                subField.map((field) => (
                  <option id={field.fieldName} name={fieldName} value={field.fieldLabel}>{field.fieldLabel}</option>
                ))
              }
            </select>
            {
              (this.props.field.showRequired ? (<span style={{ color: "red" }}>*Required</span>) : (null))
            }
          </div>
        )
      }
      else {
        return null
      }
    }

    if (fieldType === "date") {
      var date = this.state.date;

      return (
        <div id={fieldName + '_field'} name={fieldName + '_field'}>
          <label id={fieldName + '_label'}>{fieldLabel}
          </label>

          <Flatpickr
            value={date}
            options={{ dateFormat: "m-d-yy", static: true, wrap: false }}
            onChange={(date) => this.onChangeHandler(fieldName, date, fieldType)} />
            {
              (this.props.field.showRequired ? (<span style={{ color: "red" }}>*Required</span>) : (null))
            }
        </div>
      )
    }

    return null
  }
}

export default Type;