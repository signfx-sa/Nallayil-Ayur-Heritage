/**
 * Nallayil Ayurveda - Comprehensive Admin Control Center Engine
 * Features:
 * - Cryptographic Authentication (SHA-256 with Salt - Credentials Hidden from Web Inspect)
 * - "Publish to Webpage" Live Synchronization
 * - Full CRUD for Treatments, Ayurveda Journal, Doctors, Booking Options, Offers, Gallery
 * - Real-Time Image Upload with Base64 FileReader conversion and Instant Preview
 */

// Cryptographic Security Config (Credentials never stored as plain text)
const SECURE_AUTH_CONFIG = {
  hash: "fbc474499c0c2a9729475c64b30241e4012968e05f9e3b75e4ea733376e88ae2",
  salt: "NallayilAyurvedaSecureSalt2026"
};

// SHA-256 helper using standard browser Web Crypto API
async function computeSha256Hex(message) {
  const encoder = new TextEncoder();
  const data = encoder.encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Check session on load
document.addEventListener('DOMContentLoaded', () => {
  checkAdminSession();
  setupSidebarNavigation();
});

function checkAdminSession() {
  const token = sessionStorage.getItem('nallayil_admin_token');
  const gate = document.getElementById('adminAuthGate');
  const app = document.getElementById('adminAppWrapper');

  if (token) {
    if (gate) gate.style.display = 'none';
    if (app) app.style.display = 'flex';
    initAdminDataPanels();
  } else {
    if (gate) gate.style.display = 'flex';
    if (app) app.style.display = 'none';
  }
}

async function verifyAdminCredentials() {
  const user = document.getElementById('authUsernameInput')?.value || '';
  const pass = document.getElementById('authPasswordInput')?.value || '';
  const errorMsg = document.getElementById('authErrorMessage');

  if (!user || !pass) return;

  const combined = `${user.trim()}:${pass}:${SECURE_AUTH_CONFIG.salt}`;
  try {
    const computed = await computeSha256Hex(combined);
    if (computed === SECURE_AUTH_CONFIG.hash) {
      sessionStorage.setItem('nallayil_admin_token', 'auth_' + Date.now());
      if (errorMsg) errorMsg.style.display = 'none';
      checkAdminSession();
    } else {
      if (errorMsg) {
        errorMsg.style.display = 'block';
        errorMsg.textContent = 'Invalid credentials. Access denied.';
      }
    }
  } catch(e) {
    console.error('Crypto error:', e);
    if (errorMsg) {
      errorMsg.style.display = 'block';
      errorMsg.textContent = 'Authentication error. Please retry.';
    }
  }
}

function adminLogout() {
  sessionStorage.removeItem('nallayil_admin_token');
  window.location.reload();
}

// --------------------------------------------------------------------------
// Navigation Tabs
// --------------------------------------------------------------------------
function setupSidebarNavigation() {
  const links = document.querySelectorAll('.sidebar-link[data-tab]');
  const panels = document.querySelectorAll('.tab-panel');
  const title = document.getElementById('pageTitle');

  links.forEach(link => {
    link.addEventListener('click', () => {
      const tab = link.getAttribute('data-tab');
      links.forEach(l => l.classList.remove('active'));
      link.classList.add('active');

      panels.forEach(panel => {
        panel.classList.remove('active');
        if (panel.id === `panel-${tab}`) {
          panel.classList.add('active');
        }
      });

      if (title) {
        title.textContent = link.querySelector('span')?.textContent || 'Control Center';
      }
    });
  });
}

// --------------------------------------------------------------------------
// "Publish to Webpage" Live Synchronization
// --------------------------------------------------------------------------
function handlePublishToWebpage() {
  if (typeof NallayilStore === 'undefined') return;

  const timeStr = NallayilStore.publishAll();
  const timeSpan = document.getElementById('lastPublishedTime');
  if (timeSpan) timeSpan.textContent = timeStr;

  // Visual success feedback
  const toast = document.createElement('div');
  toast.style.cssText = 'position:fixed; top:24px; right:24px; background:#087A24; color:#fff; padding:16px 28px; border-radius:50px; font-weight:700; z-index:999999; box-shadow:0 10px 30px rgba(0,0,0,0.25); display:flex; align-items:center; gap:10px; font-family:Inter,sans-serif; animation:slideIn 0.3s ease;';
  toast.innerHTML = '<i class="fas fa-check-circle" style="font-size:1.2rem;"></i> <span>Changes successfully published to website!</span>';
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.4s ease';
    setTimeout(() => toast.remove(), 400);
  }, 2400);
}

