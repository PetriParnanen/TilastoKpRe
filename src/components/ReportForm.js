import React from "react";

import { translate } from 'react-i18next';

import * as realApi from '../api/Api';
import i18n from './i18n';
import PropTypes from 'prop-types';


class ReportForm extends React.Component {
	constructor(props){
		super(props);

		this.matches = [];
		this.players = [];
		this.events = [];
		this.totalStats = {};
		this.state = {};
	}


	componentDidMount(){
		console.log("Report mount");
		this.updateTeams();
	}

	componentDidUpdate(){
		console.log("Report update");
		this.updateTeams();
	}

	static getDerivedStateFromProps(nextProps, prevState) {
		if (nextProps.teamId !== prevState.teamId && prevState.rerender){
			return({rerender: false});
		}
		return null;
	}

	updateTeams = () => {

		if (this.props.teamId && !this.state.rerender){
			console.log("fetch matches");

			//api fetches. fetch at the same time. Wil lfetch matches, players and events
			let fetchPla = realApi.fetchPlayers(this.props.teamId);
			let fetchMat = realApi.fetchMatches(this.props.teamId);
			let fetchEve = realApi.fetchEvents(this.props.sportId);

			console.log("Here");
			Promise.all([fetchPla, fetchMat, fetchEve]).then(values => {
				this.players = values[0].data.sort((a,b) => a.number - b.number);
				this.matches = values[1].data.sort((a,b) => new Date(a.date) - new Date(b.date));
				this.events = values[2].data.sort((a,b) => a.order - b.order);
				//console.log(this.matches);

				//we propably need to do those score calculations here for each player and both tables
				// hmm what is the best way? Go throght all the matches and push player values on array?
				// make calculations out of that array?

				this.matches
					.map(val => val.players)
					.forEach(player => player.forEach(
						rox => {
							if(this.totalStats.hasOwnProperty(rox.player_id)){
								this.totalStats[rox.player_id].games++;
							} else { 
								this.totalStats[rox.player_id] = { games: 1 };
							};
							rox.events.forEach(
								event => {
									if (!this.totalStats[rox.player_id].hasOwnProperty(event.event_id)){
										this.totalStats[rox.player_id][event.event_id] = 0;
									}
									this.totalStats[rox.player_id][event.event_id] += event.value;
								})
						}));

				this.setState({ matches: values[1].data, 
					players: values[0].data,
					events: values[2].data,
					teamId: this.props.teamId,
					rerender: true });
			}).catch((error) => {
				console.log(error);
				/*if (error.response.status === 403){
					this.props.logout();
					window.alert(i18n.t(error.response.data.message))
				} else {
					window.alert(i18n.t(error.response.data.message))
				}*/
			})
		}
	}

	render(){

		const { t } = this.props;

		if (typeof(this.props.teamId) === "undefined"){
			return (
				<h5>loading</h5>
			)
		};

		return (
			<div className="page-header"><h4>{ t('INDEX.REPORT') }</h4>
				<div className="row">
					<div className="col-md-2"><b>{ t('REPORT.PLAYERS') }</b></div>
				</div>
				<div className="row"><div className="col-md-6">{" "}<br /></div></div>
				<div className="row">
					<div className="col-md-2"><b>{ t('REPORT.PLAYERS.TOTAL') }</b></div>
				</div>
				<div className="matchPopupTable">
					<div className="tableRow" key="headerRow">
						<div className="matchPopupTableCell" key="name"><b>{ t('REPORT.PLAYER') }</b></div>
						<div className="matchPopupTableCell" key="number"><b>{ t('REPORT.NRO') }</b></div>
						<div className="matchPopupTableCell" key="games">{ t('REPORT.GAMES') }</div>
						{this.events && this.events.map(events => (
							<div className="matchPopupTableCell" key={events.abbreviation}>{events.abbreviation}</div>
						))}
					</div>
					{(this.players && this.events) && this.players.map(val => (
						<div className="tableRow" key={val._id}>
							<div className="matchPopupTableCell" key="name">{val.player_id.firstname} {val.player_id.lastname}</div>
							<div className="matchPopupTableCell" key="number">{val.number}</div>
							{this.totalStats && this.totalStats.hasOwnProperty(val._id) ? (
								<div className="matchPopupTableCell" key="games">{this.totalStats[val._id].games}</div>
							) : (
								<div className="matchPopupTableCell" kay="games">0</div>
							)}
							{this.totalStats && this.totalStats.hasOwnProperty(val._id) && this.events && this.events.map(events => (
								<div className="matchPopupTableCell" key={events.abbreviation}>{this.totalStats[val._id][events._id]}</div>
							))}
						</div>
					))}
				</div>
				<div className="row"><div className="col-md-6">{" "}<br /></div></div>
				<div className="row">
					<div className="col-md-2"><b>{ t('REPORT.TITLE') }</b></div>
					<div className="col-md-6">
						{this.matches && this.matches.map(val => (
							<div className="row" key={val._id}>
								<div className="col-md-6">{val.date.substr(0,10)}</div>
								<div className="col-md-6">{val.opponent}</div>
							</div>
						))}
					</div>
				</div>
			</div>
		)
	}
}

ReportForm.propTypes = {
	teamId: PropTypes.string,
	sportId: PropTypes.string,
	logoutNow: PropTypes.func,
}

export default translate('common')(ReportForm);