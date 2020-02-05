import React, { Component } from "react";
import Login from './Login.js';
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-balham.css";
import logo from './vtglogo.jpg';
import './Detail.css';
import _ from 'lodash';
import $ from "jquery";



var groupKeys = [], fieldKeysOfGroup = [], dbGroupKeys = [], dummy = [1, 2, 3, 4], startsWithServer = [], startsWithNumber = [];
class GetData extends Component {

  state = {
    modalIsOpen: false,
    showLogin: false,
    showHome: true,
    showDetail: false,
    columnDefs: [],
    defaultColDef: {
      sortable: true,
      resizable: true,
      filter: true,
    },
    pushData: [],
    pushFieldName: [],
    pushKeys: [],
    dbGroup: [],
    startsWithServer : [],
    startsWithNumber : [],
    count: 0,
    startWithNumbers : ["numberofservers", "numberofESXHosts", "numberofVMGuests", "numberofSANBoots"]
  }

  closeModal = () => {
    this.setState({ showHome: true, modalIsOpen: false, showLogin: false });
    window.location = "/get_data";
  }

  handleLogout = () => {
    this.setState({ showLogin: true, showHome: false, modalIsOpen: false })
  }

  onRowClicked = (e) => {
    this.setState({ modalIsOpen: true, showHome: false, showLogin: false });

    fetch('/get/formdata/particular/' + e.data._id)
      .then(result => result.json())
      .then(fullSingleData => {

        groupKeys = Object.keys(fullSingleData[0].data)
        this.setState({ pushData: fullSingleData[0].data }, () => {
          if(this.state.pushData["ServersinMigrationScope"])
          {
              this.setState({ pushFieldName: Object.keys(this.state.pushData["ServersinMigrationScope"]) }, ()=>{
                this.state.pushFieldName.map((key) => {
                  if(key.startsWith("servers"))
                  {
                    startsWithServer.push(key)
                  }
                  else{
                    startsWithNumber.push(key)
                  }
                  this.setState({startsWithServer : startsWithServer, startsWithNumber : startsWithNumber})
              })
            })
          }
      })
    })

    // if(fieldKeysOfGroup[8] === "accountNumber") {
    //   var account= $('p').text('#accountNumber_value')
    //   console.log(account)
    //   account=new Array(account.length-3).join('x') + account.substr(account.length-4, 4);
    // }
}

  onGridReady = params => {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }

  setFixedSize = () => {
    this.gridApi.sizeColumnsToFit();
  }

  componentDidMount() {

    fetch('/get/forminfo')
      .then(result => result.json())
      .then(groupDataSet => {
        this.setState({ dbGroup: groupDataSet })

        this.state.dbGroup.map(group => {
          dbGroupKeys.push(group.groupName)
          group.fields.map(field => {
            fieldKeysOfGroup.push(field.fieldName)
            if (field.subField) {
              field.subField.map(subField => {
                if (subField.fieldType !== "option")
                  fieldKeysOfGroup.push(subField.fieldName)

                if (subField.subField) {
                  subField.subField.map(subSubField => {
                    fieldKeysOfGroup.push(subSubField.fieldName)

                  })
                }
              })
            }
          })
        })

      });

    fetch('/get/formdata/args')
      .then(result => result.json())
      .then(rowDataSet => {
        var tempColumnDefs = [];
        if(rowDataSet.length > 0)
        {
        var argsCopy = Object.keys(rowDataSet[0])

        for (let i = 0; i < argsCopy.length; i++) {
          if (i !== 0) {
            tempColumnDefs.push({
              "headerName": argsCopy[i].charAt(0).toUpperCase() + argsCopy[i].slice(1).replace(/([A-Z])/g, ' $1').trim(),
              "field": argsCopy[i],
              lockPosition: true
            });
          }
          else {
            tempColumnDefs.push({
              "headerName": argsCopy[i].charAt(0).toUpperCase() + argsCopy[i].slice(1).replace(/([A-Z])/g, ' $1').trim(),
              "field": argsCopy[i],
              lockPosition: true,
              hide: true
            });
          }
        }

        tempColumnDefs.push({
          headerName: "View",
          lockPosition: true,
          cellRendererFramework: () => {
            return  <i className="fa fa-eye fullView" style={{ color: "#2B2B2C" }}></i>
          }
        });

        // tempColumnDefs.push({
        //   headerName: "Edit",
        //   lockPosition: true,
        //   cellRendererFramework: () => {
        //     return  <i className="fa fa-edit fullView" onClick={this.editFunction} style={{ color: "#2B2B2C" }}></i>
        //   }
        // });

        this.setState({ rowData: rowDataSet, columnDefs: tempColumnDefs })
        }
      })
     
  }

 

  toggleFunction = (param) => {
    var datas = this.state.dbGroup;
    datas.map(data => {
      if (data.groupName === param) {
        data.toggleActive = !data.toggleActive;
      }
    })
    this.setState({ dbGroup: datas })
  }

