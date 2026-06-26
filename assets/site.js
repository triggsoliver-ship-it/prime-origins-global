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

/* Prime Origins Global — PWA: manifest, home-screen icon & install prompt */
(function(){
  var head = document.head;
  function has(sel){ return !!head.querySelector(sel); }
  function addMeta(name, content){ if(has('meta[name="'+name+'"]')) return; var m=document.createElement('meta'); m.name=name; m.content=content; head.appendChild(m); }

  if(!has('link[rel="manifest"]')){ var l=document.createElement('link'); l.rel='manifest'; l.href='/manifest.webmanifest'; head.appendChild(l); }
  if(!has('meta[name="theme-color"]')){ addMeta('theme-color', '#0c1a14'); }
  addMeta('mobile-web-app-capable', 'yes');
  addMeta('apple-mobile-web-app-capable', 'yes');
  addMeta('apple-mobile-web-app-status-bar-style', 'black-translucent');
  addMeta('apple-mobile-web-app-title', 'Prime Origins');
  if(!has('link[rel="apple-touch-icon"]')){ var a=document.createElement('link'); a.rel='apple-touch-icon'; a.href='https://www.primeoriginsatlas.org/logo.png'; head.appendChild(a); }

  if('serviceWorker' in navigator){
    window.addEventListener('load', function(){ navigator.serviceWorker.register('/sw.js').catch(function(){}); });
  }

  // Add-to-home-screen prompt
  var KEY = 'po-a2hs-dismissed';
  var standalone = (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) || window.navigator.standalone === true;
  if(standalone) return;
  try{ if(localStorage.getItem(KEY)) return; }catch(e){}

  var ua = navigator.userAgent || '';
  var isiOS = /iPhone|iPad|iPod/.test(ua) && !window.MSStream;
  var isSafari = /^((?!chrome|crios|android|fxios|edgios).)*safari/i.test(ua);
  var deferred = null;

  var css = ''
    + '#po-a2hs{position:fixed;left:12px;right:12px;bottom:12px;z-index:4000;max-width:460px;margin:0 auto;'
    + 'background:#0c1a14;color:#f4f6f6;border:1px solid rgba(200,162,74,.4);border-radius:16px;'
    + 'box-shadow:0 18px 50px -12px rgba(0,0,0,.6);padding:13px 14px;display:none;align-items:center;gap:12px;'
    + 'font-family:Inter,system-ui,-apple-system,sans-serif}'
    + '#po-a2hs.show{display:flex;animation:poUp .4s ease}'
    + '@keyframes poUp{from{transform:translateY(22px);opacity:0}to{transform:none;opacity:1}}'
    + '#po-a2hs img{width:42px;height:42px;border-radius:10px;background:#08120d;padding:5px;flex:none;object-fit:contain}'
    + '#po-a2hs .t{flex:1;font-size:.84rem;line-height:1.35}'
    + '#po-a2hs .t b{display:block;font-size:.92rem;margin-bottom:1px}'
    + '#po-a2hs .t small{color:#9fb0a6}'
    + '#po-a2hs button{font-family:inherit;cursor:pointer}'
    + '#po-a2hs .add{background:#c8a24a;color:#0c1a14;border:0;border-radius:100px;padding:9px 16px;font-weight:600;font-size:.85rem;white-space:nowrap}'
    + '#po-a2hs .x{background:none;border:0;color:#9fb0a6;font-size:1.4rem;line-height:1;padding:0 4px}';
  var st = document.createElement('style'); st.textContent = css; head.appendChild(st);

  function dismiss(b){ b.classList.remove('show'); try{ localStorage.setItem(KEY,'1'); }catch(e){} }
  function build(inner){
    var b = document.createElement('div'); b.id = 'po-a2hs';
    b.innerHTML = '<img src="https://www.primeoriginsatlas.org/logo.png" alt="Prime Origins">' + inner + '<button class="x" aria-label="Dismiss">&times;</button>';
    document.body.appendChild(b);
    b.querySelector('.x').addEventListener('click', function(){ dismiss(b); });
    setTimeout(function(){ b.classList.add('show'); }, 1600);
    return b;
  }

  if(isiOS && isSafari){
    build('<div class="t"><b>Add Prime Origins to your Home Screen</b><small>Tap the Share icon, then &ldquo;Add to Home Screen&rdquo;.</small></div>');
  } else {
    window.addEventListener('beforeinstallprompt', function(e){
      e.preventDefault(); deferred = e;
      var b = build('<div class="t"><b>Install Prime Origins</b><small>Add it to your home screen for quick access.</small></div><button class="add">Add</button>');
      b.querySelector('.add').addEventListener('click', function(){
        b.classList.remove('show');
        if(deferred){ deferred.prompt(); deferred.userChoice.then(function(){ try{ localStorage.setItem(KEY,'1'); }catch(e){} deferred = null; }); }
      });
    });
    window.addEventListener('appinstalled', function(){ try{ localStorage.setItem(KEY,'1'); }catch(e){} });
  }
})();
