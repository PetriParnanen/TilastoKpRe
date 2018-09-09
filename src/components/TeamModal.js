import React from "react";
import * as realApi from '../api/Api';
import { translate } from 'react-i18next';
import i18n from './i18n';

class TeamModal extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			name: "",
			sport: ""
		};

		this.handleSave = this.handleSave.bind(this);
	}

	componentDidMount(){
		console.log("TM mount");
		realApi.fetchSports().then(sports => {
			this.setState({
				sports: sports.data,
				sport: sports.data[0]._id
			});
		}).catch(() => window.alert(i18n.t('DB.ERR.DBERROR')));		
	}

	nameHandler(e) {
        this.setState({ name: e.target.value });
    }

    sportHandler(e) {
    	console.log("here");
        this.setState({ sport: e.target.value });
    }

	handleSave() {
		console.log("HS");
		const { sports, ...team } = this.state;

		if (this.state.name === null || this.state.name === "" || this.state.sport === null || this.state.name === ""){
			window.alert(i18n.t('TEAM.ERR.NAMESPORTMANDATORY'));
		} else {
			realApi.saveTeam(team)
			.then((team) => {
				window.alert(i18n.t('TEAM.SAVESUCCESS'));
				document.getElementById("hidePopupBtn").click();
				this.props.saveTeam(team.data);
			})
			.catch(() => window.alert("II "+i18n.t('DB.ERR.DBERROR')));
		}
	}

	render() {
		const { t } = this.props;

		return (
			<div className="modal fade" id="teamModal" role="dialog" tab-index="-1" data-backdrop="static" data-keyboard="false" aria-labelledby="teamModalLabel" aria-hidden="true">
				<div className="modal-dialog" role="document">
					<div className="modal-content">
						<div className="modal-header"><h3>{ t(this.props.modalTitle) }</h3></div>
						<div className="modal-body">
							<label>{ t('INDEX.NAME') }</label>
							<input className="form-control" name="teamName" type="text" value={this.state.name} onChange={(e) => this.nameHandler(e)}/>
							<br />
							<label>{ t('INDEX.SPORT') }</label>
							<select name="selectedTeam" className="form-control select-inline" onChange={(e) => this.sportHandler(e)} value={this.state.currentTeam}>
								{this.state.sports && this.state.sports.map(val => (
									<option key={val._id} value={val._id}>{ t('SPORT.'+val.name) }</option>
								))}
							</select>
						</div>
						<div className="modal-footer">
							<button type="button" className="btn btn-primary" onClick= {() => { this.handleSave() }}>{ t('BUTTON_SAVE') }</button>
							<button id="hidePopupBtn" type="button" className="btn btn-secondary" data-dismiss="modal">{ t('BUTTON_CANCEL') }</button>
						</div>
					</div>
				</div>
			</div>
		)
	}

}

export default translate('common')(TeamModal);