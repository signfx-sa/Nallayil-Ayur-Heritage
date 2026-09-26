// Exports public editorial content only. Booking/patient data is never included.
document.addEventListener('DOMContentLoaded',()=>{
 const button=document.createElement('button');button.className='action-btn';button.style.cssText='width:auto;padding:8px 14px';button.textContent='Export public gallery & offers';
 button.addEventListener('click',()=>{
  const content={gallery:NallayilStore.getGallery(),offers:NallayilStore.getOffers()};
  const url=URL.createObjectURL(new Blob([JSON.stringify(content,null,2)],{type:'application/json'}));
  const a=document.createElement('a');a.href=url;a.download='content.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
 });
 document.querySelector('.topbar-actions').append(button);
});
