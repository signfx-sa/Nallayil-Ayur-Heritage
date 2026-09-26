const {chromium}=require(process.env.PLAYWRIGHT_PATH || 'playwright');
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
(async()=>{
 const browser=await chromium.launch({channel:'msedge',headless:true});const context=await browser.newContext();
 // In-memory fixture routing: the staff prototype is never added to the public server.
 await context.route('**/*',async route=>{
  const url=new URL(route.request().url());if(url.hostname!=='internal.test')return route.fulfill({status:200,body:'',contentType:'text/css'});
  const file=path.resolve(root,'.'+decodeURIComponent(url.pathname));
  if(!file.startsWith(root+path.sep)||!fs.existsSync(file))return route.fulfill({status:404,body:''});
  await route.fulfill({path:file});
 });
 const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://internal.test/staff/index.html');
 await page.locator('#admin-username').fill('admin');await page.locator('#admin-password').fill('nallayil@2026');await page.locator('#admin-login-form button').click();
 assert.equal(await page.locator('#admin-auth-overlay').isVisible(),false);
 await page.locator('[data-tab="gallery"]').click();
 await page.locator('#gallery-title-input').fill('QA internal photograph');await page.locator('#gallery-desc-input').fill('Browser-only verification');
 await page.locator('#gallery-file-input').setInputFiles(path.join(root,'images/massage-ritual.webp'));
 await page.locator('#admin-gallery-form button[type="submit"]').click();
 assert.equal(await page.locator('#admin-gallery-items-container .admin-item-card').count(),7);
 await page.locator('[data-tab="offers"]').click();await page.locator('#offer-title-input').fill('QA internal offer');await page.locator('#offer-badge-input').fill('TEST');await page.locator('#offer-code-input').fill('QA');await page.locator('#offer-valid-input').fill('2027-01-01');await page.locator('#offer-desc-input').fill('Internal verification only');await page.locator('#offer-file-input').setInputFiles(path.join(root,'images/massage-ritual.webp'));await page.locator('#admin-offers-form button[type="submit"]').click();
 assert.equal(await page.locator('#admin-offers-items-container .admin-item-card').count(),4);
 await page.evaluate(()=>{NallayilStore.addBooking({id:'QA-LOCAL',patientName:'QA Local Patient',phone:'0000000000',email:'',branch:'Manjeri Heritage Hospital',branchId:'manjeri',doctor:'QA Physician',treatment:'Consultation',date:'2027-01-01',timeSlot:'09:00 AM',mode:'In-Clinic',status:'Pending',notes:''});});
 await page.locator('[data-tab="bookings"]').click();await page.locator('#booking-search').fill('QA-LOCAL');assert.equal(await page.locator('#all-bookings-tbody tr').count(),1);
 await page.getByTitle('Confirm Booking').click();assert.equal(await page.evaluate(()=>NallayilStore.getBookings()[0].status),'Confirmed');
 const downloadPromise=page.waitForEvent('download');await page.getByRole('button',{name:'Export public gallery & offers'}).click();const download=await downloadPromise;const stream=await download.createReadStream();let raw='';for await(const chunk of stream)raw+=chunk;const content=JSON.parse(raw);
 assert.deepEqual(Object.keys(content),['gallery','offers']);assert.equal(content.gallery.length,7);assert(!raw.includes('QA-LOCAL'));assert(!raw.includes('patientName'));
 await page.reload();assert.equal(await page.evaluate(()=>NallayilStore.getGallery().length),7);assert.equal(await page.evaluate(()=>NallayilStore.getOffers().length),4);
 const csvPromise=page.waitForEvent('download');await page.locator('[data-tab="bookings"]').click();await page.locator('#booking-export-btn').click();const csv=await csvPromise;assert.match(csv.suggestedFilename(),/Bookings.*\.csv/);
 await page.locator('#admin-logout-btn').click();assert.equal(await page.locator('#admin-auth-overlay').isVisible(),true);
 assert.deepEqual(errors,[]);await browser.close();console.log('PASS: isolated prototype login/logout, gallery upload, offers, local booking status/filter, CSV and public-only export. No real patient data used.');
})().catch(e=>{console.error(e);process.exit(1);});
