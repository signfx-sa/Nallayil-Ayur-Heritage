/**
 * Nallayil Ayurveda - Backend Admin Management Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  initAuth();
  initAdminNavigation();
  loadDashboardData();
  initBookingManager();
  initGalleryManager();
  initOffersManager();
});

/* --------------------------------------------------------------------------
   Admin Authentication Gate
-------------------------------------------------------------------------- */
function initAuth() {
  const authOverlay = document.getElementById('admin-auth-overlay');
  const loginForm = document.getElementById('admin-login-form');
  const logoutBtn = document.getElementById('admin-logout-btn');

  const isLoggedIn = sessionStorage.getItem('nallayil_admin_logged_in');
  if (isLoggedIn === 'true' && authOverlay) {
    authOverlay.style.display = 'none';
  }

  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const user = document.getElementById('admin-username').value.trim();
      const pass = document.getElementById('admin-password').value.trim();

      // Demo Admin Credentials
      if ((user === 'admin' && pass === 'nallayil@2026') || (user === 'admin' && pass === 'admin123') || (user === 'nallayil' && pass === 'ayurveda')) {
        sessionStorage.setItem('nallayil_admin_logged_in', 'true');
        authOverlay.style.display = 'none';
        showAdminToast('Welcome, Administrator! Signed in successfully.');
        loadDashboardData();
      } else {
        alert('Invalid credentials! Hint for demo: Username: admin, Password: nallayil@2026');
      }
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      sessionStorage.removeItem('nallayil_admin_logged_in');
      location.reload();
    });
  }
}

/* --------------------------------------------------------------------------
   Admin Sidebar Navigation
-------------------------------------------------------------------------- */
function initAdminNavigation() {
  const sidebarLinks = document.querySelectorAll('.sidebar-link[data-tab]');
  const tabPanels = document.querySelectorAll('.tab-panel');
  const pageTitle = document.getElementById('admin-page-title');

  sidebarLinks.forEach(link => {
    link.addEventListener('click', () => {
      sidebarLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');

      const targetTab = link.getAttribute('data-tab');
      tabPanels.forEach(panel => {
        panel.classList.toggle('active', panel.id === `panel-${targetTab}`);
      });

      if (pageTitle) {
        pageTitle.textContent = link.textContent.trim();
      }

      // Refresh data when navigating
      if (targetTab === 'dashboard') loadDashboardData();
      if (targetTab === 'bookings') renderBookingsTable();
      if (targetTab === 'gallery') renderAdminGallery();
      if (targetTab === 'offers') renderAdminOffers();
    });
  });
}

/* --------------------------------------------------------------------------
   Dashboard Overview & Metrics
-------------------------------------------------------------------------- */
function loadDashboardData() {
  const bookings = window.NallayilStore ? window.NallayilStore.getBookings() : [];
  const gallery = window.NallayilStore ? window.NallayilStore.getGallery() : [];
  const offers = window.NallayilStore ? window.NallayilStore.getOffers() : [];

  const totalBookingsEl = document.getElementById('stat-total-bookings');
  const confirmedBookingsEl = document.getElementById('stat-confirmed-bookings');
  const activeOffersEl = document.getElementById('stat-active-offers');
  const totalGalleryEl = document.getElementById('stat-total-gallery');

  if (totalBookingsEl) totalBookingsEl.textContent = bookings.length;
  if (confirmedBookingsEl) {
    confirmedBookingsEl.textContent = bookings.filter(b => b.status === 'Confirmed').length;
  }
  if (activeOffersEl) activeOffersEl.textContent = offers.length;
  if (totalGalleryEl) totalGalleryEl.textContent = gallery.length;

  renderRecentBookings(bookings.slice(0, 5));
}

