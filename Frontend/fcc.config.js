module.exports = {

  // root uri of the API
  // apiRoot: "http://35.197.238.123/api",
  apiRoot: "http://127.0.0.1:8000/",

  // optionally include localisation stylesheet (good for @font-face stuff)
  localeStyleSheet: "./styles/lisbon.css",

  // overrides for MaterialUI default theme
  localeThemeData: {
    palette: {
      type: "dark",
      primary: {
        //light: "#d3edea",
        main: "#81cfc7",
        //dark: "#32b1a4",
      },
      secondary: {
        //light: "#FC554B",
        main: "#D54A44",
        //dark: "#AE3C38",
      },
      success: {
        main: '#4CAF50',
      },
      danger: {
        main: '#ff5722',
      },
      info: {
        main: '#81cfc7',
      },
      disabled: {
        main: '#828282',
      },
      background: {
        paper: "#313443",
        default: "#42465a",
      }
    },
    typography: {
      useNextVariants: true, // to avoid deprecation warnings
      fontFamily: "'BrandonText', 'Roboto', 'Helvetica', 'Arial', sans-serif",
    },
  },

  // currently used by the common/Header component to define links
  routes: [
    {
      path: "/",
      exact: true,
      component: "DashboardPage",
      name: "Dashboard",
    },
    {
      path: "/data",
      exact: false,
      component: "DataPage",
      name: "Data Tools",
    },
    {
      path: "/admin",
      exact: false,
      component: "AdminPage",
      name: "Admin",
    },
  ],

  // tileLayers to be made available in OpenMap widgets
  leafletTileLayers: [
    {
      name: "OpenStreetMap.Mapnik",
      url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    },
    {
      name: "CartoDB.DarkMatter",
      url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
    },
    {
      name: "Esri.WorldImagery",
      url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
    },
  ],
  widgetEditorDefaults: {
    mapCenter: {
      lat: 51.505,
      lng: -0.09,
    },
    mapMarkerAttribute: "Value",
    mapMarkerColor: "rgba(213, 74, 68, 0.8)",
    mapMarkerRadius: 10,
    mapShowHeatmap: false,
    mapTileLayer: "CartoDB.DarkMatter",
    mapZoom: 13,
    plotMarker: "point",
    widgetName: "New Widget",
    widgetType: "plot",
  },
  dataTableDefaults: {
    order: 'desc',
    orderBy: 'Timestamp',
    rowsPerPage: 20,
  },
};
