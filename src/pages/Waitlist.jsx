
import { useState, useEffect } from "react";
import QRCode from "qrcode";
import Task from "../components/Task";

const API_BASE = `${import.meta.env.VITE_API_BASE_URL}`;

const TASKS = [
  { id: "x_follow", label: "Follow Base Scrabble on X", link: "https://x.com/basescrabble", xp: 20 },
  { id: "x_repost", label: "Repost our pinned post", link: "https://x.com/basescrabble/status/...", xp: 30 },
  { id: "fc_follow", label: "Follow on Farcaster", link: "https://warpcast.com/basescrabble", xp: 20 },
  { id: "fc_recast", label: "Recast pinned cast", link: "https://warpcast.com/basescrabble/...", xp: 30 },
  { id: "ba_follow", label: "Follow on BaseApp", link: "baseapp://app/basescrabble", xp: 20 }
];

function getLocal(key, fallback) {
  try {
    const val = localStorage.getItem(key);
    if (val === null) return fallback;
    if (typeof fallback === "object") return JSON.parse(val);
    if (typeof fallback === "number") return parseInt(val, 10) || fallback;
    return val;
  } catch {
    return fallback;
  }
}

function setLocal(key, val) {
  localStorage.setItem(key, typeof val === "object" ? JSON.stringify(val) : String(val));
}

