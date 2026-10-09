# Warren-Stone Weddings & Events — website concept

A proposed new website for [Warren-Stone Weddings & Events](https://warrenstoneweddings.com/), luxury wedding planners in Cape Town.

**Live demo:** https://rolandvtonder.github.io/Warren-Stone-Weddings-website-demo/

Six pages — Home, Services, Process, Weddings, About and Enquire — built around a scroll-driven story: petals and gold leaf bursting from behind a wedding arch, a countdown to the day, and each chapter opening through an arch of its own. Photography, copy and testimonials are Warren-Stone's own, from their current site.

## Run it locally

```bash
npm install
npm run dev
```

Then open http://localhost:3009.

## Stack

Vite + React + TypeScript, Tailwind CSS v4 and Lenis smooth scrolling. Every scroll animation is plain arithmetic in one animation-frame loop — no animation library.

## Notes

- The enquiry form opens the visitor's email app with the enquiry written out; it needs a form service before going live.
- Pushing to `main` rebuilds the site with GitHub Actions and publishes it to the `gh-pages` branch, which GitHub Pages serves.
