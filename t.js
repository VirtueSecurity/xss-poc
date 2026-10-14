/*! Virtue Security: benign XSS proof-of-concept (document title variant)
 *  Source: https://github.com/VirtueSecurity/xss-poc
 *
 *  Rewrites document.title only. Use where DOM injection is stripped, dialogs
 *  are suppressed, or evidence has to survive a headless/automated capture.
 *  The title shows up in the browser tab, window chrome, and page screenshots.
 *
 *  Reads no cookies or storage, makes no network requests, stores nothing.
 */
(function () {
  'use strict';
  var TAG = '⚠ XSS PoC (Virtue Security)';
  if (document.title.indexOf(TAG) === 0) { return; }

  var original = document.title;
  try { document.title = TAG + (original ? ' | ' + original : ''); } catch (e) {}

  console.log('[Virtue Security] XSS PoC: document.title rewritten on ' +
              location.origin + ' (was: ' + original + ')');
})();
