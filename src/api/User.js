import axios from 'axios';

//this will handle login/user api requests and some other nice helps

const apiserver = 'http://localhost:3000';

export const register = (userData) => {
	console.log("User.js register");
	return axios.post(apiserver + '/register', userData);
};

export const login = (userData) => {
	console.log("User.js login");
	return axios.post(apiserver + '/login', userData);
};

// checking is user logged. Just uses token now.
export const isLoggedIn = () => {
	if (getToken()){
		return true;
	} else {
		return false;
	}
};

// not really used, but maybe someday needed
export const getUser = () => {
	if (getToken()){
		return axios.post(apiserver + '/me');
	} else {
		return Promise.reject('DB.ERR.NOTOKEN');
	}
};

//saves token from localstorage
export const setToken = (token) => {
	if (token){
		localStorage.setItem('token', token);
	} else {
		localStorage.clear();
	}
};

//get token from localstorage
export const getToken = () => {
	return localStorage.getItem('token');
};