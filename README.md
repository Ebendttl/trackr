# Trackr

A lightweight workout tracker that lets you **log jogging and biking workouts on an interactive map**. Trackr uses your browser’s geolocation to center the map, lets you click to add a workout at a location, and persists workouts in **Local Storage** so they’re still there when you refresh.

> Built with vanilla JavaScript + HTML/CSS, bundled with **Parcel**.

---

## Table of contents

- Demo
- Features
- How it works
- Tech stack
- Project structure
- Getting started
  - Prerequisites
  - Install
  - Run locally
  - Build for production
- Usage guide
  - Create a workout
  - Delete a workout
  - Delete all workouts
- Data model
- Persistence
- Configuration / customization
- Troubleshooting
- Contributing
- License
- Authors

---

## Demo

- Deployed site (as referenced in HTML meta tags): `https://trackrie.netlify.app`

If you fork/host your own version, update `og:url` and other metadata in `index.html`.

---

## Features

- **Interactive map** powered by Leaflet + OpenStreetMap tiles
- **Geolocation-based start position**
- Log 2 workout types:
  - **Jogging**: distance, duration, cadence → pace is computed
  - **Biking**: distance, duration, elevation gain → speed is computed
- **Click-to-add** workflow:
  - click map → form appears
  - submit workout → marker + list item are rendered
- **Workout list sidebar**:
  - click a workout → map pans/zooms to its marker
- **Delete single workout** (via the `×` button on a workout list item)
- **Delete all workouts**
- **Persistence with Local Storage** (`localStorage["workouts"]`)

---

## How it works

1. On page load, `App`:
   - requests geolocation permissions
   - loads saved workouts from Local Storage
   - renders saved workouts into the sidebar
2. After geolocation is granted, Leaflet initializes the map and:
   - listens for map clicks
   - renders markers for any saved workouts
3. When you submit the form:
   - Trackr validates numeric inputs
   - creates a `Jogging` or `Biking` object (both extend `Workout`)
   - renders the workout in the list
   - renders a popup marker on the map
   - saves the updated workout list to Local Storage

---

## Tech stack

**Core**
- JavaScript (vanilla)
- HTML / CSS

**Libraries**
- Leaflet (loaded from `unpkg.com`) for maps
- OpenStreetMap tiles (via Leaflet tile layer URL)
- Google Fonts (Manrope)

**Tooling**
- Parcel bundler (v1 via `parcel-bundler`)
- Prettier config included at `trackr/.prettierrc`

---

## Project structure

At the repository root:

- `index.html` – application shell (loads Leaflet + app assets)
- `trackr/scripts.js` – application logic (classes + DOM + Leaflet + persistence)
- `trackr/styles.css` – styling
- `trackr/public/trackrlogo.png` – app logo used in the sidebar
- `trackr/tractr-architecture-files/` – architecture diagrams/images
- `package.json` – Parcel scripts

---

## Getting started

### Prerequisites

- Node.js + npm installed
- A modern browser with Geolocation support (Chrome/Edge/Firefox/Safari)

> Note: Geolocation often requires `https` in production. Locally, `http://localhost` is typically allowed.

### Install

```bash
git clone https://github.com/Ebendttl/trackr.git
cd trackr
npm install
```

### Run locally

```bash
npm start
```

Parcel will start a dev server. Open the URL printed in your terminal (commonly `http://localhost:1234` when using Parcel v1).

### Build for production

```bash
npm run build
```

This generates a production build (Parcel output directory depends on Parcel settings; by default it emits to `dist/`).

---

## Usage guide

### Create a workout

1. Allow location access when prompted.
2. Click anywhere on the map.
3. Fill out the form:
   - Select **Jogging** or **Biking**
   - Enter distance (km) and duration (min)
   - If **Jogging**: enter cadence (step/min)
   - If **Biking**: enter elevation gain (meters)
4. Press Enter / submit the form.

You’ll see:
- a **marker** at the clicked location
- a **workout card** in the sidebar list

### Delete a workout

- Click the **×** in the workout card header.

> Current implementation reloads the page after deletion to refresh the UI.

### Delete all workouts

- Click **Delete All** at the bottom of the sidebar.

This removes the `workouts` key from Local Storage and reloads the page.

---

## Data model

Workouts are modeled using classes in `trackr/scripts.js`:

- `Workout`
  - `date` (Date)
  - `id` (derived from timestamp)
  - `coords` (`[lat, lng]`)
  - `distance` (km)
  - `duration` (min)
  - `description` (generated, e.g., “Jogging on March 17”)
- `Jogging extends Workout`
  - `type = "jogging"`
  - `cadence` (step/min)
  - `pace` (min/km) calculated as `duration / distance`
- `Biking extends Workout`
  - `type = "biking"`
  - `elevationGain` (meters)
  - `speed` (km/h) calculated as `distance / (duration / 60)`

---

## Persistence

Trackr uses the browser’s Local Storage API:

- Save: `localStorage.setItem("workouts", JSON.stringify(workoutsArray))`
- Load: `JSON.parse(localStorage.getItem("workouts"))`

Because objects are serialized/deserialized as plain JSON, loaded workouts do not regain their class prototypes. (The app currently only needs the stored fields for rendering, so this works fine.)

---

## Configuration / customization

A few easy tweaks you can make:

- **Map zoom level**: update `#mapZoomLevel` in `App`
- **Tile layer**: replace the Leaflet `tileLayer` URL (currently OpenStreetMap)
- **Branding**:
  - Sidebar logo: `trackr/public/trackrlogo.png`
  - Open Graph image: `/trackrlogo1.png` (root file)
- **Workout types**:
  - Add a new subclass of `Workout`
  - Update the form in `index.html`
  - Add rendering logic in `_renderWorkout()` and marker popup content

---

## Troubleshooting

### “Could not get your position”
- Ensure location permissions are enabled for the site.
- Try running on `http://localhost` (allowed by most browsers).
- If deployed, use `https`.

### Map doesn’t appear
- Confirm Leaflet CSS/JS CDN links are reachable.
- Check the browser console for network errors.

### Workouts disappear unexpectedly
- Local Storage can be cleared by:
  - browser settings
  - private/incognito mode
  - extensions that clear site data

---

## Contributing

Contributions are welcome.

1. Fork the repo
2. Create a branch:
   ```bash
   git checkout -b my-feature
   ```
3. Commit:
   ```bash
   git commit -m "Add feature: ..."
   ```
4. Push:
   ```bash
   git push origin my-feature
   ```
5. Open a Pull Request

---

## License

This project is currently marked as **ISC** in `package.json`.

If you want it to be MIT (the previous README mentioned MIT), update `package.json` and add a `LICENSE` file to make it explicit.

---

## Authors

- Fakolujo Micheal Ayomide (`@thefaks_officia`)
- Akinseinde Ebenezer Akindele (`@Ebendttl`)
