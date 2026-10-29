/* ===== NAVBAR: mobile menu, scrolled style, active link ===== */
(function(){
  const header=document.getElementById('header');
  const links=document.getElementById('links');
  const burger=document.getElementById('burger');

  burger.addEventListener('click',()=>links.classList.toggle('open'));
  links.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>links.classList.remove('open')));

  addEventListener('scroll',()=>header.classList.toggle('scrolled',scrollY>20),{passive:true});

  // highlight current section in menu
  const secs=[...links.querySelectorAll('a')].map(a=>document.querySelector(a.getAttribute('href'))).filter(Boolean);
  const io=new IntersectionObserver(es=>es.forEach(e=>{
    if(e.isIntersecting){
      links.querySelectorAll('a').forEach(a=>a.classList.toggle('active',a.getAttribute('href')==='#'+e.target.id));
    }
  }),{rootMargin:'-45% 0px -50% 0px'});
  secs.forEach(s=>io.observe(s));
})();
