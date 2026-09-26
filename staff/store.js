/* INTERNAL PROTOTYPE ONLY: retains existing browser-local records; not an API. */
(() => {
  const copy=value=>JSON.parse(JSON.stringify(value));
  function read(key,initial){try{const raw=localStorage.getItem(key);if(!raw)return copy(initial);const parsed=JSON.parse(raw);return Array.isArray(parsed)?parsed:copy(initial);}catch{return copy(initial);}}
  function save(key,value,event){try{localStorage.setItem(key,JSON.stringify(value));window.dispatchEvent(new CustomEvent(event));}catch(e){alert('Browser storage is unavailable or full. The change was not saved. Export a backup and free storage before trying again.');throw e;}}
  window.NallayilStore={
    getGallery:()=>read('nallayil_gallery',NALLAYIL_DATA.initialGallery),
    saveGallery:value=>save('nallayil_gallery',value,'nallayil_gallery_updated'),
    getOffers:()=>read('nallayil_offers',NALLAYIL_DATA.initialOffers),
    saveOffers:value=>save('nallayil_offers',value,'nallayil_offers_updated'),
    getBookings:()=>read('nallayil_bookings',[]),
    saveBookings:value=>save('nallayil_bookings',value,'nallayil_bookings_updated'),
    addBooking(booking){const all=this.getBookings();all.unshift(booking);this.saveBookings(all);return booking;}
  };
})();
