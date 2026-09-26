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
      email: "manjeri@nallayilayurveda.com",
      timing: "Mon - Sun: 08:30 AM - 08:00 PM",
      mapQuery: "Nallayil+Ayurveda+Manjeri+Kerala"
    },
    {
      id: "perinthalmanna",
      name: "Perinthalmanna Ayur Home (In-Patient Resort)",
      district: "Malappuram",
      address: "Pacheerippara, Kariavattom, Pattikkad, Perinthalmanna, Kerala – 679325",
      phone: "+91 99610 03718",
      whatsapp: "919961003718",
      email: "ayurhome@nallayilayurveda.com",
      timing: "Open 24/7 (In-Patient & Out-Patient)",
      mapQuery: "Pattikkad+Kariavattom+Perinthalmanna+Kerala"
    },
    {
      id: "ramanattukara",
      name: "Ramanattukara Specialty Clinic",
      district: "Kozhikode",
      address: "Byepass Junction, Ramanattukara, Kozhikode, Kerala – 673633",
      phone: "+91 99610 03718",
      whatsapp: "919961003718",
      email: "calicut@nallayilayurveda.com",
      timing: "Mon - Sat: 09:00 AM - 07:30 PM",
      mapQuery: "Ramanattukara+Bypass+Junction+Kozhikode+Kerala"
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
      branch: "Manjeri & Perinthalmanna",
      bio: "Renowned expert in traditional Malabar Marma therapy, successfully reversing spine conditions without surgical intervention.",
      image: "images/editorial/photo-1622253692010-333f2da6031d.webp"
    },
    {
      id: "dr-suhara",
      name: "Dr. Fathimath Suhara",
      qualification: "BAMS, MD (Ayur - Panchakarma)",
      experience: "16+ Years Experience",
      designation: "Head of Panchakarma & Gynaecology",
      specialty: "Panchakarma Detox, PCOD, Infertility & Women's Care",
      branch: "Perinthalmanna Ayur Home",
      bio: "Specialist in classical detoxification, metabolic balance, and holistic post-natal Ayurvedic healthcare.",
      image: "images/massage-ritual.webp"
    },
    {
      id: "dr-anoop",
      name: "Dr. Anoop Narayanan",
      qualification: "BAMS, Fellow in Orthopedic Rehabilitation",
      experience: "12+ Years Experience",
      designation: "Senior Consultant Ortho & Arthritis Care",
      specialty: "Osteoarthritis, Knee Pain, Sciatica, Neck Pain",
      branch: "Manjeri & Ramanattukara",
      bio: "Expertise in musculoskeletal rejuvenation, Kizhi therapies, Janu Vasthi, and rehabilitation.",
      image: "images/editorial/photo-1612349317150-e413f6a5b16d.webp"
    },
    {
      id: "dr-reshma",
      name: "Dr. Reshma K.",
      qualification: "BAMS, Certified Stress & Mind Wellness",
      experience: "9+ Years Experience",
      designation: "Consultant Physician - Lifestyle & Neuro Care",
      specialty: "Migraine, Insomnia, Skin & Allergy Management",
      branch: "Ramanattukara & Online",
      bio: "Holistic physician blending personalized dietetics, herbal infusions, and Shirodhara for psychosomatic relief.",
      image: "images/editorial/photo-1559839734-2b71ea197ec2.webp"
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
      image: "images/editorial/photo-1544367567-0f2fcb009e0b.webp"
    },
    {
      id: "spine-disc-care",
      title: "Spine & Disc Rehabilitation",
      category: "Spine & Pain",
      shortDesc: "Complete conservative non-surgical management for Slip Disc, Sciatica, Cervical & Lumbar Spondylosis.",
      duration: "14 - 28 Days",
      benefits: ["Kati Vasthi & Elakizhi therapies", "Relieves radiating leg and arm numbness", "Strengthens paraspinal musculature"],
      image: "images/editorial/photo-1519823551278-64ac92734fb1.webp"
    },
    {
      id: "panchakarma-detox",
      title: "Classical Panchakarma Detox",
      category: "Detox & Wellness",
      shortDesc: "Five-fold bio-purification to eliminate deep seated cellular toxins and rejuvenate body vitality.",
      duration: "7, 14 or 21 Days",
      benefits: ["Boosts digestive fire (Agni)", "Purges toxins from bloodstream", "Restores tri-dosha equilibrium (Vata, Pitta, Kapha)"],
      image: "images/editorial/photo-1506126613408-eca07ce68773.webp"
    },
    {
      id: "arthritis-knee-care",
      title: "Joint & Arthritis Care",
      category: "Spine & Pain",
      shortDesc: "Holistic care for Osteoarthritis, Rheumatoid Arthritis, Gout, and severe Knee Pain.",
      duration: "10 - 21 Days",
      benefits: ["Janu Vasthi for knee cartilage lubrication", "Reduces chronic swelling and stiffness", "Improves daily painless walking mobility"],
      image: "images/editorial/photo-1576091160399-112ba8d25d1d.webp"
    },
    {
      id: "stroke-rehab",
      title: "Stroke & Paralysis Recovery",
      category: "Neuro & Rehab",
      shortDesc: "Specialized neuro-muscular regeneration program combining herbal steam, Njavarakizhi & internal medications.",
      duration: "21 - 45 Days In-Patient",
      benefits: ["Stimulates motor nerve pathways", "Reduces spasticity and muscle wasting", "Improves speech and limb coordination"],
      image: "images/editorial/photo-1519823551278-64ac92734fb1.webp"
    },
    {
      id: "stress-shirodhara",
      title: "Stress, Insomnia & Shirodhara",
      category: "Mind & Sleep",
      shortDesc: "Continuous gentle pouring of medicated herbal oils or buttermilk over the forehead for deep calm.",
      duration: "3 - 7 Sessions",
      benefits: ["Induces deep restful sleep", "Regulates nervous system and cortisol", "Alleviates chronic tension headaches and migraines"],
      image: "images/editorial/photo-1600334089648-b0d9d3028eb2.webp"
    },
    {
      id: "skin-allergy",
      title: "Skin, Psoriasis & Allergy Care",
      category: "Skin & Allergy",
      shortDesc: "Gentle natural cleansing with internal blood purifiers and external herbal lepams for lasting skin health.",
      duration: "14 - 30 Days",
      benefits: ["Clears itching, scaling and redness", "Purifies Rakta and Pitta doshas", "Prevents allergic recurrence safely"],
      image: "images/massage-ritual.webp"
    },
    {
      id: "womens-postnatal",
      title: "Women's Health & Postnatal Care",
      category: "Women's Health",
      shortDesc: "Herbal hormonal harmony, PCOD care, and traditional post-delivery mother care (Sutika Paricharya).",
      duration: "14 - 28 Days",
      benefits: ["Normalizes menstrual cycles", "Strengthens pelvic floor and spine after delivery", "Rebalances metabolism and vitality naturally"],
      image: "images/editorial/photo-1515377905703-c4788e51af15.webp"
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
      image: "images/editorial/photo-1544367567-0f2fcb009e0b.webp"
    },
    {
      id: "off-2",
      title: "Comprehensive Spine & Joint Checkup Camp",
      badge: "FREE CONSULTATION",
      validTill: "2026-10-31",
      description: "Free Marma and Orthopedic assessment by Senior Doctors at Manjeri & Perinthalmanna branches every Saturday. Free digital health analysis report.",
      code: "SPINECAMP",
      featured: true,
      image: "images/editorial/photo-1519823551278-64ac92734fb1.webp"
    },
    {
      id: "off-3",
      title: "Ayur Home In-Patient Stay Discount",
      badge: "15% OFF STAY",
      validTill: "2026-12-31",
      description: "Special concession on traditional garden cottage rooms for 14+ days treatments in Perinthalmanna Ayur Home. Healthy organic sattvic meals included.",
      code: "AYURHOME15",
      featured: false,
      image: "images/editorial/photo-1576091160399-112ba8d25d1d.webp"
    }
  ],

  initialGallery: [
    {
      id: "gal-1",
      title: "Movement & wellbeing",
      category: "Facilities",
      description: "An illustrative moment of mindful movement and balance.",
      image: "images/editorial/photo-1544367567-0f2fcb009e0b.webp",
      date: "2026-08-15"
    },
    {
      id: "gal-2",
      title: "Traditional herbal bodywork",
      category: "Herbal Garden",
      description: "Warm herbal preparations accompany traditional Ayurvedic bodywork.",
      image: "images/massage-ritual.webp",
      date: "2026-08-20"
    },
    {
      id: "gal-3",
      title: "The art of restorative massage",
      category: "Treatments",
      description: "Illustrative wellness photography exploring touch, warmth and relaxation.",
      image: "images/editorial/photo-1600334089648-b0d9d3028eb2.webp",
      date: "2026-09-02"
    },
    {
      id: "gal-4",
      title: "A moment of stillness",
      category: "Ayur Home",
      description: "A quiet pause reflects the role of rest in a considered wellness routine.",
      image: "images/editorial/photo-1506126613408-eca07ce68773.webp",
      date: "2026-09-05"
    },
    {
      id: "gal-5",
      title: "Personal consultation",
      category: "Clinical Care",
      description: "Care begins with a conversation and an individual consultation. Illustrative clinical photography.",
      image: "images/editorial/photo-1622253692010-333f2da6031d.webp",
      date: "2026-09-10"
    },
    {
      id: "gal-6",
      title: "Healing through touch",
      category: "Treatments",
      description: "Skilled hands and a gentle pace are central to traditional bodywork.",
      image: "images/editorial/photo-1519823551278-64ac92734fb1.webp",
      date: "2026-09-14"
    }
  ],

  initialBookings: [],

  testimonials: [
    {
      name: "Sayyid Sabiq Ali Shihab Thangal",
      place: "Panakkad, Malappuram",
      condition: "Marma Chikitsa & Spine Care",
      comment: "മർമ്മമറിഞ്ഞുള്ള ചികിത്സയാണ് നല്ലയിൽ ആയുർവേദയിൽ. Dr. Shafi and team provide authentic, compassionate care that touches the root cause. Highly recommended for genuine healing.",
      rating: 5,
      avatar: "images/editorial/photo-1507003211169-0a1dd7228f2d.webp"
    },
    {
      name: "Mohammed Nishad",
      place: "Manjeri",
      condition: "Severe L4-L5 Disc Prolapse",
      comment: "I was advised spinal surgery by multiple doctors. At Nallayil Ayurveda, within 21 days of Marma and Kati Vasthi treatment, my severe leg pain completely vanished without surgery.",
      rating: 5,
      avatar: "images/editorial/photo-1500648767791-00dcc994a43e.webp"
    },
    {
      name: "Fathima Zehra",
      place: "Perinthalmanna",
      condition: "PCOD & Hormonal Imbalance",
      comment: "The care received from Dr. Fathimath Suhara at Ayur Home was life changing. The herbal medicines, disciplined diet, and Panchakarma restored my menstrual cycle naturally.",
      rating: 5,
      avatar: "images/editorial/photo-1494790108377-be9c29b29330.webp"
    },
    {
      name: "Radhakrishnan Nair",
      place: "Calicut",
      condition: "Osteoarthritis of Both Knees",
      comment: "I could barely walk 100 meters due to knee pain. After the 14-day Janu Vasthi course at Nallayil, I can walk comfortably and climb stairs without support.",
      rating: 5,
      avatar: "images/editorial/photo-1472099645785-5658abf4ff4e.webp"
    }
  ]
};

// Public data is read-only. Administrative mutations live outside the public build.
window.NALLAYIL_DATA=NALLAYIL_DATA;
window.NallayilStore={getGallery:()=>NALLAYIL_DATA.initialGallery,getOffers:()=>NALLAYIL_DATA.initialOffers};
