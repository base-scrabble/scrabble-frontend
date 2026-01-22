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
  const walletEnabled = ENABLE_WALLET;

  const [account, setAccount] = useState(() =>
    walletEnabled ? getSessionItem(ACCOUNT_KEY) : null
  );
  const [loading, setLoading] = useState(false);
  const [autoConnectEnabled, setAutoConnectEnabled] = useState(() =>
    walletEnabled ? getSessionItem(AUTOCONNECT_KEY) === "enabled" : false
  );

  const handleAccountsChanged = useCallback((accounts = []) => {
    if (!walletEnabled) return;
    const primary = accounts[0] || null;
    setAccount(primary);
    if (primary) {
      setSessionItem(ACCOUNT_KEY, primary);
    } else {
      removeSessionItem(ACCOUNT_KEY);
    }
  }, [walletEnabled]);

  useEffect(() => {
    if (!walletEnabled) return;
    if (!autoConnectEnabled || typeof window === "undefined" || !window.ethereum) return;
    window.ethereum
      .request({ method: "eth_accounts" })
      .then(handleAccountsChanged)
      .catch((err) => console.error("Auto-connect failed", err));
  }, [walletEnabled, autoConnectEnabled, handleAccountsChanged]);

  useEffect(() => {
    if (!walletEnabled) return;
    if (typeof window === "undefined" || !window.ethereum) return;
    window.ethereum.on?.("accountsChanged", handleAccountsChanged);
    return () => {
      window.ethereum?.removeListener?.("accountsChanged", handleAccountsChanged);
    };
  }, [walletEnabled, handleAccountsChanged]);

  const connect = useCallback(async () => {
    if (!walletEnabled) {
      throw new Error("Wallet is disabled for this build");
    }
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
  }, [walletEnabled, handleAccountsChanged]);

  const disconnect = useCallback(() => {
    if (!walletEnabled) return;
    setAccount(null);
    removeSessionItem(ACCOUNT_KEY);
    setAutoConnectEnabled(false);
    setSessionItem(AUTOCONNECT_KEY, "disabled");
  }, [walletEnabled]);

  const toggleAutoConnect = useCallback((enabled) => {
    if (!walletEnabled) return;
    setAutoConnectEnabled(enabled);
    setSessionItem(AUTOCONNECT_KEY, enabled ? "enabled" : "disabled");
  }, [walletEnabled]);

  const value = useMemo(
    () =>
      walletEnabled
        ? {
            account,
            loading,
            connect,
            disconnect,
            autoConnectEnabled,
            toggleAutoConnect,
          }
        : {
            account: null,
            loading: false,
            connect: async () => {
              throw new Error("Wallet is disabled for this build");
            },
            disconnect: () => {},
            autoConnectEnabled: false,
            toggleAutoConnect: () => {},
          },
    [walletEnabled, account, loading, connect, disconnect, autoConnectEnabled, toggleAutoConnect]
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
