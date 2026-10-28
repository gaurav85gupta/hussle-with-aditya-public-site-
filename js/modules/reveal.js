/* ===== SCROLL REVEAL + TOP PROGRESS BAR ===== */
(function(){
  const io=new IntersectionObserver(es=>es.forEach(x=>{if(x.isIntersecting)x.target.classList.add('show')}),{threshold:.12});
  document.querySelectorAll('.reveal').forEach(el=>io.observe(el));

  const bar=document.getElementById('progress');
  addEventListener('scroll',()=>{
    const d=document.documentElement;
    bar.style.width=(d.scrollTop/(d.scrollHeight-d.clientHeight)*100)+'%';
  });
})();
