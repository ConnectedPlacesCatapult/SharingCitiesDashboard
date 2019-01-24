import {
  DISCARD_ATTRIBUTE_DATA,
  FETCH_ATTRIBUTE_DATA,
  FETCH_ATTRIBUTE_DATA_FULFILLED,
  FETCH_ATTRIBUTES_REJECTED,
  PURGE_DATA,
} from "./../constants";

const initialState = {
  data: [],
  vega: [],
  fetching: false,
  fetched: false,
  error: null,
};

export default (state=initialState, action={}) => {
  switch (action.type) {
    case DISCARD_ATTRIBUTE_DATA: {
      const newData = state.data.filter((attr) => attr.name !== action.payload.attributeName);

      return {
        ...state,
        data: newData,
      }
    }

    case FETCH_ATTRIBUTE_DATA: {
      return {
        ...state,
        fetching: true,
      }
    }

    case 'FETCH_ATTRIBUTE_DATA_FULFILLED_OLD': {
      const payloadData = action.payload.data.map(attr => ({
        table: attr['Attribute_Table'],
        name: attr['Attribute_Name'],
        description: attr['Attribute_Description'],
        unitValue: attr['Attribute_Unit_Value'],
        totalRecords: attr['Total_Records'],
        values: attr['Attribute_Values'],
      }));

      return {
        ...state,
        fetching: false,
        fetched: true,
        data: [...state.data, ...payloadData],
      }
    }

    case FETCH_ATTRIBUTE_DATA_FULFILLED: {

      // convert data to usable vega array and store in "vega" array
      let data = [...action.payload];
      let vega = [];

      // for each attribute in data array store the attribute name
      let attributeNames = [];
      for (let attr of data) {
        attributeNames = [...attributeNames, attr['Attribute_Name']];
      }

      // now we know the names we can translate the values to new records
      for (let [i, attr] of data.entries()) {
        let currentAttributeName = attr['Attribute_Name'];

        for (let val of attr['Attribute_Values']) {
          /*{
            "Sensor_id": "303e7190-8755-4dc1-9415-955cc7bd7b92",
            "Value": "2",
            "Timestamp": "2018-12-05 09:49:53"
          }*/

          let newValue = {};
          newValue['Sensor_id'] = val['Sensor_id'];
          newValue['Timestamp'] = val['Timestamp'];

          for (let name of attributeNames) {
            newValue[name] = (name === currentAttributeName) ? val['Value'] : null;
          }

          vega = [...vega, newValue];
        }
      }

      vega = vega.sort((a, b) => a['Timestamp'] - b['Timestamp']);

      /*let vega = data.map(attr => {


        return {
          name: attr['Attribute_Name'],
        }
      });*/

      console.log(data, vega);



      return {
        ...state,
        fetching: false,
        fetched: true,
        data: action.payload,
      }
    }

    case FETCH_ATTRIBUTES_REJECTED: {
      return {
        ...state,
        fetching: false,
        fetched: false,
        error: action.payload,
      }
    }

    case PURGE_DATA: {
      return initialState
    }
  }

  return state;
}
