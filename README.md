# stephanieslen.com

Stephanie Slen's Bulletin Board: a self-hosted copy of the site that used to run on Weebly.
It's plain HTML, CSS and JavaScript, with no builder, database or monthly fee.

## What's here

| Path | What it is |
| --- | --- |
| `index.html` | Home page (Awards & Philanthropy) |
| `work-portfolio.html` | Work Portfolio |
| `*-*.html` | Sub-pages (SFU dinner, press, endorsements) |
| `css/style.css` | All styling (colours, fonts, layout, mobile) |
| `js/site.js` | Mobile menu, photo slideshows, click-to-enlarge |
| `images/` | Every photo from the original site |
| `documents/` | Reference letters (PDF) |

## Editing

Open any `.html` file in a text editor and change the text between the tags.
To add a photo, put it in `images/` and use `<img src="images/your-photo.jpg" alt="">`.

## Previewing locally

```
python3 -m http.server
```
Then open http://localhost:8000.

## Putting it online (free)

- **GitHub Pages:** go to repo Settings → Pages → deploy from the `main` branch.
- **Netlify / Cloudflare Pages:** connect this repo. There's no build step, and the publish folder is the repo root.

To keep the stephanieslen.com domain, point its DNS at the new host
and cancel the Weebly plan only after the new site is live.
