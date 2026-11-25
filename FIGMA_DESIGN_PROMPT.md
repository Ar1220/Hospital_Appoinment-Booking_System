# Figma Design Prompt: Hospital Appointment Booking System
## "Resident Evil 9 Hospital Aesthetic" — Dark, Clinical, Sexy UI

---

## 🎯 PROJECT OVERVIEW

Create a **hospital appointment booking website** with a **dark, atmospheric, Resident Evil 9-inspired hospital aesthetic**. The design should feel **clinical yet mysterious**, **sterile yet unsettling**, with a **sexy, modern UI** that draws users into an immersive experience. Think "horror hospital meets premium healthcare."

---

## 🎨 VISUAL STYLE & ATMOSPHERE

### **Color Palette**
- **Primary Background:** Deep slate grey (`#1a1e24`) to charcoal black (`#0d0f12`)
- **Secondary Background:** Muted dark green tiles (`#2d3a34`) for section accents
- **Primary Accent:** Surgical teal (`#00d4aa`) — used for buttons, highlights, active states
- **Secondary Accent:** Cold clinical blue (`#4a9eff`) — for X-ray imagery, scan effects
- **Warning/Danger:** Blood red (`#dc143c`) — subtle use for urgent notifications, hover effects
- **Text:** Off-white (`#e8e8e8`) for headings, light grey (`#b0b5b9`) for body text
- **Glass/Overlay:** Semi-transparent dark layers (`rgba(13, 15, 18, 0.85)`)

### **Lighting & Effects**
- **Chiaroscuro contrast:** Deep shadows with harsh, focused light beams
- **Volumetric lighting:** Subtle light rays emanating from key UI elements
- **Glow effects:** Soft teal/blue glow on active buttons, form fields, and CTAs
- **Fog/mist overlay:** Very subtle atmospheric fog in hero section background
- **CRT scanline effect:** Subtle scanlines on medical imagery (X-rays, monitors)
- **Vignette:** Dark corners to focus attention on center content

### **Typography**
- **Headings:** Bold, industrial sans-serif (e.g., "Rajdhani", "Orbitron", or "Bebas Neue")
- **Body:** Clean, clinical sans-serif (e.g., "Inter", "Roboto", or "Montserrat")
- **Medical Data:** Monospace font for vitals, dates, times (e.g., "JetBrains Mono")
- **Hierarchy:** Large, dramatic headings; crisp, readable body text

### **Textures & Patterns**
- **Dark green tile pattern:** Subtle background texture (like hospital wall tiles)
- **Concrete/linoleum floor:** Dark, slightly worn texture for footer/ground sections
- **Metal surfaces:** Brushed steel texture for cards, panels, dividers
- **Medical grid:** Faint grid overlay on appointment sections
- **Paper/document texture:** For forms, receipts, confirmation screens

---

## 🏗️ PAGE STRUCTURE & SECTIONS

### **1. HERO SECTION (Above the Fold)**

**Background:**
- Full-screen immersive image/video of a **dimly lit hospital corridor or operating room**
- Overlay: Dark gradient (`rgba(13, 15, 18, 0.7)`) for text readability
- Subtle floating particles (dust motes in light beams)

**Content:**
- **Logo:** Top-left corner — stylized hospital cross in surgical teal
- **Navigation:** Minimal, transparent navbar (Home, Services, Doctors, Appointments, Contact)
- **Headline:** Large, dramatic text: *"Welcome to Requiem Medical Center"* or *"Your Health, Our Obsession"*
- **Subheadline:** Smaller, mysterious tagline: *"Where modern medicine meets the unknown"*
- **Primary CTA Button:** Glowing teal button — *"Book Your Appointment"* (scrolls to form)
- **Secondary CTA:** Ghost button — *"Explore Our Services"*

**Interactive Elements:**
- **Parallax scrolling:** Background moves slower than foreground
- **Light sweep effect:** Mouse movement triggers subtle light beam following cursor
- **Hover animations:** Buttons glow brighter, navbar links underline with teal

---

### **2. IMAGE GALLERY SECTION (Resident Evil Hospital Showcase)**

**Layout:**
- Full-width section with dark green tile background texture
- Title: *"Our Facilities"* or *"Inside Requiem"*

