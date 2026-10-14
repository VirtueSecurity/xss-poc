/*! Virtue Security: benign XSS proof-of-concept (bare marker variant)
 *  Source: https://github.com/VirtueSecurity/xss-poc
 *
 *  Appends one unstyled <div id="virtue-xss-poc"> to the document. Use where a
 *  strict CSP blocks inline <style>, where Shadow DOM is unavailable, or where
 *  an automated check needs a stable selector to assert against.
 *
 *  Reads no cookies or storage, makes no network requests, stores nothing.
 */
(function () {
  'use strict';
  var ID = 'virtue-xss-poc';

  function mark() {
    if (!document.body || document.getElementById(ID)) { return; }
    var el = document.createElement('div');
    el.id = ID;
    el.setAttribute('data-virtue-poc', 'benign-xss-proof-of-concept');
    el.textContent = 'Virtue Security: XSS proof of concept | ' +
                     new Date().toISOString() +
                     ' | github.com/VirtueSecurity/xss-poc';
    document.body.appendChild(el);
  }

  console.log('[Virtue Security] XSS PoC: marker element appended on ' + location.origin);

  if (document.body) { mark(); }
  else { document.addEventListener('DOMContentLoaded', mark, { once: true }); }
})();
