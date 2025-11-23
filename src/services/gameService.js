import axios from "axios";
import { API_BASE_URL } from "../config";

// Configure axios client with defaults
const client = axios.create({
	baseURL: API_BASE_URL,
	withCredentials: true,
	timeout: 10000, // 10 second timeout
});

// Error handler wrapper
function handleAxiosError(error, context = "API call") {
	console.error(`${context} failed:`, error.message);
	
	if (error.response) {
		// Server responded with error status
		return {
			success: false,
			message: error.response.data?.message || `Server error: ${error.response.status}`,
			status: error.response.status,
		};
	} else if (error.request) {
		// Request made but no response
		return {
			success: false,
			message: "No response from server. Please check your connection.",
			status: 0,
		};
	} else {
		// Error in request setup
		return {
			success: false,
			message: error.message,
			status: -1,
		};
	}
}

// HTTP API helpers for game flow with error handling
export async function createGame({ playerName, maxPlayers = 2, stake = 0 } = {}) {
	try {
		const payload = { playerName, maxPlayers, stake };
		const res = await client.post('/gameplay/create', payload);
		return res.data;
	} catch (error) {
		return handleAxiosError(error, 'Create game');
	}
}

export async function joinGame({ gameId, playerName } = {}) {
	try {
		const url = `/gameplay/${encodeURIComponent(gameId)}/join`;
		const res = await client.post(url, { playerName });
		return res.data;
	} catch (error) {
		return handleAxiosError(error, 'Join game');
	}
}

export async function getGameState(gameId) {
	try {
		const url = `/gameplay/${encodeURIComponent(gameId)}`;
		const res = await client.get(url);
		return res.data;
	} catch (error) {
		return handleAxiosError(error, 'Get game state');
	}
}

export async function makeMove({ gameId, move, playerId } = {}) {
	try {
		const url = `/gameplay/${encodeURIComponent(gameId)}/move`;
		const payload = { move, playerId };
		const res = await client.post(url, payload);
		return res.data;
	} catch (error) {
		return handleAxiosError(error, 'Make move');
	}
}

export async function skipTurn({ gameId, playerName } = {}) {
	try {
		const url = `/gameplay/${encodeURIComponent(gameId)}/skip`;
		const res = await client.post(url, { playerName });
		return res.data;
	} catch (error) {
		return handleAxiosError(error, 'Skip turn');
	}
}

export async function endGame({ gameId } = {}) {
	try {
		const url = `/gameplay/${encodeURIComponent(gameId)}/end`;
		const res = await client.post(url, {});
		return res.data;
	} catch (error) {
		return handleAxiosError(error, 'End game');
	}
}

export async function listGames({ status } = {}) {
	try {
		const url = `/gameplay/list` + (status ? `?status=${encodeURIComponent(status)}` : "");
		const res = await client.get(url);
		return res.data;
	} catch (error) {
		return handleAxiosError(error, 'List games');
	}
}

export default {
	createGame,
	joinGame,
	getGameState,
	makeMove,
	endGame,
	listGames,
};

