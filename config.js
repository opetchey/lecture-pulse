// Paste your Firebase web-app config here (Firebase console → Project settings → Your apps → Web app).
// Leave as null to run only in local test mode (?local) or demo mode (present.html?demo).
export const firebaseConfig = {
  apiKey: "AIzaSyAVuwiPt-mMGr61PtpABF9xeuU-YqG-nfM",
  authDomain: "lecture-pulse-2e990.firebaseapp.com",
  databaseURL: "https://lecture-pulse-2e990-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "lecture-pulse-2e990",
  storageBucket: "lecture-pulse-2e990.firebasestorage.app",
  messagingSenderId: "163560134209",
  appId: "1:163560134209:web:c9f87ac4415a4b0afe98c0"
};
/* Example:
export const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "bio144-pulse.firebaseapp.com",
  databaseURL: "https://bio144-pulse-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "bio144-pulse",
  appId: "1:1234567890:web:abcdef"
};
*/

// Default room name. The presenter's "New session" button appends a random suffix.
export const DEFAULT_ROOM = "bio144";

// The two gauges. Values are always -1, 0, +1.
export const GAUGES = [
  { key: "u", title: "Understanding", labels: ["Lost", "Partly", "Got it"],
    colors: ["#d64545", "#e0a526", "#2e9d5b"] },
  { key: "p", title: "Pace", labels: ["Too slow", "Just right", "Too fast"],
    colors: ["#e0a526", "#2e9d5b", "#d64545"] },
];
