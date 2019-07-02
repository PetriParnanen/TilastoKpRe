import React from "react";
import * as realApi from '../api/Api';
import { withTranslation } from 'react-i18next';
import i18n from './i18n';
import PropTypes from 'prop-types';

class NewPlayerModal extends React.Component {
	constructor(props){
		super(props);

		this.state = {
			firstname: "",
			lastname: "",
			nickname: "",
			number: "",
			joining_date: ""
		}

		this.handleSave = this.handleSave.bind(this);
	}

	fieldHandler(e){
		this.setState({ [e.target.name]: e.target.value, error: e.target.validationMessage });
	}

    handleSave(){
    	console.log("save player");
    	const { joining_date, ...newPlayer } = this.state; //I do know it would be better to use datepicker, but make it work with this now first

    	if (this.state.firstname === null || this.state.firstname === "" ||
    		this.state.lastname === null || this.state.lastname === "" ||
    		this.state.number === null || this.state.number === ""){
    		window.alert(i18n.t('TEAM.ERR.NAMESPORTMANDATORY'));
    	} else if (!(this.state.number.match(/^[0-9]{1,2}$/))) {
    		window.alert(i18n.t('PLAYER.INVALIDSHIRTNUMBER')); 		
    	} else if (this.state.joining_date && !(this.state.joining_date.match(/^[0-9]{4}-[0-9]{1,2}-[0-9]{1,2}$/))){
    		window.alert(i18n.t('PLAYER.INVALIDJOININGDATE'));
    	} else {
    		let jDate = new Date(joining_date); //convert given date to date object used in node.js back
    		newPlayer.joining_date = jDate;
    		realApi.savePlayer(this.props.teamId, newPlayer)
    		.then((player) => {
    			window.alert(i18n.t('PLAYER.SAVESUCCESS'));
    			document.getElementById("hidePopupBtn3").click();
    			this.props.savePlayer();
    		}).catch((error) => window.alert(i18n.t(error.response.data.message)));
    	}
    }

	render() {
		const { t } = this.props;

		console.log("NPM render");

		return (
			<div className="modal fade" id="newPlayerModal" role="dialog" tab-index="-1" data-backdrop="static" data-keyboard="false" aria-labelledby="playerModalLabel" aria-hidden="true">
				<div className="modal-dialog" role="document">
					<div className="modal-content">
					<div className="modal-header">
						<div className="row">
							<div className="col-md-12"><h3>{ this.props.modalTitle }</h3></div>
						</div>
					</div>
					<div className="modal-body">
						<div className="row">
							<div className="invalid-feedback d-block col-md-12">
            					{this.state.error}
          					</div>
          				</div>
						<div className="row">
							<div className="col-md-6">
								<label>{ t('PLAYER.FIRSTNAME') }</label>
								<input className="form-control" name="firstname" type="text" value={this.state.firstname} onChange={(e) => this.fieldHandler(e)} required />
							</div>
							<div className="col-md-6">
								<label>{ t('PLAYER.LASTNAME') }</label>
								<input className="form-control" name="lastname" type="text" value={this.state.lastname} onChange={(e) => this.fieldHandler(e)} required />
							</div>
						</div>
						<div className="row">
							<div className="col-md-6">
								<label>{ t('PLAYER.NICKNAME') }</label>
								<input className="form-control" name="nickname" type="text" value={this.state.nickname} onChange={(e) => this.fieldHandler(e)} />
							</div>
							<div className="col-md-6">
								<label>{ t('PLAYER.SHIRTNUMBER') }</label>
								<input className="form-control" name="number" value={this.state.number} type="text" pattern="[0-9]{1,2}" onChange={(e) => this.fieldHandler(e)} required />
							</div>
						</div>
						<div className="row">
							<div className="col-md-12">
								<label>{ t('PLAYER.JOIN') }</label>
								<input className="form-control" name="joining_date" value={this.state.joining_date} type="date" onChange={(e) => this.fieldHandler(e)} />
							</div>
						</div>
						<div className="modal-footer">
							<button type="button" className="btn btn-primary" onClick= {() => { this.handleSave() }}>{ t('BUTTON_SAVE') }</button>
							<button id="hidePopupBtn3" type="button" className="btn btn-secondary" data-dismiss="modal">{ t('BUTTON_CANCEL') }</button>
						</div>
					</div>
					</div>
				</div>
			</div>
		)
	}
}

NewPlayerModal.propTypes = {
	savePlayer: PropTypes.func,
	modalTitle: PropTypes.string,
	teamId: PropTypes.string,
}

export default withTranslation('common')(NewPlayerModal);