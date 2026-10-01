/**
 * Nallayil Ayurveda - Core Client Scripts
 * High-Performance, Mobile-Optimized, Polished Experience
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Core Features
  initHeroSlider();
  initHeaderScroll();
  initMobileNav();
  initPatientStoriesAndReviews();
  
  initCounters();
  initTrustCounters();
  initFAQ();
  initTestimonialsSlider();
  renderDynamicOffers();
  renderDynamicGallery();
  initTreatmentsFilter();
  initModals();
  initScrollReveal();
  initDynamicJournalCMS();
  initNallayilCareSystem();
  initTreatmentsPageSync();
  initBookingFieldsSync();
  initBookingTreatmentAutoFilter();

  // Listen for admin changes via custom events
  window.addEventListener('nallayil_offers_updated', renderDynamicOffers);
  window.addEventListener('nallayil_gallery_updated', renderDynamicGallery);
});

/* --------------------------------------------------------------------------
   1. Hero Slider: Dual Slide (English / Malayalam) One-by-One Sliding (Desktop & Mobile)
   -------------------------------------------------------------------------- */
function initHeroSlider() {
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.indicator-dot');
  const prevBtn = document.getElementById('sliderPrevBtn');
  const nextBtn = document.getElementById('sliderNextBtn');

  if (!slides.length) return;

  let currentIndex = 0;
  let autoplayTimer = null;
  const slideDuration = 6500; // 6.5s per slide

  function goToSlide(index) {
    if (index < 0) index = slides.length - 1;
    if (index >= slides.length) index = 0;

    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === index);
    });

    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === index);
    });

    currentIndex = index;
  }

  function nextSlide() {
    goToSlide(currentIndex + 1);
  }

  function prevSlide() {
    goToSlide(currentIndex - 1);
  }

  function startAutoplay() {
    stopAutoplay();
    autoplayTimer = setInterval(nextSlide, slideDuration);
  }

  function stopAutoplay() {
    if (autoplayTimer) {
      clearInterval(autoplayTimer);
      autoplayTimer = null;
    }
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      stopAutoplay();
      nextSlide();
      startAutoplay();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      stopAutoplay();
      prevSlide();
      startAutoplay();
    });
  }

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      stopAutoplay();
      goToSlide(i);
      startAutoplay();
    });
  });

  // Mobile Touch Swipe gesture support
  const heroSection = document.getElementById('home');
  if (heroSection) {
    let touchStartX = 0;
    heroSection.addEventListener('touchstart', (e) => {
      if (e.touches && e.touches.length) touchStartX = e.touches[0].clientX;
    }, { passive: true });

    heroSection.addEventListener('touchend', (e) => {
      if (e.changedTouches && e.changedTouches.length) {
        const touchEndX = e.changedTouches[0].clientX;
        const diffX = touchStartX - touchEndX;
        if (Math.abs(diffX) > 40) {
          stopAutoplay();
          if (diffX > 0) {
            nextSlide();
          } else {
            prevSlide();
          }
          startAutoplay();
        }
      }
    }, { passive: true });
  }

  startAutoplay();
}

/* --------------------------------------------------------------------------
   2. Header Scroll Transformation
   -------------------------------------------------------------------------- */
function initHeaderScroll() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const onScroll = () => {
    if (window.scrollY > 30) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* --------------------------------------------------------------------------
   3. Header Expanding Menu (Always Visible Three Lines Toggle)
   -------------------------------------------------------------------------- */
function initMobileNav() {
  const header = document.querySelector('.site-header');
  const toggleBtn = document.getElementById('mobileMenuToggle') || document.querySelector('.mobile-toggle');

  if (!header || !toggleBtn) return;

  function toggleMenu(e) {
    if (e) e.stopPropagation();
    const isExpanded = header.classList.toggle('is-expanded');
    toggleBtn.classList.toggle('is-active', isExpanded);
    toggleBtn.setAttribute('aria-expanded', isExpanded ? 'true' : 'false');
  }

  function closeMenu() {
    if (header.classList.contains('is-expanded')) {
      header.classList.remove('is-expanded');
      toggleBtn.classList.remove('is-active');
      toggleBtn.setAttribute('aria-expanded', 'false');
    }
  }

  toggleBtn.addEventListener('click', toggleMenu);

  // Close when clicking any link inside the expanded header
  const mobileLinks = header.querySelectorAll('.mobile-nav-link, .btn-header-cta, .mobile-wa-btn');
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      setTimeout(closeMenu, 180);
    });
  });

  // Close when clicking outside the floating header
  document.addEventListener('click', (e) => {
    if (!header.contains(e.target)) {
      closeMenu();
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeMenu();
    }
  });
}

