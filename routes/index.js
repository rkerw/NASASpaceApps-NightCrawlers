const express = require('express');
const path = require('path');
const sendUserEmail = require('./emailSetup');
const landsatModule = require('./landsat');
const getLandsatDataFromBackendAPI = landsatModule.getLandsatDataFromBackendAPI;
const getLandsatGridDataFromBackendAPI = landsatModule.getLandsatGridDataFromBackendAPI;
const testDB = require('./setupDB');
const subscribeToNotif = require('./setupDB');
const router = express.Router();

router.use(express.json());  // Parse incoming json

// Serve the index.html file for the root route
router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/index.html'));
});

router.get('/credits', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/credits.html'));
});

router.post('/email-notification', (req, res) => {
  const data = req.body;
  // add to db
  result = subscribeToNotif(data.path, data.row, data.email);
  // send welcome email
  sendUserEmail(data.email, data.path, data.row);
  res.send(JSON.stringify({success:result}));
});

router.post('/test-db', (req, res) => {
  const data = req.body;
  result = testDB();
  res.send(JSON.stringify({success:result}));
});

router.post('/landsat-data-grid', async (req, res) => {
  const locationAndTimeData = req.body;
  result = await getLandsatGridDataFromBackendAPI(locationAndTimeData);
  res.send(result);
});
router.post('/landsat-data', async (req, res) => {
  const locationAndTimeData = req.body;
  result = await getLandsatDataFromBackendAPI(locationAndTimeData);
  res.send(result);
});

module.exports = router;