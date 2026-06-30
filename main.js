// ============================================
// Trading meets Nervensystem — main.js
// ============================================

// ===== NAV: Scroll-Effekt =====
const nav = document.getElementById('nav');
if (nav) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      nav.classList.add('scrolled');
    } else {
      // Nur auf der Startseite transparent halten
      if (!document.body.classList.contains('subpage')) {
        nav.classList.remove('scrolled');
      }
    }
  }, { passive: true });
}

// ===== HAMBURGER MENU =====
const hamburger = document.getElementById('hamburger');
const navMobile = document.getElementById('nav-mobile');

if (hamburger && navMobile) {
  hamburger.addEventListener('click', () => {
    navMobile.classList.toggle('open');
    const isOpen = navMobile.classList.contains('open');
    hamburger.setAttribute('aria-expanded', isOpen);
  });

  // Schließen beim Klick außerhalb
  document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !navMobile.contains(e.target)) {
      navMobile.classList.remove('open');
    }
  });
}

// ===== SCROLL ANIMATIONS (Intersection Observer) =====
const fadeEls = document.querySelectorAll('.fade-up');

if (fadeEls.length > 0) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Gestaffelter Delay basierend auf Position in Gruppe
        const siblings = entry.target.parentElement.querySelectorAll('.fade-up');
        const idx = Array.from(siblings).indexOf(entry.target);
        const delay = Math.min(idx * 80, 300);
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay);
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  fadeEls.forEach(el => observer.observe(el));
}

// ===== ZÄHLER-ANIMATION =====
function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const duration = 1800;
  const start = performance.now();

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // Ease-out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target);
    if (progress < 1) requestAnimationFrame(update);
    else el.textContent = target;
  }

  requestAnimationFrame(update);
}

const counters = document.querySelectorAll('.counter');
if (counters.length > 0) {
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => counterObserver.observe(el));
}

// ===== FAQ ACCORDION =====
function toggleFaq(questionEl) {
  const answer = questionEl.nextElementSibling;
  const isOpen = questionEl.classList.contains('open');

  // Alle anderen schließen
  document.querySelectorAll('.faq-question.open').forEach(q => {
    if (q !== questionEl) {
      q.classList.remove('open');
      q.nextElementSibling.style.maxHeight = '0';
    }
  });

  // Aktuellen togglen
  if (isOpen) {
    questionEl.classList.remove('open');
    answer.style.maxHeight = '0';
  } else {
    questionEl.classList.add('open');
    answer.style.maxHeight = answer.scrollHeight + 'px';
  }
}

// ===== KONTAKTFORMULAR (Formspree) =====
document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('contact-form');
  if (form) form.setAttribute('data-loaded', Date.now());
});

function submitForm(e) {
  e.preventDefault();
  const form = document.getElementById('contact-form');
  const success = document.getElementById('form-success');

  if (!form || !success) return;

  const honeypot = form.querySelector('input[name="_gotcha"]');
  if (honeypot && honeypot.value) return;

  const loadTime = parseInt(form.getAttribute('data-loaded') || '0');
  if (Date.now() - loadTime < 2000) return;

  const btn = form.querySelector('button[type="submit"]');
  const originalText = btn.innerHTML;
  btn.innerHTML = 'Wird gesendet…';
  btn.disabled = true;

  fetch('https://formspree.io/f/mlgvzbdy', {
    method: 'POST',
    body: new FormData(form),
    headers: { 'Accept': 'application/json' }
  })
  .then(response => {
    if (response.ok) {
      form.style.display = 'none';
      success.style.display = 'block';
    } else {
      return response.json().then(data => {
        throw new Error(data.errors ? data.errors.map(e => e.message).join(', ') : 'Fehler beim Senden.');
      });
    }
  })
  .catch(() => {
    btn.innerHTML = originalText;
    btn.disabled = false;
    alert('Nachricht konnte nicht gesendet werden. Bitte schreib direkt an kristina@tradingmeetsnervensystem.de');
  });
}

// ===== SMOOTH SCROLL für Anker-Links =====
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const href = link.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h'), 10) || 72;
      const top = target.getBoundingClientRect().top + window.scrollY - navH - 16;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});
