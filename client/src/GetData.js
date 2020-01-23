import React, { Component } from "react";
import Login from './Login.js';
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-balham.css";
import logo from './vtglogo.jpg';
import './Detail.css';
import Modal from 'react-modal';
import _ from 'lodash';


var args = ["name", "emailAddress","phoneNumber", "country", "state", "zipCode"];
var fieldKeysOfGroup = [];
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
    dbData :[],
    pushData : [],
    pushKeys : [],
    dbGroup :[]
  }

  closeModal = () => {
    this.setState({ showHome: true, modalIsOpen: false, showLogin: false });
  }

  handleLogout = () => {
    this.setState({ showLogin: true, showHome: false, modalIsOpen: false })
  }

  onRowClicked = (e) => {
    this.setState({ modalIsOpen: true, showHome: false, showLogin: false });

    this.state.dbGroup.map(group => {
      group.fields.map(field => {
        fieldKeysOfGroup.push(field.fieldName)
        if(field.subField)
        {
          field.subField.map(subField => {
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

    for(let j = 0 ; j <  this.state.dbData.length ; j++)
    {
      let objectKeys = Object.keys(this.state.dbData[j].data);
      this.setState({pushKeys : objectKeys})
      let objects = Object.values(this.state.dbData[j].data);
      let lengthOfObjectValues = Object.values(this.state.dbData[j].data).length; 
      

      for(let i = 0 ; i < lengthOfObjectValues ; i++)
      {
        if(objects[i].hasOwnProperty("emailAddress"))
        {
          if(objects[i].emailAddress === e.data.emailAddress)
          { 
            this.setState({pushData : objects}, ()=>console.log(this.state.pushData))            
          }
           
        }
      }
    }
  }
  
  onGridReady = params => {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }

  setFixedSize = () =>{
    this.gridApi.sizeColumnsToFit();
  }

  componentDidMount(){
    fetch('/get/formdata')
    .then(result => result.json())
    .then(rowDataSet => {
      this.setState({dbData : rowDataSet})
    });

    fetch('/get/forminfo')
    .then(result => result.json())
    .then(groupDataSet => {
      this.setState({dbGroup : groupDataSet})
    });

    fetch('/get/formdata')
      .then(result => result.json())
      .then(rowDataSet => {

        var tempRowData = [];
        var tempColumnDefs = [];
      
        rowDataSet.map(function(rowData){
          tempRowData.push(_.assign.apply(_, Object.values(rowData.data)));
        })

        
        for (let i = 0; i < args.length; i++) {
          tempColumnDefs.push({
            "headerName": args[i].charAt(0).toUpperCase() + args[i].slice(1).replace(/([A-Z])/g, ' $1').trim(),
            "field": args[i],
            lockPosition: true
          });
        }

        tempColumnDefs.push({
          headerName: "View",
          lockPosition: true,
          cellRendererFramework: () => {
            return <i className="fa fa-eye fullView"></i>
          },
        });

        this.setState({ rowData: tempRowData, columnDefs: tempColumnDefs })
      })
  }

  render() {
    var datas = this.state.dbData;
    var keys = Object.keys(datas)

    if (this.state.showHome) {
      return (
        <div>
          <div className="header">
            <img src={logo} className="logo"></img>
            <input type="Submit" className="logout-btn" onClick={this.handleLogout} value="Log Out"></input>
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

    if (this.state.modalIsOpen) {
      return (
        <div className="data-modal">
          <div className="header">
            <img src={logo} className="logo"></img>
            <button className="CloseData-btn btn-primary" id="CloseData" name="CloseData" onClick={this.closeModal}>
          <i className="fa fa-arrow-circle-left"></i> BACK</button>
          </div>
          <Modal
            isOpen={this.state.modalIsOpen}
            onRequestClose={this.state.closeModal}
            contentLabel="Example Modal"
            ariaHideApp={false}
            className="modal_data"
          >
            <div>
              {
                this.state.pushData.map((obj, index) => (
                  <div className="box">
                    <h4 className="box-head">{this.state.pushKeys[index].replace(/([A-Z])/g, ' $1').trim()}</h4>
      
                    <div className="box-body">
                      <div className="row">
                      {
                        fieldKeysOfGroup.map(fieldName => (
                          Object.keys(obj).map((key, index) => (
                            (key === fieldName &&
                              <div className="col-md-3 modal-algn">
                                <label>{key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1').trim()}</label> 
                                <input value={obj[key]} disabled></input>  
                              </div>
                            )
                          ))
                        ))
                      }
                    </div>
                  </div>
                  </div>
                ))
              }
            </div>
          </Modal>
        </div>

      )
    }
  }
}

export default GetData;