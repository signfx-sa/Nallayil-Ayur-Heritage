/**
 * NALLAYIL AYURVEDA — AYURVEDIC MASSAGE & TREATMENT 3D EXPERIENCE
 * Crafted with Three.js
 * 
 * Features:
 * - Traditional Kerala Brass Uruli (Therapy Vessel) with cast handles & flared lip
 * - Warm Medicated Golden Herbal Oil (Thailam) with subtle surface sheen
 * - Hand-tied Ayurvedic Linen Kizhi (Herbal Therapy Pouch)
 * - Polished Basalt River Therapy Stones
 * - Sacred Ayurvedic Green Leaves (Tulsi / Neem) floating gracefully
 * - Soft Morning Sunlight & Daylight Reflections tailored for the White/Light Theme
 * - Slow, Calm, Therapeutic Scroll Interpolation (Simulating Gentle Healing Touch)
 * - Complete Mobile Optimization & Responsive Viewport Scaling
 */

(function () {
  'use strict';

  function isWebGLAvailable() {
    try {
      const canvas = document.createElement('canvas');
      return !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
    } catch (e) {
      return false;
    }
  }

  if (!isWebGLAvailable() || typeof THREE === 'undefined') {
    document.body.classList.add('no-webgl');
    const fallback = document.getElementById('webgl-fallback');
    if (fallback) fallback.style.display = 'block';
    return;
  }

  class NallayilTreatmentScene {
    constructor() {
      this.container = document.getElementById('canvas-container');
      if (!this.container) return;

      this.scene = null;
      this.camera = null;
      this.renderer = null;
      this.treatmentGroup = null;
      this.oilMesh = null;
      this.floatingLeaves = [];
      this.ambientParticles = null;
      this.clock = new THREE.Clock();

      this.scrollY = window.scrollY || window.pageYOffset || 0;
      this.scrollPercent = 0;
      this.targetScrollPercent = 0;
      this.isMobile = window.innerWidth < 768;

      // Target positions for smooth lerping
      this.targetX = 0;
      this.targetY = -0.3;
      this.targetZ = 0;
      this.targetRotX = 0.28; // gentle view angle into bowl
      this.targetRotY = 0;
      this.targetRotZ = 0;
      this.targetScale = this.isMobile ? 0.72 : 1.0;

      // Mouse subtle interaction
      this.mouseX = 0;
      this.mouseY = 0;
      this.targetMouseX = 0;
      this.targetMouseY = 0;

      this.init();
    }

    init() {
      // 1. Scene
      this.scene = new THREE.Scene();

      // 2. Camera
      const aspect = window.innerWidth / window.innerHeight;
      this.camera = new THREE.PerspectiveCamera(40, aspect, 0.1, 100);
      this.camera.position.set(0, 1.2, 11);

      // 3. Renderer
      this.renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance'
      });
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, this.isMobile ? 1.5 : 2));
      this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
      this.renderer.toneMappingExposure = 1.15;
      if (THREE.sRGBEncoding) {
        this.renderer.outputEncoding = THREE.sRGBEncoding;
      }
      this.container.appendChild(this.renderer.domElement);

      // 4. Soft Natural Lighting (White/Light Theme Compliant)
      this.setupLighting();

      // 5. Build Ayurvedic Treatment Composition
      this.buildComposition();

      // 6. Build Gentle Herbal Aroma Floating Particles
      this.buildAromaParticles();

      // 7. Event Listeners
      this.bindEvents();

      // 8. Start Calming Animation Loop
      this.animate();
    }

    setupLighting() {
      // Soft Mint/Ivory Ambient Daylight
      const ambientLight = new THREE.AmbientLight(0xF4F9F2, 0.9);
      this.scene.add(ambientLight);

      // Warm Morning Sun (Directional Key Light)
      const sunLight = new THREE.DirectionalLight(0xFFF6E5, 1.3);
      sunLight.position.set(6, 9, 7);
      this.scene.add(sunLight);

      // Soft Herbal Green Fill Light (Simulating natural garden bounce)
      const fillLight = new THREE.DirectionalLight(0xE2F0E0, 0.75);
      fillLight.position.set(-6, 3, 5);
      this.scene.add(fillLight);

      // Warm Bronze Accent Rim Light
      const rimLight = new THREE.SpotLight(0xE8BA55, 0.9, 25, Math.PI / 4, 0.5);
      rimLight.position.set(0, 7, -6);
      rimLight.lookAt(0, 0, 0);
      this.scene.add(rimLight);
    }

    buildComposition() {
      this.treatmentGroup = new THREE.Group();

      // Physically-Based Materials
      // 1. Traditional Kerala Bell-Metal / Brass Material
      const brassMaterial = new THREE.MeshStandardMaterial({
        color: 0xC69932,        // Warm golden bell-metal
        roughness: 0.28,        // Soft hand-buffed sheen
        metalness: 0.88,
        bumpScale: 0.05
      });

      const darkBrassBase = new THREE.MeshStandardMaterial({
        color: 0x6E4B14,
        roughness: 0.45,
        metalness: 0.8
      });

      // 2. Medicated Warm Herbal Oil Material (Thailam)
      const oilMaterial = new THREE.MeshStandardMaterial({
        color: 0xE8A21E,        // Rich golden-amber medicinal oil
        roughness: 0.06,        // Smooth liquid surface
        metalness: 0.2,
        transparent: true,
        opacity: 0.92
      });

      // 3. Smooth Basalt River Therapy Stones Material
      const stoneMaterial = new THREE.MeshStandardMaterial({
        color: 0x303B32,        // Deep slate river basalt
        roughness: 0.52,
        metalness: 0.12
      });

      const smoothStoneMaterial = new THREE.MeshStandardMaterial({
        color: 0x273129,
        roughness: 0.38,        // Slight sheen from warm herbal oil
        metalness: 0.18
      });

      // 4. Sacred Botanical Leaf Material
      const leafMaterial = new THREE.MeshStandardMaterial({
        color: 0x48BD1E,        // Fresh herbal green
        roughness: 0.35,
        metalness: 0.08,
        side: THREE.DoubleSide
      });

      // 5. Traditional Unbleached Cotton Linen Kizhi Pouch
      const kizhiLinenMaterial = new THREE.MeshStandardMaterial({
        color: 0xF3EBDC,        // Warm unbleached organic cotton
        roughness: 0.85,
        metalness: 0.02
      });

      const kizhiOilSoakMaterial = new THREE.MeshStandardMaterial({
        color: 0xD89F32,        // Warm herbal oil seeped into linen
        roughness: 0.65,
        metalness: 0.08
      });

      const cordMaterial = new THREE.MeshStandardMaterial({
        color: 0x7A561E,
        roughness: 0.9
      });

      // --- A. THE KERALA BRASS URULI (BOWL) ---
      const uruliGroup = new THREE.Group();

      // Uruli Outer Flared Basin
      const basinGeo = new THREE.CylinderGeometry(2.3, 1.4, 0.95, 48, 1, false);
      const basinMesh = new THREE.Mesh(basinGeo, brassMaterial);
      basinMesh.position.y = -0.15;
      uruliGroup.add(basinMesh);

      // Flared Upper Lip / Heavy Rounded Rim
      const rimGeo = new THREE.TorusGeometry(2.35, 0.16, 24, 64);
      const rimMesh = new THREE.Mesh(rimGeo, brassMaterial);
      rimMesh.rotation.x = Math.PI / 2;
      rimMesh.position.y = 0.32;
      uruliGroup.add(rimMesh);

      // Outer decorative ridge ring
      const ridgeGeo = new THREE.TorusGeometry(2.1, 0.08, 16, 48);
      const ridgeMesh = new THREE.Mesh(ridgeGeo, brassMaterial);
      ridgeMesh.rotation.x = Math.PI / 2;
      ridgeMesh.position.y = 0.05;
      uruliGroup.add(ridgeMesh);

      // Stepped Pedestal Base
      const baseGeo = new THREE.CylinderGeometry(1.45, 1.6, 0.25, 40);
      const baseMesh = new THREE.Mesh(baseGeo, darkBrassBase);
      baseMesh.position.y = -0.68;
      uruliGroup.add(baseMesh);

      // Traditional Cast Brass Handles (Ornate Rings on opposite sides)
      [-1, 1].forEach(side => {
        const handleTorus = new THREE.TorusGeometry(0.38, 0.09, 16, 32);
        const handleMesh = new THREE.Mesh(handleTorus, brassMaterial);
        handleMesh.position.set(side * 2.45, 0.18, 0);
        handleMesh.rotation.y = Math.PI / 2;
        uruliGroup.add(handleMesh);

        const handleLug = new THREE.CylinderGeometry(0.12, 0.14, 0.22, 16);
        const lugMesh = new THREE.Mesh(handleLug, brassMaterial);
        lugMesh.position.set(side * 2.38, 0.18, 0);
        lugMesh.rotation.z = Math.PI / 2;
        uruliGroup.add(lugMesh);
      });

      // --- B. WARM MEDICATED HERBAL OIL (SURFACE) ---
      const oilGeo = new THREE.CircleGeometry(2.26, 48);
      this.oilMesh = new THREE.Mesh(oilGeo, oilMaterial);
      this.oilMesh.rotation.x = -Math.PI / 2;
      this.oilMesh.position.y = 0.26;
      uruliGroup.add(this.oilMesh);

      // Inner liquid depth illusion
      const oilDeepGeo = new THREE.CylinderGeometry(2.2, 1.3, 0.7, 36);
      const oilDeepMesh = new THREE.Mesh(oilDeepGeo, oilMaterial);
      oilDeepMesh.position.y = -0.12;
      uruliGroup.add(oilDeepMesh);

      this.treatmentGroup.add(uruliGroup);

      // --- C. SACRED AYURVEDIC LEAVES (FLOATING & DRAPING) ---
      this.floatingLeaves = [];

      const createLeaf = (scaleX, scaleZ, rotY, posX, posY, posZ) => {
        const leafShape = new THREE.Shape();
        leafShape.moveTo(0, 0);
        leafShape.bezierCurveTo(0.2, 0.3, 0.35, 0.8, 0, 1.3);
        leafShape.bezierCurveTo(-0.35, 0.8, -0.2, 0.3, 0, 0);

        const leafGeo = new THREE.ShapeGeometry(leafShape);
        const leaf = new THREE.Mesh(leafGeo, leafMaterial);
        leaf.rotation.x = -Math.PI / 2;
        leaf.rotation.z = rotY;
        leaf.scale.set(scaleX, scaleZ, 1);
        leaf.position.set(posX, posY, posZ);

        // Gentle central stem vein
        const stemGeo = new THREE.CylinderGeometry(0.015, 0.02, 1.3, 8);
        const stem = new THREE.Mesh(stemGeo, darkBrassBase);
        stem.rotation.z = -Math.PI / 2;
        stem.position.set(0, 0.65, 0.01);
        leaf.add(stem);

        this.treatmentGroup.add(leaf);
        this.floatingLeaves.push({
          mesh: leaf,
          baseY: posY,
          baseRotZ: rotY,
          speed: 0.8 + Math.random() * 0.4,
          phase: Math.random() * Math.PI * 2
        });
      };

      // Leaf 1: Floating centrally on oil
      createLeaf(0.65, 0.75, 0.4, 0.5, 0.28, 0.4);
      // Leaf 2: Floating near the right edge
      createLeaf(0.55, 0.65, -0.6, -0.6, 0.28, -0.3);
      // Leaf 3: Draped over the brass rim
      createLeaf(0.7, 0.85, 1.8, 1.8, 0.33, 0.8);

      // Small White Jasmine Flower floating on oil
      const flowerGroup = new THREE.Group();
      flowerGroup.position.set(-0.7, 0.28, 0.6);
      const centerGeo = new THREE.SphereGeometry(0.08, 12, 12);
      const centerMat = new THREE.MeshStandardMaterial({ color: 0xF7D046, roughness: 0.5 });
      flowerGroup.add(new THREE.Mesh(centerGeo, centerMat));

      const petalMat = new THREE.MeshStandardMaterial({ color: 0xFFFFFF, roughness: 0.3, side: THREE.DoubleSide });
      for (let i = 0; i < 5; i++) {
        const petalGeo = new THREE.SphereGeometry(0.12, 12, 8);
        const petal = new THREE.Mesh(petalGeo, petalMat);
        petal.scale.set(0.6, 0.2, 1.2);
        const angle = (i / 5) * Math.PI * 2;
        petal.position.set(Math.cos(angle) * 0.16, 0.02, Math.sin(angle) * 0.16);
        petal.rotation.y = angle;
        flowerGroup.add(petal);
      }
      this.treatmentGroup.add(flowerGroup);
      this.floatingLeaves.push({
        mesh: flowerGroup,
        baseY: 0.28,
        baseRotZ: 0,
        speed: 0.7,
        phase: 1.2
      });

      // --- D. POLISHED BASALT MASSAGE RIVER STONES ---
      const stonesGroup = new THREE.Group();
      stonesGroup.position.set(-2.8, -0.35, 0.6);

      // Large Base Stone
      const stone1Geo = new THREE.SphereGeometry(1.0, 32, 24);
      const stone1 = new THREE.Mesh(stone1Geo, stoneMaterial);
      stone1.scale.set(1.4, 0.45, 1.1);
      stone1.rotation.y = 0.3;
      stonesGroup.add(stone1);

      // Medium Second Stone
      const stone2Geo = new THREE.SphereGeometry(0.8, 28, 20);
      const stone2 = new THREE.Mesh(stone2Geo, smoothStoneMaterial);
      stone2.scale.set(1.15, 0.42, 0.95);
      stone2.position.set(0.1, 0.38, -0.1);
      stone2.rotation.y = -0.4;
      stonesGroup.add(stone2);

      // Top Smaller Balancing Stone
      const stone3Geo = new THREE.SphereGeometry(0.55, 24, 16);
      const stone3 = new THREE.Mesh(stone3Geo, smoothStoneMaterial);
      stone3.scale.set(0.9, 0.38, 0.75);
      stone3.position.set(0.05, 0.74, -0.05);
      stone3.rotation.y = 0.6;
      stonesGroup.add(stone3);

      this.treatmentGroup.add(stonesGroup);

      // --- E. TRADITIONAL AYURVEDIC KIZHI (HERBAL POUCH) ---
      const kizhiGroup = new THREE.Group();
      kizhiGroup.position.set(2.8, -0.35, 0.3);
      kizhiGroup.rotation.z = -0.12; // slightly relaxed resting tilt

      // Base bunched pouch
      const pouchGeo = new THREE.SphereGeometry(0.9, 32, 24);
      const pouchMesh = new THREE.Mesh(pouchGeo, kizhiLinenMaterial);
      pouchMesh.scale.set(1.0, 0.85, 1.0);
      pouchMesh.position.y = 0.55;
      kizhiGroup.add(pouchMesh);

      // Warm herbal oil seep on lower base of kizhi
      const seepGeo = new THREE.SphereGeometry(0.88, 24, 16);
      const seepMesh = new THREE.Mesh(seepGeo, kizhiOilSoakMaterial);
      seepMesh.scale.set(0.96, 0.45, 0.96);
      seepMesh.position.y = 0.25;
      kizhiGroup.add(seepMesh);

      // Tied Cord Neck
      const cordGeo = new THREE.CylinderGeometry(0.24, 0.26, 0.16, 20);
      const cordMesh = new THREE.Mesh(cordGeo, cordMaterial);
      cordMesh.position.y = 1.25;
      kizhiGroup.add(cordMesh);

      // Top fabric handle
      const handleTopGeo = new THREE.CylinderGeometry(0.38, 0.2, 0.9, 20);
      const handleTopMesh = new THREE.Mesh(handleTopGeo, kizhiLinenMaterial);
      handleTopMesh.position.y = 1.72;
      kizhiGroup.add(handleTopMesh);

      this.treatmentGroup.add(kizhiGroup);

      // Center and add treatment group to scene
      this.treatmentGroup.position.set(0, -0.3, 0);
      this.treatmentGroup.rotation.x = this.targetRotX;
      this.scene.add(this.treatmentGroup);
    }

    buildAromaParticles() {
      const count = this.isMobile ? 25 : 50;
      const geo = new THREE.BufferGeometry();
      const positions = new Float32Array(count * 3);
      const speeds = new Float32Array(count);

      for (let i = 0; i < count; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 8;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 5;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 4;
        speeds[i] = 0.2 + Math.random() * 0.3;
      }

      geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

      // Delicate golden-herbal aroma particles
      const mat = new THREE.PointsMaterial({
        color: 0x86D438,
        size: this.isMobile ? 0.08 : 0.12,
        transparent: true,
        opacity: 0.45,
        blending: THREE.AdditiveBlending
      });

      this.ambientParticles = new THREE.Points(geo, mat);
      this.ambientParticles.userData = { speeds };
      this.scene.add(this.ambientParticles);
    }

    bindEvents() {
      window.addEventListener('scroll', () => {
        this.scrollY = window.scrollY || window.pageYOffset || 0;
      }, { passive: true });

      window.addEventListener('resize', () => {
        this.isMobile = window.innerWidth < 768;
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, this.isMobile ? 1.5 : 2));
      });

      window.addEventListener('mousemove', (e) => {
        this.targetMouseX = (e.clientX / window.innerWidth - 0.5) * 0.4;
        this.targetMouseY = (e.clientY / window.innerHeight - 0.5) * 0.3;
      }, { passive: true });
    }

    animate() {
      requestAnimationFrame(() => this.animate());

      const elapsed = this.clock.getElapsedTime();
      const maxScroll = Math.max(1, document.body.scrollHeight - window.innerHeight);
      const currentScrollPercent = Math.max(0, Math.min(1, this.scrollY / maxScroll));

      // Smooth scroll interpolation
      this.targetScrollPercent += (currentScrollPercent - this.targetScrollPercent) * 0.08;
      const sp = this.targetScrollPercent;

      // Mouse subtle easing
      this.mouseX += (this.targetMouseX - this.mouseX) * 0.05;
      this.mouseY += (this.targetMouseY - this.mouseY) * 0.05;

      // Mobile vs Desktop travel offset
      const xDistance = this.isMobile ? 0 : 2.5;

      // --- SCROLL NARRATIVE ---
      // 1. HERO (0.0 to 0.12): Centered, gentle invite
      if (sp < 0.12) {
        const p = sp / 0.12;
        this.targetX = 0;
        this.targetY = -0.3 + (0.1 * p);
        this.targetRotX = 0.28 + (0.05 * p);
        this.targetRotY = (p * 0.2);
        this.targetRotZ = 0;
        this.targetScale = this.isMobile ? 0.72 : 1.0;
      }
      // 2. ABOUT & PHILOSOPHY (0.12 to 0.38): Shift right, reveal Uruli brass rim and stones
      else if (sp >= 0.12 && sp < 0.38) {
        const p = (sp - 0.12) / 0.26;
        this.targetX = (xDistance * p);
        this.targetY = -0.2 - (0.1 * p);
        this.targetRotX = 0.33 + (0.12 * p);
        this.targetRotY = 0.2 + (0.35 * p);
        this.targetRotZ = -0.05 * p;
        this.targetScale = this.isMobile ? 0.68 : 1.05;
      }
      // 3. TREATMENTS & TOUCH (0.38 to 0.65): Shift left, closer therapeutic focus on Kizhi & oil
      else if (sp >= 0.38 && sp < 0.65) {
        const p = (sp - 0.38) / 0.27;
        this.targetX = xDistance - (xDistance * 2 * p);
        this.targetY = -0.3 + (0.15 * Math.sin(p * Math.PI));
        this.targetRotX = 0.45 - (0.15 * p);
        this.targetRotY = 0.55 - (0.8 * p);
        this.targetRotZ = 0.06 * p;
        this.targetScale = this.isMobile ? 0.7 : 1.1;
      }
      // 4. BOTANICALS & CENTERS (0.65 to 0.85): Glide towards center-right, balanced view
      else if (sp >= 0.65 && sp < 0.85) {
        const p = (sp - 0.65) / 0.2;
        this.targetX = -xDistance + (xDistance * 1.5 * p);
        this.targetY = -0.25;
        this.targetRotX = 0.3 + (0.08 * (1 - p));
        this.targetRotY = -0.25 + (0.3 * p);
        this.targetRotZ = -0.02 * p;
        this.targetScale = this.isMobile ? 0.68 : 0.98;
      }
      // 5. GALLERY, TESTIMONIALS & FINAL CTA (0.85 to 1.0): Calmly settle into center
      else {
        const p = (sp - 0.85) / 0.15;
        this.targetX = (0.5 * xDistance) * (1 - p);
        this.targetY = -0.3;
        this.targetRotX = 0.3 - (0.05 * p);
        this.targetRotY = 0.05 * (1 - p);
        this.targetRotZ = 0;
        this.targetScale = this.isMobile ? 0.72 : 1.0;
      }

      // Calm breathing / therapeutic float
      const breathingFloat = Math.sin(elapsed * 0.75) * 0.06;

      // Apply lerping to treatment group
      if (this.treatmentGroup) {
        const lerpSpeed = 0.06;
        this.treatmentGroup.position.x += (this.targetX + this.mouseX - this.treatmentGroup.position.x) * lerpSpeed;
        this.treatmentGroup.position.y += ((this.targetY + breathingFloat - this.mouseY) - this.treatmentGroup.position.y) * lerpSpeed;
        this.treatmentGroup.position.z += (this.targetZ - this.treatmentGroup.position.z) * lerpSpeed;

        this.treatmentGroup.rotation.x += (this.targetRotX - this.mouseY * 0.5 - this.treatmentGroup.rotation.x) * lerpSpeed;
        this.treatmentGroup.rotation.y += (this.targetRotY + this.mouseX * 0.5 - this.treatmentGroup.rotation.y) * lerpSpeed;
        this.treatmentGroup.rotation.z += (this.targetRotZ - this.treatmentGroup.rotation.z) * lerpSpeed;

        const currentScale = this.treatmentGroup.scale.x;
        const newScale = currentScale + (this.targetScale - currentScale) * lerpSpeed;
        this.treatmentGroup.scale.set(newScale, newScale, newScale);
      }

      // Animate floating leaves & blossoms gently in the oil
      this.floatingLeaves.forEach((item) => {
        const floatY = Math.sin(elapsed * item.speed + item.phase) * 0.015;
        const gentleRot = Math.cos(elapsed * (item.speed * 0.8) + item.phase) * 0.05;
        item.mesh.position.y = item.baseY + floatY;
        if (item.mesh.rotation.z !== undefined) {
          item.mesh.rotation.z = item.baseRotZ + gentleRot;
        }
      });

      // Animate ambient herbal aroma particles drifting slowly upwards
      if (this.ambientParticles) {
        const positions = this.ambientParticles.geometry.attributes.position.array;
        const speeds = this.ambientParticles.userData.speeds;
        for (let i = 0; i < speeds.length; i++) {
          positions[i * 3 + 1] += speeds[i] * 0.01;
          if (positions[i * 3 + 1] > 3.5) {
            positions[i * 3 + 1] = -3.0;
            positions[i * 3] = (Math.random() - 0.5) * 8;
          }
        }
        this.ambientParticles.geometry.attributes.position.needsUpdate = true;
      }

      this.renderer.render(this.scene, this.camera);
    }
  }

  // Initialize once DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new NallayilTreatmentScene());
  } else {
    new NallayilTreatmentScene();
  }
})();
