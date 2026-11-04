# Bright Roots Daycare & Kindergarten — Website Editing & Hosting Guide

Welcome! This folder contains the complete static website (HTML, CSS, JavaScript, images and video).

## 1. Open the website in VS Code

1. Extract the ZIP file.
2. Open VS Code.
3. Choose **File → Open Folder**.
4. Select the `bright-roots` folder (the folder containing `index.html`).
5. Install the **Live Server** extension if you want to preview changes locally.
6. Right-click `index.html` and choose **Open with Live Server**.

## 2. Where to edit things

- `index.html` — homepage content and homepage SEO settings.
- `about.html` — About Us page.
- `programs.html` — daily activities / Our Day page.
- `welfare.html` — welfare and care page.
- `daycare-nightcare.html` — day and nightcare information.
- `admissions.html` — admissions information and enquiry form.
- `gallery.html` — photo gallery.
- `contact.html` — contact details.
- `style.css` — colours, fonts, spacing, layout, animations and responsive design.
- `script.js` — mobile menu, hero slider, scroll effects and interactive features.
- `assets/img/` — website photos and logo.
- `assets/video/` — video assets.

HTML files include comments above the main sections. CSS and JavaScript have section comments. Search in VS Code with **Ctrl + F** for a section name, class name or visible text.

## 3. IMPORTANT: Set the real domain before publishing

The SEO files currently use the placeholder `https://YOUR-DOMAIN.com` because the final domain has not been provided yet.

After buying the domain, replace every occurrence of `https://YOUR-DOMAIN.com` with the exact live domain, including `https://` and without a trailing slash in the domain itself.

Update it in:
- All HTML files: canonical URL, `og:url`, `og:image`, and Twitter image URL.
- `sitemap.xml`.
- `robots.txt`.
- Homepage JSON-LD structured data.

Example only: if the real domain is `brightroots.ug`, use `https://brightroots.ug`.

Do not publish the placeholder domain. Incorrect canonical URLs and sitemap URLs can confuse search engines.

## 4. SEO already added

- Unique page titles and meta descriptions.
- Robots directives for normal public pages.
- Canonical URL tags.
- Open Graph and Twitter sharing metadata.
- Homepage ChildCare structured data using the contact details shown on the website.
- `sitemap.xml` listing the public pages.
- `robots.txt` pointing to the sitemap.
- Image descriptions (alt text) retained from the original website.

The old `meta keywords` tag is intentionally not used: Google does not use it for ranking. Put important search phrases naturally in page titles, headings, useful page copy and links instead.

## 5. Security and hosting files

- `_headers` contains security headers for Netlify.
- `vercel.json` contains equivalent security headers for Vercel.
- `404.html` is the custom not-found page.

Use the correct hosting configuration for the platform you choose. Do not upload `vercel.json` expecting Netlify to apply it; Netlify uses `_headers`. Vercel uses `vercel.json`.

The site should be served over HTTPS. Netlify and Vercel can provision SSL certificates for correctly connected custom domains. Security headers are not a substitute for safe form handling or backend security.

## 6. Before going live — checklist

- [ ] Replace `YOUR-DOMAIN.com` everywhere with the final domain.
- [ ] Confirm the phone numbers, email and location are correct.
- [ ] Check every navigation link and WhatsApp/contact action.
- [ ] Test the site on a phone, tablet and desktop.
- [ ] Check that all photos and the video load.
- [ ] Confirm the admissions/contact form sends its message successfully. A front-end form alone does not guarantee message delivery.
- [ ] Connect the custom domain and confirm HTTPS works.
- [ ] Open `https://YOUR-DOMAIN.com/robots.txt` and `https://YOUR-DOMAIN.com/sitemap.xml` after replacing the placeholder.
- [ ] Add the domain property in Google Search Console and verify ownership.
- [ ] Submit the sitemap in Search Console.
- [ ] Test important URLs with Google's URL Inspection tool.

## 7. SEO expectations

These changes make the website easier for search engines to understand and crawl. They do not guarantee first place or instant indexing. Google ranking depends on competition, useful and original content, location relevance, links/reputation, technical quality and ongoing updates.

For local visibility, create and verify a Google Business Profile if the organisation is eligible, keep its name/address/phone consistent with the website, and ask genuine families for honest reviews. Never buy reviews or add unverified claims.

## 8. Editing SEO for a page

At the top of each HTML file, find the commented **SEO & SOCIAL SHARING SETTINGS** block.

- `<title>` is the blue clickable heading Google may show.
- `meta name="description"` is a suggested summary Google may show.
- `canonical` identifies the preferred page URL.
- `og:title`, `og:description`, and `og:image` control many social previews.
- The `robots` meta tag tells crawlers that the public page may be indexed.

Write a unique, accurate title and description for each page. Do not stuff keywords or copy the same description onto every page.
