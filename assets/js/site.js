(function(){'use strict';
const $=(s,r=document)=>r.querySelector(s);
function closeMobile(){const p=$('#itg-mobile-panel'),b=$('#itg-menu-toggle');if(p){p.hidden=true;document.body.style.overflow='';}if(b){b.setAttribute('aria-expanded','false');b.setAttribute('aria-label','Open navigation menu');}}
window.ITG={showPreviewInfo:function(){alert('This is a design preview, not a working authenticated portal. Please contact ITG using the Contact page for assistance.');},closeMobile};
document.addEventListener('DOMContentLoaded',function(){
  const open=$('#itg-menu-toggle'),panel=$('#itg-mobile-panel'),close=$('.itg-mobile-close');
  if(open&&panel){open.addEventListener('click',()=>{let next=panel.hidden;panel.hidden=!next;open.setAttribute('aria-expanded',String(next));open.setAttribute('aria-label',next?'Close navigation menu':'Open navigation menu');document.body.style.overflow=next?'hidden':'';});}
  if(close)close.addEventListener('click',closeMobile);
  document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeMobile();const m=$('.itg-more-menu');if(m)m.classList.remove('open');}});
  if(panel)panel.addEventListener('click',e=>{if(e.target.closest('a'))closeMobile();});
  const more=$('.itg-more-trigger');if(more){more.addEventListener('click',()=>{const m=$('#itg-more-menu');if(m){m.classList.toggle('open');more.setAttribute('aria-expanded',String(m.classList.contains('open')));}});}
  document.addEventListener('click',e=>{if(!e.target.closest('.itg-more')){const m=$('#itg-more-menu');if(m){m.classList.remove('open');if(more)more.setAttribute('aria-expanded','false');}}});
  const year=$('#itg-year');if(year)year.textContent=String(new Date().getFullYear());
  const confirmation=new URLSearchParams(location.search).get('sent');if(location.pathname.endsWith('quote-confirmation.html')&&confirmation==='1'){const notice=$('.itg-preview-bar');if(notice){notice.innerHTML='Your request has been accepted by the website mail handler. Check your inbox for a reference and contact ITG if you do not receive a reply.';notice.style.background='#e8f6ec';}}
  // Handle old interactive demo controls safely: no fake logins, payouts, or upload confirmations.
  document.querySelectorAll('a[href="#"]').forEach(a=>a.href='contact.html');
});
})();