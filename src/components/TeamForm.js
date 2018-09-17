import React from "react";
import EditTeamModal from './EditTeamModal';
import NewPlayerModal from './NewPlayerModal';
import EditPlayerModal from './EditPlayerModal';
import { translate } from 'react-i18next';

import * as realApi from '../api/Api';
import i18n from './i18n';
import PropTypes from 'prop-types';

class TeamForm extends React.Component {
	constructor(props){
		super(props);

		this.players = [];

		this.state = {
			selectedPlayer: ""
		};

		this.deleteTeam = this.deleteTeam.bind(this);
		this.deletePlayer = this.deletePlayer.bind(this);
		this.replacePlayer = this.replacePlayer.bind(this);
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
		return null;
	}

	//update players list
	updatePlayers = () => {
		console.log("fetching players");
		console.log(this.state);
		if (this.props.teamId && !this.state.rerender){
			console.log("really fetching players");
			realApi.fetchPlayers(this.props.teamId).then(apiPlayers => {
				this.players = apiPlayers.data.sort((a,b) => a.number - b.number); // putting these in order by their shirt numbers
				this.setState({players: apiPlayers.data, rerender: true, teamId: this.props.teamId});
			}).catch((error) => {
				if (error.response.status === 403){
					this.props.logoutNow();
					window.alert(i18n.t(error.response.data.message)) 
				} else {
					window.alert(i18n.t(error.response.data.message))
				};
			});
		}
	}

	replacePlayer = (player) => {
		console.log("replace player");
		this.setState({selectedPlayer: player, rerender: false});
		console.log(this.state);
	}

	updateTeam = (team) => {
		this.props.saveTeam(team);
	}

	savePlayer = () => {
		console.log("TF save player");
		this.setState({rerender: false});
		this.updatePlayers();
	}

	//for deleting selected team
	deleteTeam = () => {
		const really = window.confirm(i18n.t('TEAM.REALLYDELETE'));
		if (really === true){
			realApi.deleteTeam(this.props.teamId).then(() => {
				this.props.deleteTeam();
			}).catch((error) => window.alert(i18n.t(error.response.data.message)));
		}
	}

	// delete player from team
	deletePlayer = (e) => {
		console.log("delete player");
		const really = window.confirm(i18n.t('PLAYER.REALLYDELETE'));
		if (really === true){
			realApi.deletePlayer(this.props.teamId, e.target.id).then(() => {
				this.setState({rerender: false});
				this.updatePlayers();
			}).catch((error) => window.alert(i18n.t(error.response.data.message)));
		}
	}

	render(){
		console.log("TF render");

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
		if (typeof(teamT) === "undefined") { return ("") };
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
							<div className="row" key={ val._id }>
								<div className="col-md-6">{ val.nickname && val.nickname !== '' ? val.nickname : val.player_id.firstname }</div>
								<div className="col-md-2">{val.number}</div>
								<div className="col-md-2">
									<button type="button" className="btn btn-primary" 
										name="editPlayerButton" onClick = {() => this.replacePlayer(val)}
										data-toggle="modal" data-target="#editPlayerModal">
										{ t('TEAM.EDIT_PLAYER') }</button></div>
								<div className="col-md-2"><button type="button" className="btn btn-warning" onClick={this.deletePlayer} id={val._id}>
									{ t('TEAM.REMOVE_PLAYER') }</button></div>
							</div>
						))}
						<EditPlayerModal savePlayer={this.savePlayer} teamId={this.props.teamId} modalTitle={ t('TEAM.EDIT_PLAYER') }  player={this.state.selectedPlayer} />
					</div>
				</div>
				<div className="row">
					<div className="col-md-8">
						<p className="text-center">
							<button type="button" className="btn btn-success" name="newPlayerButton" data-toggle="modal" data-target="#newPlayerModal">
								{ t('TEAM.ADD_PLAYER') }</button>{" "}
							<button type="button" className="btn btn-warning" onClick={this.deleteTeam} >{ t('TEAM.REMOVE_TEAM') }</button>
						</p>
					</div>
					<NewPlayerModal savePlayer={this.savePlayer} teamId={this.props.teamId} modalTitle={ t('TEAM.ADD_PLAYER') } />
				</div>
			</div>
		)
	}
}

TeamForm.propTypes = {
	teamId: PropTypes.string,
	teamList: PropTypes.array,
	saveTeam: PropTypes.func,
	logoutNow: PropTypes.func,
}

export default translate('common')(TeamForm);