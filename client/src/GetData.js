import React, { Component } from "react";
import Login from './Login.js';
import Detail from './Detail';
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-balham.css";
import logo from './vtglogo.jpg';
import './Detail.css';
import Modal from 'react-modal';

class GetData extends Component {

  state = {
    modalIsOpen: false,
    showLogin : false,
    showHome : true,
    showDetail : false,
    columnDefs: [],
    rowData: [],
    defaultColDef: {
        sortable: true,
        resizable: true,
        filter: true,
      },
    details : ""
  }


  closeModal = () => {
    this.setState({showHome : true, modalIsOpen : false, showLogin: false});

  }

  handleLogout = () => {
    this.setState({showLogin : true, showHome : false, modalIsOpen: false})
  }

  onRowClicked = (e) => {
    this.setState({modalIsOpen: true, showHome : false, showLogin: false});
    
    for(let i = 0 ; i < this.state.rowData.length ; i++)
    {
        if(this.state.rowData[i].emailAddress === e.data.emailAddress)
        {
          this.setState({details : this.state.rowData[i], showHome : false, showDetail : true}, ()=>console.log(this.state.rowData))
        }
    }
  }

  componentDidMount() {
    fetch('/get/formdata')
        .then(result => result.json())
        .then(rowData =>{
          var tempRowData = [];
          var tempColumnDefs = [];
         

          //Create columnDefs
          for(let i = 0 ; i < Object.keys(rowData[0].data).length - 31 ; i++)
          {
            tempColumnDefs.push({ "headerName": Object.keys(rowData[0].data)[i],
                                  "field": Object.keys(rowData[0].data)[i]
                                });                                    
          } 
                        
          tempColumnDefs.push({ "headerName": "View", 
                                "cellRendererFramework": () => {
                                    return <i className="fa fa-eye fullView"></i>
                                }
                              }); 
          console.log(tempColumnDefs)
          //Create rowData
          for(let i = 0 ; i < rowData.length ; i++)
          {
              tempRowData.push(rowData[i].data);
          }

          this.setState({rowData : tempRowData, columnDefs : tempColumnDefs}, ()=>console.log(this.state))
        })
  }   

render() {
      var datas = this.state.details;
      var keys =  Object.keys(datas)
      keys.map((data) => {
        console.log(datas[data])
      })

  if(this.state.showHome){
    return (
      <div>
        <div className="header">
              <img src={logo} className="logo"></img>
          </div>
        <div
            className="ag-theme-balham" >
            <AgGridReact
                columnDefs={this.state.columnDefs}
                rowData={this.state.rowData} 
                onRowClicked={this.onRowClicked}
                >
            </AgGridReact>
        </div>
        </div>
      );
    }

    if(this.state.showLogin){
      return (
        <Login />
      )
    }

    if(this.state.modalIsOpen)
    {
      return (
          <div className="data-modal">
          <div className="header">
            <img src={logo} className="logo"></img>
        </div>
              <Modal
              isOpen={this.state.modalIsOpen}
              onRequestClose={this.state.closeModal}
              contentLabel="Example Modal"
              ariaHideApp={false}
              className="modal_data"
              >
              <button className="CloseData-btn" id="CloseData" name="CloseData" onClick={this.closeModal}>&times;</button>
              <div className="row">
              {
            keys.map((data) => (
              <div className="col-md-3">
                <label name={data+"_label"} id={data+"_label"}>{data}</label>
                <input name={datas[data]} id={datas[data]} value={datas[data]} disabled/>
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