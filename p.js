/*! Virtue Security: benign XSS proof-of-concept (banner variant)
 *  Source: https://github.com/VirtueSecurity/xss-poc
 *
 *  What this does: draws a labeled banner on the page and writes one line to
 *  the console, proving that script execution was possible at this injection
 *  point.
 *
 *  What this does NOT do, by design:
 *    - no network requests of any kind (no fetch/XHR/beacon/WebSocket/img ping)
 *    - no reads of cookies, localStorage, sessionStorage, or IndexedDB
 *    - no reads of form fields, keystrokes, or the clipboard
 *    - no eval(), Function(), or dynamically loaded code
 *    - no writes to storage, no service worker, no persistence of any kind
 *
 *  Nothing observed by this script ever leaves the browser tab it runs in.
 */
(function () {
  'use strict';

  var MARK = '__virtueXssPoc';
  if (window[MARK]) { return; }          // idempotent: one banner per page
  try { window[MARK] = true; } catch (e) { /* frozen window; continue anyway */ }

  var ORIGIN = String(location.origin || (location.protocol + '//' + location.host));
  var PATH = String(location.pathname || '/');   // query/hash omitted on purpose:
                                                 // they often carry tokens and
                                                 // this text ends up in screenshots
  var WHEN = new Date().toISOString().replace('T', ' ').replace(/\..+/, ' UTC');
  var FRAMED = (function () {
    try { return window.top !== window.self; } catch (e) { return true; }
  })();

  console.log(
    '%c Virtue Security %c XSS proof of concept: script execution confirmed ',
    'background:#FB664A;color:#fff;font-weight:600;padding:2px 4px',
    'background:#0F1E2E;color:#EAEAEA;padding:2px 4px',
    '\n  origin: ' + ORIGIN +
    '\n  path:   ' + PATH +
    '\n  time:   ' + WHEN +
    '\n  source: https://github.com/VirtueSecurity/xss-poc (benign by design)'
  );

  function draw() {
    if (!document.body) { return; }

    var host = document.createElement('div');
    host.id = 'virtue-xss-poc';
    host.setAttribute('data-virtue-poc', 'benign-xss-proof-of-concept');

    // Shadow DOM isolates the banner from the host page's CSS so it renders
    // the same way in any application. Falls back to the plain element.
    var root = host;
    try {
      if (host.attachShadow) { root = host.attachShadow({ mode: 'open' }); }
    } catch (e) { /* fall through to light DOM */ }

    var style = document.createElement('style');
    style.textContent = [
      ':host,*{box-sizing:border-box}',
      '.vs{position:fixed;z-index:2147483647;top:16px;left:50%;transform:translateX(-50%);',
      'width:min(560px,calc(100vw - 32px));background:#0F1E2E;color:#EAEAEA;',
      'border:1px solid rgba(193,216,230,.14);border-left:4px solid #FB664A;border-radius:10px;',
      'box-shadow:0 12px 40px rgba(5,15,24,.55);padding:16px 18px;',
      'font-family:"Neue Montreal","Neue Haas Grotesk Display","Helvetica Neue",Inter,',
      'system-ui,-apple-system,"Segoe UI",Arial,sans-serif;font-size:14px;line-height:1.5;',
      'text-align:left;direction:ltr}',
      '.eyebrow{font-size:10.5px;letter-spacing:.16em;text-transform:uppercase;color:#C1D8E6;',
      'margin:0 0 6px;font-weight:500}',
      '.eyebrow b{color:#FB664A;font-weight:500}',
      '.title{margin:0 0 12px;font-size:17px;font-weight:500;letter-spacing:-.02em;color:#fff}',
      '.rows{margin:0 0 12px;display:grid;grid-template-columns:auto 1fr;gap:4px 14px;',
      'font-size:12.5px}',
      '.rows dt{color:#C1D8E6;letter-spacing:.04em}',
      '.rows dd{margin:0;color:#EAEAEA;word-break:break-all;',
      'font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace}',
      '.note{margin:0;padding-top:10px;border-top:1px solid rgba(193,216,230,.14);',
      'font-size:11.5px;color:#C1D8E6}',
      '.note a{color:#9CAA79}',
      '.x{position:absolute;top:10px;right:12px;background:none;border:0;cursor:pointer;',
      'color:#C1D8E6;font-size:18px;line-height:1;padding:4px;font-family:inherit}',
      '.x:hover{color:#FB664A}'
    ].join('');

    var box = document.createElement('div');
    box.className = 'vs';

    var eyebrow = document.createElement('p');
    eyebrow.className = 'eyebrow';
    var brand = document.createElement('b');
    brand.textContent = 'Virtue Security';
    eyebrow.appendChild(brand);
    eyebrow.appendChild(document.createTextNode(' · Authorized penetration test'));

    var title = document.createElement('h2');
    title.className = 'title';
    title.textContent = 'XSS proof of concept: script execution confirmed';

    var rows = document.createElement('dl');
    rows.className = 'rows';
    var fields = [
      ['Origin', ORIGIN],
      ['Path', PATH],
      ['Context', FRAMED ? 'framed document' : 'top-level document'],
      ['Executed', WHEN]
    ];
    for (var i = 0; i < fields.length; i++) {
      var dt = document.createElement('dt');
      dt.textContent = fields[i][0];
      var dd = document.createElement('dd');
      dd.textContent = fields[i][1];        // textContent, never innerHTML
      rows.appendChild(dt);
      rows.appendChild(dd);
    }

    var note = document.createElement('p');
    note.className = 'note';
    note.appendChild(document.createTextNode(
      'This script is benign: it reads no cookies or storage, sends nothing ' +
      'anywhere, and stores nothing. Source: '
    ));
    var link = document.createElement('a');
    link.href = 'https://github.com/VirtueSecurity/xss-poc';
    link.textContent = 'github.com/VirtueSecurity/xss-poc';
    link.rel = 'noopener noreferrer';
    link.target = '_blank';
    note.appendChild(link);

    var close = document.createElement('button');
    close.className = 'x';
    close.type = 'button';
    close.setAttribute('aria-label', 'Dismiss proof-of-concept banner');
    close.textContent = '×';
    close.onclick = function () {
      if (host.parentNode) { host.parentNode.removeChild(host); }
    };

    box.appendChild(close);
    box.appendChild(eyebrow);
    box.appendChild(title);
    box.appendChild(rows);
    box.appendChild(note);

    root.appendChild(style);
    root.appendChild(box);
    document.body.appendChild(host);
  }

  if (document.body) {
    draw();
  } else {
    document.addEventListener('DOMContentLoaded', draw, { once: true });
  }
})();
