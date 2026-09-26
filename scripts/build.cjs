const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),out=path.join(root,'dist');
const vm=require('node:vm');
// Optional public-only snapshot exported by the preserved internal editor.
const contentPath=path.join(root,'content.json');
let publishedContent;
if(fs.existsSync(contentPath)){
 const input=JSON.parse(fs.readFileSync(contentPath,'utf8'));
 publishedContent={};
 for(const [key,fields] of Object.entries({gallery:['id','title','category','description','image','date'],offers:['id','title','badge','validTill','description','code','image']})){
  if(!Array.isArray(input[key])||input[key].length>200)throw Error(`Invalid ${key} collection`);
  publishedContent[key]=input[key].map(item=>{
   const clean=Object.fromEntries(fields.map(f=>[f,String(item[f]??'')]));
   if(!clean.title||!clean.id)throw Error(`Missing ${key} title or id`);
   if(clean.image && !/^images\/[\w/.-]+\.(webp|jpg|png)$/.test(clean.image) && !/^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/=]+$/.test(clean.image))throw Error('Use a local image or an uploaded PNG/JPEG/WebP for public content. Remote URLs are not published.');
   if(clean.image.startsWith('images/')){
    const resolved=path.resolve(root,clean.image);
    if(!resolved.startsWith(path.join(root,'images')+path.sep)||!fs.existsSync(resolved))throw Error('Missing or invalid public image');
   }
   return clean;
  });
 }
}
// This is the only deployable directory. Do not copy the project root to a host.
if(fs.existsSync(out)){
 const resolved=fs.realpathSync(out);
 if(resolved!==out)throw Error('Refusing to replace a redirected output directory');
 fs.rmSync(out,{recursive:true});
}
fs.mkdirSync(out);
for(const entry of ['index.html','treatments.html','gallery.html','booking.html','robots.txt','licenses','css','js','images','fonts']){
 fs.cpSync(path.join(root,entry),path.join(out,entry),{recursive:true,filter:p=>{
  if(fs.statSync(p).isDirectory())return true;
  if(entry==='fonts')return /^latin-\d+\.woff2$/.test(path.basename(p));
  if(entry==='images')return /\.(webp|svg)$/.test(p)||p.endsWith('nallayil-ayurveda-logo.jpg');
  return true;
 }});
}
if(publishedContent){
 const ctx={window:{}};vm.createContext(ctx);vm.runInContext(fs.readFileSync(path.join(root,'js/data.js'),'utf8'),ctx);
 const data=ctx.window.NALLAYIL_DATA;data.initialGallery=publishedContent.gallery;data.initialOffers=publishedContent.offers;
 fs.writeFileSync(path.join(out,'js/data.js'),`const NALLAYIL_DATA=${JSON.stringify(data)};\nwindow.NALLAYIL_DATA=NALLAYIL_DATA;\nwindow.NallayilStore={getGallery:()=>NALLAYIL_DATA.initialGallery,getOffers:()=>NALLAYIL_DATA.initialOffers};\n`);
 for(const item of [...publishedContent.gallery,...publishedContent.offers])if(item.image.startsWith('images/')){const dest=path.join(out,item.image);fs.mkdirSync(path.dirname(dest),{recursive:true});fs.copyFileSync(path.join(root,item.image),dest);}
}
const headers=`/*\n  X-Content-Type-Options: nosniff\n  Referrer-Policy: strict-origin-when-cross-origin\n  Permissions-Policy: camera=(), microphone=(), geolocation=()\n  Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'none'; form-action 'self'\n`;
fs.writeFileSync(path.join(out,'_headers'),headers);
console.log('Built public dist/. Staff prototype, tools and documents excluded.');