/* --------------------------------------------------------------------------
   4 & 5. Patient Stories & Reviews: Soft Slow Auto-Scroll & Manual Scroll
   -------------------------------------------------------------------------- */
function initAutoAndManualScroll(wrapperId, speed = 0.55) {
  const wrapper = document.getElementById(wrapperId);
  if (!wrapper) return;

  const track = wrapper.querySelector('.smooth-scroll-track');
  if (!track) return;

  let isPaused = false;
  let isDown = false;
  let startX = 0;
  let scrollLeftStart = 0;
  let resumeTimeout = null;

  // Soft, smooth, continuous auto-scroll step
  function autoScrollStep() {
    if (!isPaused && !isDown) {
      wrapper.scrollLeft += speed;
      const half = track.scrollWidth / 2;
      if (half > 0 && wrapper.scrollLeft >= half) {
        wrapper.scrollLeft -= half;
      }
    }
    requestAnimationFrame(autoScrollStep);
  }
  requestAnimationFrame(autoScrollStep);

  // Pause on mouse hover (so user can watch, focus & zoom)
  wrapper.addEventListener('mouseenter', () => {
    isPaused = true;
  });

  wrapper.addEventListener('mouseleave', () => {
    if (!isDown) {
      isPaused = false;
    }
  });

  // Manual wheel/trackpad horizontal scroll support
  wrapper.addEventListener('wheel', (e) => {
    isPaused = true;
    clearTimeout(resumeTimeout);
    resumeTimeout = setTimeout(() => {
      isPaused = false;
    }, 2200);
  }, { passive: true });

  // Touch swipe support on mobile devices
  wrapper.addEventListener('touchstart', () => {
    isPaused = true;
    clearTimeout(resumeTimeout);
  }, { passive: true });

  wrapper.addEventListener('touchend', () => {
    clearTimeout(resumeTimeout);
    resumeTimeout = setTimeout(() => {
      isPaused = false;
    }, 2200);
  }, { passive: true });

  // Desktop click & drag to manual scroll
  wrapper.addEventListener('mousedown', (e) => {
    if (e.target.tagName === 'IFRAME' || e.target.tagName === 'A' || e.target.closest('iframe')) return;
    isDown = true;
    isPaused = true;
    wrapper.classList.add('grabbing');
    startX = e.pageX - wrapper.offsetLeft;
    scrollLeftStart = wrapper.scrollLeft;
  });

  window.addEventListener('mouseup', () => {
    if (isDown) {
      isDown = false;
      wrapper.classList.remove('grabbing');
      clearTimeout(resumeTimeout);
      resumeTimeout = setTimeout(() => {
        isPaused = false;
      }, 2200);
    }
  });

  wrapper.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - wrapper.offsetLeft;
    const walk = (x - startX) * 1.4;
    wrapper.scrollLeft = scrollLeftStart - walk;

    const half = track.scrollWidth / 2;
    if (half > 0) {
      if (wrapper.scrollLeft >= half) {
        wrapper.scrollLeft -= half;
        scrollLeftStart -= half;
      } else if (wrapper.scrollLeft <= 0) {
        wrapper.scrollLeft += half;
        scrollLeftStart += half;
      }
    }
  });
}

function initPatientStoriesAndReviews() {
  initAutoAndManualScroll('videoScrollWrapper', 0.55);
  initAutoAndManualScroll('reviewScrollWrapper', 0.45);
}

