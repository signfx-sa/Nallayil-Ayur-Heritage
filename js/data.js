/**
 * Nallayil Ayurveda - Shared Data Store & LocalStorage Sync
 */

const NALLAYIL_DATA = {
    branches: [
    {
      id: "manjeri",
      name: "Manjeri Heritage Hospital",
      district: "Malappuram",
      address: "Near ALP School, Mullampara, Manjeri, Malappuram, Kerala – 676122",
      phone: "+91 99610 03718",
      whatsapp: "919961003718",
      email: "care@nallayilayurveda.com",
      timing: "Mon - Sun: 08:30 AM - 08:00 PM | 24/7 In-Patient",
      mapQuery: "Nallayil+Ayurveda+Hospital+Mullampara+Manjeri"
    }
  ],

  doctors: [
    {
      id: "dr-shafi",
      name: "Dr. Muhammed Shafi Nallayil",
      qualification: "BAMS, Chief Marma & Spine Specialist",
      experience: "22+ Years of Clinical Excellence",
      designation: "Chief Physician & Managing Director",
      specialty: "Marma Chikitsa, Spine & Disc Prolapse, Joint Pain",
      branch: "Manjeri Heritage Hospital",
      bio: "Renowned expert in traditional Malabar Marma therapy, successfully reversing spine conditions without surgical intervention.",
      image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: "dr-suhara",
      name: "Dr. Fathimath Suhara",
      qualification: "BAMS, MD (Ayur - Panchakarma)",
      experience: "16+ Years Experience",
      designation: "Head of Panchakarma & Gynaecology",
      specialty: "Panchakarma Detox, PCOD, Infertility & Women's Care",
      branch: "Manjeri Heritage Hospital",
      bio: "Specialist in classical detoxification, metabolic balance, and holistic post-natal Ayurvedic healthcare.",
      image: "https://images.unsplash.com/photo-1594824813583-02f8298a8341?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: "dr-anoop",
      name: "Dr. Anoop Narayanan",
      qualification: "BAMS, Fellow in Orthopedic Rehabilitation",
      experience: "12+ Years Experience",
      designation: "Senior Consultant Ortho & Arthritis Care",
      specialty: "Osteoarthritis, Knee Pain, Sciatica, Neck Pain",
      branch: "Manjeri Heritage Hospital",
      bio: "Expertise in musculoskeletal rejuvenation, Kizhi therapies, Janu Vasthi, and rehabilitation.",
      image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: "dr-reshma",
      name: "Dr. Reshma K.",
      qualification: "BAMS, Certified Stress & Mind Wellness",
      experience: "9+ Years Experience",
      designation: "Consultant Physician - Lifestyle & Neuro Care",
      specialty: "Migraine, Insomnia, Skin & Allergy Management",
      branch: "Manjeri Heritage Hospital",
      bio: "Holistic physician blending personalized dietetics, herbal infusions, and Shirodhara for psychosomatic relief.",
      image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=600&q=80"
    }
  ],

  treatments: [
    {
      id: "marma-chikitsa",
      title: "Marma Chikitsa (മർമ്മ ചികിത്സ)",
      category: "Spine & Pain",
      shortDesc: "Ancient vital pressure point therapy for immediate pain relief and anatomical re-alignment.",
      duration: "7 - 21 Days",
      benefits: ["Relieves acute nerve compression", "Corrects postural imbalances", "Restores joint flexibility without surgery"],
      image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: "spine-disc-care",
      title: "Spine & Disc Rehabilitation",
      category: "Spine & Pain",
      shortDesc: "Complete conservative non-surgical management for Slip Disc, Sciatica, Cervical & Lumbar Spondylosis.",
      duration: "14 - 28 Days",
      benefits: ["Kati Vasthi & Elakizhi therapies", "Relieves radiating leg and arm numbness", "Strengthens paraspinal musculature"],
      image: "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: "panchakarma-detox",
      title: "Classical Panchakarma Detox",
      category: "Detox & Wellness",
      shortDesc: "Five-fold bio-purification to eliminate deep seated cellular toxins and rejuvenate body vitality.",
      duration: "7, 14 or 21 Days",
      benefits: ["Boosts digestive fire (Agni)", "Purges toxins from bloodstream", "Restores tri-dosha equilibrium (Vata, Pitta, Kapha)"],
      image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: "arthritis-knee-care",
      title: "Joint & Arthritis Care",
      category: "Spine & Pain",
      shortDesc: "Holistic care for Osteoarthritis, Rheumatoid Arthritis, Gout, and severe Knee Pain.",
      duration: "10 - 21 Days",
      benefits: ["Janu Vasthi for knee cartilage lubrication", "Reduces chronic swelling and stiffness", "Improves daily painless walking mobility"],
      image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: "stroke-rehab",
      title: "Stroke & Paralysis Recovery",
      category: "Neuro & Rehab",
      shortDesc: "Specialized neuro-muscular regeneration program combining herbal steam, Njavarakizhi & internal medications.",
      duration: "21 - 45 Days In-Patient",
      benefits: ["Stimulates motor nerve pathways", "Reduces spasticity and muscle wasting", "Improves speech and limb coordination"],
      image: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: "stress-shirodhara",
      title: "Stress, Insomnia & Shirodhara",
      category: "Mind & Sleep",
      shortDesc: "Continuous gentle pouring of medicated herbal oils or buttermilk over the forehead for deep calm.",
      duration: "3 - 7 Sessions",
      benefits: ["Induces deep restful sleep", "Regulates nervous system and cortisol", "Alleviates chronic tension headaches and migraines"],
      image: "https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: "skin-allergy",
      title: "Skin, Psoriasis & Allergy Care",
      category: "Skin & Allergy",
      shortDesc: "Gentle natural cleansing with internal blood purifiers and external herbal lepams for lasting skin health.",
      duration: "14 - 30 Days",
      benefits: ["Clears itching, scaling and redness", "Purifies Rakta and Pitta doshas", "Prevents allergic recurrence safely"],
      image: "https://images.unsplash.com/photo-1512290900672-1f41d087b7ef?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: "womens-postnatal",
      title: "Women's Health & Postnatal Care",
      category: "Women's Health",
      shortDesc: "Herbal hormonal harmony, PCOD care, and traditional post-delivery mother care (Sutika Paricharya).",
      duration: "14 - 28 Days",
      benefits: ["Normalizes menstrual cycles", "Strengthens pelvic floor and spine after delivery", "Rebalances metabolism and vitality naturally"],
      image: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=800&q=80"
    }
  ],

  initialOffers: [
    {
      id: "off-1",
      title: "Karkidaka Chikitsa & Monsoon Wellness Package",
      badge: "25% OFF",
      validTill: "2026-11-30",
      description: "Rejuvenate your immunity during the traditional healing season. Includes 7 days of customized Abhyangam, Herbal Steam, Shirodhara, and Oushadha Kanji diet.",
      code: "KARKIDAKA26",
      featured: true,
      image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: "off-2",
      title: "Comprehensive Spine & Joint Checkup Camp",
      badge: "FREE CONSULTATION",
      validTill: "2026-10-31",
      description: "Free Marma and Orthopedic assessment by Senior Doctors at Manjeri Heritage Hospital every Saturday. Free digital health analysis report.",
      code: "SPINECAMP",
      featured: true,
      image: "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: "off-3",
      title: "Ayur Home In-Patient Stay Discount",
      badge: "15% OFF STAY",
      validTill: "2026-12-31",
      description: "Special concession on traditional garden cottage rooms for 14+ days treatments at Manjeri Heritage Hospital In-Patient Suites. Healthy organic sattvic meals included.",
      code: "AYURHOME15",
      featured: false,
      image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80"
    }
  ],

  initialGallery: [
    {
      id: "gal-1",
      title: "Traditional Panchakarma Treatment Suite",
      category: "Facilities",
      description: "Authentic teakwood Droni table crafted according to Vastu and classical Ayurvedic texts.",
      image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80",
      date: "2026-08-15"
    },
    {
      id: "gal-2",
      title: "Fresh Herbal Medicine Preparation",
      category: "Herbal Garden",
      description: "Fresh Kashayams, oils, and churnams prepared with organically harvested medicinal plants.",
      image: "https://images.unsplash.com/photo-1512290900672-1f41d087b7ef?auto=format&fit=crop&w=800&q=80",
      date: "2026-08-20"
    },
    {
      id: "gal-3",
      title: "Therapeutic Shirodhara Session",
      category: "Treatments",
      description: "Continuous rhythmic stream of medicated herbal oils promoting mental tranquility.",
      image: "https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?auto=format&fit=crop&w=800&q=80",
      date: "2026-09-02"
    },
    {
      id: "gal-4",
      title: "Manjeri Heritage Hospital Campus",
      category: "Ayur Home",
      description: "Serene natural environment providing optimal rest and recuperation for in-patients.",
      image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80",
      date: "2026-09-05"
    },
    {
      id: "gal-5",
      title: "Doctor Consultation & Pulse Diagnosis",
      category: "Clinical Care",
      description: "Detailed Nadi Pariksha and personalized lifestyle analysis for root-cause healing.",
      image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=800&q=80",
      date: "2026-09-10"
    },
    {
      id: "gal-6",
      title: "Patra Pinda Sweda (Herbal Kizhi)",
      category: "Treatments",
      description: "Warm herbal boluses applied with medicated oils for rapid relief from spine and joint pains.",
      image: "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&w=800&q=80",
      date: "2026-09-14"
    }
  ],

  initialBookings: [
    {
      id: "NAL-2026-1042",
      patientName: "Abdul Rasheed",
      phone: "+91 98471 23456",
      email: "rasheed@example.com",
      branch: "Manjeri Heritage Hospital",
      branchId: "manjeri",
      doctor: "Dr. Muhammed Shafi Nallayil",
      treatment: "Marma Chikitsa (Spine & Pain)",
      date: "2026-09-26",
      timeSlot: "10:15 AM - 11:00 AM",
      mode: "In-Clinic Visit",
      age: 48,
      gender: "Male",
      notes: "Severe lower back pain radiating to left leg for 3 months.",
      status: "Confirmed",
      createdDate: "2026-09-24T10:15:00"
    },
    {
      id: "NAL-2026-1043",
      patientName: "Lakshmi Priya",
      phone: "+91 97455 89012",
      email: "lakshmi.p@example.com",
      branch: "Manjeri Heritage Hospital",
      branchId: "manjeri",
      doctor: "Dr. Fathimath Suhara",
      treatment: "Classical Panchakarma Detox",
      date: "2026-09-28",
      timeSlot: "02:30 PM - 03:15 PM",
      mode: "Ayur Home In-Patient Stay",
      age: 36,
      gender: "Female",
      notes: "Seeking 14-day rejuvenation detox for stress and metabolic health.",
      status: "Pending",
      createdDate: "2026-09-24T12:30:00"
    },
    {
      id: "NAL-2026-1044",
      patientName: "K. Narayanan Nair",
      phone: "+91 94470 65432",
      email: "narayanan.nair@example.com",
      branch: "Manjeri Heritage Hospital",
      branchId: "manjeri",
      doctor: "Dr. Anoop Narayanan",
      treatment: "Joint & Arthritis Care",
      date: "2026-09-29",
      timeSlot: "11:45 AM - 12:30 PM",
      mode: "In-Clinic Visit",
      age: 62,
      gender: "Male",
      notes: "Bilateral knee joint pain, difficulty climbing stairs.",
      status: "Confirmed",
      createdDate: "2026-09-24T14:45:00"
    }
  ],

  testimonials: [
    {
      name: "Sayyid Sabiq Ali Shihab Thangal",
      place: "Panakkad, Malappuram",
      condition: "Marma Chikitsa & Spine Care",
      comment: "മർമ്മമറിഞ്ഞുള്ള ചികിത്സയാണ് നല്ലയിൽ ആയുർവേദയിൽ. Dr. Shafi and team provide authentic, compassionate care that touches the root cause. Highly recommended for genuine healing.",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80"
    },
    {
      name: "Mohammed Nishad",
      place: "Manjeri",
      condition: "Severe L4-L5 Disc Prolapse",
      comment: "I was advised spinal surgery by multiple doctors. At Nallayil Ayurveda, within 21 days of Marma and Kati Vasthi treatment, my severe leg pain completely vanished without surgery.",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80"
    },
    {
      name: "Fathima Zehra",
      place: "Manjeri",
      condition: "PCOD & Hormonal Imbalance",
      comment: "The care received from Dr. Fathimath Suhara at Ayur Home was life changing. The herbal medicines, disciplined diet, and Panchakarma restored my menstrual cycle naturally.",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80"
    },
    {
      name: "Radhakrishnan Nair",
      place: "Calicut",
      condition: "Osteoarthritis of Both Knees",
      comment: "I could barely walk 100 meters due to knee pain. After the 14-day Janu Vasthi course at Nallayil, I can walk comfortably and climb stairs without support.",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80"
    }
  ],
  initialArticles: [
    {
      id: "marma-spine-relief",
      title: "The Science of Marma: Non-Surgical Relief for Spine & Disc Compressions",
      category: "Marma Chikitsa",
      excerpt: "How vital neuro-muscular pressure points unlock stagnant prana energy, realign lumbar vertebra, and relieve trapped nerve roots naturally.",
      publishedDate: "2026-09-28",
      image: "images/card-marma.jpg",
      readTime: "5 min read",
      author: "Chief Marma Specialist"
    },
    {
      id: "panchakarma-cellular-detox",
      title: "Seasonal Panchakarma Detox: Restoring Cellular Balance & Digestive Agni",
      category: "Panchakarma Science",
      excerpt: "Understanding why systematic 5-fold detoxification resets metabolic fire, eliminates accumulated toxins (Ama), and rejuvenates vital tissues.",
      publishedDate: "2026-09-25",
      image: "images/card-panchakarma.jpg",
      readTime: "7 min read",
      author: "Head of Panchakarma"
    },
    {
      id: "prakriti-dosha-harmony",
      title: "Prakriti & Dosha Harmony: Navigating Chronic Modern Stress with Daily Regimens",
      category: "Holistic Health",
      excerpt: "Simple Dinacharya daily rituals and adaptogenic botanical rasayanas to calm Vata aggravation and soothe nervous system exhaustion.",
      publishedDate: "2026-09-20",
      image: "images/card-wellness.jpg",
      readTime: "6 min read",
      author: "Consultant Physician"
    },
    {
      id: "kizhi-potali-joint-care",
      title: "Kizhi & Potali Therapies: Soothing Joint Stiffness & Osteoarthritis",
      category: "Ortho & Joints",
      excerpt: "How warm medicinal boluses infused with Choornams stimulate synovial circulation, lubricate degenerative cartilage, and alleviate persistent pain.",
      publishedDate: "2026-09-15",
      image: "images/card-therapies.jpg",
      readTime: "6 min read",
      author: "Senior Consultant Ortho"
    },
    {
      id: "shirodhara-sleep-rewire",
      title: "Shirodhara & Deep Sleep: Rewiring the Nervous System for Total Mental Calm",
      category: "Neuro & Mind",
      excerpt: "The neuro-vascular impact of a rhythmic, continuous stream of warm medicated herbal oils across the forehead to soothe autonomic hyperactivity.",
      publishedDate: "2026-09-10",
      image: "images/slider-1.jpg",
      readTime: "5 min read",
      author: "Clinical Neuro Desk"
    }
  ]

};

