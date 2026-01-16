import axios from 'axios';
import { API_BASE_URL } from '../config';

const client = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: false,
  timeout: 20000,
});

const unwrap = (res) => res?.data?.data ?? res?.data ?? res;

export async function getMe(privyAccessToken) {
  if (!privyAccessToken) throw new Error('Missing Privy access token');
  const response = await client.get('/auth/me', {
    headers: {
      Authorization: `Bearer ${privyAccessToken}`,
    },
  });
  return unwrap(response);
}
