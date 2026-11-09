// Shared backend: Firebase Realtime Database, or a local BroadcastChannel stand-in for testing on one computer.
import { firebaseConfig } from "./config.js";

const FB = "https://www.gstatic.com/firebasejs/10.12.2/";

export function mode() {
  const q = new URLSearchParams(location.search);
  if (q.has("demo")) return "demo";
  if (q.has("local") || !firebaseConfig) return "local";
  return "firebase";
}

export async function connect(room) {
  return mode() === "firebase" ? connectFirebase(room) : connectLocal(room);
}

async function connectFirebase(room) {
  const [{ initializeApp }, { getAuth, signInAnonymously }, db] = await Promise.all([
    import(FB + "firebase-app.js"), import(FB + "firebase-auth.js"), import(FB + "firebase-database.js"),
  ]);
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const cred = await signInAnonymously(auth);
  const uid = cred.user.uid;
  const d = db.getDatabase(app);
  let offset = 0;
  db.onValue(db.ref(d, ".info/serverTimeOffset"), s => { offset = s.val() || 0; });
  return {
    uid,
    now: () => Date.now() + offset,
    submit: (key, val) => db.update(db.ref(d, `rooms/${room}/votes/${uid}`),
      { [key]: val, ["t" + key]: db.serverTimestamp() }),
    subscribe: cb => db.onValue(db.ref(d, `rooms/${room}/votes`), s => cb(s.val() || {})),
  };
}

function connectLocal(room) {
  const ch = new BroadcastChannel("pulse-" + room);
  const k = "pulse-votes-" + room;
  const load = () => { try { return JSON.parse(localStorage.getItem(k)) || {}; } catch { return {}; } };
  let uid = sessionStorage.getItem("pulse-uid");
  if (!uid) { uid = Math.random().toString(36).slice(2); sessionStorage.setItem("pulse-uid", uid); }
  return {
    uid,
    now: () => Date.now(),
    submit: async (key, val) => {
      const v = load();
      v[uid] = { ...(v[uid] || {}), [key]: val, ["t" + key]: Date.now() };
      try { localStorage.setItem(k, JSON.stringify(v)); } catch {}
      ch.postMessage(v);
    },
    subscribe: cb => { cb(load()); ch.onmessage = e => cb(e.data); return () => ch.close(); },
  };
}

// Exponentially weighted mean and its uncertainty for one gauge.
// Each device contributes only its latest click, weighted w = exp(-age/tau).
// A weak prior (pseudo-count K at 0) makes the needle drift back to centre and the uncertainty band widen when there is little recent input.
const K = 0.5;
export function stats(votes, key, now, tau) {
  let sw = 0, swx = 0, sw2 = 0, n = 0; const pts = [];
  for (const v of Object.values(votes)) {
    const x = v[key], t = v["t" + key];
    if (typeof x !== "number" || typeof t !== "number") continue;
    const w = Math.exp(-Math.max(0, now - t) / 1000 / tau);
    if (w < 0.01) continue;
    pts.push([x, w]); sw += w; swx += w * x; sw2 += w * w; if (w > 0.37) n++;
  }
  const m = swx / (sw + K);
  let ss = K * (m * m + 0.5);           // prior point at 0 with variance 0.5
  for (const [x, w] of pts) ss += w * (x - m) ** 2;
  const s2 = ss / (sw + K);
  const neff = (sw + K) ** 2 / (sw2 + K * K);
  const se = Math.min(1, Math.sqrt(s2 / neff));
  return { m, se, neff: sw > 0 ? sw * sw / sw2 : 0, n };
}
