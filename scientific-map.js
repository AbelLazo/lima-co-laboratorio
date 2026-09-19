'use strict';
(() => {
 const host=document.createElement('article');host.className='panel scientific-panel';
 host.innerHTML=`<div class="panel-heading"><div><p class="eyebrow">SUPERFICIE DEL MODELO · MAPA 2D</p><h2>CO sobre el área de Lima</h2></div><a id="map-save" class="secondary" download>Descargar imagen ↗</a></div><p class="caption">Cambia la fecha, la hora o pulsa «Reproducir» en los controles superiores. El mapa muestra el instante elegido, no el promedio del intervalo.</p><p id="scientific-status" role="status"></p><div class="scientific-layout"><img id="scientific-frame" alt="" width="1000" height="1000" hidden><aside><h3>Estaciones de referencia</h3><div id="scientific-stations"></div><div id="scientific-detail"></div><p class="caption">Los números señalan las estaciones. Elegir una actualiza sus datos; la superficie conserva toda el área de Lima.</p><p class="caption">Cada celda representa CO simulado en la primera capa de WRF (3 km). No es una medición ni un mapa de errores; no se interpolan las observaciones.</p><p class="caption" id="scientific-scale"></p><p class="caption">Conversión provisional a 25 °C y 1 atm. Colores de concentración, no categorías de riesgo sanitario.</p></aside></div>`;
 document.querySelector('.plots').before(host);
 const manifest=window.CO_MAPS,status=$('scientific-status'),img=$('scientific-frame'),save=$('map-save');
 if(!manifest||manifest.frames.length!==D.times.length||manifest.frames.some((f,i)=>f.time!==D.times[i])){status.textContent='La secuencia de mapas no está disponible o no coincide con las fechas. Las series siguen disponibles.';save.hidden=true;return;}
 document.body.classList.add('scientific-ready');
 // Reserve the square from the first load; never collapse it between frames.
 img.hidden=false;img.style.visibility='hidden';
 $('scientific-scale').textContent=`Escala fija mensual: ${manifest.range[0]}–${manifest.range[1]} µg/m³. Un mismo color representa la misma concentración en todas las fechas.`;
 $('scientific-stations').innerHTML=D.stations.map((s,i)=>`<button type="button" class="secondary station-choice" data-station="${s.id}">${i+1}. ${esc(s.name)}</button>`).join('');
 $('scientific-stations').addEventListener('click',e=>{const b=e.target.closest('[data-station]');if(b){stop();chooseStation(b.dataset.station)}});
 let shown=-1,request=0;
 function update(){
  document.querySelectorAll('.station-choice').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.station===state.station)));
  $('scientific-detail').innerHTML=detail(records.get(state.station+'|'+D.times[state.index]));
  if(shown===state.index)return;
  shown=state.index;const token=++request,frame=manifest.frames[shown];
  img.setAttribute('aria-busy','true');
  status.textContent='Cargando '+prettyTime(frame.time)+' · '+(img.getAttribute('src')?'Se conserva el mapa anterior.':'Lima (UTC−5)…');
  const pending=new Image();
  pending.onload=async()=>{try{await pending.decode()}catch{pending.onerror();return}if(token!==request)return;img.src=frame.file;img.alt='CO simulado en Lima · '+frame.time+' UTC−5 · escala 0–'+manifest.range[1]+' µg/m³';img.style.visibility='visible';img.setAttribute('aria-busy','false');save.href=frame.file;save.download='CO_Lima_'+frame.time.replace(/[: ]/g,'-')+'.webp';save.hidden=false;status.textContent=prettyTime(frame.time)+' · Lima (UTC−5) · '+(shown+1)+' / '+manifest.frames.length;
   if(shown<state.end){const preload=new Image();preload.src=manifest.frames[shown+1].file;}
  };
  pending.onerror=()=>{if(token!==request)return;shown=-1;img.setAttribute('aria-busy','false');status.textContent='No se pudo cargar el instante solicitado. '+(img.getAttribute('src')?'Se conserva el mapa anterior. ':'')+'Cambia de instante para reintentar.';};
  pending.src=frame.file;
 }
 const previous=render;render=function(){previous();update()};update();
 const quality=document.querySelector('#calidad .two-col article:last-child p:last-child');
 if(quality)quality.textContent='La superficie de CO procede de la malla WRF, no de interpolar estaciones. Solo se validan los puntos con observaciones disponibles; el color fuera de ellos no demuestra exactitud local.';
})();
