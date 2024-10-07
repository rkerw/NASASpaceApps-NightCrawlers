# [Project NightCrawlers](https://nasaspaceapps.up.railway.app)

![Project NightCrawlers](https://img.shields.io/badge/Status-In%20Development-brightgreen)

[![Node.js](https://img.shields.io/badge/Node.js-v16.0.0-green.svg)](https://nodejs.org/)
[![Google Maps API](https://img.shields.io/badge/Google%20Maps%20API-Beta-blue.svg)](https://developers.google.com/maps/documentation/javascript/overview)
[![Express.js](https://img.shields.io/badge/Express.js-4.x-brightgreen.svg)](https://expressjs.com/)
[![Firebase](https://img.shields.io/badge/Firebase-Realtime%20Database-orange.svg)](https://firebase.google.com/docs/database)
[![USGS Landsat API](https://img.shields.io/badge/USGS%20Landsat%20API-stable-blue.svg)](https://m2m.cr.usgs.gov/api/docs/json/)
[![WRS-2 Conversion Tool](https://img.shields.io/badge/WRS--2%20Conversion%20Tool-USGS-blue.svg)](https://landsat.usgs.gov/ard_tile)
[![landsatxplore](https://img.shields.io/pypi/v/landsatxplore.svg)](https://pypi.org/project/landsatxplore/)

---

This is a copy of our original working repository, since the original one had secret API keys so it could successfully automatically deploy on our hosting site from GitHub directly. You can access the original repo [here](https://github.com/silvehh/NasaSpaceApps) by requesting access from Amro at amro.atique[at]spaceconcordia[dot]com.
Navigate to [here](https://nasaspaceapps.up.railway.app/) to see a live version of our app!

---

<img width="958" alt="image" src="https://github.com/user-attachments/assets/91269888-6426-4125-9c0e-07207866ec7a">


## Project Overview

**Project NightCrawlers**, developed by a team of six students from Space Concordia's Spacecraft Division, addresses the **"Landsat Reflectance Data: On the Fly and at Your Fingertips"** challenge. This project aims to provide a scalable, web-based application that simplifies interaction with Landsat satellite data. 

The tool allows users to:
- **Define a target location on a map** through clicking or searching.
- **Overlay** the corresponding Landsat imagery on the map at scale.
- **Sign up to receive email notifications** when new data becomes available for a selected Landsat pixel location.
- **Filter Landsat images** by cloud coverage and date, ensuring users receive high-quality and relevant data.

### Key Features
- **Interactive Mapping System**: Built using the Google Maps API, users can pinpoint exact locations and access the corresponding Landsat images via the USGS API.
- **3x3 Grid of Landsat Pixels**: A 3x3 grid centered on the user-defined location, offering a broader view of the selected area, can be toggled on or off.
- **Advanced Filtering**: Users can filter data by cloud coverage (e.g., filtering out images with more than 60% cloud cover) and date range, enhancing the usability of the app.
  
### Future Enhancements
While the current version offers core functionalities, additional features are planned for future releases:
- **WRS-2 grid and Landsat SR Values**: These will be integrated to enhance data precision and usability.
- **Surface Temperature Data**: This feature will leverage Landsat's thermal infrared bands to display surface temperature data.
- **Email Notifications**: Receive alerts when Landsat satellites are planned to pass over your target location, ensuring timely updates.
- **Satellite Selection**: Choose between Landsat 8 or 9 datasets to suit your specific research needs.

---

### How It Works
Coordinate positions (latitude and longitude) are extracted when users drop a marker on the map. The most recent data for the Landsat pixel corresponding to these coordinates is then retrieved using the USGS API, which is then overlayed on the map.

Users can toggle a 3x3 grid of Landsat pixels on or off, along with satellite imagery corresponding to these pixels. Metadata for the selected area is displayed in the view pane. Using filters for cloud coverage and date ranges, specific data can be retireved by the user.

Additionally, the app includes the framework for a notification system to alert users when new data becomes available, ensuring continuous and up-to-date access to satellite imagery.

We used Firebase to store the email of anyone wanting updates when new data arrives for a particular Landsat pixel. The pixel's path and row are stored:
![image](https://github.com/user-attachments/assets/d54acd11-a4a7-4299-aed4-974a331baaab)

Automatic emails are sent out using SendGrid:
![image](https://github.com/user-attachments/assets/bf171a3f-0d78-44b3-86b0-be68b38da6a6)

Stay tuned for future updates as we continue to develop and refine Project NightCrawlers!

<img width="957" alt="image" src="https://github.com/user-attachments/assets/d4a08d6c-cb09-4197-aad9-8024c197e225">
