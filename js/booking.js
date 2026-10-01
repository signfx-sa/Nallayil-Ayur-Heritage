/**
 * Nallayil Ayurveda - Real-Time Slot Booking Engine
 */

document.addEventListener('DOMContentLoaded', () => {
  initBookingWizard();
});

function initBookingWizard() {
  const bookingForm = document.getElementById('appointment-booking-form');
  const branchSelect = document.getElementById('booking-branch');
  const doctorSelect = document.getElementById('booking-doctor');
  const treatmentSelect = document.getElementById('booking-treatment');
  const dateInput = document.getElementById('booking-date');
  const slotsContainer = document.getElementById('booking-slots-container');
  const selectedSlotInput = document.getElementById('selected-time-slot');

  if (!bookingForm) return;

  // Set min date to today
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  const todayStr = `${yyyy}-${mm}-${dd}`;
  
  if (dateInput) {
    dateInput.min = todayStr;
    // Set default date to tomorrow or today
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tmY = tomorrow.getFullYear();
    const tmM = String(tomorrow.getMonth() + 1).padStart(2, '0');
    const tmD = String(tomorrow.getDate()).padStart(2, '0');
    dateInput.value = `${tmY}-${tmM}-${tmD}`;
  }

  // Populate Treatments dropdown from NALLAYIL_DATA
  if (treatmentSelect && window.NALLAYIL_DATA) {
    treatmentSelect.innerHTML = '<option value="">-- Select Treatment or Health Concern --</option>' +
      window.NALLAYIL_DATA.treatments.map(t => `<option value="${t.title}">${t.title}</option>`).join('');
  }

  // Handle URL query parameters (e.g. ?treatment=..., ?offer=..., ?doctor=...)
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.has('treatment') && treatmentSelect) {
    treatmentSelect.value = urlParams.get('treatment');
  }
  if (urlParams.has('doctor') && doctorSelect) {
    const docParam = urlParams.get('doctor');
    Array.from(doctorSelect.options).forEach(opt => {
      if (opt.text.toLowerCase().includes(docParam.toLowerCase())) {
        doctorSelect.value = opt.value;
      }
    });
  }
  if (urlParams.has('offer')) {
    const offerTitle = urlParams.get('offer');
    const notesInput = document.getElementById('booking-notes');
    if (notesInput) {
      notesInput.value = `Applied Offer / Package: ${offerTitle}`;
    }
  }

  // Populate doctor based on branch
  function updateDoctorsByBranch() {
    if (!doctorSelect || !window.NALLAYIL_DATA) return;
    const branchVal = branchSelect ? branchSelect.value : 'all';

    let docs = window.NALLAYIL_DATA.doctors;
    if (branchVal && branchVal !== 'all') {
      const bObj = window.NALLAYIL_DATA.branches.find(b => b.id === branchVal);
      if (bObj) {
        docs = docs.filter(d => d.branch.toLowerCase().includes(bObj.name.split(' ')[0].toLowerCase()));
      }
    }

    doctorSelect.innerHTML = '<option value="Any Available Specialist">Any Available Senior Specialist</option>' +
      docs.map(d => `<option value="${d.name}">${d.name} (${d.specialty.split(',')[0]})</option>`).join('');
    
    renderAvailableSlots();
  }

  if (branchSelect) {
    branchSelect.addEventListener('change', updateDoctorsByBranch);
  }

  if (doctorSelect) {
    doctorSelect.addEventListener('change', renderAvailableSlots);
  }

  if (dateInput) {
    dateInput.addEventListener('change', renderAvailableSlots);
  }

    // Standard Available Time Slots Matrix (Manjeri Heritage Hospital)
  const standardSlots = [
    { 
      group: "Morning Consultation", 
      timing: "09:00 AM – 12:00 PM",
      icon: "fa-sun",
      slots: ["09:00 AM - 09:45 AM", "09:45 AM - 10:30 AM", "10:30 AM - 11:15 AM", "11:15 AM - 12:00 PM"] 
    },
    { 
      group: "Afternoon Consultation", 
      timing: "02:30 PM – 04:45 PM",
      icon: "fa-cloud-sun",
      slots: ["02:30 PM - 03:15 PM", "03:15 PM - 04:00 PM", "04:00 PM - 04:45 PM"] 
    },
    { 
      group: "Evening Consultation", 
      timing: "05:15 PM – 07:30 PM",
      icon: "fa-moon",
      slots: ["05:15 PM - 06:00 PM", "06:00 PM - 06:45 PM", "06:45 PM - 07:30 PM"] 
    }
  ];

  // Check which slots are already booked
    function renderAvailableSlots() {
    if (!slotsContainer) return;

    const selectedDate = dateInput ? dateInput.value : '';
    const selectedBranch = branchSelect ? branchSelect.value : 'Manjeri Heritage Hospital';
    const selectedDoctor = doctorSelect ? doctorSelect.value : '';

    const existingBookings = window.NallayilStore ? window.NallayilStore.getBookings() : [];

    // Filter booked slots on this date
    const bookedTimeSlots = existingBookings
      .filter(b => b.date === selectedDate && b.status !== 'Cancelled')
      .map(b => b.timeSlot);

    let html = '';
    standardSlots.forEach(group => {
      html += `
        <div class="slot-group-block">
          <div class="slot-group-header">
            <span class="slot-group-title">
              <i class="fas ${group.icon}" style="color:var(--accent-gold);margin-right:8px;"></i>${group.group}
            </span>
            <span class="slot-group-timing">${group.timing}</span>
          </div>
          <div class="slot-pills-grid">`;
      
      group.slots.forEach(slot => {
        const isBooked = bookedTimeSlots.includes(slot);
        if (isBooked) {
          html += `<button type="button" class="time-slot-btn disabled" title="Slot Already Booked">${slot} <span class="slot-badge-full">FULL</span></button>`;
        } else {
          html += `<button type="button" class="time-slot-btn" onclick="selectTimeSlot(this, '${slot}')">${slot}</button>`;
        }
      });

      html += `
          </div>
        </div>`;
    });

    slotsContainer.innerHTML = html;

    // Reset selected slot
    if (selectedSlotInput) selectedSlotInput.value = '';
  }

  // Initial call
  updateDoctorsByBranch();

  // Booking Form Submission
  bookingForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const patientName = document.getElementById('booking-name').value.trim();
    const phone = document.getElementById('booking-phone').value.trim();
    const email = document.getElementById('booking-email').value.trim();
    const age = document.getElementById('booking-age').value;
    const gender = document.getElementById('booking-gender').value;
    const branchName = branchSelect.options[branchSelect.selectedIndex].text;
    const branchId = branchSelect.value;
    const doctorName = doctorSelect.value;
    const treatment = treatmentSelect.value;
    const dateVal = dateInput.value;
    const slotVal = selectedSlotInput.value;
    const mode = document.getElementById('booking-mode').value;
    const notes = document.getElementById('booking-notes').value.trim();

    if (!slotVal) {
      alert("Please select a convenient time slot from the available options above.");
      return;
    }

    if (!phone || phone.length < 10) {
      alert("Please enter a valid 10-digit phone number.");
      return;
    }

    // Generate unique reference
    const randomCode = Math.floor(1000 + Math.random() * 9000);
    const bookingRef = `NAL-${yyyy}-${randomCode}`;

    const newBooking = {
      id: bookingRef,
      patientName: patientName,
      phone: phone,
      email: email || 'Not Provided',
      age: age || 'N/A',
      gender: gender || 'N/A',
      branch: branchName,
      branchId: branchId,
      doctor: doctorName,
      treatment: treatment || 'General Consultation',
      date: dateVal,
      timeSlot: slotVal,
      mode: mode,
      notes: notes || 'No specific symptoms noted.',
      status: "Confirmed",
      createdDate: new Date().toISOString()
    };

    // Save into localStorage store
    if (window.NallayilStore) {
      window.NallayilStore.addBooking(newBooking);
    }

    // Show Confirmation Receipt Modal
    displayBookingReceipt(newBooking);

    // Reset Form
    bookingForm.reset();
    renderAvailableSlots();
  });
}

