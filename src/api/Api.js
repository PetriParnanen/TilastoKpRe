import axios from 'axios';
import * as userApi from './User';

//this will handle all api request that have nothing to do with user

const apiServer = 'http://localhost:3000/api';

//fetch sports in service (not really used because team fetch also returns sportid and name)
export const fetchSports = () => {
	console.log("api sports");
	return axios.get(apiServer+'/sportlist', { headers: { 'x-access-token': userApi.getToken() }})
}

//all teams under user. right now api doesn't return all teams
export const fetchTeams = () => {
	console.log("api teams");
	return axios.get(apiServer+'/teamlist', { headers: { 'x-access-token': userApi.getToken() }})
}

//one selected team
export const fetchTeam = teamId => {
	console.log("api team "+teamId);
	if (!teamId) { return Promise.reject('DB.ERR.INCORRECTFETCHREQUEST') }; // if no team id return promise reject
	return axios.get(apiServer+`/teamlist/${teamId}`, { headers: { 'x-access-token': userApi.getToken() }})
}

//add new team
export const saveTeam = team => {
	console.log("save team "+team.sport);
	if (!team) { return Promise.reject('DB.ERR.INCORRECTFETCHREQUEST') }; // if no team id return promise reject
	return axios.post(apiServer+'/teamlist', team , { headers: { 'x-access-token': userApi.getToken() }})
}

//update existing team
export const updateTeam = team => {
	console.log("update team "+team.name);
	if (!team) { return Promise.reject('DB.ERR.INCORRECTFETCHREQUEST') }; // if no team id return promise reject
	return axios.put(apiServer+`/teamlist/${team._id}`, team , { headers: { 'x-access-token': userApi.getToken() }})
}

//delete selected team
export const deleteTeam = (teamId) => {
	console.log("delete team "+teamId);
	if (!teamId) { return Promise.reject('DB.ERR.INCORRECTFETCHREQUEST') }; // if no team id return promise reject
	return axios.delete(apiServer+`/teamlist/${teamId}`, { headers: { 'x-access-token': userApi.getToken() }})
}

//all players under a team
export const fetchPlayers = (teamId) => {
	console.log("api players for team "+teamId);
	if (!teamId) { return Promise.reject('DB.ERR.INCORRECTFETCHREQUEST') }; // if no team id return promise reject
	return axios.get(apiServer+`/playerlist/team/${teamId}`, { headers: { 'x-access-token': userApi.getToken() }})
}