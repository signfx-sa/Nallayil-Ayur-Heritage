/* Static-hosting appointment request. Reception, not the browser, confirms availability. */
document.addEventListener('DOMContentLoaded', () => {
  const byId = id => document.getElementById(id);
  const form = byId('appointment-booking-form'); if (!form) return;
  const branch = byId('booking-branch'), doctor = byId('booking-doctor'), treatment = byId('booking-treatment'), date = byId('booking-date'), selectedSlot = byId('selected-time-slot'), slots = byId('booking-slots-container'), error = byId('booking-error');
  const params = new URLSearchParams(location.search);
  const localDate = d => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
  const today = () => localDate(new Date());
  date.min=today(); const tomorrow=new Date();tomorrow.setDate(tomorrow.getDate()+1);date.value=localDate(tomorrow);
  const option = (label,value=label) => new Option(label,value);
  treatment.replaceChildren(option('Select treatment or concern',''), ...NALLAYIL_DATA.treatments.map(t=>option(t.title,t.title)),option('General Consultation'));
  const requestedTreatment=params.get('treatment');
  const match=NALLAYIL_DATA.treatments.find(t=>t.id===requestedTreatment || t.title===requestedTreatment || (requestedTreatment==='Marma Chikitsa' && t.id==='marma-chikitsa'));
  if(match)treatment.value=match.title;
  const requestedDoctor=NALLAYIL_DATA.doctors.find(d=>d.name===params.get('doctor') || d.id===params.get('doctor'));
  if(requestedDoctor){const b=NALLAYIL_DATA.branches.find(b=>requestedDoctor.branch.toLowerCase().includes(b.name.split(' ')[0].toLowerCase()));if(b)branch.value=b.id;}
  if(NALLAYIL_DATA.branches.some(b=>b.id===params.get('branch')))branch.value=params.get('branch');
  const groups=[['Morning consultation',['09:00 AM - 09:45 AM','09:45 AM - 10:30 AM','10:30 AM - 11:15 AM','11:15 AM - 12:00 PM']],['Afternoon consultation',['02:30 PM - 03:15 PM','03:15 PM - 04:00 PM','04:00 PM - 04:45 PM']],['Evening consultation',['05:15 PM - 06:00 PM','06:00 PM - 06:45 PM','06:45 PM - 07:30 PM']]];
  function renderSlots(){
    selectedSlot.value=''; slots.replaceChildren(); date.min=today();
    groups.forEach(([title,times])=>{
      const label=document.createElement('div');label.className='slot-group-label';label.textContent=title;slots.append(label);
      const grid=document.createElement('div');grid.className='slots-grid';slots.append(grid);
      times.forEach(time=>{const button=document.createElement('button');button.type='button';button.className='time-slot-btn';button.textContent=time;button.setAttribute('aria-pressed','false');
        const [,h,m,ap]=time.match(/^(\d+):(\d+) (AM|PM)/);const hour=Number(h)%12+(ap==='PM'?12:0);const now=new Date();
        button.disabled=date.value<today() || (date.value===today() && hour*60+Number(m)<=now.getHours()*60+now.getMinutes());
        button.addEventListener('click',()=>{slots.querySelectorAll('button').forEach(b=>{b.classList.toggle('selected',b===button);b.setAttribute('aria-pressed',b===button);});selectedSlot.value=time;error.textContent='';});grid.append(button);
      });
    });
  }
  function updateDoctors(preferred=''){
    const b=NALLAYIL_DATA.branches.find(b=>b.id===branch.value);
    const doctors=NALLAYIL_DATA.doctors.filter(d=>d.branch.toLowerCase().includes(b.name.split(' ')[0].toLowerCase()));
    doctor.replaceChildren(option('Any available specialist','Any Available Specialist'),...doctors.map(d=>option(d.name)));
    if(doctors.some(d=>d.name===preferred))doctor.value=preferred;
    renderSlots();
  }
  branch.addEventListener('change',()=>updateDoctors());doctor.addEventListener('change',renderSlots);date.addEventListener('change',renderSlots);updateDoctors(requestedDoctor?.name);
  function invalid(message,element){error.textContent=message;element?.focus();}
  form.addEventListener('submit', e=>{
    e.preventDefault();error.textContent='';date.min=today();
    if(!form.reportValidity())return;
    if(!byId('booking-name').value.trim())return invalid('Please enter your name.',byId('booking-name'));
    if(!/^\+?[\d\s().-]+$/.test(byId('booking-phone').value) || !/^\d{10,15}$/.test(byId('booking-phone').value.replace(/\D/g,'')))return invalid('Please enter a valid phone number, including country code if needed.',byId('booking-phone'));
    if(!date.value || date.value<today())return invalid('Please select today or a future date.',date);
    if(!selectedSlot.value)return invalid('Please choose your preferred time.',slots.querySelector('button:not(:disabled)'));
    const chosen=[...slots.querySelectorAll('button')].find(b=>b.textContent===selectedSlot.value);
    if(!chosen || chosen.disabled)return invalid('Please choose another preferred time.',date);
    const [,hh,mm,ap]=selectedSlot.value.match(/^(\d+):(\d+) (AM|PM)/); const now=new Date();
    if(date.value===today() && (Number(hh)%12+(ap==='PM'?12:0))*60+Number(mm)<=now.getHours()*60+now.getMinutes()){renderSlots();return invalid('That time has passed. Please choose a later time.',date);}
    const b=NALLAYIL_DATA.branches.find(b=>b.id===branch.value);
    const booking={id:`NAL-${new Date().getFullYear()}-${crypto.randomUUID().slice(0,8).toUpperCase()}`,patient:byId('booking-name').value.trim(),phone:byId('booking-phone').value.trim(),branch:b.name,doctor:doctor.value,treatment:treatment.value,datetime:`${date.value} (${selectedSlot.value})`,mode:byId('booking-mode').value};
    for(const [key,value] of Object.entries(booking)){const el=byId(key==='id'?'receipt-ref':`receipt-${key}`);if(el)el.textContent=value;}
    const message=`Hello Nallayil Ayurveda, I would like to request an appointment. Please confirm availability.\nReference: ${booking.id}\nName: ${booking.patient}\nPhone: ${booking.phone}\nCenter: ${booking.branch}\nPhysician: ${booking.doctor}\nTreatment: ${booking.treatment}\nPreferred time: ${booking.datetime}\nVisit: ${booking.mode}${params.has('offer')?'\nProgramme: '+params.get('offer').slice(0,350):''}`;
    byId('receipt-whatsapp-btn').href=`https://wa.me/${b.whatsapp}?text=${encodeURIComponent(message)}`;
    window.NallayilUI.openModal(byId('booking-receipt-modal'));
  });
});
function printBookingReceipt(){window.print();}

document.addEventListener('DOMContentLoaded',()=>document.getElementById('print-request')?.addEventListener('click',printBookingReceipt));
