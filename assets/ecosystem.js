/* Prime Origins Global — shared ecosystem component.
   One config object powers the header switcher and the footer column.
   To change a name, role or destination, edit ECO below.  */
(function(){
  'use strict';
  if(window.__poEco) return;
  window.__poEco = true;

  var ECO = [
    {name:'Prime Origins Global', role:'Group &amp; strategy', url:'https://primeoriginsglobal.org/', current:true},
    {name:'Prime Origins', role:'Operations, commerce &amp; provenance', url:'https://primeorigins.org/'},
    {name:'Prime Origins Atlas', role:'Carbon &amp; environmental markets', url:'https://primeoriginsatlas.org/'},
    {name:'TerraFi', role:'Asset finance &amp; digital securities', url:'https://terrafi.me/'},
    {name:'Greenback', role:'Digital-dollar settlement', url:'https://gnbk.app/'}
  ];
  var FOOT_BLURB = 'Prime Origins Global connects the group’s operating strategy, international development and specialist platforms across operations, provenance, environmental markets, asset finance and settlement.';
  var NOTE = 'The names shown describe a public brand architecture, not a corporate structure. Each platform operates under its own terms, and availability of services varies by platform and jurisdiction.';

  // stylesheet (idempotent)
  if(!document.head.querySelector('link[href$="ecosystem.css"]')){
    var l = document.createElement('link');
    l.rel = 'stylesheet';
    l.href = '/assets/ecosystem.css';
    document.head.appendChild(l);
  }

  // Use the self-hosted logo everywhere (pages still pointing at the Atlas-hosted copy)
  var imgs = document.querySelectorAll('img[src*="primeoriginsatlas.org/logo.png"]');
  for(var k = 0; k < imgs.length; k++){ imgs[k].setAttribute('src', '/assets/img/logo.svg'); }

  var EXT = ' target="_blank" rel="noopener noreferrer"';

  /* ---------- Header switcher ---------- */
  function buildSwitcher(){
    var links = document.getElementById('navLinks');
    if(!links || links.querySelector('.eco-switch')) return;

    var items = ECO.map(function(e){
      var a = '<a href="' + e.url + '"' + (e.current ? ' aria-current="page"' : EXT) + '>';
      a += '<span class="eco-name">' + e.name;
      if(e.current) a += '<span class="eco-cur">You are here</span>';
      else a += '<span aria-hidden="true"> ↗</span><span class="sr-only"> (opens in a new tab)</span>';
      a += '</span><span class="eco-role">' + e.role + '</span></a>';
      return '<li>' + a + '</li>';
    }).join('');

    var wrap = document.createElement('div');
    wrap.className = 'eco-switch';
    wrap.innerHTML =
      '<button type="button" class="eco-btn" id="ecoBtn" aria-expanded="false" aria-controls="ecoMenu">Ecosystem sites' +
      '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg></button>' +
      '<nav class="eco-menu" id="ecoMenu" aria-label="Prime Origins ecosystem" hidden>' +
      '<p class="eco-h">Prime Origins ecosystem</p><ul>' + items + '</ul></nav>';

    var cta = links.querySelector('.nav-cta');
    links.insertBefore(wrap, cta || null);

    var btn = wrap.querySelector('.eco-btn');
    var menu = wrap.querySelector('.eco-menu');
    function set(open){
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      if(open) menu.removeAttribute('hidden'); else menu.setAttribute('hidden', '');
    }
    btn.addEventListener('click', function(){ set(menu.hasAttribute('hidden')); });
    wrap.addEventListener('keydown', function(e){
      if(e.key === 'Escape' && !menu.hasAttribute('hidden')){
        set(false);
        btn.focus();
        e.stopPropagation();
      }
    });
    document.addEventListener('click', function(e){ if(!wrap.contains(e.target)) set(false); });
    wrap.addEventListener('focusout', function(e){
      if(e.relatedTarget && !wrap.contains(e.relatedTarget)) set(false);
    });
  }

  /* ---------- Footer ---------- */
  function footerColumn(){
    var h = '<h5>Prime Origins ecosystem</h5>';
    ECO.forEach(function(e){
      if(e.current){
        h += '<a href="' + e.url + '" aria-current="page">' + e.name + ' (this site)<span class="frole">' + e.role + '</span></a>';
      } else {
        h += '<a href="' + e.url + '"' + EXT + '>' + e.name + ' ↗<span class="frole">' + e.role + '</span></a>';
      }
    });
    h += '<a class="fsocial" href="https://www.linkedin.com/company/primeorigins"' + EXT + '>LinkedIn ↗</a>';
    return h;
  }
  function buildFooter(){
    var cols = document.querySelectorAll('footer .fcol');
    for(var i = 0; i < cols.length; i++){
      var h5 = cols[i].querySelector('h5');
      if(h5 && /ecosystem/i.test(h5.textContent)){ cols[i].innerHTML = footerColumn(); }
    }
    var blurb = document.querySelector('footer .fblurb');
    if(blurb) blurb.textContent = FOOT_BLURB;
    var base = document.querySelector('footer .foot-base p');
    if(base && !base.querySelector('[data-eco-note]')){
      var s = document.createElement('span');
      s.setAttribute('data-eco-note', '');
      s.textContent = NOTE + ' ';
      var designed = base.querySelector('span');
      base.insertBefore(s, designed || null);
    }
  }

  buildSwitcher();
  buildFooter();
})();