**Gallery Format:**
- **Horizontal scroll/slider** or **masonry grid** of 4-6 hospital images
- Images should show:
  - Dimly lit operating rooms with surgical lamps
  - X-ray rooms with glowing monitors
  - Hospital corridors with flickering fluorescent lights
  - Medical equipment (MRI machines, monitors with ECG waveforms)
  - Sterile examination rooms with scattered documents
- Each image has:
  - Dark overlay that fades on hover
  - Teal border glow on hover
  - Caption appears on hover (e.g., "Surgical Wing - Floor 3")

**Styling:**
- Images have **vignette effect** and **slightly desaturated colors**
- **Film grain overlay** for cinematic feel
- **Smooth transitions** between slides (fade + slight zoom)

---

### **3. SERVICES SECTION**

**Layout:**
- 3-4 card grid on dark background
- Each card represents a service (Emergency, Surgery, Diagnostics, Consultation)

**Card Design:**
- **Background:** Semi-transparent dark glass (`rgba(26, 30, 36, 0.9)`)
- **Border:** 1px teal border with glow on hover
- **Icon:** Medical icon in teal (scalpel, heart monitor, X-ray, stethoscope)
- **Title:** Bold white text
- **Description:** 2-3 lines of grey text
- **Hover effect:** Card lifts slightly, glow intensifies, background image fades in

---

### **4. APPOINTMENT BOOKING FORM SECTION (THE CORE)**

**Background:**
- Dark operating room image with heavy overlay
- Surgical lamp light effect shining down on the form

**Form Container:**
- Centered, glass-morphism panel
- Title: *"Schedule Your Visit"* with teal underline
- Subtitle: *"All fields required. Your appointment is our priority."*

**Form Fields (Detailed, Like a Horror Game Inventory):**

| Field | Type | Styling |
|-------|------|---------|
| **Full Name** | Text input | Dark input field, teal border on focus, glowing cursor |
| **Date of Birth** | Date picker | Custom dark-themed calendar |
| **Email** | Email input | Same as above, with @ icon |
| **Phone Number** | Tel input | With country code dropdown |
| **Appointment Type** | Dropdown | Emergency, Surgery, Check-up, Consultation, Other |
| **Preferred Doctor** | Dropdown | List of doctors with small profile photos |
| **Preferred Date** | Date picker | Calendar with available dates highlighted in teal |
| **Preferred Time** | Time picker / Dropdown | Available slots shown, booked slots greyed out |
| **Symptoms/Reason** | Textarea | 4-5 line expandable text area |
| **Emergency Contact** | Text input | Name and phone number |
| **Additional Notes** | Textarea | Optional, smaller |

**Field Styling Details:**
- **Background:** `#1a1e24` (dark slate)
- **Border:** 1px `#3a4047` (dark grey), changes to `#00d4aa` (teal) on focus
- **Text:** `#e8e8e8` (off-white)
- **Placeholder:** `#6b7280` (muted grey)
- **Label:** Small, uppercase, teal color, positioned above each field
- **Focus effect:** Glow animation, subtle scale-up
- **Error state:** Red border with shake animation, error message in red below field

**Submit Button:**
- **Text:** *"CONFIRM APPOINTMENT"* or *"BOOK NOW"*
- **Style:** Large, full-width, surgical teal background
- **Hover:** Glows brighter, slight pulse animation
- **Loading state:** Spinning medical cross icon
- **Success state:** Changes to green, shows checkmark

**Form Validation:**
- Real-time validation with subtle animations
- Required fields marked with red asterisk
- Success/error messages appear as floating tooltips

---

### **5. DOCTORS TEAM SECTION**

**Layout:**
- Grid of doctor cards (4-6 doctors)

**Card Design:**
- **Photo:** Doctor portrait with dark vignette overlay
- **Name:** Large, bold white text
- **Specialty:** Teal text below name
- **Experience:** Small grey text (e.g., "15 years in Neurosurgery")
- **Availability:** Green dot + "Available Today" or red dot + "Booked"
- **Quick Book Button:** Small teal button on each card

**Hover Effect:**
- Card expands slightly
- Additional info slides up (education, languages, ratings)
- Photo gains teal border glow

---

### **6. TESTIMONIALS / PATIENT STORIES**

