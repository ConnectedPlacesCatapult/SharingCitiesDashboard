module.exports = {

  // root uri of the API
  apiRoot: `${process.env.NODE_HOST}${process.env.API_PORT}`,
  //apiRoot: "http://192.168.0.12:5000",

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
    secondary: {
      //light: "#FC554B",
      main: "#D54A44",
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