/* --------------------------------------------------------------------------
   6. Animated Number Counters
   -------------------------------------------------------------------------- */
function initCounters() {
  const counters = document.querySelectorAll('.stat-number');
  if (!counters.length) return;

  let started = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !started) {
        started = true;
        counters.forEach(counter => {
          const target = +counter.getAttribute('data-target') || 0;
          const suffix = counter.getAttribute('data-suffix') || '';
          let count = 0;
          const speed = target > 1000 ? 50 : 25;
          const increment = Math.ceil(target / speed);

          const updateCount = () => {
            count += increment;
            if (count >= target) {
              counter.textContent = target.toLocaleString('en-IN') + suffix;
            } else {
              counter.textContent = count.toLocaleString('en-IN') + suffix;
              setTimeout(updateCount, 30);
            }
          };
          updateCount();
        });
      }
    });
  }, { threshold: 0.2 });

  const statsSection = document.querySelector('.stats-banner') || document.querySelector('#stats');
  if (statsSection) observer.observe(statsSection);
}

/* --------------------------------------------------------------------------
   7. FAQ Accordion
   -------------------------------------------------------------------------- */
function initFAQ() {
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    if (!question || !answer) return;

    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      faqItems.forEach(other => {
        other.classList.remove('active');
        const otherAnswer = other.querySelector('.faq-answer');
        if (otherAnswer) otherAnswer.style.maxHeight = null;
      });

      if (!isActive) {
        item.classList.add('active');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });
}

/* --------------------------------------------------------------------------
   8. Testimonials Slider
   -------------------------------------------------------------------------- */
function initTestimonialsSlider() {
  const slides = document.querySelectorAll('.testimonial-card, .testimonial-card-wrap');
  const prevBtn = document.querySelector('.slider-prev');
  const nextBtn = document.querySelector('.slider-next');

  if (!slides.length) return;

  let currentSlide = 0;
  let autoTimer = null;

  function showSlide(index) {
    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === index);
    });
    currentSlide = index;
  }

  function nextSlide() {
    let next = (currentSlide + 1) % slides.length;
    showSlide(next);
  }

  function prevSlide() {
    let prev = (currentSlide - 1 + slides.length) % slides.length;
    showSlide(prev);
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      clearInterval(autoTimer);
      nextSlide();
      startAuto();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      clearInterval(autoTimer);
      prevSlide();
      startAuto();
    });
  }

  function startAuto() {
    autoTimer = setInterval(nextSlide, 7500);
  }

  startAuto();
}

/* --------------------------------------------------------------------------
   9. Dynamic Offers Rendering
   -------------------------------------------------------------------------- */