// --------------------------------------------------------------------------
// Image File Upload Helper (converts to base64 Data URL)
// --------------------------------------------------------------------------
function handleImageFileUpload(fileInput, textInputId, previewImgId) {
  if (!fileInput.files || !fileInput.files[0]) return;
  const file = fileInput.files[0];

  const reader = new FileReader();
  reader.onload = function(e) {
    const dataUrl = e.target.result;
    const textInput = document.getElementById(textInputId);
    const previewImg = document.getElementById(previewImgId);

    if (textInput) textInput.value = dataUrl;
    if (previewImg) previewImg.src = dataUrl;
  };
  reader.readAsDataURL(file);
}

// --------------------------------------------------------------------------
// Initialize All Admin Data Panels
// --------------------------------------------------------------------------
function initAdminDataPanels() {
  renderDashboardStats();
  renderAdminTreatments();
  renderAdminArticles();
  renderAdminDoctors();
  renderBookingOptions();
  renderAdminBookings();
  renderAdminOffers();
  renderAdminGallery();

  const timeSpan = document.getElementById('lastPublishedTime');
  if (timeSpan && typeof NallayilStore !== 'undefined') {
    timeSpan.textContent = NallayilStore.getLastPublished();
  }

  // Set default date for new article form
  const today = new Date().toISOString().split('T')[0];
  const artDate = document.getElementById('artDate');
  if (artDate && !artDate.value) artDate.value = today;
}

// --------------------------------------------------------------------------
// 1. Dashboard Overview Stats
// --------------------------------------------------------------------------
function renderDashboardStats() {
  if (typeof NallayilStore === 'undefined') return;

  const bookings = NallayilStore.getBookings() || [];
  const treatments = NallayilStore.getTreatments() || [];
  const articles = NallayilStore.getArticles() || [];
  const doctors = NallayilStore.getDoctors() || [];

  const bVal = document.getElementById('dashTotalBookings');
  const tVal = document.getElementById('dashTotalTreatments');
  const aVal = document.getElementById('dashTotalArticles');
  const dVal = document.getElementById('dashTotalDoctors');

  if (bVal) bVal.textContent = bookings.length;
  if (tVal) tVal.textContent = treatments.length;
  if (aVal) aVal.textContent = articles.length;
  if (dVal) dVal.textContent = doctors.length;

  // Populate recent bookings on dashboard
  const tbody = document.getElementById('dashBookingsTableBody');
  if (tbody) {
    const recent = bookings.slice(0, 5);
    tbody.innerHTML = recent.length ? recent.map(b => `
      <tr>
        <td><code>${b.id}</code></td>
        <td><strong>${b.patientName}</strong></td>
        <td><a href="https://wa.me/${b.phone.replace(/[^0-9]/g, '')}" target="_blank" style="color:#087A24; text-decoration:none;"><i class="fab fa-whatsapp"></i> ${b.phone}</a></td>
        <td>${b.date} (${b.timeSlot})</td>
        <td>${b.treatment || 'General'}</td>
        <td><span class="badge ${b.status === 'Confirmed' ? 'badge-success' : 'badge-warning'}">${b.status || 'Pending'}</span></td>
      </tr>
    `).join('') : '<tr><td colspan="6" style="text-align:center; color:#888;">No appointments submitted yet.</td></tr>';
  }
}

