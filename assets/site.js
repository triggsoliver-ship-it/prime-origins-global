/* Prime Origins Global — shared interactions */
(function(){
  var hdr = document.getElementById('hdr');
  var bar = document.getElementById('progress');
  var toTop = document.getElementById('totop');

  function onScroll(){
    var y = window.scrollY || window.pageYOffset;
    if(hdr) hdr.classList.toggle('scrolled', y > 40);
    if(bar){
      var h = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      bar.style.width = (h>0 ? (y/h)*100 : 0) + '%';
    }
    if(toTop) toTop.classList.toggle('show', y > 600);
  }
  window.addEventListener('scroll', onScroll, {passive:true});
  onScroll();
  if(toTop) toTop.addEventListener('click', function(){
    var smooth = !matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({top:0, behavior: smooth ? 'smooth':'auto'});
  });

  // mobile menu
  var menuBtn = document.getElementById('menuBtn');
  if(menuBtn && hdr){
    menuBtn.addEventListener('click', function(){
      var open = hdr.classList.toggle('menu-open');
      menuBtn.setAttribute('aria-expanded', open ? 'true':'false');
    });
    document.querySelectorAll('.nav-links a').forEach(function(a){
      a.addEventListener('click', function(){ hdr.classList.remove('menu-open'); });
    });
  }

  // reveal on scroll
  var io = new IntersectionObserver(function(es){
    es.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });
  }, {threshold:.14, rootMargin:'0px 0px -6% 0px'});
  document.querySelectorAll('.rv:not(.in)').forEach(function(el){ io.observe(el); });

  // count-up
  var fmt = function(n){ return n.toLocaleString('en-US'); };
  var cio = new IntersectionObserver(function(es){
    es.forEach(function(e){
      if(!e.isIntersecting) return;
      var el = e.target, end = +el.dataset.count, suf = el.dataset.suffix || '';
      var t0 = performance.now(), dur = 1600;
      (function tick(t){
        var p = Math.min((t-t0)/dur, 1), ease = 1 - Math.pow(1-p,3);
        el.textContent = fmt(Math.round(end*ease)) + suf;
        if(p<1) requestAnimationFrame(tick);
      })(t0);
      cio.unobserve(el);
    });
  }, {threshold:.6});
  document.querySelectorAll('[data-count]').forEach(function(el){ cio.observe(el); });

  // gallery lightbox
  var items = [].slice.call(document.querySelectorAll('.gallery .gitem'));
  if(items.length){
    var lb = document.getElementById('lb');
    var lbImg = document.getElementById('lbImg');
    var idx = 0;
    var srcs = items.map(function(it){ var im = it.querySelector('img'); return im.getAttribute('data-full') || im.src; });
    function show(i){ idx=(i+srcs.length)%srcs.length; lbImg.src = srcs[idx]; }
    items.forEach(function(it,i){ it.addEventListener('click', function(){ show(i); lb.classList.add('open'); }); });
    if(lb){
      lb.querySelector('.lbx').addEventListener('click', function(){ lb.classList.remove('open'); });
      lb.querySelector('.lbprev').addEventListener('click', function(e){ e.stopPropagation(); show(idx-1); });
      lb.querySelector('.lbnext').addEventListener('click', function(e){ e.stopPropagation(); show(idx+1); });
      lb.addEventListener('click', function(e){ if(e.target===lb) lb.classList.remove('open'); });
      document.addEventListener('keydown', function(e){
        if(!lb.classList.contains('open')) return;
        if(e.key==='Escape') lb.classList.remove('open');
        if(e.key==='ArrowLeft') show(idx-1);
        if(e.key==='ArrowRight') show(idx+1);
      });
    }
  }

  // partner form -> FormSubmit AJAX (real email delivery, no page leave)
  var pf = document.getElementById('partnerForm');
  if(pf){
    pf.addEventListener('submit', function(e){
      e.preventDefault();
      var note = document.getElementById('pf-note');
      var btn = pf.querySelector('button[type="submit"]');
      var name = (pf.querySelector('[name="name"]').value||'').trim();
      var email = (pf.querySelector('[name="email"]').value||'').trim();
      var msg = (pf.querySelector('[name="message"]').value||'').trim();
      if(!name || !email || !msg){
        if(note){ note.textContent = 'Please add your name, email and a short message before sending.'; note.style.color = '#F2C566'; }
        return;
      }
      var data = new FormData(pf);
      if(btn){ btn.disabled = true; btn.dataset.label = btn.innerHTML; btn.innerHTML = 'Sending…'; }
      fetch(pf.action, { method:'POST', body:data, headers:{ 'Accept':'application/json' } })
        .then(function(r){ return r.json().catch(function(){ return {}; }).then(function(j){ return {ok:r.ok, j:j}; }); })
        .then(function(res){
          if(res.ok){
            var ok = document.getElementById('form-ok');
            pf.style.display = 'none';
            if(ok) ok.classList.add('show');
          } else {
            if(note){ note.textContent = (res.j && res.j.message) ? res.j.message : 'Something went wrong — please email oliver@primeorigins.org directly.'; note.style.color = '#F2C566'; }
            if(btn){ btn.disabled = false; btn.innerHTML = btn.dataset.label; }
          }
        })
        .catch(function(){
          if(note){ note.innerHTML = 'Network error — please email <a href="mailto:oliver@primeorigins.org">oliver@primeorigins.org</a> directly.'; note.style.color = '#F2C566'; }
          if(btn){ btn.disabled = false; btn.innerHTML = btn.dataset.label; }
        });
    });
  }
})();
