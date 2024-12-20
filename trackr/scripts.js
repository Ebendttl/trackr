'use strict';

class Workout {
  date = new Date();
  id = (Date.now() + ``).slice(-10);
  clicks = 0;
  constructor(coords, distance, duration) {
    this.coords = coords;
    this.distance = distance; //km
    this.duration = duration; //mins
  }

  _setDescription() {
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    this.description = `${this.type[0].toUpperCase()}${this.type.slice(1)} on ${
      months[this.date.getMonth()]
    } ${this.date.getDate()}`;
  }
  click() {
    this.clicks++;
  }
}

class Jogging extends Workout {
  type = `jogging`;
  constructor(coords, distance, duration, cadence) {
    super(coords, distance, duration);
    this.cadence = cadence;
    this._calcPace();
    this._setDescription();
  }

  _calcPace() {
    //min/km
    this.pace = this.duration / this.distance;
    return this.pace;
  }
}
class Biking extends Workout {
  type = `biking`;
  constructor(coords, distance, duration, elevationGain) {
    super(coords, distance, duration);
    this.elevationGain = elevationGain;
    this._calcSpeed();
    this._setDescription();
  }
  _calcSpeed() {
    //min/km
    this.speed = this.distance / (this.duration / 60);
    return this.speed;
  }
  click() {
    this.clicks++;
  }
}

//application architecture

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');
const resetBtn = document.querySelector(`.reset`);

class App {
  #map;
  #mapZoomLevel = 13;
  #mapEvent;
  #workouts = [];
  workoutRe;
  constructor() {
    //  get location
    this._getPosition();
    // get  data from local-storage api
    this._getLocalStorage();

    //appearance of delete all option
    this.appear();

    //event handlers
    form.addEventListener(`submit`, this._newWorkout.bind(this));
    inputType.addEventListener(`change`, this._toggleElevationField.bind(this));
    containerWorkouts.addEventListener(`click`, this._moveToPopup.bind(this));
    resetBtn.addEventListener(`click`, this.reset.bind(this));
  }

