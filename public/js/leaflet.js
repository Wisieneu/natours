// Get locations from HTML

export const displayMap = (locations) => {
  // Create the map and attach it to the #map element
  mapboxgl.accessToken =
    'pk.eyJ1Ijoid2lzaWUiLCJhIjoiY2xraDR3MXZiMDZqOTNybzRjeTdmbnBxMyJ9.UuMU5NB05zWI79T_Rx7Y2A';
  const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/wisie/clki8w0fj00a901pbhgwi14z0',
    scrollZoom: false,
  });

  const bounds = new mapboxgl.LngLatBounds();

  locations.forEach((location) => {
    // Create marker
    const el = document.createElement('div');
    el.className = 'marker';

    // Customize marker and add to map
    new mapboxgl.Marker({
      element: el,
      anchor: 'bottom',
    })
      .setLngLat(location.coordinates)
      .addTo(map);

    // Add onclick popup
    new mapboxgl.Popup({ offset: 35 })
      .setLngLat(location.coordinates)
      .setHTML(`<p>Day ${location.day}: ${location.description} </p>`)
      .addTo(map);

    bounds.extend(location.coordinates);
  });

  map.fitBounds(bounds, {
    padding: {
      top: 200,
      bottom: 150,
      left: 100,
      right: 100,
    },
  });
};
