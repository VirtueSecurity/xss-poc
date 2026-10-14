# Security and abuse

## If you found a payload from this repository on your site

A script hosted here was loaded into one of your pages. That means a
cross-site scripting vulnerability was reachable at that location.

The payloads themselves are benign by design: they make no network requests,
read no cookies or storage, and persist nothing. The full source of every file
is in this repository and is short enough to read end to end.

**The injection point is still a real finding.** Nothing prevented a different,
hostile script from loading in the same position.

If you have an active engagement with Virtue Security, contact your test lead.
Otherwise, write to <info@virtuesecurity.com> and include the affected URL.

## Reporting a problem with these payloads

If you believe any file here can be used to cause harm (exfiltrate data,
persist, escalate, or anything beyond proving that script execution occurred),
open an issue or email <info@virtuesecurity.com>. That is a bug in this
repository and will be fixed.

## Scope

These files are a convenience for testers who already hold written
authorization. Publishing them grants no permission to test any system.
