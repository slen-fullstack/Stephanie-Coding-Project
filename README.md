# stephanieslen.com (Hugo)

Static rebuild of stephanieslen.com using [Hugo](https://gohugo.io/). There's no third-party theme; every template lives in `layouts/`.

## Run locally

```sh
hugo server        # preview at http://localhost:1313
hugo --minify      # build the site into ./public
```

## Where things live

| What | Where |
| --- | --- |
| Site title, email, menu | `hugo.toml` |
| **Homepage (all text, numbers, photos)** | **`data/home.yaml`** |
| About / Contact pages | `content/about.md`, `content/contact.md` |
| Portfolio projects | `content/portfolio/*.md` (one file per project) |
| Images | `static/images/` (reference as `/images/name.jpg`) |
| Styles | `assets/css/home.css` (homepage), `assets/css/main.css` (other pages) |
| Homepage animations | `assets/js/home.js` |
| Templates | `layouts/` |

Add a new project with `hugo new content portfolio/my-project.md`, then set `draft = false` when it's ready to publish.

## Editing the homepage

**Easiest:** use the visual editor at https://app.pagescms.org (sign in with GitHub, pick this repo, open **Homepage**). It's set up by `.pages.yml`.

Or edit the file directly: 
Open `data/home.yaml` (on GitHub: click the file, then the pencil icon). Change any text between the quotes, then commit. The site rebuilds and goes live on its own in about a minute.

## Publishing (GitHub Pages)

One-time setup: **Settings → Pages → Build and deployment → Source: GitHub Actions**. After that, every push runs `.github/workflows/pages.yml` and publishes the site.
