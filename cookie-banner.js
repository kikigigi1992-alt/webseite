function loadMetaPixel() {
  if (typeof fbq !== 'undefined') return;
  !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
  fbq('init', '1754529742262391');
  fbq('track', 'PageView');
}

function showCookieBanner() {
  if (document.getElementById('cookie-banner')) return;

  var style = document.getElementById('cookie-banner-style');
  if (!style) {
    style = document.createElement('style');
    style.id = 'cookie-banner-style';
    style.textContent = `
      #cookie-banner {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        z-index: 9999;
        background: #0d1b2a;
        border-top: 1px solid rgba(109,148,136,0.3);
        padding: 20px 24px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 24px;
        flex-wrap: wrap;
        box-shadow: 0 -4px 24px rgba(0,0,0,0.3);
        animation: slideUp 0.3s ease;
      }
      @keyframes slideUp {
        from { transform: translateY(100%); }
        to   { transform: translateY(0); }
      }
      #cookie-banner .cookie-text {
        flex: 1;
        min-width: 220px;
      }
      #cookie-banner .cookie-text strong {
        display: block;
        color: #fff;
        font-size: 0.9rem;
        margin-bottom: 4px;
        font-family: Inter, sans-serif;
      }
      #cookie-banner .cookie-text p {
        color: rgba(255,255,255,0.55);
        font-size: 0.78rem;
        line-height: 1.5;
        margin: 0;
        font-family: Inter, sans-serif;
      }
      #cookie-banner .cookie-text a {
        color: #8faea3;
        text-decoration: underline;
      }
      #cookie-banner .cookie-buttons {
        display: flex;
        gap: 10px;
        flex-shrink: 0;
        flex-wrap: wrap;
      }
      #cookie-banner .btn-accept {
        background: #6d9488;
        color: #fff;
        border: none;
        border-radius: 40px;
        padding: 10px 20px;
        font-size: 0.8rem;
        font-weight: 700;
        font-family: Inter, sans-serif;
        cursor: pointer;
        letter-spacing: 0.04em;
        transition: background 0.2s;
      }
      #cookie-banner .btn-accept:hover { background: #8faea3; }
      #cookie-banner .btn-decline {
        background: transparent;
        color: rgba(255,255,255,0.55);
        border: 1px solid rgba(255,255,255,0.2);
        border-radius: 40px;
        padding: 10px 20px;
        font-size: 0.8rem;
        font-weight: 600;
        font-family: Inter, sans-serif;
        cursor: pointer;
        transition: all 0.2s;
      }
      #cookie-banner .btn-decline:hover {
        color: #fff;
        border-color: rgba(255,255,255,0.5);
      }
      @media (max-width: 600px) {
        #cookie-banner { flex-direction: column; align-items: flex-start; padding: 16px; }
        #cookie-banner .cookie-buttons { width: 100%; }
        #cookie-banner .btn-accept,
        #cookie-banner .btn-decline { flex: 1; text-align: center; }
      }
    `;
    document.head.appendChild(style);
  }

  var banner = document.createElement('div');
  banner.id = 'cookie-banner';
  banner.innerHTML = `
    <div class="cookie-text">
      <strong>Cookies & Datenschutz</strong>
      <p>Wir nutzen Cookies für Analyse (Meta Pixel), Newsletter und Kontaktformular. Mehr dazu in unserer <a href="https://tradingmeetsnervensystem.de/datenschutz.html">Datenschutzerklärung</a>.</p>
    </div>
    <div class="cookie-buttons">
      <button class="btn-decline" id="cookie-decline">Nur notwendige</button>
      <button class="btn-accept" id="cookie-accept">Alle akzeptieren</button>
    </div>
  `;
  document.body.appendChild(banner);

  function dismiss(value) {
    localStorage.setItem('cookie-consent', value);
    if (value === 'accepted') loadMetaPixel();
    banner.style.transition = 'transform 0.3s ease';
    banner.style.transform = 'translateY(100%)';
    setTimeout(function () { banner.remove(); }, 300);
  }

  document.getElementById('cookie-accept').addEventListener('click', function () { dismiss('accepted'); });
  document.getElementById('cookie-decline').addEventListener('click', function () { dismiss('declined'); });
}

(function () {
  var consent = localStorage.getItem('cookie-consent');
  if (!consent) {
    showCookieBanner();
  } else if (consent === 'accepted') {
    loadMetaPixel();
  }
})();
