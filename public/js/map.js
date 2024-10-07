let map;
let geolocPin;
let offcanvasElement = document.getElementById('offcanvasMoreInfo');
let landsatPixel = [];
let currentImageOverlay = []; //only one image overlay
let pin;  // Only one pin can exist at a time


offcanvasElement.addEventListener('show.bs.offcanvas', function () {
  document.getElementById('searchForm').classList.remove('offset-inactive');
  document.getElementById('searchForm').classList.add('offset-active');
});

offcanvasElement.addEventListener('hide.bs.offcanvas', function () {
  document.getElementById('searchForm').classList.remove('offset-active');
  document.getElementById('searchForm').classList.add('offset-inactive');
});

var gridToggle = false;

const gridbtn = document.getElementById("getGrid")
function togglegrid() {

    gridbtn.disabled = true;
    map.setZoom(6);
    if (gridToggle == false) {
        imagebtn.disabled = true;
        setTimeout(()=>{
        gridbtn.disabled = false}, 3000)

        
        setTimeout(()=>{
        imagebtn.disabled = false}, 5000)
    }else{
        setTimeout(()=>{
        gridbtn.disabled = false}, 1000)
    }


        gridToggle ? hideGrid() : Showgrid();
        gridToggle = !gridToggle;
}

async function Showgrid(){

    var location = pin.getPosition();
    console.log("Location: ", location.lat(), location.lng());
    var landsatDataGrid = await getLandsatDataGrid(location);
    console.log("Landsat Data Grid: ", landsatDataGrid);
    for (var i = 0; i < landsatDataGrid.length; i++) {
      drawOverlay(landsatDataGrid[i], i);
    }
    document.getElementById("metaTitleSingle").setAttribute("style", "display: none;");
    document.getElementById("metaTitleGrid").setAttribute("style", "display: block;");
}

async function hideGrid(){
    await clearAllBoxesAndPolygons();
    document.getElementById("metaTitleSingle").setAttribute("style", "display: block;");
    document.getElementById("metaTitleGrid").setAttribute("style", "display: none;");
    console.log("hiding grid");
    dropPin(pinlocation);

}


document.getElementById('getFilteredData').addEventListener('click', async function (event) {
  //stop refresh
  event.preventDefault();
  var location = pin.getPosition();
  var cloudCover = document.getElementById('cloudCover').value;
  var startDate = document.getElementById('startdate').valueAsDate;
  var endDate = document.getElementById('enddate').valueAsDate;
  console.log("Location: ", location.lat(), location.lng());
  console.log("Cloud Cover: ", cloudCover);
  console.log("Start Date: ", startDate);
  console.log("End Date: ", endDate);
  var landsatDataFiltered = await getLandsatData(location, startDate, endDate, cloudCover);
  // console.log("Landsat Data Filtered: ", landsatDataFiltered);
  drawOverlay(landsatDataFiltered, 0);
});
async function initMap() {

  const { Map } = await google.maps.importLibrary("maps");
  map = new Map(document.getElementById("map"), {
    center: { lat: 45.5019, lng: -73.5674 },
    zoom: 5,
  });
  map.setOptions({ disableDefaultUI: true }); // Remove the UI cause we don't really need it
  const geoImg = {
    url: '../images/location-icon.png',
    anchor: new google.maps.Point(15, 15),
  };
  geolocPin = new google.maps.Marker({
    map: map,
    icon: geoImg,
  });
  geolocPin.setVisible(false);
  geolocateUser();
  google.maps.event.addListener(geolocPin, 'click', function (event) {
    var location = geolocPin.getPosition();
    dropPin(location);
  });
  // Allows placing a marker when the map is clicked
  google.maps.event.addListener(map, 'click', function (event) {
    dropPin(event.latLng);
  });
  if (typeof initAutocomplete === 'function') {
    initAutocomplete();
  } else {
    console.error("initAutocomplete function not found!");
  }
  //init class
  class USGSOverlay extends google.maps.OverlayView {
    bounds;
    image;
    div;
    constructor(bounds, image) {
      super();
      this.bounds = bounds;
      this.image = image;
    }
    onAdd() {
      this.div = document.createElement("div");
      this.div.style.borderStyle = "none";
      this.div.style.borderWidth = "0px";
      this.div.style.position = "absolute";

      // Create the img element and attach it to the div.
      const img = document.createElement("img");

      img.src = this.image;
      img.style.width = "100%";
      img.style.height = "100%";
      img.style.position = "absolute";
      this.div.appendChild(img);

      // Add the element to the "overlayLayer" pane.
      const panes = this.getPanes();

      panes.overlayLayer.appendChild(this.div);
    }
    draw() {
      // We use the south-west and north-east
      // coordinates of the overlay to peg it to the correct position and size.
      // To do this, we need to retrieve the projection from the overlay.
      const overlayProjection = this.getProjection();
      // Retrieve the south-west and north-east coordinates of this overlay
      // in LatLngs and convert them to pixel coordinates.
      // We'll use these coordinates to resize the div.
      const sw = overlayProjection.fromLatLngToDivPixel(
        this.bounds.getSouthWest(),
      );
      const ne = overlayProjection.fromLatLngToDivPixel(
        this.bounds.getNorthEast(),
      );

      // Resize the image's div to fit the indicated dimensions.
      if (this.div) {
        this.div.style.left = sw.x + "px";
        this.div.style.top = ne.y + "px";
        this.div.style.width = ne.x - sw.x + "px";
        this.div.style.height = sw.y - ne.y + "px";
      }
    }
    onRemove() {
      if (this.div) {
        this.div.parentNode.removeChild(this.div);
        delete this.div;
      }
    }
  }
  window.USGSOverlay = USGSOverlay;
}



