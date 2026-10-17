# Pulse Network Diagnostics

[Open the live app](https://jbiieeee.github.io/speedtest/)

A small, client-side internet speed dashboard built with HTML, CSS, and vanilla JavaScript. It pairs a real download measurement with clear estimates for ping and upload, then translates the results into guidance for gaming, streaming, and video calls.

## Features

- Live SVG meter for the active test phase
- Download measurement based on a real file transfer
- Clearly labeled simulated ping and upload estimates
- Connection health insights based on the measured and estimated results
- ISP and approximate location lookup, with a fallback provider
- Responsive layout, keyboard-accessible results dialog, and reduced-motion support
- No build step or application dependencies

## Run locally

Keep `index.html`, `style.css`, and `script.js` together, then open `index.html` in a browser. Network access is needed for the download transfer and optional provider/location lookup.

## How the readings work

The download phase measures a browser request for a public image file. Ping is generated as a demo estimate, and upload is simulated using the measured download result. They are not substitutes for a server-backed latency or upload test. ISP and location are requested from DB-IP, with IPinfo as a fallback; browser privacy settings or network policy may hide those details.

## Project files

- `index.html` — app structure and content
- `style.css` — visual system, responsive layouts, and interaction states
- `script.js` — connection lookup, test flow, and result analysis
