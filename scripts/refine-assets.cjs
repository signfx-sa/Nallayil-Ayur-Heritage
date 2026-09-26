const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..');
const dataPath=path.join(root,'js/data.js');
let data=fs.readFileSync(dataPath,'utf8');
const storeStart=data.indexOf('// Storage helper functions');
if(storeStart!==-1){
 fs.writeFileSync(path.join(root,'staff/store.js'),data.slice(storeStart).replace('const NallayilStore','const InternalStore').replace('window.NallayilStore = NallayilStore','window.NallayilStore = InternalStore'));
 data=data.slice(0,storeStart)+`// Public data is read-only. Administrative mutations live outside the public build.\nwindow.NALLAYIL_DATA=NALLAYIL_DATA;\nwindow.NallayilStore={getGallery:()=>NALLAYIL_DATA.initialGallery,getOffers:()=>NALLAYIL_DATA.initialOffers};\n`;
 fs.writeFileSync(dataPath,data);
}
const files=['index.html','treatments.html','gallery.html','booking.html','js/data.js'];
for(const name of files){
 let s=fs.readFileSync(path.join(root,name),'utf8');
 s=s.replace(/https:\/\/images\.unsplash\.com\/(photo-[\w-]+)\?[^"'\s<>]+/g,(url,id)=>fs.existsSync(path.join(root,`images/editorial/${id}.jpg`))?`images/editorial/${id}.jpg`:'images/massage-ritual.jpg');
 fs.writeFileSync(path.join(root,name),s);
}
let staff=fs.readFileSync(path.join(root,'staff/index.html'),'utf8');
staff=staff.replace('<script src="admin.js">','<script src="store.js"></script>\n  <script src="admin.js">').replace('href="booking.html"','href="../booking.html"');
staff=staff.replace('<body class="admin-body">','<body class="admin-body"><div style="position:relative;z-index:99999;background:#fff3cd;color:#513b08;padding:12px;text-align:center;font:14px sans-serif">INTERNAL PROTOTYPE — browser-local data only. This is not authenticated administration and must not be deployed publicly.</div>');
fs.writeFileSync(path.join(root,'staff/index.html'),staff);
console.log('Localized existing images and isolated browser-local administrative storage.');
