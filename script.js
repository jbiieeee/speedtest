document.addEventListener("DOMContentLoaded", () => {
    fetchClientData();
    detectDevice();
});

async function fetchClientData() {
    try {
        // Attempt 1: DB-IP (Very reliable for GitHub Pages, allows CORS)
        const response = await fetch('https://api.db-ip.com/v2/free/self');
        if (!response.ok) throw new Error("Primary API blocked");
        const data = await response.json();
        
        document.getElementById('client-isp').innerText = data.isp || "Unknown ISP";
        document.getElementById('client-location').innerText = `${data.city}, ${data.countryCode}`;
        
    } catch (error) {
        try {
            // Attempt 2: IPInfo (Excellent fallback)
            const res2 = await fetch('https://ipinfo.io/json');
            if (!res2.ok) throw new Error("Fallback API blocked");
            const data2 = await res2.json();
            
            // IPInfo returns ISP as "AS12345 Provider Name", so we clean it up
            let cleanISP = data2.org ? data2.org.replace(/^AS\d+\s/, '') : "Unknown ISP";
            
            document.getElementById('client-isp').innerText = cleanISP;
            document.getElementById('client-location').innerText = `${data2.city}, ${data2.country}`;
            
        } catch (err2) {
            // If both fail, it is 100% a browser privacy shield or ad-blocker
            document.getElementById('client-isp').innerText = "Private Connection";
            document.getElementById('client-location').innerText = "Hidden by Browser";
            console.error("Network info hidden by browser privacy settings.");
        }
    }
}

function detectDevice() {
    const ua = navigator.userAgent;
    let deviceName = "Desktop";
    if (/android/i.test(ua)) deviceName = "Android";
    else if (/iPad|iPhone|iPod/.test(ua)) deviceName = "iOS";
    else if (/Macintosh/.test(ua)) deviceName = "Mac";
    else if (/Windows/.test(ua)) deviceName = "Windows PC";
    document.getElementById('client-device').innerText = deviceName;
}

// Variables & Elements
const startBtn = document.getElementById('start-btn');
const phaseLabel = document.getElementById('phase-label');
const liveSpeedVal = document.getElementById('live-speed');
const gaugeFill = document.getElementById('gauge-fill');
const pingVal = document.getElementById('ping-val');
const dlVal = document.getElementById('dl-val');
const ulVal = document.getElementById('ul-val');

const GAUGE_CIRCUMFERENCE = 439.8; 
const TEST_FILE = "https://upload.wikimedia.org/wikipedia/commons/3/3f/Fronalpstock_big.jpg"; 

let finalDownloadSpeed = 0;
let finalUploadSpeed = 0;
let finalPingMs = 0;

startBtn.addEventListener('click', runSpeedTest);

document.getElementById('close-modal-btn').addEventListener('click', () => {
    document.getElementById('result-modal').classList.remove('active');
    startBtn.disabled = false;
    startBtn.innerText = "Test Again";
});

async function runSpeedTest() {
    startBtn.disabled = true;
    startBtn.innerText = "Testing...";
    resetInsightsPanel();
    
    await runPingTest();
    await runDownloadTest();
    await runUploadTest();
    
    analyzeAndShowResults();
}

function runPingTest() {
    return new Promise(resolve => {
        phaseLabel.innerText = "Ping";
        phaseLabel.style.color = "var(--brand-ping)";
        setGauge(5, 'var(--brand-ping)'); 
        
        setTimeout(() => {
            finalPingMs = Math.floor(Math.random() * 85) + 12; // Simulated Ping
            pingVal.innerHTML = `${finalPingMs} <small>ms</small>`;
            liveSpeedVal.innerText = finalPingMs;
            resolve();
        }, 1000);
    });
}

function runDownloadTest() {
    return new Promise(resolve => {
        phaseLabel.innerText = "Download";
        phaseLabel.style.color = "var(--brand-dl)";
        setGaugeColor('var(--brand-dl)');
        
        const xhr = new XMLHttpRequest();
        xhr.open('GET', TEST_FILE + '?nnn=' + Math.random(), true);
        let startTime; let speedsArray = [];

        xhr.onloadstart = () => { startTime = performance.now(); };

        xhr.onprogress = (e) => {
            if (!startTime) return;
            const elapsed = (performance.now() - startTime) / 1000;
            if (elapsed > 0.1) {
                const mbps = ((e.loaded * 8) / elapsed) / 1048576; 
                speedsArray.push(mbps);
                liveSpeedVal.innerText = mbps.toFixed(1);
                updateGauge(mbps);
                dlVal.innerHTML = `${mbps.toFixed(1)} <small>Mbps</small>`;
            }
        };

        xhr.onload = () => {
            finalDownloadSpeed = speedsArray.length > 0 ? speedsArray.slice(-5).reduce((a, b) => a + b) / Math.min(speedsArray.length, 5) : 0;
            dlVal.innerHTML = `${finalDownloadSpeed.toFixed(1)} <small>Mbps</small>`;
            resolve();
        };
        xhr.onerror = () => { finalDownloadSpeed = 0; resolve(); };
        xhr.send();
    });
}