document.getElementById("geolocBtn").addEventListener('click', function (event) {
  geolocateUser();
});

function geolocateUser() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {
      var currPos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
      geolocPin.setPosition(currPos);
      geolocPin.setVisible(true);
      map.panTo(geolocPin.position);
      // zoom also?
    }, function () { 
      // Geolocation failed?
    })
  }
}

// Function to show the alert and hide it after 3 seconds
function showAlert() {
    const alertElement = document.getElementById('customAlert');
    alertElement.classList.add('show'); // Add 'show' class to make the alert visible

    // Automatically hide the alert after 2 seconds (2000 ms)
    setTimeout(() => {
      hideAlert();
    }, 2000);
  }

  // Function to hide the alert
  function hideAlert() {
    const alertElement = document.getElementById('customAlert');
    alertElement.classList.remove('show'); // Remove 'show' class to hide the alert
  }

var imageLoaded;

const imagebtn = document.getElementById("toggleImage")
function ImagetoggleFunction() {

    imagebtn.disabled = true;
    if (imageToggle == false) {
        setTimeout(()=>{
            imagebtn.disabled = false}, 500)
    }else{
        setTimeout(()=>{
            imagebtn.disabled = false}, 500)
    }

    if (imageLoaded){
        imageToggle ? TurnOffOverlay_ShowImage() : TurnOnOverlay_HideImage();
        imageToggle = !imageToggle;
    }else{
        showAlert();
    }
}

function TurnOffOverlay_ShowImage() {
  for (var i = 0; i < landsatPixel.length; i++) {
    if(landsatPixel[i] != null){
      landsatPixel[i].setMap(null);
    }
  }
  for (var i = 0; i < currentImageOverlay.length; i++) {
    if(currentImageOverlay[i] != null){
      currentImageOverlay[i].setMap(map);
    }
  }
}

function TurnOnOverlay_HideImage() {
  for (var i = 0; i < landsatPixel.length; i++) {
    if(landsatPixel[i] != null){
      landsatPixel[i].setMap(map);
    }
  }
  for (var i = 0; i < currentImageOverlay.length; i++) {
    if(currentImageOverlay[i] != null){
      currentImageOverlay[i].setMap(null);
    }
  }

}

var imageToggle;

// var landsatDataGrid;
var landsatData;

var pinlocation;

