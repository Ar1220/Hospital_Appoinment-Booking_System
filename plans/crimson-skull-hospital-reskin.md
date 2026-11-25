# Requiem Medical Center — Crimson Skull Texture Reskin Plan

## Goal

Keep the existing Requiem Medical Center layout, content, responsiveness, booking prototype, and hospital imagery intact. Replace the current teal/green clinical visual system with the user-supplied **blackened crimson skull** aesthetic across the whole site.

The finished site should feel like a dark blood-red horror hospital: nearly black shadows, layered oxblood texture, faint skull/bone forms, warm ivory copy, and red interface light. The skull material should be part of the visual atmosphere—not a busy wallpaper that makes forms or text difficult to read.

## Confirmed direction

- **Palette:** Deep black-red and oxblood, based on the supplied skull reference. Remove teal, cyan, blue, and green interface accents.
- **Texture:** Use the supplied skull/bone artwork as a low-contrast, recurring background material throughout the site.
- **Horror level:** Strong environmental horror styling, with skeletal forms, distressed grain, dried-blood maroon panels, and red illumination; no changes to booking data, interactions, or page structure.
- **Readability:** Maintain warm off-white content text, clear form labels, and visible crimson focus/error states.
- **Scope protection:** Do not change the manually restored `package.json`, `src/main.tsx`, `vite.config.ts`, or the booking logic in `src/App.tsx`.

## Visual system

### Global color tokens

Replace the current cool-toned tokens with a single crimson scale:

- `--ink`: near-black blood tone (`#0b0203`)
- `--ink-raised`: black-maroon (`#160406`)
- `--slate`: dried-blood panel (`#24070a`)
- `--tile`: dark wine-red (`#34090d`)
- `--line`: subdued red-pink border at low opacity
- `--line-strong`: visible scarlet focus/active border
- `--paper`: warm ivory/pale bone for primary text
- `--muted`: desaturated rose-grey for secondary copy
- Primary action accent: dark arterial red
- Hover/focus accent: brighter scarlet-red
- Error state: clear high-contrast red-pink

All existing green/teal/blue literal values, shadows, gradients, grid lines, and icon glows will be replaced, not merely overridden at the root token level.

### Skull texture treatment

1. Copy the new supplied skull artwork into `public/images/requiem/` as a locally served asset.
2. Produce a web-optimized derivative for full-page/section backgrounds while retaining the original supplied visual in the asset folder.
3. Add the skull texture as a low-opacity, masked background layer in:
   - the site shell/body beneath all content;
   - the hero edge/vignette layer, without obscuring the hospital photo or headline;
   - broad structural sections (facilities, services, team, patient records, contact, footer);
   - the appointment section as a particularly dark, contained texture behind the form.
4. Use gradients and opacity masks to keep skull forms most visible around outer edges and section transitions; keep text and controls on near-solid maroon/black panels.
5. Retain the existing subtle blood-stain SVG, recolored or blended to match the deeper crimson system, as a secondary environmental detail rather than the main texture.

## CSS implementation

Update only `src/index.css` for the application skin:

1. **Base and page layers**
   - Replace root tokens and base body gradients.
   - Rework `site-shell` into a layered maroon-black surface with global skull texture, distressed grain, and a dark center readability mask.
   - Preserve the reduced-motion rules and ensure fixed overlays do not block interaction.

2. **Navigation and CTA system**
   - Turn the logo cross, header button, nav hover/underline, status lights, and mobile booking bar to crimson/scarlet.
   - Make primary actions dark blood red with warm ivory labels; use a brighter scarlet hover state and red ambient glow.
   - Restyle ghost buttons, borders, and focus rings from teal to red.

3. **Hero**
   - Keep the higher-resolution operating-theatre hero image.
   - Replace teal pointer light with deep red emergency illumination.
   - Place skull texture/vignette at the image edges and keep the left-side text field dark and legible.
   - Retain faint scan/grain and environmental blood details; do not add people or explicit medical gore.

4. **Facilities, services, and cards**
   - Replace green grid/tile backdrops with layered crimson texture and black-maroon panels.
   - Change card borders, image hover glows, icons, section metadata, and links to the red palette.
   - Let the skull artwork appear at low opacity in wide section backgrounds, never within dense card content.

5. **Appointment flow**
   - Replace all field focus borders, field glow, labels, dropdown accents, submit button, spinner palette, validation messaging, and confirmation panel accents with red equivalents.
   - Keep input fields very dark to preserve high contrast and maintain clear error vs. focus differentiation.
   - Put an especially subtle skull layer behind—not inside—the form panel.

6. **Doctors, testimonials, contact, map, and footer**
   - Recolor availability dots, portrait scan effect, map marker/roads, testimonial quotes, newsletter control, and footer status states.
   - Use skull texture behind broad sections and preserve readable solid card surfaces.
   - Keep existing responsive behavior and interactive affordances unchanged.

## Assets and files

- `public/images/requiem/skull-texture.png` — user-supplied skull/bone reference, copied locally.
- `public/images/requiem/skull-texture.webp` — optimized background derivative used in CSS.
- `src/index.css` — comprehensive palette replacement, texture layers, and red interaction states.

No changes to React component logic, package configuration, application entrypoint, Vite configuration, or the booking form’s data flow are required.

## Verification

1. Search `src/index.css` for the old cool accent literals/tokens to ensure teal/cyan/green interaction colors are removed.
2. Run `pnpm build` to verify production compilation after the broad CSS/asset update.
3. Inspect the existing preview at desktop and mobile widths:
   - skull texture is visible but not noisy;
   - all major sections read as one coherent crimson-black system;
   - hero title, CTA, and navigation remain legible over the hospital image;
   - form labels/inputs/errors/focus states are usable;
   - cards, map, confirmation state, and footer no longer retain cool-colored accents.
4. Check the browser console only if a concrete preview failure appears.

## Acceptance criteria

- No teal, cyan, blue, or green UI accents remain.
- The supplied skull/bone texture is visibly integrated into the overall website background and large section surfaces without impairing readability.
- The medical booking experience remains fully functional and responsive.
- The style reads as deliberate black-crimson horror throughout, not a teal hospital site with isolated red details.
