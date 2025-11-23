import axios from "axios";
import { API_BASE_URL } from "../config";

export async function getTournaments(query = {}) {
	const qs = new URLSearchParams(query).toString();
	const url = `${API_BASE_URL}/tournaments` + (qs ? `?${qs}` : "");
	const res = await axios.get(url, { withCredentials: true });
	return res.data;
}

export async function getTournament(tournamentId) {
	const url = `${API_BASE_URL}/tournaments/${encodeURIComponent(tournamentId)}`;
	const res = await axios.get(url, { withCredentials: true });
	return res.data;
}

export async function getLeaderboard(tournamentId) {
	const url = `${API_BASE_URL}/tournaments/${encodeURIComponent(tournamentId)}/leaderboard`;
	const res = await axios.get(url, { withCredentials: true });
	return res.data;
}

export async function joinTournament(tournamentId, userId) {
	const url = `${API_BASE_URL}/tournaments/${encodeURIComponent(tournamentId)}/join`;
	const res = await axios.post(url, { userId }, { withCredentials: true });
	return res.data;
}

export default {
	getTournaments,
	getTournament,
	getLeaderboard,
	joinTournament,
};

