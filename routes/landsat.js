
var LOGIN_TOKEN = "";

async function getLandsatLoginToken() {

  const loginRequestHeaders = new Headers();
  loginRequestHeaders.append("Content-Type", "application/json");

  const loginRequestBody = JSON.stringify({
    "username": "OUR_APPLICATION_USERNAME",
    "token": "OUR_APPLICATION_TOKEN"
  });

  const requestOptionsForLogin = {
    method: "POST",
    headers: loginRequestHeaders,
    body: loginRequestBody,
    redirect: "follow"
  };

  const response = await fetch("USGS_EARTH_EXPLORER_ACCESS_LINK", requestOptionsForLogin)
  const responseData = await response.json();
  LOGIN_TOKEN = responseData.data;
}

async function getLandsatDataFromFetchAPI(locationAndTimeData) {
  const landsatDataRequestHeaders = new Headers();
  landsatDataRequestHeaders.append("Content-Type", "application/json");
  landsatDataRequestHeaders.append("X-Auth-Token", LOGIN_TOKEN);

  let cloudCoverMax = locationAndTimeData.cloud;
  if(cloudCoverMax == null) {
    cloudCoverMax = 100;
  }

  const landsatDataRequestBody = JSON.stringify({
    "maxResults": 1,
    "datasetName": "landsat_ot_c2_l2",
    "sceneFilter": {
      "ingestFilter": null,
      "spatialFilter": {
        "filterType": "mbr",
        "lowerLeft": {
          "latitude": locationAndTimeData.lat,
          "longitude": locationAndTimeData.lng,
        },
        "upperRight": {
          "latitude": locationAndTimeData.lat,
          "longitude": locationAndTimeData.lng,
        }
      },
      "metadataFilter": null,
      "cloudCoverFilter": {
        "max": cloudCoverMax,
        "min": 0,
        "includeUnknown": true
      },
      "acquisitionFilter": {
        "end": locationAndTimeData.enddate,
        "start": locationAndTimeData.startdate
      }
    },
    "bulkListName": "my_bulk_list",
    "metadataType": "summary",
    "orderListName": "my_order_list",
    "startingNumber": 1,
    "compareListName": "my_comparison_list",
    "excludeListName": "my_exclusion_list"
  });

  const requestOptionsForLandsatData = {
    method: "POST",
    headers: landsatDataRequestHeaders,
    body: landsatDataRequestBody,
    redirect: "follow"
  };

  const response = await fetch("USGS_SCENE_SEARCH_LINK", requestOptionsForLandsatData)
  const responseData = await response.json();
  return responseData;
}

async function getLandsatGridDataFromBackendAPI(locationAndTimeData) {
  if (LOGIN_TOKEN == null || LOGIN_TOKEN == "") {
    await getLandsatLoginToken();
  }
  var response = await getLandsatDataFromFetchAPI(locationAndTimeData);
  if (response.errorCode != null) {
    console.log("Error code not null - ", response);
    await getLandsatLoginToken();
    console.log("Got new login token, cus it expired");
    response = await getLandsatDataFromFetchAPI(locationAndTimeData);
  }
  

  //Create GRID

  const resultdatagrid = [];

  response_coordinates = response.data.results[0].spatialCoverage.coordinates[0];

  const upperRightLat = response_coordinates[0][1];
  const upperRightLon = response_coordinates[0][0];
  const lowerLeftLat = response_coordinates[2][1];
  const lowerLeftLon = response_coordinates[2][0];

  const centerLat = ((upperRightLat + lowerLeftLat) / 2);
  const centerLon = ((upperRightLon + lowerLeftLon) / 2);

  let deltaLat = Math.abs(upperRightLat - lowerLeftLat);
  let deltaLon = Math.abs(upperRightLon - lowerLeftLon);

  const gridCenters = [];
  for (let i = -1; i <= 1; i++) {  // Latitude shifts (-1, 0, 1)
    for (let j = -1; j <= 1; j++) {  // Longitude shifts (-1, 0, 1)
        let newLat = centerLat + (i * deltaLat);
        let newLon = centerLon + (j * deltaLon);
        var temporaryLocationAndTimeData = {
          lat: newLat,
          lng: newLon,
          startdate: locationAndTimeData.startdate,
          enddate: locationAndTimeData.enddate,
          cloud: locationAndTimeData.cloud
        };
        gridCenters.push(temporaryLocationAndTimeData);
    }
  }

//   console.log("Grid centers", gridCenters);  

  for (let i = 0; i < gridCenters.length; i++) {
    const response = await getLandsatDataFromFetchAPI(gridCenters[i]);
    resultdatagrid.push(response);
  }  

  return resultdatagrid;

}

async function getLandsatDataFromBackendAPI(locationAndTimeData) {
    if (LOGIN_TOKEN == null || LOGIN_TOKEN == "") {
      await getLandsatLoginToken();
    }
    var response = await getLandsatDataFromFetchAPI(locationAndTimeData);
    if (response.errorCode != null) {
      console.log("Error code not null - ", response);
      await getLandsatLoginToken();
      console.log("Got new login token, cause it expired");
      response = await getLandsatDataFromFetchAPI(locationAndTimeData);
    }
    return response;
  }

module.exports = {
    getLandsatDataFromBackendAPI,
    getLandsatGridDataFromBackendAPI
};
