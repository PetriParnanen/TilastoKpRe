import React from "react";

import { translate } from 'react-i18next';

import * as realApi from '../api/Api';
import i18n from './i18n';
import PropTypes from 'prop-types';


class ReportForm extends React.Component {
	constructor(props){
		super(props);

		this.matches = [];
		this.averageStats = [];
		this.totalStats = [];
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
		//first fetch players of the teams, then matches mainly because we want to print average/total scores
		//without those we could just fetch matches
		console.log("fetch matches");
		console.log(this.props.teamId);
		if (this.props.teamId && !this.state.rerender){
			console.log("Here");
			realApi.fetchMatches(this.props.teamId).then(matches => {
				this.matches = matches.data.sort((a,b) => new Date(a.date) - new Date(b.date));
				this.setState({ matches: matches.data, teamId: this.props.teamId, rerender: true });
				console.log(this.state);
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
	logoutNow: PropTypes.func,
}

export default translate('common')(ReportForm);