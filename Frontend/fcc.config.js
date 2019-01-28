module.exports = {

  // root uri of the API
  apiRoot: "http://172.16.2.123:5000/data",

  // optionally include localisation stylesheet (good for @font-face stuff)
  localeStyleSheet: "./styles/lisbon.css",

  // overrides for MaterialUI default theme
  // ToDo :: change palette type to 'dark' and update styles accordingly
  /*localeThemeData: {
    "palette": {
     //"type": "dark",
      "primary": {
        "light": "#d3edea",
        "main": "#81cfc7",
        "dark": "#32b1a4"
      },
      "secondary": {
        "light": "#FC554B",
        "main": "#D54A44",
        "dark": "#AE3C38"
      },
      "background": {
        "paper": "#313443",
        "default": "#42465a"
      }
    },
    "typography": {
      useNextVariants: true, // to avoid deprecation warnings
      "fontFamily": "'BrandonText', 'Roboto', 'Helvetica', 'Arial', sans-serif",
    }
  },*/

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
  vega: {
    schema: "https://vega.github.io/schema/vega-lite/v2.json",
    defaultWidth: 640,
    defaultHeight: 480,
    defaultPlotType: "bar",
  },
  widgetEditorDefaults: {
    plotType: "bar",
    mapCenter: {
      lat: 51.505,
      lng: -0.09,
    },
    mapShowHeatmap: false,
    mapTileLayer: "CartoDB.DarkMatter",
    mapZoom: 13,
    widgetName: "New Widget",
    widgetType: "plot",
  }
};
