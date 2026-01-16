import { useEffect, useMemo } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { getMe } from "../api/authApi";

export default function PrivyButton() {
  const { ready, authenticated, user, getAccessToken, login, logout } = usePrivy();

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
      <button
        type="button"
        onClick={login}
        className="px-3 py-1.5 rounded bg-white text-blue-700 text-sm font-semibold hover:bg-blue-50"
      >
        {label}
      </button>
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