// --------------------------------------------------------------------------
// 2. Treatments CRUD Management
// --------------------------------------------------------------------------
function renderAdminTreatments() {
  const tbody = document.getElementById('treatmentsTableBody');
  if (!tbody || typeof NallayilStore === 'undefined') return;

  const treatments = NallayilStore.getTreatments();
  tbody.innerHTML = treatments.map(t => `
    <tr>
      <td><img src="${t.image}" alt="${t.title}" style="width:48px; height:48px; border-radius:10px; object-fit:cover;" onerror="this.src='images/card-therapies.jpg'"></td>
      <td><strong>${t.title}</strong></td>
      <td><span class="badge badge-info">${t.category}</span></td>
      <td>${t.duration || '7-21 Days'}</td>
      <td>
        <button type="button" class="btn btn-outline btn-sm" onclick="editTreatment('${t.id}')" title="Edit Treatment">
          <i class="fas fa-edit"></i>
        </button>
        <button type="button" class="btn btn-outline btn-sm" onclick="deleteTreatment('${t.id}')" style="color:#EF4444; border-color:#EF4444; margin-left:6px;" title="Delete Treatment">
          <i class="fas fa-trash"></i>
        </button>
      </td>
    </tr>
  `).join('');
}

function saveTreatmentData() {
  const editId = document.getElementById('treatEditId').value;
  const title = document.getElementById('treatTitle').value.trim();
  const category = document.getElementById('treatCategory').value.trim();
  const duration = document.getElementById('treatDuration').value.trim();
  const desc = document.getElementById('treatDesc').value.trim();
  const benefitsStr = document.getElementById('treatBenefits').value.trim();
  const image = document.getElementById('treatImage').value.trim() || 'images/card-therapies.jpg';

  if (!title || !category || !desc) {
    alert('Please complete all required fields.');
    return;
  }

  const benefits = benefitsStr ? benefitsStr.split(',').map(s => s.trim()).filter(Boolean) : [];

  if (editId) {
    // Update existing
    NallayilStore.updateTreatment(editId, { title, category, duration, shortDesc: desc, benefits, image });
    alert('Treatment updated successfully! Click "Publish to Webpage" to make changes live.');
  } else {
    // Add new
    const id = 'treat-' + Date.now();
    NallayilStore.addTreatment({ id, title, category, duration, shortDesc: desc, benefits, image });
    alert('New treatment added successfully! Click "Publish to Webpage" to make changes live.');
  }

  resetTreatmentForm();
  renderAdminTreatments();
  renderDashboardStats();
}

function editTreatment(id) {
  const treatments = NallayilStore.getTreatments();
  const t = treatments.find(item => item.id === id);
  if (!t) return;

  document.getElementById('treatEditId').value = t.id;
  document.getElementById('treatTitle').value = t.title || '';
  document.getElementById('treatCategory').value = t.category || '';
  document.getElementById('treatDuration').value = t.duration || '';
  document.getElementById('treatDesc').value = t.shortDesc || t.description || '';
  document.getElementById('treatBenefits').value = (t.benefits || []).join(', ');
  document.getElementById('treatImage').value = t.image || '';
  document.getElementById('treatImagePreview').src = t.image || 'images/card-therapies.jpg';

  document.getElementById('treatmentFormHeader').textContent = `Editing: ${t.title}`;
  document.getElementById('saveTreatmentBtn').innerHTML = '<i class="fas fa-check"></i> Update Treatment';
  document.getElementById('cancelTreatEditBtn').style.display = 'inline-block';

  // Smooth scroll to form
  document.getElementById('panel-treatments').scrollIntoView({ behavior: 'smooth' });
}

function resetTreatmentForm() {
  document.getElementById('treatmentForm').reset();
  document.getElementById('treatEditId').value = '';
  document.getElementById('treatmentFormHeader').textContent = 'Add / Edit Specialized Treatment';
  document.getElementById('saveTreatmentBtn').innerHTML = '<i class="fas fa-save"></i> Save Treatment';
  document.getElementById('cancelTreatEditBtn').style.display = 'none';
  document.getElementById('treatImagePreview').src = 'images/card-therapies.jpg';
}

function deleteTreatment(id) {
  if (!confirm('Are you sure you want to delete this treatment?')) return;
  NallayilStore.deleteTreatment(id);
  renderAdminTreatments();
  renderDashboardStats();
}

