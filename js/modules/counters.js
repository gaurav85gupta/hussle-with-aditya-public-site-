/* ===== ANIMATED NUMBERS (stats) ===== */
(function(){
  const els=document.querySelectorAll('[data-count]');
  const io=new IntersectionObserver(es=>es.forEach(e=>{
    if(!e.isIntersecting) return;
    io.unobserve(e.target);
    const el=e.target,end=parseFloat(el.dataset.count),dec=el.dataset.dec?1:0,suffix=el.dataset.suffix||'',t0=performance.now(),dur=1600;
    (function step(t){
      const p=Math.min(1,(t-t0)/dur),v=end*(1-Math.pow(1-p,3));
      el.textContent=(dec?v.toFixed(1):Math.floor(v).toLocaleString('en-IN'))+suffix;
      if(p<1) requestAnimationFrame(step);
    })(t0);
  }),{threshold:.5});
  els.forEach(el=>io.observe(el));
})();
