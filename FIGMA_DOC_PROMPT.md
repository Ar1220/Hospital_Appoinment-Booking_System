# Figma Prompt — Project Document for "Requiem Medical Center" (paste into Figma Make / Figma AI)

Copy everything between the lines into Figma.

---

**Task:** Design a short project document for a university submission — **A4 portrait, 1–2 pages**.
It is a *summary sheet*, not a report: bullet points only, no long paragraphs.

**Project facts (use exactly these, do not invent anything):**
- Name: **Requiem Medical Center — Hospital Appointment Booking System**
- What it is: a hospital appointment booking website with a real **MySQL** database behind it
- Tech: **React 19 + Vite + Tailwind** (front end) · **Node.js + Express** (API) · **MySQL 8** (Docker)
- GitHub: **https://github.com/Ar1220/Hospital_Appoinment-Booking_System**
- It's a small university mini project (the SQL half of the SQL / NoSQL pair). Say that plainly,
  don't oversell it. The dark horror-hospital styling is just for fun — the substance is the database.

**Sections, in this order:**
1. **Cover block** — title, one-line description, "University mini project", GitHub link in the accent colour.
2. **What it does** — 5–6 bullets max:
   - browse clinicians, services and facilities across a dark single-page site
   - a patient intake form: identity, contact, appointment type, doctor, date, time, emergency contact
   - the request is saved to MySQL and gets a permanent number like `APT-2026-11-00009`
   - doctors and appointment types load from the database, not hard-coded lists
   - every booking stores a status workflow (pending → confirmed → in progress → completed / cancelled)
   - a footer newsletter signup that writes to its own table
3. **Tech stack** — 3 short lines (React + Vite, Express, MySQL 8 in Docker).
4. **Database** — a small table: 7 tables + 1 view + 2 stored procedures:
   - `doctors`, `appointment_types`, `appointments`, `services`, `facilities`, `testimonials`,
     `newsletter_subscribers`
   - view `appointment_details` — joins appointments × doctors × types so the API returns names, not IDs
   - procedures `GenerateAppointmentNumber()` and `CreateAppointment()`
5. **How to run** — 4 steps (`docker compose up -d` → `cd backend`, `npm install`, `npm start`
   → root `npm install`, `npm run dev`), or double-click `services.cmd` and press **1**.
6. **Screenshots** — all 6, in this order, one-line caption each:
   - `01-hero.png` — Landing page ("Your health. Our obsession.")
   - `02-facilities.png` — Facility gallery
   - `03-services.png` — Clinical services
   - `04-appointment-form.png` — Patient intake form
   - `05-specialists.png` — Clinician directory
   - `06-location-contact.png` — Location & contact
   First image full width, rest in a 2-column grid. **Import them at full resolution — do not crop,
   stretch or downscale.** Keep captions tiny and grey.
7. **Demo video** — a section with an **auto-playing loop** of the flow
   (hero → form → confirm appointment → confirmation dialog with the `APT-` number).
8. **Footer** — project name · the GitHub URL.

**Style:**
- Match the app: near-black maroon `#140F0F`, cream text `#F0E9E6`, one accent **blood red `#DC143C`**,
  and surgical teal `#00D4AA` used only for tiny status dots / "available" marks.
- Bold grotesque headings, Inter/Segoe UI body ~11pt, generous margins, print-safe.
- Thin red rule under each section heading, rounded corners on images, no drop shadows.
- Max ~250 words of body text in the whole document. If it gets long, cut words, not screenshots.

**Auto-play video — important:**
- Use an **animated GIF** (`demo.gif`) for the auto-playing demo. It loops by itself everywhere:
  Figma preview, exported PDF, Word, GitHub — no click needed.
- Do **not** rely on an MP4 for autoplay: in Figma, MP4 autoplays only inside the prototype
  presentation (needs *Autoplay + Loop + Muted*); in an exported PDF it becomes a static frame,
  and GitHub README strips autoplay. If an MP4 is supplied anyway, embed it with
  `autoplay muted loop playsinline` and keep the GIF as the fallback underneath the video section.

**Deliver:**
- A4 page(s), 1440 px wide frame, export-ready for PDF
- All 6 screenshots placed and legible
- GitHub link clickable
- Nothing invented — no fake metrics, no made-up features

---

## Short answer to the video question (for you, not for Figma)

- Figma prototype: MP4 **can** autoplay — set *Autoplay · Loop · Mute* on the video fill/prototype.
- Exported PDF / PNG / Word: MP4 will **not** autoplay (it becomes a still). Use a **GIF**.
- GitHub README: MP4 with `<video autoplay muted loop>` is stripped; a GIF always plays.

So: **GIF = auto-run everywhere. MP4 = only inside Figma's own preview.**
