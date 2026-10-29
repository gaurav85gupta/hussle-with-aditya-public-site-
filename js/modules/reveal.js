/* ===== SCROLL REVEAL + TOP PROGRESS BAR ===== */
(function(){
  const io=new IntersectionObserver(es=>es.forEach(x=>{if(x.isIntersecting)x.target.classList.add('show')}),{threshold:.12});
  document.querySelectorAll('.reveal').forEach(el=>io.observe(el));

  const bar=document.getElementById('progress');
  let ticking=false;
  function update(){
    ticking=false;
    const d=document.documentElement;
    bar.style.width=(d.scrollTop/(d.scrollHeight-d.clientHeight)*100)+'%';
  }
  /* passive + one update per frame: no layout work on every touch-scroll event */
  addEventListener('scroll',()=>{ if(!ticking){ ticking=true; requestAnimationFrame(update); } },{passive:true});
})();
