/*! Virtue Security: benign XSS proof-of-concept (console-only variant)
 *  Source: https://github.com/VirtueSecurity/xss-poc
 *
 *  Writes one labeled line to the browser console and changes nothing on the
 *  page. Use on production systems, during business hours, or anywhere a
 *  visible artifact would disrupt real users or alarm staff.
 *
 *  Reads no cookies or storage, makes no network requests, stores nothing.
 */
(function () {
  'use strict';
  console.log(
    '%c Virtue Security %c XSS proof of concept: script execution confirmed ',
    'background:#FB664A;color:#fff;font-weight:600;padding:2px 4px',
    'background:#0F1E2E;color:#EAEAEA;padding:2px 4px',
    '\n  origin: ' + location.origin +
    '\n  path:   ' + location.pathname +
    '\n  time:   ' + new Date().toISOString() +
    '\n  source: https://github.com/VirtueSecurity/xss-poc (benign by design)'
  );
})();