  _getPosition() {
    if (navigator.geolocation)
      navigator.geolocation.getCurrentPosition(
        this._loadMap.bind(this),
        function () {
          alert(`could not get your position`);
        }
      );
  }
  _loadMap(position) {
    const { latitude } = position.coords;
    const { longitude } = position.coords;
    //console.log(`https://www.google.com/maps/@${latitude},${longitude}`);

    const coords = [latitude, longitude];
    this.#map = L.map('map').setView(coords, this.#mapZoomLevel);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.#map);

    this.#map.on(`click`, this._showForm.bind(this));
    this.#workouts.forEach(work => this._renderWorkoutMarker(work));
  }
  _showForm(mapE) {
    this.#mapEvent = mapE;
    form.classList.remove(`hidden`);
    inputDistance.focus();
  }
  _hideForm() {
    inputCadence.value =
      inputDistance.value =
      inputDuration.value =
      inputElevation.value =
        ``;
    form.style.display = `none`;
    form.classList.add(`hidden`);
    setTimeout(() => (form.style.display = `grid`), 1000);
  }
  _newWorkout(e) {
    const validInput = (...inputs) => inputs.every(ipt => Number.isFinite(ipt));
    const allPositive = (...inputs) => inputs.every(ipt => ipt > 0);
    e.preventDefault();

    // get data from form
    const type = inputType.value;
    const distance = +inputDistance.value;
    const duration = +inputDuration.value;
    const { lat, lng } = this.#mapEvent.latlng;
    let workout;
    //check if data is valid

    //if workout is running, create running object
    if (type === `jogging`) {
      const cadence = +inputCadence.value;
      //gaurd clause
      if (
        // !Number.isFinite(distance) ||
        // !Number.isFinite(duration) ||
        // !Number.isFinite(cadence)
        !validInput(distance, duration, cadence) ||
        !allPositive(distance, duration, cadence)
      )
        return alert(`inputs have to be positive Numbers!`);
      workout = new Jogging([lat, lng], distance, duration, cadence);
    }
    //if workout is cycling, create cycling object
    if (type === `biking`) {
      const elevation = +inputElevation.value;
      if (
        !validInput(distance, duration, elevation) ||
        !allPositive(distance, duration)
      )
        return alert(`inputs have to be positive Numbers!`);
      workout = new Biking([lat, lng], distance, duration, elevation);
    }
    this.#workouts.push(workout);
    this.appear();
    //add new object to workout array

    //render workout on map as marker
    this._renderWorkoutMarker(workout);

    //render workout on list
    this._renderWorkout(workout);
    //hide form + clear the input
    this._hideForm();
    // display marker

    //local storage
    this._setLocalStorage();
  }
  _toggleElevationField() {
    inputElevation.closest(`.form__row`).classList.toggle(`form__row--hidden`);
    inputCadence.closest(`.form__row`).classList.toggle(`form__row--hidden`);
  }
  _renderWorkoutMarker(workout) {
    //console.log(workout);
    L.marker(workout.coords)
      .addTo(this.#map)
      .bindPopup(
        L.popup({
          maxWidth: 250,
          minWidth: 100,
          autoClose: false,
          closeOnClick: false,
          className: `${workout.type}-popup`,
        })
      )
      .setPopupContent(
        `${workout.type === `jogging` ? `🏃‍♂️` : `🚴‍♀️`} ${workout.description}`
      )
      .openPopup();
  }
  _renderWorkout(workout) {
    let html = `
    <li class="workout workout--${workout.type}" data-id="${workout.id}">
      <div class="workout__title">
        <h2 class="workout__title-heading">${workout.description}</h2>
        <span class="workout__cancel">&times;</span>
      </div>
      <div class="workout__details">
        <span class="workout__icon">${
          workout.type === `jogging` ? `🏃‍♂️` : `🚴‍♀️`
        }</span>
        <span class="workout__value">${workout.distance}</span>
        <span class="workout__unit">km</span>
      </div>
      <div class="workout__details">
        <span class="workout__icon">⏱</span>
        <span class="workout__value">${workout.duration}</span>
        <span class="workout__unit">min</span>
      </div>`;
    if (workout.type === `jogging`)
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
      </div>
    </li>`;
    if (workout.type === `biking`)
      html += `
      <div class="workout__details">
        <span class="workout__icon">⚡️</span>
        <span class="workout__value">${workout.speed.toFixed(1)}</span>
        <span class="workout__unit">km/h</span>
      </div>
      <div class="workout__details">
        <span class="workout__icon">⛰</span>
        <span class="workout__value">${workout.elevationGain}</span>
        <span c lass="workout__unit">m</span>
      </div>
    </li>`;
    form.insertAdjacentHTML(`afterend`, html);

    //ability to delete
    const deleteBtn = document.querySelector(`.workout__cancel`);
    deleteBtn.addEventListener(`click`, this.delete.bind(this));
  }
  _moveToPopup(e) {
    const workoutEL = e.target.closest(`.workout`);
    if (!workoutEL) return;
    const workout = this.#workouts.find(
      work => work.id === workoutEL.dataset.id
    );
    this.#map.setView(workout.coords, this.#mapZoomLevel, {
      animate: true,
      pan: {
        duration: 1,
      },
    });
  }
  _setLocalStorage() {
    localStorage.setItem(`workouts`, JSON.stringify(this.#workouts));
  }
  _getLocalStorage() {
    const data = JSON.parse(localStorage.getItem(`workouts`));
    if (!data) return;
    this.#workouts = data;
    this.#workouts.forEach(work => this._renderWorkout(work));
  }

  delete(e) {
    const workoutEl = e.target.closest(`.workout`);
    if (!workoutEl) return;

    console.log(workoutEl);
    const workout = this.#workouts.find(
      work => work.id === workoutEl.dataset.id
    );
    console.log(workoutEl, workout);

    const index = this.#workouts.indexOf(workout);
    console.log(index);
    this.#workouts.splice(index, 1);

    this._setLocalStorage();
    location.reload();
  }
  appear() {
    if (this.#workouts.length === 0) {
      resetBtn.style.display = `none`;
    } else {
      resetBtn.style.display = `block`;
    }
  }
  reset() {
    localStorage.removeItem(`workouts`);
    location.reload();
    this.appear();
  }
}

const app = new App();