// --------------------------------------------------------------------------
// 3. Ayurveda Journal CRUD Management
// --------------------------------------------------------------------------
function renderAdminArticles() {
  const tbody = document.getElementById('articlesTableBody');
  if (!tbody || typeof NallayilStore === 'undefined') return;

  const articles = NallayilStore.getArticles();
  articles.sort((a, b) => new Date(b.publishedDate) - new Date(a.publishedDate));

  tbody.innerHTML = articles.map((art, index) => `
    <tr>
      <td>${art.publishedDate}</td>
      <td>
        <strong>${art.title}</strong>
        ${index < 4 ? '<span class="badge badge-success" style="font-size:10px; margin-left:6px;">Home #' + (index + 1) + '</span>' : ''}
      </td>
      <td><span class="badge badge-info">${art.category}</span></td>
      <td>${art.author || 'Senior Physician'}</td>
      <td>
        <button type="button" class="btn btn-outline btn-sm" onclick="editArticle('${art.id}')" title="Edit Article">
          <i class="fas fa-edit"></i>
        </button>
        <button type="button" class="btn btn-outline btn-sm" onclick="deleteArticle('${art.id}')" style="color:#EF4444; border-color:#EF4444; margin-left:6px;" title="Delete Article">
          <i class="fas fa-trash"></i>
        </button>
      </td>
    </tr>
  `).join('');
}

function saveJournalData() {
  const editId = document.getElementById('artEditId').value;
  const title = document.getElementById('artTitle').value.trim();
  const category = document.getElementById('artCategory').value.trim();
  const publishedDate = document.getElementById('artDate').value;
  const author = document.getElementById('artAuthor').value.trim();
  const readTime = document.getElementById('artReadTime').value.trim() || '5 min read';
  const excerpt = document.getElementById('artExcerpt').value.trim();
  const image = document.getElementById('artImage').value.trim() || 'images/card-wellness.jpg';

  if (!title || !category || !excerpt || !publishedDate) {
    alert('Please fill all required fields.');
    return;
  }

  let articles = NallayilStore.getArticles();

  if (editId) {
    const idx = articles.findIndex(a => a.id === editId);
    if (idx !== -1) {
      articles[idx] = { ...articles[idx], title, category, publishedDate, author, readTime, excerpt, image };
      NallayilStore.saveArticles(articles);
      alert('Article updated successfully! Click "Publish to Webpage" to make changes live.');
    }
  } else {
    const id = 'art-' + Date.now();
    const newArt = { id, title, category, publishedDate, author, readTime, excerpt, image };
    NallayilStore.addArticle(newArt);
    alert('Article published to CMS successfully! Click "Publish to Webpage" to make changes live.');
  }

  resetArticleForm();
  renderAdminArticles();
  renderDashboardStats();
}

function editArticle(id) {
  const articles = NallayilStore.getArticles();
  const art = articles.find(a => a.id === id);
  if (!art) return;

  document.getElementById('artEditId').value = art.id;
  document.getElementById('artTitle').value = art.title || '';
  document.getElementById('artCategory').value = art.category || '';
  document.getElementById('artDate').value = art.publishedDate || '';
  document.getElementById('artAuthor').value = art.author || '';
  document.getElementById('artReadTime').value = art.readTime || '';
  document.getElementById('artExcerpt').value = art.excerpt || '';
  document.getElementById('artImage').value = art.image || '';
  document.getElementById('artImagePreview').src = art.image || 'images/card-wellness.jpg';

  document.getElementById('journalFormHeader').textContent = `Editing: ${art.title}`;
  document.getElementById('saveArticleBtn').innerHTML = '<i class="fas fa-check"></i> Update Article';
  document.getElementById('cancelArticleEditBtn').style.display = 'inline-block';

  document.getElementById('panel-journal').scrollIntoView({ behavior: 'smooth' });
}

function resetArticleForm() {
  document.getElementById('journalForm').reset();
  document.getElementById('artEditId').value = '';
  document.getElementById('journalFormHeader').textContent = 'Publish New Journal Article';
  document.getElementById('saveArticleBtn').innerHTML = '<i class="fas fa-plus-circle"></i> Save Article';
  document.getElementById('cancelArticleEditBtn').style.display = 'none';
  document.getElementById('artImagePreview').src = 'images/card-wellness.jpg';
  document.getElementById('artDate').value = new Date().toISOString().split('T')[0];
}

function deleteArticle(id) {
  if (!confirm('Are you sure you want to delete this article?')) return;
  let articles = NallayilStore.getArticles();
  articles = articles.filter(a => a.id !== id);
  NallayilStore.saveArticles(articles);
  renderAdminArticles();
  renderDashboardStats();
}

