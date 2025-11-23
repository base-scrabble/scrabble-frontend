import axios from "axios";
import { API_BASE_URL } from "../config";

export async function getProfile(userId) {
	const url = `${API_BASE_URL}/users/${encodeURIComponent(userId)}`;
	const res = await axios.get(url, { withCredentials: true });
	return res.data;
}

export async function ensureUser(payload = {}) {
	// Used for Privy ensure/login flow. Backend creates/returns user record.
	const url = `${API_BASE_URL}/users`;
	const res = await axios.post(url, payload, { withCredentials: true });
	return res.data;
}

export async function updateUser(userId, updates = {}) {
	const url = `${API_BASE_URL}/users/${encodeURIComponent(userId)}`;
	const res = await axios.put(url, updates, { withCredentials: true });
	return res.data;
}

export async function getStats(userId) {
	const url = `${API_BASE_URL}/users/${encodeURIComponent(userId)}/stats`;
	const res = await axios.get(url, { withCredentials: true });
	return res.data;
}

export async function getReferrals(userId) {
	const url = `${API_BASE_URL}/users/${encodeURIComponent(userId)}/referrals`;
	const res = await axios.get(url, { withCredentials: true });
	return res.data;
}

export default {
	getProfile,
	ensureUser,
	updateUser,
	getStats,
	getReferrals,
};