async function dropPin(location) {
    gridbtn.disabled = true;
    imagebtn.disabled = true;
        setTimeout(()=>{
        imagebtn.disabled = false
        gridbtn.disabled = false}, 2000)

    pinlocation = location;

    document.getElementById("offcnvToggle").setAttribute("style", "display: block;");

  await clearAllBoxesAndPolygons();

  imageLoaded = false;
  imageToggle = true;
  
  if (pin != null) {
    pin.setMap(null);
  }
  pin = new google.maps.Marker({  // Replace this with AdvancedMarkerElement once we have the mapID
    position: location,
    map: map,
  });
  landsatData = await getLandsatData(location, null, null, null);
  var path = landsatData.data.results[0].metadata[2].value
  var row = landsatData.data.results[0].metadata[3].value
  drawOverlay(landsatData, 0);
  document.getElementById("userEmailSubmit").setAttribute("path", path)
  document.getElementById("userEmailSubmit").setAttribute("row", row)
  document.getElementById("latitudeDisplay").textContent = location.lat();
  document.getElementById("longitudeDisplay").textContent = location.lng();

  const contentString = `
        <div>
            <h3>Satellite Image found</h3>
            <button class="btn btn-sm btn-outline-primary" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasMoreInfo" id="moreInfoButton">
                More Info
            </button>
        </div>
        `
  const infoWindow = new google.maps.InfoWindow({
    content: contentString,
  });
  infoWindow.open({ anchor: pin })
  map.panTo(pin.position);
  map.setZoom(8) 
  google.maps.event.addListener(pin, 'click', function (event) {
    infoWindow.open({ anchor: pin })
  });
  const offcanvas = new bootstrap.Offcanvas(document.getElementById('offcanvasMoreInfo'));
  offcanvas.show();
}

async function searchPin(location) {

    gridbtn.disabled = true;
    imagebtn.disabled = true;
        setTimeout(()=>{
        imagebtn.disabled = false
        gridbtn.disabled = false}, 2000)

    pinlocation = location;

    document.getElementById("offcnvToggle").setAttribute("style", "display: block;");

  await clearAllBoxesAndPolygons();

  imageToggle = true;
  imageLoaded = false;

  if (pin != null) {
    pin.setMap(null);
  }
  pin = new google.maps.Marker({
    position: location,
    map: map,
  });
  var landsatData = await getLandsatData(location, null, null, null);
  var path = landsatData.data.results[0].metadata[2].value
  var row = landsatData.data.results[0].metadata[3].value
  drawOverlay(landsatData, 0);
  map.panTo(location);
  const moreInfoButton = document.getElementById("userEmailSubmit");
  moreInfoButton.setAttribute("pinLat", location.lat());
  moreInfoButton.setAttribute("pinLng", location.lng());
  moreInfoButton.setAttribute("path", path);
  moreInfoButton.setAttribute("row", row);
  document.getElementById("latitudeDisplay").textContent = location.lat();
  document.getElementById("longitudeDisplay").textContent = location.lng();

  const offcanvas = new bootstrap.Offcanvas(document.getElementById('offcanvasMoreInfo'));
  offcanvas.show();
  document.getElementById("pac-input").value = "";

}

async function clearAllBoxesAndPolygons() {
  if(landsatPixel.length > 0){
    for (var i = 0; i < landsatPixel.length; i++) {
      landsatPixel[i].setMap(null);
    }
  }
  landsatPixel = [];
  if(currentImageOverlay.length > 0){
    for (var i = 0; i < currentImageOverlay.length; i++) {
      currentImageOverlay[i].setMap(null);
    }
  }
  currentImageOverlay = [];
}

async function getLandsatData(location, start, end, cloudCover) {
  
    function formatDate(date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }
  
    var startDate;
    var endDate;
    // Get the current date
    if (start == null) {
      startDate = new Date();
      startDate.setDate(startDate.getDate() - 30); // 30 days in the past
    } else {
      startDate = start
    }
    if (end == null) {
      endDate = new Date();
      endDate.setDate(endDate.getDate() + 10); // 10 days in the future
    } else {
      endDate = end
    }
  
    // Format the dates
    const formattedStartDate = formatDate(startDate);
    const formattedEndDate = formatDate(endDate);
  
    var locationAndDate = {
      lat: location.lat(),
      lng: location.lng(),
      startdate: formattedStartDate,
      enddate: formattedEndDate,
      cloud: cloudCover,
    };
  
    console.log("before getLandsatData called");
    const response = await fetch('/landsat-data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(locationAndDate)
    })
    const responseData = await response.json();
    console.log(responseData);
    console.log("GOT OSMETHING!");
    document.getElementById("CCDisplay").textContent = responseData.data.results[0].cloudCover + "%";
    document.getElementById("ImageDateDisplay").textContent = responseData.data.results[0].publishDate;
    return responseData;
  }

