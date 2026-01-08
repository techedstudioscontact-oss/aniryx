// Initialize Lucide Icons
lucide.createIcons();

// ========================================
// 1. SCROLL REVEAL (Simple Fade In)
// ========================================

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: 0.1 });

// Initialize elements with hidden state
document.querySelectorAll('.section, .hero-content, .feature-card, .pricing-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    observer.observe(el);
});


// ========================================
// 2. BACKGROUND IMAGE SLIDER
// ========================================

let currentSlide = 0;
const slides = document.querySelectorAll('.bg-slide');
const totalSlides = slides.length;

function nextSlide() {
    slides[currentSlide].classList.remove('active');
    currentSlide = (currentSlide + 1) % totalSlides;
    slides[currentSlide].classList.add('active');
}

// Auto-advance slides every 6 seconds
let sliderInterval = setInterval(nextSlide, 6000);


// ========================================
// 3. CAROUSEL DRAG & INFINITE SCROLL
// ========================================

const track = document.querySelector('.screenshots-track');
const container = document.querySelector('.screenshots-container');

let isDragging = false;
let startPos = 0;
let animationID;
let currentScrollPosition = 0;
let scrollSpeed = 0.5; // Auto-scroll speed
let isHovering = false;

// Drag Events
container.addEventListener('mousedown', touchStart);
container.addEventListener('touchstart', touchStart);

container.addEventListener('mouseup', touchEnd);
container.addEventListener('mouseleave', () => {
    isDragging = false;
    isHovering = false;
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
    container.style.cursor = 'grab';
}

function touchMove(event) {
    if (isDragging) {
        event.preventDefault();
        const currentPosition = getPositionX(event);
        const diff = currentPosition - startPos;
        currentScrollPosition += diff;
        startPos = currentPosition;
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

    // Reset if we've scrolled past half (assuming content is doubled)
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

// Initialize Animation Loop
requestAnimationFrame(animation);
