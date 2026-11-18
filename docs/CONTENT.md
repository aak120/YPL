# Adding content without the admin dashboard

Use this workflow if you prefer to keep content in the repository, or before Supabase is connected.

## Publish a paper or brief
1. Put the PDF in `public/files/publications/`, e.g. `public/files/publications/urban-heat-2027.pdf`.
2. Open `content/publications.json`. It is a list: `[ {...}, {...} ]`.
3. Copy the object from `content/examples/publication.example.json` into the list (omit `_comment`) and fill it in:
   - `slug`: lowercase-with-hyphens, unique. It becomes the URL.
   - `type`: one of the listed values. Use `gurgaon-brief` and set `issue_number` for the Mini Gurgaon series. Put the brief's topic first in `tags`.
   - `category`: one of the six focus-area slugs.
   - `pdf_url`: `/files/publications/<file>.pdf`
   - `status`: `published` to show it, `draft` to hide it.
   - `featured: true` puts it on the homepage. If nothing is featured, the newest publications are shown.
4. Commit and redeploy. The library, homepage, search, sitemap and AI assistant all pick it up automatically.

## Add a team member or advisor
Copy `content/examples/team.example.json` into `content/team.json`. Put photos in `public/images/team/`. Only publish profiles with the person's consent.

## Add an initiative or event
Copy `content/examples/initiative.example.json` into `content/initiatives.json`. Change `status` to `completed` and add `outcomes` after the event. Record only real outcomes.

Validate the JSON before deploying, for example by pasting it into https://jsonlint.com. A trailing comma will break the build.
