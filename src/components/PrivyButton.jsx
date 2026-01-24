import { useCallback, useEffect, useMemo, useState } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { getMe } from "../api/authApi";

export default function PrivyButton() {
  const { ready, authenticated, user, getAccessToken, login, logout } = usePrivy();
  const [loginError, setLoginError] = useState("");

  const label = useMemo(() => {
    if (!ready) return "Loading…";
    if (!authenticated) return "Log in";

    const email = user?.email?.address;
    const phone = user?.phone?.number;
    const name = user?.google?.name || user?.twitter?.name || user?.discord?.username;

    return email || phone || name || "Account";
  }, [ready, authenticated, user]);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      if (!ready || !authenticated) return;
      if (typeof getAccessToken !== 'function') return;

      try {
        const token = await getAccessToken();
        const me = await getMe(token);
        if (!cancelled) {
          console.debug('[auth] /auth/me ok', me);
        }
      } catch (err) {
        if (!cancelled) {
          console.warn('[auth] /auth/me failed', {
            message: err?.message,
            status: err?.response?.status,
          });
        }
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [ready, authenticated, getAccessToken]);

  const handleLogin = useCallback(async () => {
    setLoginError("");
    try {
      // Privy can reject with 403 / "Origin not allowed" when the current
      // hostname isn't whitelisted in the Privy dashboard.
      await Promise.resolve(login());
    } catch (err) {
      const message = String(err?.message || err || "");
      if (/origin not allowed/i.test(message)) {
        const origin = typeof window !== 'undefined' ? window.location.origin : '';
        setLoginError(`Login disabled: Privy does not allow this origin (${origin}).`);
        return;
      }
      setLoginError(message || 'Login failed.');
    }
  }, [login]);

  if (!ready) {
    return (
      <button
        type="button"
        className="px-3 py-1.5 rounded bg-white/15 text-white text-sm font-semibold opacity-80 cursor-wait"
        disabled
      >
        {label}
      </button>
    );
  }

  if (!authenticated) {
    return (
      <div className="flex flex-col items-end gap-1">
        <button
          type="button"
          onClick={handleLogin}
          className="px-3 py-1.5 rounded bg-white text-blue-700 text-sm font-semibold hover:bg-blue-50"
        >
          {label}
        </button>
        {loginError ? (
          <span className="max-w-[260px] text-right text-[11px] leading-tight text-white/90">
            {loginError} You can still play free games without logging in.
          </span>
        ) : null}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <span className="max-w-[180px] truncate text-sm font-semibold" title={label}>
        {label}
      </span>
      <button
        type="button"
        onClick={logout}
        className="px-3 py-1.5 rounded bg-white/15 text-white text-sm font-semibold hover:bg-white/20"
      >
        Log out
      </button>
    </div>
  );
}