function renderDynamicOffers() {
  const offersGrid = document.getElementById('dynamic-offers-grid');
  if (!offersGrid) return;

  const offers = window.NallayilStore ? window.NallayilStore.getOffers() : (window.NALLAYIL_DATA ? window.NALLAYIL_DATA.initialOffers : []);

  if (!offers || offers.length === 0) {
    offersGrid.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 44px; background: var(--bg-soft); border-radius: var(--radius-lg); border: 1px dashed var(--border-green);">
        <p style="color: var(--text-muted); font-size: 1rem;">No active promotional packages at this moment. Please contact us directly on WhatsApp for personalized wellness inquiries.</p>
      </div>
    `;
    return;
  }

  offersGrid.innerHTML = offers.map(off => `
    <div class="offer-card">
      <div class="offer-image-wrap">
        <span class="offer-badge">${off.badge || 'WELLNESS PACKAGE'}</span>
        <img src="${off.image || 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80'}" alt="${off.title}" loading="lazy">
      </div>
      <div class="offer-body">
        <div>
          <div style="font-size: 0.82rem; color: var(--primary-deep); font-weight: 600; margin-bottom: 8px;">
            <i class="fas fa-calendar-check"></i> Valid: ${off.validTill || 'Seasonal Session'}
          </div>
          <h3 class="offer-title">${off.title}</h3>
          <p class="offer-desc">${off.description}</p>
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 16px; border-top: 1px solid var(--border-subtle); margin-top: 16px;">
          <div>
            <span style="font-size: 0.72rem; color: var(--text-muted); display: block; text-transform: uppercase; letter-spacing: 0.08em;">PACKAGE CODE</span>
            <strong style="color: var(--primary-deep); font-family: monospace; font-size: 0.95rem;">${off.code || 'NALLAYIL'}</strong>
          </div>
          <a href="booking.html?offer=${encodeURIComponent(off.title)}" class="btn btn-primary btn-sm">
            Claim Package <i class="fas fa-arrow-right"></i>
          </a>
        </div>
      </div>
    </div>
  `).join('');
}

/* --------------------------------------------------------------------------
   10. Dynamic Gallery Rendering & Lightbox Modal
   -------------------------------------------------------------------------- */
function renderDynamicGallery(filterCat = 'All') {
  const galleryGrid = document.getElementById('dynamic-gallery-grid');
  if (!galleryGrid) return;

  const galleryItems = window.NallayilStore ? window.NallayilStore.getGallery() : (window.NALLAYIL_DATA ? window.NALLAYIL_DATA.initialGallery : []);

  const filtered = (filterCat === 'All') 
    ? galleryItems 
    : galleryItems.filter(item => item.category && item.category.toLowerCase() === filterCat.toLowerCase());

  if (!filtered.length) {
    galleryGrid.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 44px; background: var(--bg-soft); border-radius: var(--radius-lg); border: 1px dashed var(--border-green);">
        <p style="color: var(--text-muted); font-size: 1rem;">No images found in category "${filterCat}".</p>
      </div>
    `;
    return;
  }

  galleryGrid.innerHTML = filtered.map((item, idx) => `
    <div class="gallery-item ${idx === 0 ? 'gallery-item-featured' : ''}" data-src="${item.image}" data-title="${item.title}" data-desc="${item.description || ''}" onclick="openGalleryLightbox(this)">
      <img src="${item.image}" alt="${item.title}" loading="lazy">
      <div class="gallery-overlay">
        <span class="gallery-item-cat">${item.category || 'Kerala Ayurveda'}</span>
        <h4 class="gallery-item-title">${item.title}</h4>
      </div>
    </div>
  `).join('');

  const filterBtns = document.querySelectorAll('.gallery-filter-btn');
  filterBtns.forEach(btn => {
    btn.onclick = function() {
      filterBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      renderDynamicGallery(this.getAttribute('data-cat') || 'All');
    };
  });
}

function openGalleryLightbox(el) {
  const src = el.getAttribute('data-src');
  const title = el.getAttribute('data-title');
  const desc = el.getAttribute('data-desc');

  const modal = document.getElementById('gallery-modal');
  const modalImg = document.getElementById('gallery-modal-img');
  const modalTitle = document.getElementById('gallery-modal-title');
  const modalDesc = document.getElementById('gallery-modal-desc');

  if (!modal || !modalImg) return;

  modalImg.src = src;
  if (modalTitle) modalTitle.textContent = title;
  if (modalDesc) modalDesc.textContent = desc;

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

window.openGalleryLightbox = openGalleryLightbox;

/* --------------------------------------------------------------------------
   11. Treatments Filter
   -------------------------------------------------------------------------- */
function initTreatmentsFilter() {
  const filterBtns = document.querySelectorAll('.treatment-filter-btn');
  const treatmentCards = document.querySelectorAll('.treatment-card');

  if (!filterBtns.length || !treatmentCards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const cat = (btn.getAttribute('data-category') || 'all').toLowerCase();
      treatmentCards.forEach(card => {
        const cardCat = (card.getAttribute('data-category') || '').toLowerCase();
        if (cat === 'all' || cardCat.includes(cat) || cat.includes(cardCat)) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* --------------------------------------------------------------------------
   12. Modals Close Helper
   -------------------------------------------------------------------------- */
function initModals() {
  const modals = document.querySelectorAll('.modal');
  modals.forEach(modal => {
    const closeBtns = modal.querySelectorAll('.modal-close');
    closeBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        modal.classList.remove('active');
        document.body.style.overflow = '';
      });
    });

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      modals.forEach(modal => {
        if (modal.classList.contains('active')) {
          modal.classList.remove('active');
          document.body.style.overflow = '';
        }
      });
    }
  });
}

