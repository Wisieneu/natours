import { login } from './login';
import { displayMap } from './leaflet';

// DOM ELEMENTS
const leafletMap = document.getElementById('map');
const loginForm = document.querySelector('.form');

// VALUES

// DELEGATION
if (leafletMap) {
  const locations = JSON.parse(
    document.getElementById('map').dataset.locations
  );
  displayMap(locations);
}

if (loginForm) {
  loginForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
  });
}
