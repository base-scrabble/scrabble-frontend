import { useMemo } from "react";
import { usePrivy } from "@privy-io/react-auth";

export default function PrivyButton() {
  const { ready, authenticated, user, login, logout } = usePrivy();

  const label = useMemo(() => {
    if (!ready) return "Loading…";
    if (!authenticated) return "Log in";

    const email = user?.email?.address;
    const phone = user?.phone?.number;
    const name = user?.google?.name || user?.twitter?.name || user?.discord?.username;

    return email || phone || name || "Account";
  }, [ready, authenticated, user]);

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
