# Lecture Pulse

Students scan a QR code and tap one of three buttons for each of two questions: **Understanding** (Lost / Partly / Got it) and **Pace** (Too slow / Just right / Too fast). The projector shows two dials. Each needle sits at the weighted average, and a shaded band around it shows the uncertainty. Each response also appears as a dot just outside the arc, fading as it ages. No student login is needed.

## Try it first (no setup)

Serve the folder from any local web server, e.g. `python3 -m http.server` in this folder, then:

- `present.html?demo` shows 80 simulated students so you can watch the dials move.
- `present.html?local`, plus `index.html?local` in a few other tabs, lets you click as "students" yourself. This only works within one browser on one computer.

## Go live (≈30 min, once)

1. **Create a Firebase project** at https://console.firebase.google.com (free Spark plan). Turning off Google Analytics is fine.
2. **Realtime Database** → Create database. Pick location **europe-west1 (Belgium)** and start in *locked mode*.
3. Open the **Rules** tab, paste in the contents of `database.rules.json`, then click Publish.
4. **Authentication** → Get started → Sign-in method → enable **Anonymous**.
5. **Project settings** → Your apps → add a **Web app** (no hosting needed), copy the `firebaseConfig` object into `config.js` and make sure `databaseURL` is included.
6. **Host the folder** on any static host, e.g. a GitHub Pages repo, Firebase Hosting, or UZH web space. Add the host's domain under Authentication → Settings → Authorized domains.
7. In the lecture, open `https://<your-host>/present.html` on the projector. Students scan the QR code, which points to `index.html?r=bio144`.

Use **New session** to start a fresh room (new QR) for each lecture or exercise. Otherwise old taps simply fade away.

## Small dials in a corner of your HTML slides

Add one line just before `</body>` in the **presenter** version of a deck (not the student version):

```html
<script src="https://<your-host>/pulse-widget.js" data-room="bio144"></script>
```

The two dials then sit small in the top-right corner of every slide. Press **G** to hide or show them. They don't capture clicks or keys, so slide navigation works as normal. The comments at the top of `pulse-widget.js` list the options: corner, width, toggle key, start hidden. For a quick look, open `present.html?mini` directly.

## Small floating window on your desktop

Open `present.html` in **Chrome or Edge** and click **Pop out**. This opens a small window that stays on top of everything, including Keynote, PowerPoint, a PDF or RStudio. Drag and resize it as you like. Close it or click **Bring back** to return the dials to the main page. Keep the main tab open while the window is out; it can stay in the background.

## How the numbers work

Each student device contributes only its **latest** tap per gauge, scored −1/0/+1. There is a 4-second client cooldown, and the database rules enforce 3 seconds. Each tap gets weight *w* = exp(−age/τ). The slider sets τ, shown as the half-weight time (default ≈ 83 s).

- Weighted mean: *m* = Σ*wx* / (Σ*w* + *k*). Here *k* = 0.5 is a weak prior at "neutral", so the needle drifts back to the centre when nobody has tapped for a while.
- Weighted variance: *s*² around *m*, including the prior point.
- Effective sample size: *n*ₑ = (Σ*w*)² / Σ*w*². This falls as taps age.
- Standard error = *s* / √*n*ₑ. The needle shows *m*, moving smoothly when it changes, and the shaded bands show ±1 and ±2 SE. A unanimous, active room gives a narrow band, while a split or quiet room gives a wide one.

To change wording, colours or the number of gauges, edit `GAUGES` in `config.js`.

## Privacy

Taps are tied to a random anonymous Firebase ID per browser. No names, emails or IP addresses are stored by the app. Data sits in Google's EU region. You may want to tell students this in one sentence.