function renderRecentBookings(recentList) {
  const tbody = document.getElementById('recent-bookings-tbody');
  if (!tbody) return;

  if (!recentList.length) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;padding:20px;color:var(--admin-muted)">No bookings yet.</td></tr>`;
    return;
  }

  tbody.innerHTML = recentList.map(b => `
    <tr>
      <td><strong>${b.id}</strong></td>
      <td>${b.patientName}</td>
      <td>${b.phone}</td>
      <td>${b.branch.split(' ')[0]}</td>
      <td>${b.date} <small style="display:block;color:var(--admin-muted)">${b.timeSlot}</small></td>
      <td><span class="badge-status ${b.status.toLowerCase()}">${b.status}</span></td>
    </tr>
  `).join('');
}

/* --------------------------------------------------------------------------
   Slot Booking Management
-------------------------------------------------------------------------- */
function initBookingManager() {
  const searchInput = document.getElementById('booking-search');
  const branchFilter = document.getElementById('booking-filter-branch');
  const statusFilter = document.getElementById('booking-filter-status');
  const exportBtn = document.getElementById('booking-export-btn');

  if (searchInput) searchInput.addEventListener('input', renderBookingsTable);
  if (branchFilter) branchFilter.addEventListener('change', renderBookingsTable);
  if (statusFilter) statusFilter.addEventListener('change', renderBookingsTable);

  if (exportBtn) {
    exportBtn.addEventListener('click', exportBookingsCSV);
  }

  renderBookingsTable();
}

function renderBookingsTable() {
  const tbody = document.getElementById('all-bookings-tbody');
  if (!tbody) return;

  const bookings = window.NallayilStore ? window.NallayilStore.getBookings() : [];

  const searchVal = (document.getElementById('booking-search')?.value || '').toLowerCase();
  const branchVal = (document.getElementById('booking-filter-branch')?.value || 'all').toLowerCase();
  const statusVal = (document.getElementById('booking-filter-status')?.value || 'all').toLowerCase();

  const filtered = bookings.filter(b => {
    const matchesSearch = b.id.toLowerCase().includes(searchVal) ||
                          b.patientName.toLowerCase().includes(searchVal) ||
                          b.phone.includes(searchVal) ||
                          b.doctor.toLowerCase().includes(searchVal);
    const matchesBranch = (branchVal === 'all') || (b.branchId && b.branchId.toLowerCase().includes(branchVal)) || b.branch.toLowerCase().includes(branchVal);
    const matchesStatus = (statusVal === 'all') || b.status.toLowerCase() === statusVal;
    return matchesSearch && matchesBranch && matchesStatus;
  });

  if (!filtered.length) {
    tbody.innerHTML = `<tr><td colspan="8" style="text-align:center;padding:30px;color:var(--admin-muted)">No matching bookings found.</td></tr>`;
    return;
  }

  tbody.innerHTML = filtered.map(b => `
    <tr>
      <td><strong>${b.id}</strong></td>
      <td>
        <div style="font-weight:700;color:var(--admin-dark)">${b.patientName}</div>
        <small style="color:var(--admin-muted)">Age: ${b.age || 'N/A'}, ${b.gender || ''}</small>
      </td>
      <td>${b.phone}<br><small style="color:var(--admin-muted)">${b.email}</small></td>
      <td>${b.branch}<br><small style="color:var(--admin-accent)">${b.doctor}</small></td>
      <td><strong>${b.date}</strong><br><small style="color:var(--admin-muted)">${b.timeSlot}</small></td>
      <td><span style="font-size:0.8rem;background:#f0f4f2;padding:3px 8px;border-radius:4px;">${b.mode || 'In-Clinic'}</span></td>
      <td><span class="badge-status ${b.status.toLowerCase()}">${b.status}</span></td>
      <td>
        <div class="action-btn-group">
          ${b.status !== 'Confirmed' ? `<button class="action-btn" title="Confirm Booking" onclick="updateBookingStatus('${b.id}', 'Confirmed')"><i class="fas fa-check" style="color:var(--admin-success)"></i></button>` : ''}
          ${b.status !== 'Cancelled' ? `<button class="action-btn" title="Cancel Booking" onclick="updateBookingStatus('${b.id}', 'Cancelled')"><i class="fas fa-times" style="color:var(--admin-danger)"></i></button>` : ''}
          <button class="action-btn btn-delete" title="Delete Entry" onclick="deleteBookingEntry('${b.id}')"><i class="fas fa-trash"></i></button>
        </div>
      </td>
    </tr>
  `).join('');
}

