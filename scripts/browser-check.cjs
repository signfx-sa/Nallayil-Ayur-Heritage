const {chromium}=require(process.env.PLAYWRIGHT_PATH || 'playwright');
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),out=path.join(root,'qa');fs.mkdirSync(out,{recursive:true});
(async()=>{
 const browser=await chromium.launch({channel:'msedge',headless:true,args:['--enable-unsafe-swiftshader']});
 const context=await browser.newContext({viewport:{width:1440,height:1000}});
 const page=await context.newPage(),errors=[],failed=[];
 page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});page.on('response',r=>{if(r.status()>=400)failed.push(r.status()+' '+r.url());});
 await page.goto('http://127.0.0.1:4173/',{waitUntil:'networkidle'});
 await page.screenshot({path:path.join(out,'desktop-hero.png')});
 await page.locator('#essence').scrollIntoViewIfNeeded();await page.waitForTimeout(2200);
 await page.screenshot({path:path.join(out,'desktop-ritual.png')});
 console.log('WebGL',await page.locator('#webgl-stage').getAttribute('class'));
 const layout=[];
 for(const file of ['index.html','treatments.html','gallery.html','booking.html']){
  await page.goto('http://127.0.0.1:4173/'+file,{waitUntil:'networkidle'});
  for(const width of [320,375,414,480,768,1024,1280,1440,1920]){
   await page.setViewportSize({width,height:900});
   const result=await page.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth,overflows:[...document.querySelectorAll('main *')].filter(e=>{const r=e.getBoundingClientRect();return r.width>0 && (r.right>innerWidth+1 || r.left< -1);}).slice(0,6).map(e=>e.tagName+'.'+e.className)}));
   layout.push({file,...result});assert(result.scroll<=width,JSON.stringify({file,...result}));
  }
 }
 await page.setViewportSize({width:375,height:812});await page.goto('http://127.0.0.1:4173/');await page.screenshot({path:path.join(out,'mobile-hero.png'),fullPage:false});
 await page.getByRole('button',{name:'Open navigation'}).click();assert.equal(await page.locator('.mobile-toggle').getAttribute('aria-expanded'),'true');
 await page.keyboard.press('Escape');assert.equal(await page.locator('.mobile-toggle').getAttribute('aria-expanded'),'false');
 await page.locator('.faq-item summary').first().click();assert.equal(await page.locator('.faq-item').first().getAttribute('open'),'');
 await page.locator('.slider-next').click();assert.equal(await page.locator('.testimonial-card-wrap:not([hidden])').count(),1);
 await page.goto('http://127.0.0.1:4173/gallery.html');assert.equal(await page.locator('.gallery-item').count(),6);
 for(let i=0;i<3;i++){await page.locator('[data-cat="Treatments"]').click();assert.equal(await page.locator('.gallery-item').count(),2);await page.locator('[data-cat="All"]').click();}
 await page.locator('.gallery-item').first().click();assert.equal(await page.locator('#gallery-modal').isVisible(),true);
 const first=await page.locator('#gallery-modal-title').textContent();await page.keyboard.press('ArrowRight');assert.notEqual(await page.locator('#gallery-modal-title').textContent(),first);await page.keyboard.press('Escape');assert.equal(await page.locator('#gallery-modal').isVisible(),false);
 await page.goto('http://127.0.0.1:4173/treatments.html');assert.equal(await page.locator('.treatment-detail-card').count(),8);
 await page.locator('[data-category="Mind & Sleep"]').first().click();assert.equal(await page.locator('.treatment-detail-card:not([hidden])').count(),1);
 await page.goto('http://127.0.0.1:4173/booking.html?treatment=marma-chikitsa&doctor=Dr.%20Fathimath%20Suhara');
 assert.equal(await page.locator('#booking-branch').inputValue(),'perinthalmanna');assert.equal(await page.locator('#booking-doctor').inputValue(),'Dr. Fathimath Suhara');assert.match(await page.locator('#booking-treatment').inputValue(),/Marma/);
 await page.locator('#booking-name').fill('QA Test Patient');await page.locator('#booking-phone').fill('+91 9000000000');
 await page.getByRole('button',{name:'Review Appointment Request'}).click();assert.match(await page.locator('#booking-error').textContent(),/preferred time/);
 await page.locator('.time-slot-btn:not(:disabled)').first().click();await page.getByRole('button',{name:'Review Appointment Request'}).click();
 assert.equal(await page.locator('#booking-receipt-modal').isVisible(),true);const wa=await page.locator('#receipt-whatsapp-btn').getAttribute('href');assert.match(decodeURIComponent(wa),/Please confirm availability/);assert.match(decodeURIComponent(wa),/QA Test Patient/);
 assert.equal(await page.evaluate(()=>localStorage.getItem('nallayil_bookings')),null);
 await page.screenshot({path:path.join(out,'mobile-request.png')});await page.keyboard.press('Escape');
 await page.locator('#booking-branch').selectOption('ramanattukara');assert.equal(await page.locator('#selected-time-slot').inputValue(),'');assert.match(await page.locator('#booking-doctor').textContent(),/Reshma/);
 await page.setViewportSize({width:1440,height:1000});await page.goto('http://127.0.0.1:4173/');
 await page.evaluate(async()=>{for(const img of document.images)img.loading='eager';await Promise.all([...document.images].map(i=>i.decode().catch(()=>{})));});
 await page.screenshot({path:path.join(out,'desktop-full.png'),fullPage:true});
 const reduced=await browser.newContext({reducedMotion:'reduce',viewport:{width:375,height:812}});const rp=await reduced.newPage();await rp.goto('http://127.0.0.1:4173/');await rp.locator('#essence').scrollIntoViewIfNeeded();assert.equal(await rp.locator('#webgl-stage canvas').count(),0);await reduced.close();
 const noWebGL=await browser.newContext();await noWebGL.addInitScript(()=>{const get=HTMLCanvasElement.prototype.getContext;HTMLCanvasElement.prototype.getContext=function(type,...args){return type.includes('webgl')?null:get.call(this,type,...args);};});const fp=await noWebGL.newPage();await fp.goto('http://127.0.0.1:4173/');await fp.locator('#essence').scrollIntoViewIfNeeded();await fp.waitForTimeout(500);assert.equal(await fp.locator('#treatment-fallback').isVisible(),true);await noWebGL.close();
 for(const p of ['staff/index.html','staff/admin.js','admin.html','scripts/build.cjs']){const r=await context.request.get('http://127.0.0.1:4173/'+p);assert.equal(r.status(),404);}
 fs.writeFileSync(path.join(out,'browser-report.json'),JSON.stringify({layout,errors,failed,checks:'Treatments, gallery, lightbox, drawer, FAQ, testimonials, request validation/receipt, WhatsApp URL, no patient persistence, reduced motion, WebGL fallback, staff exclusion.'},null,2));
 await browser.close();assert.deepEqual(errors,[]);assert.deepEqual(failed,[]);console.log('PASS: 36 responsive page/width checks and public interaction scenarios. No messages sent.');
})().catch(e=>{console.error(e);process.exit(1);});
