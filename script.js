// ============================================
// WEB SECURITY TESTING SCRIPT
// Untuk pengujian web pribadi saja
// ============================================

console.log('%c🔍 Starting Web Security Analysis...', 'color: #00ff00; font-size: 16px; font-weight: bold');

// 1. INFORMASI DASAR WEBSITE
console.log('\n%c📋 BASIC INFORMATION', 'color: #00d4ff; font-size: 14px; font-weight: bold');
console.log('━'.repeat(50));
console.log('URL:', window.location.href);
console.log('Protocol:', window.location.protocol);
console.log('Hostname:', window.location.hostname);
console.log('Port:', window.location.port || 'default');
console.log('Path:', window.location.pathname);
console.log('Origin:', window.location.origin);

// 2. DETEKSI TEKNOLOGI & FRAMEWORK
console.log('\n%c🛠️ TECHNOLOGY DETECTION', 'color: #00d4ff; font-size: 14px; font-weight: bold');
console.log('━'.repeat(50));

const techStack = {
    'React': typeof React !== 'undefined',
    'Vue': typeof Vue !== 'undefined',
    'Angular': typeof angular !== 'undefined' || typeof ng !== 'undefined',
    'jQuery': typeof jQuery !== 'undefined',
    'Next.js': typeof __NEXT_DATA__ !== 'undefined',
    'Nuxt': typeof __NUXT__ !== 'undefined',
    'WordPress': document.body.classList.contains('wordpress') || !!document.querySelector('meta[name="generator"][content*="WordPress"]'),
    'Shopify': typeof Shopify !== 'undefined',
    'Google Analytics': !!document.querySelector('script[src*="google-analytics"]') || typeof ga !== 'undefined',
    'Google Tag Manager': typeof dataLayer !== 'undefined',
};

Object.entries(techStack).forEach(([tech, detected]) => {
    if (detected) console.log(`✅ ${tech} detected`);
});

// 3. ANALISIS COOKIES
console.log('\n%c🍪 COOKIES ANALYSIS', 'color: #00d4ff; font-size: 14px; font-weight: bold');
console.log('━'.repeat(50));
const cookies = document.cookie.split(';').map(c => c.trim()).filter(c => c);
console.log(`Total Cookies: ${cookies.length}`);
cookies.forEach(cookie => {
    const [name, value] = cookie.split('=');
    console.log(`  • ${name}: ${value?.substring(0, 50)}${value?.length > 50 ? '...' : ''}`);
});

// 4. LOCAL & SESSION STORAGE
console.log('\n%c💾 STORAGE ANALYSIS', 'color: #00d4ff; font-size: 14px; font-weight: bold');
console.log('━'.repeat(50));
console.log(`LocalStorage items: ${localStorage.length}`);
for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    const value = localStorage.getItem(key);
    console.log(`  • ${key}: ${value?.substring(0, 50)}${value?.length > 50 ? '...' : ''}`);
}

console.log(`\nSessionStorage items: ${sessionStorage.length}`);
for (let i = 0; i < sessionStorage.length; i++) {
    const key = sessionStorage.key(i);
    const value = sessionStorage.getItem(key);
    console.log(`  • ${key}: ${value?.substring(0, 50)}${value?.length > 50 ? '...' : ''}`);
}

// 5. API ENDPOINTS DETECTION
console.log('\n%c🔌 API ENDPOINTS DETECTION', 'color: #00d4ff; font-size: 14px; font-weight: bold');
console.log('━'.repeat(50));

const apiEndpoints = new Set();
const originalFetch = window.fetch;
const originalXHR = window.XMLHttpRequest.prototype.open;

// Intercept Fetch
window.fetch = function(...args) {
    const url = args[0];
    apiEndpoints.add(url);
    console.log(`📡 Fetch detected: ${url}`);
    return originalFetch.apply(this, args);
};

// Intercept XHR
window.XMLHttpRequest.prototype.open = function(method, url) {
    apiEndpoints.add(url);
    console.log(`📡 XHR detected: ${method} ${url}`);
    return originalXHR.apply(this, arguments);
};

console.log('✅ API monitoring active. Interact with the page to detect endpoints.');