export default function Waitlist() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [referralLink, setReferralLink] = useState("");
  const [referralCount, setReferralCount] = useState(0);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [xp, setXp] = useState(() => getLocal("bs_xp", 0));
  const [tasks, setTasks] = useState(() => getLocal("bs_tasks", {}));
  const [joined, setJoined] = useState(() => getLocal("bs_waitlist_joined", null));
  const [fcQR, setFcQR] = useState("");
  const [baQR, setBaQR] = useState("");
  const [xpAnim, setXpAnim] = useState(null);

  // Read ?ref=<code> from URL to support referral attribution
  const [refFromUrl, setRefFromUrl] = useState("");
  useEffect(() => {
    try {
      const url = new URL(window.location.href);
      // Prefer query param ?ref=CODE
      const fromQuery = (url.searchParams.get("ref") || "").trim();
      // Also support legacy path style /waitlist/CODE
      const parts = url.pathname.split("/").filter(Boolean);
      const fromPath = parts[0] === "waitlist" && parts.length >= 2 ? (parts[1] || "").trim() : "";
      const ref = fromQuery || fromPath;
      if (ref) setRefFromUrl(ref);
      // If path style was used, normalize URL to query style for consistency
      if (!fromQuery && fromPath) {
        const normalized = `${url.origin}/waitlist?ref=${fromPath}`;
        window.history.replaceState({}, "", normalized);
      }
      // IMPORTANT: If visiting via a referral link, always show the form for the recipient
      // and do not auto-load any prior joined state.
      if (ref) {
        try {
          localStorage.removeItem("bs_waitlist_joined");
        } catch {}
        setJoined(null);
        setSuccess(false);
      }
    } catch {}
  }, []);

  useEffect(() => {
    QRCode.toDataURL("https://warpcast.com/basescrabble").then(setFcQR);
    QRCode.toDataURL("baseapp://app/basescrabble").then(setBaQR);
  }, []);

  useEffect(() => {
    if (joined && joined.code) {
      fetch(`${API_BASE}/${joined.code}`)
        .then((r) => r.json())
        .then((data) => {
          if (data.success) {
            setReferralLink(data.referralLink);
            setReferralCount(data.referralCount);
            setSuccess(true);
          }
        });
    }
  }, [joined]);

  useEffect(() => {
    setLocal("bs_xp", xp);
    setLocal("bs_tasks", tasks);
  }, [xp, tasks]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE}/waitlist/join`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, referralCode: refFromUrl || undefined }),
      });
      const data = await res.json();
      if (data.success) {
        setJoined(data);
        setLocal("bs_waitlist_joined", data);
        setCode(data.code);
        // Always generate a frontend invite link for sharing
        setReferralLink(`https://www.basescrabble.xyz/waitlist?ref=${data.code}`);
        setReferralCount(data.referralCount);
        setSuccess(true);
      } else {
        setError(data.message || "Unknown error");
      }
    } catch (err) {
      setError("Server error");
    }
    setLoading(false);
  };


  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
  };

  const handleShare = () => {
    const link = referralLink || `https://www.basescrabble.xyz/waitlist${refFromUrl ? `?ref=${refFromUrl}` : ""}`;
    const shareText = `Join the Base Scrabble waitlist now and stack XP:\n${link}`;
    if (navigator.share) {
      navigator.share({
        title: 'Base Scrabble Waitlist',
        text: shareText,
        url: link,
      });
    } else {
      navigator.clipboard.writeText(shareText);
      alert('Invite text copied! Share is not supported on this device.');
    }
  };

  const onToggle = (id) => {
    const task = TASKS.find((t) => t.id === id);
    if (!task) return;
    const completed = !!tasks[id];
    let newXp = xp;
    let newTasks = { ...tasks };
    if (completed) {
      newXp -= task.xp;
      newTasks[id] = false;
      setXpAnim({ xp: -task.xp });
    } else {
      newXp += task.xp;
      newTasks[id] = true;
      setXpAnim({ xp: task.xp });
    }
    setTimeout(() => setXpAnim(null), 1200);
    setXp(newXp < 0 ? 0 : newXp);
    setTasks(newTasks);
  };

  // Rank tiers
  let rank = "Bronze", nextTier = 50, color = "#cd7f32";
  if (xp >= 400) { rank = "Diamond"; nextTier = 400; color = "#b9f2ff"; }
  else if (xp >= 150) { rank = "Gold"; nextTier = 400; color = "#ffd700"; }
  else if (xp >= 50) { rank = "Silver"; nextTier = 150; color = "#c0c0c0"; }

  const progress = Math.min(100, Math.round((xp / nextTier) * 100));


  return (
    <div className="max-w-xl mx-auto mt-8 p-6 bg-white dark:bg-gray-900/80 bg-opacity-80 backdrop-blur-xl rounded-xl shadow-xl flex flex-col gap-6 relative border border-gray-200 dark:border-gray-700">
      {/* Animated Scrabble Tiles */}

      {/* Animated BASE and SCRABBLE Tiles */}
      <div className="flex flex-col items-center mb-2 animate-scrabble-tiles">
        <div className="flex justify-center gap-2 mb-1">
          {["B","A","S","E"].map((letter, i) => (
            <div key={i} className="w-8 h-8 bg-yellow-200 border-2 border-yellow-600 rounded shadow flex items-center justify-center text-lg font-bold text-gray-900 animate-bounce-tile" style={{ animationDelay: `${i * 0.12}s` }}>{letter}</div>
          ))}
        </div>
        <div className="flex justify-center gap-2">
          {["S","C","R","A","B","B","L","E"].map((letter, i) => (
            <div key={i} className="w-8 h-8 bg-yellow-200 border-2 border-yellow-600 rounded shadow flex items-center justify-center text-lg font-bold text-gray-900 animate-bounce-tile" style={{ animationDelay: `${i * 0.12 + 0.5}s` }}>{letter}</div>
          ))}
        </div>
      </div>

      {/* XP Panel */}
      <div className="mb-2">
        <div className="flex items-center gap-4 mb-2 relative">
          <span className="text-3xl font-black" style={{ color }}>{xp} XP</span>
          <span className="text-lg font-bold" style={{ color }}>{rank}</span>
          {xpAnim && (
            <span className={`absolute left-1/2 -translate-x-1/2 -top-8 px-3 py-1 rounded text-white font-bold ${xpAnim.xp > 0 ? "bg-green-600" : "bg-red-600"} animate-xp-float`}> {xpAnim.xp > 0 ? "+" : "-"}{Math.abs(xpAnim.xp)} XP</span>
          )}
        </div>
        <div className="w-full h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2">
          <div className="h-4 rounded transition-all duration-300" style={{ width: `${progress}%`, background: color }}></div>
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">Progress to next tier: {nextTier} XP</div>
      </div>

      {/* Referral Info */}
      {joined && (
        <div className="mb-2">
          <div className="mb-2">Your referral code: <span className="font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-blue-700 dark:text-blue-300">{joined.code}</span></div>
              <div className="mb-2 break-all">Your invite link: <span className="font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-gray-900 dark:text-gray-100">{referralLink}</span></div>
          <div className="flex gap-2 mt-2">
            <button onClick={handleCopy} className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg font-bold">Copy Link</button>
            <button onClick={handleShare} className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-4 py-2 rounded-lg font-bold">Share</button>
          </div>
          <div className="mt-4">Referrals: <span className="font-bold text-purple-700 dark:text-purple-300">{joined.referralCount}</span></div>
        </div>
      )}

      {/* Task List */}
      <div className="mb-2">
        <h3 className="font-bold mb-2 text-gray-800 dark:text-gray-200">Earn XP by completing tasks:</h3>
        <div className="flex flex-col gap-2 sm:gap-3">
          {TASKS.map((task) => (
            <Task key={task.id} {...task} completed={!!tasks[task.id]} onToggle={onToggle} />
          ))}
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">XP is stored locally on your device. You can still join without completing tasks.</div>
      </div>

      {/* QR Codes */}
      <div className="flex gap-6 mb-2 justify-center flex-wrap">
        <div className="flex flex-col items-center">
          {fcQR && <img src={fcQR} alt="Farcaster QR" className="w-20 h-20" />}
          <span className="text-xs mt-1">Farcaster</span>
        </div>
        <div className="flex flex-col items-center">
          {baQR && <img src={baQR} alt="BaseApp QR" className="w-20 h-20" />}
          <span className="text-xs mt-1">BaseApp</span>
        </div>
      </div>

      {/* Email Form at Bottom */}
      <div className="mt-4">
        {!joined && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full border-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-lg p-3 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-400"
              required
            />
            <button
              type="submit"
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white w-full py-3 rounded-lg font-bold disabled:opacity-50 shadow-md"
              disabled={loading}
            >
              {loading ? "Joining..." : "Join Waitlist"}
            </button>
            {error && <p className="text-red-600 mt-2">{error}</p>}
          </form>
        )}
      </div>

      {/* Animations CSS */}
      <style>{`
        @keyframes bounce-tile {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
        }
        .animate-bounce-tile { animation: bounce-tile 1.2s infinite; }
        @keyframes xp-float {
          0% { opacity: 0; transform: translateY(0) scale(0.8); }
          20% { opacity: 1; transform: translateY(-16px) scale(1.1); }
          80% { opacity: 1; transform: translateY(-32px) scale(1); }
          100% { opacity: 0; transform: translateY(-48px) scale(0.8); }
        }
        .animate-xp-float { animation: xp-float 1.2s linear; }
        /* Mobile tweaks for card and task alignment */
        @media (max-width: 600px) {
          .max-w-xl { max-width: 98vw !important; }
          .task-item { flex-direction: column; align-items: flex-start !important; gap: 0.5rem; padding: 1rem 0.75rem !important; }
          .task-item .ml-2 { margin-left: 0 !important; margin-top: 0.5rem !important; width: 100%; text-align: left; }
        }
      `}</style>
    </div>
  );
}