// Storage helper functions
const NallayilStore = {
  getGallery: function() {
    const data = localStorage.getItem('nallayil_gallery');
    if (!data) {
      localStorage.setItem('nallayil_gallery', JSON.stringify(NALLAYIL_DATA.initialGallery));
      return NALLAYIL_DATA.initialGallery;
    }
    try {
      return JSON.parse(data);
    } catch(e) {
      return NALLAYIL_DATA.initialGallery;
    }
  },

  saveGallery: function(gallery) {
    localStorage.setItem('nallayil_gallery', JSON.stringify(gallery));
    window.dispatchEvent(new CustomEvent('nallayil_gallery_updated'));
  },

  getOffers: function() {
    const data = localStorage.getItem('nallayil_offers');
    if (!data) {
      localStorage.setItem('nallayil_offers', JSON.stringify(NALLAYIL_DATA.initialOffers));
      return NALLAYIL_DATA.initialOffers;
    }
    try {
      return JSON.parse(data);
    } catch(e) {
      return NALLAYIL_DATA.initialOffers;
    }
  },

  saveOffers: function(offers) {
    localStorage.setItem('nallayil_offers', JSON.stringify(offers));
    window.dispatchEvent(new CustomEvent('nallayil_offers_updated'));
  },

  getBookings: function() {
    const data = localStorage.getItem('nallayil_bookings');
    if (!data) {
      localStorage.setItem('nallayil_bookings', JSON.stringify(NALLAYIL_DATA.initialBookings));
      return NALLAYIL_DATA.initialBookings;
    }
    try {
      return JSON.parse(data);
    } catch(e) {
      return NALLAYIL_DATA.initialBookings;
    }
  },

  saveBookings: function(bookings) {
    localStorage.setItem('nallayil_bookings', JSON.stringify(bookings));
    window.dispatchEvent(new CustomEvent('nallayil_bookings_updated'));
  },

  
  getArticles: function() {
    const data = localStorage.getItem('nallayil_articles');
    if (!data) {
      localStorage.setItem('nallayil_articles', JSON.stringify(NALLAYIL_DATA.initialArticles));
      return NALLAYIL_DATA.initialArticles;
    }
    try {
      return JSON.parse(data);
    } catch(e) {
      return NALLAYIL_DATA.initialArticles;
    }
  },

  saveArticles: function(articles) {
    localStorage.setItem('nallayil_articles', JSON.stringify(articles));
    window.dispatchEvent(new CustomEvent('nallayil_articles_updated'));
  },

  addArticle: function(article) {
    const articles = this.getArticles();
    articles.unshift(article);
    this.saveArticles(articles);
    return article;
  },
  
  getTreatments: function() {
    const data = localStorage.getItem('nallayil_treatments');
    if (!data) {
      localStorage.setItem('nallayil_treatments', JSON.stringify(NALLAYIL_DATA.treatments));
      return NALLAYIL_DATA.treatments;
    }
    try {
      return JSON.parse(data);
    } catch(e) {
      return NALLAYIL_DATA.treatments;
    }
  },

  saveTreatments: function(treatments) {
    localStorage.setItem('nallayil_treatments', JSON.stringify(treatments));
    window.dispatchEvent(new CustomEvent('nallayil_treatments_updated'));
  },

  addTreatment: function(treatment) {
    const list = this.getTreatments();
    list.unshift(treatment);
    this.saveTreatments(list);
    return treatment;
  },

  updateTreatment: function(id, updatedData) {
    const list = this.getTreatments();
    const index = list.findIndex(t => t.id === id);
    if (index !== -1) {
      list[index] = { ...list[index], ...updatedData };
      this.saveTreatments(list);
      return list[index];
    }
    return null;
  },

  deleteTreatment: function(id) {
    let list = this.getTreatments();
    list = list.filter(t => t.id !== id);
    this.saveTreatments(list);
    return list;
  },

  getDoctors: function() {
    const data = localStorage.getItem('nallayil_doctors');
    if (!data) {
      localStorage.setItem('nallayil_doctors', JSON.stringify(NALLAYIL_DATA.doctors));
      return NALLAYIL_DATA.doctors;
    }
    try {
      return JSON.parse(data);
    } catch(e) {
      return NALLAYIL_DATA.doctors;
    }
  },

  saveDoctors: function(doctors) {
    localStorage.setItem('nallayil_doctors', JSON.stringify(doctors));
    window.dispatchEvent(new CustomEvent('nallayil_doctors_updated'));
  },

  addDoctor: function(doctor) {
    const list = this.getDoctors();
    list.push(doctor);
    this.saveDoctors(list);
    return doctor;
  },

  updateDoctor: function(id, updatedData) {
    const list = this.getDoctors();
    const index = list.findIndex(d => d.id === id);
    if (index !== -1) {
      list[index] = { ...list[index], ...updatedData };
      this.saveDoctors(list);
      return list[index];
    }
    return null;
  },

  deleteDoctor: function(id) {
    let list = this.getDoctors();
    list = list.filter(d => d.id !== id);
    this.saveDoctors(list);
    return list;
  },

  getBookingTreatments: function() {
    const data = localStorage.getItem('nallayil_booking_treatments');
    if (!data) {
      const defaultList = [
        "Marma Chikitsa (മർമ്മ ചികിത്സ - Spine & Vital Points)",
        "Non-Surgical Spine & Disc Care (Sciatica / Lumbar)",
        "Classical Panchakarma Detox (14-21 Days)",
        "Joint & Arthritis Care (Janu Vasthi / Kizhi)",
        "Stroke & Neurological Rehabilitation",
        "Stress, Insomnia & Shirodhara Mind Therapy",
        "Wellness Therapies (Abhyanga & Rejuvenation)",
        "Botanical Beauty Treatments (Mukha Lepam)",
        "Post-Natal Rejuvenation (Prasava Raksha)",
        "Outpatient Doctor Consultation (OP Clinic)",
        "General Health & Immunity Consultation"
      ];
      localStorage.setItem('nallayil_booking_treatments', JSON.stringify(defaultList));
      return defaultList;
    }
    try {
      return JSON.parse(data);
    } catch(e) {
      return [];
    }
  },

  saveBookingTreatments: function(list) {
    localStorage.setItem('nallayil_booking_treatments', JSON.stringify(list));
    window.dispatchEvent(new CustomEvent('nallayil_booking_treatments_updated'));
  },

  publishAll: function() {
    const now = new Date();
    const timestamp = now.toLocaleDateString('en-IN', {
      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
    localStorage.setItem('nallayil_last_published', timestamp);
    window.dispatchEvent(new CustomEvent('nallayil_data_published', { detail: { timestamp } }));
    return timestamp;
  },

  getLastPublished: function() {
    return localStorage.getItem('nallayil_last_published') || 'Live (Sync Active)';
  },
  addBooking: function(booking) {
    const bookings = this.getBookings();
    bookings.unshift(booking);
    this.saveBookings(bookings);
    return booking;
  }
};

// Export to window
window.NALLAYIL_DATA = NALLAYIL_DATA;
window.NallayilStore = NallayilStore;
