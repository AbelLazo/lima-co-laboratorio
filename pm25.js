/* Historical feasibility experiment. No new simulation or calibration in-browser. */
(() => {
  'use strict';
  const data=window.PM25_DATA;
  const el=id=>document.getElementById(id);
  const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const f=(v,d=2)=>v==null?'No disponible':v.toLocaleString('es-PE',{maximumFractionDigits:d,minimumFractionDigits:d});
  const section=document.createElement('section'); section.id='pm25';section.className='view';section.hidden=true;
  document.querySelector('.main-footer').before(section);
  const nav=document.createElement('button');nav.className='nav';nav.dataset.view='pm25';nav.innerHTML='04 <span>PM₂.₅ exploratorio</span>';
  document.querySelector('.sidebar nav').appendChild(nav);
  nav.addEventListener('click',()=>showView('pm25'));
  if(!data){section.innerHTML='<h2>Análisis no disponible</h2><p>No se pudo cargar pm25-data.js. No se muestran valores de ejemplo.</p>';return;}
  section.innerHTML=`<div class="pm-intro"><p class="eyebrow">EXTENSIÓN EXPERIMENTAL / AGOSTO 2018</p><h2>¿Puede el CO ayudar a estimar PM₂.₅?</h2><p>Exploramos una relación empírica entre ambos contaminantes. La estimación usa el CO simulado ya disponible; <strong>no es una simulación de aerosoles ni una conversión física de CO a partículas.</strong></p></div>
  <div class="pm-result"><strong>Resultado general: no hay una mejora consistente.</strong> El factor por estación reduce el error frente al promedio horario de referencia en solo 1 de 6 estaciones evaluables en la prueba final. Tampoco muestra una ventaja estable entre los bloques temporales. No está validado para pronósticos o alertas.</div>
  <div class="pm-controls"><label>Estación del análisis<select id="pm-station"></select></label><button id="pm-download" class="secondary">Descargar comparación CSV</button></div>
  <div id="pm-warning" class="warning" hidden></div>
  <div class="pm-steps"><span><strong>Ajuste:</strong> 1–20 agosto</span><span><strong>Prueba sin reajuste:</strong> 21–31 agosto</span><span>Hora local de Lima (UTC−5)</span></div>
  <div id="pm-kpis" class="kpis"></div><p id="pm-verdict" class="pm-result" aria-live="polite"></p>
  <div class="pm-grid"><article class="panel"><p class="eyebrow">RELACIÓN ENTRE OBSERVACIONES</p><h2>CO observado frente a PM₂.₅ observado</h2><div id="pm-scatter"></div><p id="pm-correlation" class="caption"></p><p class="caption">Pares horarios de todo agosto. Asociación descriptiva; no demuestra capacidad predictiva. Pase el puntero por un punto para consultar su fecha y valores.</p></article>
  <article class="panel"><p class="eyebrow">EVALUACIÓN FUERA DEL AJUSTE</p><h2>¿Cómo se comporta la estimación?</h2><div class="pm-legend"><span style="color:#54dfc4">━ PM₂.₅ observado</span><span style="color:#ffbb68">┄ Estimado desde CO</span><span style="color:#bcafff">··· Referencia horaria</span></div><div id="pm-series"></div><p class="caption">21–31 agosto, coincidencias cada 3 horas. Los vacíos no se rellenan. La referencia es el promedio de PM₂.₅ por hora del día calculado solo del 1 al 20, sobre los mismos pares de ajuste.</p></article></div>
  <article class="panel pm-scroll"><h2>Comparación por estación</h2><p>MAE en µg/m³, menor es mejor. Cambio positivo: más error que la referencia; negativo: menos error. Ambas alternativas se evalúan sobre los mismos instantes.</p><table><thead><tr><th>Estación</th><th>Pares ajuste / prueba</th><th>MAE estimación</th><th>MAE referencia</th><th>Cambio del error</th></tr></thead><tbody id="pm-table"></tbody></table></article>
  <div class="pm-grid"><article class="panel pm-detail"><h2>Cómo se calculó</h2><p>Por estación: <strong>F = Σ PM₂.₅ observado / Σ CO simulado</strong>, usando únicamente los pares del 1 al 20 de agosto. Después: <strong>PM₂.₅ estimado = F × CO simulado</strong> para el 21 al 31, sin reajustar F.</p><p id="pm-factor"></p><p>El CO simulado se usa en ppmv. F se expresa en (µg/m³)/ppmv. No se aplica aquí la conversión provisional del CO a 25 °C y 1 atm.</p><details><summary>Estabilidad en otros cortes temporales</summary><p>Ajustes crecientes: 1–10 → prueba 11–17; 1–17 → 18–24; 1–24 → 25–31. No se seleccionó el mejor corte para sustituir la prueba final.</p><div id="pm-folds"></div></details></article>
  <article class="panel pm-detail"><h2>Límites de esta extensión</h2><ul><li>Un mes no demuestra transferencia a otras estaciones o épocas.</li><li>No hay banderas de calidad horaria disponibles. Se conservan ceros y no se imputan ausentes ni eliminan extremos.</li><li>Las observaciones horarias y las salidas instantáneas de WRF no son temporalmente equivalentes.</li><li>Las condiciones de referencia del CO observado siguen pendientes de confirmar.</li><li>No se generan mapas de PM₂.₅: el ajuste puntual no justifica extrapolar al territorio.</li></ul><p>Inspirado en el enfoque de trazador de Saide et al. (2011). No reproduce su calibración por episodios de CO alto ni transfiere factores de Chile a Lima.</p></article></div>
  <article class="panel pm-detail"><h2>Fuentes y reproducibilidad</h2><p>Observaciones: archivo horario de Datos Abiertos Perú, agosto de 2018. CO simulado: caso WRF <code>cams_terreno</code>, primera capa de d02. Las métricas mostradas se contrastaron con las tablas del análisis previo.</p><p>Solo se muestran las siete estaciones con correspondencia espacial en el proyecto. El análisis observacional original incluye diez. Se exigieron al menos 30 pares de ajuste y 20 de prueba como mínimo práctico de cálculo, no como garantía de validez estadística.</p><details><summary>Archivos de origen y huellas SHA-256</summary><div id="pm-hashes"></div></details><p>${escape(data.version)}. Consulta histórica experimental, sin nuevas descargas ni ejecución de WRF.</p></article>`;
  el('pm-station').innerHTML=data.stations.map(s=>`<option value="${s.id}">${escape(s.name)}</option>`).join('');
  el('pm-station').value='SANTA_ANITA';
  el('pm-hashes').innerHTML=Object.entries(data.hashes).map(([k,v])=>`<p>${escape(k)}</p><p class="hash">${v}</p>`).join('');
  const change=s=>s.mae==null||!s.baselineMae?null:100*(s.mae/s.baselineMae-1);
  const stamp=t=>Date.parse(t.replace(' ','T')+'-05:00');
  function axes(xmax,ymax,xlabel,title){
    const x=v=>65+v/xmax*460,y=v=>245-v/ymax*215;
    let svg=`<svg class="pm-chart" viewBox="0 0 560 310" role="img" aria-label="${escape(title)}"><title>${escape(title)}</title><text x="65" y="16">PM₂.₅ (µg/m³)</text>`;
    for(let i=0;i<=4;i++){const v=ymax*i/4;svg+=`<line class="grid" x1="65" x2="525" y1="${y(v)}" y2="${y(v)}"/><text text-anchor="end" x="57" y="${y(v)+4}">${f(v,0)}</text>`;}
    svg+=`<text x="295" y="302" text-anchor="middle">${xlabel}</text>`;
    return {svg,x,y};
  }
  function scatter(s){
    if(!s.scatter.length)return '<p class="pm-unavailable">No hay pares horarios disponibles.</p>';
    const xmax=Math.max(...s.scatter.map(r=>r[1]))*1.05||1,ymax=Math.max(...s.scatter.map(r=>r[2]))*1.1||1;
    let {svg,x,y}=axes(xmax,ymax,'CO observado (µg/m³)',`Relación observada en ${s.name}`);
    for(let i=0;i<=4;i++)svg+=`<text x="${x(xmax*i/4)}" y="270" text-anchor="middle">${f(xmax*i/4,0)}</text>`;
    for(const [t,co,pm] of s.scatter)svg+=`<circle cx="${x(co)}" cy="${y(pm)}" r="2.8" fill="#54dfc4" fill-opacity=".5"><title>${escape(t)} · CO ${f(co)} µg/m³ · PM₂.₅ ${f(pm)} µg/m³</title></circle>`;
    return svg+'</svg>';
  }
  function series(s){
    if(!s.series.length)return '<p class="pm-unavailable">No evaluable: faltan pares de prueba suficientes del 21 al 31 de agosto. No se presenta una estimación artificial ni un error igual a cero.</p>';
    const start=stamp('2018-08-21 00:00:00'),end=stamp('2018-08-31 23:59:59');
    const ymax=Math.max(...s.series.flatMap(r=>[r.observed,r.estimate,r.baseline]))*1.1||1;
    let {svg,x,y}=axes(end-start,ymax,'Agosto 2018 · hora local',`Prueba temporal PM2.5 en ${s.name}`);
    for(const day of [21,24,27,31])svg+=`<text x="${x(stamp(`2018-08-${day} 00:00:00`)-start)}" y="270" text-anchor="middle">${day} ago</text>`;
    for(const [key,color,dash] of [['baseline','#bcafff','2 5'],['estimate','#ffbb68','6 4'],['observed','#54dfc4','']]){
      let path='',previous=null;
      for(const r of s.series){const t=stamp(r.time);path+=`${previous!==null&&t-previous===10800000?'L':'M'}${x(t-start)},${y(r[key])} `;previous=t;}
      svg+=`<path d="${path}" fill="none" stroke="${color}" stroke-width="2" stroke-dasharray="${dash}"/>`;
      for(const r of s.series)svg+=`<circle cx="${x(stamp(r.time)-start)}" cy="${y(r[key])}" r="2.5" fill="${color}"><title>${escape(r.time)} · ${key==='observed'?'Observado':key==='estimate'?'Estimado':'Referencia'}: ${f(r[key])} µg/m³</title></circle>`;
    }
    return svg+'</svg>';
  }
  function renderPM(){
    const s=data.stations.find(s=>s.id===el('pm-station').value),delta=change(s);
    el('pm-warning').hidden=!s.maintenance;
    el('pm-warning').textContent='El boletín mensual reporta mantenimiento en esta estación. No identifica aquí qué registros horarios son válidos; los pares numéricos no equivalen a datos certificados.';
    el('pm-kpis').innerHTML=[['Pares de ajuste / prueba',`${s.train} / ${s.test}`,'CO simulado y PM₂.₅ observado'],['MAE estimación',f(s.mae),'µg/m³ · prueba 21–31'],['MAE referencia horaria',f(s.baselineMae),'µg/m³ · mismos pares'],['Cambio del error',delta==null?'No evaluable':`${delta>=0?'+':''}${f(delta,1)} %`,'Respecto a la referencia horaria']].map(([label,value,note])=>`<article><p>${label}</p><div class="number">${value}</div><span>${note}</span></article>`).join('');
    el('pm-verdict').textContent=delta==null?`${s.name}: no hay suficientes pares para esta prueba temporal.`:delta>=0?`${s.name}: la estimación tiene ${f(delta,1)} % más error que la referencia. No aporta mejora en esta prueba.`:`${s.name}: el error baja ${f(-delta,1)} % en esta prueba, pero la ventaja no es estable entre bloques. No demuestra una capacidad generalizable.`;
    el('pm-scatter').innerHTML=scatter(s);el('pm-series').innerHTML=series(s);
    el('pm-correlation').textContent=`${s.n} pares horarios · r de Pearson = ${f(s.r,3)}. Esta correlación es entre observaciones, no entre la estimación y las mediciones.`;
    el('pm-factor').textContent=s.factor==null?'Sin factor evaluable para esta prueba.':`Factor ajustado F = ${f(s.factor,3)} (µg/m³)/ppmv, con ${s.train} pares del período de ajuste.`;
    el('pm-folds').innerHTML=s.folds.length?s.folds.map(r=>`<p>Prueba ${r.name.replace('forward_','').replace('_','–')} agosto: ${r.n} pares; cambio del error ${r.change>=0?'+':''}${f(r.change,1)} %.</p>`).join(''):'<p>No hay bloques evaluables suficientes.</p>';
    el('pm-table').innerHTML=data.stations.map(r=>`<tr class="${r.id===s.id?'pm-table-current':''}"><td>${escape(r.name)}</td><td>${r.train} / ${r.test}</td><td>${f(r.mae)}</td><td>${f(r.baselineMae)}</td><td>${change(r)==null?'No evaluable':`${change(r)>=0?'+':''}${f(change(r),1)} %`}</td></tr>`).join('');
    el('pm-download').disabled=!s.series.length;
  }
  el('pm-station').addEventListener('change',renderPM);
  el('pm-download').addEventListener('click',()=>{
    const s=data.stations.find(s=>s.id===el('pm-station').value);
    const rows=[['estacion','fecha_local_UTC_menos_5','PM25_observado_ug_m3','PM25_estimado_experimental_ug_m3','referencia_horaria_ug_m3','ajuste','prueba','advertencia_mantenimiento','estado'],...s.series.map(r=>[s.name,r.time,r.observed,r.estimate,r.baseline,'2018-08-01/2018-08-20','2018-08-21/2018-08-31',s.maintenance,'Experimental; QA pendiente; no pronostico ni simulacion de aerosoles'])];
    const csv=rows.map(r=>r.map(v=>'"'+String(v).replaceAll('"','""')+'"').join(',')).join('\r\n');
    const url=URL.createObjectURL(new Blob(['\ufeff'+csv],{type:'text/csv;charset=utf-8'}));
    const a=document.createElement('a');a.href=url;a.download=`PM25_experimental_${s.id}_201808_prueba.csv`;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
  });
  renderPM();
})();
