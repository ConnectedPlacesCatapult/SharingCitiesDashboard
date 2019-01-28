// attributes
export const FETCH_ATTRIBUTES = "FETCH_ATTRIBUTES";
export const FETCH_ATTRIBUTES_FULFILLED = "FETCH_ATTRIBUTES_FULFILLED";
export const FETCH_ATTRIBUTES_REJECTED = "FETCH_ATTRIBUTES_REJECTED";
export const TOGGLE_ATTRIBUTE_SELECTED = "TOGGLE_ATTRIBUTE_SELECTED";

// config
export const FETCH_CONFIG = "FETCH_CONFIG";
export const FETCH_CONFIG_FULFILLED = "FETCH_CONFIG_FULFILLED";
export const FETCH_CONFIG_REJECTED = "FETCH_CONFIG_REJECTED";

// data
export const FETCH_ATTRIBUTE_DATA = "FETCH_ATTRIBUTE_DATA";
export const FETCH_ATTRIBUTE_DATA_FULFILLED = "FETCH_ATTRIBUTE_DATA_FULFILLED";
export const FETCH_ATTRIBUTE_DATA_REJECTED = "FETCH_ATTRIBUTE_DATA_REJECTED";

// editor
export const PURGE_EDITOR = "PURGE_EDITOR";
export const SET_WIDGET_NAME = "SET_WIDGET_NAME";
export const SET_WIDGET_TYPE = "SET_WIDGET_TYPE";
export const SET_PLOT_DATA = "SET_PLOT_DATA";
export const SET_PLOT_PROPERTY = "SET_PLOT_PROPERTY";
export const SET_PLOT_ENCODING = "SET_PLOT_ENCODING";
export const SET_MAP_CENTER = "SET_MAP_CENTER";
export const SET_MAP_DATA = "SET_MAP_DATA";
export const SET_MAP_HEATMAP_ATTRIBUTE = "SET_MAP_HEATMAP_ATTRIBUTE";
export const SET_MAP_IS_MAPPABLE = "SET_MAP_IS_MAPPABLE";
export const SET_MAP_SHOW_HEATMAP = "SET_MAP_SHOW_HEATMAP";
export const SET_MAP_TILE_LAYER = "SET_MAP_TILE_LAYER";
export const SET_MAP_ZOOM = "SET_MAP_ZOOM";

// grid
export const FETCH_LAYOUT = "FETCH_LAYOUT";
export const FETCH_LAYOUT_FULFILLED = "FETCH_LAYOUT_FULFILLED";
export const FETCH_LAYOUT_REJECTED = "FETCH_LAYOUT_REJECTED";

// subthemes
export const FETCH_SUBTHEMES = "FETCH_SUBTHEMES";
export const FETCH_SUBTHEMES_FULFILLED = "FETCH_SUBTHEMES_FULFILLED";
export const FETCH_SUBTHEMES_REJECTED = "FETCH_SUBTHEMES_REJECTED";
export const TOGGLE_SUBTHEME_SELECTED = "TOGGLE_SUBTHEME_SELECTED";

// themes
export const FETCH_THEMES = "FETCH_THEMES";
export const FETCH_THEMES_FULFILLED = "FETCH_THEMES_FULFILLED";
export const FETCH_THEMES_REJECTED = "FETCH_THEMES_REJECTED";
export const TOGGLE_THEME_SELECTED = "TOGGLE_THEME_SELECTED";

// user auth
export const SET_CURRENT_USER = "SET_CURRENT_USER";

// widgets
export const FETCH_WIDGETS = "FETCH_WIDGETS";
export const FETCH_WIDGETS_FULFILLED = "FETCH_WIDGETS_FULFILLED";
export const FETCH_WIDGETS_REJECTED = "FETCH_WIDGETS_REJECTED";

// vegaLite
export const VEGA_LITE_MARKS = [
  "bar",
  "circle",
  "square",
  "tick",
  "line",
  "area",
  "point",
  "rule",
  "geoshape",
  "text",
];
export const VEGA_LITE_ENCODING_CHANNELS = [
  "x",
  "y",
  "color",
  "tooltip",
  //"x2",
  //"y2",
  "longitude",
  "latitude",
  "longitude2",
  "latitude2",
  //"color",
  //"opacity",
  "fillOpacity",
  "strokeOpacity",
  "strokeWidth",
  "size",
  "shape",
  "text",
  "tooltip",
  "href",
  "key",
  "order",
  "detail",
  "row",
  "column",
];
export const VEGA_LITE_DATA_TYPES = [
  "quantitative",
  "temporal",
  "ordinal",
  "nominal",
  "geojson",
];
export const VEGA_LITE_TIME_UNITS = [
  "year",
  "yearquarter",
  "yearquartermonth",
  "yearmonth",
  "yearmonthdate",
  "yearmonthdatehours",
  "yearmonthdatehoursminutes",
  "yearmonthdatehoursminutesseconds",
  "quarter",
  "quartermonth",
  "month",
  "monthdate",
  "date",
  "day",
  "hours",
  "hoursminutes",
  "hoursminutesseconds",
  "minutes",
  "minutesseconds",
  "seconds",
  "secondsmilliseconds",
  "milliseconds",
];
export const VEGA_LITE_AGGREGATE_OPERATIONS = [
  "count",
  "valid",
  "missing",
  "distinct",
  "sum",
  "mean",
  "average",
  "variance",
  "variancep",
  "stdev",
  "stdevp",
  "stderr",
  "median",
  "q1",
  "q3",
  "ci0",
  "ci1",
  "min",
  "max",
  "argmin",
  "argmax",
];
export const VEGA_LITE_FIELDS = (() => {
  return [
    {
      name: "field",
      type: "DataFieldName",
      required: true,
      default: "Timestamp",
    },
    {
      name: "type",
      type: VEGA_LITE_DATA_TYPES,
      required: true,
      default: VEGA_LITE_DATA_TYPES[0],
    },
    {
      name: "bin",
      type: Boolean,
      required: false,
      default: false,
    },
    {
      name: "timeUnit",
      type: VEGA_LITE_TIME_UNITS,
      required: false,
      default: VEGA_LITE_TIME_UNITS[0],
    },
    {
      name: "aggregate",
      type: VEGA_LITE_AGGREGATE_OPERATIONS,
      required: false,
      default: VEGA_LITE_AGGREGATE_OPERATIONS[5],
    },
    {
      name: "title",
      type: String,
      required: false,
      default: "",
    },
    //"scale",
    //"axis",
    //"legend",
    //"format",
    //"stack",
    //"sort",
    //"condition",
  ]
})();
