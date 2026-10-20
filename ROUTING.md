# Portfolio access policy

Deploy this directory to Vercel as a static site (Framework Preset: Other). No build command is needed. The rules in `vercel.json` apply after deployment; a generic local static server does not enforce them.

- `/` and `/index.html` serve the portfolio. Section anchors continue to work.
- `/404.html` serves the matching error page with HTTP status 404.
- Other page and directory paths, including `/img`, `/assets`, and `/admin`, redirect to `/404.html`.
- Browser navigation to CSS, JavaScript, and images redirects to `/404.html`. Embedded resources remain available. Fetch Metadata headers distinguish these requests, and these responses are not cached so an embedded response cannot bypass the navigation rule through browser cache.
- The existing View CV link is allowed for same-origin requests. Pasting the PDF URL into a new address bar redirects to `/404.html`.
- No general filesystem fallback exposes documentation or configuration files. Missing allowed resources fall through to the error redirect.

This is route filtering, **not RBAC or private asset storage**. There are no accounts or roles in this static portfolio. Fetch Metadata headers may be absent in older clients or forged by non-browser clients; visitors can save displayed images. Actual role-based access would require server-validated sign-in and authorization, with protected files outside public static hosting.

After deploying, check `/`, `/index.html`, `/img`, `/assets/img/main.jpg` (typed directly), `/anything/nested`, and `/404.html`. Confirm portfolio images load and View CV opens from the portfolio. Check redirects with `curl -I` and browser behavior with a normal HTTPS browser; this policy relies on browser Fetch Metadata headers.

Vercel route configuration reference: https://vercel.com/docs/build-output-api/configuration#routes
