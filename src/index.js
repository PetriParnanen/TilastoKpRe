import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import registerServiceWorker from './registerServiceWorker';
import {BrowserRouter} from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';

import i18n from './components/i18n';

import App from './components/App';

ReactDOM.render(
	<I18nextProvider i18n={ i18n }>
		<BrowserRouter>
			<App />
		</BrowserRouter>
	</I18nextProvider>, 
	document.getElementById('root'));
registerServiceWorker();
