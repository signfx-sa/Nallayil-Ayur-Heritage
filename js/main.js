/* Shared public interactions. All editorial content originates in data.js. */
(() => {
  'use strict';
  const $ = (s, p = document) => p.querySelector(s);
  const $$ = (s, p = document) => [...p.querySelectorAll(s)];
  const escape = v => String(v ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const imageURL = v => { if(!v)return 'images/massage-ritual.webp';if(/^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/=]+$/.test(v))return v;try { const u = new URL(v, location.href); return ['https:', 'http:'].includes(u.protocol) ? u.href : 'images/massage-ritual.webp'; } catch { return 'images/massage-ritual.webp'; } };
  let activeLayer, previousFocus, inerted = [];
  function closeLayer() {
    if (!activeLayer) return;
    const layer = activeLayer;
    activeLayer = null;
    layer.classList.remove('active', 'open');
    if (layer.classList.contains('modal')) layer.hidden = true;
    else { layer.inert = true; $('.drawer-overlay')?.classList.remove('active'); $('.mobile-toggle')?.setAttribute('aria-expanded', 'false'); }
    inerted.forEach(([el, value]) => { el.inert = value; }); inerted = [];
    document.body.style.overflow = '';
    if (previousFocus?.isConnected) previousFocus.focus({preventScroll:true});
  }
  function openLayer(layer) {
    if (!layer) return;
    if (activeLayer) closeLayer();
    previousFocus = document.activeElement;
    activeLayer = layer;
    layer.hidden = false; layer.inert = false;
    layer.classList.add(layer.classList.contains('modal') ? 'active' : 'open');
    for (const el of document.body.children) {
      if (el === layer || el.classList.contains('drawer-overlay') || el.tagName === 'SCRIPT') continue;
      inerted.push([el, el.inert]); el.inert = true;
    }
    document.body.style.overflow = 'hidden';
    (layer.querySelector('button, a[href], input, select') || layer).focus();
  }
  window.NallayilUI = {openModal:openLayer, closeModal:closeLayer};
  document.addEventListener('keydown', e => {
    if (!activeLayer) return;
    if (e.key === 'Escape') { e.preventDefault(); closeLayer(); return; }
    if (activeLayer.id === 'gallery-modal' && ['ArrowLeft','ArrowRight'].includes(e.key)) { e.preventDefault(); showImage(galleryIndex + (e.key === 'ArrowRight' ? 1 : -1)); }
    if (e.key !== 'Tab') return;
    const focusable = $$('a[href],button:not(:disabled),input,select,textarea,[tabindex="0"]', activeLayer).filter(el => el.getClientRects().length);
    const first = focusable[0], last = focusable.at(-1);
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last?.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first?.focus(); }
  });
  let galleryItems = [], galleryIndex = 0, galleryCategory = 'All';
  function renderGallery(category = galleryCategory) {
    const grid = $('#dynamic-gallery-grid'); if (!grid) return;
    galleryCategory = typeof category === 'string' ? category : galleryCategory;
    const items = window.NallayilStore.getGallery();
    galleryItems = items.filter(g => galleryCategory === 'All' || g.category === galleryCategory);
    if (grid.dataset.limit) galleryItems = galleryItems.slice(0, Number(grid.dataset.limit));
    grid.innerHTML = galleryItems.map((g, i) => `<button type="button" class="gallery-item" data-index="${i}" aria-label="View ${escape(g.title)}"><span class="gallery-image"><img src="${escape(imageURL(g.image))}" alt="${escape(g.title)}" loading="lazy" decoding="async" width="1000" height="750"></span><span class="gallery-caption"><small>${escape(g.category)}</small><strong>${escape(g.title)}</strong></span></button>`).join('') || '<p>No photographs in this category.</p>';
    $('#gallery-status')?.replaceChildren(document.createTextNode(`${galleryItems.length} photographs displayed`));
    $$('.gallery-filter-btn').forEach(b => { const on = b.dataset.cat === galleryCategory; b.classList.toggle('active',on); b.setAttribute('aria-pressed',on); });
  }
  function showImage(index) {
    if (!galleryItems.length) return;
    galleryIndex = (index + galleryItems.length) % galleryItems.length;
    const g = galleryItems[galleryIndex], img = $('#gallery-modal-img');
    if (!img) return;
    img.src = imageURL(g.image); img.alt = g.title;
    $('#gallery-modal-title').textContent = g.title;
    $('#gallery-modal-desc').textContent = g.description || '';
    $('#gallery-counter').textContent = `${String(galleryIndex + 1).padStart(2,'0')} / ${String(galleryItems.length).padStart(2,'0')} — ${g.category}`;
  }
  function renderOffers() {
    const grid = $('#dynamic-offers-grid'); if (!grid) return;
    const now = new Date(), today = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`;
    const offers = window.NallayilStore.getOffers().filter(o => !o.validTill || o.validTill >= today);
    grid.innerHTML = offers.map(o => `<article class="offer-row"><div><h3>${escape(o.title)}</h3><small>${escape(o.badge)} · Through ${escape(o.validTill)} · ${escape(o.code)}</small></div><p>${escape(o.description)}</p><a class="text-link" href="booking.html?offer=${encodeURIComponent(o.title)}">Enquire ↗</a></article>`).join('') || '<p>Please contact our team to discuss current wellness programmes.</p>';
  }
  document.addEventListener('DOMContentLoaded', () => {
    const drawer = $('.mobile-drawer');
    $('.mobile-toggle')?.addEventListener('click', () => { openLayer(drawer); $('.drawer-overlay')?.classList.add('active'); $('.mobile-toggle').setAttribute('aria-expanded','true'); });
    $('.drawer-close')?.addEventListener('click',closeLayer);
    $('.drawer-overlay')?.addEventListener('click',closeLayer);
    $$('.drawer-nav a, .mobile-drawer>a').forEach(a => a.addEventListener('click',closeLayer));
    matchMedia('(min-width:901px)').addEventListener('change', e => { if(e.matches && activeLayer === drawer) closeLayer(); });
    $$('.modal').forEach(m => { $('.modal-close',m)?.addEventListener('click',closeLayer); m.addEventListener('click',e=>{if(e.target===m)closeLayer();}); });
    $$('.gallery-filter-btn').forEach(b => b.addEventListener('click', () => renderGallery(b.dataset.cat)));
    $('#dynamic-gallery-grid')?.addEventListener('click', e => { const b = e.target.closest('[data-index]'); if(b){showImage(Number(b.dataset.index));openLayer($('#gallery-modal'));} });
    $('.gallery-prev')?.addEventListener('click',()=>showImage(galleryIndex-1));
    $('.gallery-next')?.addEventListener('click',()=>showImage(galleryIndex+1));
    renderGallery(); renderOffers();
    $$('.treatment-filter-btn').forEach(b => b.addEventListener('click', () => {
      $$('.treatment-filter-btn').forEach(other => { const on = other===b; other.classList.toggle('active',on); other.setAttribute('aria-pressed',on); });
      let count = 0; $$('.treatment-detail-card').forEach(card => { card.hidden = b.dataset.category !== 'all' && card.dataset.category !== b.dataset.category; if(!card.hidden) count++; });
      $('#treatment-status').textContent = `${count} treatments displayed`;
    }));
    const slides = $$('.testimonial-card-wrap'); let current = 0;
    const slide = direction => { if(!slides.length)return; current=(current+direction+slides.length)%slides.length; slides.forEach((s,i)=>{s.hidden=i!==current;s.classList.toggle('active',i===current);}); };
    $('.slider-prev')?.addEventListener('click',()=>slide(-1)); $('.slider-next')?.addEventListener('click',()=>slide(1));
    document.addEventListener('error', e => { if(e.target instanceof HTMLImageElement && !e.target.dataset.fallback){e.target.dataset.fallback='true';e.target.src='images/massage-ritual.webp';} },true);
    if (!matchMedia('(prefers-reduced-motion: reduce)').matches && 'IntersectionObserver' in window) {
      const reveal = new IntersectionObserver(entries => entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('reveal-enter');reveal.unobserve(entry.target);}}),{threshold:.12});
      $$('.section-heading,.about-layout,.ingredient-grid,.location-grid,.experience-copy').forEach(el=>reveal.observe(el));
    }
  });
  window.addEventListener('nallayil_gallery_updated', () => renderGallery());
  window.addEventListener('nallayil_offers_updated', renderOffers);
})();
