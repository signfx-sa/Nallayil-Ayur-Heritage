const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'../dist');
const pages=['index.html','treatments.html','gallery.html','booking.html'];
for(const p of pages){
 const text=fs.readFileSync(path.join(root,p),'utf8');
 assert(!/(?:href|src)=["'][^"']*(?:staff\/|admin)/i.test(text),`${p}: public staff reference`);
 assert(!/localhost|127\.0\.0\.1|[A-Z]:\\/.test(text),`${p}: development path`);
 assert(!/\son\w+=/.test(text),`${p}: inline event handler blocked by CSP`);
 for(const m of text.matchAll(/(?:src|href)="([^"#]+)(#[^"]*)?"/g)){
  const ref=m[1];if(/^(?:https?:|tel:|mailto:|data:)/.test(ref))continue;
  const file=ref.split('?')[0];assert(fs.existsSync(path.join(root,file)),`${p}: missing ${file}`);
  if(m[2] && file.endsWith('.html'))assert(fs.readFileSync(path.join(root,file),'utf8').includes(`id="${m[2].slice(1)}"`),`${p}: broken anchor ${m[0]}`);
 }
}
for(const file of ['js/main.js','js/booking.js','js/immersive.js','js/data.js'])new vm.Script(fs.readFileSync(path.join(root,file),'utf8'),{filename:file});
const ctx={window:{}};vm.createContext(ctx);vm.runInContext(fs.readFileSync(path.join(root,'js/data.js'),'utf8'),ctx);
assert.equal(ctx.window.NALLAYIL_DATA.treatments.length,8);assert.equal(ctx.window.NALLAYIL_DATA.branches.length,3);
assert.equal(ctx.window.NALLAYIL_DATA.initialBookings.length,0);assert.equal(ctx.window.NallayilStore.saveBookings,undefined);
for(const p of ['staff','admin.html','scripts','package.json'])assert(!fs.existsSync(path.join(root,p)),`Private file leaked: ${p}`);
assert.deepEqual(fs.readFileSync(path.join(root,'images/brand/nallayil-ayurveda-logo.jpg')),fs.readFileSync(path.join(root,'../images/brand/nallayil-ayurveda-logo.jpg')));
for(const m of fs.readFileSync(path.join(root,'css/fonts.css'),'utf8').matchAll(/url\(\.\.\/([^\)]+)\)/g))assert(fs.existsSync(path.join(root,m[1])),`Missing font ${m[1]}`);
console.log('PASS: public links, anchors, script syntax, original logo bytes, eight treatments, three centers, fonts and administrative isolation.');
