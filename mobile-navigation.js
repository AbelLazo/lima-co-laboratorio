(()=>{
 const world=document.querySelector('.method-world'),label=document.createElement('label');label.className='mobile-subject';label.textContent='Elemento que estás explorando';
 const select=document.createElement('select');select.setAttribute('aria-label','Elemento del método');
 world.querySelectorAll('[data-node]').forEach(node=>{const option=document.createElement('option');option.value=node.dataset.node;option.textContent=node.querySelector('strong').textContent;select.append(option);});
 label.append(select);world.querySelector('.world-bottom').prepend(label);
 const sync=()=>{select.value=world.dataset.subject;};new MutationObserver(sync).observe(world,{attributes:true,attributeFilter:['data-subject']});sync();
 select.addEventListener('change',()=>world.querySelector(`[data-node="${select.value}"]`).click());
 document.querySelectorAll('.sidebar [data-view]').forEach(button=>button.addEventListener('click',()=>{if(matchMedia('(max-width:700px)').matches)requestAnimationFrame(()=>window.scrollTo({top:0,behavior:'instant'}));}));
})();