// --------------------------------------------------------------------------
// 4. Doctors & Booking Options Management
// --------------------------------------------------------------------------
function renderAdminDoctors() {
  const tbody = document.getElementById('doctorsTableBody');
  if (!tbody || typeof NallayilStore === 'undefined') return;

  const doctors = NallayilStore.getDoctors();
  tbody.innerHTML = doctors.map(d => `
    <tr>
      <td><img src="${d.image}" alt="${d.name}" style="width:44px; height:44px; border-radius:50%; object-fit:cover;" onerror="this.src='https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=200&q=80'"></td>
      <td><strong>${d.name}</strong><br><small style="color:#666;">${d.designation || ''}</small></td>
      <td>${d.qualification}</td>
      <td>${d.specialty}</td>
      <td>
        <button type="button" class="btn btn-outline btn-sm" onclick="editDoctor('${d.id}')" title="Edit Doctor">
          <i class="fas fa-edit"></i>
        </button>
        <button type="button" class="btn btn-outline btn-sm" onclick="deleteDoctor('${d.id}')" style="color:#EF4444; border-color:#EF4444; margin-left:6px;" title="Delete Doctor">
          <i class="fas fa-trash"></i>
        </button>
      </td>
    </tr>
  `).join('');
}

function saveDoctorData() {
  const editId = document.getElementById('docEditId').value;
  const name = document.getElementById('docName').value.trim();
  const qualification = document.getElementById('docQual').value.trim();
  const experience = document.getElementById('docExp').value.trim();
  const specialty = document.getElementById('docSpecialty').value.trim();
  const image = document.getElementById('docImage').value.trim() || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=200&q=80';

  if (!name || !qualification || !specialty) {
    alert('Please fill required fields.');
    return;
  }

  if (editId) {
    NallayilStore.updateDoctor(editId, { name, qualification, experience, specialty, image });
    alert('Doctor details updated! Click "Publish to Webpage" to make changes live.');
  } else {
    const id = 'doc-' + Date.now();
    NallayilStore.addDoctor({ id, name, qualification, experience, specialty, designation: "Consultant Physician", branch: "Manjeri Heritage Hospital", image });
    alert('New physician added! Click "Publish to Webpage" to make changes live.');
  }

  resetDoctorForm();
  renderAdminDoctors();
  renderDashboardStats();
}

function editDoctor(id) {
  const doctors = NallayilStore.getDoctors();
  const d = doctors.find(item => item.id === id);
  if (!d) return;

  document.getElementById('docEditId').value = d.id;
  document.getElementById('docName').value = d.name || '';
  document.getElementById('docQual').value = d.qualification || '';
  document.getElementById('docExp').value = d.experience || '';
  document.getElementById('docSpecialty').value = d.specialty || '';
  document.getElementById('docImage').value = d.image || '';
  document.getElementById('docImagePreview').src = d.image;

  document.getElementById('doctorFormHeader').textContent = `Editing: ${d.name}`;
  document.getElementById('saveDoctorBtn').innerHTML = '<i class="fas fa-check"></i> Update Physician';
  document.getElementById('cancelDocEditBtn').style.display = 'inline-block';
}

function resetDoctorForm() {
  document.getElementById('doctorForm').reset();
  document.getElementById('docEditId').value = '';
  document.getElementById('doctorFormHeader').textContent = 'Add / Edit Hospital Physician';
  document.getElementById('saveDoctorBtn').innerHTML = '<i class="fas fa-save"></i> Save Physician';
  document.getElementById('cancelDocEditBtn').style.display = 'none';
}

function deleteDoctor(id) {
  if (!confirm('Are you sure you want to remove this doctor?')) return;
  NallayilStore.deleteDoctor(id);
  renderAdminDoctors();
  renderDashboardStats();
}

