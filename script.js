// --- AUDIO ENGINE START ---
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
let isMuted = true;
const soundToggle = document.getElementById('soundToggle');
const soundIcon = document.querySelector('.sound-icon');

// Toggle Sound State
soundToggle.addEventListener('click', () => {
    isMuted = !isMuted;
    if (!isMuted) {
        if (audioCtx.state === 'suspended') audioCtx.resume();
        soundIcon.textContent = '🔊';
        soundToggle.style.borderColor = '#00f2ff';
        soundToggle.style.boxShadow = '0 0 10px #00f2ff';
        playClickSound(); // Feedback
    } else {
        soundIcon.textContent = '🔇';
        soundToggle.style.borderColor = '#333';
        soundToggle.style.boxShadow = 'none';
    }
});

// Generate Hover Sound (High pitch, short "chirp")
function playHoverSound() {
    if (isMuted) return;
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    // Sound Profile
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, audioCtx.currentTime); // Start high
    osc.frequency.exponentialRampToValueAtTime(1200, audioCtx.currentTime + 0.05); // Go higher

    // Volume Envelope
    gainNode.gain.setValueAtTime(0.05, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05);

    osc.start();
    osc.stop(audioCtx.currentTime + 0.05);
}

// Generate Click Sound (Lower pitch, mechanical "thud/zap")
function playClickSound() {
    if (isMuted) return;
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    // Sound Profile
    osc.type = 'square'; // Buzzier sound
    osc.frequency.setValueAtTime(200, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(50, audioCtx.currentTime + 0.1); // Drop pitch

    // Volume Envelope
    gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);

    osc.start();
    osc.stop(audioCtx.currentTime + 0.1);
}

// Attach Event Listeners
const interactiveElements = document.querySelectorAll('.hover-trigger, .glass-card, a, .cta-button');

interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', playHoverSound);
    el.addEventListener('click', playClickSound);
});
// --- AUDIO ENGINE END ---

// Preloader
window.addEventListener('load', () => {
    setTimeout(() => {
        document.querySelector('.preloader').style.opacity = '0';
        setTimeout(() => {
            document.querySelector('.preloader').style.display = 'none';
        }, 500);
    }, 2000);
});

// Scroll Progress Bar
window.addEventListener('scroll', () => {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    document.querySelector('.scroll-progress').style.width = scrolled + '%';
});

// Custom Cursor
const cursorOuter = document.querySelector('.cursor-outer');
const cursorInner = document.querySelector('.cursor-inner');

document.addEventListener('mousemove', (e) => {
    cursorInner.style.left = e.clientX + 'px';
    cursorInner.style.top = e.clientY + 'px';
    setTimeout(() => {
        cursorOuter.style.left = e.clientX + 'px';
        cursorOuter.style.top = e.clientY + 'px';
    }, 50);
});

document.querySelectorAll('a, .glass-card, .cta-button, .sound-toggle').forEach(el => {
    el.addEventListener('mouseenter', () => {
        cursorOuter.style.width = '60px';
        cursorOuter.style.height = '60px';
        cursorOuter.style.borderColor = 'transparent';
        cursorOuter.style.background = 'rgba(0, 242, 255, 0.1)';
    });
    el.addEventListener('mouseleave', () => {
        cursorOuter.style.width = '40px';
        cursorOuter.style.height = '40px';
        cursorOuter.style.borderColor = 'var(--primary)';
        cursorOuter.style.background = 'transparent';
    });
});

// Canvas Neural Network Animation
const canvas = document.getElementById('canvas-bg');
const ctx = canvas.getContext('2d');
let width, height;
let particles = [];
const particleCount = window.innerWidth < 768 ? 50 : 100;
const connectionDistance = 150;

function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}

class Particle {
    constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.size = Math.random() * 2 + 1;
    }
    update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 242, 255, 0.5)';
        ctx.fill();
    }
}

function initParticles() {
    particles = [];
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
}

function animate() {
    ctx.clearRect(0, 0, width, height);
    particles.forEach((p, index) => {
        p.update();
        p.draw();
        for (let i = index + 1; i < particles.length; i++) {
            const p2 = particles[i];
            const dx = p.x - p2.x;
            const dy = p.y - p2.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < connectionDistance) {
                ctx.beginPath();
                ctx.strokeStyle = `rgba(0, 242, 255, ${1 - distance / connectionDistance})`;
                ctx.lineWidth = 0.5;
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.stroke();
            }
        }
    });
    requestAnimationFrame(animate);
}

window.addEventListener('resize', () => { resize(); initParticles(); });
resize(); initParticles(); animate();

// Scroll Reveal
const revealElements = document.querySelectorAll('.scroll-reveal');
const reveal = () => {
    revealElements.forEach(el => {
        const elementTop = el.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        if (elementTop < windowHeight * 0.85) {
            el.classList.add('revealed');
        }
    });
}
window.addEventListener('scroll', reveal);
reveal();
