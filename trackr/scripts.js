'use strict';

// -------------------------------------------------------------
// WORKOUT CLASSES & MODELS
// -------------------------------------------------------------
class Workout {
  date = new Date();
  id = (Date.now() + ``).slice(-10);
  clicks = 0;
  route = []; // Array of [lat, lng] coordinates
  weather = null; // Weather object: { temp, emoji }

  constructor(coords, distance, duration, route = [], weather = null) {
    this.coords = coords; // Primary location [lat, lng]
    this.distance = distance; // km
    this.duration = duration; // min
    this.route = route;
    this.weather = weather;
  }

  _setDescription() {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    this.description = `${this.type[0].toUpperCase()}${this.type.slice(1)} on ${
      months[this.date.getMonth()]
    } ${this.date.getDate()}`;
  }
}

class Jogging extends Workout {
  type = 'jogging';
  constructor(coords, distance, duration, cadence, route = [], weather = null) {
    super(coords, distance, duration, route, weather);
    this.cadence = cadence;
    this._calcPace();
    this._setDescription();
  }

  _calcPace() {
    this.pace = this.duration / this.distance; // min/km
    return this.pace;
  }
}

class Biking extends Workout {
  type = 'biking';
  constructor(coords, distance, duration, elevationGain, route = [], weather = null) {
    super(coords, distance, duration, route, weather);
    this.elevationGain = elevationGain;
    this._calcSpeed();
    this._setDescription();
  }

  _calcSpeed() {
    this.speed = this.distance / (this.duration / 60); // km/h
    return this.speed;
  }
}

// -------------------------------------------------------------
// DOM ELEMENTS SELECTION
// -------------------------------------------------------------
const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');
const resetBtn = document.querySelector('.reset');

// Controls & Panels Selection
const toggleAnalyticsBtn = document.getElementById('toggle-analytics');
const analyticsContent = document.getElementById('analytics-content');
const toggleBadgesBtn = document.getElementById('toggle-badges');
const badgesContent = document.getElementById('badges-content');
const searchInput = document.getElementById('search-input');
const filterType = document.getElementById('filter-type');
const sortBy = document.getElementById('sort-by');

// GPS Drawing Controls
const btnToggleDrawing = document.getElementById('btn-toggle-drawing');
const guideText = document.getElementById('guide-text');
const drawingControlsButtons = document.getElementById('drawing-controls-buttons');
const tempRouteDistanceVal = document.getElementById('temp-route-distance');
const btnClearRoute = document.getElementById('btn-clear-route');
const btnSaveRoute = document.getElementById('btn-save-route');

// -------------------------------------------------------------
// APPLICATION CONTROLLER ARCHITECTURE
// -------------------------------------------------------------
class App {
  #map;
  #mapZoomLevel = 13;
  #mapEvent;
  #workouts = [];
  chart = null;

  // GIS Route Drawing State
  isDrawingMode = false;
  drawnPoints = [];
  drawingPolyline = null;
  drawingMarkers = [];

  constructor() {
    this._getPosition();
    this._getLocalStorage();
    this._initCollapsibles();

    // Event Handlers Setup
    form.addEventListener('submit', this._newWorkout.bind(this));
    inputType.addEventListener('change', this._toggleElevationField.bind(this));
    containerWorkouts.addEventListener('click', this._handleWorkoutClick.bind(this));
    resetBtn.addEventListener('click', this.reset.bind(this));

    // Advanced search, filter, and sort listeners
    searchInput.addEventListener('input', this._filterAndRenderWorkouts.bind(this));
    filterType.addEventListener('change', this._filterAndRenderWorkouts.bind(this));
    sortBy.addEventListener('change', this._filterAndRenderWorkouts.bind(this));

    // Route Drawing Mode events
    btnToggleDrawing.addEventListener('click', this._toggleDrawingMode.bind(this));
    btnClearRoute.addEventListener('click', this._clearDrawnRoute.bind(this));
    btnSaveRoute.addEventListener('click', this._saveDrawnRoute.bind(this));

    // Initialize Analytics Dashboard Charts
    this._initChart();
    this.appear();
    this._updateStats();
    this._checkAchievements();
  }

