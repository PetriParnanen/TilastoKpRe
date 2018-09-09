import React from "react";
import {Switch,Route} from 'react-router-dom';
import TeamForm from './TeamForm';
import StartMatchForm from './StartMatchForm';
import ReportForm from './ReportForm';
import TeamModal from './TeamModal';
import { translate } from 'react-i18next';

import * as realApi from '../api/Api';
import i18n from './i18n';

class TeamSelection extends React.Component {
	constructor(props){
		super(props);

		this.state = {};
	}

	// fetching teams. using await instead of then, not used anymore, but leaving here to remind me
	/*async getTeams(){
		console.log("get teams");
		const teams = await realApi.fetchTeams();
		return await teams;	
	}*/

	// on mount. Fetch teams and get/set state's about active team
	componentDidMount() {
		console.log("TS mount ");
		if (!this.state.teams){
			this.updateTeams();
			/*

			removed also, but leaving to remind another way to handle apis
			(async () => {
				try {
					console.log("Stup");
					const teams = await this.getTeams();
					if(teams.statusText !== "OK"){
						throw Error(teams.statusText);
					}
					this.setState({ teams: teams.data });

					//choose active team/sport, 
					//if no teams on list then no selected teams or nothing else
					if (teams.data.length === 0){
						this.setState({ currentTeam: "",
							currentSport: "" });
						localStorage.removeItem('currentTeam');
					} else if (!this.state.currentTeam) { 

					// if no existing team found in state then we will try to get from localstorage if not there then first on list
					// if found from state then just keep it
						if (localStorage.getItem('currentTeam')){
							this.setState({ currentTeam: localStorage.getItem('currentTeam'),
								currentSport: this.state.teams.find( e => e._id === localStorage.getItem('currentTeam')).sportId.name });
						} else {
							this.setState({ currentTeam: this.state.teams[0]._id,
								currentSport: this.state.teams[0].sportId.name });
							localStorage.setItem('currentTeam', this.state.teams[0]._id);
						}
					}
				} catch (error){
					window.alert("XX"+i18n.t('DB.ERR.DBERROR'));
				}
			})();
			*/
		}
	}

	// Change selected team. Also save id to localstorage from where we can fetch it if user decides to refresh or similar
	handleChange = (event) => {
		this.setState({ currentTeam: event.target.value,
			currentSport: this.state.teams.find( e => e._id === event.target.value ).sportId.name });
		localStorage.setItem('currentTeam', event.target.value);
	}

	updateTeams(){
		console.log("update teams");
		realApi.fetchTeams().then(teams => {
			this.setState({ teams: teams.data });

			console.log("XXX");

			//choose right active team.
			//if no teams then no teams to select
			//if new created team it will be active
			//if team found in the storage then it will be the active team
			//default first in list

			if (teams.data.length === 0){
				// emptying these values just in case and if user deletes the last team. Should be handled there, but better be... 
				this.setState({ currentTeam: "",
					currentSport: "" });
				localStorage.removeItem('currentTeam');
			} else if (this.state.currentTeam) {
				console.log(this.state.currentTeam);
				this.setState({ currentSport: this.state.teams.find( e => e._id === this.state.currentTeam).sportId.name })
			} else if (!this.state.currentTeam) {
				// if found in storage activate it
				if (localStorage.getItem('currentTeam')){
					this.setState({ currentTeam: localStorage.getItem('currentTeam'),
						currentSport: this.state.teams.find( e => e._id === localStorage.getItem('currentTeam')).sportId.name });
				} else {
					this.setState({ currentTeam: this.state.teams[0]._id,
						currentSport: this.state.teams[0].sportId.name });
					localStorage.setItem('currentTeam', this.state.teams[0]._id);
				}
			} else {
				window.alert("Hmm, update team, i think you shouldnt be here");
			}
		}).catch(() => window.alert(i18n.t('DB.ERR.DBERROR')));

	}

	/*createNewTeam(event){	
		console.log("new team"); 
	}*/

	saveTeam = (team) => {
		console.log(team._id);
		this.setState({ currentTeam: team._id });
		localStorage.setItem('currentTeam', team._id);
		this.updateTeams();
	} 


	render(){
		const { t } = this.props;
		console.log("team render");

		let zeroTeams = this.state.teams && this.state.teams.length;

		// If no teams then don't print dropdown
		// TeamModal opens popup where user can add new teams

		return(
			<div className="page-header"><h3>{ t('INDEX.CHOOSE_TEAM') }</h3>
			<div className="row" name="teamSelector">
				{ zeroTeams !== 0 &&
				<div className="col-md-4" name="teamSelect">
					{ t('INDEX.NAME') }: 
						<select name="selectedTeam" onChange={this.handleChange} value={this.state.currentTeam}>
						{this.state.teams && this.state.teams.map(val => (
							<option key={val._id} value={val._id}>{val.name}</option>
						))}
						</select>
				</div>
				}
				{ zeroTeams ? (
				<div className="col-md-4" name="teamSport">
					&nbsp;{ t('INDEX.SPORT') }: { t('SPORT.'+this.state.currentSport) }
				</div>
				) : (
				<div className="col-md-8"> { t('INDEX.CREATEFIRST') }</div>
				)}
				<div className="col-md-4" name="newTeamButtonDiv"><p className="text-right">
					<button type="button" className="btn btn-success" name="newTeamButton" data-toggle="modal" data-target="#teamModal">
						{ t('INDEX.CREATE_TEAM') }</button>
				</p></div>
				<TeamModal saveTeam={this.saveTeam} modalTitle={ t('INDEX.CREATE_TEAM') } />
			</div>
			<main>
				<Switch>
					<Route exact path='/team' render={() => (<TeamForm teamId={this.state.currentTeam} teamsList={this.state.teams} /> )} />
					<Route exact path='/match' render={() => (<StartMatchForm /> )} />
					<Route exact path='/report' render={() => (<ReportForm />)} />
				</Switch>
			</main>
			</div>
		)
	}

}

export default translate('common')(TeamSelection);