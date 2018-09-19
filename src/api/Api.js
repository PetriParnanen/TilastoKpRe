import axios from 'axios';
import * as userApi from './User';

//this will handle all api request that have nothing to do with user

const apiServer = 'http://localhost:3000/api';

//fetch sports in service (not really used because team fetch also returns sportid and name)
export const fetchSports = () => {
	console.log("api sports");
	return axios.get(apiServer+'/sportlist', { headers: { 'x-access-token': userApi.getToken() }})
}

export const fetchEvents = sportId => {
	console.log("api events");
	console.log(sportId);
	if (!sportId) { return Promise.reject('DB.ERR.INCORRECTFETCHREQUEST') }; // if no sport id return promise reject
	return axios.get(apiServer+`/sportlist/event/${sportId}`, { headers: { 'x-access-token': userApi.getToken() }})
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
export const deleteTeam = teamId => {
	console.log("delete team "+teamId);
	if (!teamId) { return Promise.reject('DB.ERR.INCORRECTFETCHREQUEST') }; // if no team id return promise reject
	return axios.delete(apiServer+`/teamlist/${teamId}`, { headers: { 'x-access-token': userApi.getToken() }})
}

//player stuff

//all players under a team
export const fetchPlayers = teamId => {
	console.log("api players for team "+teamId);
	if (!teamId) { return Promise.reject('DB.ERR.INCORRECTFETCHREQUEST') }; // if no team id return promise reject
	return axios.get(apiServer+`/playerlist/team/${teamId}`, { headers: { 'x-access-token': userApi.getToken() }})
}

//save player
export const savePlayer = (teamId, player) => {
	console.log("save player "+player.firstname);
	if (!player || !teamId) { return Promise.reject('DB.ERR.INCORRECTFETCHREQUEST') }; // if no player or team id return promise reject
	return axios.post(apiServer+`/playerlist/team/${teamId}`, player, { headers: { 'x-access-token': userApi.getToken() }})
}

//edit player
export const updatePlayer = (teamId, playerId, player) => {
	console.log("update player "+player.firstname);
	if (!player || !teamId || !playerId) { return Promise.reject('DB.ERR.INCORRECTFETCHREQUEST') }; // if no player or team id return promise reject
	return axios.put(apiServer+`/playerlist/team/${teamId}/${playerId}`, player, { headers: { 'x-access-token': userApi.getToken() }})
}

//delete player
export const deletePlayer = (teamId, playerId) => {
	console.log("delete player "+playerId);
	if (!playerId || !teamId) { return Promise.reject('DB.ERR.INCORRECTFETCHREQUEST') }; // if no player or team id return promise reject
	return axios.delete(apiServer+`/playerlist/team/${teamId}/${playerId}`, { headers: { 'x-access-token': userApi.getToken() }})
}

//Match stuff

//all matches for team
export const fetchMatches = teamId => {
	console.log("Fetch matches for team "+teamId);
	if (!teamId) { return Promise.reject('DB.ERR.INCORRECTFETCHREQUEST') }; // if no team id return promise reject
	return axios.get(apiServer+`/matchlist/team/${teamId}`, { headers: { 'x-access-token': userApi.getToken() }})
}