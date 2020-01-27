import React, { Component } from "react";
import Login from './Login.js';
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-balham.css";
import logo from './vtglogo.jpg';
import './Detail.css';
import Modal from 'react-modal';
import _ from 'lodash';


var groupKeys = [], fieldKeysOfGroup = [];
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
    pushData : [],
    pushKeys : [],
    dbGroup :[],
    count : 0
  }

  closeModal = () => {
    this.setState({ showHome: true, modalIsOpen: false, showLogin: false });
  }

  handleLogout = () => {
    this.setState({ showLogin: true, showHome: false, modalIsOpen: false })
  }

  onRowClicked = (e) => {
    this.setState({ modalIsOpen: true, showHome: false, showLogin: false });

    fetch('/get/formdata/particular/'+e.data._id)
    .then(result => result.json())
    .then(fullSingleData => {

      groupKeys = Object.keys(fullSingleData[0].data)
      this.setState({pushData : fullSingleData[0].data}, ()=>console.log(this.state.pushData));
    })
  }
  
  onGridReady = params => {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }

  setFixedSize = () =>{
    this.gridApi.sizeColumnsToFit();
  }

  componentDidMount(){
    
    fetch('/get/forminfo')
    .then(result => result.json())
    .then(groupDataSet => {
      this.setState({dbGroup : groupDataSet})

      this.state.dbGroup.map(group => {
        group.fields.map(field => {
          fieldKeysOfGroup.push(field.fieldName)
          if(field.subField)
          {
            field.subField.map(subField => {
              if(subField.fieldType !== "option")
                fieldKeysOfGroup.push(subField.fieldName)
  
              if(subField.subField)
              {
                subField.subField.map(subSubField => {
                  fieldKeysOfGroup.push(subSubField.fieldName)
  
                })
              }
            })
          }
        })
      })

      console.log(fieldKeysOfGroup)
    });

    fetch('/get/formdata/args')
      .then(result => result.json())
      .then(rowDataSet => {
        var tempColumnDefs = [];
        console.log(rowDataSet)
        var argsCopy = Object.keys(rowDataSet[0])
        console.log(argsCopy)

        for (let i = 0; i < argsCopy.length; i++) {
          if(i !== 0)
          {
            tempColumnDefs.push({  
              "headerName": argsCopy[i].charAt(0).toUpperCase() + argsCopy[i].slice(1).replace(/([A-Z])/g, ' $1').trim(),
              "field": argsCopy[i],
              lockPosition: true
            });
          }
          else{
            tempColumnDefs.push({  
              "headerName": argsCopy[i].charAt(0).toUpperCase() + argsCopy[i].slice(1).replace(/([A-Z])/g, ' $1').trim(),
              "field": argsCopy[i],
              lockPosition: true,
              hide : true
            });
          }
        }

        tempColumnDefs.push({
          headerName: "View",
          lockPosition: true,
          cellRendererFramework: () => {
            return <i className="fa fa-eye fullView"></i>
          },
        });

        this.setState({ rowData: rowDataSet, columnDefs: tempColumnDefs })
      })
  }

  toggleFunction = (param) => {
    var datas= this.state.dbGroup;
    datas.map(data => {
      if(data.groupName === param){
        data.toggleActive=!data.toggleActive;
      }
    })
    this.setState({dbGroup : datas}, ()=>console.log(this.state.dbGroup))
  }

  render() {
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
              groupKeys.map((groupName, index) => (
                (groupName !== "ServersinMigrationScope" ? (
                  <div className="box">
                    <div>
                        <h4 className="box-head" onClick={() => this.toggleFunction(groupName)}  data-toggle="collapse" data-target={'#' + groupName}>
                        <i class="fa fa-bars"></i> {this.state.dbGroup[index].groupLabel}
                        <i  class={`icon-algn ${this.state.dbGroup[index].toggleActive ? "fa fa-minus" : "fa fa-plus"}`} ></i>
                        </h4>
                      </div>
                    <div className="form-inline">
                      <div className="box-body collapse show" id={groupName}>
                        <div className="row">
                          {
                            fieldKeysOfGroup.map((fieldName1,index) => (
                              Object.keys(this.state.pushData[groupName]).map(fieldName => (
                                ((fieldName1 === fieldName) &&
                                  <div className="col-lg-3 col-md-4 col-sm-6 col-xs-12">
                                    <div className="form-group modal-algn">
                                      <label>{fieldName.charAt(0).toUpperCase() + fieldName.slice(1).replace(/([A-Z])/g, ' $1').trim()}</label> 
                                      <input value={this.state.pushData[groupName][fieldName]} disabled></input>  
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
                      <h4 className="box-head" onClick={() => this.toggleFunction(groupName)}  data-toggle="collapse" data-target={'#' + groupName}>
                      <i class="fa fa-bars"></i> {this.state.dbGroup[index].groupLabel}
                      <i  class={`icon-algn ${this.state.dbGroup[index].toggleActive ? "fa fa-minus" : "fa fa-plus"}`} ></i>
                      </h4>
                    </div>
                    <div className="form-inline">
                      <div className="box-body collapse show" id={groupName}>
                        <div className="row">
                            <table id="t01">
                            <thead>
                              <th>Servers</th>
                            </thead>
                            {
                            Object.keys(this.state.pushData[groupName]).map((fieldName) => (
                              <div className="col-md-3 modal-algn form-group">
                                {(fieldName.startsWith("servers") ? (
                                    <tr>
                                      <td><nobr>{this.state.pushData[groupName][fieldName]}</nobr></td>
                                    </tr>
                                ) : (null))}
                              </div>                                
                           ))
                          }
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
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