  // -------------------------------------------------------------
  // MAP & GEOLOCATION INTEL
  // -------------------------------------------------------------
  _getPosition() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        this._loadMap.bind(this),
        () => alert('Could not retrieve your location. Check browser location permissions.')
      );
    }
  }

  _loadMap(position) {
    const { latitude, longitude } = position.coords;
    const coords = [latitude, longitude];

    this.#map = L.map('map').setView(coords, this.#mapZoomLevel);

    // Apply Obsidian premium dark matter tiles
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    }).addTo(this.#map);

    this.#map.on('click', this._handleMapClick.bind(this));
    
    // Render existing elements onto the loaded map
    this.#workouts.forEach(work => {
      this._renderWorkoutMarker(work);
    });
  }

  _handleMapClick(mapE) {
    this.#mapEvent = mapE;
    const { lat, lng } = mapE.latlng;

    if (this.isDrawingMode) {
      this._addPointToRoute([lat, lng]);
    } else {
      this._showForm();
    }
  }

  // -------------------------------------------------------------
  // GIS ROUTE DRAWING LOGIC
  // -------------------------------------------------------------
  _toggleDrawingMode() {
    this.isDrawingMode = !this.isDrawingMode;
    
    if (this.isDrawingMode) {
      btnToggleDrawing.classList.add('active');
      btnToggleDrawing.innerHTML = '<i class="fa-solid fa-square-check"></i> Exit Draw Mode';
      guideText.innerHTML = '<b>Drawing active:</b> Click multiple points on the map to trace your path. Double click or click "Complete" to finish.';
      drawingControlsButtons.classList.remove('hidden');
      this._clearDrawnRoute();
      form.classList.add('hidden');
    } else {
      btnToggleDrawing.classList.remove('active');
      btnToggleDrawing.innerHTML = '<i class="fa-solid fa-route"></i> Draw Route';
      guideText.textContent = 'Click anywhere on the map to log a single workout spot.';
      drawingControlsButtons.classList.add('hidden');
      this._clearDrawnRoute();
    }
  }

  _addPointToRoute(coords) {
    this.drawnPoints.push(coords);

    // Draw standard circles at each waypoint
    const marker = L.circleMarker(coords, {
      radius: 6,
      color: '#8b5cf6',
      fillColor: '#a855f7',
      fillOpacity: 1,
      weight: 2
    }).addTo(this.#map);
    this.drawingMarkers.push(marker);

    // Draw the connecting polyline
    if (this.drawingPolyline) {
      this.drawingPolyline.setLatLngs(this.drawnPoints);
    } else {
      this.drawingPolyline = L.polyline(this.drawnPoints, {
        color: '#a855f7',
        weight: 4,
        dashArray: '5, 8',
        className: 'glowing-polyline'
      }).addTo(this.#map);
    }

    // Compute route geodetic distance in real-time
    const totalDist = this._calculateRouteDistance(this.drawnPoints);
    tempRouteDistanceVal.textContent = totalDist.toFixed(2);
  }

  _calculateRouteDistance(points) {
    let total = 0;
    for (let i = 0; i < points.length - 1; i++) {
      const p1 = L.latLng(points[i]);
      const p2 = L.latLng(points[i + 1]);
      total += p1.distanceTo(p2); // in meters
    }
    return total / 1000; // convert to km
  }

  _clearDrawnRoute() {
    if (this.drawingPolyline) {
      this.#map.removeLayer(this.drawingPolyline);
      this.drawingPolyline = null;
    }
    this.drawingMarkers.forEach(m => this.#map.removeLayer(m));
    this.drawingMarkers = [];
    this.drawnPoints = [];
    tempRouteDistanceVal.textContent = '0.00';
  }

  _saveDrawnRoute() {
    if (this.drawnPoints.length < 2) {
      alert('Draw at least two points on the map to save a route.');
      return;
    }

    // Turn off drawing mode and open workout form
    const calculatedDist = this._calculateRouteDistance(this.drawnPoints);
    
    // Deactivate drawing UI
    this.isDrawingMode = false;
    btnToggleDrawing.classList.remove('active');
    btnToggleDrawing.innerHTML = '<i class="fa-solid fa-route"></i> Draw Route';
    guideText.textContent = 'Click anywhere on the map to log a single workout spot.';
    drawingControlsButtons.classList.add('hidden');

    // Display form and prefill fields
    this._showForm();
    inputDistance.value = calculatedDist.toFixed(2);
  }

  // -------------------------------------------------------------
  // WORKOUT LOGGING & WEATHER INTEGRATION
  // -------------------------------------------------------------
  _showForm() {
    form.classList.remove('hidden');
    inputDistance.focus();
  }

  _hideForm() {
    inputCadence.value = inputDistance.value = inputDuration.value = inputElevation.value = '';
    form.style.display = 'none';
    form.classList.add('hidden');
    setTimeout(() => (form.style.display = 'grid'), 600);
  }

  _toggleElevationField() {
    inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
    inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
  }

  async _getWeather(lat, lng) {
    try {
      const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current_weather=true`);
      if (!res.ok) return null;
      const data = await res.json();
      const temp = Math.round(data.current_weather.temperature);
      const code = data.current_weather.weathercode;

      let emoji = '☀️';
      if (code >= 1 && code <= 3) emoji = '⛅';
      else if (code >= 45 && code <= 48) emoji = '🌫️';
      else if (code >= 51 && code <= 67) emoji = '🌧️';
      else if (code >= 71 && code <= 77) emoji = '❄️';
      else if (code >= 80 && code <= 82) emoji = '🌦️';
      else if (code >= 95) emoji = '⛈️';

      return { temp, emoji };
    } catch (err) {
      console.warn('Weather fetch failed', err);
      return null;
    }
  }

  async _newWorkout(e) {
    e.preventDefault();
    const validInput = (...inputs) => inputs.every(ipt => Number.isFinite(ipt));
    const allPositive = (...inputs) => inputs.every(ipt => ipt > 0);

    const type = inputType.value;
    const distance = +inputDistance.value;
    const duration = +inputDuration.value;
    
    // GPS coordinates source (either from map click or first point of drawn route)
    let lat, lng;
    let finalRoute = [];

    if (this.drawnPoints.length > 0) {
      lat = this.drawnPoints[0][0];
      lng = this.drawnPoints[0][1];
      finalRoute = [...this.drawnPoints];
    } else if (this.#mapEvent) {
      lat = this.#mapEvent.latlng.lat;
      lng = this.#mapEvent.latlng.lng;
      finalRoute = [[lat, lng]];
    } else {
      alert('Click on the map or trace a route first.');
      return;
    }

    let workout;

    // Validation & Creation
    if (type === 'jogging') {
      const cadence = +inputCadence.value;
      if (!validInput(distance, duration, cadence) || !allPositive(distance, duration, cadence)) {
        return alert('Inputs have to be positive Numbers!');
      }
      
      // Fetch live weather coordinates details
      const weather = await this._getWeather(lat, lng);
      workout = new Jogging([lat, lng], distance, duration, cadence, finalRoute, weather);
    }

    if (type === 'biking') {
      const elevation = +inputElevation.value;
      if (!validInput(distance, duration, elevation) || !allPositive(distance, duration)) {
        return alert('Inputs have to be positive Numbers!');
      }

      const weather = await this._getWeather(lat, lng);
      workout = new Biking([lat, lng], distance, duration, elevation, finalRoute, weather);
    }

    // Save and Render new workout
    this.#workouts.push(workout);
    this.appear();
    this._renderWorkoutMarker(workout);
    this._filterAndRenderWorkouts();
    this._hideForm();

    // Clear route overlays on map
    this._clearDrawnRoute();

    // Persist and update stats/charts
    this._setLocalStorage();
    this._updateStats();
    this._updateChart();
    this._checkAchievements();
  }

  // -------------------------------------------------------------
  // DYNAMIC MAP MARKERS & GIS DRAWING RENDER
  // -------------------------------------------------------------
  _renderWorkoutMarker(workout) {
    // 1. Draw glowing waypoint polylines if it is a route
    if (workout.route && workout.route.length > 1) {
      L.polyline(workout.route, {
        color: workout.type === 'jogging' ? '#a855f7' : '#06b6d4',
        weight: 4,
        opacity: 0.8,
        className: 'route-polyline-saved'
      }).addTo(this.#map);
    }

    // 2. Put main custom marker
    const markerIcon = L.divIcon({
      html: `<div class="custom-map-marker marker-${workout.type}">
               <span>${workout.type === 'jogging' ? '🏃‍♂️' : '🚴‍♀️'}</span>
             </div>`,
      className: 'custom-leaflet-marker-wrapper',
      iconSize: [36, 36],
      iconAnchor: [18, 36]
    });

    const weatherText = workout.weather 
      ? ` | <span class="popup-weather">${workout.weather.emoji} ${workout.weather.temp}°C</span>`
      : '';

    L.marker(workout.coords, { icon: markerIcon })
      .addTo(this.#map)
      .bindPopup(
        L.popup({
          maxWidth: 260,
          minWidth: 120,
          autoClose: false,
          closeOnClick: false,
          className: `${workout.type}-popup`,
        })
      )
      .setPopupContent(
        `<span class="popup-title">${workout.type === 'jogging' ? '🏃‍♂️ Jogging' : '🚴‍♀️ Biking'}</span><br>
         <span class="popup-desc">${workout.description}${weatherText}</span>`
      )
      .openPopup();
  }

  // -------------------------------------------------------------
  // DYNAMIC UI & IN-PLACE EDITING CARD ENGINE
  // -------------------------------------------------------------
  _renderWorkoutCard(workout) {
    const weatherHtml = workout.weather 
      ? `<div class="workout__weather-badge" title="Local weather logged">
           <span>${workout.weather.emoji}</span>
           <span>${workout.weather.temp}°C</span>
         </div>`
      : '';

    const routeBadge = workout.route && workout.route.length > 1
      ? `<span class="route-badge-ui" title="Drawn route with ${workout.route.length} waypoints"><i class="fa-solid fa-map-location-dot"></i> GPS Route</span>`
      : '';

    let html = `
    <li class="workout workout--${workout.type}" data-id="${workout.id}">
      <div class="workout__title">
        <h2 class="workout__title-heading">${workout.description} ${routeBadge}</h2>
        <div class="workout__actions">
          <span class="workout__edit-btn" title="Edit Workout"><i class="fa-solid fa-pencil"></i></span>
          <span class="workout__cancel" title="Delete Workout">&times;</span>
        </div>
      </div>
      
      ${weatherHtml}

      <div class="workout__details">
        <span class="workout__icon">${workout.type === 'jogging' ? '🏃‍♂️' : '🚴‍♀️'}</span>
        <span class="workout__value">${workout.distance}</span>
        <span class="workout__unit">km</span>
      </div>
      <div class="workout__details">
        <span class="workout__icon">⏱</span>
        <span class="workout__value">${workout.duration}</span>
        <span class="workout__unit">min</span>
      </div>`;

    if (workout.type === 'jogging') {
      html += `
      <div class="workout__details">
        <span class="workout__icon">⚡️</span>
        <span class="workout__value">${workout.pace.toFixed(1)}</span>
        <span class="workout__unit">min/km</span>
      </div>
      <div class="workout__details">
        <span class="workout__icon">🦶🏼</span>
        <span class="workout__value">${workout.cadence}</span>
        <span class="workout__unit">spm</span>
      </div>`;
    }

    if (workout.type === 'biking') {
      html += `
      <div class="workout__details">
        <span class="workout__icon">⚡️</span>
        <span class="workout__value">${workout.speed.toFixed(1)}</span>
        <span class="workout__unit">km/h</span>
      </div>
      <div class="workout__details">
        <span class="workout__icon">⛰</span>
        <span class="workout__value">${workout.elevationGain}</span>
        <span class="workout__unit">m</span>
      </div>`;
    }

    html += `</li>`;
    
    // Inject below form
    form.insertAdjacentHTML('afterend', html);
  }

  _handleWorkoutClick(e) {
    const deleteBtn = e.target.closest('.workout__cancel');
    const editBtn = e.target.closest('.workout__edit-btn');
    const workoutEl = e.target.closest('.workout');

    if (!workoutEl) return;

    const workout = this.#workouts.find(work => work.id === workoutEl.dataset.id);

    // Case 1: Clicked delete
    if (deleteBtn) {
      this.delete(workout.id);
      return;
    }

    // Case 2: Clicked edit
    if (editBtn) {
      e.stopPropagation();
      this._showEditFormInline(workout, workoutEl);
      return;
    }

    // Case 3: Pan map to coords
    if (workout.route && workout.route.length > 1) {
      this.#map.fitBounds(workout.route, { padding: [50, 50] });
    } else {
      this.#map.setView(workout.coords, this.#mapZoomLevel, {
        animate: true,
        pan: { duration: 1 }
      });
    }
  }

  // -------------------------------------------------------------
  // IN-PLACE INLINE EDITING ENGINE
  // -------------------------------------------------------------
  _showEditFormInline(workout, workoutEl) {
    // Check if edit form is already open
    if (workoutEl.querySelector('.inline-edit-form')) return;

    // Create container and inject inline values
    const editFormHtml = `
      <div class="inline-edit-form">
        <h4>Edit Workout Metrics</h4>
        <div class="edit-row">
          <label>Distance (km)</label>
          <input type="number" step="0.01" class="edit-input edit-dist" value="${workout.distance}">
        </div>
        <div class="edit-row">
          <label>Duration (min)</label>
          <input type="number" class="edit-input edit-dur" value="${workout.duration}">
        </div>
        ${
          workout.type === 'jogging'
            ? `<div class="edit-row">
                 <label>Cadence (spm)</label>
                 <input type="number" class="edit-input edit-cadence" value="${workout.cadence}">
               </div>`
            : `<div class="edit-row">
                 <label>Elev Gain (m)</label>
                 <input type="number" class="edit-input edit-elevation" value="${workout.elevationGain}">
               </div>`
        }
        <div class="edit-buttons">
          <button class="btn-edit-action cancel-edit">Cancel</button>
          <button class="btn-edit-action save-edit">Save Metrics</button>
        </div>
      </div>
    `;

    workoutEl.insertAdjacentHTML('beforeend', editFormHtml);

    // Form buttons event handlers
    const cancelBtn = workoutEl.querySelector('.cancel-edit');
    const saveBtn = workoutEl.querySelector('.save-edit');

    cancelBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      workoutEl.querySelector('.inline-edit-form').remove();
    });

    saveBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this._saveWorkoutInline(workout, workoutEl);
    });
  }

  _saveWorkoutInline(workout, workoutEl) {
    const newDist = +workoutEl.querySelector('.edit-dist').value;
    const newDur = +workoutEl.querySelector('.edit-dur').value;

    if (newDist <= 0 || newDur <= 0) {
      alert('Metrics must be positive numeric metrics!');
      return;
    }

    workout.distance = newDist;
    workout.duration = newDur;

    if (workout.type === 'jogging') {
      const newCadence = +workoutEl.querySelector('.edit-cadence').value;
      if (newCadence <= 0) return alert('Cadence must be a positive number!');
      workout.cadence = newCadence;
      workout.pace = newDur / newDist;
    }

    if (workout.type === 'biking') {
      const newElev = +workoutEl.querySelector('.edit-elevation').value;
      workout.elevationGain = newElev;
      workout.speed = newDist / (newDur / 60);
    }

    this._setLocalStorage();
    
    // Fully refresh the sidebar rendering to display updated values
    this._filterAndRenderWorkouts();
    this._updateStats();
    this._updateChart();
    this._checkAchievements();

    // Map refresh popup
    location.reload();
  }

  // -------------------------------------------------------------
  // ADVANCED SEARCH, FILTERING, & SORTING DECK
  // -------------------------------------------------------------
  _filterAndRenderWorkouts() {
    // Clear list (except the new workout form)
    const cards = containerWorkouts.querySelectorAll('.workout');
    cards.forEach(c => c.remove());

    const searchQuery = searchInput.value.toLowerCase().trim();
    const typeFilter = filterType.value;
    const sortVal = sortBy.value;

    // Apply Filter & Search
    let results = this.#workouts.filter(work => {
      const matchesSearch = work.description.toLowerCase().includes(searchQuery);
      const matchesType = typeFilter === 'all' || work.type === typeFilter;
      return matchesSearch && matchesType;
    });

    // Apply Sorting
    if (sortVal === 'date-desc') {
      results.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (sortVal === 'date-asc') {
      results.sort((a, b) => new Date(a.date) - new Date(b.date));
    } else if (sortVal === 'distance-desc') {
      results.sort((a, b) => b.distance - a.distance);
    } else if (sortVal === 'duration-desc') {
      results.sort((a, b) => b.duration - a.duration);
    }

    // Render filtered list
    results.forEach(work => this._renderWorkoutCard(work));
  }

  // -------------------------------------------------------------
  // DYNAMIC CHART.JS INTELLIGENCE
  // -------------------------------------------------------------
  _initChart() {
    const ctx = document.getElementById('performanceChart');
    if (!ctx) return;

    // Compile last 7 workouts data
    const lastWorkouts = this.#workouts.slice(-7);
    const labels = lastWorkouts.map(w => w.description.split(' on ')[1] || 'Workout');
    const distances = lastWorkouts.map(w => w.distance);

    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Workout Distance (km)',
          data: distances,
          borderColor: '#8b5cf6',
          backgroundColor: 'rgba(139, 92, 246, 0.08)',
          borderWidth: 2,
          pointBackgroundColor: '#06b6d4',
          pointBorderColor: '#090d16',
          pointBorderWidth: 1.5,
          pointRadius: 4,
          pointHoverRadius: 6,
          tension: 0.35,
          fill: true
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            grid: { color: 'rgba(255, 255, 255, 0.04)' },
            ticks: { color: '#94a3b8', font: { family: 'Manrope', size: 10 } }
          },
          x: {
            grid: { display: false },
            ticks: { color: '#94a3b8', font: { family: 'Manrope', size: 10 } }
          }
        },
        plugins: {
          legend: { display: false }
        }
      }
    });
  }

  _updateChart() {
    if (!this.chart) return;

    const lastWorkouts = this.#workouts.slice(-7);
    const labels = lastWorkouts.map(w => w.description.split(' on ')[1] || 'Workout');
    const distances = lastWorkouts.map(w => w.distance);

    this.chart.data.labels = labels;
    this.chart.data.datasets[0].data = distances;
    this.chart.update();
  }

  // -------------------------------------------------------------
  // DYNAMIC COLLAPSIBLE UTILITIES
  // -------------------------------------------------------------
  _initCollapsibles() {
    toggleAnalyticsBtn.addEventListener('click', () => {
      analyticsContent.classList.toggle('collapsed');
      toggleAnalyticsBtn.querySelector('.toggle-icon').classList.toggle('fa-chevron-down');
      toggleAnalyticsBtn.querySelector('.toggle-icon').classList.toggle('fa-chevron-up');
    });

    toggleBadgesBtn.addEventListener('click', () => {
      badgesContent.classList.toggle('collapsed');
      toggleBadgesBtn.querySelector('.toggle-icon').classList.toggle('fa-chevron-down');
      toggleBadgesBtn.querySelector('.toggle-icon').classList.toggle('fa-chevron-up');
    });
  }

  // -------------------------------------------------------------
  // PERFORMANCE ANALYTICS & STATS CALCULATION
  // -------------------------------------------------------------
  _updateStats() {
    const workoutsCount = this.#workouts.length;
    const totalDistance = this.#workouts.reduce((acc, work) => acc + work.distance, 0).toFixed(1);
    const totalDuration = this.#workouts.reduce((acc, work) => acc + work.duration, 0);

    const workoutsEl = document.getElementById('stat-workouts');
    const distanceEl = document.getElementById('stat-distance');
    const durationEl = document.getElementById('stat-duration');

    if (workoutsEl) workoutsEl.textContent = workoutsCount;
    if (distanceEl) distanceEl.textContent = totalDistance;
    if (durationEl) durationEl.textContent = totalDuration;
  }

  _checkAchievements() {
    const totalDistance = this.#workouts.reduce((acc, work) => acc + work.distance, 0);
    
    // 1. Century Club (Total Distance >= 100km)
    const centuryBadge = document.getElementById('badge-century');
    if (centuryBadge) {
      if (totalDistance >= 100) {
        centuryBadge.classList.remove('locked');
        centuryBadge.classList.add('unlocked');
      } else {
        centuryBadge.classList.remove('unlocked');
        centuryBadge.classList.add('locked');
      }
    }

    // 2. Speed Demon (Run pace <= 4.5 min/km or Cycling speed >= 30 km/h)
    const speedBadge = document.getElementById('badge-speed');
    if (speedBadge) {
      const isSpeedDemon = this.#workouts.some(w => {
        if (w.type === 'jogging' && w.pace <= 4.5) return true;
        if (w.type === 'biking' && w.speed >= 30) return true;
        return false;
      });
      if (isSpeedDemon) {
        speedBadge.classList.remove('locked');
        speedBadge.classList.add('unlocked');
      } else {
        speedBadge.classList.remove('unlocked');
        speedBadge.classList.add('locked');
      }
    }

    // 3. Explorer (Route length >= 3 coordinate points)
    const explorerBadge = document.getElementById('badge-explorer');
    if (explorerBadge) {
      const isExplorer = this.#workouts.some(w => w.route && w.route.length >= 3);
      if (isExplorer) {
        explorerBadge.classList.remove('locked');
        explorerBadge.classList.add('unlocked');
      } else {
        explorerBadge.classList.remove('unlocked');
        explorerBadge.classList.add('locked');
      }
    }

    // 4. Cold Warrior (Weather temperature logged < 12 degrees)
    const weatherBadge = document.getElementById('badge-weather');
    if (weatherBadge) {
      const isColdWarrior = this.#workouts.some(w => w.weather && w.weather.temp < 12);
      if (isColdWarrior) {
        weatherBadge.classList.remove('locked');
        weatherBadge.classList.add('unlocked');
      } else {
        weatherBadge.classList.remove('unlocked');
        weatherBadge.classList.add('locked');
      }
    }
  }

  // -------------------------------------------------------------
  // STORAGE & LIFECYCLE
  // -------------------------------------------------------------
  _setLocalStorage() {
    localStorage.setItem('workouts', JSON.stringify(this.#workouts));
  }

  _getLocalStorage() {
    const data = JSON.parse(localStorage.getItem('workouts'));
    if (!data) return;

    // Restore instances so method calculations still run
    this.#workouts = data.map(work => {
      if (work.type === 'jogging') {
        return Object.assign(new Jogging(), work);
      }
      if (work.type === 'biking') {
        return Object.assign(new Biking(), work);
      }
      return work;
    });

    this._filterAndRenderWorkouts();
  }

  delete(id) {
    const index = this.#workouts.findIndex(w => w.id === id);
    if (index === -1) return;

    this.#workouts.splice(index, 1);
    this._setLocalStorage();
    
    // Dynamic page reload to fully redraw Leaflet points easily
    location.reload();
  }

  appear() {
    if (this.#workouts.length === 0) {
      resetBtn.style.display = 'none';
    } else {
      resetBtn.style.display = 'block';
    }
  }

  reset() {
    localStorage.removeItem('workouts');
    location.reload();
  }
}

// -------------------------------------------------------------
// APP INITIALIZATION
// -------------------------------------------------------------
const app = new App();
