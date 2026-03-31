# 🚀 Network Speed Test & Health Dashboard

A beautiful, client-side only internet speed test application built with HTML, CSS, and Vanilla JavaScript. 

Instead of just showing raw numbers, this dashboard translates your speed test results into actionable, real-world insights, telling you exactly how your connection will handle gaming, 4K streaming, and video calls.

## ✨ Features

*   **Real-Time SVG Speedometer:** A dynamic, smoothly animated dial that tracks your speed byte-by-byte.
*   **Automatic Client Detection:** Fetches and displays the user's IP-based location, Internet Service Provider (ISP), and device type on load.
*   **Network Health Insights:** Automatically grades the final results (Green/Yellow/Red) based on modern internet benchmarks.
*   **Zero Dependencies:** Built entirely with Vanilla JavaScript and pure CSS. No frameworks, no build tools, no backend required.
*   **Responsive UI:** A modern, soft UI design that looks great on both desktop and mobile devices.

## 🛠️ How It Works (The Tech)

Because this application runs entirely in the browser without a dedicated backend WebSockets server, it uses a mix of real network requests and algorithmic simulation:

1.  **Download Phase (Real Test):** The core engine uses `XMLHttpRequest` to download a large (~4.7MB) public image file. It tracks the exact milliseconds it takes to download the file, dynamically calculating the Megabits per second (Mbps) in real-time.
2.  **Ping & Upload Phases (Simulated):** True ping and upload testing require a server to receive data packets. To keep this project serverless and easy to run locally, the Ping and Upload phases are simulated using randomized algorithms based on the actual Download speed and simulated network "jitter".
3.  **Location & ISP:** Uses the free public API from [ipapi.co](https://ipapi.co/) to passively detect network provider and location details.

## 🚀 Getting Started

Since there is no backend or build process, running this project is incredibly simple:

1.  Clone this repository or download the source code files.
2.  Ensure all three files (`index.html`, `style.css`, `script.js`) are in the same folder.
3.  Double-click `index.html` to open it in your default web browser.
4.  Click **"Start Speed Test"**!

## 📁 File Structure

```text
/
├── index.html    # The dashboard structure and UI layout
├── style.css     # Responsive design, animations, and color themes
├── script.js     # The testing engine, math logic, and API calls
└── README.md     # Project documentation
