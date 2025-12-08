export function inFarcasterApp() {
  return navigator?.userAgent?.includes("Farcaster");
}

export function inBaseApp() {
  return (
    navigator?.userAgent?.includes("BaseWallet") ||
    navigator?.userAgent?.includes("BaseApp")
  );
}
