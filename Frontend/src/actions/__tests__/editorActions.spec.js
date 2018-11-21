import configureStore from 'redux-mock-store';
import * as editorActions from './../editorActions';
import {
  PURGE_EDITOR,
  SET_MAP_CENTER,
  SET_MAP_HEATMAP_ATTRIBUTE,
  SET_MAP_IS_MAPPABLE,
  SET_MAP_SHOW_HEATMAP,
  SET_MAP_TILE_LAYER,
  SET_MAP_ZOOM,
  SET_PLOT_DATA,
  SET_PLOT_DESCRIPTION,
  SET_PLOT_ENCODING,
  SET_PLOT_TYPE,
  SET_WIDGET_NAME,
  SET_WIDGET_TYPE,
} from "./../../constants";

const mockStore = configureStore();
const store = mockStore();

describe('editorActions', () => {
  beforeEach(() => {
    store.clearActions();
  });

  // ToDo :: this needs to be async
  /*describe('initializeEditor', async () => {
    test('Dispatches the correct action and payload', () => {
      let expectedActions = [
        {

        },
      ];

      store.dispatch(editorActions.initializeEditor());

      expect(store.getActions()).toEqual(expectedActions);
    })
  });*/

  describe('purgeEditor', () => {
    test('Dispatches the correct action and payload', () => {
      let expectedActions = [
        {
          type: PURGE_EDITOR,
        }
      ];

      store.dispatch(editorActions.purgeEditor());

      expect(store.getActions()).toEqual(expectedActions);
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

      expect(store.getActions()).toEqual(expectedActions);
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

      expect(store.getActions()).toEqual(expectedActions);
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

      expect(store.getActions()).toEqual(expectedActions);
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

      expect(store.getActions()).toEqual(expectedActions);
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

      expect(store.getActions()).toEqual(expectedActions);
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

      expect(store.getActions()).toEqual(expectedActions);
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

      expect(store.getActions()).toEqual(expectedActions);
    })
  });

  describe('setPlotDescription', () => {
    test('Dispatches the correct action and payload', () => {
      let expectedActions = [
        {
          type: SET_PLOT_DESCRIPTION,
          payload: 'Availability of bikes',
        },
      ];

      store.dispatch(editorActions.setPlotDescription('Availability of bikes'));

      expect(store.getActions()).toEqual(expectedActions);
    })
  });

  describe('setPlotEncoding', () => {
    test('Dispatches the correct action and payload', () => {
      let expectedActions = [
        {
          type: SET_PLOT_ENCODING,
          payload: {
            axis: 'x',
            field: 'bikes',
            type: 'quantitative',
          },
        },
      ];

      store.dispatch(editorActions.setPlotEncoding({
        axis: 'x',
        field: 'bikes',
        type: 'quantitative',
      }));

      expect(store.getActions()).toEqual(expectedActions);
    })
  });

  describe('setPlotType', () => {
    test('Dispatches the correct action and payload', () => {
      let expectedActions = [
        {
          type: SET_PLOT_TYPE,
          payload: 'bar',
        },
      ];

      store.dispatch(editorActions.setPlotType('bar'));

      expect(store.getActions()).toEqual(expectedActions);
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

      expect(store.getActions()).toEqual(expectedActions);
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

      expect(store.getActions()).toEqual(expectedActions);
    })
  })
});
