import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import logo from './VTG-logo.png';
import './Detail.css';
import Modal from 'react-modal';

class Detail extends React.Component
{
  state = {
    isView: false,
    modalIsOpen: false
  }

  handleClick = () => {
    this.setState({isView : true})
    this.setState({modalIsOpen: true});
}

openModal = () => {
    this.setState({modalIsOpen: true});
  }

  closeModal = () => {
    this.setState({modalIsOpen: false});
    this.setState({isView : false})
  }

    render()
    {
      var datas = this.props.data;
      var keys =  Object.keys(datas)
      keys.map((data) => {
        console.log(datas[data])
      })

      if(this.state.isView)
      return (
          <div className="data-modal">
          <div className="header">
            <img src={logo} className="logo"></img>
        </div>
              <Modal
              isOpen={this.state.isView}
              onRequestClose={this.state.closeModal}
              contentLabel="Example Modal"
              ariaHideApp={false}
              className="modal_data "
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
        else {
            return (
                <div className="modal-body">
              <div className="header">
                  <img src={logo} className="logo"></img>
              </div>
              <div className="details-view">
                  <button className="btn btn-primary" onClick={this.handleClick}>Data</button>
              </div>
              </div>
          )
        }
        
      }
  }
  
  export default Detail;