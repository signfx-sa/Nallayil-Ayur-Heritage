const fs=require('node:fs'),path=require('node:path');
const sharp=require(process.env.SHARP_PATH || 'sharp');
const root=path.resolve(__dirname,'..');
(async()=>{
const files=['index.html','treatments.html','gallery.html','booking.html','js/data.js'];
// Remove medical stock imagery unrelated to the treatment shown.
for(const name of files){let s=fs.readFileSync(path.join(root,name),'utf8');
s=s.replaceAll('images/editorial/photo-1584515979956-d9f6e5d09982.jpg','images/editorial/photo-1519823551278-64ac92734fb1.jpg');
s=s.replace('onclick="printBookingReceipt()"','id="print-request"');
s=s.replaceAll('Ayurvedic care and wellness imagery from the existing Nallayil collection.','Illustrative wellness photography from the existing collection; not photographs of Nallayil’s centers.');
fs.writeFileSync(path.join(root,name),s);}
const dataPath=path.join(root,'js/data.js');let data=fs.readFileSync(dataPath,'utf8');
const captions=[['Traditional Panchakarma Treatment Suite','Movement & wellbeing'],['Fresh Herbal Medicine Preparation','Traditional herbal bodywork'],['Therapeutic Shirodhara Session','The art of restorative massage'],['Perinthalmanna Ayur Home Resort Campus','A moment of stillness'],['Doctor Consultation & Pulse Diagnosis','Personal consultation'],['Patra Pinda Sweda (Herbal Kizhi)','Healing through touch']];
for(const [a,b] of captions)data=data.replace(a,b);
data=data.replace('Authentic teakwood Droni table crafted according to Vastu and classical Ayurvedic texts.','An illustrative moment of mindful movement and balance.').replace('Fresh Kashayams, oils, and churnams prepared with organically harvested medicinal plants.','Warm herbal preparations accompany traditional Ayurvedic bodywork.').replace('Continuous rhythmic stream of medicated herbal oils promoting mental tranquility.','Illustrative wellness photography exploring touch, warmth and relaxation.').replace('Serene natural environment providing optimal rest and recuperation for in-patients.','A quiet pause reflects the role of rest in a considered wellness routine.').replace('Detailed Nadi Pariksha and personalized lifestyle analysis for root-cause healing.','Care begins with a conversation and an individual consultation. Illustrative clinical photography.').replace('Warm herbal boluses applied with medicated oils for rapid relief from spine and joint pains.','Skilled hands and a gentle pace are central to traditional bodywork.');
fs.writeFileSync(dataPath,data);
let content=files.map(f=>fs.readFileSync(path.join(root,f),'utf8')).join('\n');
const refs=[...new Set(content.match(/images\/(?:editorial\/)?[\w-]+\.jpg/g))];
for(const ref of refs){if(!fs.existsSync(path.join(root,ref)))continue;const dest=ref.replace('.jpg','.webp');await sharp(path.join(root,ref)).resize({width:1000,withoutEnlargement:true}).webp({quality:82}).toFile(path.join(root,dest));
 for(const f of files){const p=path.join(root,f);fs.writeFileSync(p,fs.readFileSync(p,'utf8').split(ref).join(dest));}}
console.log(`Optimized ${refs.length} photos; original logo bytes retained.`);
})();
