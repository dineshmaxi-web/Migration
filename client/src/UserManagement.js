import React from 'react';
import AddUser from './user_form.js';
import EditUser from './edit_user';
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-balham.css";

class UserManagement extends React.Component {

    state = {
			showAddUserPage : false,
			showEditUserPage : false,
			showUserManagementPage : true
		}
		
		onGridReady = params => {
			this.gridApi = params.api;
			this.gridColumnApi = params.columnApi;
		}

		setFixedSize = () => {
			this.gridApi.sizeColumnsToFit();
		}

		showAddUserPage = () =>{
			this.setState({showAddUserPage : true, showEditUserPage : false, showUserManagementPage : false})
		}

		componentDidMount() {

			fetch('/get/users')
			.then(result => result.json())
			.then(rowDataSet => {
				var tempColumnDefs = [];
						
				if(rowDataSet.length > 0)
				{
				var argsCopy = Object.keys(rowDataSet[0])
					console.log(argsCopy)
				for (let i = 0; i < argsCopy.length; i++) {
					if (i !== 0) {
						if(argsCopy[i] !== "password")
						{
							tempColumnDefs.push({
							"headerName": argsCopy[i].charAt(0).toUpperCase() + argsCopy[i].slice(1).replace(/([A-Z])/g, ' $1').trim(),
							"field": argsCopy[i],
							lockPosition: true
							});
						}
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
					headerName: "Edit",
					lockPosition: true,
					cellRendererFramework: () => {
						return  <i className="fa fa-edit fullView" style={{ color: "skyblue" }}></i>
					}
				});
						
				tempColumnDefs.push({
					headerName: "Delete",
					lockPosition: true,
					cellRendererFramework: () => {
						return  <i className="fa fa-trash fullView" style={{ color: "red" }}></i>
					}
				});
						
				this.setState({ rowData: rowDataSet, columnDefs: tempColumnDefs })
				}
			})
		}
		
		onCellClicked = (e) => {
			console.log(e.data._id)
			if(e.colDef.headerName === "Edit")
			{
				this.setState({fields : e.data, showEditUserPage : true, showUserManagementPage : false})
			}
			if(e.colDef.headerName === "Delete")
			{
				fetch('/delete/user', {
					method: 'POST',
					body: JSON.stringify({
						data : e.data._id
					}),
					headers: { "Content-Type": "application/json" }
				})
				.then((response) => {
					var rowData = [];
					this.gridApi.forEachNode(function (node) {
						rowData.push(node.data);
					});

					this.gridApi.updateRowData({ remove: [rowData[e.rowIndex]] });
					this.gridApi.redrawRows();
				})
			}
		}

    render(){
			if(this.state.showUserManagementPage === true)
			{
				return(
						<div className="ag-theme-balham" >
							<div className="addUser-btn">
								<button className="btn-primary btn" onClick={this.showAddUserPage}>Add User +</button>
							</div>
								<AgGridReact
								columnDefs={this.state.columnDefs}
								rowData={this.state.rowData}
								onCellClicked={this.onCellClicked}
								onGridReady={this.onGridReady}
								onFirstDataRendered={this.setFixedSize}
								>
								</AgGridReact>
						</div>
				)
			}
			if(this.state.showEditUserPage === true)
			{
				return(
					<EditUser fields={this.state.fields} />
				)
			}
			if(this.state.showAddUserPage === true)
			{
				return(
					<AddUser />
				)
			}
    }
}

export default UserManagement;