import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import common_en from '../translations/en/common.json';
import common_fi from '../translations/fi/common.json';

//this handles the language used in service

i18n
.use(LanguageDetector)
.init({
//used languages and resources
resources: {
en: {
	common: common_en
},
fi: {
	common: common_fi
}
},
fallbackLng: 'fi',
debug: true,

// commong namespace used in ful lapp
ns: ['common'],
defaultNS: 'common',

keySeparator: false,
interpolation: {
	escapeValue: false,
	formatSeparator: ','
},

react: {
	wait: true
}
},
(err, t) => {
	if (err){
		return console.error(err)
	}
	console.log('i18n initialized')
});

export default i18n;
