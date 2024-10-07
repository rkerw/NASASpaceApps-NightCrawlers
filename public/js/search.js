document.getElementById('searchForm').addEventListener('submit', function(event) {
  event.preventDefault(); 
});

document.getElementById('pac-input').addEventListener('keydown', function(event) {
  if (event.key === 'Enter') {
    event.preventDefault();
  }
});

function initAutocomplete() {
  const input = document.getElementById("pac-input");
  const searchBox = new google.maps.places.SearchBox(input);

  // Update the search box bounds to match the map's bounds
  map.addListener("bounds_changed", () => {
    searchBox.setBounds(map.getBounds());
  });

  // Listener for when places are selected
  searchBox.addListener("places_changed", () => {
    const places = searchBox.getPlaces();

    // Return if no places found
    if (places.length == 0) {
      return;
    }

    const bounds = new google.maps.LatLngBounds();

    // Only process the first valid place with geometry
    const firstPlace = places[0];
    if (!firstPlace.geometry || !firstPlace.geometry.location) {
      console.log("Returned place contains no geometry");
      return;
    }

    // Get the location and process the first valid place
    const location = firstPlace.geometry.location;
    searchPin(location);  // Call your function to drop a pin or handle the place

    // Update the bounds based on the place's viewport or location
    if (firstPlace.geometry.viewport) {
      bounds.union(firstPlace.geometry.viewport);
    } else {
      bounds.extend(firstPlace.geometry.location);
    }
    // Fit the map to the new bounds
    map.fitBounds(bounds);
  });
}

window.initAutocomplete = initAutocomplete;