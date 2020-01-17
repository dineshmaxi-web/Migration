import React from 'react';
import Modal from 'react-modal';
import { CountryDropdown, RegionDropdown } from 'react-country-region-selector';
import './App.css';


class Type extends React.Component {
  state = {
    showInstall: false,
    showDsn: false,
    showSan: false,
    showVmWare: false,
    modalIsOpen: false,
    tempVar: "",
    sendArray: "",
    country: "",
    region: "",
    showISCSI : false
  }

  selectCountry = (val) => {
    this.setState({ country: val });
     
    this.props.func("country", val);
  }

  selectRegion = (val) => {
    this.setState({ region: val });
    this.props.func("state", val);
  }

  changeShowInstall = () => {
    if (this.state.showInstall)
      this.setState({ showInstall: false })
    else
      this.setState({ showInstall: true })
  }

  onChangeHandler = (event) => {
    var fieldName = event.target.name;
    var fieldValue = event.target.value;

    if (event.target.type === "text" || event.target.type === "date" || event.target.type === "textarea") {
      this.props.func(fieldName, fieldValue);

      //Changing show Required to true and false
      this.props.group.fields.map(field => {
        if(field.hasOwnProperty("subField"))
        {
            field.subField.map(subField => {
              if(subField.hasOwnProperty("subField"))
              {
                subField.subField.map(subSubField => {
                  if(subSubField.fieldName === event.target.name && event.target.value !== "")
                  {
                    subSubField.showRequired = false;
                  }
                  if(subSubField.fieldName === event.target.name && event.target.value === "")
                  {
                    subSubField.showRequired = true;
                  }
                })
              }
              
            if(subField.fieldName === event.target.name && event.target.value !== "")
            {
              subField.showRequired = false;
            }
            if(subField.fieldName === event.target.name && event.target.value === "")
            {
              subField.showRequired = true;
            }
          })
        }
        else{
          if(field.fieldName === event.target.name && event.target.value !== "")
            field.showRequired = false;
          if(field.fieldName === event.target.name && event.target.value === "")
            field.showRequired = true;
        }
      })

      this.props.stateGroups.map(group => {
        if(group.groupName === this.props.group.groupName)
        {
          group = this.props.group;
          this.props.changeFullGroup(this.props.stateGroups)
        }
      })

    }

    if (event.target.type === "checkbox") {
      if (event.target.checked)
      {
        this.props.func(fieldName, 1);

        //Changing show Required to true
        this.props.group.fields.map(field => {
          if(field.hasOwnProperty("subField"))
          {
            field.subField.map(subField => {
              subField.mandatory = true;
              subField.showRequired = true;
            })
          }
        })

        this.props.stateGroups.map(group => {
          if(group.groupName === this.props.group.groupName)
          {
            group = this.props.group;
            this.props.changeFullGroup(this.props.stateGroups)
          }
        })

      }

      else{
        this.props.func(fieldName, 0);
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
    let lengthOfFields = this.props.group.fields.length - 1;

    var newServer = {
      "fieldName": this.props.group.fields[lengthOfFields].fieldName + "_1",
      "fieldLabel": "Servers",
      "fieldType": "select",
      "mandatory": false,
      "isActive": 1,
      "subField": [
        {
          "fieldName": this.props.group.fields[lengthOfFields].subField[0].fieldName + "_1",
          "fieldLabel": "VMware",
          "fieldType": "option",
          "disabled": false,
          "mandatory": false,
          "isActive": 1,
          "show": false,
          "subField": [
            {
              "fieldName": this.props.group.fields[lengthOfFields].subField[0].subField[0].fieldName,
              "fieldLabel": "Number of ESX Hosts",
              "placeholder": "No. of ESX Hosts",
              "fieldType": "text",
              "mandatory": false,
              "isActive": 1
            },
            {
              "fieldName": this.props.group.fields[lengthOfFields].subField[0].subField[1].fieldName,
              "fieldLabel": "Number of VM Guests",
              "placeholder": "NO. of VM Guests",
              "fieldType": "text",
              "mandatory": false,
              "isActive": 1
            },
            {
              "fieldName": this.props.group.fields[lengthOfFields].subField[0].subField[2].fieldName,
              "fieldLabel": "Number of SAN Boots",
              "placeholder": "No. of SAN Boots",
              "fieldType": "text",
              "mandatory": false,
              "isActive": 1
            }
          ]
        }
      ]
    }

    this.props.group.fields[lengthOfFields].subField.map((subField, index) => {
      if (index !== 0) {
        newServer.subField.push({
          "fieldName": subField.fieldName + "_1",
          "fieldLabel": subField.fieldLabel,
          "fieldType": "option",
          "disabled": false,
          "mandatory": false,
          "isActive": 1
        })
      }
    })

    newServer.subField.map((subField) => {
      if (subField.fieldLabel === this.state[subField.fieldLabel]) {
        subField.disabled = true;
      }
    })
    this.props.addNewServerInfo(newServer);
  }

  onChangeAddServerName = (event) => {
    this.setState({ tempVar: event.target.value });
  }

  onClickAddServerName = () => {
    var count = 0;
    var tempField = this.props.group.fields[0].subField;

    tempField.map(field => {
      if (field.fieldLabel === this.state.tempVar) {
        count = count + 1;
      }
    })

    if (count === 0) {
      this.props.addNewServer({
        fieldName: this.state.tempVar,
        fieldLabel: this.state.tempVar,
        disabled: false,
        fieldType: "option",
        isActive: 1
      })
    }

  }

  handleSelect1 = (event) => {
    var fieldName = event.target.name;
    var fieldValue = event.target.value;
    this.props.func(fieldName, fieldValue);

    
    if(event.target.name === "deliverySpecific" || event.target.name === "migrationType")
    {
      console.log(this.props.group)
      this.props.group.fields.map(field => {
        if(field.fieldName === event.target.name)
        {
          console.log(field)
          field.subField.map(subField => {
            console.log(event.target.value , subField.fieldLabel)
            if(event.target.value === subField.fieldLabel)
            {
              field.showRequired = false;
            }
          })
        }
      })  

      this.props.stateGroups.map(group => {
        if(group.groupName === this.props.group.groupName)
        {
          group = this.props.group;
          this.props.changeFullGroup(this.props.stateGroups)
        }
      })
    }

    if (fieldValue === "Fiber Channel") {
      this.setState({showSan: true, showISCSI: false})
      let groupFour = this.props.stateGroups;
      groupFour[4].isActive = 1;

      //Mandatory true in fifth section
      groupFour[4].fields.map(field => {
        
        if(groupFour[4].fields[0].hasOwnProperty("mandatory"))
        {
          groupFour[4].fields[0].mandatory = true;
        }

        if(field.hasOwnProperty("subFields"))
        {
          field.subFields.map(subField => {
        
            if(subField.hasOwnProperty("subFields"))
            {
              subField.subField.map(subSubField => {
                if(subSubField.hasOwnProperty("mandatory"))
                {
                  subSubField.mandatory = false;
                }
              })
            }
        
          })
        }
      })
      this.props.changeFullGroup(groupFour);
      
      //Mandatory changing in own fields and subfields
     
      this.props.field.subField.map(subField => {
        if(subField.subField)
        {
          if(subField.fieldLabel === "Fiber Channel")
          {
            this.props.delConnectivitySubField("NoofSANPorts");
            this.props.field.showRequired = false;

            subField.subField.map(subSubField => {
              
              if(event.target.value === subField.fieldLabel)
              {
                subSubField.mandatory = true;
                subSubField.showRequired = true;
              }
              
              this.props.group.fields.map(field => {
                if(field.fieldName === fieldName)
                {
                  field = this.props.field
                  this.props.stateGroups[3] = this.props.group
                  this.props.changeFullGroup(this.props.stateGroups)
                }
              })
            })
          }
          // else{
          //   subField.subField.map(subSubField => {
          //     subSubField.mandatory = false;
                
          //     this.props.group.fields.map(field => {
          //       if(field.fieldName === fieldName)
          //       {
          //         field = this.props.field
          //         this.props.stateGroups[3] = this.props.group
          //         this.props.changeFullGroup(this.props.stateGroups)
          //       }
          //     })
          //   })
          // }
        }
      })   
    }

    if(fieldValue === "NAS"){
      
      let groupFour = this.props.stateGroups;
      this.setState({ showISCSI: false, showSan: false })
      groupFour[4].isActive = 0;
      this.props.field.showRequired = false;

      //Mandatory false in fourth section last elements
      this.props.field.subField.map(subField => {
        if(subField.subField)
        {
              subField.subField.map(subSubField => {
                subSubField.mandatory = false;

                this.props.group.fields.map(field => {
                  if(field.fieldName === fieldName)
                  {
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
        if(field.hasOwnProperty("mandatory"))
        {
          field.mandatory = false;
        }

        if(field.hasOwnProperty("subFields"))
        {
          field.subFields.map(subField => {

            if(subField.hasOwnProperty("subFields"))
            {
              subField.subField.map(subSubField => {
                if(subSubField.hasOwnProperty("mandatory"))
                {
                  subSubField.mandatory = false;
                }
              })
            }
        
          })
        }
      })
      this.props.changeFullGroup(groupFour);
    }

    if(fieldValue === "ISCSI") {
      this.setState({ showISCSI: true, showSan: false })
      let groupFour = this.props.stateGroups;
      groupFour[4].isActive = 1;

      //Mandatory true in fifth section
      groupFour[4].fields.map(field => {
        
        if(groupFour[4].fields[0].hasOwnProperty("mandatory"))
        {
          groupFour[4].fields[0].mandatory = true;
        }

        if(field.hasOwnProperty("subFields"))
        {
          field.subFields.map(subField => {

            if(subField.hasOwnProperty("subFields"))
            {
              subField.subField.map(subSubField => {
                if(subSubField.hasOwnProperty("mandatory"))
                {
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
        if(subField.subField)
        {
          if(subField.fieldLabel === "ISCSI")
          {
            this.props.delConnectivitySubField("NoofISCSI");
            this.props.field.showRequired = false;

            subField.subField.map(subSubField => {
              if(event.target.value === subField.fieldLabel)
              {
                subSubField.mandatory = true;
                subSubField.showRequired = true;
              }

              this.props.group.fields.map(field => {
                if(field.fieldName === fieldName)
                {
                  field = this.props.field
                  this.props.stateGroups[3] = this.props.group
                  this.props.changeFullGroup(this.props.stateGroups)
                }
              })
            })
          }
          else{
            subField.subField.map(subSubField => {
                subSubField.mandatory = false;

              this.props.group.fields.map(field => {
                if(field.fieldName === fieldName)
                {
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
    var fieldName = event.target.name
    var fieldValue = event.target.value;

    if (event.target.value === "VMware") {
      this.setState({ [event.target.value]: event.target.value });
      this.props.func(fieldName, fieldValue);
      this.setState({ showVmWare: true });

      this.props.field.subField.map(subField => {
        if(subField.subField)
        {
          if(subField.fieldLabel === "VMware")
          {
              subField.subField.map(subSubField => {
                subSubField.mandatory = true;

                this.props.group.fields.map(field => {
                  if(field.fieldName === fieldName)
                  {
                    field = this.props.field
                    this.props.stateGroups[4] = this.props.group
                    this.props.changeFullGroup(this.props.stateGroups)
                  }
                })
              })
          }
          else{
            subField.subField.map(subSubField => {
              subSubField.mandatory = false;

              this.props.group.fields.map(field => {
                if(field.fieldName === fieldName)
                {
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
    else if (event.target.value === "Add Server") {
      this.setState({ modalIsOpen: true });
      this.setState({ showVmWare: false });
    }
    else {
      this.setState({ [event.target.value]: event.target.value });
      this.setState({ showVmWare: false });
      this.props.func(fieldName, fieldValue);

      this.props.field.subField.map(subField => {
        if(subField.subField)
        {
          subField.subField.map(subSubField => {
            subSubField.mandatory = false;

            this.props.group.fields.map(field => {
              if(field.fieldName === fieldName)
              {
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

  render() {   
    
    var fieldType = this.props.field.fieldType;
    var fieldName = this.props.field.fieldName;
    var fieldLabel = this.props.field.fieldLabel;
    var subField = this.props.field.subField;
    var placeholder = this.props.field.placeholder;
    var fieldKey = this.props.fieldKey;

    if (fieldType === "text") {
      return (
        <div id={fieldName + '_field'} name={fieldName + '_field'}>
          <label id={fieldName + '_label'} name={fieldName + '_label'}>{fieldLabel}</label>
          <input id={fieldName} type={fieldType} placeholder={placeholder} name={fieldName} onChange={this.onChangeHandler} />
          {
            (this.props.field.showRequired ? (<span style={{ color: "red" }}>* Required</span>) : (<span></span>))
          }
        </div>
      )
    }

    if (fieldType === "textarea") {
      return (
        <div id={fieldName + '_field'} name={fieldName + '_field'}>
          <label id={fieldName + '_label'} name={fieldName + '_label'}>{fieldLabel}</label>
          <textarea id={fieldName} type={fieldType} name={fieldName} onChange={this.onChangeHandler}></textarea>
          {
            (this.props.field.showRequired ? (<span style={{ color: "red" }}>* Required</span>) : (<span style={{ color: "red" }}></span>))
          }
        </div>
      )
    }

    if (fieldType === "checkbox") {
      if (subField && subField[0].fieldType === "checkbox") {
        return (
          <div id={fieldName + '_field'} name={fieldName + '_field'}>
            <label id={fieldName + '_label'}>{fieldLabel}</label>
            <input className="checkbox" type={fieldType} id={fieldName} name={fieldName} onClick={this.changeShowInstall} onChange={this.onChangeHandler} required></input>
            {
              (this.state.showInstall ? (
                subField.map((field) => (
                  <div id={field.fieldName + '_field'} name={field.fieldName + '_field'}>
                    <label id={field.fieldName + '_label'} name={field.fieldName + '_label'}>{field.fieldLabel}</label>
                    <input className="checkbox" id={field.fieldName} type={field.fieldType} name={field.fieldName} onChange={this.onChangeHandler}></input>
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
            <input className="checkbox" type={fieldType} id={fieldName} name={fieldName} onChange={this.onChangeHandler} onClick={this.changeShowDsn}></input>
            <h1>{this.props.field.showRequired}</h1>
            {
              (this.props.field.showRequired ? (<span style={{ color: "red" }}>* Required</span>) : (null))
            }
            <div className="subfield-algn"> 
            {
              (this.state.showDsn ? (
                subField.map((field) => (
                  <div id={field.fieldName + '_field'} name={field.fieldName + '_field'}>
                    <label id={field.fieldName + '_label'} name={field.fieldName + '_label'}>{field.fieldLabel}</label>
                    <input id={field.fieldName} type={field.fieldType} name={field.fieldName} onChange={this.onChangeHandler}></input>
                    {
                      (field.showRequired ? (<span style={{ color: "red" }}>* Required</span>) : (null))
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
            <input className="checkbox" type={fieldType} id={fieldName} name={fieldName} onClick={this.onChangeHandler}></input>
            {
              (this.props.field.showRequired ? (<span style={{ color: "red" }}>* Required</span>) : (null))
            }
          </div>
        )
      }
    }

    if (fieldType === "select") {
      const { country, region } = this.state;

      if (fieldName === "country") {
       
         return(
          <div className="state-country">
            <div id='country_field' name='country_field'>
              <label id='country_label'>Country</label>
              <CountryDropdown
                value={country}
                onChange={(val) => this.selectCountry(val)} />
              {
                (this.props.field.showRequired ? (<span style={{ color: "red" }}>* Required</span>) : (null))
              }
            </div>

            <div id='region_field' name='region_field'>
              <label id='region_label'>Region</label>
              <RegionDropdown
                country={country}
                value={region}
                onChange={(val) => this.selectRegion(val)} />
              {
                (this.props.field.showRequired ? (<span style={{ color: "red" }}>* Required</span>) : (null))
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
              (this.props.field.showRequired ? (<span style={{ color: "red" }}>* Required</span>) : (null))
            }
            {
              (this.state.showISCSI && subSubField[1][0] ? (
                  <div id={subSubField[1][0].fieldName + '_field'} name={subSubField[1][0].fieldName + '_field'}>
                      <label id={subSubField[1][0].fieldName + '_label'} name={subSubField[1][0].fieldName + '_label'}>{subSubField[1][0].fieldLabel}</label>
                      <input type={subSubField[1][0].fieldType} id={subSubField[1][0].fieldName} name={subSubField[1][0].fieldName} onChange={this.onChangeHandler}></input>
                      {
                        (subSubField[1][0].showRequired ? (<span style={{ color: "red" }}>* Required</span>) : (null))
                      }
                  </div>
                ) : (null))
            }
            {
              (this.state.showSan && subSubField[0][0] ? (
                <div id={subSubField[0][0].fieldName + '_field'} name={subSubField[0][0].fieldName + '_field'}>
                  <label id={subSubField[0][0].fieldName + '_label'} name={subSubField[0][0].fieldName + '_label'}>{subSubField[0][0].fieldLabel}</label>
                  <input type={subSubField[0][0].fieldType} id={subSubField[0][0].fieldName} name={subSubField[0][0].fieldName} onChange={this.onChangeHandler}></input>
                  {
                    (subSubField[0][0].showRequired ? (<span style={{ color: "red" }}>* Required</span>) : (null))
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
          <div className="row">
            <div className="field-align col-md-3 mt-2" id={fieldName + '_field'} name={fieldName + '_field'}>
            
              {fieldKey == 0 &&
                <>
                  <button id="addButton" className="btn btn-primary" name="addButton" onClick={this.addNewServerInfoFunc}>Add</button>
                  <label id={fieldName + '_label'} name={fieldName + '_label'}>{fieldLabel}</label>
                </>
              }
              
              <select onChange={this.handleSelect2} id={fieldName} name={fieldName}>

                <option value="" selected disabled>{"Select " + fieldLabel}</option>
                {
                  subField.map((field) => (
                    <option id={field.fieldName} disabled={field.disabled} name={fieldName} value={field.fieldLabel}>{field.fieldLabel}</option>
                  ))
                }
                <option id="addServerOption" name="addServerOption" value="Add Server">Add Server</option>
              </select>
              {
              (this.props.field.showRequired ? (<span style={{ color: "red" }}>* Required</span>) : (<span></span>))
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
                <button className="closeModal-btn" id="closeModal" name="closeModal" onClick={this.closeModal}>&times;</button>
                <label className="server-label" id="serverLabel" name="ServerLabel">Add New Server</label><br />
                <input className="Server-input" id="ServerName" name="serverName" placeholder="Add New Server here" onChange={this.onChangeAddServerName} />
                <button className="addserver-btn" id="addServerBtn" name="addServerBtn" onClick={this.onClickAddServerName}>Add</button>
              </Modal>
            </div>
            <div className="field-align align col-md-9">
              {
                (this.state.showVmWare && subSubField ? (
                  subSubField.map((field) => (
                    field.map((field) => (
                      <div className="field-align col-md-4" id={field.fieldName + '_field'} name={field.fieldName + '_field'}>
                        <label id={field.fieldName + '_label'} name={field.fieldName + '_label'}>{field.fieldLabel}</label>
                        <input type={field.fieldType} id={field.fieldName} name={field.fieldName} onChange={this.onChangeHandler}></input>
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
        // let subSubField = [];
        // subField.map((field) => (
        //   (field.subField ? (
        //     subSubField.push(field.subField)
        //   ) : (null))
        // ))

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
              (this.props.field.showRequired ? (<span style={{ color: "red" }}>* Required</span>) : (null))
            }
          </div>
        )
      }
      else {
        return null
      }
    }

    if (fieldType === "date") {
      return (
        <div id={fieldName + '_field'} name={fieldName + '_field'}>
          <label id={fieldName + '_label'}>{fieldLabel}</label>
          <input type={fieldType} id={fieldName} name={fieldName} onChange={this.onChangeHandler}></input>
          {
            (this.props.field.showRequired ? (<span style={{ color: "red" }}>* Required</span>) : (null))
          }
        </div>
      )
    }

    return null
  }
}

export default Type;