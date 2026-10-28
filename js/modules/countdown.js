/* ===== COUNTDOWN TIMER ===== */
(function(){
  const h=document.getElementById('cd-h'),m=document.getElementById('cd-m'),s=document.getElementById('cd-s');
  function tick(){
    const now=new Date();
    let end;
    if(CONFIG.OFFER_END){ end=new Date(CONFIG.OFFER_END); }
    else{ end=new Date(); end.setHours(23,59,59,999); }   // default: resets every midnight
    const d=Math.max(0,end-now);
    h.textContent=String(Math.floor(d/36e5)).padStart(2,'0');
    m.textContent=String(Math.floor(d%36e5/6e4)).padStart(2,'0');
    s.textContent=String(Math.floor(d%6e4/1e3)).padStart(2,'0');
  }
  tick(); setInterval(tick,1000);
})();
