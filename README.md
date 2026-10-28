# Hustle with Aditya – Landing Page (Frontend)

Static frontend (HTML + CSS + JS). No build step, no dependencies.

## Run in VS Code
1. File -> Open Folder -> select `hustle-with-aditya`
2. Install the **Live Server** extension (VS Code will suggest it)
3. Right-click `index.html` -> **Open with Live Server**
(Or just double-click `index.html` to open it in the browser.)

## Folder structure
```
hustle-with-aditya/
├── index.html                 page markup (sections are commented)
├── assets/
│   ├── images/                put Aditya's photo, logos here
│   └── icons/
├── css/
│   ├── main.css               imports everything (only file linked in HTML)
│   ├── base/
│   │   ├── variables.css      colors / theme tokens
│   │   └── base.css           reset, body, typography
│   ├── components/
│   │   └── components.css     buttons, cards, reveal animation
│   ├── layout/
│   │   ├── navbar.css         ticker + navbar + sticky buy bar
│   │   ├── footer.css
│   │   └── responsive.css     mobile / tablet rules
│   └── sections/
│       ├── hero.css           page 1  (Rs.99 + details)
│       ├── why.css            page 2  (why join)
│       ├── curriculum.css
│       ├── bonus.css
│       ├── instructor.css     meet Aditya
│       ├── feedback.css       feedback form
│       ├── reviews.css        page 3  (testimonials)
│       ├── payment.css        payment box + final CTA
│       └── faq.css
└── js/
    ├── config.js              payment link, feedback API, offer end time
    └── modules/
        ├── navbar.js          mobile menu, active link
        ├── countdown.js       offer timer
        ├── counters.js        animated numbers
        ├── reveal.js          scroll animation + progress bar
        ├── feedback.js        feedback form
        └── payment.js         pay button
```

## Backend connection (live)
This frontend is connected to the server in `../server` (and managed from `../super-admin`).
Edit only `js/config.js`:
- `API_BASE_URL` – e.g. `http://localhost:4000/api` locally, your real API URL in production.
  The site's origin (e.g. `http://localhost:5500`) must be listed in the server's `CORS_ALLOWED_ORIGINS`.
- The price, the comparison (struck-through) price and the offer on/off switch all come from the server (Super Admin → Settings → Membership price).
- `OFFER_END` – real offer end time, or "" to reset at midnight.

What is live:
- Price + offer badge: `GET /public/config` (if unreachable, a visible "price unconfirmed" note appears).
- Hero video: `GET /public/hero-video` (Bunny.net, set in Super Admin, loads on play).
- Video testimonials: `GET /public/testimonials`. None published = the Testimonials block stays hidden. No fake reviews are in the HTML.
- Form → `POST /public/leads` → Razorpay Checkout (`create-order`) → `verify`. Success is shown only after the server confirms.
- Payment status/webhooks are handled by the server; the browser never decides "paid".

Files: `js/modules/api.js` (fetch helper), `price.js`, `video.js`, `testimonials.js`, `payment.js`, `js/details.js` (form validation).
The old `feedback.js` was removed (no backend endpoint for it).

## Things to replace before going live
- Aditya's photo (`.photo` in `index.html`, put image in `assets/images/`)
- "Happy Students" and "Average Rating" stat cards in the hero (hardcoded numbers: use real data or remove)
- Course modules / bonuses text to match the real course
