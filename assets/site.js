/* Prime Origins Global — shared interactions */

/* ---------- Cookie consent + Google Analytics (GA4) ---------- */
/* GDPR/PECR: GA4 only loads after the visitor accepts. Default = no tracking. */
(function(){
  var GA_ID = 'G-5WYFJ3NZJE';
  var KEY = 'po-consent';

  function loadGA(){
    if(window.__gaLoaded) return; window.__gaLoaded = true;
    var s = document.createElement('script');
    s.async = true; s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    function gtag(){ dataLayer.push(arguments); }
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', GA_ID, { anonymize_ip: true });
  }

  function showBanner(){
    var css = '.cc-banner{position:fixed;left:16px;right:16px;bottom:16px;z-index:1200;max-width:720px;margin:0 auto;background:rgba(12,24,18,.97);backdrop-filter:blur(12px);border:1px solid rgba(217,164,65,.32);border-radius:12px;padding:18px 20px;display:flex;gap:14px 18px;align-items:center;flex-wrap:wrap;justify-content:space-between;box-shadow:0 20px 50px rgba(0,0,0,.5);transform:translateY(160%);transition:transform .45s cubic-bezier(.2,.6,.2,1)}'
      + '.cc-banner.cc-in{transform:none}'
      + '.cc-text{color:#E6E0D2;font-size:.84rem;line-height:1.55;flex:1 1 320px;margin:0}'
      + '.cc-actions{display:flex;gap:10px;flex:0 0 auto}'
      + '.cc-btn{font:inherit;font-size:.76rem;font-weight:600;letter-spacing:.04em;padding:10px 22px;border-radius:100px;cursor:pointer;border:1px solid transparent;transition:all .25s}'
      + '.cc-decline{background:transparent;border-color:rgba(244,239,226,.3);color:#F4EFE2}'
      + '.cc-decline:hover{border-color:#D9A441;color:#D9A441}'
      + '.cc-accept{background:linear-gradient(100deg,#B3863A,#D9A441);color:#0C1812}'
      + '.cc-accept:hover{transform:translateY(-1px)}'
      + '@media(max-width:560px){.cc-banner{flex-direction:column;align-items:stretch}.cc-actions{justify-content:flex-end}}';
    var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

    var b = document.createElement('div');
    b.className = 'cc-banner'; b.setAttribute('role','dialog'); b.setAttribute('aria-label','Cookie consent');
    b.innerHTML = '<p class="cc-text">We use cookies to measure traffic and improve your experience. Analytics only runs if you accept.</p>'
      + '<div class="cc-actions">'
      + '<button class="cc-btn cc-decline" type="button">Decline</button>'
      + '<button class="cc-btn cc-accept" type="button">Accept</button>'
      + '</div>';
    document.body.appendChild(b);
    requestAnimationFrame(function(){ b.classList.add('cc-in'); });
    function choose(v){
      try{ localStorage.setItem(KEY, v); }catch(e){}
      b.classList.remove('cc-in');
      setTimeout(function(){ if(b.parentNode) b.parentNode.removeChild(b); }, 400);
      if(v === 'granted') loadGA();
    }
    b.querySelector('.cc-accept').addEventListener('click', function(){ choose('granted'); });
    b.querySelector('.cc-decline').addEventListener('click', function(){ choose('denied'); });
  }

  var choice = null;
  try{ choice = localStorage.getItem(KEY); }catch(e){}
  if(choice === 'granted'){ loadGA(); }
  else if(choice !== 'denied'){
    if(document.body){ showBanner(); } else { document.addEventListener('DOMContentLoaded', showBanner); }
  }
})();

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