/* --------------------------------------------------------------------------
   13. Scroll Reveal Observer
   -------------------------------------------------------------------------- */
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');
  if (!reveals.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      }
    });
  }, { threshold: 0.12 });

  reveals.forEach(el => observer.observe(el));
}



/* --------------------------------------------------------------------------
   Consultation Booking Wizard Helper Functions (WhatsApp Integration)
   -------------------------------------------------------------------------- */
function selectSlot(button, time) {
  document.querySelectorAll('.slot-pill').forEach(btn => btn.classList.remove('active'));
  button.classList.add('active');
  const input = document.getElementById('selectedConsultTime');
  if (input) input.value = time;
}

function submitConsultationRequest() {
  const center = document.getElementById('consultCenter')?.value || 'Manjeri Heritage Hospital (Mullampara)';
  const doctor = document.getElementById('consultDoctor')?.value || 'Any available specialist';
  const treatment = document.getElementById('consultTreatment')?.value || 'General Consultation';
  const mode = document.getElementById('consultMode')?.value || 'In-Clinic Outpatient Visit (OP)';
  const date = document.getElementById('consultDate')?.value || '';
  const time = document.getElementById('selectedConsultTime')?.value || '09:00 AM - 09:45 AM';
  const name = document.getElementById('consultName')?.value || '';
  const phone = document.getElementById('consultPhone')?.value || '';

  if (!name.trim()) {
    alert('Please enter patient full name.');
    document.getElementById('consultName')?.focus();
    return;
  }
  if (!phone.trim()) {
    alert('Please enter mobile number (WhatsApp).');
    document.getElementById('consultPhone')?.focus();
    return;
  }

  const message = `*Nallayil Ayurveda - Appointment Request*\n\n` +
    `• Center: ${center}\n` +
    `• Doctor / Specialist: ${doctor}\n` +
    `• Concern / Treatment: ${treatment}\n` +
    `• Mode: ${mode}\n` +
    `• Date of Appointment: ${date}\n` +
    `• Preferred Time: ${time}\n` +
    `• Patient Name: ${name}\n` +
    `• WhatsApp Number: ${phone}\n\n` +
    `Please confirm the appointment slot availability.`;

  const whatsappUrl = `https://wa.me/919447638838?text=${encodeURIComponent(message)}`;
  window.open(whatsappUrl, '_blank');
}

window.selectSlot = selectSlot;
window.submitConsultationRequest = submitConsultationRequest;


/* --------------------------------------------------------------------------
   DYNAMIC AYURVEDA JOURNAL CMS (SECTION 8)
   -------------------------------------------------------------------------- */
function initDynamicJournalCMS() {
  const grid = document.getElementById('homeJournalArticlesGrid');
  if (!grid) return;

  function renderArticles() {
    let articles = [];
    if (typeof NallayilStore !== 'undefined' && NallayilStore.getArticles) {
      articles = NallayilStore.getArticles();
    } else if (typeof NALLAYIL_DATA !== 'undefined' && NALLAYIL_DATA.initialArticles) {
      articles = NALLAYIL_DATA.initialArticles;
    }

    if (!articles || !articles.length) return;

    // CMS logic: Sort by Published Date -> Newest First -> Display exactly 4
    const sorted = [...articles].sort((a, b) => new Date(b.publishedDate) - new Date(a.publishedDate));
    const latest4 = sorted.slice(0, 4);

    grid.innerHTML = latest4.map(article => `
      <article class="journal-card-item">
        <div class="journal-card-media">
          <img src="${article.image}" alt="${article.title}" loading="lazy" onerror="this.onerror=null; this.src='images/card-therapies.jpg';">
          <span class="journal-card-category-badge">${article.category}</span>
        </div>
        <div class="journal-card-content">
          <div>
            <h3 class="journal-card-title">${article.title}</h3>
            <p class="journal-card-excerpt">${article.excerpt}</p>
          </div>
          <div class="journal-card-footer">
            <a href="journal.html#${article.id || ''}" class="journal-read-link">
              <span>Read Article</span> <span style="font-size: 1.1rem;">→</span>
            </a>
          </div>
        </div>
      </article>
    `).join('');
  }

  renderArticles();
  window.addEventListener('nallayil_articles_updated', renderArticles);
}