function selectTimeSlot(btnEl, slotText) {
  document.querySelectorAll('.time-slot-btn').forEach(b => b.classList.remove('selected'));
  btnEl.classList.add('selected');
  const input = document.getElementById('selected-time-slot');
  if (input) input.value = slotText;
}

function displayBookingReceipt(booking) {
  const modal = document.getElementById('booking-receipt-modal');
  if (!modal) {
    alert(`Appointment Confirmed!\nBooking ID: ${booking.id}\nDate: ${booking.date}\nTime: ${booking.timeSlot}`);
    return;
  }

  document.getElementById('receipt-ref').textContent = booking.id;
  document.getElementById('receipt-patient').textContent = booking.patientName;
  document.getElementById('receipt-phone').textContent = booking.phone;
  document.getElementById('receipt-branch').textContent = booking.branch;
  document.getElementById('receipt-doctor').textContent = booking.doctor;
  document.getElementById('receipt-treatment').textContent = booking.treatment;
  document.getElementById('receipt-datetime').textContent = `${booking.date} (${booking.timeSlot})`;
  document.getElementById('receipt-mode').textContent = booking.mode;

  // WhatsApp share link
  const waBtn = document.getElementById('receipt-whatsapp-btn');
  if (waBtn) {
    const waText = `Hello Nallayil Ayurveda, I have booked an appointment.\nRef ID: ${booking.id}\nPatient: ${booking.patientName}\nDate: ${booking.date} at ${booking.timeSlot}\nBranch: ${booking.branch}\nDoctor: ${booking.doctor}`;
    waBtn.href = `https://wa.me/919961003718?text=${encodeURIComponent(waText)}`;
  }

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function printBookingReceipt() {
  window.print();
}

window.selectTimeSlot = selectTimeSlot;
window.printBookingReceipt = printBookingReceipt;
