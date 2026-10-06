# Sravani Kaviti: Portfolio

Personal portfolio site: computer vision & applied AI engineer. Plain HTML, CSS and JavaScript, with no build step and no dependencies.

**Features:** simulated perception-feed hero (canvas), light/dark theme, interactive "model to edge" workflow, experience tabs, filterable project cards with detail dialogs, searchable skills, scroll progress and reveal animations, keyboard accessible, reduced-motion friendly.

## Edit your content
Everything lives in [`js/data.js`](js/data.js): profile, stats, experience, projects, skills, education.
- Add a photo as `assets/photo.jpg` (initials show until then).
- Add project repo links via the `repo` field of a project.
- Replace the CV at `assets/Sravani_Kaviti_CV.pdf`.

## Run locally
Open `index.html`, or serve it: `python -m http.server 8000`

## Deploy on GitHub Pages
Push to `main`, then Settings → Pages → Deploy from branch → `main` / root.
Name the repo `sravanikaviti13.github.io` for the URL `https://sravanikaviti13.github.io`.