  render() {

    var trailingCharsIntactCount = 4;

    if (this.state.showHome) {
      return (
        <div>
          <div className="header">
            <img src={logo} className="logo"></img>
            <button className="logout-btn btn btn-danger" id="CloseData" name="CloseData" onClick={this.handleLogout}>
              <i class="fa fa-sign-out"></i> logout</button>
          </div>
          <div
            className="ag-theme-balham" >
            <AgGridReact
              columnDefs={this.state.columnDefs}
              rowData={this.state.rowData}
              onRowClicked={this.onRowClicked}
              onGridReady={this.onGridReady}
              onFirstDataRendered={this.setFixedSize}
            >
            </AgGridReact>
          </div>
        </div>
      );
    }

    if (this.state.showLogin) {
      return (
        <Login />
      )
    }

    return (
      <div className="data-modal">
        <div className="header">
          <img src={logo} className="logo"></img>
          <button className="CloseData-btn btn-primary" id="CloseData" name="CloseData" onClick={this.closeModal}>
            <i className="fa fa-arrow-circle-left"></i> Back</button>
        </div>
        <div className="container-fluid">
          {
            dbGroupKeys.map((groupName, index) => (
              groupKeys.map((groupKey) => (
                (groupKey === groupName ? (
                  (groupName !== "ServersinMigrationScope" ? (
                    <div className="box">
                      <div>
                        <h4 className="box-head" onClick={() => this.toggleFunction(groupName)} data-toggle="collapse" data-target={'#' + groupName}>
                          <i class="fa fa-bars"></i> {this.state.dbGroup[index].groupLabel}
                          <i class={`icon-algn ${this.state.dbGroup[index].toggleActive ? "fa fa-minus" : "fa fa-plus"}`} ></i>
                        </h4>
                      </div>
                      <div className="form-inline">
                        <div className="box-body collapse show" id={groupName}>
                          <div className="row">
                            {
                              fieldKeysOfGroup.map((fieldName1) => (
                                Object.keys(this.state.pushData[groupName]).map(fieldName => (
                                  ((fieldName1 === fieldName) &&
                                    <div className="col-lg-3 col-md-4 col-sm-6 col-xs-12">
                                      <div className="form-group modal-algn">
                                        <label id={fieldName}>{fieldName.charAt(0).toUpperCase() + fieldName.slice(1).replace(/([A-Z])/g, ' $1').trim()}</label>
  
                                        {
                                          fieldName === "accountNumber" ? this.state.pushData[groupName][fieldName]= new Array(this.state.pushData[groupName][fieldName].length - trailingCharsIntactCount + 1).join('x') + this.state.pushData[groupName][fieldName].slice( -trailingCharsIntactCount)
                                          :  <p id={fieldName + "_value"}>{this.state.pushData[groupName][fieldName]}</p>
                                        }
                                      </div>
                                    </div>
                                  )
                                ))
                              ))
                            }
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                      <div className="box">
                        <div>
                          <h4 className="box-head" onClick={() => this.toggleFunction(groupName)} data-toggle="collapse" data-target={'#' + groupName}>
                            <i class="fa fa-bars"></i> {this.state.dbGroup[index].groupLabel}
                            <i class={`icon-algn ${this.state.dbGroup[index].toggleActive ? "fa fa-minus" : "fa fa-plus"}`} ></i>
                          </h4>
                        </div>
                        <div className="form-inline">
                          <div className="box-body collapse show" id={groupName}>
                        
                            <table id="table-algn">
                              <thead>
                                <th>Servers</th>
                                <th>Number of Servers</th>
                                <th>Number of ESX Hosts</th>
                                <th>Number of VM Guests</th>
                                <th>Number of SAN Boots</th>
                              </thead>
                              {
                                this.state.startsWithServer.map((server) => (
                                  
                                  <tr>

                                   <td>{this.state.pushData[groupName][server]}</td>
                                   
                                    {
                                      this.state.startWithNumbers.map(startsWithNumber => (
                                        this.state.pushFieldName.map((fieldName) => (
                                          (fieldName.startsWith(startsWithNumber) ? (
                                            ((server.charAt(server.length - 1) === fieldName.charAt(fieldName.length - 1)) && (this.state.pushData[groupName][server] !== this.state.pushData[groupName][fieldName] ) ? (                                          
                                              <td>{this.state.pushData[groupName][fieldName]}</td>
                                            ) : (null))
                                          ): (null))
                                        ))
                                      ))
                                    }
                                  </tr>
                                ))
                              }
                            </table>
                          </div>
                        </div>
                      </div>
                    ))
                ) : (null))
              ))
            ))
          }
        </div>
        {/* </Modal> */}
      </div>

    )
  }
}

export default GetData;