// 6. FORMS ANALYSIS
console.log('\n%c📝 FORMS ANALYSIS', 'color: #00d4ff; font-size: 14px; font-weight: bold');
console.log('━'.repeat(50));
const forms = document.querySelectorAll('form');
console.log(`Total Forms: ${forms.length}`);
forms.forEach((form, idx) => {
    console.log(`\nForm #${idx + 1}:`);
    console.log(`  Action: ${form.action || 'none'}`);
    console.log(`  Method: ${form.method || 'GET'}`);
    console.log(`  Inputs: ${form.querySelectorAll('input').length}`);
    
    const inputs = form.querySelectorAll('input');
    inputs.forEach(input => {
        console.log(`    - ${input.type}: ${input.name || input.id || 'unnamed'}`);
    });
});

// 7. HEADERS ANALYSIS (dari network request)
console.log('\n%c📊 HEADERS INFO', 'color: #00d4ff; font-size: 14px; font-weight: bold');
console.log('━'.repeat(50));
console.log('ℹ️  Check Network tab for detailed headers');
console.log('Common headers to check:');
console.log('  • X-Powered-By');
console.log('  • Server');
console.log('  • X-Frame-Options');
console.log('  • Content-Security-Policy');
console.log('  • Strict-Transport-Security');

// 8. GLOBAL VARIABLES & OBJECTS
console.log('\n%c🌐 GLOBAL OBJECTS ANALYSIS', 'color: #00d4ff; font-size: 14px; font-weight: bold');
console.log('━'.repeat(50));
const suspiciousGlobals = [];
for (let prop in window) {
    if (window.hasOwnProperty(prop)) {
        const value = window[prop];
        if (typeof value === 'object' && value !== null) {
            if (prop.toLowerCase().includes('api') || 
                prop.toLowerCase().includes('config') || 
                prop.toLowerCase().includes('env') ||
                prop.toLowerCase().includes('secret') ||
                prop.toLowerCase().includes('token')) {
                suspiciousGlobals.push(prop);
            }
        }
    }
}
console.log('Potentially interesting global objects:');
suspiciousGlobals.forEach(global => {
    console.log(`  • window.${global}`, window[global]);
});

// 9. SECURITY HEADERS CHECK
console.log('\n%c🔒 SECURITY CHECKS', 'color: #00d4ff; font-size: 14px; font-weight: bold');
console.log('━'.repeat(50));

// HTTPS Check
const isHTTPS = window.location.protocol === 'https:';
console.log(`${isHTTPS ? '✅' : '❌'} HTTPS: ${isHTTPS ? 'Enabled' : 'Disabled'}`);

// Mixed Content Check
const hasHTTPResources = Array.from(document.querySelectorAll('script, img, link')).some(el => {
    const src = el.src || el.href;
    return src && src.startsWith('http:');
});
console.log(`${hasHTTPResources ? '⚠️' : '✅'} Mixed Content: ${hasHTTPResources ? 'Found' : 'None'}`);

// 10. SCRIPT TAGS ANALYSIS
console.log('\n%c📜 EXTERNAL SCRIPTS', 'color: #00d4ff; font-size: 14px; font-weight: bold');
console.log('━'.repeat(50));
const scripts = document.querySelectorAll('script[src]');
console.log(`Total External Scripts: ${scripts.length}`);
scripts.forEach((script, idx) => {
    console.log(`  ${idx + 1}. ${script.src}`);
});

// 11. WEBSOCKET DETECTION
console.log('\n%c🔌 WEBSOCKET DETECTION', 'color: #00d4ff; font-size: 14px; font-weight: bold');
console.log('━'.repeat(50));
const originalWebSocket = window.WebSocket;
window.WebSocket = function(url, protocols) {
    console.log(`🔌 WebSocket connection: ${url}`);
    return new originalWebSocket(url, protocols);
};

// 12. EXPORT SUMMARY
console.log('\n%c📦 EXPORT DATA', 'color: #00d4ff; font-size: 14px; font-weight: bold');
console.log('━'.repeat(50));

const summary = {
    url: window.location.href,
    hostname: window.location.hostname,
    protocol: window.location.protocol,
    port: window.location.port,
    technologies: Object.entries(techStack).filter(([_, v]) => v).map(([k]) => k),
    cookies: cookies.length,
    localStorage: localStorage.length,
    sessionStorage: sessionStorage.length,
    forms: forms.length,
    scripts: scripts.length,
    isHTTPS: isHTTPS,
    hasMixedContent: hasHTTPResources,
    timestamp: new Date().toISOString()
};

console.log('Summary Object:', summary);
console.log('\n💾 To save this data, run: copy(summary)');

console.log('\n%c✅ Analysis Complete!', 'color: #00ff00; font-size: 16px; font-weight: bold');
console.log('%c⚠️  Remember: Use this only on websites you own or have permission to test!', 'color: #ffaa00; font-size: 12px;');
