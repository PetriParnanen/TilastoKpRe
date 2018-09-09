import React from "react";
import TeamModal from './TeamModal';
//import PlayerModal from './PlayerModal';
import { translate } from 'react-i18next';

import * as realApi from '../api/Api';
import i18n from './i18n';

//translator have some probs with this. gotta check

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
		if (prevState.hereIam){
			return({hereIam: false});
		} else {
			return({hereIam: true});
		}
	}

	/*shouldComponentUpdate(nextProps, nextState){
		console.log(nextProps.teamId);
		console.log(this.props.teamId);
		return (nextProps.teamId === this.props.teamId?false:true);
	}*/

	//update players list
	updatePlayers = () => {
		console.log("fetching players");
		console.log(this.state);
		console.log(this.props);
		if (this.state.hereIam){
			realApi.fetchPlayers(this.props.teamId).then(apiPlayers => {
				this.players = apiPlayers.data;
				//this.setState({players: apiPlayers.data});
				this.setState({players: apiPlayers.data});
			}).catch(() => window.alert(i18n.t('DB.ERR.DBERROR')));
		}
	}

	//for deleting selected team
	deleteTeam(){

	}

	render(){

		//translator loads page with empty props and it creates an error, so printing empty page
		if (typeof(this.props.teamId) === "undefined"){
			return (
				<h5>loading</h5>
			)
		};

		const { t } = this.props;

		// just in case if team is not found it will print empty and not an error
		const teamT = this.props.teamsList.find( e => e._id === this.props.teamId );
		const teamName = (typeof(teamT) === "undefined"?"":teamT.name);
		const teamSport = (typeof(teamT) === "undefined"?"":teamT.sportId.name);

		return (
			<div className="page-header"><h4>{ t('INDEX.TEAM') }</h4>
				<div className="row">
					<div className="col-md-2"><b>{ t('TEAM.NAME') }</b></div>
					<div className="col-md-2">{ teamName }</div>
					<div className="col-md-2"><button type="button" className="btn btn-primary">{ t('TEAM.EDIT_TEAM') }</button></div>
				</div>

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
			</div>
		)
	}

}

export default translate('common')(TeamForm);