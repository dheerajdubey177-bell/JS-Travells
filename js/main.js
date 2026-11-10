(() => {
  'use strict';

  const PRIMARY_PHONE = '919301666601';
  const OFFICIAL_EMAIL = 'jstravels.transportservice@gmail.com';

  // Footer copyright year
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  // Sticky Header Shadow
  const header = document.getElementById('site-header');
  const syncHeaderScroll = () => {
    if (!header) return;
    header.classList.toggle('scrolled', window.scrollY > 12);
  };
  window.addEventListener('scroll', syncHeaderScroll, { passive: true });
  syncHeaderScroll();

  // Mobile Drawer Navigation
  const menuToggle = document.getElementById('menu-toggle');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const drawerClose = document.getElementById('drawer-close');

  const setDrawerOpen = (open) => {
    if (!mobileDrawer || !menuToggle) return;
    mobileDrawer.hidden = !open;
    menuToggle.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
  };

  if (menuToggle && mobileDrawer) {
    menuToggle.addEventListener('click', () => setDrawerOpen(true));
    drawerClose?.addEventListener('click', () => setDrawerOpen(false));
    mobileDrawer.addEventListener('click', (e) => {
      if (e.target === mobileDrawer) setDrawerOpen(false);
    });
    mobileDrawer.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => setDrawerOpen(false));
    });
  }

  // Fleet Category Filtering
  const fleetFilterBtns = document.querySelectorAll('[data-filter]');
  const fleetCards = document.querySelectorAll('.fleet-card');

  fleetFilterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-filter');
      fleetFilterBtns.forEach((b) => {
        const isActive = b === btn;
        b.classList.toggle('active', isActive);
        b.setAttribute('aria-selected', String(isActive));
      });

      fleetCards.forEach((card) => {
        const cat = card.getAttribute('data-category');
        const show = target === 'all' || cat === target;
        card.classList.toggle('is-hidden', !show);
      });
    });
  });

  // Tempo Traveller Exterior / Interior Toggle
  document.querySelectorAll('.interior-toggle-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const media = btn.closest('.fleet-media');
      const img = media?.querySelector('.traveller-toggle-img');
      if (!img) return;
      const extSrc = img.getAttribute('data-ext');
      const intSrc = img.getAttribute('data-int');
      const showingInterior = img.getAttribute('data-state') === 'int';

      if (showingInterior && extSrc) {
        img.src = extSrc;
        img.setAttribute('data-state', 'ext');
        btn.textContent = 'View Interior';
      } else if (intSrc) {
        img.src = intSrc;
        img.setAttribute('data-state', 'int');
        btn.textContent = 'View Exterior';
      }
    });
  });

  // Rate Card Tabs (Passenger vs Goods Transport)
  const rateTabs = document.querySelectorAll('[data-rate-tab]');
  const passengerPanel = document.getElementById('panel-passenger');
  const goodsPanel = document.getElementById('panel-goods');

  rateTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const mode = tab.getAttribute('data-rate-tab');
      rateTabs.forEach((t) => {
        const active = t === tab;
        t.classList.toggle('active', active);
        t.setAttribute('aria-selected', String(active));
      });

      if (passengerPanel && goodsPanel) {
        const showPassenger = mode === 'passenger';
        passengerPanel.hidden = !showPassenger;
        goodsPanel.hidden = showPassenger;
      }
    });
  });

  // Vehicle Card -> Auto-fill Booking Form
  const serviceSelect = document.getElementById('service-type');
  const vehicleSelect = document.getElementById('vehicle-choice');
  const customerNameInput = document.getElementById('customer-name');
  const bookingSection = document.getElementById('book');

  const selectOptionByText = (selectEl, valueToMatch) => {
    if (!selectEl || !valueToMatch) return;
    const lower = valueToMatch.toLowerCase();
    for (const opt of selectEl.options) {
      if (opt.value.toLowerCase() === lower || opt.textContent.toLowerCase().includes(lower)) {
        selectEl.value = opt.value;
        return;
      }
    }
    // Fallback: match partial tokens if exact option differs slightly
    const words = lower.split(/[\s/()]+/).filter((w) => w.length > 3);
    for (const opt of selectEl.options) {
      if (words.some((w) => opt.value.toLowerCase().includes(w))) {
        selectEl.value = opt.value;
        return;
      }
    }
  };

  document.querySelectorAll('.book-vehicle-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const vehicle = btn.getAttribute('data-vehicle');
      const service = btn.getAttribute('data-service');
      selectOptionByText(serviceSelect, service);
      selectOptionByText(vehicleSelect, vehicle);

      bookingSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setTimeout(() => {
        customerNameInput?.focus({ preventScroll: true });
      }, 450);
    });
  });

  // Gallery Filtering
  const galleryFilterBtns = document.querySelectorAll('[data-gallery-filter]');
  const galleryItems = document.querySelectorAll('.gallery-item');

  galleryFilterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-gallery-filter');
      galleryFilterBtns.forEach((b) => b.classList.toggle('active', b === btn));

      galleryItems.forEach((item) => {
        const cat = item.getAttribute('data-gcat');
        const show = filter === 'all' || cat === filter;
        item.classList.toggle('is-hidden', !show);
      });
    });
  });

  // Full-Screen Lightbox Viewer
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxBackdrop = document.getElementById('lightbox-backdrop');
  const lightboxPrev = document.getElementById('lightbox-prev');
  const lightboxNext = document.getElementById('lightbox-next');

  let activeTriggers = [];
  let activeIndex = 0;

  const getLightboxTriggers = () => {
    // Include visible gallery items; standalone triggers work as single item when clicked
    return Array.from(document.querySelectorAll('#gallery-grid .gallery-item:not(.is-hidden)'));
  };

  const renderLightboxItem = (src, title) => {
    if (!lightboxImg || !lightboxCaption) return;
    lightboxImg.src = src;
    lightboxImg.alt = title || 'JS Travels image preview';
    lightboxCaption.textContent = title || '';
  };

  const openLightbox = (trigger) => {
    if (!lightbox) return;
    const galleryVisible = getLightboxTriggers();
    const idxInGallery = galleryVisible.indexOf(trigger);

    if (idxInGallery >= 0) {
      activeTriggers = galleryVisible;
      activeIndex = idxInGallery;
    } else {
      activeTriggers = [trigger];
      activeIndex = 0;
    }

    const src = trigger.getAttribute('data-lightbox-src') || '';
    const title = trigger.getAttribute('data-lightbox-title') || '';
    renderLightboxItem(src, title);

    const hasNav = activeTriggers.length > 1;
    if (lightboxPrev) lightboxPrev.style.display = hasNav ? 'flex' : 'none';
    if (lightboxNext) lightboxNext.style.display = hasNav ? 'flex' : 'none';

    lightbox.hidden = false;
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    if (!lightbox) return;
    lightbox.hidden = true;
    if (lightboxImg) lightboxImg.src = '';
    document.body.style.overflow = '';
  };

  const stepLightbox = (delta) => {
    if (activeTriggers.length <= 1) return;
    activeIndex = (activeIndex + delta + activeTriggers.length) % activeTriggers.length;
    const nextTrigger = activeTriggers[activeIndex];
    renderLightboxItem(
      nextTrigger.getAttribute('data-lightbox-src') || '',
      nextTrigger.getAttribute('data-lightbox-title') || ''
    );
  };

  document.querySelectorAll('[data-lightbox-src]').forEach((trigger) => {
    trigger.addEventListener('click', () => openLightbox(trigger));
  });

  lightboxClose?.addEventListener('click', closeLightbox);
  lightboxBackdrop?.addEventListener('click', closeLightbox);
  lightboxPrev?.addEventListener('click', () => stepLightbox(-1));
  lightboxNext?.addEventListener('click', () => stepLightbox(1));

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (lightbox && !lightbox.hidden) closeLightbox();
      if (mobileDrawer && !mobileDrawer.hidden) setDrawerOpen(false);
    } else if (lightbox && !lightbox.hidden) {
      if (e.key === 'ArrowLeft') stepLightbox(-1);
      if (e.key === 'ArrowRight') stepLightbox(1);
    }
  });

  // Booking Form Submission (WhatsApp + Email)
  const bookingForm = document.getElementById('booking-form');
  const emailQuoteBtn = document.getElementById('email-quote-btn');
  const formStatus = document.getElementById('form-status');
  const tripDateInput = document.getElementById('trip-date');

  // Set min date to today
  if (tripDateInput) {
    const today = new Date().toISOString().split('T')[0];
    tripDateInput.min = today;
  }

  const collectAndValidateBooking = () => {
    const name = document.getElementById('customer-name')?.value.trim() || '';
    const phone = document.getElementById('customer-phone')?.value.trim() || '';
    const service = serviceSelect?.value || '';
    const vehicle = vehicleSelect?.value || '';
    const pickup = document.getElementById('pickup-loc')?.value.trim() || '';
    const drop = document.getElementById('drop-loc')?.value.trim() || '';
    const date = tripDateInput?.value || 'Flexible / Immediate';
    const notes = document.getElementById('extra-notes')?.value.trim() || 'None';

    if (!name || !phone || !pickup || !drop) {
      if (formStatus) {
        formStatus.textContent = 'Please fill in your name, mobile number, pickup, and drop location.';
        formStatus.className = 'form-status error';
      }
      return null;
    }

    const message = [
      '*New Booking Request — JS Travels & Transport Service*',
      `Name: ${name}`,
      `Phone: ${phone}`,
      `Service: ${service}`,
      `Preferred Vehicle: ${vehicle}`,
      `Pickup: ${pickup}`,
      `Drop: ${drop}`,
      `Date: ${date}`,
      `Notes: ${notes}`
    ].join('\n');

    return { name, service, vehicle, message };
  };

  bookingForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = collectAndValidateBooking();
    if (!data) return;

    if (formStatus) {
      formStatus.textContent = 'Opening WhatsApp with your booking details...';
      formStatus.className = 'form-status success';
    }

    const waUrl = `https://wa.me/${PRIMARY_PHONE}?text=${encodeURIComponent(data.message)}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  });

  emailQuoteBtn?.addEventListener('click', () => {
    const data = collectAndValidateBooking();
    if (!data) return;

    if (formStatus) {
      formStatus.textContent = 'Opening your email app with your booking summary...';
      formStatus.className = 'form-status success';
    }

    const subject = `Booking Inquiry: ${data.service} (${data.vehicle}) — ${data.name}`;
    const mailUrl = `mailto:${OFFICIAL_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(data.message)}`;
    window.location.href = mailUrl;
  });

  // Scroll Reveal Observer
  const revealEls = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -32px 0px' }
    );
    revealEls.forEach((el) => observer.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('revealed'));
  }
})();