/* --------------------------------------------------------------------------
   COUNT-UP AUTOMATION FOR SECTION 7 TRUST COUNTERS
   -------------------------------------------------------------------------- */
function initTrustCounters() {
  const countupEls = document.querySelectorAll('.countup');
  if (!countupEls.length) return;

  let started = false;
  const section = document.getElementById('booking-cta') || countupEls[0].closest('section') || countupEls[0];

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !started) {
        started = true;
        countupEls.forEach(el => {
          const target = parseInt(el.getAttribute('data-target'), 10) || 0;
          const prefix = el.getAttribute('data-prefix') || '';
          const suffix = el.getAttribute('data-suffix') || '';
          const isComma = el.getAttribute('data-format') === 'comma';
          const duration = 2200; // ms
          const startTime = performance.now();

          function frame(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const ease = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(ease * target);

            let str = current.toString();
            if (isComma) {
              str = current.toLocaleString('en-US');
            } else if (prefix && current < 10) {
              str = prefix + current;
            }

            el.textContent = str + suffix;

            if (progress < 1) {
              requestAnimationFrame(frame);
            } else {
              let finalStr = target.toString();
              if (isComma) finalStr = target.toLocaleString('en-US');
              else if (prefix && target < 10) finalStr = prefix + target;
              el.textContent = finalStr + suffix;
            }
          }

          requestAnimationFrame(frame);
        });
      }
    });
  }, { threshold: 0.2 });

  if (section) observer.observe(section);
}



/* --------------------------------------------------------------------------
   🌿 NALLAYIL CARE FLOATING UI & SMART OFFER MODAL
   -------------------------------------------------------------------------- */
function initNallayilCareSystem() {
  const widget = document.getElementById('nallayilCareWidget');
  const offerBtn = document.getElementById('careOfferBtn');
  const overlay = document.getElementById('careOfferModalOverlay');

  if (!widget) return;

  // 1. Offer Smart Logic: Check CMS for active offers
  function updateSmartOfferVisibility() {
    let offers = [];
    if (typeof NallayilStore !== 'undefined' && NallayilStore.getOffers) {
      offers = NallayilStore.getOffers();
    } else if (typeof NALLAYIL_DATA !== 'undefined' && NALLAYIL_DATA.initialOffers) {
      offers = NALLAYIL_DATA.initialOffers;
    }

    // Filter active offers
    const activeOffers = (offers || []).filter(o => o.active !== false);

    if (offerBtn) {
      if (activeOffers.length > 0) {
        offerBtn.style.setProperty('display', 'flex', 'important');
        const latestOffer = activeOffers[0];
        
        // Populate modal data
        const titleEl = document.getElementById('careOfferTitle');
        const descEl = document.getElementById('careOfferDesc');
        const imgEl = document.getElementById('careOfferImg');

        if (titleEl && latestOffer.title) titleEl.textContent = latestOffer.title;
        if (descEl && latestOffer.description) descEl.textContent = latestOffer.description;
        if (imgEl && latestOffer.image) imgEl.src = latestOffer.image;
      } else {
        offerBtn.style.setProperty('display', 'none', 'important');
      }
    }
  }

  updateSmartOfferVisibility();
  window.addEventListener('nallayil_offers_updated', updateSmartOfferVisibility);

  // Close when clicking outside widget
  document.addEventListener('click', (e) => {
    if (!widget.contains(e.target)) {
      closeCareMenu();
    }
  });

  // Render CMS-driven treatments list in footer if present
  renderFooterTreatmentsCMS();
}

