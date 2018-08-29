import React from "react";
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';

class LoginForm extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			username:"",
			password:""
		};
		this.onSubmit = this.onSubmit.bind(this);
		this.onChange = this.onChange.bind(this);
	}

	onChange(event){
		if(event.target.name === "pwordInput") {
			this.setState({
				password:event.target.value
			});
		} else if (event.target.name === "unameInput") {
			this.setState({
				username:event.target.value
			});
		}
	}

	// if presses login button then goes to login path and register on it's own
	onSubmit(event) {
		let temp = {
			"username": this.state.username,
			"password": this.state.password,
		}
		if (event.target.name === "loginButton"){
			this.props.onLogin(temp);
		}
		if (event.target.name === "registerButton") {
			this.props.onRegister(temp);
		}
		event.preventDefault();
	}

	render() {
		const { t } = this.props;
		return (
			<form onSubmit={this.onSubmit}>
				<label>{t('LOGIN.USERNAME')}:</label>
				<input className="form-control" name="unameInput" type="text" value={this.state.uname} onChange={this.onChange}/>
				<br/>
				<label>{t('LOGIN.PASSWORD')}</label>
				<input className="form-control" name="pwordInput" type="password" value={this.state.pword} onChange={this.onChange}/>
				<br/>
				<input type="button" className="btn btn-primary" onClick={this.onSubmit} name="loginButton" value={t('LOGIN.BUTTON_LOGIN')} />
				<input type="button" className="btn btn-default" onClick={this.onSubmit} name="registerButton" value={t('LOGIN.BUTTON_REGISTER')} />
			</form>
		);
	}
}

LoginForm.propTypes = {
	onLogin: PropTypes.func,
	onRegister: PropTypes.func,
}

export default translate('common')(LoginForm);