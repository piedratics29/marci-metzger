# Marci Metzger — Homepage Revamp (Plain HTML/CSS/JS)

Same design as the React version, built with zero frameworks:
one HTML file, one CSS file, one JS file. No build step, no npm.

## Run it
- Easiest: open this folder in VS Code, install the "Live Server"
  extension, right-click index.html -> "Open with Live Server".
- Or upload the folder contents to any free static host
  (Netlify Drop, Vercel, GitHub Pages, Cloudflare Pages).

## How each animation works (vanilla)
- Hero masked headline: CSS keyframes, parent span has overflow:hidden,
  child slides up with animation-delay (styles.css -> .mask-line).
- Hero parallax: script.js maps window.scrollY to translateY + scale.
- Scroll reveals: IntersectionObserver adds .visible; CSS transition animates.
- Number counters: requestAnimationFrame loop with an easeOut curve.
- Marquee: pure CSS @keyframes translateX(-50%) on a duplicated track.
- Lightbox + filters + mobile menu: classList toggles.

## Contact form
Demo mode by default. To receive real emails: create a free form at
https://formspree.io and paste your endpoint into FORM_ENDPOINT in script.js.

All photos load from the original website's CDN (img1.wsimg.com) per the brief.