function toggleCareMenu() {
  const widget = document.getElementById('nallayilCareWidget');
  const icon = document.getElementById('careTriggerIcon');
  if (!widget) return;

  const isActive = widget.classList.toggle('active');
  if (icon) {
    if (isActive) {
      icon.className = 'fas fa-times';
    } else {
      icon.className = 'fas fa-headset';
    }
  }
}

function closeCareMenu() {
  const widget = document.getElementById('nallayilCareWidget');
  const icon = document.getElementById('careTriggerIcon');
  if (widget && widget.classList.contains('active')) {
    widget.classList.remove('active');
    if (icon) icon.className = 'fas fa-headset';
  }
}

function openCareOfferModal() {
  closeCareMenu();
  const overlay = document.getElementById('careOfferModalOverlay');
  if (overlay) {
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeCareOfferModal() {
  const overlay = document.getElementById('careOfferModalOverlay');
  if (overlay) {
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }
}

function handleOfferOverlayClick(e) {
  if (e.target.id === 'careOfferModalOverlay') {
    closeCareOfferModal();
  }
}

// Render treatments into footer Column 3 dynamically
function renderFooterTreatmentsCMS() {
  const list = document.getElementById('footerTreatmentsList');
  if (!list) return;

  const defaultTreatments = [
    { title: "Classical Panchakarma Detox", anchor: "panchakarma" },
    { title: "Abhyanga Full-Body Rejuvenation", anchor: "abhyanga" },
    { title: "Shirodhara Mind & Sleep Therapy", anchor: "shirodhara" },
    { title: "Kizhi & Potali Musculoskeletal Care", anchor: "kizhi" },
    { title: "Marma Spine & Disc Manipulation", anchor: "marma" }
  ];

  list.innerHTML = defaultTreatments.map(t => `
    <li><a href="treatments.html#${t.anchor}" class="footer-v2-link">${t.title}</a></li>
  `).join('');
}

window.toggleCareMenu = toggleCareMenu;
window.closeCareMenu = closeCareMenu;
window.openCareOfferModal = openCareOfferModal;
window.closeCareOfferModal = closeCareOfferModal;
window.handleOfferOverlayClick = handleOfferOverlayClick;


/* --------------------------------------------------------------------------
   TREATMENT AUTO-FILTER LOGIC FOR BOOKING SHEET
   -------------------------------------------------------------------------- */
function initBookingTreatmentAutoFilter() {
  const treatmentSelect = document.getElementById('consultTreatment') || document.getElementById('booking-treatment');
  if (!treatmentSelect) return;

  const urlParams = new URLSearchParams(window.location.search);
  const treatmentParam = urlParams.get('treatment') || urlParams.get('concern') || urlParams.get('service');

  if (treatmentParam) {
    const term = treatmentParam.toLowerCase().replace(/[-_+]/g, ' ');
    let matched = false;

    // Search through select options
    for (let i = 0; i < treatmentSelect.options.length; i++) {
      const opt = treatmentSelect.options[i];
      const optText = opt.text.toLowerCase();
      const optVal = opt.value.toLowerCase();

      if (optText.includes(term) || optVal.includes(term) || term.includes(optVal)) {
        treatmentSelect.selectedIndex = i;
        treatmentSelect.value = opt.value;
        matched = true;
        break;
      }
    }

    // Secondary keyword matching (e.g. "marma", "spine", "panchakarma", "joint", "stroke", "shirodhara")
    if (!matched) {
      const keywords = ['marma', 'spine', 'panchakarma', 'joint', 'arthritis', 'stroke', 'neuro', 'shirodhara', 'wellness', 'beauty', 'consultation', 'therapies'];
      for (const kw of keywords) {
        if (term.includes(kw)) {
          for (let i = 0; i < treatmentSelect.options.length; i++) {
            const opt = treatmentSelect.options[i];
            if (opt.text.toLowerCase().includes(kw) || opt.value.toLowerCase().includes(kw)) {
              treatmentSelect.selectedIndex = i;
              treatmentSelect.value = opt.value;
              matched = true;
              break;
            }
          }
          if (matched) break;
        }
      }
    }

    // Scroll to the booking form sheet
    const bookingSection = document.getElementById('booking-section') || document.getElementById('consultationBookingForm');
    if (bookingSection) {
      setTimeout(() => {
        bookingSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 250);
    }
  }
}


/* --------------------------------------------------------------------------
   DYNAMIC TREATMENTS PAGE SYNC (FROM CMS STORE)
   -------------------------------------------------------------------------- */
function initTreatmentsPageSync() {
  const container = document.getElementById('treatmentsCardsContainer');
  if (!container || typeof NallayilStore === 'undefined') return;

  function render() {
    const list = NallayilStore.getTreatments();
    if (!list || !list.length) return;

    container.innerHTML = list.map(t => {
      const indications = (t.benefits || []).map(b => `<span class="treatment-tag">${b}</span>`).join('');
      return `
        <article class="treatment-detail-card" id="${t.id}">
          <div class="tdc-img-wrap">
            <img src="${t.image}" alt="${t.title}" loading="lazy" onerror="this.onerror=null; this.src='images/card-therapies.jpg';">
          </div>
          <div class="tdc-body">
            <div>
              <span class="section-tag">${t.category || 'Specialized Care'}</span>
              <h2 style="font-family: 'Playfair Display', Georgia, serif; font-size: 1.85rem; color: #143322; margin: 8px 0 12px;">${t.title}</h2>
              <p style="color: #4A5D4E; margin-bottom: 16px; line-height: 1.8;">
                ${t.shortDesc || t.description || ''}
              </p>
              ${t.benefits && t.benefits.length ? `
              <div style="margin-bottom: 20px;">
                <strong style="color: #143322; font-size: 0.95rem;">Key Clinical Indications &amp; Benefits:</strong>
                <div style="display:flex; flex-wrap:wrap; gap:8px; margin-top:8px;">
                  ${indications}
                </div>
              </div>` : ''}
            </div>
            <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:16px; padding-top:16px; border-top:1px solid #eef2ed;">
              <span style="font-weight:700; color:#143322; font-size:0.9rem;"><i class="fas fa-clock"></i> Recommended: ${t.duration || '7 to 21 Days'}</span>
              <a href="booking.html?treatment=${encodeURIComponent(t.title)}" class="btn btn-primary btn-sm">
                <span>Book ${t.title.split(' ')[0]} Consultation</span> <i class="fas fa-arrow-right"></i>
              </a>
            </div>
          </div>
        </article>
      `;
    }).join('');
  }

  render();
  window.addEventListener('nallayil_treatments_updated', render);
  window.addEventListener('nallayil_data_published', render);
}

/* --------------------------------------------------------------------------
   DYNAMIC DOCTORS & TREATMENT OPTIONS SYNC FOR BOOKING
   -------------------------------------------------------------------------- */
function initBookingFieldsSync() {
  const docSelect = document.getElementById('consultDoctor');
  const treatSelect = document.getElementById('consultTreatment');

  if (typeof NallayilStore === 'undefined') return;

  function syncFields() {
    if (docSelect) {
      const doctors = NallayilStore.getDoctors() || [];
      const currentVal = docSelect.value;
      let html = '<option value="Any available specialist">Any available specialist</option>';
      doctors.forEach(d => {
        html += `<option value="${d.name}">${d.name} (${d.specialty ? d.specialty.split(',')[0] : d.qualification})</option>`;
      });
      docSelect.innerHTML = html;
      if (currentVal) docSelect.value = currentVal;
    }

    if (treatSelect) {
      const treatments = NallayilStore.getBookingTreatments() || [];
      const currentVal = treatSelect.value;
      let html = '<option value="" disabled selected>Select treatment or health concern</option>';
      treatments.forEach(t => {
        html += `<option value="${t}">${t}</option>`;
      });
      treatSelect.innerHTML = html;
      if (currentVal) treatSelect.value = currentVal;
    }
  }

  syncFields();
  window.addEventListener('nallayil_doctors_updated', syncFields);
  window.addEventListener('nallayil_booking_treatments_updated', syncFields);
  window.addEventListener('nallayil_data_published', syncFields);
}
