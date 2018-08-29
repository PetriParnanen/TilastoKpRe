import React, { Component } from 'react';
import './App.css';
import Header from "./Header";
import Main from "./Main";
import * as userApi from '../api/User';
import { translate } from 'react-i18next';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = { 
      isLogged: false
    };

    this.willLogin = this.willLogin.bind(this);
    this.willLogout = this.willLogout.bind(this);
  };

  componentDidMount(){

    //if token is found then user is thrown in
    if(userApi.isLoggedIn()){
      this.setState({ isLogged:true });
    }
  }

  componentWillUnMount(){
  }


  // login/logout just sets state and removes token from localstorage
  willLogout(){
    this.setState({ isLogged:false });
    userApi.setToken();
    console.log("Login out");
  }

  willLogin(){
    this.setState({ isLogged:true });
    console.log("Login in");
  }

  render() {
    return (
      <div className="App">
        <Header isLogged={this.state.isLogged} lang={this.state.lng} willLogout={this.willLogout} languageChange={this.languageChange} />
        <div className="container">
          <Main willLogin={this.willLogin}/>
        </div>

      </div>
    );
  }
}

export default translate('common')(App);