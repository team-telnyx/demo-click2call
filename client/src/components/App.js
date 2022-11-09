import React from 'react';
import PhoneIcon from '@mui/icons-material/Phone';
import CallEndIcon from '@mui/icons-material/CallEnd';
import { green, red } from "@mui/material/colors";
import { TelnyxRTC } from '@telnyx/webrtc';

import logo from '../assets/logo-dark.png';
import RegTokenObj from './RegTokenObj';
import TelnyxClientObj from './TelnyxClientObj';

import determineNewState from '../logic/determineNewState';
import './App.css';
import $ from 'jquery';

export default class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      callState: 'ready',
      regToken: null
    };
  }
  
  handleButtonClick = () =>{
    let newState = determineNewState(this.state);
    if (newState.callState === 'connecting'){
      TelnyxClientObj.currentCall = TelnyxClientObj.client.newCall({
        destinationNumber: 'DESTINATION_NUMBER',
        callerNumber: 'FROM_NUMBER',
        remoteElement: 'remoteMedia'
      });
    }else if (newState.callState === 'ready'){
      TelnyxClientObj.clientInitiatedHangup = true;
      TelnyxClientObj.currentCall.hangup();
    }
    this.setState(newState);
  }

  handleHangup(){
    let newState = determineNewState(this.state);
    this.setState(newState);
  }

  async generateToken(){
    if(!RegTokenObj.token){
      $.getJSON('http://localhost:3001/generateTokenCredentials')
        .then((results) => {
          let token = results.data;
          RegTokenObj.token = token;
          this.setState({callState: this.state.callState, regToken: token});
          return token;
        });
    }else{
      return RegTokenObj.token;
    }
  }

  establishClient(token){
    TelnyxClientObj.client = new TelnyxRTC({
      login_token: token
    });

    //TelnyxClientObj.client.remoteElement = "remoteMedia";
    TelnyxClientObj.client
      .on('telnyx.ready', () => console.log('ready to call'))
      .on('telnyx.notification', (notification) => {
        //console.log(notification.call);
        if (notification.type === 'callUpdate') {
          if(notification.call.state === 'active'){
            TelnyxClientObj.clientInitiatedHangup = false;
            this.handleButtonClick();
          }else if (notification.call.state === 'hangup' && !TelnyxClientObj.clientInitiatedHangup){
            this.handleHangup();
          }
        } else if (notification.type === 'userMediaError') {
          console.log(notification.error);
        }
    });

    TelnyxClientObj.client.connect();
    this.setState({callState: this.state.callState, regToken: this.state.regToken});
  }

  determineDisplay(callState){
    if (callState === 'ready' && RegTokenObj.token){
      return <PhoneIcon sx={{ fontSize: 150, color: green[500] }} onClick={this.handleButtonClick} />
    }else if (callState === 'connecting'){
      return <p>Connecting you to our sales team...</p>
    }else if (callState === 'connected'){
      return <CallEndIcon sx={{ fontSize: 150, color: red[500] }} onClick={this.handleButtonClick} />
    }
  }

  render() {
    if(!RegTokenObj.token){
      this.generateToken();
    }
    if(!TelnyxClientObj.client && RegTokenObj.token){
      this.establishClient(RegTokenObj.token)
    }
    let element = this.determineDisplay(this.state.callState);
    return (
      <div className="App">
        <header className="App-toolbar">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Click To Call Demo</h1>
        </header>
        <header className="App-header">
          {element}
          <audio id="remoteMedia" />
        </header>
      </div>
    );
  }
}
