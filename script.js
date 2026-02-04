// ===== Navbar Scroll Effect =====
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// ===== Mobile Navigation =====
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  navToggle.classList.toggle('active');
});

// Close mobile nav when clicking a link
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.classList.remove('active');
  });
});

// ===== Scroll Animations (Intersection Observer) =====
const animatedElements = document.querySelectorAll('[data-animate]');

const observerOptions = {
  root: null,
  rootMargin: '0px 0px -60px 0px',
  threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, index) => {
    if (entry.isIntersecting) {
      // Stagger the animation for sibling elements
      const siblings = entry.target.parentElement.querySelectorAll('[data-animate]');
      const siblingIndex = Array.from(siblings).indexOf(entry.target);
      const delay = siblingIndex * 100;

      setTimeout(() => {
        entry.target.classList.add('visible');
      }, delay);

      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

animatedElements.forEach(el => observer.observe(el));

// ===== Counter Animation =====
const counters = document.querySelectorAll('.stat-number');

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const target = parseInt(entry.target.getAttribute('data-target'));
      animateCounter(entry.target, target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

counters.forEach(counter => counterObserver.observe(counter));

function animateCounter(element, target) {
  const duration = 2000;
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    // Ease-out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(eased * target);

    element.textContent = current.toLocaleString();

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}

// ===== Testimonial Slider =====
const testimonialCards = document.querySelectorAll('.testimonial-card');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const dotsContainer = document.getElementById('sliderDots');
let currentSlide = 0;

// Create dots
testimonialCards.forEach((_, index) => {
  const dot = document.createElement('button');
  dot.classList.add('slider-dot');
  dot.setAttribute('aria-label', `Go to testimonial ${index + 1}`);
  if (index === 0) dot.classList.add('active');
  dot.addEventListener('click', () => goToSlide(index));
  dotsContainer.appendChild(dot);
});

function goToSlide(index) {
  const direction = index > currentSlide ? 1 : -1;

  testimonialCards[currentSlide].classList.remove('active');
  testimonialCards[currentSlide].classList.add(direction > 0 ? 'exit-left' : '');

  setTimeout(() => {
    testimonialCards[currentSlide].classList.remove('exit-left');
  }, 500);

  currentSlide = index;
  testimonialCards[currentSlide].classList.add('active');

  // Update dots
  document.querySelectorAll('.slider-dot').forEach((dot, i) => {
    dot.classList.toggle('active', i === currentSlide);
  });
}

prevBtn.addEventListener('click', () => {
  const newIndex = currentSlide === 0 ? testimonialCards.length - 1 : currentSlide - 1;
  goToSlide(newIndex);
});

nextBtn.addEventListener('click', () => {
  const newIndex = currentSlide === testimonialCards.length - 1 ? 0 : currentSlide + 1;
  goToSlide(newIndex);
});

// Auto-advance testimonials
let autoSlide = setInterval(() => {
  const newIndex = currentSlide === testimonialCards.length - 1 ? 0 : currentSlide + 1;
  goToSlide(newIndex);
}, 5000);

// Pause on hover
const slider = document.getElementById('testimonialSlider');
slider.addEventListener('mouseenter', () => clearInterval(autoSlide));
slider.addEventListener('mouseleave', () => {
  autoSlide = setInterval(() => {
    const newIndex = currentSlide === testimonialCards.length - 1 ? 0 : currentSlide + 1;
    goToSlide(newIndex);
  }, 5000);
});

// ===== FAQ Accordion =====
const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
  const question = item.querySelector('.faq-question');
  question.addEventListener('click', () => {
    const isOpen = item.classList.contains('open');

    // Close all
    faqItems.forEach(i => i.classList.remove('open'));

    // Toggle clicked
    if (!isOpen) {
      item.classList.add('open');
    }
  });
});

// ===== Form Submission =====
const signupForm = document.getElementById('signupForm');

signupForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const firstName = document.getElementById('firstName').value.trim();
  const email = document.getElementById('email').value.trim();

  if (!firstName || !email) return;

  // Show success feedback
  const btn = signupForm.querySelector('button[type="submit"]');
  const originalText = btn.textContent;
  btn.textContent = 'You\'re In!';
  btn.style.background = '#27ae60';
  btn.disabled = true;

  // Reset form
  signupForm.reset();

  setTimeout(() => {
    btn.textContent = originalText;
    btn.style.background = '';
    btn.disabled = false;
  }, 3000);
});

// ===== Smooth scroll for anchor links =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 80; // account for fixed navbar
      const targetPosition = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  });
});
