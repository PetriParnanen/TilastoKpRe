import React from 'react';
import {Route} from 'react-router-dom';
import LoginForm from './LoginForm';
import TeamSelection from './TeamSelection';
import * as userApi from '../api/User';
import PropTypes from 'prop-types';

import i18n from './i18n';

class Main extends React.Component{
	constructor(props){
		super(props);

		this.onLogin = this.onLogin.bind(this);
		this.onRegister = this.onRegister.bind(this);
	}

	// login return used token which is needed when doing api requests
	onLogin(value){
		console.log("onlogin "+value);
		if (value == null || value.username == null || value.username === '' || value.password == null || value.password === ''){
			window.alert(i18n.t('LOGIN.GIVE_DATA'));
		} else {
			userApi.login(value)
				.then(tokenData => {
					userApi.setToken(tokenData.data.token);
					this.props.willLogin();
				})
				.catch(error => {
					window.alert("YY"+i18n.t(error.response.data.message));
				});
		}
	}

	// nothing fancy. just register and send alert that register has been succesful
	onRegister(value){
		if (value == null || value.username == null || value.username === '' || value.password == null || value.password === ''){
			window.alert(i18n.t('LOGIN.GIVE_DATA'));
		} else {
			userApi.register(value)
				.then(() => {
					window.alert(i18n.t('LOGIN.REG_SUCCESS'));
				})
				.catch(error => {
					window.alert("TT"+i18n.t(error.response.data.message));
				});
		}
	}

	// if user is logged in then show team selection page. On that page rest of the routes are handled
	// if not logged then just show login page
	render() {
		return(
			(userApi.isLoggedIn()?(
				<main>
					<Route path='/' component={TeamSelection} />
				</main>
			) : (
				<LoginForm onLogin={this.onLogin} onRegister={this.onRegister} />
			))
		)
	}
}

Main.propTypes = {
	willLogin: PropTypes.func,
}

export default Main;