// Booking Sheet Treatment Options List
function renderBookingOptions() {
  const listEl = document.getElementById('bookingOptionsList');
  if (!listEl || typeof NallayilStore === 'undefined') return;

  const options = NallayilStore.getBookingTreatments();
  listEl.innerHTML = options.map((opt, idx) => `
    <li style="display:flex; justify-content:space-between; align-items:center; background:#fbf9f4; padding:10px 16px; border-radius:10px; border:1px solid #eef2ed;">
      <span style="font-weight:600; color:#143322;">${opt}</span>
      <button type="button" onclick="deleteBookingOption(${idx})" style="background:transparent; border:none; color:#EF4444; cursor:pointer;" title="Remove Option">
        <i class="fas fa-times-circle" style="font-size:1.1rem;"></i>
      </button>
    </li>
  `).join('');
}

function addBookingOption() {
  const input = document.getElementById('newBookingOptionInput');
  const val = input ? input.value.trim() : '';
  if (!val) return;

  const options = NallayilStore.getBookingTreatments();
  options.push(val);
  NallayilStore.saveBookingTreatments(options);
  input.value = '';
  renderBookingOptions();
}

function deleteBookingOption(idx) {
  const options = NallayilStore.getBookingTreatments();
  options.splice(idx, 1);
  NallayilStore.saveBookingTreatments(options);
  renderBookingOptions();
}

// --------------------------------------------------------------------------
// 5. Bookings Management
// --------------------------------------------------------------------------
function renderAdminBookings() {
  const tbody = document.getElementById('allBookingsTableBody');
  if (!tbody || typeof NallayilStore === 'undefined') return;

  const bookings = NallayilStore.getBookings();
  tbody.innerHTML = bookings.length ? bookings.map(b => `
    <tr>
      <td><code>${b.id}</code></td>
      <td><strong>${b.patientName}</strong></td>
      <td><a href="https://wa.me/${b.phone.replace(/[^0-9]/g, '')}" target="_blank" style="color:#087A24; text-decoration:none;"><i class="fab fa-whatsapp"></i> ${b.phone}</a></td>
      <td>${b.date}<br><small>${b.timeSlot}</small></td>
      <td>${b.doctor || 'Any Specialist'}<br><small style="color:#666;">${b.branch || ''}</small></td>
      <td>${b.treatment || 'General'}</td>
      <td>
        <select onchange="updateBookingStatus('${b.id}', this.value)" style="padding:4px 8px; border-radius:8px; border:1px solid #ccc; font-size:0.82rem;">
          <option value="Confirmed" ${b.status === 'Confirmed' ? 'selected' : ''}>Confirmed</option>
          <option value="Pending" ${b.status === 'Pending' ? 'selected' : ''}>Pending</option>
          <option value="Cancelled" ${b.status === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
          <option value="Completed" ${b.status === 'Completed' ? 'selected' : ''}>Completed</option>
        </select>
      </td>
      <td>
        <a href="https://wa.me/${b.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent('Hello ' + b.patientName + ', this is Nallayil Ayurveda regarding your appointment ' + b.id)}" target="_blank" class="btn btn-outline btn-sm" style="color:#087A24; border-color:#087A24;" title="Chat with Patient">
          <i class="fab fa-whatsapp"></i> Chat
        </a>
      </td>
    </tr>
  `).join('') : '<tr><td colspan="8" style="text-align:center; padding:30px; color:#888;">No appointment records found.</td></tr>';
}

function updateBookingStatus(id, newStatus) {
  let bookings = NallayilStore.getBookings();
  const b = bookings.find(item => item.id === id);
  if (b) {
    b.status = newStatus;
    NallayilStore.saveBookings(bookings);
    renderDashboardStats();
  }
}

// --------------------------------------------------------------------------
// 6. Offers & Nallayil Care Management
// --------------------------------------------------------------------------
function renderAdminOffers() {
  const tbody = document.getElementById('offersTableBody');
  if (!tbody || typeof NallayilStore === 'undefined') return;

  const offers = NallayilStore.getOffers();
  tbody.innerHTML = offers.map(o => `
    <tr>
      <td><strong>${o.title}</strong><br><small style="color:#666;">${o.description || ''}</small></td>
      <td><span class="badge badge-success">${o.discount}</span></td>
      <td>
        <span class="badge ${o.active !== false ? 'badge-success' : 'badge-danger'}">
          ${o.active !== false ? 'Active (Button Visible in Widget)' : 'Hidden (Offer Inactive)'}
        </span>
      </td>
      <td>
        <button type="button" class="btn btn-outline btn-sm" onclick="toggleOfferActive('${o.id}')">
          ${o.active !== false ? 'Deactivate / Hide' : 'Activate & Show'}
        </button>
      </td>
    </tr>
  `).join('');
}

