import configureStore from 'redux-mock-store';
import * as editorActions from './../editorActions';
import {
  PURGE_EDITOR,
  SET_WIDGET_NAME,
  SET_WIDGET_TYPE,
  SET_PLOT_DATA,
  SET_PLOT_PROPERTY,
  SET_PLOT_ENCODING,
  SET_MAP_CENTER,
  SET_MAP_HEATMAP_ATTRIBUTE,
  SET_MAP_IS_MAPPABLE,
  SET_MAP_SHOW_HEATMAP,
  SET_MAP_TILE_LAYER,
  SET_MAP_ZOOM,
} from "./../../constants";

const mockStore = configureStore();
const store = mockStore();

describe('editorActions', () => {
  beforeEach(() => {
    store.clearActions();
  });

  describe('purgeEditor', () => {
    test('Dispatches the correct action and payload', () => {
      let expectedActions = [
        {
          type: PURGE_EDITOR,
        }
      ];

      store.dispatch(editorActions.purgeEditor());

      expect(store.getActions()).toEqual(expectedActions)
    })
  });

  describe('setWidgetName', () => {
    test('Dispatches the correct action and payload', () => {
      let expectedActions = [
        {
          type: SET_WIDGET_NAME,
          payload: 'Bike Availability',
        },
      ];

      store.dispatch(editorActions.setWidgetName('Bike Availability'));

      expect(store.getActions()).toEqual(expectedActions)
    })
  });

  describe('setWidgetType', () => {
    test('Dispatches the correct action and payload', () => {
      let expectedActions = [
        {
          type: SET_WIDGET_TYPE,
          payload: 'plot',
        },
      ];

      store.dispatch(editorActions.setWidgetType('plot'));

      expect(store.getActions()).toEqual(expectedActions)
    })
  });

  describe('setPlotData', () => {
    test('Dispatches the correct action and payload', () => {
      let expectedActions = [
        {
          type: SET_PLOT_DATA,
          payload: [{a: 1}],
        },
      ];

      store.dispatch(editorActions.setPlotData([{ a: 1 }]));

      expect(store.getActions()).toEqual(expectedActions)
    })
  });

  describe('setPlotProperty', () => {
    test('Dispatches the correct action and payload', () => {
      let expectedActions = [
        {
          type: SET_PLOT_PROPERTY,
          payload: {
            property: "width",
            value: 450,
          },
        },
      ];

      store.dispatch(editorActions.setPlotProperty("width", 450));

      expect(store.getActions()).toEqual(expectedActions)
    })
  });

  describe('setPlotEncoding', () => {
    test('Dispatches the correct action and payload', () => {
      let expectedActions = [
        {
          type: SET_PLOT_ENCODING,
          payload: {
            x: {
              field: "Timestamp",
              type: "temporal",
            },
          },
        },
      ];

      store.dispatch(editorActions.setPlotEncoding({
        x: {
          field: "Timestamp",
          type: "temporal",
        },
      }));

      expect(store.getActions()).toEqual(expectedActions)
    })
  });

  describe('setMapCenter', () => {
    test('Dispatches the correct action and payload', () => {
      let expectedActions = [
        {
          'type': SET_MAP_CENTER,
          'payload': {
            'lat': 51.505,
            'lng': -0.09,
          },
        },
      ];

      store.dispatch(editorActions.setMapCenter({ lat: 51.505, lng: -0.09 }));

      expect(store.getActions()).toEqual(expectedActions)
    })
  });

  describe('setMapHeatmapAttribute', () => {
    test('Dispatches the correct action and payload', () => {
      let expectedActions = [
        {
          type: SET_MAP_HEATMAP_ATTRIBUTE,
          payload: 'bikes',
        },
      ];

      store.dispatch(editorActions.setMapHeatmapAttribute('bikes'));

      expect(store.getActions()).toEqual(expectedActions)
    })
  });

  describe('setMapIsMappable', () => {
    test('Dispatches the correct action and payload', () => {
      let expectedActions = [
        {
          type: SET_MAP_IS_MAPPABLE,
          payload: true,
        },
      ];

      store.dispatch(editorActions.setMapIsMappable(true));

      expect(store.getActions()).toEqual(expectedActions)
    })
  });

  describe('setMapShowHeatmap', () => {
    test('Dispatches the correct action and payload', () => {
      let expectedActions = [
        {
          type: SET_MAP_SHOW_HEATMAP,
          payload: true,
        },
      ];

      store.dispatch(editorActions.setMapShowHeatmap(true));

      expect(store.getActions()).toEqual(expectedActions)
    })
  });

  describe('setMapTileLayer', () => {
    test('Dispatches the correct action and payload', () => {
      let expectedActions = [
        {
          type: SET_MAP_TILE_LAYER,
          payload: 'CartoDB.DarkMatter',
        },
      ];

      store.dispatch(editorActions.setMapTileLayer('CartoDB.DarkMatter'));

      expect(store.getActions()).toEqual(expectedActions)
    })
  });

  describe('setMapZoom', () => {
    test('Dispatches the correct action and payload', () => {
      let expectedActions = [
        {
          type: SET_MAP_ZOOM,
          payload: 13,
        },
      ];

      store.dispatch(editorActions.setMapZoom(13));

      expect(store.getActions()).toEqual(expectedActions)
    })
  });
});