**Layout:**
- Horizontal carousel of testimonial cards

**Card Design:**
- Dark glass background
- Patient quote in italic white text
- Patient name and treatment type in teal
- Star rating (5 stars in gold)
- Optional: Before/after medical imagery (X-rays, scans)

---

### **7. CONTACT & LOCATION SECTION**

**Layout:**
- Two-column layout

**Left Column (Contact Info):**
- Address with map pin icon
- Phone number with phone icon
- Email with envelope icon
- Operating hours with clock icon
- All icons in teal

**Right Column (Map):**
- Dark-themed Google Map embed
- Custom teal map marker
- Hospital location pinned

---

### **8. FOOTER**

**Background:**
- Dark concrete texture
- 4-column layout

**Content:**
- **Column 1:** Logo + tagline
- **Column 2:** Quick links (Home, Services, Doctors, Appointments)
- **Column 3:** Contact info
- **Column 4:** Social media icons (teal on hover) + newsletter signup

**Bottom Bar:**
- Copyright text
- Privacy Policy | Terms of Service links

---

## 🎭 INTERACTIVE ANIMATIONS & MICRO-INTERACTIONS

### **Scroll Animations**
- Sections fade in as user scrolls down
- Images have parallax effect
- Text reveals with slide-up animation

### **Hover Effects**
- **Buttons:** Glow intensifies, slight scale-up (1.05x)
- **Cards:** Lift effect (translateY -5px), shadow deepens
- **Links:** Teal underline animates from left to right
- **Form fields:** Border glow, label floats up

### **Loading States**
- **Page load:** Medical cross spinner in teal
- **Form submission:** Pulsing loading bar
- **Image load:** Fade-in with blur-to-sharp transition

### **Success/Confirmation**
- **Appointment confirmed:** Full-screen overlay with:
  - Large checkmark in teal
  - "Appointment Confirmed" headline
  - Appointment details summary
  - "Download Ticket" button
  - Confetti/particle effect in teal

---

## 📱 RESPONSIVE DESIGN

### **Desktop (1920px - 1440px)**
- Full layout as described above
- All sections visible, multi-column grids

### **Tablet (1024px - 768px)**
- 2-column grids become single column
- Navigation becomes hamburger menu
- Form fields stack vertically
- Images scale proportionally

### **Mobile (767px and below)**
- Single column layout
- Full-width buttons
- Touch-friendly form fields (larger tap targets)
- Simplified animations
- Sticky "Book Now" button at bottom

---

## 🎨 ADDITIONAL DESIGN NOTES

### **Atmosphere Keywords**
- **Mysterious:** Hidden details, subtle discoveries
- **Clinical:** Clean lines, medical precision
- **Dark:** Deep shadows, low light
- **Sexy:** Smooth animations, premium feel, glowing accents
- **Immersive:** Full-screen experiences, parallax, depth

### **Inspiration References**
- Resident Evil 7/8/9 hospital scenes
- Biohazard containment facilities
- Modern dark-themed healthcare websites
- Sci-fi medical interfaces (Altered Carbon, Blade Runner 2049)

### **Accessibility**
- Ensure sufficient contrast (WCAG AA minimum)
- Keyboard navigation support
- Screen reader friendly labels
- Focus indicators visible (teal glow)

---

## 📋 DELIVERABLES EXPECTED FROM FIGMA

1. **Desktop Design** (1920x1080) — Full homepage with all sections
2. **Tablet Design** (1024x768) — Responsive version
3. **Mobile Design** (375x812) — Mobile-first version
4. **Component Library** — Buttons, form fields, cards, navigation
5. **Interactive Prototype** — Clickable flows (home → form → confirmation)
6. **Style Guide** — Colors, typography, spacing, effects documented

---

## 🔥 FINAL VIBE CHECK

The website should feel like **walking into a premium, slightly mysterious hospital from a horror game**. Users should feel:
- **Intrigued** by the dark, cinematic aesthetic
- **Confident** in the professional, clinical design
- **Engaged** by smooth, sexy animations
- **Ready to book** with an intuitive, detailed form

**Tagline for the designer:** *"Make it look like the hospital you'd want to be in during the apocalypse — sleek, mysterious, and deadly professional."*

---

*End of Figma Design Prompt*
