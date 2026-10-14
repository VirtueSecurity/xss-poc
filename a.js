/*! Virtue Security: benign XSS proof-of-concept (alert variant)
 *  Source: https://github.com/VirtueSecurity/xss-poc
 *
 *  Raises a single alert() dialog naming the origin that executed it. Use when
 *  a modal dialog is the clearest evidence, or when the page's CSS/layout makes
 *  an injected banner hard to capture.
 *
 *  Reads no cookies or storage, makes no network requests, stores nothing.
 */
(function () {
  'use strict';
  if (window.__virtueXssPocAlert) { return; }
  try { window.__virtueXssPocAlert = true; } catch (e) {}

  var msg = 'Virtue Security: XSS proof of concept\n\n' +
            'Script execution confirmed on:\n' + (location.origin || location.host) +
            '\n\nThis is a benign test payload from an authorized penetration test.\n' +
            'github.com/VirtueSecurity/xss-poc';

  console.log('[Virtue Security] XSS PoC: execution confirmed on ' + location.origin);

  // alert() is blocked in sandboxed frames and cross-origin-isolated contexts;
  // fall back to the console line above, which has already been written.
  try { alert(msg); } catch (e) {}
})();
