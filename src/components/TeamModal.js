import React from "react";
import { translate } from 'react-i18next';
import i18n from './i18n';

class TeamModal extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			name: "",
			sport: "",
			id: ""
		};

		this.handleSave = this.handleSave.bind(this);
	}

	componentWillReceiveProps(nextProps){
		this.setState({ 
			name: "",
			sport: "",
			id: ""
		});
	}

	nameHandler(e) {
        this.setState({ name: e.target.value });
    }

    sportHandler(e) {
        this.setState({ sport: e.target.value });
    }

	handleSave() {
		const team = this.state;
		if (team.name === null || team.name === ""){
			window.alert(i18n.t('TEAM.ERR.NAMESPORTMANDATORY'));
		} else {
			this.props.saveTeam(team);
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
							<input className="form-control" name="teamSport" type="text" value={this.state.sport} onChange={(e) => this.sportHandler(e)}/>
						</div>
						<div className="modal-footer">
							<button type="button" className="btn btn-primary" onClick= {() => { this.handleSave() }}>{ t('BUTTON_SAVE') }</button>
							<button type="button" className="btn btn-secondary" data-dismiss="modal">{ t('BUTTON_CANCEL') }</button>
						</div>
					</div>
				</div>
			</div>
		)
	}

}

export default translate('common')(TeamModal);