function updateBookingStatus(id, newStatus) {
  const bookings = window.NallayilStore.getBookings();
  const item = bookings.find(b => b.id === id);
  if (item) {
    item.status = newStatus;
    window.NallayilStore.saveBookings(bookings);
    renderBookingsTable();
    loadDashboardData();
    showAdminToast(`Booking ${id} updated to ${newStatus}`);
  }
}

function deleteBookingEntry(id) {
  if (!confirm(`Are you sure you want to delete booking ${id}?`)) return;
  let bookings = window.NallayilStore.getBookings();
  bookings = bookings.filter(b => b.id !== id);
  window.NallayilStore.saveBookings(bookings);
  renderBookingsTable();
  loadDashboardData();
  showAdminToast(`Booking ${id} deleted.`);
}

function exportBookingsCSV() {
  const bookings = window.NallayilStore.getBookings();
  if (!bookings.length) {
    alert("No bookings to export.");
    return;
  }

  const headers = ["Reference ID", "Patient Name", "Phone", "Email", "Age", "Gender", "Branch", "Doctor", "Treatment", "Date", "Time Slot", "Mode", "Status", "Notes"];
  const rows = bookings.map(b => [
    `"${b.id}"`,
    `"${b.patientName}"`,
    `"${b.phone}"`,
    `"${b.email}"`,
    `"${b.age}"`,
    `"${b.gender}"`,
    `"${b.branch}"`,
    `"${b.doctor}"`,
    `"${b.treatment}"`,
    `"${b.date}"`,
    `"${b.timeSlot}"`,
    `"${b.mode}"`,
    `"${b.status}"`,
    `"${(b.notes || '').replace(/"/g, '""')}"`
  ]);

  const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `Nallayil_Ayurveda_Bookings_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/* --------------------------------------------------------------------------
   Gallery Manager (File Upload with Base64 & Custom Preview)
-------------------------------------------------------------------------- */
let tempGalleryBase64 = '';

function initGalleryManager() {
  const form = document.getElementById('admin-gallery-form');
  const fileInput = document.getElementById('gallery-file-input');
  const urlInput = document.getElementById('gallery-url-input');
  const previewBox = document.getElementById('gallery-preview-box');
  const previewImg = document.getElementById('gallery-preview-img');

  if (fileInput) {
    fileInput.addEventListener('change', function(e) {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function(evt) {
          tempGalleryBase64 = evt.target.result;
          if (previewImg) {
            previewImg.src = tempGalleryBase64;
            previewImg.style.display = 'block';
          }
          if (previewBox) {
            const promptSpan = previewBox.querySelector('.preview-prompt');
            if (promptSpan) promptSpan.style.display = 'none';
          }
        };
        reader.readAsDataURL(file);
      }
    });
  }

  if (urlInput) {
    urlInput.addEventListener('input', function() {
      const url = this.value.trim();
      if (url && previewImg) {
        tempGalleryBase64 = url;
        previewImg.src = url;
        previewImg.style.display = 'block';
        if (previewBox) {
          const promptSpan = previewBox.querySelector('.preview-prompt');
          if (promptSpan) promptSpan.style.display = 'none';
        }
      }
    });
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const title = document.getElementById('gallery-title-input').value.trim();
      const category = document.getElementById('gallery-category-input').value;
      const desc = document.getElementById('gallery-desc-input').value.trim();

      const imageSrc = tempGalleryBase64 || urlInput?.value.trim();
      if (!imageSrc) {
        alert("Please upload an image file or provide a valid image URL.");
        return;
      }

      const gallery = window.NallayilStore.getGallery();
      const newItem = {
        id: `gal-${Date.now()}`,
        title: title,
        category: category,
        description: desc,
        image: imageSrc,
        date: new Date().toISOString().slice(0, 10)
      };

      gallery.unshift(newItem);
      window.NallayilStore.saveGallery(gallery);

      showAdminToast(`New gallery photo "${title}" saved in this browser. Export public content to publish.`);

      // Reset
      form.reset();
      tempGalleryBase64 = '';
      if (previewImg) {
        previewImg.src = '';
        previewImg.style.display = 'none';
      }
      if (previewBox) {
        const promptSpan = previewBox.querySelector('.preview-prompt');
        if (promptSpan) promptSpan.style.display = 'block';
      }

      renderAdminGallery();
      loadDashboardData();
    });
  }

  renderAdminGallery();
}

function renderAdminGallery() {
  const container = document.getElementById('admin-gallery-items-container');
  if (!container) return;

  const gallery = window.NallayilStore ? window.NallayilStore.getGallery() : [];

  if (!gallery.length) {
    container.innerHTML = `<div style="grid-column: 1/-1; padding: 30px; text-align: center; color: var(--admin-muted)">No gallery items yet. Upload your first clinic photo above.</div>`;
    return;
  }

  container.innerHTML = gallery.map(item => `
    <div class="admin-item-card">
      <img src="${staffImage(item.image)}" alt="${item.title}" class="admin-item-img" onerror="this.src='https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=400&q=80'">
      <div class="admin-item-body">
        <span style="font-size:0.75rem; color:var(--admin-accent); font-weight:700; text-transform:uppercase;">${item.category}</span>
        <h4>${item.title}</h4>
        <p>${item.description || 'No description provided.'}</p>
        <small style="color:var(--admin-muted)">Added on: ${item.date || 'Recent'}</small>
      </div>
      <div class="admin-item-footer">
        <span style="font-size:0.8rem; color:var(--admin-muted);">ID: ${item.id}</span>
        <button class="action-btn btn-delete" onclick="deleteGalleryItem('${item.id}')" title="Delete Image">
          <i class="fas fa-trash"></i>
        </button>
      </div>
    </div>
  `).join('');
}

function deleteGalleryItem(id) {
  if (!confirm("Are you sure you want to remove this photo from the website gallery?")) return;
  let gallery = window.NallayilStore.getGallery();
  gallery = gallery.filter(g => g.id !== id);
  window.NallayilStore.saveGallery(gallery);
  renderAdminGallery();
  loadDashboardData();
  showAdminToast("Gallery photo removed.");
}

/* --------------------------------------------------------------------------
   Offers & Announcements Manager
-------------------------------------------------------------------------- */
let tempOfferBase64 = '';

function initOffersManager() {
  const form = document.getElementById('admin-offers-form');
  const fileInput = document.getElementById('offer-file-input');
  const urlInput = document.getElementById('offer-url-input');
  const previewBox = document.getElementById('offer-preview-box');
  const previewImg = document.getElementById('offer-preview-img');

  if (fileInput) {
    fileInput.addEventListener('change', function(e) {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function(evt) {
          tempOfferBase64 = evt.target.result;
          if (previewImg) {
            previewImg.src = tempOfferBase64;
            previewImg.style.display = 'block';
          }
          if (previewBox) {
            const promptSpan = previewBox.querySelector('.preview-prompt');
            if (promptSpan) promptSpan.style.display = 'none';
          }
        };
        reader.readAsDataURL(file);
      }
    });
  }

  if (urlInput) {
    urlInput.addEventListener('input', function() {
      const url = this.value.trim();
      if (url && previewImg) {
        tempOfferBase64 = url;
        previewImg.src = url;
        previewImg.style.display = 'block';
        if (previewBox) {
          const promptSpan = previewBox.querySelector('.preview-prompt');
          if (promptSpan) promptSpan.style.display = 'none';
        }
      }
    });
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const title = document.getElementById('offer-title-input').value.trim();
      const badge = document.getElementById('offer-badge-input').value.trim() || 'SPECIAL OFFER';
      const validTill = document.getElementById('offer-valid-input').value;
      const code = document.getElementById('offer-code-input').value.trim().toUpperCase() || 'NALLAYIL';
      const desc = document.getElementById('offer-desc-input').value.trim();

      const imageSrc = tempOfferBase64 || urlInput?.value.trim() || 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80';

      const offers = window.NallayilStore.getOffers();
      const newOffer = {
        id: `off-${Date.now()}`,
        title: title,
        badge: badge,
        validTill: validTill,
        code: code,
        description: desc,
        image: imageSrc,
        featured: true
      };

      offers.unshift(newOffer);
      window.NallayilStore.saveOffers(offers);

      showAdminToast(`Special offer "${title}" created and active on homepage!`);

      form.reset();
      tempOfferBase64 = '';
      if (previewImg) {
        previewImg.src = '';
        previewImg.style.display = 'none';
      }
      if (previewBox) {
        const promptSpan = previewBox.querySelector('.preview-prompt');
        if (promptSpan) promptSpan.style.display = 'block';
      }

      renderAdminOffers();
      loadDashboardData();
    });
  }

  renderAdminOffers();
}

function renderAdminOffers() {
  const container = document.getElementById('admin-offers-items-container');
  if (!container) return;

  const offers = window.NallayilStore ? window.NallayilStore.getOffers() : [];

  if (!offers.length) {
    container.innerHTML = `<div style="grid-column: 1/-1; padding: 30px; text-align: center; color: var(--admin-muted)">No active offers. Create a promotional offer above.</div>`;
    return;
  }

  container.innerHTML = offers.map(off => `
    <div class="admin-item-card">
      <img src="${staffImage(off.image)}" alt="${off.title}" class="admin-item-img" onerror="this.src='https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=400&q=80'">
      <div class="admin-item-body">
        <span style="display:inline-block; font-size:0.75rem; background:var(--admin-accent); color:#fff; font-weight:700; padding:2px 8px; border-radius:12px; margin-bottom:6px;">${off.badge}</span>
        <h4>${off.title}</h4>
        <p>${off.description}</p>
        <div style="font-size:0.82rem; color:var(--admin-muted); display:flex; justify-content:space-between;">
          <span>Code: <strong>${off.code}</strong></span>
          <span>Valid: <strong>${off.validTill}</strong></span>
        </div>
      </div>
      <div class="admin-item-footer">
        <span style="font-size:0.8rem; color:var(--admin-muted);">ID: ${off.id}</span>
        <button class="action-btn btn-delete" onclick="deleteOfferItem('${off.id}')" title="Delete Offer">
          <i class="fas fa-trash"></i>
        </button>
      </div>
    </div>
  `).join('');
}

function deleteOfferItem(id) {
  if (!confirm("Are you sure you want to delete this promotional offer?")) return;
  let offers = window.NallayilStore.getOffers();
  offers = offers.filter(o => o.id !== id);
  window.NallayilStore.saveOffers(offers);
  renderAdminOffers();
  loadDashboardData();
  showAdminToast("Promotional offer deleted.");
}

function resetToDemoData() {
  if (!confirm("Reset all bookings, gallery, and offers back to original demo state? This will clear any newly added data.")) return;
  localStorage.removeItem('nallayil_bookings');
  localStorage.removeItem('nallayil_gallery');
  localStorage.removeItem('nallayil_offers');
  location.reload();
}

function showAdminToast(msg) {
  let toast = document.getElementById('admin-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'admin-toast';
    toast.style.cssText = `
      position: fixed;
      bottom: 24px;
      right: 24px;
      background: var(--admin-dark);
      color: #fff;
      padding: 14px 24px;
      border-radius: 8px;
      border-left: 4px solid var(--admin-accent);
      box-shadow: 0 8px 24px rgba(0,0,0,0.25);
      z-index: 100000;
      font-size: 0.92rem;
      font-weight: 600;
      transition: opacity 0.3s;
    `;
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.style.opacity = '1';
  setTimeout(() => {
    toast.style.opacity = '0';
  }, 3500);
}

window.updateBookingStatus = updateBookingStatus;
window.deleteBookingEntry = deleteBookingEntry;
window.deleteGalleryItem = deleteGalleryItem;
window.deleteOfferItem = deleteOfferItem;
window.resetToDemoData = resetToDemoData;

function staffImage(src) { return src && src.startsWith('images/') ? '../'+src : src; }
