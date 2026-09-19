'use strict';
// Shared pure calculations. Missing values are never replaced by zero.
const COAnalysis={
 stats(rows){const pairs=rows.filter(r=>r.valid&&r.obs!=null&&r.sim!=null),n=pairs.length;
  const result={n,possible:rows.length,coverage:rows.length?n/rows.length:null,bias:null,mae:null,rmse:null,r:null,meanObs:null,meanSim:null};
  if(!n)return result;
  const mean=a=>a.reduce((s,x)=>s+x,0)/a.length,o=pairs.map(r=>r.obs),s=pairs.map(r=>r.sim),e=pairs.map(r=>r.sim-r.obs),mo=mean(o),ms=mean(s);
  Object.assign(result,{bias:mean(e),mae:mean(e.map(Math.abs)),rmse:Math.sqrt(mean(e.map(x=>x*x))),meanObs:mo,meanSim:ms});
  const oo=o.reduce((a,x)=>a+(x-mo)**2,0),ss=s.reduce((a,x)=>a+(x-ms)**2,0);
  if(n>=2&&oo>0&&ss>0)result.r=o.reduce((a,x,i)=>a+(x-mo)*(s[i]-ms),0)/Math.sqrt(oo*ss);
  return result;
 },
 interval(times,start,end){if(!/^2018-08-\d{2}$/.test(start)||!/^2018-08-\d{2}$/.test(end)||start>end)throw new Error('Selecciona fechas válidas y un inicio anterior o igual al fin.');
  const a=times.findIndex(t=>t.slice(0,10)===start),b=times.map(t=>t.slice(0,10)).lastIndexOf(end);
  if(a<0||b<a)throw new Error('El intervalo debe estar dentro de agosto de 2018.');return {start:a,end:b};}
};
if(typeof module!=='undefined')module.exports=COAnalysis;
