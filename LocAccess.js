const mobSlider = document.getElementById('mobile-menu-slider');
const mobOverlay = document.getElementById('menu-overlay');

// Initialize map with default view
let map = L.map('map').setView([51.505, -0.09], 13); // Default view set to London
let marker; // To store the draggable marker
let isSatellite = false; // Track satellite view toggle
let selectedLocation = null; // Store selected location for setting later
let locationLayer; // Layer for the tile view

// Standard tile layer
let standardLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
}).addTo(map);

// Satellite tile layer with labels for area names
let satelliteLayer = L.layerGroup([
    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 19,
        attribution: '© Esri'
    }),
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { // Adding labels from OSM
        maxZoom: 19,
        attribution: '© OpenStreetMap'
    })
]);

// Get current location using geolocation API
navigator.geolocation.getCurrentPosition(function (position) {
    const lat = position.coords.latitude;
    const lng = position.coords.longitude;
    map.setView([lat, lng], 13);
    addMarker(lat, lng);
    updateLocationText(lat, lng);
});

// Add draggable marker to the map
function addMarker(lat, lng) {
    if (marker) {
        map.removeLayer(marker);
    }
    marker = L.marker([lat, lng], { draggable: true }).addTo(map);

    // On marker drag, update location
    marker.on('dragend', function (event) {
        const newLat = event.target.getLatLng().lat;
        const newLng = event.target.getLatLng().lng;
        updateLocationText(newLat, newLng);
    });

    // Move marker to the clicked location
    map.on('click', function (e) {
        const clickLat = e.latlng.lat;
        const clickLng = e.latlng.lng;
        marker.setLatLng([clickLat, clickLng]);
        updateLocationText(clickLat, clickLng);
    });
}


// Function to update location text with a simplified address format
function updateLocationText(lat, lng) {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            const address = data.address;

            // Simplifying the address extraction
            const locationComponents = [];
            if (address.road) locationComponents.push(address.road); // Street
            if (address.neighbourhood) locationComponents.push(address.neighbourhood); // Neighbourhood
            if (address.suburb) locationComponents.push(address.suburb); // Suburb
            if (address.city) locationComponents.push(address.city); // City
            if (address.state) locationComponents.push(address.state); // State
            if (address.country) locationComponents.push(address.country); // Country

            // Join the components to form a clearer address
            const fullAddress = locationComponents.join(', ');

            // Truncate for display purposes, ensuring clarity
            const shortAddress = truncateText(fullAddress, 24); // Limit to 24 characters with ellipsis

            // Display the truncated location on the frontend
            document.getElementById('current-location').textContent = shortAddress;
            document.getElementById('cur-loc').textContent = shortAddress;

            selectedLocation = { lat, lng, fullAddress }; // Save selected location
        })
        .catch(error => console.error('Error fetching location data:', error));
}

// Helper function to truncate text and add '...'
function truncateText(text, maxLength) {
    if (text.length > maxLength) {
        return text.substring(0, maxLength - 3) + '...'; // Subtract 3 to account for '...'
    }
    return text;
}


// Event listener to show the map modal
document.getElementById('show-map').addEventListener('click', function () {
    document.getElementById('map-modal').style.display = 'block';
    map.invalidateSize(); // Fix map size issue when modal opens
});
// Event listener to show the map modal
document.getElementById('show-mapMob').addEventListener('click', function () {
        mobSlider.classList.remove('mobile-menu-open');
        mobOverlay.classList.remove('overlay-active');
    document.getElementById('map-modal').style.display = 'block';
    map.invalidateSize(); // Fix map size issue when modal opens
});


// Event listener to close the map modal
document.getElementById('close-map').addEventListener('click', function () {
    document.getElementById('map-modal').style.display = 'none';
});

// Event listener to toggle satellite view
document.getElementById('toggle-satellite').addEventListener('click', function () {
    if (isSatellite) {
        map.removeLayer(satelliteLayer);
        standardLayer.addTo(map);
        isSatellite = false;
    } else {
        map.removeLayer(standardLayer);
        satelliteLayer.addTo(map);
        isSatellite = true;
    }
});

// Event listener to set the location and close the modal
document.getElementById('set-location').addEventListener('click', function () {
    if (selectedLocation) {
        document.getElementById('current-location').textContent = selectedLocation.fullAddress;
        document.getElementById('cur-loc').textContent = selectedLocation.fullAddress;
        document.getElementById('map-modal').style.display = 'none';
    } else {
        alert('Please select a location first!');
    }
});

// Event listener to search location by user input
document.getElementById('search-map').addEventListener('click', function () {
    const query = document.getElementById('map-search').value;
    const searchUrl = `https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=1`;

    fetch(searchUrl)
        .then(response => response.json())
        .then(data => {
            if (data.length > 0) {
                const lat = data[0].lat;
                const lng = data[0].lon;
                map.setView([lat, lng], 13);
                addMarker(lat, lng);
                updateLocationText(lat, lng);
            } else {
                alert('Location not found. Please try a different search term.');
            }
        })
        .catch(error => console.error('Error searching location:', error));
});
