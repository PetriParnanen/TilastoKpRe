import React from 'react';
import {Link} from 'react-router-dom';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';

class Header extends React.Component{
	constructor(props) {
    	super(props);
    	this.willLogout = this.willLogout.bind(this);
    }

    willLogout(event){
    	this.props.willLogout();
    }

	render() {
		const { t, i18n } = this.props;

		let newLang = (i18n.language==='fi'?'en':'fi');

		const changeLanguage = (lng) => {
      		i18n.changeLanguage(lng);
    	};

    	// print nav links. If not logged in no links will be visible
		let tempArray;

		let printLine = (value, index, array) => <li className="nav-item" key={value}><Link className="nav-link text-light" to={value}>{ t('INDEX.'+value.toUpperCase() )}</Link></li>;

		if (this.props.isLogged) {
			tempArray = ['team', 'match', 'report'];
		} else {
			tempArray = [];
		};

		let tempRender = tempArray.map(printLine);

		// add logout link
		if(this.props.isLogged){
			tempRender.push(<li className="nav-item" key="logout"><Link className="nav-link text-light" to="/" onClick={this.willLogout}>{ t('INDEX.LOGOUT') }</Link></li>);
		}

		return (
			<nav className="navbar navbar-dark bg-dark">
				<a className="navbar-brand" href="/">{ t('INDEX.TITLE') }</a>
				<ul className="nav">{tempRender}</ul><br />
				<ul className="nav">
					<li className="nav-item"><a className="nav-link" href="" onClick={() => changeLanguage(newLang)}>{ t('BUTTON_LANG_'+newLang.toUpperCase()) }</a></li>
				</ul>
			</nav>
		);
	}
}

Header.propTypes = {
	isLogged: PropTypes.bool,
	willLogout: PropTypes.func,
	lang: PropTypes.string,
	languageChange: PropTypes.func,
}

export default withTranslation('common')(Header);