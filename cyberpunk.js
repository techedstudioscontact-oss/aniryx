// Initialize Lucide Icons
lucide.createIcons();

// ========================================
// 1. CUSTOM CURSOR & MAGNETIC BUTTONS
// ========================================

const cursorDot = document.getElementById('cursor-dot');
const cursorOutline = document.getElementById('cursor-outline');
const interactables = document.querySelectorAll('.interactable');

window.addEventListener('mousemove', (e) => {
    const posX = e.clientX;
    const posY = e.clientY;

    // Move Dot instantly
    cursorDot.style.left = `${posX}px`;
    cursorDot.style.top = `${posY}px`;

    // Move Outline with slight delay/smoothing via CSS
    cursorOutline.style.transform = `translate(${posX}px, ${posY}px) translate(-50%, -50%)`;
});

// Hover States
interactables.forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('hovering'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('hovering'));
});

// Magnetic Effect on Buttons
const magnets = document.querySelectorAll('.btn-magnetic');
magnets.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Calculate distance from center
        const xPos = x - rect.width / 2;
        const yPos = y - rect.height / 2;

        // Apply simple magnetic pull
        btn.style.transform = `translate(${xPos * 0.2}px, ${yPos * 0.2}px)`;
    });

    btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate(0, 0)';
    });
});

// ========================================
// 2. SCROLL PROGRESS BAR
// ========================================

window.addEventListener('scroll', () => {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    document.getElementById('scroll-progress').style.width = scrolled + "%";
});

// ========================================
// 3. HACKER TEXT EFFECT
// ========================================

const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
const h1 = document.getElementById("hacker-text");

let interval = null;

// Run on load
window.onload = () => {
    let iteration = 0;
    clearInterval(interval);

    interval = setInterval(() => {
        h1.innerText = h1.innerText
            .split("")
            .map((letter, index) => {
                if (index < iteration) {
                    return h1.dataset.value[index];
                }
                return letters[Math.floor(Math.random() * 36)];
            })
            .join("");

        if (iteration >= h1.dataset.value.length) {
            clearInterval(interval);
        }

        iteration += 1 / 3;
    }, 30);
};

// ========================================
// 4. HOLO CARD MOUSE TRACKING
// ========================================

function handleCardHover(e) {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);
}

// ========================================
// 5. SCROLL REVEAL
// ========================================

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// ========================================
// 6. BACKGROUND IMAGE SLIDER
// ========================================

let currentSlide = 0;
const slides = document.querySelectorAll('.bg-slide');
const totalSlides = slides.length;

function nextSlide() {
    slides[currentSlide].classList.remove('active');
    currentSlide = (currentSlide + 1) % totalSlides;
    slides[currentSlide].classList.add('active');
}

// Auto-advance slides every 5 seconds
setInterval(nextSlide, 5000);

// Optional: Pause slider on hover
const bgSlider = document.querySelector('.bg-slider');
let sliderInterval;

function startSlider() {
    sliderInterval = setInterval(nextSlide, 5000);
}

function stopSlider() {
    clearInterval(sliderInterval);
}

bgSlider.addEventListener('mouseenter', stopSlider);
bgSlider.addEventListener('mouseleave', startSlider);

// ========================================
// 7. CAROUSEL DRAG & INFINITE SCROLL
// ========================================

const track = document.querySelector('.screenshots-track');
const container = document.querySelector('.screenshots-container');

let isDragging = false;
let startPos = 0;
let currentTranslate = 0;
let prevTranslate = 0;
let animationID;
let currentScrollPosition = 0;
let scrollSpeed = 0.5; // Auto-scroll speed
let isHovering = false;

// Remove CSS animation to take control via JS
track.style.animation = 'none';

// Load handling: Ensure we have correct widths
window.addEventListener('load', () => {
    // Clone items if needed for smoother infinite loop (already done in HTML but good to know)
    requestAnimationFrame(animation);
});

// Drag Events
container.addEventListener('mousedown', touchStart);
container.addEventListener('touchstart', touchStart);

container.addEventListener('mouseup', touchEnd);
container.addEventListener('mouseleave', () => {
    isDragging = false;
    isHovering = false;
    const cards = document.querySelectorAll('.screenshot-card');
    cards.forEach(card => card.style.transform = 'scale(1)'); // Reset scale
});
container.addEventListener('touchend', touchEnd);

container.addEventListener('mousemove', touchMove);
container.addEventListener('touchmove', touchMove);

// Hover Pause
container.addEventListener('mouseenter', () => {
    isHovering = true;
});

function touchStart(event) {
    isDragging = true;
    isHovering = true; // Pause auto-scroll while dragging
    startPos = getPositionX(event);
    animationID = requestAnimationFrame(animation);
    container.style.cursor = 'grabbing';
}

function touchEnd() {
    isDragging = false;
    // cancelAnimationFrame(animationID); // Don't cancel, we want the loop to continue for auto-scroll check
    container.style.cursor = 'grab';

    // Resume auto-scroll naturally in animation loop
}

function touchMove(event) {
    if (isDragging) {
        event.preventDefault(); // Prevent text selection/scrolling page
        const currentPosition = getPositionX(event);
        const diff = currentPosition - startPos;
        currentScrollPosition += diff;
        startPos = currentPosition; // Reset start to prevent acceleration
    }
}

function getPositionX(event) {
    return event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;
}

function animation() {
    // Determine movement
    if (!isDragging && !isHovering) {
        currentScrollPosition -= scrollSpeed;
    }

    // Infinite Loop Logic
    const trackWidth = track.scrollWidth;
    const containerWidth = container.clientWidth;

    // We assume the track has duplicated items. 
    // If text scrolled too far left (negative), reset
    // This requires knowing the width of original set vs duplicates
    // Standard hack: When we scroll past half the track, reset
    // Assuming track content is effectively doubled

    if (Math.abs(currentScrollPosition) >= trackWidth / 2) {
        currentScrollPosition = 0;
    }

    // Also handle dragging to the right (positive)
    if (currentScrollPosition > 0) {
        currentScrollPosition = -trackWidth / 2;
    }

    setSliderPosition();
    requestAnimationFrame(animation);
}

function setSliderPosition() {
    track.style.transform = `translateX(${currentScrollPosition}px)`;
}

// Initialize
requestAnimationFrame(animation);
