# xss-poc

Benign, self-identifying cross-site scripting proof-of-concept payloads, hosted
on GitHub Pages at **https://virtuesecurity.github.io/xss-poc/**.

Virtue Security consultants use these during authorized penetration tests to
prove that an injection point executes JavaScript. They are deliberately
limited to that one job: they draw a labeled notice, write a console line, and
stop.

---

## Found this URL in your logs?

Someone loaded a script from this repository into one of your pages. That means
a cross-site scripting vulnerability was reachable there: the page executed
JavaScript from an origin you do not control.

If you have an active engagement with Virtue Security, this is almost certainly
your tester. If you do not, treat the injection point as a real finding and fix
it. These files are harmless, but nothing stopped a different script from
loading in the same position.

Every file is short and readable in full in this repository. Questions:
<info@virtuesecurity.com>.

---

## The safety contract

Every payload here is written to the same rules. None of them will:

- Make a network request of any kind: no `fetch`, `XMLHttpRequest`,
  `sendBeacon`, WebSocket, or image ping.
- Read cookies, `localStorage`, `sessionStorage`, or IndexedDB.
- Read form fields, keystrokes, or the clipboard.
- Call `eval()`, `Function()`, or load further code.
- Write to storage, register a service worker, or persist across a reload.

Nothing a payload observes leaves the browser tab it runs in. The banner shows
`location.origin` and `location.pathname` on screen but omits the query string
and fragment, because those frequently carry session tokens and the banner ends
up in report screenshots.

The worst a stolen copy of these URLs can accomplish is drawing a banner that
names the firm that published it.

### What this repository is deliberately not

It is not a blind-XSS collector. Proving out-of-band execution requires a server
that records callbacks, which means a payload that transmits data, the exact
capability this repository exists to avoid. Use Burp Collaborator, an
engagement-scoped XSS Hunter instance, or another collector you control and
have authorization to point at the target.

---

## Payloads

| File | Effect | Reach for it when |
|---|---|---|
| [`p.js`](p.js) | Labeled banner (origin, path, frame context, time) plus a console line. **The default.** | Most findings, since it screenshots cleanly with no dialog to dismiss. |
| [`a.js`](a.js) | A single `alert()` naming the executing origin. | A modal is the clearest evidence, or the page layout swallows a banner. |
| [`t.js`](t.js) | Rewrites `document.title`. | DOM injection is stripped, dialogs are suppressed, or a headless capture has to show the result. |
| [`c.js`](c.js) | One console line; the page is untouched. | Production systems, business hours, anywhere a visible artifact would disturb real users. |
| [`m.js`](m.js) | Appends an unstyled `<div id="virtue-xss-poc">`. | A strict CSP blocks inline styles, or an automated check needs a stable selector. |
| [`x.svg`](x.svg) | Self-contained SVG: visible notice plus an embedded script. | File-upload and stored-XSS tests, including hosts that block external script sources. |
| [`f.html`](f.html) | Script-free page identifying itself as external content. | Framing, open-redirect, and `window.open` demonstrations. |

The banner in `p.js` renders inside a Shadow DOM, so the host page's CSS cannot
distort it, and it is idempotent: loading it twice produces one banner.

## Usage

```html
<script src="https://virtuesecurity.github.io/xss-poc/p.js"></script>
```

Protocol-relative, for length-constrained fields (61 characters):

```html
<script src=//virtuesecurity.github.io/xss-poc/p.js></script>
```

See [PAYLOADS.md](PAYLOADS.md) for attribute breakouts, event handlers,
`javascript:` URIs, SVG, and notes on what CSP will and will not stop.

## Rules of engagement

These files are a convenience for testers who already have written
authorization. They do not grant any. Load them only against systems in scope
for an engagement you are authorized to perform, and prefer `c.js` wherever a
visible artifact could reach a real user.

## Hosting your own copy

Fork the repository, enable GitHub Pages on `main` (root), and update the
`github.com/VirtueSecurity/xss-poc` strings in each file so the payloads point
at you. Self-identification is the point: anyone who finds the URL should be
able to read the source and see immediately that it is benign.

## License

MIT. See [LICENSE](LICENSE).
