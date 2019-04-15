module.exports = {

  // root uri of the API
  apiRoot: "http://localhost:5000",
  //apiRoot: "http://192.168.0.12:5000",

  // overrides for MaterialUI default theme

  // header: dbecea
  // header menu: e9f4f4
  // background: f1f1f2
  // card: ffffff

  localeThemeData: {
    palette: {
      type: "dark",
      primary: {
        light: "#cceae7",
        main: "#81cfc7",
        dark: "#34b0a4",
      },
      secondary: {
        //light: "#FC554B",
        main: "#df685d",
        //dark: "#AE3C38",
      },
      tertiary: {
        main: "#535460",
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
        paper: "#ffffff",
        default: "#f1f1f2",
        light: "#fcfcfc",
      }
    },
    typography: {
      useNextVariants: true, // to avoid deprecation warnings
      fontFamily: "'BrandonText', 'Roboto', 'Helvetica', 'Arial', sans-serif",
    },
    // shadows: Array(2).fill('0px 2px 5px 0px #d6d6d6')
    shadows: [
      "none",
      "0px 2px 5px 0px #d6d6d6",
      "0px 2px 5px 0px #d6d6d6",
    ],
  },

  // currently used by the common/Header component to define links
  routes: [
    {
      path: "/",
      exact: true,
      component: "DashboardPage",
      name: "Dashboard",
      roles: []
    },
    {
      path: "/data",
      exact: false,
      component: "DataPage",
      name: "Data Tools",
      roles: []
    },
    {
      path: "/admin",
      exact: false,
      component: "AdminPage",
      name: "Admin",
      roles: ["admin"]
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
    mapTooltipFields: ["Value"],
    mapZoom: 13,
    plotMarker: "point",
    widgetName: "New Widget",
    widgetDescription: "",
    widgetType: "plot",
    widgetWidth: 200,
    widgetHeight: 200,
    widgetIsStatic: false,
  },
  dataTableDefaults: {
    order: 'desc',
    orderBy: 'Timestamp',
    rowsPerPage: 20,
  },
  editorSettings: {
    widget: {
      height: {
        default: 300,
        max: 600,
        min: 120,
      },
      width: {
        default: 300,
        max: 600,
        min: 120,
      },
    },
  },
  editorDefaultConfig: {
    plot: {
      data: {
        values: [],
      },
      spec: {
        "$schema": "https://vega.github.io/schema/vega-lite/v3.json",
        "autosize": {
          "type": "fit",
          "resize": true,
          "contains": "content"
        },
        "data": {
          "values": []
        },
        "mark": "point",
        "encoding": {
          "x": {
            "field": "Timestamp",
            "type": "temporal"
          },
          "y": {
            "field": "Value",
            "type": "quantitative",
            "aggregate": "mean"
          },
          "color": {
            "field": "Attribute_Name",
            "type": "nominal"
          }
        }
      },
    },
    map: {
      circleRadius: 10,
    }
  },
};