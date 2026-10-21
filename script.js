(() => {
  'use strict';
  const menuButton = document.querySelector('.menu-toggle');
  const mobileNav = document.getElementById('mobile-nav');
  function closeMenu() { mobileNav.hidden = true; menuButton.setAttribute('aria-expanded','false'); menuButton.setAttribute('aria-label','Open menu'); }
  menuButton.addEventListener('click', () => { const open = menuButton.getAttribute('aria-expanded') !== 'true'; menuButton.setAttribute('aria-expanded',String(open)); menuButton.setAttribute('aria-label',open?'Close menu':'Open menu'); mobileNav.hidden = !open; });
  mobileNav.querySelectorAll('a').forEach(a => a.addEventListener('click',closeMenu));
  document.addEventListener('keydown', event => { if(event.key === 'Escape' && !mobileNav.hidden) { closeMenu(); menuButton.focus(); } });
  window.matchMedia('(min-width:961px)').addEventListener('change', event => { if(event.matches) closeMenu(); });
  if (!document.getElementById('planning-form')) return;
  const tabs = [...document.querySelectorAll('[role="tab"]')];
  const panels = [...document.querySelectorAll('[role="tabpanel"]')];
  function activateTab(tab, focus = false) {
    tabs.forEach(item => { const selected = item === tab; item.setAttribute('aria-selected',String(selected)); item.tabIndex = selected?0:-1; });
    panels.forEach(panel => { panel.hidden = panel.id !== tab.getAttribute('aria-controls'); });
    if(focus) tab.focus();
  }
  tabs.forEach((tab,index) => { tab.addEventListener('click', () => activateTab(tab)); tab.addEventListener('keydown', event => { let next; if(event.key === 'ArrowRight') next = (index+1)%tabs.length; if(event.key === 'ArrowLeft') next = (index-1+tabs.length)%tabs.length; if(event.key === 'Home') next=0; if(event.key === 'End') next=tabs.length-1; if(next !== undefined) { event.preventDefault(); activateTab(tabs[next],true); } }); });
  const serviceInput = document.getElementById('service');
  document.querySelectorAll('[data-service]').forEach(link => link.addEventListener('click', () => { serviceInput.value = link.dataset.service; }));
  const dateInput = document.getElementById('date');
  const today = new Date();
  dateInput.min = [today.getFullYear(),String(today.getMonth()+1).padStart(2,'0'),String(today.getDate()).padStart(2,'0')].join('-');
  document.getElementById('planning-form').addEventListener('submit', event => {
    event.preventDefault();
    if(!event.currentTarget.reportValidity()) return;
    const data = new FormData(event.currentTarget);
    const name = String(data.get('name')).trim();
    if(!name) { const input = document.getElementById('full-name'); input.setCustomValidity('Please enter your name.'); input.reportValidity(); input.addEventListener('input',()=>input.setCustomValidity(''),{once:true}); return; }
    const service = String(data.get('service') || 'Let’s figure it out together');
    const lines = ['Hello Lea,','',`My name is ${name}. I’d love some help with ${service.toLowerCase()}.`,'',`Name: ${name}`,`Email: ${String(data.get('email')).trim()}`,`Interested in: ${service}`];
    if(data.get('date')) lines.push(`Preferred date: ${data.get('date')}`);
    if(String(data.get('details')).trim()) lines.push('',String(data.get('details')).trim());
    lines.push('','Sent with The Confetti Way enquiry planner.');
    const summary = document.getElementById('enquiry-summary');
    summary.textContent=lines.join('\n'); summary.className='enquiry-summary';
    const recipient = window.confettiWayConfig?.email || 'lea@theconfettiway.com';
    document.getElementById('send-enquiry').href=`mailto:${recipient}?subject=${encodeURIComponent(`Concierge enquiry — ${service}`)}&body=${encodeURIComponent(lines.join('\n'))}`;
    const result=document.getElementById('enquiry-result'); result.hidden=false; result.focus(); result.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion:reduce)').matches?'auto':'smooth',block:'center'});
  });
})();
