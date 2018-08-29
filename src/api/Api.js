import axios from 'axios';
import * as userApi from './User';

//this will handle all api request that have nothing to do with user

const apiServer = 'http://localhost:3000/api';

//fetch sports in service (not really used because team fetch also returns sportid and name)
export const fetchSports = () => {
	return axios.get(apiServer+'/sportlist', { header: {'x-access-token': userApi.getToken() }})
}

//all teams under user
export const fetchTeams = () => {
	return axios.get(apiServer+'/teamlist', { headers: { 'x-access-token': userApi.getToken() }})
}

//one selected team
export const fetchTeam = teamId => {
	if (!teamId) { return Promise.reject('DB.ERR.INCORRECTFETCHREQUEST') };
	return axios.get(apiServer+`/teamlist/${teamId}`, { headers: { 'x-access-token': userApi.getToken() }} )
}