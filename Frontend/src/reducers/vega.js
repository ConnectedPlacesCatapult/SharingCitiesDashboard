import {
  VEGA_SET_WIDTH,
  VEGA_SET_HEIGHT,
  VEGA_SET_TITLE,
  VEGA_SET_NAME,
  VEGA_SET_DESCRIPTION,


  VEGA_ADD_LAYER,
  VEGA_REMOVE_LAYER,
  VEGA_SET_DATA,
  VEGA_SET_LAYER_MARK,
  VEGA_ADD_LAYER_ENCODING_CHANNEL,
  VEGA_SET_LAYER_ENCODING_CHANNEL,
  VEGA_REMOVE_LAYER_ENCODING_CHANNEL,
} from './../constants';

// ToDo :: store encoding channels as an array

const initialState = {
  width: 0,
  height: 0,
  title: "plot title",
  name: "plot name",
  description: "plot description",
  layers: [],
  transforms: [],


  /*"$schema": "https://vega.github.io/schema/vega-lite/v2.json",
  width: 640,
  height: 480,
  title: "plot title",
  name: "plot name",
  description: "plot description",
  data: {
    values: [],
  },
  transform: [],
  layer: [
    {
      mark: "point",
      encoding: {
        x: {
          field: "Timestamp",
          type: "temporal",
        },
        y: {
          field: "Value",
          type: "quantitative"
        },
        color: {
          field: "Attribute_Name",
          type: "nominal",
        },
      },
    },
    {
      mark: "line",
      encoding: {
        x: {
          "field": "Timestamp",
          "type": "temporal"
        },
        y: {
          "field": "Value",
          "type": "quantitative",
          "aggregate": "mean"
        },
        color: {
          "field": "Attribute_Name",
          "type": "nominal"
        },
      },
    },
  ],*/
};

const tempLayers = [
  {
    mark: "point",
    encoding: [
      {
        channel: "x",
        definitions: [
          {
            "field": "Timestamp"
          }
        ]
      }
    ]
  }
]

export default (state=initialState, action={}) => {
  switch(action.type) {
    case VEGA_SET_WIDTH: {
      return {
        ...state,
        width: action.payload,
      }
    }

    case VEGA_SET_HEIGHT: {
      return {
        ...state,
        height: action.payload,
      }
    }

    case VEGA_SET_TITLE: {
      return {
        ...state,
        title: action.payload,
      }
    }

    case VEGA_SET_NAME: {
      return {
        ...state,
        name: action.payload,
      }
    }

    case VEGA_SET_DESCRIPTION: {
      return {
        ...state,
        description: action.payload,
      }
    }








    case VEGA_ADD_LAYER: {
      return {
        ...state,
        layer: [...state.layer, []]
      }
    }

    case VEGA_REMOVE_LAYER: {
      return {
        ...state,
        layer: [
          ...state.layer.slice(0, action.payload.layerIndex),
          ...state.layer.slice(action.payload.layerIndex + 1),
        ],
      }
    }

    case VEGA_SET_LAYER_MARK: {
      const updatedLayer = state.layer[action.payload.layerIndex];
      updatedLayer.mark = action.payload.mark;

      return {
        ...state,
        layer: [
          ...state.layer.slice(0, action.payload.layerIndex),
          updatedLayer,
          ...state.layer.slice(action.payload.layerIndex + 1),
        ],
      }
    }

    case VEGA_SET_LAYER_ENCODING_CHANNEL: {
      const updatedLayer = state.layer[action.payload.layerIndex];



      const encoding = updatedLayer.encoding;
      const channels = Object.entries(encoding).sort((a, b) => a[0] - b[0]);
      const old = channels[action.payload.channelIndex][0];

      updatedLayer.encoding[action.payload.channel] = updatedLayer.encoding[channels[action.payload.channelIndex][0]];

      delete updatedLayer.encoding[channels[action.payload.channelIndex][0]];
      //channels

      /**
       *
       * obj = { name: 'Bobo' }
       obj.somethingElse = obj.name
       delete obj.name

       */

      //console.log(channels)
      //console.log(channels[action.payload.channel])


      //updatedLayer
      //updatedLayer.encoding[action.payload.channelIndex]

      //console.log("channel to be changed:", channels[action.payload.channelIndex][0]);

      //console.log(action.payload.layerIndex, action.payload.channelIndex, action.payload.channel);
      //console.log(channels);
      //console.log(updatedLayer);


      return {
        ...state,
        layer: [
          ...state.layer.slice(0, action.payload.layerIndex),
          updatedLayer,
          ...state.layer.slice(action.payload.layerIndex + 1),
        ],
      }
    }

    case VEGA_SET_DATA: {
      return {
        ...state,
        data: {
          ...state.data,
          values: action.payload,
        }
      }
    }
  }

  return state
}
