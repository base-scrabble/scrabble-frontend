import { ethers } from 'ethers';
import BaseScrabbleGameAbi from '../abi/BaseScrabbleGame.json';
import AccessManagerAbi from '../abi/AccessManager.json';
import WalletAbi from '../abi/Wallet.json';
import { RPC_HTTP_URL } from '../config';

const RPC = RPC_HTTP_URL;
const SCRABBLE_ADDRESS = import.meta.env.VITE_SCRABBLE_GAME_ADDRESS;
const ACCESS_MANAGER_ADDRESS = import.meta.env.VITE_ACCESS_MANAGER_ADDRESS;
const WALLET_ADDRESS = import.meta.env.VITE_WALLET_ADDRESS;

function getProvider() {
  try {
    if (typeof window !== 'undefined' && window.ethereum) {
      // Handle multiple injected providers (some browsers have multiple wallet extensions)
      const injected = window.ethereum;
      const picked = Array.isArray(injected.providers)
        ? (injected.providers.find(p => p.isMetaMask) || injected.providers[0])
        : injected;
      return new ethers.BrowserProvider(picked);
    }
  } catch (e) {
    // fallthrough to RPC provider
  }
  if (!RPC) {
    console.warn('No RPC configured (VITE_RPC_URL / VITE_BACKEND_URL). Using default provider may fail.');
  }
  return RPC ? new ethers.JsonRpcProvider(RPC) : ethers.getDefaultProvider();
}

function getSigner() {
  try {
    if (typeof window !== 'undefined' && window.ethereum) {
      const injected = window.ethereum;
      const picked = Array.isArray(injected.providers)
        ? (injected.providers.find(p => p.isMetaMask) || injected.providers[0])
        : injected;
      const provider = new ethers.BrowserProvider(picked);
      return provider.getSigner();
    }
  } catch (e) {
    console.warn('No injected provider available for signer');
  }
  return null;
}

function getContract(address, abi, withSigner = false) {
  if (!address) {
    throw new Error('Contract address is required');
  }
  if (!abi || !Array.isArray(abi) || abi.length === 0) {
    throw new Error('ABI is missing or empty for ' + address);
  }
  const provider = getProvider();
  if (withSigner) {
    const signer = getSigner();
    if (!signer) {
      // fallback to provider-only contract
      return new ethers.Contract(address, abi, provider);
    }
    return new ethers.Contract(address, abi, signer);
  }
  return new ethers.Contract(address, abi, provider);
}

export function getScrabbleContract(withSigner = false) {
  if (!SCRABBLE_ADDRESS) throw new Error('SCRABBLE contract address not set in env');
  return getContract(SCRABBLE_ADDRESS, BaseScrabbleGameAbi, withSigner);
}

export function getAccessManagerContract(withSigner = false) {
  if (!ACCESS_MANAGER_ADDRESS) throw new Error('ACCESS_MANAGER contract address not set in env');
  return getContract(ACCESS_MANAGER_ADDRESS, AccessManagerAbi, withSigner);
}

export function getWalletContract(withSigner = false) {
  if (!WALLET_ADDRESS) throw new Error('WALLET contract address not set in env');
  return getContract(WALLET_ADDRESS, WalletAbi, withSigner);
}

// Convenience read helpers
export async function getOnChainGame(gameId) {
  const contract = getScrabbleContract(false);
  return await contract.getGame(gameId);
}

export async function getWalletBalance(userAddress, tokenAddress) {
  const contract = getWalletContract(false);
  return await contract.getBalance(userAddress, tokenAddress);
}

export default {
  getProvider,
  getSigner,
  getScrabbleContract,
  getAccessManagerContract,
  getWalletContract,
  getOnChainGame,
  getWalletBalance,
};