function saveOfferData() {
  const title = document.getElementById('offTitle').value.trim();
  const discount = document.getElementById('offDiscount').value.trim();
  const description = document.getElementById('offDesc').value.trim();
  const image = document.getElementById('offImage').value.trim() || 'images/card-wellness.jpg';

  if (!title || !discount) return;

  const id = 'offer-' + Date.now();
  const newOffer = { id, title, discount, description, image, active: true };

  let offers = NallayilStore.getOffers();
  offers.unshift(newOffer);
  NallayilStore.saveOffers(offers);

  alert('Offer activated! It will now appear on the website and inside the Nallayil Care floating button upon clicking Publish.');
  document.getElementById('offerForm').reset();
  renderAdminOffers();
}

function toggleOfferActive(id) {
  let offers = NallayilStore.getOffers();
  const o = offers.find(item => item.id === id);
  if (o) {
    o.active = o.active === false ? true : false;
    NallayilStore.saveOffers(offers);
    renderAdminOffers();
  }
}

// --------------------------------------------------------------------------
// 7. Gallery Management
// --------------------------------------------------------------------------
function renderAdminGallery() {
  const tbody = document.getElementById('galleryTableBody');
  if (!tbody || typeof NallayilStore === 'undefined') return;

  const gallery = NallayilStore.getGallery();
  tbody.innerHTML = gallery.map(g => `
    <tr>
      <td><img src="${g.url}" alt="${g.title}" style="width:54px; height:54px; border-radius:10px; object-fit:cover;" onerror="this.src='images/about-nallayil.jpg'"></td>
      <td><strong>${g.title}</strong></td>
      <td><span class="badge badge-info">${g.category}</span></td>
      <td>
        <button type="button" class="btn btn-outline btn-sm" onclick="deleteGalleryPhoto('${g.id}')" style="color:#EF4444; border-color:#EF4444;">
          <i class="fas fa-trash"></i>
        </button>
      </td>
    </tr>
  `).join('');
}

function saveGalleryPhoto() {
  const title = document.getElementById('galTitle').value.trim();
  const category = document.getElementById('galCategory').value;
  const url = document.getElementById('galImage').value.trim();

  if (!title || !url) return;

  const id = 'gal-' + Date.now();
  const newPhoto = { id, title, category, url };

  let gallery = NallayilStore.getGallery();
  gallery.unshift(newPhoto);
  NallayilStore.saveGallery(gallery);

  alert('Photo added to gallery! Click "Publish to Webpage" to make changes live.');
  document.getElementById('galleryUploadForm').reset();
  renderAdminGallery();
}

function deleteGalleryPhoto(id) {
  if (!confirm('Remove this photo from gallery?')) return;
  let gallery = NallayilStore.getGallery();
  gallery = gallery.filter(g => g.id !== id);
  NallayilStore.saveGallery(gallery);
  renderAdminGallery();
}

// Export functions to global scope
window.verifyAdminCredentials = verifyAdminCredentials;
window.adminLogout = adminLogout;
window.handlePublishToWebpage = handlePublishToWebpage;
window.handleImageFileUpload = handleImageFileUpload;
window.saveTreatmentData = saveTreatmentData;
window.editTreatment = editTreatment;
window.resetTreatmentForm = resetTreatmentForm;
window.deleteTreatment = deleteTreatment;
window.saveJournalData = saveJournalData;
window.editArticle = editArticle;
window.resetArticleForm = resetArticleForm;
window.deleteArticle = deleteArticle;
window.saveDoctorData = saveDoctorData;
window.editDoctor = editDoctor;
window.resetDoctorForm = resetDoctorForm;
window.deleteDoctor = deleteDoctor;
window.addBookingOption = addBookingOption;
window.deleteBookingOption = deleteBookingOption;
window.updateBookingStatus = updateBookingStatus;
window.saveOfferData = saveOfferData;
window.toggleOfferActive = toggleOfferActive;
window.saveGalleryPhoto = saveGalleryPhoto;
window.deleteGalleryPhoto = deleteGalleryPhoto;