async function getLandsatDataGrid(location, start, end, cloudCover) {

  function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  var startDate;
  var endDate;
  // Get the current date
  if (start == null) {
    startDate = new Date();
  } else {
    startDate = start
  }
  if (end == null) {
    endDate = new Date();
  } else {
    endDate = start
  }
  startDate.setDate(endDate.getDate() - 30); // 30 days in the past
  endDate.setDate(endDate.getDate() + 10); // 10 days in the future

  // Format the dates
  const formattedStartDate = formatDate(startDate);
  const formattedEndDate = formatDate(endDate);

  var locationAndDate = {
    lat: location.lat(),
    lng: location.lng(),
    startdate: formattedStartDate,
    enddate: formattedEndDate,
    cloud: cloudCover
  };

  console.log("before getLandsatGridData called");
  const response = await fetch('/landsat-data-grid', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(locationAndDate)
  })
  const responseData = await response.json();
  console.log(responseData);
  console.log("GOT OSMETHING!");
  return responseData;
}

async function processImage(imageUrl) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "Anonymous"; // Handle CORS if needed
    img.src = imageUrl;

    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = img.width;
      canvas.height = img.height;

      // Draw the image on the canvas
      ctx.drawImage(img, 0, 0);

      // Get image data
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      // Loop through the pixels and make the black corners transparent
      for (let y = 0; y < canvas.height; y++) {
        for (let x = 0; x < canvas.width; x++) {
          const index = (y * canvas.width + x) * 4;

          // Check if the pixel is black (or near black)
          const thresh = 15;
          if (data[index] < thresh && data[index + 1] < thresh && data[index + 2] < thresh) {
            data[index + 3] = 0; // Set alpha to 0 (transparent)
          }
        }
      }

      // Put the modified image data back onto the canvas
      ctx.putImageData(imageData, 0, 0);

      // Resolve with the data URL of the modified image
      resolve(canvas.toDataURL());
    };

    img.onerror = (error) => {
      reject(error);
    };
  });
}

async function drawOverlay(landsatData, index) {
  if (landsatPixel[index] != null) {
    landsatPixel[index].setMap(null);
  }
  if (currentImageOverlay[index] != null) {
    currentImageOverlay[index].setMap(null);
  }

  
  const squareCoords = landsatData.data.results[0].spatialCoverage.coordinates[0];
  const landsatPixelCoords = squareCoords.map(([lng, lat]) => ({
    lat: lat,
    lng: lng,
  }));

  landsatPixel[index] = new google.maps.Polygon({
    paths: landsatPixelCoords,
    strokeColor: "#0d6efd",
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: "#0d6efd",
    fillOpacity: 0.35,
  });
  landsatPixel[index].setMap(map);

  // Extract southwest and northeast coordinates for image overlay
  const southwest = landsatData.data.results[0].spatialBounds.coordinates[0][0];
  const northeast = landsatData.data.results[0].spatialBounds.coordinates[0][2];

  // Create LatLngBounds
  const bounds = new google.maps.LatLngBounds(
    new google.maps.LatLng(southwest[1], southwest[0]),
    new google.maps.LatLng(northeast[1], northeast[0])
  );

  // Get the image URL for the overlay
  const imageURL = landsatData.data.results[0].browse[0].browsePath;
  const processIMG = await processImage(imageURL);

  // **Instantiate USGSOverlay Here**
  currentImageOverlay[index] = new USGSOverlay(bounds, processIMG);
  currentImageOverlay[index].setMap(null); //This is originally set to null, but image will show once toggle button is clicked
  imageLoaded = true;  

}
