import React from "react";
import * as realApi from '../api/Api';
import { translate } from 'react-i18next';
import i18n from './i18n';
import PropTypes from 'prop-types';

class EditTeamModal extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			name: "",
			sport: "",
			teamId: ""
		};

		this.handleSave = this.handleSave.bind(this);
	}

	componentDidMount(){
		console.log("TM mount");
	}

	nameHandler(e) {
        this.setState({ name: e.target.value });
    }

    static getDerivedStateFromProps(nextProps, prevState) {
    	if(nextProps.hasOwnProperty('team') && typeof nextProps.team !== "undefined"
    		&& nextProps.team._id !== prevState.teamId){
				return({
					name: nextProps.team.name,
					sport: nextProps.team.sportId.name,
					teamId: nextProps.team._id,
				})
		}
		return null;
	}

	handleSave() {
		console.log("TM HS");
		let team = this.props.team;

		if (this.state.name === null || this.state.name === ""){
			window.alert(i18n.t('TEAM.ERR.NAMESPORTMANDATORY'));
		} else {
			team.name = this.state.name;
			realApi.updateTeam(team)
			.then((updatedTeam) => {
				window.alert(i18n.t('TEAM.SAVESUCCESS'));
				document.getElementById("hidePopupBtn2").click();
				this.props.updateTeam(team);
			})
			.catch(() => window.alert("II "+i18n.t('DB.ERR.DBERROR')));
		}
	}

	render() {
		const { t } = this.props;
		console.log("ETM render");

		return (
			<div className="modal fade" id="editTeamModal" role="dialog" tab-index="-1" data-backdrop="static" data-keyboard="false" aria-labelledby="teamModalLabel" aria-hidden="true">
				<div className="modal-dialog" role="document">
					<div className="modal-content">
						<div className="modal-header"><h3>{ this.props.modalTitle }</h3></div>
						<div className="modal-body">
							<label>{ t('INDEX.NAME') }</label>
							<input className="form-control" name="teamName" type="text" value={this.state.name} onChange={(e) => this.nameHandler(e)}/>
							<input type="hidden" name="teamId" value={this.state.teamId} />
							<br />
							<label>{ t('INDEX.SPORT') }</label>
							<p className="form-control-static">{ t('SPORT.'+this.state.sport) }</p>
						</div>
						<div className="modal-footer">
							<button type="button" className="btn btn-primary" onClick= {() => { this.handleSave() }}>{ t('BUTTON_SAVE') }</button>
							<button id="hidePopupBtn2" type="button" className="btn btn-secondary" data-dismiss="modal">{ t('BUTTON_CANCEL') }</button>
						</div>
					</div>
				</div>
			</div>
		)
	}
}

EditTeamModal.propTypes = {
	updateTeam: PropTypes.func,
	modalTitle: PropTypes.string,
	team: PropTypes.object,
}

export default translate('common')(EditTeamModal);