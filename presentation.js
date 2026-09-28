/* Navigation and presentation controls only; no scientific state is changed. */
(() => {
 'use strict';
 const header=document.querySelector('.page-header');
 const actions=document.createElement('div');actions.className='presentation-actions';
 const badge=header.querySelector('.status');actions.appendChild(badge);
 const focus=document.createElement('button');focus.type='button';focus.className='focus-toggle';focus.textContent='Ampliar espacio';focus.setAttribute('aria-pressed','false');
 focus.title='Ocultar la barra lateral para dar más espacio al análisis';actions.appendChild(focus);header.appendChild(actions);
 focus.addEventListener('click',()=>{
   const active=document.body.classList.toggle('presentation-focus');
   focus.textContent=active?'Mostrar navegación':'Ampliar espacio';focus.setAttribute('aria-pressed',String(active));
 });
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&document.body.classList.contains('presentation-focus')){focus.click();focus.focus();}});
 const sections=[
  ['explorar',[['.scientific-panel','Mapa del modelo','Territorio'],['.plots','Serie temporal','Evolución'],['.analysis-panel','Comparar estaciones','Contraste'],['.analysis-panel:last-child','Residuos','Diagnóstico']]],
  ['pm25',[['.pm-grid','Gráficas','Relación y prueba'],['.pm-scroll','Comparación','Error por estación'],['.pm-grid:nth-of-type(2)','Método','Alcances']]]
 ];
 for(const [view,items] of sections){
   const root=document.getElementById(view),nav=document.createElement('nav');
   nav.className='section-navigation';nav.setAttribute('aria-label',`Accesos del análisis ${view==='pm25'?'PM2.5':'CO'}`);
   items.forEach(([selector,title,subtitle],i)=>{
     // PM2.5 has two grid groups; the latter contains method and limitations.
     const target=view==='pm25'&&title==='Método'?root.querySelectorAll('.pm-grid')[1]:root.querySelector(selector);
     if(!target)return;
     target.id=target.id||`${view}-section-${i}`;
     const button=document.createElement('button');button.type='button';button.className='section-link';
     button.innerHTML=`<span class="section-number">0${i+1}</span><span><strong>${title}</strong><small>${subtitle}</small></span><span class="section-arrow" aria-hidden="true">↗</span>`;
     button.addEventListener('click',()=>{target.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'});target.tabIndex=-1;target.focus({preventScroll:true});});
     nav.appendChild(button);
   });
   root.prepend(nav);
 }
 const top=document.createElement('button');top.type='button';top.className='back-to-top';top.textContent='↑ Volver a controles';top.hidden=true;document.body.appendChild(top);
 top.addEventListener('click',()=>{window.scrollTo({top:0,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});focus.focus({preventScroll:true});});
 window.addEventListener('scroll',()=>{top.hidden=window.scrollY<650},{passive:true});
})();