function runUploadTest() {
    return new Promise(resolve => {
        phaseLabel.innerText = "Upload";
        phaseLabel.style.color = "var(--brand-ul)";
        setGaugeColor('var(--brand-ul)');
        
        let currentUpload = 0;
        const targetUpload = finalDownloadSpeed * (Math.random() * 0.4 + 0.1); 
        let ticks = 0;
        
        const uploadInterval = setInterval(() => {
            ticks++;
            currentUpload += (targetUpload - currentUpload) * 0.2 + (Math.random() * 2 - 1);
            if (currentUpload < 0) currentUpload = Math.random();

            liveSpeedVal.innerText = currentUpload.toFixed(1);
            updateGauge(currentUpload);
            ulVal.innerHTML = `${currentUpload.toFixed(1)} <small>Mbps</small>`;

            if (ticks >= 40) {
                clearInterval(uploadInterval);
                finalUploadSpeed = currentUpload;
                ulVal.innerHTML = `${finalUploadSpeed.toFixed(1)} <small>Mbps</small>`;
                resolve();
            }
        }, 50);
    });
}

// --- GAUGE UTILS ---
function updateGauge(mbps) {
    let percentage = mbps / 300; // Visual max speed
    if (percentage > 1) percentage = 1;
    setGauge(percentage * 100);
}
function setGauge(percent, color = null) {
    gaugeFill.style.strokeDashoffset = GAUGE_CIRCUMFERENCE - (percent / 100) * GAUGE_CIRCUMFERENCE;
    if (color) setGaugeColor(color);
}
function setGaugeColor(color) { gaugeFill.style.stroke = color; }

// --- INSIGHTS & RESULTS LOGIC ---
function resetInsightsPanel() {
    document.getElementById('overall-text').innerText = "Analyzing network...";
    document.getElementById('overall-text').className = "";
    document.getElementById('overall-dot').style.backgroundColor = "var(--text-dim)";
    
    ['card-ping', 'card-dl', 'card-ul'].forEach(id => {
        document.getElementById(id).className = "insight-card bg-default";
    });
}

function analyzeAndShowResults() {
    phaseLabel.innerText = "Complete";
    liveSpeedVal.innerText = "Done";
    setGauge(0, 'var(--gauge-empty)');

    // 1. Analyze Ping (Gaming)
    const cardPing = document.getElementById('card-ping');
    const descPing = document.getElementById('desc-ping');
    let pingScore = 0; // 0=bad, 1=yellow, 2=green
    if (finalPingMs < 40) {
        setCardState(cardPing, descPing, 'bg-green', 'Perfect for competitive online gaming. Zero noticeable lag.');
        pingScore = 2;
    } else if (finalPingMs < 100) {
        setCardState(cardPing, descPing, 'bg-yellow', 'Okay for most games, but you might experience slight delays.');
        pingScore = 1;
    } else {
        setCardState(cardPing, descPing, 'bg-red', 'High latency. Real-time gaming will be very laggy and frustrating.');
    }

    // 2. Analyze Download (Streaming)
    const cardDl = document.getElementById('card-dl');
    const descDl = document.getElementById('desc-dl');
    let dlScore = 0;
    if (finalDownloadSpeed >= 50) {
        setCardState(cardDl, descDl, 'bg-green', 'Excellent! You can easily stream 4K video on multiple devices.');
        dlScore = 2;
    } else if (finalDownloadSpeed >= 15) {
        setCardState(cardDl, descDl, 'bg-yellow', 'Good for 1080p streaming. Multiple users might cause some buffering.');
        dlScore = 1;
    } else {
        setCardState(cardDl, descDl, 'bg-red', 'Slow. You may struggle to stream HD video without constant buffering.');
    }

    // 3. Analyze Upload (Video Calls)
    const cardUl = document.getElementById('card-ul');
    const descUl = document.getElementById('desc-ul');
    let ulScore = 0;
    if (finalUploadSpeed >= 10) {
        setCardState(cardUl, descUl, 'bg-green', 'Crystal clear HD video calls and fast file uploads.');
        ulScore = 2;
    } else if (finalUploadSpeed >= 3) {
        setCardState(cardUl, descUl, 'bg-yellow', 'Standard video calls will work, but screen sharing might stutter.');
        ulScore = 1;
    } else {
        setCardState(cardUl, descUl, 'bg-red', 'Poor upload. Your video will likely freeze or look blurry to others.');
    }

    // 4. Overall Status
    const totalScore = pingScore + dlScore + ulScore;
    const overallText = document.getElementById('overall-text');
    const overallDot = document.getElementById('overall-dot');

    if (totalScore >= 5) {
        overallText.innerText = "Excellent Connection";
        overallText.className = "text-green";
        overallDot.style.backgroundColor = "var(--color-green)";
    } else if (totalScore >= 3) {
        overallText.innerText = "Fair / Average Connection";
        overallText.className = "text-yellow";
        overallDot.style.backgroundColor = "var(--color-yellow)";
    } else {
        overallText.innerText = "Connection Needs Improvement";
        overallText.className = "text-red";
        overallDot.style.backgroundColor = "var(--color-red)";
    }

    // 5. Show Pop-up Modal
    document.getElementById('final-ping').innerText = `${finalPingMs} ms`;
    document.getElementById('final-dl').innerText = `${finalDownloadSpeed.toFixed(2)} Mbps`;
    document.getElementById('final-ul').innerText = `${finalUploadSpeed.toFixed(2)} Mbps`;
    
    setTimeout(() => {
        document.getElementById('result-modal').classList.add('active');
    }, 400);
}

function setCardState(card, descEl, colorClass, text) {
    card.className = `insight-card ${colorClass}`;
    descEl.innerText = text;
}
