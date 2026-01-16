import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
  getSessionItem,
  setSessionItem,
  removeSessionItem,
} from "../utils/session";
import { ENABLE_WALLET } from "../config";

const WalletContext = createContext(null);

const ACCOUNT_KEY = "connectedWallet";
const AUTOCONNECT_KEY = "walletAutoconnect";

export function WalletProvider({ children }) {
  if (!ENABLE_WALLET) {
    const value = {
      account: null,
      loading: false,
      connect: async () => {
        throw new Error("Wallet is disabled for this build");
      },
      disconnect: () => {},
      autoConnectEnabled: false,
      toggleAutoConnect: () => {},
    };
    return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
  }

  const [account, setAccount] = useState(() => getSessionItem(ACCOUNT_KEY));
  const [loading, setLoading] = useState(false);
  const [autoConnectEnabled, setAutoConnectEnabled] = useState(
    () => getSessionItem(AUTOCONNECT_KEY) === "enabled"
  );

  const handleAccountsChanged = useCallback((accounts = []) => {
    const primary = accounts[0] || null;
    setAccount(primary);
    if (primary) {
      setSessionItem(ACCOUNT_KEY, primary);
    } else {
      removeSessionItem(ACCOUNT_KEY);
    }
  }, []);

  useEffect(() => {
    if (!autoConnectEnabled || typeof window === "undefined" || !window.ethereum) return;
    window.ethereum
      .request({ method: "eth_accounts" })
      .then(handleAccountsChanged)
      .catch((err) => console.error("Auto-connect failed", err));
  }, [autoConnectEnabled, handleAccountsChanged]);

  useEffect(() => {
    if (typeof window === "undefined" || !window.ethereum) return;
    window.ethereum.on?.("accountsChanged", handleAccountsChanged);
    return () => {
      window.ethereum?.removeListener?.("accountsChanged", handleAccountsChanged);
    };
  }, [handleAccountsChanged]);

  const connect = useCallback(async () => {
    if (typeof window === "undefined" || !window.ethereum) {
      throw new Error("Wallet provider not available");
    }
    setLoading(true);
    try {
      const { BrowserProvider } = await import("ethers");
      const provider = new BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      handleAccountsChanged(accounts);
    } finally {
      setLoading(false);
    }
  }, [handleAccountsChanged]);

  const disconnect = useCallback(() => {
    setAccount(null);
    removeSessionItem(ACCOUNT_KEY);
    setAutoConnectEnabled(false);
    setSessionItem(AUTOCONNECT_KEY, "disabled");
  }, []);

  const toggleAutoConnect = useCallback((enabled) => {
    setAutoConnectEnabled(enabled);
    setSessionItem(AUTOCONNECT_KEY, enabled ? "enabled" : "disabled");
  }, []);

  const value = useMemo(
    () => ({
      account,
      loading,
      connect,
      disconnect,
      autoConnectEnabled,
      toggleAutoConnect,
    }),
    [account, loading, connect, disconnect, autoConnectEnabled, toggleAutoConnect]
  );

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
}

export const useWallet = () => {
  const ctx = useContext(WalletContext);
  if (!ctx) {
    throw new Error("useWallet must be used within WalletProvider");
  }
  return ctx;
};
