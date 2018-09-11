import React from "react";
import EditTeamModal from './EditTeamModal';
//import PlayerModal from './PlayerModal';
import { translate } from 'react-i18next';

import * as realApi from '../api/Api';
import i18n from './i18n';
import PropTypes from 'prop-types';

class TeamForm extends React.Component {
	constructor(props){
		super(props);

		this.players = [];
		this.renderCount = 0;

		this.state = {
		};

		this.deleteTeam = this.deleteTeam.bind(this);
	}

	componentDidMount() {
		console.log("TF mount ");
		this.updatePlayers();
	}

	componentDidUpdate() {
		console.log("TF update");
		this.updatePlayers();
	}

	static getDerivedStateFromProps(nextProps, prevState) {
		if (nextProps.teamId !== prevState.teamId && prevState.rerender){
			return({rerender: false});
		}
	}

	//update players list
	updatePlayers = () => {
		console.log("fetching players");
		if (this.props.teamId && !this.state.rerender){
			console.log("really fetching players");
			realApi.fetchPlayers(this.props.teamId).then(apiPlayers => {
				this.players = apiPlayers.data;
				this.setState({players: apiPlayers.data, rerender: true, teamId: this.props.teamId});
			}).catch(() => window.alert(i18n.t('DB.ERR.DBERROR')));
		}
	}

	updateTeam = (team) => {
		this.props.saveTeam(team);
	}

	//for deleting selected team
	deleteTeam(){
		realApi.deleteTeam(this.props.teamId).then(() => {
			this.props.deleteTeam();
		}).catch(() => window.alert(i18n.t('DB.ERR.DBERROR')));
	}

	render(){

		//translator loads page with empty props and it creates an error, so printing empty page
		if (typeof(this.props.teamId) === "undefined"){
			return (
				<h5>loading</h5>
			)
		};
		// if no teams under user just print empty page. You could redirect them back to home
		if (this.props.teamsList.length < 1){ return ("") };

		const { t } = this.props;

		// just in case if team is not found it will print empty and not an error
		const teamT = this.props.teamsList.find( e => e._id === this.props.teamId );
		const teamName = teamT.name;
		const teamSport = teamT.sportId.name;

		return (
			<div className="page-header"><h4>{ t('INDEX.TEAM') }</h4>
				<div className="row">
					<div className="col-md-2"><b>{ t('TEAM.NAME') }</b></div>
					<div className="col-md-2">{ teamName }</div>
					<div className="col-md-2"><button type="button" className="btn btn-primary" name="editTeamButton" data-toggle="modal" data-target="#editTeamModal">
						{ t('TEAM.EDIT_TEAM') }</button></div>
				</div>
				<EditTeamModal updateTeam={this.updateTeam} modalTitle={ t('TEAM.EDIT_TEAM') } team={teamT} />

				<div className="row">
					<div className="col-md-2"><b>{ t('TEAM.SPORT') }</b></div>
					<div className="col-md-2">{ t('SPORT.'+teamSport) }</div>
				</div>

				<div className="row">
					<div className="col-md-2"><b>{ t('TEAM.PLAYERS') }</b></div>
					<div className="col-md-6">
						{this.players && this.players.map(val => (
							<div key={val._id}>{val._id}</div>
						))}

					</div>
				</div>
				<div className="row">
					<div className="col-md-8">
						<p className="text-center">
							<button type="button" className="btn btn-success">{ t('TEAM.ADD_PLAYER') }</button>&nbsp;
							<button type="button" className="btn btn-warning" onClick={this.deleteTeam} >{ t('TEAM.REMOVE_TEAM') }</button>
						</p>
					</div>
				</div>
			</div>
		)
	}
}

TeamForm.propTypes = {
	teamId: PropTypes.string,
	teamList: PropTypes.array,
	saveTeam: PropTypes.func,
}

export default translate('common')(TeamForm);