// ─── Share button ───────────────────────────────────
const shareButton = document.querySelector('[data-share]');

if (shareButton) {
  shareButton.addEventListener('click', async () => {
    const shareData = {
      title: 'Dra. Debora Gouveia',
      text: 'Contato profissional da Dra. Debora Gouveia, Medicina Veterinária Integrativa.',
      url: window.location.href,
    };

    if (navigator.share) {
      try { await navigator.share(shareData); } catch {}
      return;
    }

    try { await navigator.clipboard.writeText(window.location.href); } catch {}
    const original = shareButton.textContent;
    shareButton.textContent = '✓ Link copiado';
    setTimeout(() => { shareButton.textContent = original; }, 2200);
  });
}

// ─── Photo slider ────────────────────────────────────
const slider = document.querySelector('[data-slider]');

if (slider) {
  const track       = slider.querySelector('[data-slider-track]');
  const slides      = Array.from(slider.querySelectorAll('.slider__slide'));
  const prevBtn     = slider.querySelector('[data-slider-prev]');
  const nextBtn     = slider.querySelector('[data-slider-next]');
  const dotsWrap    = slider.querySelector('[data-slider-dots]');
  const viewport    = slider.querySelector('.slider__viewport');
  let current       = 0;
  let autoplayTimer = null;

  // Build dots
  const dots = slides.map((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'slider__dot';
    dot.type = 'button';
    dot.setAttribute('aria-label', `Ir para foto ${i + 1}`);
    dot.addEventListener('click', () => { goTo(i); resetAutoplay(); });
    dotsWrap.appendChild(dot);
    return dot;
  });

  function goTo(index) {
    current = ((index % slides.length) + slides.length) % slides.length;
    track.style.transform = `translateX(-${current * 100}%)`;
    dots.forEach((dot, i) =>
      dot.setAttribute('aria-current', i === current ? 'true' : 'false')
    );
  }

  function resetAutoplay() {
    clearInterval(autoplayTimer);
    autoplayTimer = setInterval(() => goTo(current + 1), 4500);
  }

  prevBtn.addEventListener('click', () => { goTo(current - 1); resetAutoplay(); });
  nextBtn.addEventListener('click', () => { goTo(current + 1); resetAutoplay(); });

  // Touch / pointer swipe
  let dragStartX   = 0;
  let dragStartTime = 0;
  let dragging     = false;

  viewport.addEventListener('pointerdown', (e) => {
    dragging      = true;
    dragStartX    = e.clientX;
    dragStartTime = Date.now();
    viewport.setPointerCapture(e.pointerId);
  }, { passive: true });

  viewport.addEventListener('pointerup', (e) => {
    if (!dragging) return;
    dragging = false;
    const dx = e.clientX - dragStartX;
    const dt = Date.now() - dragStartTime;
    if (Math.abs(dx) > 40 || (Math.abs(dx) > 20 && dt < 300)) {
      goTo(dx < 0 ? current + 1 : current - 1);
      resetAutoplay();
    }
  }, { passive: true });

  viewport.addEventListener('pointercancel', () => { dragging = false; });

  // Pause autoplay on hover
  slider.addEventListener('mouseenter', () => clearInterval(autoplayTimer));
  slider.addEventListener('mouseleave', resetAutoplay);

  goTo(0);
  resetAutoplay();
}

// ─── Scroll reveal ───────────────────────────────────
const revealItems = document.querySelectorAll('.reveal-section');

if (revealItems.length && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.08, rootMargin: '0px 0px -30px 0px' }
  );

  revealItems.forEach((el) => observer.observe(el));
}
