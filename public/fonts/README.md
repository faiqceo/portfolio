# Fonts

The site is set in **Satoshi** by the [Indian Type Foundry](https://www.fontshare.com/fonts/satoshi),
free for personal and commercial use via Fontshare. Nothing needs to be
installed or committed here — `index.html` and `email.html` each load it from the
Fontshare CDN:

```html
<link href="https://api.fontshare.com/v2/css?f%5B%5D=satoshi@1,2&display=swap" rel="stylesheet">
```

`satoshi@1,2` is the **variable** cut: `1` is upright, `2` is italic, and each is
a single WOFF2 spanning weight `300 900` continuously. That matters here because
the static cut ships only 300/400/500/700/900, while `style.css` asks for 600 and
800 as well — on the static files those would fall back to a neighbouring weight,
whereas the variable font renders them exactly. `index.css` (the React contact
island) pulls the same URL through an `@import`.

The family is referenced once, via the `--font` custom property at the top of
`style.css`. Change it there and the whole page follows.

## Self-hosting

Fontshare's CDN is the intended delivery route, and the ITF licence does not
grant blanket permission to re-serve the webfont files yourself — check the
current EULA on fontshare.com before downloading the offline kit and hosting the
`.woff2` files from this folder. If you do go that way, add matching `@font-face`
rules to `style.css` with `font-weight: 300 900` (keep the range, so the variable
axis stays available) and drop the two CDN `<link>`s.
