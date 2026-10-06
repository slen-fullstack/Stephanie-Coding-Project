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
| Homepage text | `content/_index.md` |
| About / Contact pages | `content/about.md`, `content/contact.md` |
| Portfolio projects | `content/portfolio/*.md` (one file per project) |
| Images | `static/images/` (reference as `/images/name.jpg`) |
| Styles | `assets/css/main.css` |
| Templates | `layouts/` |

Add a new project with `hugo new content portfolio/my-project.md`, then set `draft = false` when it's ready to publish.
