import React, { Component } from 'react';
import VegaLite from 'react-vega-lite';

const spec = {
  $schema: "https://vega.github.io/schema/vega-lite/v2.1.json",
  width: 350,
  height: 350,
  projection: {
    type: "mercator"
  },
  mark: {
    type: "circle"
  },
  encoding: {
    longitude: {
      field: "lon",
      type: "quantitative",
      title: "Longitude"
    },
    latitude: {
      field: "lat",
      type: "quantitative",
      title: "Latitude"
    },
    size: {
      field: "bike",
      type: "quantitative",
      title: "Bikes"
    },
    color: {
      field: "bike",
      type: "quantitative",
      title: "Bikes"
    },
    tooltip: [
      {
        field: "name",
        type: "ordinal",
        title: "Location"
      },
      {
        field: "bike",
        type: "quantitative",
        title: "Bikes"
      },
      {
        field: "lat",
        type: "quantitative",
        title: "Latitude"
      },
      {
        field: "lon",
        type: "quantitative",
        title: "Longitude"
      }
    ]
  }
};

const data = {
  "values": [
    {
      "dock_id": 1,
      "dock": 24,
      "bike": 9,
      "name": "Austin Road, Battersea Park",
      "lat": 51.474376,
      "lon": -0.155442
    },
    {
      "dock_id": 2,
      "dock": 10,
      "bike": 2,
      "name": "Royal Avenue 1, Chelsea",
      "lat": 51.489932,
      "lon": -0.162727
    },
    {
      "dock_id": 3,
      "dock": 20,
      "bike": 3,
      "name": "Abyssinia Close, Clapham Junction",
      "lat": 51.460333,
      "lon": -0.167029
    },
    {
      "dock_id": 4,
      "dock": 22,
      "bike": 0,
      "name": "Regency Street, Westminster",
      "lat": 51.49206,
      "lon": -0.132224
    },
    {
      "dock_id": 5,
      "dock": 28,
      "bike": 1,
      "name": "Stewart's Road, Wandsworth Road",
      "lat": 51.473116,
      "lon": -0.137235
    },
    {
      "dock_id": 6,
      "dock": 28,
      "bike": 23,
      "name": "Clarence Walk, Stockwell",
      "lat": 51.470732,
      "lon": -0.126994
    },
    {
      "dock_id": 7,
      "dock": 16,
      "bike": 2,
      "name": "The Tennis Courts, The Regent's Park",
      "lat": 51.525367,
      "lon": -0.153463
    },
    {
      "dock_id": 8,
      "dock": 20,
      "bike": 18,
      "name": "Waterloo Place, St. James's",
      "lat": 51.506633,
      "lon": -0.131773
    },
    {
      "dock_id": 9,
      "dock": 24,
      "bike": 11,
      "name": "St. Katharine's Way, Tower",
      "lat": 51.505697,
      "lon": -0.070542
    },
    {
      "dock_id": 10,
      "dock": 57,
      "bike": 17,
      "name": "Soho Square , Soho",
      "lat": 51.515631,
      "lon": -0.132328
    },
    {
      "dock_id": 11,
      "dock": 29,
      "bike": 27,
      "name": "Finsbury Library , Finsbury",
      "lat": 51.526717,
      "lon": -0.104298
    },
    {
      "dock_id": 12,
      "dock": 23,
      "bike": 0,
      "name": "Norton Folgate, Liverpool Street",
      "lat": 51.521113,
      "lon": -0.078869
    },
    {
      "dock_id": 13,
      "dock": 28,
      "bike": 20,
      "name": "Wapping Lane, Wapping",
      "lat": 51.504749,
      "lon": -0.057544
    },
    {
      "dock_id": 14,
      "dock": 27,
      "bike": 23,
      "name": "Drury Lane, Covent Garden",
      "lat": 51.51477,
      "lon": -0.122219
    },
    {
      "dock_id": 15,
      "dock": 18,
      "bike": 1,
      "name": "Park Street, Bankside",
      "lat": 51.505974,
      "lon": -0.092754
    },
    {
      "dock_id": 16,
      "dock": 24,
      "bike": 4,
      "name": "Finlay Street, Fulham",
      "lat": 51.476885,
      "lon": -0.215895
    },
    {
      "dock_id": 17,
      "dock": 21,
      "bike": 3,
      "name": "Bancroft Road, Bethnal Green",
      "lat": 51.526041,
      "lon": -0.047218
    },
    {
      "dock_id": 18,
      "dock": 24,
      "bike": 13,
      "name": "Bromley High Street, Bow",
      "lat": 51.528828,
      "lon": -0.013258
    },
    {
      "dock_id": 19,
      "dock": 28,
      "bike": 9,
      "name": "Hatton Garden, Holborn",
      "lat": 51.518825,
      "lon": -0.108028
    },
    {
      "dock_id": 20,
      "dock": 22,
      "bike": 1,
      "name": "Thurtle Road, Haggerston",
      "lat": 51.534776,
      "lon": -0.071881
    },
    {
      "dock_id": 21,
      "dock": 47,
      "bike": 8,
      "name": "Mile End Park Leisure Centre, Mile End",
      "lat": 51.520597,
      "lon": -0.032566
    },
    {
      "dock_id": 22,
      "dock": 51,
      "bike": 12,
      "name": "Watney Market, Stepney",
      "lat": 51.514222,
      "lon": -0.055656
    },
    {
      "dock_id": 23,
      "dock": 34,
      "bike": 6,
      "name": "Elizabeth Bridge, Victoria",
      "lat": 51.492369,
      "lon": -0.147478
    },
    {
      "dock_id": 24,
      "dock": 23,
      "bike": 2,
      "name": "Harford Street, Mile End",
      "lat": 51.521564,
      "lon": -0.039264
    },
    {
      "dock_id": 25,
      "dock": 27,
      "bike": 2,
      "name": "Coomer Place, West Kensington",
      "lat": 51.48357,
      "lon": -0.202038
    },
    {
      "dock_id": 26,
      "dock": 64,
      "bike": 5,
      "name": "Edgware Road Station, Marylebone",
      "lat": 51.519968,
      "lon": -0.169774
    },
    {
      "dock_id": 27,
      "dock": 27,
      "bike": 14,
      "name": "Stamford Street, South Bank",
      "lat": 51.505569,
      "lon": -0.111606
    },
    {
      "dock_id": 28,
      "dock": 29,
      "bike": 3,
      "name": "Putney Bridge Road, East Putney",
      "lat": 51.461999,
      "lon": -0.20624
    },
    {
      "dock_id": 29,
      "dock": 26,
      "bike": 9,
      "name": "Warren Street Station, Euston",
      "lat": 51.524438,
      "lon": -0.138019
    },
    {
      "dock_id": 30,
      "dock": 16,
      "bike": 5,
      "name": "Hampstead Road (Cartmel), Euston",
      "lat": 51.530078,
      "lon": -0.138846
    },
    {
      "dock_id": 31,
      "dock": 22,
      "bike": 20,
      "name": "West Kensington Station, West Kensington",
      "lat": 51.49087,
      "lon": -0.206029
    },
    {
      "dock_id": 32,
      "dock": 18,
      "bike": 9,
      "name": "Chadwell Street, Angel",
      "lat": 51.530515,
      "lon": -0.106408
    },
    {
      "dock_id": 33,
      "dock": 24,
      "bike": 21,
      "name": "Langdon Park, Poplar",
      "lat": 51.51549,
      "lon": -0.013475
    },
    {
      "dock_id": 34,
      "dock": 63,
      "bike": 22,
      "name": "Jubilee Plaza, Canary Wharf",
      "lat": 51.50357,
      "lon": -0.020068
    },
    {
      "dock_id": 35,
      "dock": 30,
      "bike": 3,
      "name": "Esmond Street, Putney",
      "lat": 51.462312,
      "lon": -0.211468
    },
    {
      "dock_id": 36,
      "dock": 32,
      "bike": 21,
      "name": "Dickens Square, Borough",
      "lat": 51.496791,
      "lon": -0.093913
    },
    {
      "dock_id": 37,
      "dock": 36,
      "bike": 11,
      "name": "Waterloo Station 1, Waterloo",
      "lat": 51.504027,
      "lon": -0.113864
    },
    {
      "dock_id": 38,
      "dock": 18,
      "bike": 9,
      "name": "Kensington Town Hall, Kensington",
      "lat": 51.501945,
      "lon": -0.194392
    },
    {
      "dock_id": 39,
      "dock": 19,
      "bike": 14,
      "name": "Tavistock Place, Bloomsbury",
      "lat": 51.52625,
      "lon": -0.123509
    },
    {
      "dock_id": 40,
      "dock": 34,
      "bike": 7,
      "name": "Ashmole Estate, Oval",
      "lat": 51.482678,
      "lon": -0.117661
    },
    {
      "dock_id": 41,
      "dock": 36,
      "bike": 4,
      "name": "Fawcett Close, Battersea",
      "lat": 51.469161,
      "lon": -0.174485
    },
    {
      "dock_id": 42,
      "dock": 39,
      "bike": 29,
      "name": "Castalia Square, Cubitt Town",
      "lat": 51.498125,
      "lon": -0.011457
    },
    {
      "dock_id": 43,
      "dock": 39,
      "bike": 24,
      "name": "Devons Road, Bow",
      "lat": 51.52512,
      "lon": -0.015578
    },
    {
      "dock_id": 44,
      "dock": 18,
      "bike": 7,
      "name": "Roscoe Street, St. Luke's",
      "lat": 51.522954,
      "lon": -0.094934
    },
    {
      "dock_id": 45,
      "dock": 31,
      "bike": 2,
      "name": "Kennington Lane Rail Bridge, Vauxhall",
      "lat": 51.486343,
      "lon": -0.122492
    },
    {
      "dock_id": 46,
      "dock": 32,
      "bike": 26,
      "name": "Christopher Street, Liverpool Street",
      "lat": 51.521283,
      "lon": -0.084605
    },
    {
      "dock_id": 47,
      "dock": 34,
      "bike": 11,
      "name": "Portland Place, Marylebone",
      "lat": 51.520715,
      "lon": -0.145211
    },
    {
      "dock_id": 48,
      "dock": 18,
      "bike": 13,
      "name": "Felsham Road, Putney",
      "lat": 51.464786,
      "lon": -0.215618
    },
    {
      "dock_id": 49,
      "dock": 21,
      "bike": 3,
      "name": "Prince of Wales Drive, Battersea Park",
      "lat": 51.475153,
      "lon": -0.159169
    },
    {
      "dock_id": 50,
      "dock": 17,
      "bike": 4,
      "name": "Penywern Road, Earl's Court",
      "lat": 51.491593,
      "lon": -0.192369
    },
    {
      "dock_id": 51,
      "dock": 25,
      "bike": 7,
      "name": "Kensington Olympia Station, Olympia",
      "lat": 51.498157,
      "lon": -0.209494
    },
    {
      "dock_id": 52,
      "dock": 24,
      "bike": 10,
      "name": "Columbia Road, Shoreditch",
      "lat": 51.528187,
      "lon": -0.075375
    },
    {
      "dock_id": 53,
      "dock": 18,
      "bike": 11,
      "name": "New Cavendish Street, Marylebone",
      "lat": 51.519167,
      "lon": -0.147983
    },
    {
      "dock_id": 54,
      "dock": 28,
      "bike": 4,
      "name": "Cheshire Street, Bethnal Green",
      "lat": 51.52388,
      "lon": -0.065076
    },
    {
      "dock_id": 55,
      "dock": 21,
      "bike": 13,
      "name": "Hinde Street, Marylebone",
      "lat": 51.516814,
      "lon": -0.151926
    },
    {
      "dock_id": 56,
      "dock": 15,
      "bike": 7,
      "name": "Waterloo Bridge, South Bank",
      "lat": 51.505354,
      "lon": -0.113656
    },
    {
      "dock_id": 57,
      "dock": 30,
      "bike": 1,
      "name": "Osiers Road, Wandsworth",
      "lat": 51.46067,
      "lon": -0.198735
    },
    {
      "dock_id": 58,
      "dock": 19,
      "bike": 1,
      "name": "Hewison Street, Old Ford",
      "lat": 51.533283,
      "lon": -0.028155
    },
    {
      "dock_id": 59,
      "dock": 25,
      "bike": 22,
      "name": "Breams Buildings, Holborn",
      "lat": 51.515937,
      "lon": -0.111778
    },
    {
      "dock_id": 60,
      "dock": 34,
      "bike": 22,
      "name": "Newgate Street , St. Paul's",
      "lat": 51.515418,
      "lon": -0.09885
    },
    {
      "dock_id": 61,
      "dock": 21,
      "bike": 18,
      "name": "Great Suffolk Street, The Borough",
      "lat": 51.501732,
      "lon": -0.100292
    },
    {
      "dock_id": 62,
      "dock": 34,
      "bike": 18,
      "name": "Shepherd's Bush Road North, Shepherd's Bush",
      "lat": 51.501594,
      "lon": -0.222293
    },
    {
      "dock_id": 63,
      "dock": 35,
      "bike": 17,
      "name": "Saunders Ness Road, Cubitt Town",
      "lat": 51.487129,
      "lon": -0.009001
    },
    {
      "dock_id": 64,
      "dock": 46,
      "bike": 28,
      "name": "Crisp Road, Hammersmith",
      "lat": 51.488108,
      "lon": -0.226606
    },
    {
      "dock_id": 65,
      "dock": 24,
      "bike": 3,
      "name": "Normand Park, West Kensington",
      "lat": 51.484386,
      "lon": -0.204815
    },
    {
      "dock_id": 66,
      "dock": 17,
      "bike": 0,
      "name": "Gunmakers Lane, Old Ford",
      "lat": 51.535179,
      "lon": -0.03338
    },
    {
      "dock_id": 67,
      "dock": 35,
      "bike": 8,
      "name": "Queensbridge Road, Haggerston",
      "lat": 51.53385,
      "lon": -0.06992
    },
    {
      "dock_id": 68,
      "dock": 29,
      "bike": 11,
      "name": "Ackroyd Drive, Bow",
      "lat": 51.520398,
      "lon": -0.026768
    },
    {
      "dock_id": 69,
      "dock": 17,
      "bike": 16,
      "name": "Abingdon Villas, Kensington",
      "lat": 51.497387,
      "lon": -0.197245
    },
    {
      "dock_id": 70,
      "dock": 15,
      "bike": 9,
      "name": "Waterloo Road, South Bank",
      "lat": 51.50486,
      "lon": -0.113001
    },
    {
      "dock_id": 71,
      "dock": 31,
      "bike": 16,
      "name": "Eaton Square (South), Belgravia",
      "lat": 51.494561,
      "lon": -0.153933
    },
    {
      "dock_id": 72,
      "dock": 38,
      "bike": 14,
      "name": "Olympia Way, Olympia",
      "lat": 51.4961,
      "lon": -0.208158
    },
    {
      "dock_id": 73,
      "dock": 18,
      "bike": 1,
      "name": "Smith Square, Westminster",
      "lat": 51.495805,
      "lon": -0.127575
    },
    {
      "dock_id": 74,
      "dock": 16,
      "bike": 13,
      "name": "Commercial Street, Shoreditch",
      "lat": 51.52127,
      "lon": -0.075578
    },
    {
      "dock_id": 75,
      "dock": 15,
      "bike": 12,
      "name": "West Smithfield Rotunda, Farringdon",
      "lat": 51.518218,
      "lon": -0.100791
    },
    {
      "dock_id": 76,
      "dock": 17,
      "bike": 2,
      "name": "Vauxhall Cross, Vauxhall",
      "lat": 51.485917,
      "lon": -0.124469
    },
    {
      "dock_id": 77,
      "dock": 36,
      "bike": 11,
      "name": "Wellington Arch, Hyde Park",
      "lat": 51.50274,
      "lon": -0.149569
    },
    {
      "dock_id": 78,
      "dock": 32,
      "bike": 19,
      "name": "Queen Victoria Street, St. Paul's",
      "lat": 51.511961,
      "lon": -0.097441
    },
    {
      "dock_id": 79,
      "dock": 29,
      "bike": 5,
      "name": "Manfred Road, East Putney",
      "lat": 51.458164,
      "lon": -0.206002
    },
    {
      "dock_id": 80,
      "dock": 25,
      "bike": 13,
      "name": "Imperial Wharf Station, Sands End",
      "lat": 51.474665,
      "lon": -0.183165
    },
    {
      "dock_id": 81,
      "dock": 28,
      "bike": 13,
      "name": "Bricklayers Arms, Borough",
      "lat": 51.495061,
      "lon": -0.085814
    },
    {
      "dock_id": 82,
      "dock": 29,
      "bike": 7,
      "name": "Castlehaven Road, Camden Town",
      "lat": 51.542138,
      "lon": -0.145393
    },
    {
      "dock_id": 83,
      "dock": 15,
      "bike": 6,
      "name": "Chancery Lane, Holborn",
      "lat": 51.514274,
      "lon": -0.111257
    },
    {
      "dock_id": 84,
      "dock": 17,
      "bike": 16,
      "name": "Lower Marsh, Waterloo",
      "lat": 51.500139,
      "lon": -0.113936
    },
    {
      "dock_id": 85,
      "dock": 31,
      "bike": 31,
      "name": "Snowsfields, London Bridge",
      "lat": 51.502153,
      "lon": -0.083632
    },
    {
      "dock_id": 86,
      "dock": 24,
      "bike": 9,
      "name": "Bevington Road West, North Kensington",
      "lat": 51.5212,
      "lon": -0.208888
    },
    {
      "dock_id": 87,
      "dock": 18,
      "bike": 4,
      "name": "Vicarage Gate, Kensington",
      "lat": 51.504723,
      "lon": -0.192538
    },
    {
      "dock_id": 88,
      "dock": 26,
      "bike": 8,
      "name": "Sirdar Road, Avondale",
      "lat": 51.510928,
      "lon": -0.214594
    },
    {
      "dock_id": 89,
      "dock": 15,
      "bike": 7,
      "name": "Chelsea Bridge, Pimlico",
      "lat": 51.485821,
      "lon": -0.149004
    },
    {
      "dock_id": 90,
      "dock": 21,
      "bike": 9,
      "name": "Whiston Road, Haggerston",
      "lat": 51.534464,
      "lon": -0.076341
    },
    {
      "dock_id": 91,
      "dock": 27,
      "bike": 11,
      "name": "Millennium Hotel, Mayfair",
      "lat": 51.510919,
      "lon": -0.151126
    },
    {
      "dock_id": 92,
      "dock": 21,
      "bike": 15,
      "name": "Panton Street, West End",
      "lat": 51.509639,
      "lon": -0.13151
    },
    {
      "dock_id": 93,
      "dock": 16,
      "bike": 10,
      "name": "Wardour Street, Soho",
      "lat": 51.512515,
      "lon": -0.133201
    },
    {
      "dock_id": 94,
      "dock": 48,
      "bike": 21,
      "name": "Stephendale Road, Sands End",
      "lat": 51.46822,
      "lon": -0.190346
    },
    {
      "dock_id": 95,
      "dock": 22,
      "bike": 10,
      "name": "World's End Place, West Chelsea",
      "lat": 51.481805,
      "lon": -0.180274
    },
    {
      "dock_id": 96,
      "dock": 28,
      "bike": 0,
      "name": "Ashley Crescent, Battersea",
      "lat": 51.467185,
      "lon": -0.152248
    },
    {
      "dock_id": 97,
      "dock": 21,
      "bike": 3,
      "name": "Queen's Gate, Kensington Gardens",
      "lat": 51.501715,
      "lon": -0.179854
    },
    {
      "dock_id": 98,
      "dock": 16,
      "bike": 8,
      "name": "Tachbrook Street, Victoria",
      "lat": 51.492111,
      "lon": -0.138364
    },
    {
      "dock_id": 99,
      "dock": 22,
      "bike": 1,
      "name": "New North Road 2, Hoxton",
      "lat": 51.53114,
      "lon": -0.086016
    },
    {
      "dock_id": 100,
      "dock": 25,
      "bike": 12,
      "name": "Spencer Park, Wandsworth Common",
      "lat": 51.45787,
      "lon": -0.174691
    },
    {
      "dock_id": 101,
      "dock": 26,
      "bike": 18,
      "name": "Westminster Bridge Road, Elephant & Castle",
      "lat": 51.498386,
      "lon": -0.107913
    },
    {
      "dock_id": 102,
      "dock": 19,
      "bike": 3,
      "name": "Vauxhall Street, Vauxhall",
      "lat": 51.486965,
      "lon": -0.116625
    },
    {
      "dock_id": 103,
      "dock": 18,
      "bike": 16,
      "name": "Stonecutter Street, Holborn",
      "lat": 51.515809,
      "lon": -0.10527
    },
    {
      "dock_id": 104,
      "dock": 29,
      "bike": 2,
      "name": "Upcerne Road, West Chelsea",
      "lat": 51.478169,
      "lon": -0.182435
    },
    {
      "dock_id": 105,
      "dock": 18,
      "bike": 7,
      "name": "Claremont Square, Angel",
      "lat": 51.531666,
      "lon": -0.109914
    },
    {
      "dock_id": 106,
      "dock": 36,
      "bike": 12,
      "name": "Hibbert Street, Battersea",
      "lat": 51.46517,
      "lon": -0.180389
    },
    {
      "dock_id": 107,
      "dock": 24,
      "bike": 5,
      "name": "The Vale, Chelsea",
      "lat": 51.485121,
      "lon": -0.174971
    },
    {
      "dock_id": 108,
      "dock": 35,
      "bike": 12,
      "name": "Waterloo Station 3, Waterloo",
      "lat": 51.503791,
      "lon": -0.112824
    },
    {
      "dock_id": 109,
      "dock": 19,
      "bike": 10,
      "name": "Fore Street, Guildhall",
      "lat": 51.517842,
      "lon": -0.090075
    },
    {
      "dock_id": 110,
      "dock": 23,
      "bike": 2,
      "name": "Craven Street, Strand",
      "lat": 51.508103,
      "lon": -0.126021
    },
    {
      "dock_id": 111,
      "dock": 30,
      "bike": 4,
      "name": "Ingrave Street, Clapham Junction",
      "lat": 51.467454,
      "lon": -0.172293
    },
    {
      "dock_id": 112,
      "dock": 18,
      "bike": 4,
      "name": "South Parade, Chelsea",
      "lat": 51.48902,
      "lon": -0.17524
    },
    {
      "dock_id": 113,
      "dock": 22,
      "bike": 2,
      "name": "All Saints' Road, Portobello",
      "lat": 51.519042,
      "lon": -0.204764
    },
    {
      "dock_id": 114,
      "dock": 28,
      "bike": 0,
      "name": "Surrey Lane, Battersea",
      "lat": 51.47518,
      "lon": -0.16716
    },
    {
      "dock_id": 115,
      "dock": 21,
      "bike": 7,
      "name": "Lansdowne Walk, Ladbroke Grove",
      "lat": 51.509591,
      "lon": -0.204666
    },
    {
      "dock_id": 116,
      "dock": 47,
      "bike": 20,
      "name": "Kennington Cross, Kennington",
      "lat": 51.48894,
      "lon": -0.111435
    },
    {
      "dock_id": 117,
      "dock": 44,
      "bike": 8,
      "name": "Lindfield Street, Poplar",
      "lat": 51.513757,
      "lon": -0.020467
    },
    {
      "dock_id": 118,
      "dock": 33,
      "bike": 17,
      "name": "Flood Street, Chelsea",
      "lat": 51.488023,
      "lon": -0.166878
    },
    {
      "dock_id": 119,
      "dock": 18,
      "bike": 0,
      "name": "Bishop's Bridge Road West, Bayswater",
      "lat": 51.51616,
      "lon": -0.18697
    },
    {
      "dock_id": 120,
      "dock": 16,
      "bike": 10,
      "name": "Devonshire Square, Liverpool Street",
      "lat": 51.516468,
      "lon": -0.079684
    },
    {
      "dock_id": 121,
      "dock": 21,
      "bike": 0,
      "name": "Danvers Street, West Chelsea",
      "lat": 51.482567,
      "lon": -0.172078
    },
    {
      "dock_id": 122,
      "dock": 36,
      "bike": 35,
      "name": "Westferry Circus, Canary Wharf",
      "lat": 51.505703,
      "lon": -0.027772
    },
    {
      "dock_id": 123,
      "dock": 22,
      "bike": 9,
      "name": "Baylis Road, Waterloo",
      "lat": 51.501444,
      "lon": -0.110699
    },
    {
      "dock_id": 124,
      "dock": 26,
      "bike": 4,
      "name": "Palissy Street, Shoreditch",
      "lat": 51.526293,
      "lon": -0.073955
    },
    {
      "dock_id": 125,
      "dock": 14,
      "bike": 14,
      "name": "Colombo Street, Southwark",
      "lat": 51.505459,
      "lon": -0.105692
    },
    {
      "dock_id": 126,
      "dock": 26,
      "bike": 2,
      "name": "Humbolt Road, Fulham",
      "lat": 51.483217,
      "lon": -0.21186
    },
    {
      "dock_id": 127,
      "dock": 18,
      "bike": 5,
      "name": "Upper Grosvenor Street, Mayfair",
      "lat": 51.51013,
      "lon": -0.155757
    },
    {
      "dock_id": 128,
      "dock": 18,
      "bike": 0,
      "name": "Mexfield Road, East Putney",
      "lat": 51.45682,
      "lon": -0.202802
    },
    {
      "dock_id": 129,
      "dock": 22,
      "bike": 15,
      "name": "Hammersmith Road, Hammersmith",
      "lat": 51.493267,
      "lon": -0.21985
    },
    {
      "dock_id": 130,
      "dock": 20,
      "bike": 7,
      "name": "Southampton Place, Holborn",
      "lat": 51.517606,
      "lon": -0.121328
    },
    {
      "dock_id": 131,
      "dock": 16,
      "bike": 6,
      "name": "Bourne Street, Belgravia",
      "lat": 51.491495,
      "lon": -0.154004
    },
    {
      "dock_id": 132,
      "dock": 24,
      "bike": 5,
      "name": "Rodney Road , Walworth",
      "lat": 51.491484,
      "lon": -0.09022
    },
    {
      "dock_id": 133,
      "dock": 28,
      "bike": 22,
      "name": "Houndsditch, Aldgate",
      "lat": 51.514449,
      "lon": -0.077178
    },
    {
      "dock_id": 134,
      "dock": 20,
      "bike": 4,
      "name": "Nevern Place, Earl's Court",
      "lat": 51.493343,
      "lon": -0.194757
    },
    {
      "dock_id": 135,
      "dock": 21,
      "bike": 14,
      "name": "Oval Way, Vauxhall",
      "lat": 51.486575,
      "lon": -0.117286
    },
    {
      "dock_id": 136,
      "dock": 21,
      "bike": 0,
      "name": "Limburg Road, Clapham Junction",
      "lat": 51.461923,
      "lon": -0.165297
    },
    {
      "dock_id": 137,
      "dock": 33,
      "bike": 8,
      "name": "Sutton Street, Shadwell",
      "lat": 51.511066,
      "lon": -0.053558
    },
    {
      "dock_id": 138,
      "dock": 60,
      "bike": 44,
      "name": "Bankside Mix, Bankside",
      "lat": 51.505817,
      "lon": -0.100186
    },
    {
      "dock_id": 139,
      "dock": 24,
      "bike": 14,
      "name": "Whitehall Place, Strand",
      "lat": 51.506543,
      "lon": -0.123179
    },
    {
      "dock_id": 140,
      "dock": 21,
      "bike": 1,
      "name": "Sandilands Road, Walham Green",
      "lat": 51.473611,
      "lon": -0.191803
    },
    {
      "dock_id": 141,
      "dock": 22,
      "bike": 14,
      "name": "Nantes Close, Wandsworth",
      "lat": 51.46193,
      "lon": -0.180791
    },
    {
      "dock_id": 142,
      "dock": 24,
      "bike": 8,
      "name": "Brunswick Square, Bloomsbury",
      "lat": 51.523951,
      "lon": -0.122502
    },
    {
      "dock_id": 143,
      "dock": 21,
      "bike": 1,
      "name": "Malmesbury Road, Bow",
      "lat": 51.529452,
      "lon": -0.027616
    },
    {
      "dock_id": 144,
      "dock": 20,
      "bike": 11,
      "name": "Napier Avenue, Millwall",
      "lat": 51.487679,
      "lon": -0.021582
    },
    {
      "dock_id": 145,
      "dock": 21,
      "bike": 10,
      "name": "Islington Green, Angel",
      "lat": 51.536384,
      "lon": -0.102757
    },
    {
      "dock_id": 146,
      "dock": 24,
      "bike": 19,
      "name": "Tower Gardens , Tower",
      "lat": 51.509506,
      "lon": -0.075459
    },
    {
      "dock_id": 147,
      "dock": 18,
      "bike": 1,
      "name": "Wendon Street, Old Ford",
      "lat": 51.536039,
      "lon": -0.026262
    },
    {
      "dock_id": 148,
      "dock": 17,
      "bike": 11,
      "name": "Geraldine Street, Elephant & Castle",
      "lat": 51.496127,
      "lon": -0.106
    },
    {
      "dock_id": 149,
      "dock": 23,
      "bike": 21,
      "name": "St. Mark's Road, North Kensington",
      "lat": 51.51687,
      "lon": -0.213872
    },
    {
      "dock_id": 150,
      "dock": 20,
      "bike": 11,
      "name": "Abingdon Green, Westminster",
      "lat": 51.497622,
      "lon": -0.125978
    },
    {
      "dock_id": 151,
      "dock": 18,
      "bike": 7,
      "name": "Trebovir Road, Earl's Court",
      "lat": 51.490853,
      "lon": -0.19617
    },
    {
      "dock_id": 152,
      "dock": 38,
      "bike": 24,
      "name": "Belvedere Road 2, South Bank",
      "lat": 51.50621,
      "lon": -0.114842
    },
    {
      "dock_id": 153,
      "dock": 28,
      "bike": 26,
      "name": "Holy Trinity Brompton, Knightsbridge",
      "lat": 51.497056,
      "lon": -0.168917
    },
    {
      "dock_id": 154,
      "dock": 30,
      "bike": 13,
      "name": "Peterborough Road, Sands End",
      "lat": 51.46904,
      "lon": -0.196274
    },
    {
      "dock_id": 155,
      "dock": 45,
      "bike": 13,
      "name": "Eagle Wharf Road, Hoxton",
      "lat": 51.53356,
      "lon": -0.09315
    },
    {
      "dock_id": 156,
      "dock": 21,
      "bike": 20,
      "name": "Charing Cross Hospital, Hammersmith",
      "lat": 51.487285,
      "lon": -0.217995
    },
    {
      "dock_id": 157,
      "dock": 16,
      "bike": 15,
      "name": "Montpelier Street, Knightsbridge",
      "lat": 51.498884,
      "lon": -0.165471
    },
    {
      "dock_id": 158,
      "dock": 37,
      "bike": 7,
      "name": "Cloudesley Road, Angel",
      "lat": 51.534408,
      "lon": -0.109025
    },
    {
      "dock_id": 159,
      "dock": 16,
      "bike": 12,
      "name": "Moor Street, Soho",
      "lat": 51.513527,
      "lon": -0.13011
    },
    {
      "dock_id": 160,
      "dock": 54,
      "bike": 53,
      "name": "Moorfields, Moorgate",
      "lat": 51.519069,
      "lon": -0.088285
    },
    {
      "dock_id": 161,
      "dock": 38,
      "bike": 21,
      "name": "Harrington Square 2, Camden Town",
      "lat": 51.533379,
      "lon": -0.139159
    },
    {
      "dock_id": 162,
      "dock": 19,
      "bike": 18,
      "name": "Millharbour, Millwall",
      "lat": 51.496137,
      "lon": -0.019355
    },
    {
      "dock_id": 163,
      "dock": 18,
      "bike": 4,
      "name": "Aberdeen Place, St. John's Wood",
      "lat": 51.524826,
      "lon": -0.176268
    },
    {
      "dock_id": 164,
      "dock": 19,
      "bike": 5,
      "name": "Northington Street , Holborn",
      "lat": 51.522264,
      "lon": -0.114079
    },
    {
      "dock_id": 165,
      "dock": 25,
      "bike": 9,
      "name": "Hertford Road, De Beauvoir Town",
      "lat": 51.537277,
      "lon": -0.079201
    },
    {
      "dock_id": 166,
      "dock": 27,
      "bike": 11,
      "name": "Chelsea Green, Chelsea",
      "lat": 51.490664,
      "lon": -0.166485
    },
    {
      "dock_id": 167,
      "dock": 33,
      "bike": 28,
      "name": "Copper Box Arena, Queen Elizabeth Olympic Park",
      "lat": 51.544836,
      "lon": -0.019524
    },
    {
      "dock_id": 168,
      "dock": 23,
      "bike": 6,
      "name": "Kensington Gore, Knightsbridge",
      "lat": 51.501432,
      "lon": -0.178656
    },
    {
      "dock_id": 169,
      "dock": 27,
      "bike": 12,
      "name": "Goldsmith's Row, Haggerston",
      "lat": 51.531864,
      "lon": -0.066035
    },
    {
      "dock_id": 170,
      "dock": 23,
      "bike": 21,
      "name": "Archbishop's Park, Waterloo",
      "lat": 51.498241,
      "lon": -0.117495
    },
    {
      "dock_id": 171,
      "dock": 16,
      "bike": 0,
      "name": "Shouldham Street, Marylebone",
      "lat": 51.51809,
      "lon": -0.163609
    },
    {
      "dock_id": 172,
      "dock": 43,
      "bike": 34,
      "name": "Irene Road, Parsons Green",
      "lat": 51.473763,
      "lon": -0.19701
    },
    {
      "dock_id": 173,
      "dock": 28,
      "bike": 11,
      "name": "Lansdowne Way Bus Garage, Stockwell",
      "lat": 51.474567,
      "lon": -0.12458
    },
    {
      "dock_id": 174,
      "dock": 22,
      "bike": 12,
      "name": "Alfreda Street, Battersea Park",
      "lat": 51.47505,
      "lon": -0.150908
    },
    {
      "dock_id": 175,
      "dock": 33,
      "bike": 18,
      "name": "Finsbury Square , Moorgate",
      "lat": 51.520962,
      "lon": -0.085634
    },
    {
      "dock_id": 176,
      "dock": 35,
      "bike": 35,
      "name": "Lambeth Palace Road, Waterloo",
      "lat": 51.500089,
      "lon": -0.116628
    },
    {
      "dock_id": 177,
      "dock": 21,
      "bike": 10,
      "name": "New Fetter Lane, Holborn",
      "lat": 51.517428,
      "lon": -0.107987
    },
    {
      "dock_id": 178,
      "dock": 16,
      "bike": 13,
      "name": "George Place Mews, Marylebone",
      "lat": 51.516892,
      "lon": -0.158249
    },
    {
      "dock_id": 179,
      "dock": 18,
      "bike": 10,
      "name": "Fournier Street, Whitechapel",
      "lat": 51.519362,
      "lon": -0.074431
    },
    {
      "dock_id": 180,
      "dock": 38,
      "bike": 14,
      "name": "Lancaster Gate , Bayswater",
      "lat": 51.511654,
      "lon": -0.179668
    },
    {
      "dock_id": 181,
      "dock": 33,
      "bike": 2,
      "name": "Albert Gardens, Stepney",
      "lat": 51.51328,
      "lon": -0.047784
    },
    {
      "dock_id": 182,
      "dock": 34,
      "bike": 22,
      "name": "Braham Street, Aldgate",
      "lat": 51.514233,
      "lon": -0.073537
    },
    {
      "dock_id": 183,
      "dock": 30,
      "bike": 13,
      "name": "Sopwith Way, Battersea Park",
      "lat": 51.481121,
      "lon": -0.149035
    },
    {
      "dock_id": 184,
      "dock": 30,
      "bike": 20,
      "name": "Tate Modern, Bankside",
      "lat": 51.506725,
      "lon": -0.098807
    },
    {
      "dock_id": 185,
      "dock": 42,
      "bike": 14,
      "name": "Westfield Ariel Way, White City",
      "lat": 51.509158,
      "lon": -0.224103
    },
    {
      "dock_id": 186,
      "dock": 27,
      "bike": 8,
      "name": "Sidney Road, Stockwell",
      "lat": 51.469202,
      "lon": -0.119022
    },
    {
      "dock_id": 187,
      "dock": 41,
      "bike": 25,
      "name": "Berry Street, Clerkenwell",
      "lat": 51.522853,
      "lon": -0.099994
    },
    {
      "dock_id": 188,
      "dock": 30,
      "bike": 1,
      "name": "Antill Road, Mile End",
      "lat": 51.528224,
      "lon": -0.037471
    },
    {
      "dock_id": 189,
      "dock": 30,
      "bike": 21,
      "name": "Colet Gardens, Hammersmith",
      "lat": 51.491093,
      "lon": -0.216493
    },
    {
      "dock_id": 190,
      "dock": 31,
      "bike": 12,
      "name": "Doric Way , Somers Town",
      "lat": 51.528833,
      "lon": -0.13225
    },
    {
      "dock_id": 191,
      "dock": 44,
      "bike": 6,
      "name": "Caldwell Street, Stockwell",
      "lat": 51.477839,
      "lon": -0.116493
    },
    {
      "dock_id": 192,
      "dock": 37,
      "bike": 30,
      "name": "Old Street Station, St. Luke's",
      "lat": 51.525726,
      "lon": -0.088486
    },
    {
      "dock_id": 193,
      "dock": 36,
      "bike": 24,
      "name": "South Quay East, Canary Wharf",
      "lat": 51.50196,
      "lon": -0.016251
    },
    {
      "dock_id": 194,
      "dock": 36,
      "bike": 14,
      "name": "Greenland Road, Camden Town",
      "lat": 51.539099,
      "lon": -0.141728
    },
    {
      "dock_id": 195,
      "dock": 27,
      "bike": 11,
      "name": "Sedding Street, Sloane Square",
      "lat": 51.49313,
      "lon": -0.156876
    },
    {
      "dock_id": 196,
      "dock": 22,
      "bike": 10,
      "name": "Queen Street 1, Bank",
      "lat": 51.511553,
      "lon": -0.09294
    },
    {
      "dock_id": 197,
      "dock": 35,
      "bike": 13,
      "name": "Hartington Road, Stockwell",
      "lat": 51.47787,
      "lon": -0.126874
    },
    {
      "dock_id": 198,
      "dock": 21,
      "bike": 20,
      "name": "Bruton Street, Mayfair",
      "lat": 51.510736,
      "lon": -0.144165
    },
    {
      "dock_id": 199,
      "dock": 18,
      "bike": 5,
      "name": "St. Martin's Street, West End",
      "lat": 51.509087,
      "lon": -0.129697
    },
    {
      "dock_id": 200,
      "dock": 37,
      "bike": 14,
      "name": "Southwark Station 1, Southwark",
      "lat": 51.504043,
      "lon": -0.105312
    },
    {
      "dock_id": 201,
      "dock": 25,
      "bike": 15,
      "name": "Harriet Street, Knightsbridge",
      "lat": 51.500241,
      "lon": -0.15934
    },
    {
      "dock_id": 202,
      "dock": 24,
      "bike": 15,
      "name": "Woodstock Grove, Shepherd's Bush",
      "lat": 51.504038,
      "lon": -0.2174
    },
    {
      "dock_id": 203,
      "dock": 24,
      "bike": 11,
      "name": "Millbank Tower, Pimlico",
      "lat": 51.491884,
      "lon": -0.125674
    },
    {
      "dock_id": 204,
      "dock": 28,
      "bike": 26,
      "name": "Park Lane , Hyde Park",
      "lat": 51.510017,
      "lon": -0.157275
    },
    {
      "dock_id": 205,
      "dock": 40,
      "bike": 21,
      "name": "Podium, Queen Elizabeth Olympic Park",
      "lat": 51.538718,
      "lon": -0.011889
    },
    {
      "dock_id": 207,
      "dock": 56,
      "bike": 44,
      "name": "Hop Exchange, The Borough",
      "lat": 51.504627,
      "lon": -0.091773
    },
    {
      "dock_id": 208,
      "dock": 27,
      "bike": 0,
      "name": "Bevington Road, North Kensington",
      "lat": 51.520069,
      "lon": -0.206338
    },
    {
      "dock_id": 209,
      "dock": 21,
      "bike": 11,
      "name": "Northdown Street, King's Cross",
      "lat": 51.531066,
      "lon": -0.11934
    },
    {
      "dock_id": 210,
      "dock": 24,
      "bike": 6,
      "name": "Liverpool Road (N1 Centre), Angel",
      "lat": 51.534504,
      "lon": -0.106992
    },
    {
      "dock_id": 211,
      "dock": 45,
      "bike": 30,
      "name": "Queen Mary's, Mile End",
      "lat": 51.522507,
      "lon": -0.041378
    },
    {
      "dock_id": 212,
      "dock": 26,
      "bike": 8,
      "name": "William IV Street, Strand",
      "lat": 51.509462,
      "lon": -0.124749
    },
    {
      "dock_id": 213,
      "dock": 15,
      "bike": 2,
      "name": "Marloes Road, Kensington",
      "lat": 51.496481,
      "lon": -0.192404
    },
    {
      "dock_id": 214,
      "dock": 36,
      "bike": 6,
      "name": "New Road 1 , Whitechapel",
      "lat": 51.518154,
      "lon": -0.062697
    },
    {
      "dock_id": 215,
      "dock": 16,
      "bike": 7,
      "name": "Pembridge Villas, Notting Hill",
      "lat": 51.511084,
      "lon": -0.197524
    },
    {
      "dock_id": 216,
      "dock": 43,
      "bike": 7,
      "name": "Knightsbridge, Hyde Park",
      "lat": 51.502757,
      "lon": -0.155349
    },
    {
      "dock_id": 217,
      "dock": 18,
      "bike": 2,
      "name": "Drayton Gardens, West Chelsea",
      "lat": 51.487196,
      "lon": -0.179369
    },
    {
      "dock_id": 218,
      "dock": 16,
      "bike": 5,
      "name": "South Wharf Road, Paddington",
      "lat": 51.517335,
      "lon": -0.17581
    },
    {
      "dock_id": 219,
      "dock": 49,
      "bike": 49,
      "name": "Malet Street, Bloomsbury",
      "lat": 51.52168,
      "lon": -0.130431
    },
    {
      "dock_id": 220,
      "dock": 20,
      "bike": 0,
      "name": "Lambeth North Station, Waterloo",
      "lat": 51.49914,
      "lon": -0.112031
    },
    {
      "dock_id": 221,
      "dock": 27,
      "bike": 4,
      "name": "Crabtree Lane, Fulham",
      "lat": 51.482944,
      "lon": -0.219346
    },
    {
      "dock_id": 222,
      "dock": 24,
      "bike": 21,
      "name": "Albert Embankment, Vauxhall",
      "lat": 51.490435,
      "lon": -0.122806
    },
    {
      "dock_id": 224,
      "dock": 30,
      "bike": 5,
      "name": "Clapham Road, Lingham Street, Stockwell",
      "lat": 51.471433,
      "lon": -0.12367
    },
    {
      "dock_id": 225,
      "dock": 18,
      "bike": 7,
      "name": "Concert Hall Approach 2, South Bank",
      "lat": 51.504942,
      "lon": -0.115533
    },
    {
      "dock_id": 226,
      "dock": 21,
      "bike": 17,
      "name": "Storey's Gate, Westminster",
      "lat": 51.500703,
      "lon": -0.129698
    },
    {
      "dock_id": 227,
      "dock": 33,
      "bike": 11,
      "name": "Teviot Street, Poplar",
      "lat": 51.518811,
      "lon": -0.011662
    },
    {
      "dock_id": 228,
      "dock": 19,
      "bike": 5,
      "name": "Lexham Gardens, Kensington",
      "lat": 51.495866,
      "lon": -0.191933
    },
    {
      "dock_id": 229,
      "dock": 25,
      "bike": 22,
      "name": "Bayley Street , Bloomsbury",
      "lat": 51.518587,
      "lon": -0.132053
    },
    {
      "dock_id": 230,
      "dock": 20,
      "bike": 12,
      "name": "Globe Town Market, Bethnal Green",
      "lat": 51.528869,
      "lon": -0.047548
    },
    {
      "dock_id": 231,
      "dock": 27,
      "bike": 6,
      "name": "Battersea Power Station, Battersea Park",
      "lat": 51.483507,
      "lon": -0.147714
    },
    {
      "dock_id": 232,
      "dock": 16,
      "bike": 5,
      "name": "Paddington Street, Marylebone",
      "lat": 51.520583,
      "lon": -0.154701
    },
    {
      "dock_id": 233,
      "dock": 19,
      "bike": 4,
      "name": "Vincent Square, Westminster",
      "lat": 51.493985,
      "lon": -0.136928
    },
    {
      "dock_id": 234,
      "dock": 56,
      "bike": 28,
      "name": "Parsons Green Station, Parsons Green",
      "lat": 51.475089,
      "lon": -0.201968
    },
    {
      "dock_id": 235,
      "dock": 19,
      "bike": 12,
      "name": "Barbican Centre, Barbican",
      "lat": 51.520044,
      "lon": -0.092176
    },
    {
      "dock_id": 236,
      "dock": 41,
      "bike": 38,
      "name": "Shoreditch High Street, Shoreditch",
      "lat": 51.526377,
      "lon": -0.07813
    },
    {
      "dock_id": 237,
      "dock": 41,
      "bike": 37,
      "name": "Somerset House, Strand",
      "lat": 51.509943,
      "lon": -0.117619
    },
    {
      "dock_id": 238,
      "dock": 18,
      "bike": 16,
      "name": "Earnshaw Street , Covent Garden",
      "lat": 51.516118,
      "lon": -0.128585
    },
    {
      "dock_id": 239,
      "dock": 21,
      "bike": 1,
      "name": "Elysium Place, Fulham",
      "lat": 51.471079,
      "lon": -0.207842
    },
    {
      "dock_id": 240,
      "dock": 24,
      "bike": 23,
      "name": "Euston Road, Euston",
      "lat": 51.526236,
      "lon": -0.134407
    },
    {
      "dock_id": 241,
      "dock": 29,
      "bike": 9,
      "name": "Coram Street, Bloomsbury",
      "lat": 51.524,
      "lon": -0.126409
    },
    {
      "dock_id": 242,
      "dock": 21,
      "bike": 2,
      "name": "Turquoise Island, Notting Hill",
      "lat": 51.514311,
      "lon": -0.200838
    },
    {
      "dock_id": 243,
      "dock": 32,
      "bike": 17,
      "name": "Normandy Road, Stockwell",
      "lat": 51.473874,
      "lon": -0.11258
    },
    {
      "dock_id": 244,
      "dock": 22,
      "bike": 20,
      "name": "Monument Street, Monument",
      "lat": 51.50964,
      "lon": -0.08497
    },
    {
      "dock_id": 245,
      "dock": 16,
      "bike": 2,
      "name": "Pancras Road, King's Cross",
      "lat": 51.534123,
      "lon": -0.129386
    },
    {
      "dock_id": 246,
      "dock": 20,
      "bike": 19,
      "name": "Crinan Street, King's Cross",
      "lat": 51.534474,
      "lon": -0.122203
    },
    {
      "dock_id": 247,
      "dock": 32,
      "bike": 7,
      "name": "Endsleigh Gardens, Euston",
      "lat": 51.526838,
      "lon": -0.130504
    },
    {
      "dock_id": 248,
      "dock": 17,
      "bike": 13,
      "name": "Gower Place , Euston",
      "lat": 51.525227,
      "lon": -0.135188
    },
    {
      "dock_id": 249,
      "dock": 35,
      "bike": 0,
      "name": "Timber Lodge, Queen Elizabeth Olympic Park",
      "lat": 51.546805,
      "lon": -0.014691
    },
    {
      "dock_id": 250,
      "dock": 30,
      "bike": 28,
      "name": "Milroy Walk, South Bank",
      "lat": 51.507244,
      "lon": -0.106237
    },
    {
      "dock_id": 251,
      "dock": 15,
      "bike": 13,
      "name": "Ontario Street, Elephant & Castle",
      "lat": 51.49652,
      "lon": -0.101384
    },
    {
      "dock_id": 252,
      "dock": 45,
      "bike": 12,
      "name": "Webber Street , Southwark",
      "lat": 51.500693,
      "lon": -0.102091
    },
    {
      "dock_id": 253,
      "dock": 33,
      "bike": 12,
      "name": "Walworth Road, Elephant & Castle",
      "lat": 51.493372,
      "lon": -0.09968
    },
    {
      "dock_id": 254,
      "dock": 15,
      "bike": 4,
      "name": "South Kensington Station, South Kensington",
      "lat": 51.494412,
      "lon": -0.173881
    },
    {
      "dock_id": 255,
      "dock": 28,
      "bike": 25,
      "name": "Morie Street, Wandsworth",
      "lat": 51.459953,
      "lon": -0.190184
    },
    {
      "dock_id": 256,
      "dock": 18,
      "bike": 16,
      "name": "Manresa Road, Chelsea",
      "lat": 51.486892,
      "lon": -0.170983
    },
    {
      "dock_id": 257,
      "dock": 23,
      "bike": 6,
      "name": "Kennington Station, Kennington",
      "lat": 51.488852,
      "lon": -0.105593
    },
    {
      "dock_id": 258,
      "dock": 16,
      "bike": 7,
      "name": "Bank of England Museum, Bank",
      "lat": 51.514441,
      "lon": -0.087587
    },
    {
      "dock_id": 259,
      "dock": 15,
      "bike": 1,
      "name": "Kennington Lane Tesco, Vauxhall",
      "lat": 51.486779,
      "lon": -0.115853
    },
    {
      "dock_id": 260,
      "dock": 37,
      "bike": 23,
      "name": "Imperial Road, Sands End",
      "lat": 51.475142,
      "lon": -0.187278
    },
    {
      "dock_id": 261,
      "dock": 36,
      "bike": 4,
      "name": "Rainville Road, Hammersmith",
      "lat": 51.483732,
      "lon": -0.223852
    },
    {
      "dock_id": 262,
      "dock": 41,
      "bike": 29,
      "name": "Buxton Street 1, Shoreditch",
      "lat": 51.521776,
      "lon": -0.068856
    },
    {
      "dock_id": 263,
      "dock": 28,
      "bike": 18,
      "name": "Macclesfield Rd, St Lukes",
      "lat": 51.529423,
      "lon": -0.097122
    },
    {
      "dock_id": 264,
      "dock": 17,
      "bike": 6,
      "name": "Union Street, The Borough",
      "lat": 51.503688,
      "lon": -0.098497
    },
    {
      "dock_id": 265,
      "dock": 30,
      "bike": 8,
      "name": "Pritchard's Road, Bethnal Green",
      "lat": 51.532091,
      "lon": -0.06142
    },
    {
      "dock_id": 266,
      "dock": 17,
      "bike": 12,
      "name": "Southern Grove, Bow",
      "lat": 51.523538,
      "lon": -0.030556
    },
    {
      "dock_id": 267,
      "dock": 32,
      "bike": 12,
      "name": "London Zoo,  The Regent's Park",
      "lat": 51.535836,
      "lon": -0.156285
    },
    {
      "dock_id": 268,
      "dock": 14,
      "bike": 9,
      "name": "Alderney Street, Pimlico",
      "lat": 51.488057,
      "lon": -0.140741
    },
    {
      "dock_id": 269,
      "dock": 42,
      "bike": 9,
      "name": "Royal London Hospital, Whitechapel",
      "lat": 51.519064,
      "lon": -0.059642
    },
    {
      "dock_id": 270,
      "dock": 30,
      "bike": 13,
      "name": "Ferndale Road, Brixton. ",
      "lat": 51.464019,
      "lon": -0.115781
    },
    {
      "dock_id": 271,
      "dock": 28,
      "bike": 15,
      "name": "Pitfield Street North,Hoxton",
      "lat": 51.53558,
      "lon": -0.08249
    },
    {
      "dock_id": 272,
      "dock": 26,
      "bike": 19,
      "name": "Riverlight South, Nine Elms",
      "lat": 51.481335,
      "lon": -0.138212
    },
    {
      "dock_id": 273,
      "dock": 18,
      "bike": 11,
      "name": "Butler Place, Westminster",
      "lat": 51.497829,
      "lon": -0.13544
    },
    {
      "dock_id": 274,
      "dock": 23,
      "bike": 19,
      "name": "Montserrat Road , Putney",
      "lat": 51.463211,
      "lon": -0.21555
    },
    {
      "dock_id": 275,
      "dock": 30,
      "bike": 3,
      "name": "Gwendwr Road, West Kensington",
      "lat": 51.491026,
      "lon": -0.209121
    },
    {
      "dock_id": 276,
      "dock": 27,
      "bike": 0,
      "name": "Vauxhall Walk, Vauxhall",
      "lat": 51.488124,
      "lon": -0.120903
    },
    {
      "dock_id": 277,
      "dock": 20,
      "bike": 0,
      "name": "Wapping High Street, Wapping",
      "lat": 51.504904,
      "lon": -0.06797
    },
    {
      "dock_id": 278,
      "dock": 17,
      "bike": 1,
      "name": "Selby Street, Whitechapel",
      "lat": 51.521905,
      "lon": -0.063386
    },
    {
      "dock_id": 279,
      "dock": 37,
      "bike": 18,
      "name": "Granby Street, Shoreditch",
      "lat": 51.525645,
      "lon": -0.069543
    },
    {
      "dock_id": 280,
      "dock": 33,
      "bike": 26,
      "name": "Little Brook Green, Brook Green",
      "lat": 51.496664,
      "lon": -0.223868
    },
    {
      "dock_id": 281,
      "dock": 24,
      "bike": 5,
      "name": "Bethnal Green Garden, Bethnal Green",
      "lat": 51.52568,
      "lon": -0.055312
    },
    {
      "dock_id": 282,
      "dock": 24,
      "bike": 1,
      "name": "St. Peter's Terrace, Fulham",
      "lat": 51.478939,
      "lon": -0.208485
    },
    {
      "dock_id": 283,
      "dock": 37,
      "bike": 29,
      "name": "Wells Street, Fitzrovia ",
      "lat": 51.517344,
      "lon": -0.138072
    },
    {
      "dock_id": 284,
      "dock": 24,
      "bike": 22,
      "name": "Clifton Street, Shoreditch",
      "lat": 51.523196,
      "lon": -0.083067
    },
    {
      "dock_id": 285,
      "dock": 36,
      "bike": 2,
      "name": "Kennington Road  , Vauxhall",
      "lat": 51.495718,
      "lon": -0.110889
    },
    {
      "dock_id": 286,
      "dock": 15,
      "bike": 8,
      "name": "Snow Hill, Farringdon",
      "lat": 51.517334,
      "lon": -0.103604
    },
    {
      "dock_id": 287,
      "dock": 36,
      "bike": 15,
      "name": "Spindrift Avenue, Millwall",
      "lat": 51.49109,
      "lon": -0.018716
    },
    {
      "dock_id": 288,
      "dock": 40,
      "bike": 17,
      "name": "St. James's Square, St. James's",
      "lat": 51.507424,
      "lon": -0.134621
    },
    {
      "dock_id": 289,
      "dock": 19,
      "bike": 1,
      "name": "Driffield Road, Old Ford",
      "lat": 51.534137,
      "lon": -0.037366
    },
    {
      "dock_id": 290,
      "dock": 20,
      "bike": 3,
      "name": "Princedale Road , Holland Park",
      "lat": 51.506465,
      "lon": -0.208486
    },
    {
      "dock_id": 292,
      "dock": 45,
      "bike": 8,
      "name": "Union Grove, Wandsworth Road",
      "lat": 51.472993,
      "lon": -0.133972
    },
    {
      "dock_id": 293,
      "dock": 30,
      "bike": 2,
      "name": "Wandsworth Rd, Isley Court, Wandsworth Road",
      "lat": 51.469259,
      "lon": -0.141812
    },
    {
      "dock_id": 294,
      "dock": 36,
      "bike": 15,
      "name": "Tyers Gate, Bermondsey",
      "lat": 51.500889,
      "lon": -0.083159
    },
    {
      "dock_id": 295,
      "dock": 38,
      "bike": 10,
      "name": "Bethnal Green Road, Shoreditch",
      "lat": 51.523648,
      "lon": -0.074754
    },
    {
      "dock_id": 296,
      "dock": 27,
      "bike": 15,
      "name": "Golden Lane, Barbican",
      "lat": 51.521747,
      "lon": -0.094475
    },
    {
      "dock_id": 297,
      "dock": 20,
      "bike": 5,
      "name": "Paddington Green, Paddington",
      "lat": 51.520205,
      "lon": -0.174593
    },
    {
      "dock_id": 298,
      "dock": 33,
      "bike": 16,
      "name": "Disraeli Road, Putney",
      "lat": 51.46161,
      "lon": -0.216145
    },
    {
      "dock_id": 299,
      "dock": 35,
      "bike": 3,
      "name": "Vauxhall Bridge , Pimlico",
      "lat": 51.488365,
      "lon": -0.129361
    },
    {
      "dock_id": 300,
      "dock": 33,
      "bike": 2,
      "name": "Great Dover Street, The Borough",
      "lat": 51.497382,
      "lon": -0.089446
    },
    {
      "dock_id": 301,
      "dock": 24,
      "bike": 1,
      "name": "Halford Road, West Kensington",
      "lat": 51.483911,
      "lon": -0.197609
    },
    {
      "dock_id": 302,
      "dock": 34,
      "bike": 10,
      "name": "Christian Street, Whitechapel",
      "lat": 51.513074,
      "lon": -0.064094
    },
    {
      "dock_id": 303,
      "dock": 30,
      "bike": 8,
      "name": "Hardwick Street, Clerkenwell",
      "lat": 51.527842,
      "lon": -0.108068
    },
    {
      "dock_id": 304,
      "dock": 24,
      "bike": 0,
      "name": "Arlington Road, Camden Town",
      "lat": 51.539957,
      "lon": -0.145246
    },
    {
      "dock_id": 305,
      "dock": 27,
      "bike": 0,
      "name": "Triangle Car Park, Hyde Park",
      "lat": 51.506451,
      "lon": -0.170279
    },
    {
      "dock_id": 306,
      "dock": 48,
      "bike": 21,
      "name": "Belgrove Street , King's Cross",
      "lat": 51.529943,
      "lon": -0.123616
    },
    {
      "dock_id": 307,
      "dock": 24,
      "bike": 4,
      "name": "Kings Gate House, Westminster",
      "lat": 51.497698,
      "lon": -0.137598
    },
    {
      "dock_id": 308,
      "dock": 16,
      "bike": 11,
      "name": "Aberfeldy Street, Poplar",
      "lat": 51.513548,
      "lon": -0.005659
    },
    {
      "dock_id": 309,
      "dock": 41,
      "bike": 21,
      "name": "Embankment (Savoy), Strand",
      "lat": 51.509631,
      "lon": -0.119047
    },
    {
      "dock_id": 310,
      "dock": 27,
      "bike": 9,
      "name": "Swan Street, The Borough",
      "lat": 51.500296,
      "lon": -0.092762
    },
    {
      "dock_id": 311,
      "dock": 19,
      "bike": 19,
      "name": "Great Titchfield Street, Fitzrovia",
      "lat": 51.520253,
      "lon": -0.141327
    },
    {
      "dock_id": 312,
      "dock": 31,
      "bike": 17,
      "name": "Poured Lines, Bankside",
      "lat": 51.506692,
      "lon": -0.103137
    },
    {
      "dock_id": 313,
      "dock": 24,
      "bike": 23,
      "name": "Pont Street, Knightsbridge",
      "lat": 51.496886,
      "lon": -0.161203
    },
    {
      "dock_id": 314,
      "dock": 35,
      "bike": 15,
      "name": "Binfield Road, Stockwell",
      "lat": 51.472509,
      "lon": -0.122831
    },
    {
      "dock_id": 315,
      "dock": 29,
      "bike": 22,
      "name": "Oxford Road, Putney",
      "lat": 51.460792,
      "lon": -0.212607
    },
    {
      "dock_id": 316,
      "dock": 37,
      "bike": 8,
      "name": "Palace Gardens Terrace, Notting Hill",
      "lat": 51.508605,
      "lon": -0.193764
    },
    {
      "dock_id": 317,
      "dock": 32,
      "bike": 15,
      "name": "Guilford Street , Bloomsbury",
      "lat": 51.523346,
      "lon": -0.120202
    },
    {
      "dock_id": 318,
      "dock": 26,
      "bike": 20,
      "name": "Beryl Road, Hammersmith",
      "lat": 51.488144,
      "lon": -0.222456
    },
    {
      "dock_id": 319,
      "dock": 33,
      "bike": 2,
      "name": "New Kent Road, The Borough",
      "lat": 51.494436,
      "lon": -0.092921
    },
    {
      "dock_id": 320,
      "dock": 16,
      "bike": 0,
      "name": "Nesham Street, Wapping",
      "lat": 51.507131,
      "lon": -0.06691
    },
    {
      "dock_id": 321,
      "dock": 40,
      "bike": 13,
      "name": "Paddington Green Police Station, Paddington",
      "lat": 51.519943,
      "lon": -0.170704
    },
    {
      "dock_id": 322,
      "dock": 18,
      "bike": 11,
      "name": "Bell Street , Marylebone",
      "lat": 51.522029,
      "lon": -0.165842
    },
    {
      "dock_id": 323,
      "dock": 24,
      "bike": 4,
      "name": "Ilchester Place, Kensington",
      "lat": 51.500743,
      "lon": -0.202759
    },
    {
      "dock_id": 324,
      "dock": 31,
      "bike": 1,
      "name": "Everington Street, Fulham",
      "lat": 51.483356,
      "lon": -0.216305
    },
    {
      "dock_id": 325,
      "dock": 21,
      "bike": 4,
      "name": "Rifle Place, Avondale",
      "lat": 51.509224,
      "lon": -0.216016
    },
    {
      "dock_id": 326,
      "dock": 20,
      "bike": 4,
      "name": "Holden Street, Battersea",
      "lat": 51.46879,
      "lon": -0.15823
    },
    {
      "dock_id": 327,
      "dock": 21,
      "bike": 16,
      "name": "South Lambeth Road, Vauxhall",
      "lat": 51.481747,
      "lon": -0.124642
    },
    {
      "dock_id": 328,
      "dock": 18,
      "bike": 15,
      "name": "Sackville Street, Mayfair",
      "lat": 51.510048,
      "lon": -0.138846
    },
    {
      "dock_id": 329,
      "dock": 27,
      "bike": 15,
      "name": "York Hall, Bethnal Green",
      "lat": 51.528936,
      "lon": -0.055894
    },
    {
      "dock_id": 330,
      "dock": 18,
      "bike": 6,
      "name": "St Martins Close, Camden Town",
      "lat": 51.538792,
      "lon": -0.138535
    },
    {
      "dock_id": 331,
      "dock": 18,
      "bike": 2,
      "name": "Crawford Street, Marylebone",
      "lat": 51.52026,
      "lon": -0.157183
    },
    {
      "dock_id": 332,
      "dock": 17,
      "bike": 11,
      "name": "Tooley Street, Bermondsey",
      "lat": 51.503493,
      "lon": -0.07962
    },
    {
      "dock_id": 333,
      "dock": 22,
      "bike": 2,
      "name": "Percival Street, Finsbury",
      "lat": 51.526153,
      "lon": -0.102208
    },
    {
      "dock_id": 334,
      "dock": 18,
      "bike": 13,
      "name": "Broadcasting House, Marylebone",
      "lat": 51.518117,
      "lon": -0.144228
    },
    {
      "dock_id": 335,
      "dock": 20,
      "bike": 18,
      "name": "Walnut Tree Walk, Vauxhall",
      "lat": 51.493686,
      "lon": -0.111014
    },
    {
      "dock_id": 336,
      "dock": 43,
      "bike": 31,
      "name": "Leonard Circus , Shoreditch",
      "lat": 51.524696,
      "lon": -0.084439
    },
    {
      "dock_id": 337,
      "dock": 35,
      "bike": 24,
      "name": "British Museum, Bloomsbury",
      "lat": 51.51908,
      "lon": -0.124678
    },
    {
      "dock_id": 338,
      "dock": 13,
      "bike": 8,
      "name": "Rochester Row, Westminster",
      "lat": 51.495827,
      "lon": -0.135478
    },
    {
      "dock_id": 339,
      "dock": 37,
      "bike": 10,
      "name": "Greyhound Road, Hammersmith",
      "lat": 51.486062,
      "lon": -0.214428
    },
    {
      "dock_id": 341,
      "dock": 21,
      "bike": 14,
      "name": "Woodstock Street, Mayfair",
      "lat": 51.514105,
      "lon": -0.147301
    },
    {
      "dock_id": 342,
      "dock": 18,
      "bike": 16,
      "name": "Park Lane, Mayfair",
      "lat": 51.505426,
      "lon": -0.150817
    },
    {
      "dock_id": 343,
      "dock": 33,
      "bike": 26,
      "name": "Kennington Oval, Oval",
      "lat": 51.483145,
      "lon": -0.113134
    },
    {
      "dock_id": 344,
      "dock": 22,
      "bike": 6,
      "name": "Cadogan Close, Victoria Park",
      "lat": 51.542118,
      "lon": -0.028941
    },
    {
      "dock_id": 345,
      "dock": 39,
      "bike": 36,
      "name": "Great Marlborough Street, Soho",
      "lat": 51.514619,
      "lon": -0.137841
    },
    {
      "dock_id": 346,
      "dock": 28,
      "bike": 1,
      "name": "De Vere Gardens, Kensington",
      "lat": 51.501737,
      "lon": -0.18498
    },
    {
      "dock_id": 347,
      "dock": 33,
      "bike": 19,
      "name": "Bouverie Street, Temple",
      "lat": 51.513821,
      "lon": -0.107927
    },
    {
      "dock_id": 348,
      "dock": 31,
      "bike": 16,
      "name": "Clarkson Street, Bethnal Green",
      "lat": 51.528692,
      "lon": -0.059091
    },
    {
      "dock_id": 349,
      "dock": 22,
      "bike": 7,
      "name": "Cartwright Gardens , Bloomsbury",
      "lat": 51.526357,
      "lon": -0.125979
    },
    {
      "dock_id": 350,
      "dock": 24,
      "bike": 11,
      "name": "Bermondsey Street, Bermondsey",
      "lat": 51.497855,
      "lon": -0.081608
    },
    {
      "dock_id": 351,
      "dock": 27,
      "bike": 1,
      "name": "Bayswater Road, Hyde Park",
      "lat": 51.511933,
      "lon": -0.174411
    },
    {
      "dock_id": 352,
      "dock": 22,
      "bike": 8,
      "name": "Exhibition Road Museums, South Kensington",
      "lat": 51.496957,
      "lon": -0.173894
    },
    {
      "dock_id": 353,
      "dock": 36,
      "bike": 22,
      "name": "Queen Street 2, Bank",
      "lat": 51.511246,
      "lon": -0.093051
    },
    {
      "dock_id": 354,
      "dock": 28,
      "bike": 9,
      "name": "Queen's Circus, Battersea Park",
      "lat": 51.477619,
      "lon": -0.149551
    },
    {
      "dock_id": 355,
      "dock": 23,
      "bike": 8,
      "name": "Canton Street, Poplar",
      "lat": 51.511811,
      "lon": -0.025626
    },
    {
      "dock_id": 356,
      "dock": 36,
      "bike": 13,
      "name": "London Zoo Car Park, The Regent's Park",
      "lat": 51.536922,
      "lon": -0.150181
    },
    {
      "dock_id": 357,
      "dock": 32,
      "bike": 20,
      "name": "Hollybush Gardens, Bethnal Green",
      "lat": 51.527607,
      "lon": -0.057133
    },
    {
      "dock_id": 358,
      "dock": 45,
      "bike": 22,
      "name": "Gaywood  Street, Elephant & Castle",
      "lat": 51.49605,
      "lon": -0.104193
    },
    {
      "dock_id": 359,
      "dock": 15,
      "bike": 11,
      "name": "Houghton Street, Strand",
      "lat": 51.51362,
      "lon": -0.116764
    },
    {
      "dock_id": 360,
      "dock": 36,
      "bike": 4,
      "name": "Furze Green, Bow",
      "lat": 51.519265,
      "lon": -0.021345
    },
    {
      "dock_id": 361,
      "dock": 28,
      "bike": 13,
      "name": "Hortensia Road, West Brompton",
      "lat": 51.481765,
      "lon": -0.185273
    },
    {
      "dock_id": 362,
      "dock": 16,
      "bike": 8,
      "name": "Harrowby Street, Marylebone",
      "lat": 51.517372,
      "lon": -0.164207
    },
    {
      "dock_id": 363,
      "dock": 16,
      "bike": 8,
      "name": "Devonshire Terrace, Bayswater",
      "lat": 51.51348,
      "lon": -0.17977
    },
    {
      "dock_id": 364,
      "dock": 23,
      "bike": 12,
      "name": "Great Percy Street, Clerkenwell",
      "lat": 51.528915,
      "lon": -0.11548
    },
    {
      "dock_id": 365,
      "dock": 25,
      "bike": 1,
      "name": "Flamborough Street, Limehouse",
      "lat": 51.512871,
      "lon": -0.038986
    },
    {
      "dock_id": 366,
      "dock": 21,
      "bike": 9,
      "name": "Ampton Street , Clerkenwell",
      "lat": 51.52728,
      "lon": -0.118295
    },
    {
      "dock_id": 367,
      "dock": 24,
      "bike": 0,
      "name": "Aintree Street, Fulham",
      "lat": 51.481021,
      "lon": -0.209973
    },
    {
      "dock_id": 368,
      "dock": 28,
      "bike": 10,
      "name": "Manbre Road, Hammersmith",
      "lat": 51.485743,
      "lon": -0.223616
    },
    {
      "dock_id": 369,
      "dock": 41,
      "bike": 26,
      "name": "Alfred Place, Bloomsbury",
      "lat": 51.519656,
      "lon": -0.132339
    },
    {
      "dock_id": 370,
      "dock": 29,
      "bike": 14,
      "name": "Stebondale Street, Cubitt Town",
      "lat": 51.489096,
      "lon": -0.009205
    },
    {
      "dock_id": 371,
      "dock": 30,
      "bike": 16,
      "name": "Pitfield Street Central, Hoxton",
      "lat": 51.53213,
      "lon": -0.08299
    },
    {
      "dock_id": 372,
      "dock": 27,
      "bike": 11,
      "name": "Heath Road, Battersea",
      "lat": 51.468669,
      "lon": -0.146544
    },
    {
      "dock_id": 373,
      "dock": 24,
      "bike": 6,
      "name": "Harcourt Terrace, West Brompton",
      "lat": 51.487958,
      "lon": -0.187404
    },
    {
      "dock_id": 374,
      "dock": 26,
      "bike": 8,
      "name": "Queen Mother Sports Centre, Victoria",
      "lat": 51.493573,
      "lon": -0.139956
    },
    {
      "dock_id": 375,
      "dock": 18,
      "bike": 0,
      "name": "Kennington Road Post Office, Oval",
      "lat": 51.484788,
      "lon": -0.110683
    },
    {
      "dock_id": 376,
      "dock": 26,
      "bike": 19,
      "name": "Westbourne Grove, Bayswater",
      "lat": 51.515529,
      "lon": -0.19024
    },
    {
      "dock_id": 377,
      "dock": 16,
      "bike": 6,
      "name": "Curzon Street, Mayfair",
      "lat": 51.507069,
      "lon": -0.145904
    },
    {
      "dock_id": 378,
      "dock": 42,
      "bike": 27,
      "name": "Natural History Museum, South Kensington",
      "lat": 51.495592,
      "lon": -0.179077
    },
    {
      "dock_id": 379,
      "dock": 21,
      "bike": 1,
      "name": "Ilchester Gardens, Bayswater",
      "lat": 51.51244,
      "lon": -0.19096
    },
    {
      "dock_id": 380,
      "dock": 42,
      "bike": 38,
      "name": "Blackfriars Road, Southwark",
      "lat": 51.505461,
      "lon": -0.10454
    },
    {
      "dock_id": 381,
      "dock": 18,
      "bike": 13,
      "name": "St. George Street, Mayfair",
      "lat": 51.51196,
      "lon": -0.142783
    },
    {
      "dock_id": 382,
      "dock": 21,
      "bike": 17,
      "name": "Scala Street, Fitzrovia",
      "lat": 51.519914,
      "lon": -0.136039
    },
    {
      "dock_id": 383,
      "dock": 24,
      "bike": 11,
      "name": "Gloucester Avenue, Camden Town",
      "lat": 51.537349,
      "lon": -0.147154
    },
    {
      "dock_id": 384,
      "dock": 14,
      "bike": 13,
      "name": "Charlotte Street, Fitzrovia",
      "lat": 51.51953,
      "lon": -0.135777
    },
    {
      "dock_id": 385,
      "dock": 28,
      "bike": 24,
      "name": "Grant Road Central, Clapham Junction",
      "lat": 51.464688,
      "lon": -0.173656
    },
    {
      "dock_id": 386,
      "dock": 25,
      "bike": 20,
      "name": "St John's Crescent, Brixton",
      "lat": 51.466232,
      "lon": -0.113179
    },
    {
      "dock_id": 387,
      "dock": 24,
      "bike": 0,
      "name": "Brick Lane Market, Shoreditch",
      "lat": 51.522617,
      "lon": -0.071653
    },
    {
      "dock_id": 388,
      "dock": 19,
      "bike": 9,
      "name": "River Street , Clerkenwell",
      "lat": 51.529163,
      "lon": -0.10997
    },
    {
      "dock_id": 389,
      "dock": 18,
      "bike": 7,
      "name": "Bath Street, St. Luke's",
      "lat": 51.525893,
      "lon": -0.090847
    },
    {
      "dock_id": 390,
      "dock": 30,
      "bike": 5,
      "name": "St. John's Park, Cubitt Town",
      "lat": 51.496454,
      "lon": -0.009506
    },
    {
      "dock_id": 391,
      "dock": 30,
      "bike": 8,
      "name": "Philpot Street, Whitechapel",
      "lat": 51.515256,
      "lon": -0.058641
    },
    {
      "dock_id": 392,
      "dock": 26,
      "bike": 20,
      "name": "Theobald's Road , Holborn",
      "lat": 51.520596,
      "lon": -0.116688
    },
    {
      "dock_id": 393,
      "dock": 46,
      "bike": 0,
      "name": "Mostyn Grove, Bow",
      "lat": 51.530535,
      "lon": -0.025492
    },
    {
      "dock_id": 394,
      "dock": 17,
      "bike": 6,
      "name": "Kensington Church Street, Kensington",
      "lat": 51.503157,
      "lon": -0.191496
    },
    {
      "dock_id": 395,
      "dock": 37,
      "bike": 20,
      "name": "Phillimore Gardens, Kensington",
      "lat": 51.499606,
      "lon": -0.197574
    },
    {
      "dock_id": 396,
      "dock": 23,
      "bike": 8,
      "name": "St. Chad's Street, King's Cross",
      "lat": 51.530059,
      "lon": -0.120973
    },
    {
      "dock_id": 397,
      "dock": 16,
      "bike": 1,
      "name": "Charlbert Street, St. John's Wood",
      "lat": 51.5343,
      "lon": -0.168074
    },
    {
      "dock_id": 398,
      "dock": 18,
      "bike": 13,
      "name": "Lodge Road, St. John's Wood",
      "lat": 51.528341,
      "lon": -0.170134
    },
    {
      "dock_id": 399,
      "dock": 19,
      "bike": 15,
      "name": "New Globe Walk, Bankside",
      "lat": 51.507385,
      "lon": -0.09644
    },
    {
      "dock_id": 400,
      "dock": 26,
      "bike": 23,
      "name": "Great Russell Street, Bloomsbury",
      "lat": 51.517727,
      "lon": -0.127854
    },
    {
      "dock_id": 401,
      "dock": 26,
      "bike": 21,
      "name": "Hatton Wall, Holborn",
      "lat": 51.521661,
      "lon": -0.109006
    },
    {
      "dock_id": 402,
      "dock": 30,
      "bike": 3,
      "name": "Taviton Street, Bloomsbury",
      "lat": 51.52505,
      "lon": -0.131161
    },
    {
      "dock_id": 403,
      "dock": 16,
      "bike": 10,
      "name": "Red Lion Square, Holborn",
      "lat": 51.519435,
      "lon": -0.119123
    },
    {
      "dock_id": 404,
      "dock": 19,
      "bike": 13,
      "name": "Bolsover Street, Fitzrovia",
      "lat": 51.523518,
      "lon": -0.143613
    },
    {
      "dock_id": 405,
      "dock": 22,
      "bike": 7,
      "name": "Hereford Road, Bayswater",
      "lat": 51.513735,
      "lon": -0.193487
    },
    {
      "dock_id": 406,
      "dock": 24,
      "bike": 10,
      "name": "Windsor Terrace, Hoxton",
      "lat": 51.529154,
      "lon": -0.093421
    },
    {
      "dock_id": 407,
      "dock": 36,
      "bike": 2,
      "name": "Fanshaw Street, Hoxton",
      "lat": 51.529537,
      "lon": -0.083353
    },
    {
      "dock_id": 408,
      "dock": 18,
      "bike": 5,
      "name": "Central House, Aldgate",
      "lat": 51.5156,
      "lon": -0.070056
    },
    {
      "dock_id": 409,
      "dock": 24,
      "bike": 23,
      "name": "Pindar Street, Liverpool Street",
      "lat": 51.520955,
      "lon": -0.083493
    },
    {
      "dock_id": 410,
      "dock": 28,
      "bike": 17,
      "name": "Wenlock Road , Hoxton",
      "lat": 51.530991,
      "lon": -0.093903
    },
    {
      "dock_id": 411,
      "dock": 26,
      "bike": 6,
      "name": "Boston Place, Marylebone",
      "lat": 51.522511,
      "lon": -0.162298
    },
    {
      "dock_id": 412,
      "dock": 19,
      "bike": 4,
      "name": "Warwick Avenue Station, Maida Vale",
      "lat": 51.523344,
      "lon": -0.183846
    },
    {
      "dock_id": 413,
      "dock": 25,
      "bike": 12,
      "name": "Godliman Street, St. Paul's",
      "lat": 51.512484,
      "lon": -0.099141
    },
    {
      "dock_id": 414,
      "dock": 27,
      "bike": 15,
      "name": "East Road, Hoxton",
      "lat": 51.528673,
      "lon": -0.087459
    },
    {
      "dock_id": 415,
      "dock": 18,
      "bike": 7,
      "name": "Grafton Street, Mayfair",
      "lat": 51.509992,
      "lon": -0.143495
    },
    {
      "dock_id": 416,
      "dock": 33,
      "bike": 30,
      "name": "Finsbury Circus, Liverpool Street",
      "lat": 51.517075,
      "lon": -0.086685
    },
    {
      "dock_id": 417,
      "dock": 20,
      "bike": 6,
      "name": "New Inn Yard, Shoreditch",
      "lat": 51.524526,
      "lon": -0.079248
    },
    {
      "dock_id": 418,
      "dock": 18,
      "bike": 15,
      "name": "Lisson Grove, St. John's Wood",
      "lat": 51.526448,
      "lon": -0.17219
    },
    {
      "dock_id": 419,
      "dock": 24,
      "bike": 7,
      "name": "Cotton Garden Estate, Kennington",
      "lat": 51.490757,
      "lon": -0.106323
    },
    {
      "dock_id": 420,
      "dock": 27,
      "bike": 4,
      "name": "Murray Grove , Hoxton",
      "lat": 51.53089,
      "lon": -0.089782
    },
    {
      "dock_id": 421,
      "dock": 40,
      "bike": 18,
      "name": "Holborn Circus, Holborn",
      "lat": 51.51795,
      "lon": -0.108657
    },
    {
      "dock_id": 422,
      "dock": 16,
      "bike": 5,
      "name": "Farringdon Lane, Clerkenwell",
      "lat": 51.52352,
      "lon": -0.10834
    },
    {
      "dock_id": 423,
      "dock": 19,
      "bike": 0,
      "name": "Torrens Street, Angel",
      "lat": 51.532199,
      "lon": -0.10548
    },
    {
      "dock_id": 424,
      "dock": 21,
      "bike": 12,
      "name": "Longford Street, The Regent's Park",
      "lat": 51.525595,
      "lon": -0.144083
    },
    {
      "dock_id": 425,
      "dock": 26,
      "bike": 7,
      "name": "Russell Square Station, Bloomsbury",
      "lat": 51.523418,
      "lon": -0.124121
    },
    {
      "dock_id": 426,
      "dock": 17,
      "bike": 5,
      "name": "Sadlers Sports Centre, Finsbury",
      "lat": 51.524868,
      "lon": -0.099489
    },
    {
      "dock_id": 427,
      "dock": 18,
      "bike": 11,
      "name": "Arundel Street, Temple",
      "lat": 51.511726,
      "lon": -0.113855
    },
    {
      "dock_id": 428,
      "dock": 41,
      "bike": 19,
      "name": "Tanner Street, Bermondsey",
      "lat": 51.500647,
      "lon": -0.0786
    },
    {
      "dock_id": 429,
      "dock": 24,
      "bike": 9,
      "name": "Sancroft Street, Vauxhall",
      "lat": 51.489479,
      "lon": -0.115156
    },
    {
      "dock_id": 430,
      "dock": 27,
      "bike": 13,
      "name": "Harrington Square 1, Camden Town",
      "lat": 51.533019,
      "lon": -0.139174
    },
    {
      "dock_id": 431,
      "dock": 41,
      "bike": 10,
      "name": "Borough Road, Elephant & Castle",
      "lat": 51.498898,
      "lon": -0.10044
    },
    {
      "dock_id": 432,
      "dock": 15,
      "bike": 0,
      "name": "Aldersgate Street, Barbican",
      "lat": 51.520841,
      "lon": -0.09734
    },
    {
      "dock_id": 433,
      "dock": 26,
      "bike": 12,
      "name": "Falkirk Street, Hoxton",
      "lat": 51.53095,
      "lon": -0.078505
    },
    {
      "dock_id": 434,
      "dock": 18,
      "bike": 12,
      "name": "Gloucester Road (North), Kensington",
      "lat": 51.497924,
      "lon": -0.183834
    },
    {
      "dock_id": 435,
      "dock": 54,
      "bike": 31,
      "name": "Hampstead Road, Euston",
      "lat": 51.525542,
      "lon": -0.138231
    },
    {
      "dock_id": 436,
      "dock": 16,
      "bike": 15,
      "name": "Old Quebec Street, Marylebone",
      "lat": 51.514577,
      "lon": -0.158264
    },
    {
      "dock_id": 437,
      "dock": 17,
      "bike": 14,
      "name": "Jewry Street, Aldgate",
      "lat": 51.513406,
      "lon": -0.076793
    },
    {
      "dock_id": 438,
      "dock": 34,
      "bike": 33,
      "name": "Crosswall, Tower",
      "lat": 51.511594,
      "lon": -0.077121
    },
    {
      "dock_id": 439,
      "dock": 20,
      "bike": 7,
      "name": "Finsbury Leisure Centre, St. Luke's",
      "lat": 51.526008,
      "lon": -0.096317
    },
    {
      "dock_id": 440,
      "dock": 29,
      "bike": 17,
      "name": "Abbey Orchard Street, Westminster",
      "lat": 51.498125,
      "lon": -0.132102
    },
    {
      "dock_id": 441,
      "dock": 17,
      "bike": 1,
      "name": "Wellington Road, St. John's Wood",
      "lat": 51.533043,
      "lon": -0.172528
    },
    {
      "dock_id": 442,
      "dock": 19,
      "bike": 4,
      "name": "Gloucester Road (Central), South Kensington",
      "lat": 51.496462,
      "lon": -0.183289
    },
    {
      "dock_id": 444,
      "dock": 21,
      "bike": 19,
      "name": "Little Argyll Street, West End",
      "lat": 51.514499,
      "lon": -0.141423
    },
    {
      "dock_id": 445,
      "dock": 25,
      "bike": 9,
      "name": "Lollard Street, Vauxhall",
      "lat": 51.49288,
      "lon": -0.114934
    },
    {
      "dock_id": 446,
      "dock": 17,
      "bike": 10,
      "name": "The Guildhall, Guildhall",
      "lat": 51.515735,
      "lon": -0.09308
    },
    {
      "dock_id": 447,
      "dock": 22,
      "bike": 5,
      "name": "Baker Street, Marylebone",
      "lat": 51.518913,
      "lon": -0.156166
    },
    {
      "dock_id": 448,
      "dock": 18,
      "bike": 3,
      "name": "St. John Street, Finsbury",
      "lat": 51.52836,
      "lon": -0.104724
    },
    {
      "dock_id": 449,
      "dock": 20,
      "bike": 8,
      "name": "Eaton Square, Belgravia",
      "lat": 51.496544,
      "lon": -0.150905
    },
    {
      "dock_id": 450,
      "dock": 21,
      "bike": 17,
      "name": "Borough High Street, The Borough",
      "lat": 51.500694,
      "lon": -0.094524
    },
    {
      "dock_id": 451,
      "dock": 52,
      "bike": 46,
      "name": "Museum of London, Barbican",
      "lat": 51.517821,
      "lon": -0.096496
    },
    {
      "dock_id": 452,
      "dock": 17,
      "bike": 16,
      "name": "Wood Street, Guildhall",
      "lat": 51.517008,
      "lon": -0.093885
    },
    {
      "dock_id": 453,
      "dock": 22,
      "bike": 15,
      "name": "Emperor's Gate, South Kensington",
      "lat": 51.495362,
      "lon": -0.185296
    },
    {
      "dock_id": 454,
      "dock": 18,
      "bike": 10,
      "name": "Golden Square, Soho",
      "lat": 51.511897,
      "lon": -0.137043
    },
    {
      "dock_id": 455,
      "dock": 16,
      "bike": 1,
      "name": "Eversholt Street , Camden Town",
      "lat": 51.533005,
      "lon": -0.136792
    },
    {
      "dock_id": 456,
      "dock": 18,
      "bike": 11,
      "name": "Derry Street, Kensington",
      "lat": 51.501364,
      "lon": -0.191462
    },
    {
      "dock_id": 457,
      "dock": 21,
      "bike": 15,
      "name": "Clerkenwell Green, Clerkenwell",
      "lat": 51.52326,
      "lon": -0.104708
    },
    {
      "dock_id": 458,
      "dock": 19,
      "bike": 3,
      "name": "Green Street, Mayfair",
      "lat": 51.512276,
      "lon": -0.157436
    },
    {
      "dock_id": 459,
      "dock": 18,
      "bike": 4,
      "name": "Lambeth Road, Vauxhall",
      "lat": 51.494881,
      "lon": -0.117974
    },
    {
      "dock_id": 460,
      "dock": 29,
      "bike": 17,
      "name": "Chapel Place, Marylebone",
      "lat": 51.515308,
      "lon": -0.147203
    },
    {
      "dock_id": 461,
      "dock": 24,
      "bike": 0,
      "name": "West Cromwell Road, Earl's Court",
      "lat": 51.493724,
      "lon": -0.198286
    },
    {
      "dock_id": 462,
      "dock": 26,
      "bike": 8,
      "name": "Chepstow Villas, Notting Hill",
      "lat": 51.512136,
      "lon": -0.201554
    },
    {
      "dock_id": 463,
      "dock": 21,
      "bike": 10,
      "name": "Hampton Street, Walworth",
      "lat": 51.49217,
      "lon": -0.101536
    },
    {
      "dock_id": 464,
      "dock": 37,
      "bike": 36,
      "name": "Wright's Lane, Kensington",
      "lat": 51.500397,
      "lon": -0.193068
    },
    {
      "dock_id": 465,
      "dock": 16,
      "bike": 8,
      "name": "Guildhouse Street, Victoria",
      "lat": 51.492345,
      "lon": -0.141334
    },
    {
      "dock_id": 467,
      "dock": 16,
      "bike": 8,
      "name": "Cleveland Gardens, Bayswater",
      "lat": 51.515607,
      "lon": -0.183118
    },
    {
      "dock_id": 468,
      "dock": 15,
      "bike": 3,
      "name": "Orsett Terrace, Bayswater",
      "lat": 51.517932,
      "lon": -0.183716
    },
    {
      "dock_id": 469,
      "dock": 27,
      "bike": 22,
      "name": "Seville Street, Knightsbridge",
      "lat": 51.501855,
      "lon": -0.159237
    },
    {
      "dock_id": 470,
      "dock": 19,
      "bike": 4,
      "name": "Eccleston Place, Victoria",
      "lat": 51.49395,
      "lon": -0.147624
    },
    {
      "dock_id": 471,
      "dock": 19,
      "bike": 3,
      "name": "Argyll Road, Kensington",
      "lat": 51.500401,
      "lon": -0.195455
    },
    {
      "dock_id": 472,
      "dock": 18,
      "bike": 9,
      "name": "Porchester Place, Paddington",
      "lat": 51.514746,
      "lon": -0.165164
    },
    {
      "dock_id": 473,
      "dock": 14,
      "bike": 5,
      "name": "Collingham Gardens, Earl's Court",
      "lat": 51.491615,
      "lon": -0.186753
    },
    {
      "dock_id": 474,
      "dock": 19,
      "bike": 13,
      "name": "Sumner Place, South Kensington",
      "lat": 51.491211,
      "lon": -0.173715
    },
    {
      "dock_id": 475,
      "dock": 36,
      "bike": 26,
      "name": "Strand, Strand",
      "lat": 51.512529,
      "lon": -0.115163
    },
    {
      "dock_id": 477,
      "dock": 23,
      "bike": 0,
      "name": "Gloucester Terrace, Bayswater",
      "lat": 51.517919,
      "lon": -0.188098
    },
    {
      "dock_id": 478,
      "dock": 25,
      "bike": 9,
      "name": "Ashley Place, Victoria",
      "lat": 51.49616,
      "lon": -0.140947
    },
    {
      "dock_id": 479,
      "dock": 19,
      "bike": 10,
      "name": "Warwick Square, Pimlico",
      "lat": 51.489856,
      "lon": -0.141923
    },
    {
      "dock_id": 480,
      "dock": 17,
      "bike": 12,
      "name": "North Audley Street, Mayfair",
      "lat": 51.512911,
      "lon": -0.153645
    },
    {
      "dock_id": 481,
      "dock": 21,
      "bike": 8,
      "name": "Belgrave Square, Belgravia",
      "lat": 51.499412,
      "lon": -0.152317
    },
    {
      "dock_id": 482,
      "dock": 24,
      "bike": 16,
      "name": "Riverlight North, Nine Elms",
      "lat": 51.482362,
      "lon": -0.136123
    },
    {
      "dock_id": 483,
      "dock": 24,
      "bike": 17,
      "name": "Queen's Gate (South), South Kensington",
      "lat": 51.492479,
      "lon": -0.178433
    },
    {
      "dock_id": 484,
      "dock": 18,
      "bike": 2,
      "name": "Nutford Place, Marylebone",
      "lat": 51.516517,
      "lon": -0.164393
    },
    {
      "dock_id": 485,
      "dock": 21,
      "bike": 1,
      "name": "Rampayne Street, Pimlico",
      "lat": 51.489975,
      "lon": -0.132845
    },
    {
      "dock_id": 486,
      "dock": 28,
      "bike": 8,
      "name": "Hyde Park Corner, Hyde Park",
      "lat": 51.503117,
      "lon": -0.15352
    },
    {
      "dock_id": 487,
      "dock": 24,
      "bike": 23,
      "name": "Great Tower Street, Monument",
      "lat": 51.510484,
      "lon": -0.082989
    },
    {
      "dock_id": 488,
      "dock": 14,
      "bike": 0,
      "name": "LMU Commercial Road, Whitechapel",
      "lat": 51.514924,
      "lon": -0.066078
    },
    {
      "dock_id": 489,
      "dock": 37,
      "bike": 29,
      "name": "Leman Street, Aldgate",
      "lat": 51.512363,
      "lon": -0.069542
    },
    {
      "dock_id": 490,
      "dock": 19,
      "bike": 10,
      "name": "Margery Street, Clerkenwell",
      "lat": 51.526599,
      "lon": -0.112432
    },
    {
      "dock_id": 491,
      "dock": 18,
      "bike": 2,
      "name": "Grosvenor Crescent, Belgravia",
      "lat": 51.501352,
      "lon": -0.153194
    },
    {
      "dock_id": 492,
      "dock": 20,
      "bike": 0,
      "name": "Mallory Street, Marylebone",
      "lat": 51.525051,
      "lon": -0.166304
    },
    {
      "dock_id": 493,
      "dock": 30,
      "bike": 24,
      "name": "Denyer Street, Knightsbridge",
      "lat": 51.493583,
      "lon": -0.165101
    },
    {
      "dock_id": 494,
      "dock": 34,
      "bike": 24,
      "name": "Cadogan Place, Knightsbridge",
      "lat": 51.494645,
      "lon": -0.158105
    },
    {
      "dock_id": 495,
      "dock": 17,
      "bike": 10,
      "name": "Campden Hill Road, Notting Hill",
      "lat": 51.506584,
      "lon": -0.199004
    },
    {
      "dock_id": 496,
      "dock": 30,
      "bike": 3,
      "name": "Old Brompton Road, South Kensington",
      "lat": 51.490945,
      "lon": -0.18119
    },
    {
      "dock_id": 497,
      "dock": 16,
      "bike": 12,
      "name": "Wormwood Street, Liverpool Street",
      "lat": 51.516154,
      "lon": -0.082422
    },
    {
      "dock_id": 498,
      "dock": 20,
      "bike": 15,
      "name": "St. Luke's Church, Chelsea",
      "lat": 51.489716,
      "lon": -0.170194
    },
    {
      "dock_id": 499,
      "dock": 29,
      "bike": 5,
      "name": "Bramham Gardens, Earl's Court",
      "lat": 51.490163,
      "lon": -0.190393
    },
    {
      "dock_id": 500,
      "dock": 16,
      "bike": 7,
      "name": "Horseferry Road, Westminster",
      "lat": 51.494816,
      "lon": -0.130458
    },
    {
      "dock_id": 501,
      "dock": 16,
      "bike": 1,
      "name": "Whiteley's, Bayswater",
      "lat": 51.514769,
      "lon": -0.188129
    },
    {
      "dock_id": 502,
      "dock": 30,
      "bike": 5,
      "name": "Notting Hill Gate Station, Notting Hill",
      "lat": 51.509353,
      "lon": -0.196422
    },
    {
      "dock_id": 503,
      "dock": 24,
      "bike": 14,
      "name": "Charles II Street, West End",
      "lat": 51.508446,
      "lon": -0.131961
    },
    {
      "dock_id": 504,
      "dock": 31,
      "bike": 8,
      "name": "Queen's Gate (Central), South Kensington",
      "lat": 51.493967,
      "lon": -0.178732
    },
    {
      "dock_id": 505,
      "dock": 16,
      "bike": 13,
      "name": "Carey Street, Holborn",
      "lat": 51.51501,
      "lon": -0.112753
    },
    {
      "dock_id": 506,
      "dock": 22,
      "bike": 20,
      "name": "Pall Mall East, West End",
      "lat": 51.50777,
      "lon": -0.130699
    },
    {
      "dock_id": 507,
      "dock": 30,
      "bike": 16,
      "name": "Fashion Street, Whitechapel",
      "lat": 51.51838,
      "lon": -0.073438
    },
    {
      "dock_id": 508,
      "dock": 30,
      "bike": 20,
      "name": "Dock Street, Wapping",
      "lat": 51.509786,
      "lon": -0.068161
    },
    {
      "dock_id": 509,
      "dock": 32,
      "bike": 1,
      "name": "Frampton Street, Paddington",
      "lat": 51.523353,
      "lon": -0.175116
    },
    {
      "dock_id": 510,
      "dock": 23,
      "bike": 5,
      "name": "Beaumont Street, Marylebone",
      "lat": 51.522008,
      "lon": -0.151359
    },
    {
      "dock_id": 511,
      "dock": 25,
      "bike": 2,
      "name": "Gloucester Street, Pimlico",
      "lat": 51.490962,
      "lon": -0.139625
    },
    {
      "dock_id": 512,
      "dock": 29,
      "bike": 16,
      "name": "Grosvenor Road, Pimlico",
      "lat": 51.485357,
      "lon": -0.142207
    },
    {
      "dock_id": 513,
      "dock": 50,
      "bike": 13,
      "name": "St. John's Wood Church, The Regent's Park",
      "lat": 51.530052,
      "lon": -0.168314
    },
    {
      "dock_id": 514,
      "dock": 42,
      "bike": 25,
      "name": "Harper Road, The Borough",
      "lat": 51.498597,
      "lon": -0.096191
    },
    {
      "dock_id": 515,
      "dock": 34,
      "bike": 28,
      "name": "Brushfield Street, Liverpool Street",
      "lat": 51.518908,
      "lon": -0.079249
    },
    {
      "dock_id": 516,
      "dock": 30,
      "bike": 25,
      "name": "Jubilee Gardens, South Bank",
      "lat": 51.504636,
      "lon": -0.116542
    },
    {
      "dock_id": 517,
      "dock": 30,
      "bike": 10,
      "name": "Shoreditch Park, Hoxton",
      "lat": 51.534042,
      "lon": -0.086379
    },
    {
      "dock_id": 518,
      "dock": 22,
      "bike": 5,
      "name": "Clifton Road, Maida Vale",
      "lat": 51.525575,
      "lon": -0.179592
    },
    {
      "dock_id": 519,
      "dock": 16,
      "bike": 10,
      "name": "Westminster University, Marylebone",
      "lat": 51.522481,
      "lon": -0.154907
    },
    {
      "dock_id": 520,
      "dock": 16,
      "bike": 8,
      "name": "Princes Square, Bayswater",
      "lat": 51.513489,
      "lon": -0.191351
    },
    {
      "dock_id": 521,
      "dock": 35,
      "bike": 17,
      "name": "LSBU (Borough Road), Elephant & Castle",
      "lat": 51.498744,
      "lon": -0.103132
    },
    {
      "dock_id": 522,
      "dock": 21,
      "bike": 15,
      "name": "St. Mary Axe, Aldgate",
      "lat": 51.514225,
      "lon": -0.08066
    },
    {
      "dock_id": 523,
      "dock": 20,
      "bike": 14,
      "name": "Tysoe Street, Clerkenwell",
      "lat": 51.526443,
      "lon": -0.109256
    },
    {
      "dock_id": 524,
      "dock": 17,
      "bike": 10,
      "name": "Southwick Street, Paddington",
      "lat": 51.515953,
      "lon": -0.169249
    },
    {
      "dock_id": 525,
      "dock": 41,
      "bike": 10,
      "name": "Queen's Gate (North), Kensington",
      "lat": 51.501026,
      "lon": -0.180246
    },
    {
      "dock_id": 526,
      "dock": 29,
      "bike": 23,
      "name": "Belgrave Road, Victoria",
      "lat": 51.493204,
      "lon": -0.144132
    },
    {
      "dock_id": 527,
      "dock": 46,
      "bike": 35,
      "name": "Empire Square, The Borough",
      "lat": 51.500823,
      "lon": -0.08974
    },
    {
      "dock_id": 528,
      "dock": 38,
      "bike": 14,
      "name": "Belvedere Road 1, South Bank",
      "lat": 51.506133,
      "lon": -0.114686
    },
    {
      "dock_id": 529,
      "dock": 36,
      "bike": 24,
      "name": "Warwick Road, Olympia",
      "lat": 51.496712,
      "lon": -0.205284
    },
    {
      "dock_id": 530,
      "dock": 24,
      "bike": 8,
      "name": "Lower Thames Street, Monument",
      "lat": 51.509301,
      "lon": -0.084985
    },
    {
      "dock_id": 531,
      "dock": 25,
      "bike": 2,
      "name": "North Wharf Road, Paddington",
      "lat": 51.518622,
      "lon": -0.176645
    },
    {
      "dock_id": 532,
      "dock": 10,
      "bike": 10,
      "name": "Royal Avenue 2, Chelsea",
      "lat": 51.490083,
      "lon": -0.162418
    },
    {
      "dock_id": 533,
      "dock": 16,
      "bike": 12,
      "name": "Kingsway, Covent Garden",
      "lat": 51.514409,
      "lon": -0.118478
    },
    {
      "dock_id": 534,
      "dock": 35,
      "bike": 9,
      "name": "St. John's Wood Road, St. John's Wood",
      "lat": 51.527294,
      "lon": -0.174653
    },
    {
      "dock_id": 535,
      "dock": 23,
      "bike": 14,
      "name": "Bedford Way, Bloomsbury",
      "lat": 51.523673,
      "lon": -0.128377
    },
    {
      "dock_id": 537,
      "dock": 15,
      "bike": 10,
      "name": "Winsland Street, Paddington",
      "lat": 51.51678,
      "lon": -0.175488
    },
    {
      "dock_id": 538,
      "dock": 32,
      "bike": 20,
      "name": "Claverton Street, Pimlico",
      "lat": 51.484839,
      "lon": -0.138089
    },
    {
      "dock_id": 539,
      "dock": 16,
      "bike": 8,
      "name": "St. George's Square, Pimlico",
      "lat": 51.488226,
      "lon": -0.135635
    },
    {
      "dock_id": 540,
      "dock": 18,
      "bike": 9,
      "name": "Knaresborough Place, Earl's Court",
      "lat": 51.493631,
      "lon": -0.190603
    },
    {
      "dock_id": 541,
      "dock": 21,
      "bike": 3,
      "name": "Curlew Street, Shad Thames",
      "lat": 51.502279,
      "lon": -0.074189
    },
    {
      "dock_id": 542,
      "dock": 18,
      "bike": 0,
      "name": "Serpentine Car Park, Hyde Park",
      "lat": 51.505014,
      "lon": -0.17306
    },
    {
      "dock_id": 543,
      "dock": 24,
      "bike": 17,
      "name": "Marylebone Lane, Marylebone",
      "lat": 51.514759,
      "lon": -0.148105
    },
    {
      "dock_id": 544,
      "dock": 28,
      "bike": 7,
      "name": "Putney Pier, Wandsworth",
      "lat": 51.466907,
      "lon": -0.216573
    },
    {
      "dock_id": 545,
      "dock": 28,
      "bike": 7,
      "name": "Albert Gate, Hyde Park",
      "lat": 51.502953,
      "lon": -0.158456
    },
    {
      "dock_id": 546,
      "dock": 16,
      "bike": 14,
      "name": "Rathbone Street, Fitzrovia ",
      "lat": 51.518162,
      "lon": -0.135025
    },
    {
      "dock_id": 547,
      "dock": 24,
      "bike": 3,
      "name": "Black Lion Gate, Kensington Gardens",
      "lat": 51.509908,
      "lon": -0.187842
    },
    {
      "dock_id": 548,
      "dock": 20,
      "bike": 3,
      "name": "Long Lane , Bermondsey",
      "lat": 51.499075,
      "lon": -0.085666
    },
    {
      "dock_id": 549,
      "dock": 19,
      "bike": 1,
      "name": "Black Prince Road, Vauxhall",
      "lat": 51.490867,
      "lon": -0.116911
    },
    {
      "dock_id": 550,
      "dock": 24,
      "bike": 22,
      "name": "Foley Street, Fitzrovia",
      "lat": 51.519181,
      "lon": -0.140485
    },
    {
      "dock_id": 551,
      "dock": 20,
      "bike": 5,
      "name": "Grove End Road, St. John's Wood",
      "lat": 51.530889,
      "lon": -0.17677
    },
    {
      "dock_id": 552,
      "dock": 21,
      "bike": 20,
      "name": "Baldwin Street, St. Luke's",
      "lat": 51.527025,
      "lon": -0.088542
    },
    {
      "dock_id": 553,
      "dock": 25,
      "bike": 16,
      "name": "Graham Street, Angel",
      "lat": 51.532661,
      "lon": -0.099981
    },
    {
      "dock_id": 554,
      "dock": 22,
      "bike": 10,
      "name": "New North Road 1, Hoxton",
      "lat": 51.53095,
      "lon": -0.085603
    },
    {
      "dock_id": 555,
      "dock": 24,
      "bike": 10,
      "name": "Prince Albert Road, The Regent's Park",
      "lat": 51.535892,
      "lon": -0.160854
    },
    {
      "dock_id": 556,
      "dock": 34,
      "bike": 10,
      "name": "Eastbourne Mews, Paddington",
      "lat": 51.516417,
      "lon": -0.179135
    },
    {
      "dock_id": 557,
      "dock": 30,
      "bike": 18,
      "name": "Bunhill Row, Moorgate",
      "lat": 51.520858,
      "lon": -0.089887
    },
    {
      "dock_id": 558,
      "dock": 10,
      "bike": 3,
      "name": "Concert Hall Approach 1, South Bank",
      "lat": 51.505044,
      "lon": -0.115851
    },
    {
      "dock_id": 559,
      "dock": 33,
      "bike": 23,
      "name": "Tavistock Street, Covent Garden",
      "lat": 51.511968,
      "lon": -0.120718
    },
    {
      "dock_id": 560,
      "dock": 24,
      "bike": 4,
      "name": "Wellington Street , Strand",
      "lat": 51.511756,
      "lon": -0.119643
    },
    {
      "dock_id": 561,
      "dock": 25,
      "bike": 14,
      "name": "Risinghill Street, Angel",
      "lat": 51.533319,
      "lon": -0.111781
    },
    {
      "dock_id": 562,
      "dock": 17,
      "bike": 9,
      "name": "Goswell Road (City Uni), Finsbury",
      "lat": 51.528246,
      "lon": -0.101026
    },
    {
      "dock_id": 563,
      "dock": 17,
      "bike": 9,
      "name": "Grosvenor Square, Mayfair",
      "lat": 51.51217,
      "lon": -0.150481
    },
    {
      "dock_id": 564,
      "dock": 17,
      "bike": 13,
      "name": "Greycoat Street , Westminster",
      "lat": 51.494591,
      "lon": -0.134234
    },
    {
      "dock_id": 565,
      "dock": 37,
      "bike": 29,
      "name": "Northumberland Avenue, Strand",
      "lat": 51.506767,
      "lon": -0.123702
    },
    {
      "dock_id": 566,
      "dock": 30,
      "bike": 15,
      "name": "Howland Street, Fitzrovia",
      "lat": 51.520994,
      "lon": -0.139016
    },
    {
      "dock_id": 567,
      "dock": 20,
      "bike": 19,
      "name": "High Holborn , Covent Garden",
      "lat": 51.516226,
      "lon": -0.124826
    },
    {
      "dock_id": 568,
      "dock": 27,
      "bike": 18,
      "name": "Howick Place, Westminster",
      "lat": 51.496753,
      "lon": -0.138733
    },
    {
      "dock_id": 569,
      "dock": 55,
      "bike": 12,
      "name": "Waterloo Station 2, Waterloo",
      "lat": 51.503919,
      "lon": -0.113426
    },
    {
      "dock_id": 570,
      "dock": 57,
      "bike": 22,
      "name": "Royal College Street, Camden Town",
      "lat": 51.536264,
      "lon": -0.133952
    },
    {
      "dock_id": 571,
      "dock": 24,
      "bike": 3,
      "name": "Lord's, St. John's Wood",
      "lat": 51.529121,
      "lon": -0.171185
    },
    {
      "dock_id": 572,
      "dock": 47,
      "bike": 19,
      "name": "City Road, Angel",
      "lat": 51.530344,
      "lon": -0.100168
    },
    {
      "dock_id": 573,
      "dock": 22,
      "bike": 9,
      "name": "King Edward Walk, Waterloo",
      "lat": 51.49775,
      "lon": -0.10988
    },
    {
      "dock_id": 574,
      "dock": 24,
      "bike": 18,
      "name": "Sardinia Street, Holborn",
      "lat": 51.515208,
      "lon": -0.117863
    },
    {
      "dock_id": 575,
      "dock": 18,
      "bike": 16,
      "name": "Prince Consort Road, Knightsbridge",
      "lat": 51.499806,
      "lon": -0.176415
    },
    {
      "dock_id": 576,
      "dock": 21,
      "bike": 16,
      "name": "Stanhope Gate, Mayfair",
      "lat": 51.506864,
      "lon": -0.150666
    },
    {
      "dock_id": 577,
      "dock": 15,
      "bike": 14,
      "name": "Farm Street, Mayfair",
      "lat": 51.509351,
      "lon": -0.147449
    },
    {
      "dock_id": 578,
      "dock": 18,
      "bike": 12,
      "name": "Frith Street, Soho",
      "lat": 51.513103,
      "lon": -0.131213
    },
    {
      "dock_id": 579,
      "dock": 30,
      "bike": 22,
      "name": "Fire Brigade Pier, Vauxhall",
      "lat": 51.493699,
      "lon": -0.121394
    },
    {
      "dock_id": 580,
      "dock": 14,
      "bike": 9,
      "name": "Southampton Street, Strand",
      "lat": 51.510701,
      "lon": -0.121723
    },
    {
      "dock_id": 581,
      "dock": 21,
      "bike": 20,
      "name": "Imperial College, Knightsbridge",
      "lat": 51.499428,
      "lon": -0.179702
    },
    {
      "dock_id": 582,
      "dock": 15,
      "bike": 8,
      "name": "Cadogan Gardens, Chelsea",
      "lat": 51.492462,
      "lon": -0.159919
    },
    {
      "dock_id": 583,
      "dock": 30,
      "bike": 2,
      "name": "Holland Park, Kensington",
      "lat": 51.502319,
      "lon": -0.200742
    },
    {
      "dock_id": 584,
      "dock": 26,
      "bike": 5,
      "name": "George Street, Marylebone",
      "lat": 51.517703,
      "lon": -0.154106
    },
    {
      "dock_id": 585,
      "dock": 15,
      "bike": 6,
      "name": "Penfold Street, Marylebone",
      "lat": 51.522892,
      "lon": -0.171681
    },
    {
      "dock_id": 586,
      "dock": 13,
      "bike": 3,
      "name": "Palace Gate, Kensington Gardens",
      "lat": 51.502042,
      "lon": -0.1844
    },
    {
      "dock_id": 587,
      "dock": 15,
      "bike": 9,
      "name": "Gloucester Road Station, South Kensington",
      "lat": 51.494185,
      "lon": -0.18267
    },
    {
      "dock_id": 588,
      "dock": 41,
      "bike": 8,
      "name": "Strata, Elephant & Castle",
      "lat": 51.493146,
      "lon": -0.099828
    },
    {
      "dock_id": 589,
      "dock": 17,
      "bike": 6,
      "name": "Cleaver Street, Kennington",
      "lat": 51.488105,
      "lon": -0.110121
    },
    {
      "dock_id": 590,
      "dock": 45,
      "bike": 5,
      "name": "Southwark Station 2, Southwark",
      "lat": 51.504044,
      "lon": -0.104778
    },
    {
      "dock_id": 591,
      "dock": 29,
      "bike": 9,
      "name": "Ebury Bridge, Pimlico",
      "lat": 51.490491,
      "lon": -0.149186
    },
    {
      "dock_id": 592,
      "dock": 17,
      "bike": 15,
      "name": "Vincent Street, Pimlico",
      "lat": 51.493072,
      "lon": -0.129925
    },
    {
      "dock_id": 593,
      "dock": 43,
      "bike": 32,
      "name": "Cheapside, Bank",
      "lat": 51.51397,
      "lon": -0.09294
    },
    {
      "dock_id": 594,
      "dock": 20,
      "bike": 12,
      "name": "Exhibition Road, Knightsbridge",
      "lat": 51.499917,
      "lon": -0.174554
    },
    {
      "dock_id": 595,
      "dock": 33,
      "bike": 11,
      "name": "Wren Street, Holborn",
      "lat": 51.524564,
      "lon": -0.116279
    },
    {
      "dock_id": 596,
      "dock": 35,
      "bike": 22,
      "name": "Red Lion Street, Holborn",
      "lat": 51.51824,
      "lon": -0.11655
    },
    {
      "dock_id": 597,
      "dock": 22,
      "bike": 9,
      "name": "Killick Street, King's Cross",
      "lat": 51.5338,
      "lon": -0.118677
    },
    {
      "dock_id": 598,
      "dock": 24,
      "bike": 5,
      "name": "Sail Street, Vauxhall",
      "lat": 51.495656,
      "lon": -0.114605
    },
    {
      "dock_id": 599,
      "dock": 24,
      "bike": 4,
      "name": "Walmer Road, Avondale",
      "lat": 51.510101,
      "lon": -0.211358
    },
    {
      "dock_id": 600,
      "dock": 54,
      "bike": 1,
      "name": "Jubilee Crescent, Cubitt Town",
      "lat": 51.493381,
      "lon": -0.007542
    },
    {
      "dock_id": 601,
      "dock": 36,
      "bike": 34,
      "name": "Fisherman's Walk West, Canary Wharf",
      "lat": 51.50623,
      "lon": -0.02296
    },
    {
      "dock_id": 602,
      "dock": 34,
      "bike": 7,
      "name": "Shadwell Station, Shadwell",
      "lat": 51.511088,
      "lon": -0.057159
    },
    {
      "dock_id": 603,
      "dock": 28,
      "bike": 11,
      "name": "Jubilee Street, Stepney",
      "lat": 51.515975,
      "lon": -0.053177
    },
    {
      "dock_id": 605,
      "dock": 24,
      "bike": 2,
      "name": "Garnet Street, Shadwell",
      "lat": 51.508447,
      "lon": -0.055167
    },
    {
      "dock_id": 606,
      "dock": 17,
      "bike": 3,
      "name": "East Ferry Road, Cubitt Town",
      "lat": 51.49447,
      "lon": -0.014409
    },
    {
      "dock_id": 607,
      "dock": 33,
      "bike": 16,
      "name": "Parkway, Camden Town",
      "lat": 51.538071,
      "lon": -0.144664
    },
    {
      "dock_id": 608,
      "dock": 33,
      "bike": 18,
      "name": "Burdett Road, Mile End",
      "lat": 51.516196,
      "lon": -0.029138
    },
    {
      "dock_id": 609,
      "dock": 26,
      "bike": 1,
      "name": "Aston Street, Stepney",
      "lat": 51.516,
      "lon": -0.038775
    },
    {
      "dock_id": 610,
      "dock": 45,
      "bike": 13,
      "name": "Bonny Street, Camden Town",
      "lat": 51.541603,
      "lon": -0.138853
    },
    {
      "dock_id": 611,
      "dock": 25,
      "bike": 6,
      "name": "St. Mary & St. Michael Church, Stepney",
      "lat": 51.51417,
      "lon": -0.052099
    },
    {
      "dock_id": 612,
      "dock": 24,
      "bike": 3,
      "name": "Cantrell Road, Bow",
      "lat": 51.521564,
      "lon": -0.022694
    },
    {
      "dock_id": 613,
      "dock": 57,
      "bike": 38,
      "name": "Lightermans Road, Millwall",
      "lat": 51.499041,
      "lon": -0.020157
    },
    {
      "dock_id": 614,
      "dock": 21,
      "bike": 12,
      "name": "Stepney Green Station, Stepney",
      "lat": 51.521889,
      "lon": -0.04667
    },
    {
      "dock_id": 615,
      "dock": 20,
      "bike": 5,
      "name": "Pott Street, Bethnal Green",
      "lat": 51.527152,
      "lon": -0.058005
    },
    {
      "dock_id": 616,
      "dock": 24,
      "bike": 0,
      "name": "Old Ford Road, Bethnal Green",
      "lat": 51.531127,
      "lon": -0.048017
    },
    {
      "dock_id": 617,
      "dock": 22,
      "bike": 1,
      "name": "Reardon Street, Wapping",
      "lat": 51.506946,
      "lon": -0.058681
    },
    {
      "dock_id": 618,
      "dock": 63,
      "bike": 6,
      "name": "The Green Bridge, Mile End",
      "lat": 51.524677,
      "lon": -0.03562
    },
    {
      "dock_id": 619,
      "dock": 39,
      "bike": 7,
      "name": "Bow Church Station, Bow",
      "lat": 51.528169,
      "lon": -0.018703
    },
    {
      "dock_id": 620,
      "dock": 27,
      "bike": 6,
      "name": "Merchant Street, Bow",
      "lat": 51.526177,
      "lon": -0.027467
    },
    {
      "dock_id": 621,
      "dock": 41,
      "bike": 1,
      "name": "Bow Road Station, Bow",
      "lat": 51.527058,
      "lon": -0.025296
    },
    {
      "dock_id": 622,
      "dock": 41,
      "bike": 23,
      "name": "Ansell House, Stepney",
      "lat": 51.519806,
      "lon": -0.055731
    },
    {
      "dock_id": 623,
      "dock": 24,
      "bike": 5,
      "name": "Cephas Street, Bethnal Green",
      "lat": 51.522561,
      "lon": -0.054883
    },
    {
      "dock_id": 624,
      "dock": 36,
      "bike": 21,
      "name": "Cleveland Way, Stepney",
      "lat": 51.520893,
      "lon": -0.051394
    },
    {
      "dock_id": 625,
      "dock": 23,
      "bike": 5,
      "name": "Bell Lane, Liverpool Street",
      "lat": 51.517475,
      "lon": -0.075855
    },
    {
      "dock_id": 626,
      "dock": 41,
      "bike": 15,
      "name": "Westferry DLR, Limehouse",
      "lat": 51.509303,
      "lon": -0.025996
    },
    {
      "dock_id": 627,
      "dock": 17,
      "bike": 12,
      "name": "Portman Square, Marylebone",
      "lat": 51.516204,
      "lon": -0.155525
    },
    {
      "dock_id": 628,
      "dock": 24,
      "bike": 8,
      "name": "Russell Gardens, Olympia",
      "lat": 51.500088,
      "lon": -0.211316
    },
    {
      "dock_id": 629,
      "dock": 18,
      "bike": 5,
      "name": "Chrisp Street Market, Poplar",
      "lat": 51.5112,
      "lon": -0.014438
    },
    {
      "dock_id": 630,
      "dock": 17,
      "bike": 0,
      "name": "Ford Road, Old Ford",
      "lat": 51.532513,
      "lon": -0.033085
    },
    {
      "dock_id": 631,
      "dock": 36,
      "bike": 28,
      "name": "Clinton Road, Mile End",
      "lat": 51.525941,
      "lon": -0.036017
    },
    {
      "dock_id": 632,
      "dock": 27,
      "bike": 24,
      "name": "Lancaster Drive, Blackwall",
      "lat": 51.503143,
      "lon": -0.008428
    },
    {
      "dock_id": 633,
      "dock": 20,
      "bike": 8,
      "name": "Hansard Mews, Holland Park",
      "lat": 51.503802,
      "lon": -0.215808
    },
    {
      "dock_id": 634,
      "dock": 16,
      "bike": 12,
      "name": "Clarges Street, Mayfair",
      "lat": 51.507326,
      "lon": -0.145827
    },
    {
      "dock_id": 635,
      "dock": 18,
      "bike": 13,
      "name": "Newby Place, Poplar",
      "lat": 51.508896,
      "lon": -0.012413
    },
    {
      "dock_id": 636,
      "dock": 21,
      "bike": 5,
      "name": "Twig Folly Bridge, Mile End",
      "lat": 51.530326,
      "lon": -0.042744
    },
    {
      "dock_id": 637,
      "dock": 33,
      "bike": 9,
      "name": "Wellington Row, Bethnal Green",
      "lat": 51.528222,
      "lon": -0.069743
    },
    {
      "dock_id": 638,
      "dock": 18,
      "bike": 4,
      "name": "Old Montague Street, Whitechapel",
      "lat": 51.51793,
      "lon": -0.067937
    },
    {
      "dock_id": 639,
      "dock": 21,
      "bike": 21,
      "name": "Naval Row, Blackwall",
      "lat": 51.508981,
      "lon": -0.00699
    },
    {
      "dock_id": 640,
      "dock": 22,
      "bike": 9,
      "name": "Hoxton Station, Hoxton",
      "lat": 51.531091,
      "lon": -0.075901
    },
    {
      "dock_id": 641,
      "dock": 27,
      "bike": 11,
      "name": "Albany Street, The Regent's Park",
      "lat": 51.528302,
      "lon": -0.144466
    },
    {
      "dock_id": 642,
      "dock": 28,
      "bike": 17,
      "name": "Green Park Station, Mayfair",
      "lat": 51.506613,
      "lon": -0.142844
    },
    {
      "dock_id": 643,
      "dock": 33,
      "bike": 6,
      "name": "Salmon Lane, Limehouse",
      "lat": 51.514115,
      "lon": -0.033828
    },
    {
      "dock_id": 644,
      "dock": 51,
      "bike": 17,
      "name": "East India DLR, Blackwall",
      "lat": 51.509474,
      "lon": -0.002275
    },
    {
      "dock_id": 645,
      "dock": 27,
      "bike": 0,
      "name": "Watney Street, Shadwell",
      "lat": 51.511542,
      "lon": -0.056667
    },
    {
      "dock_id": 646,
      "dock": 24,
      "bike": 6,
      "name": "Regent's Row , Haggerston ",
      "lat": 51.535678,
      "lon": -0.062546
    },
    {
      "dock_id": 647,
      "dock": 27,
      "bike": 16,
      "name": "Heron Quays DLR, Canary Wharf",
      "lat": 51.502661,
      "lon": -0.021596
    },
    {
      "dock_id": 648,
      "dock": 20,
      "bike": 15,
      "name": "King Edward Street, St Pauls",
      "lat": 51.51601,
      "lon": -0.0985
    },
    {
      "dock_id": 649,
      "dock": 24,
      "bike": 11,
      "name": "Page Street, Westminster",
      "lat": 51.493978,
      "lon": -0.127554
    },
    {
      "dock_id": 650,
      "dock": 24,
      "bike": 11,
      "name": "Abbotsbury Road, Holland Park",
      "lat": 51.501391,
      "lon": -0.205991
    },
    {
      "dock_id": 651,
      "dock": 21,
      "bike": 2,
      "name": "Ladbroke Grove Central, Ladbroke Grove",
      "lat": 51.511624,
      "lon": -0.205921
    },
    {
      "dock_id": 652,
      "dock": 22,
      "bike": 2,
      "name": "Rectory Square, Stepney",
      "lat": 51.518369,
      "lon": -0.043371
    },
    {
      "dock_id": 653,
      "dock": 21,
      "bike": 14,
      "name": "Bury Place, Holborn",
      "lat": 51.51746,
      "lon": -0.12335
    },
    {
      "dock_id": 654,
      "dock": 26,
      "bike": 7,
      "name": "Preston's Road, Cubitt Town",
      "lat": 51.499286,
      "lon": -0.009152
    },
    {
      "dock_id": 655,
      "dock": 36,
      "bike": 29,
      "name": "Upper Bank Street, Canary Wharf",
      "lat": 51.503083,
      "lon": -0.017676
    },
    {
      "dock_id": 656,
      "dock": 29,
      "bike": 24,
      "name": "Westfield Southern Terrace ,Shepherd's Bush",
      "lat": 51.506256,
      "lon": -0.218337
    },
    {
      "dock_id": 657,
      "dock": 18,
      "bike": 10,
      "name": "Limerston Street, West Chelsea",
      "lat": 51.485587,
      "lon": -0.18119
    },
    {
      "dock_id": 658,
      "dock": 22,
      "bike": 15,
      "name": "Alpha Grove, Millwall",
      "lat": 51.497304,
      "lon": -0.022793
    },
    {
      "dock_id": 659,
      "dock": 36,
      "bike": 5,
      "name": "Doddington Grove, Kennington",
      "lat": 51.486929,
      "lon": -0.102996
    },
    {
      "dock_id": 660,
      "dock": 31,
      "bike": 1,
      "name": "Mudchute DLR, Cubitt Town",
      "lat": 51.490645,
      "lon": -0.014582
    },
    {
      "dock_id": 661,
      "dock": 27,
      "bike": 1,
      "name": "Hoxton Street, Hoxton",
      "lat": 51.52959,
      "lon": -0.0801
    },
    {
      "dock_id": 662,
      "dock": 26,
      "bike": 7,
      "name": "Greenberry Street, St.John's Wood",
      "lat": 51.53256,
      "lon": -0.16862
    },
    {
      "dock_id": 663,
      "dock": 27,
      "bike": 11,
      "name": "Westfield Library Corner, Shepherd's Bush",
      "lat": 51.506093,
      "lon": -0.224223
    },
    {
      "dock_id": 664,
      "dock": 20,
      "bike": 2,
      "name": "Bishop's Bridge Road East, Bayswater",
      "lat": 51.5171,
      "lon": -0.18377
    },
    {
      "dock_id": 665,
      "dock": 33,
      "bike": 24,
      "name": "Kingsway Southbound, Strand",
      "lat": 51.513875,
      "lon": -0.117774
    },
    {
      "dock_id": 666,
      "dock": 21,
      "bike": 4,
      "name": "Parson's Green , Parson's Green",
      "lat": 51.472817,
      "lon": -0.199783
    },
    {
      "dock_id": 667,
      "dock": 27,
      "bike": 6,
      "name": "Fulham Park Road, Fulham",
      "lat": 51.473471,
      "lon": -0.20782
    },
    {
      "dock_id": 668,
      "dock": 38,
      "bike": 19,
      "name": "Southerton Road, Hammersmith",
      "lat": 51.494499,
      "lon": -0.228188
    },
    {
      "dock_id": 669,
      "dock": 36,
      "bike": 21,
      "name": "BBC White City, White City",
      "lat": 51.514767,
      "lon": -0.225787
    },
    {
      "dock_id": 670,
      "dock": 29,
      "bike": 19,
      "name": "Seymour Place, Marylebone",
      "lat": 51.520331,
      "lon": -0.163667
    },
    {
      "dock_id": 671,
      "dock": 26,
      "bike": 21,
      "name": "Addison Road, Holland Park",
      "lat": 51.504199,
      "lon": -0.210941
    },
    {
      "dock_id": 672,
      "dock": 21,
      "bike": 1,
      "name": "Putney Bridge Station, Fulham",
      "lat": 51.468814,
      "lon": -0.210279
    },
    {
      "dock_id": 673,
      "dock": 19,
      "bike": 0,
      "name": "Sugden Road, Clapham",
      "lat": 51.465123,
      "lon": -0.157788
    },
    {
      "dock_id": 674,
      "dock": 40,
      "bike": 14,
      "name": "Bradmead, Battersea Park",
      "lat": 51.478172,
      "lon": -0.14469
    },
    {
      "dock_id": 675,
      "dock": 24,
      "bike": 12,
      "name": "Eel Brook Common, Walham Green",
      "lat": 51.476259,
      "lon": -0.193254
    },
    {
      "dock_id": 676,
      "dock": 33,
      "bike": 18,
      "name": "Wandsworth Town Station, Wandsworth",
      "lat": 51.460864,
      "lon": -0.187427
    },
    {
      "dock_id": 677,
      "dock": 29,
      "bike": 3,
      "name": "Lansdowne Road, Ladbroke Grove",
      "lat": 51.507481,
      "lon": -0.205535
    },
    {
      "dock_id": 678,
      "dock": 40,
      "bike": 7,
      "name": "Courland Grove, Wandsworth Road",
      "lat": 51.472918,
      "lon": -0.132102
    },
    {
      "dock_id": 679,
      "dock": 26,
      "bike": 9,
      "name": "William Morris Way, Sands End",
      "lat": 51.468819,
      "lon": -0.184318
    },
    {
      "dock_id": 680,
      "dock": 27,
      "bike": 18,
      "name": "Battersea Park Road, Nine Elms",
      "lat": 51.479501,
      "lon": -0.14177
    },
    {
      "dock_id": 681,
      "dock": 27,
      "bike": 3,
      "name": "Sheepcote Lane, Battersea",
      "lat": 51.470538,
      "lon": -0.163041
    },
    {
      "dock_id": 682,
      "dock": 32,
      "bike": 12,
      "name": "Vereker Road, West Kensington",
      "lat": 51.489591,
      "lon": -0.209378
    },
    {
      "dock_id": 683,
      "dock": 33,
      "bike": 16,
      "name": "Brook Green South, Brook Green",
      "lat": 51.494347,
      "lon": -0.215804
    },
    {
      "dock_id": 684,
      "dock": 28,
      "bike": 12,
      "name": "South Park, Sands End",
      "lat": 51.467064,
      "lon": -0.193502
    },
    {
      "dock_id": 685,
      "dock": 28,
      "bike": 4,
      "name": "Falcon Road, Clapham Junction",
      "lat": 51.466633,
      "lon": -0.169821
    },
    {
      "dock_id": 686,
      "dock": 27,
      "bike": 8,
      "name": "Silverthorne Road, Battersea",
      "lat": 51.472865,
      "lon": -0.148059
    },
    {
      "dock_id": 687,
      "dock": 16,
      "bike": 12,
      "name": "Buckingham Gate, Westminster",
      "lat": 51.498865,
      "lon": -0.137424
    },
    {
      "dock_id": 688,
      "dock": 27,
      "bike": 4,
      "name": "Richmond Way, Shepherd's Bush",
      "lat": 51.500353,
      "lon": -0.217515
    },
    {
      "dock_id": 689,
      "dock": 25,
      "bike": 2,
      "name": "Thorndike Close, West Chelsea",
      "lat": 51.480898,
      "lon": -0.183853
    },
    {
      "dock_id": 690,
      "dock": 29,
      "bike": 20,
      "name": "Evesham Street, Avondale",
      "lat": 51.511486,
      "lon": -0.21819
    },
    {
      "dock_id": 691,
      "dock": 25,
      "bike": 9,
      "name": "Simpson Street, Clapham Junction",
      "lat": 51.470847,
      "lon": -0.170703
    },
    {
      "dock_id": 692,
      "dock": 29,
      "bike": 14,
      "name": "Broomhouse Lane, Parsons Green",
      "lat": 51.468418,
      "lon": -0.199135
    },
    {
      "dock_id": 693,
      "dock": 21,
      "bike": 12,
      "name": "Blythe Road West, Shepherd's Bush",
      "lat": 51.49968,
      "lon": -0.221791
    },
    {
      "dock_id": 694,
      "dock": 30,
      "bike": 4,
      "name": "Ethelburga Estate, Battersea Park",
      "lat": 51.477292,
      "lon": -0.164786
    },
    {
      "dock_id": 695,
      "dock": 57,
      "bike": 18,
      "name": "Grant Road West, Clapham Junction",
      "lat": 51.46437,
      "lon": -0.174619
    },
    {
      "dock_id": 696,
      "dock": 37,
      "bike": 2,
      "name": "All Saints Church, Portobello",
      "lat": 51.51632,
      "lon": -0.202608
    },
    {
      "dock_id": 697,
      "dock": 24,
      "bike": 2,
      "name": "Phene Street, Chelsea",
      "lat": 51.484984,
      "lon": -0.167919
    },
    {
      "dock_id": 698,
      "dock": 24,
      "bike": 1,
      "name": "Clarendon Road, Avondale",
      "lat": 51.51323,
      "lon": -0.211593
    },
    {
      "dock_id": 699,
      "dock": 26,
      "bike": 12,
      "name": "Ravenscourt Park Station, Hammersmith",
      "lat": 51.494223,
      "lon": -0.236769
    },
    {
      "dock_id": 700,
      "dock": 39,
      "bike": 11,
      "name": "Teversham Lane, Stockwell",
      "lat": 51.476149,
      "lon": -0.123258
    },
    {
      "dock_id": 701,
      "dock": 40,
      "bike": 23,
      "name": "Carnegie Street, King's Cross",
      "lat": 51.535467,
      "lon": -0.116191
    },
    {
      "dock_id": 702,
      "dock": 30,
      "bike": 13,
      "name": "Usk Road, Clapham Junction",
      "lat": 51.463489,
      "lon": -0.182126
    },
    {
      "dock_id": 703,
      "dock": 26,
      "bike": 11,
      "name": "Orbel Street, Battersea",
      "lat": 51.474535,
      "lon": -0.17021
    },
    {
      "dock_id": 704,
      "dock": 28,
      "bike": 15,
      "name": "Westbridge Road, Battersea",
      "lat": 51.477684,
      "lon": -0.170329
    },
    {
      "dock_id": 705,
      "dock": 46,
      "bike": 16,
      "name": "Bishop's Avenue, Fulham",
      "lat": 51.473036,
      "lon": -0.214749
    },
    {
      "dock_id": 706,
      "dock": 28,
      "bike": 1,
      "name": "Dorothy Road, Clapham Junction",
      "lat": 51.465064,
      "lon": -0.16375
    },
    {
      "dock_id": 707,
      "dock": 32,
      "bike": 23,
      "name": "Neville Gill Close, Wandsworth",
      "lat": 51.454752,
      "lon": -0.195197
    },
    {
      "dock_id": 708,
      "dock": 26,
      "bike": 13,
      "name": "Maclise Road, Olympia",
      "lat": 51.497608,
      "lon": -0.211455
    },
    {
      "dock_id": 709,
      "dock": 28,
      "bike": 5,
      "name": "Northfields, Wandsworth",
      "lat": 51.460951,
      "lon": -0.200667
    },
    {
      "dock_id": 710,
      "dock": 30,
      "bike": 9,
      "name": "Spanish Road, Clapham Junction",
      "lat": 51.459225,
      "lon": -0.180884
    },
    {
      "dock_id": 711,
      "dock": 24,
      "bike": 1,
      "name": "Stanley Grove, Battersea",
      "lat": 51.470475,
      "lon": -0.15213
    },
    {
      "dock_id": 712,
      "dock": 24,
      "bike": 4,
      "name": "Erin Close, Walham Green",
      "lat": 51.479463,
      "lon": -0.195777
    },
    {
      "dock_id": 713,
      "dock": 20,
      "bike": 6,
      "name": "Putney Rail Station, Putney",
      "lat": 51.460717,
      "lon": -0.216526
    },
    {
      "dock_id": 714,
      "dock": 25,
      "bike": 10,
      "name": "Charlotte Terrace, Angel",
      "lat": 51.536392,
      "lon": -0.112721
    },
    {
      "dock_id": 715,
      "dock": 35,
      "bike": 10,
      "name": "Shoreditch Court, Haggerston",
      "lat": 51.539083,
      "lon": -0.070329
    },
    {
      "dock_id": 716,
      "dock": 39,
      "bike": 16,
      "name": "Belford House, Haggerston",
      "lat": 51.536654,
      "lon": -0.07023
    },
    {
      "dock_id": 717,
      "dock": 25,
      "bike": 0,
      "name": "Battersea Church Road, Battersea",
      "lat": 51.476964,
      "lon": -0.174347
    },
    {
      "dock_id": 718,
      "dock": 30,
      "bike": 6,
      "name": "Vicarage Crescent, Battersea",
      "lat": 51.472876,
      "lon": -0.176267
    },
    {
      "dock_id": 719,
      "dock": 24,
      "bike": 3,
      "name": "Durant Street, Bethnal Green",
      "lat": 51.528681,
      "lon": -0.06555
    },
    {
      "dock_id": 720,
      "dock": 25,
      "bike": 22,
      "name": "St. Bride Street, Holborn",
      "lat": 51.515059,
      "lon": -0.105344
    },
    {
      "dock_id": 721,
      "dock": 32,
      "bike": 31,
      "name": "Barons Court Station, West Kensington",
      "lat": 51.490217,
      "lon": -0.215087
    },
    {
      "dock_id": 722,
      "dock": 20,
      "bike": 7,
      "name": "Albert Bridge Road, Battersea Park",
      "lat": 51.474392,
      "lon": -0.163347
    },
    {
      "dock_id": 723,
      "dock": 22,
      "bike": 8,
      "name": "Mile End Stadium, Mile End",
      "lat": 51.518541,
      "lon": -0.034903
    },
    {
      "dock_id": 724,
      "dock": 22,
      "bike": 15,
      "name": "Hawley Crescent, Camden Town",
      "lat": 51.541007,
      "lon": -0.14326
    },
    {
      "dock_id": 725,
      "dock": 22,
      "bike": 6,
      "name": "Aylward Street, Stepney",
      "lat": 51.51563,
      "lon": -0.049067
    },
    {
      "dock_id": 726,
      "dock": 24,
      "bike": 0,
      "name": "Stainsby Road , Poplar",
      "lat": 51.515427,
      "lon": -0.023565
    },
    {
      "dock_id": 727,
      "dock": 43,
      "bike": 13,
      "name": "Dunston Road , Haggerston",
      "lat": 51.536585,
      "lon": -0.075885
    },
    {
      "dock_id": 728,
      "dock": 45,
      "bike": 14,
      "name": "Ada Street, Hackney Central",
      "lat": 51.535716,
      "lon": -0.060291
    },
    {
      "dock_id": 729,
      "dock": 34,
      "bike": 10,
      "name": "Victoria Park Road, Hackney Central",
      "lat": 51.536424,
      "lon": -0.054162
    },
    {
      "dock_id": 730,
      "dock": 22,
      "bike": 5,
      "name": "Star Road, West Kensington",
      "lat": 51.487244,
      "lon": -0.205279
    },
    {
      "dock_id": 731,
      "dock": 19,
      "bike": 9,
      "name": "Finnis Street, Bethnal Green",
      "lat": 51.524583,
      "lon": -0.058631
    },
    {
      "dock_id": 732,
      "dock": 28,
      "bike": 0,
      "name": "Alma Road, Wandsworth",
      "lat": 51.457991,
      "lon": -0.184806
    },
    {
      "dock_id": 733,
      "dock": 23,
      "bike": 7,
      "name": "Chesilton Road, Fulham",
      "lat": 51.475698,
      "lon": -0.205876
    },
    {
      "dock_id": 734,
      "dock": 18,
      "bike": 13,
      "name": "Bridge Avenue, Hammersmith",
      "lat": 51.492084,
      "lon": -0.229116
    },
    {
      "dock_id": 735,
      "dock": 37,
      "bike": 3,
      "name": "Michael Road, Walham Green",
      "lat": 51.477276,
      "lon": -0.18921
    },
    {
      "dock_id": 736,
      "dock": 21,
      "bike": 18,
      "name": "Duke Street Hill, London Bridge",
      "lat": 51.506304,
      "lon": -0.087262
    },
    {
      "dock_id": 737,
      "dock": 31,
      "bike": 2,
      "name": "Plough Terrace, Clapham Junction",
      "lat": 51.462305,
      "lon": -0.175407
    },
    {
      "dock_id": 738,
      "dock": 35,
      "bike": 32,
      "name": "Grant Road East, Clapham Junction",
      "lat": 51.464894,
      "lon": -0.173029
    },
    {
      "dock_id": 739,
      "dock": 28,
      "bike": 13,
      "name": "Queensdale Road, Shepherd's Bush",
      "lat": 51.50659,
      "lon": -0.216104
    },
    {
      "dock_id": 740,
      "dock": 26,
      "bike": 15,
      "name": "Fulham Broadway, Walham Green",
      "lat": 51.479932,
      "lon": -0.194116
    },
    {
      "dock_id": 741,
      "dock": 23,
      "bike": 21,
      "name": "Freston Road, Avondale",
      "lat": 51.512981,
      "lon": -0.219486
    },
    {
      "dock_id": 742,
      "dock": 22,
      "bike": 10,
      "name": "Blenheim Crescent, Ladbroke Grove",
      "lat": 51.515108,
      "lon": -0.208565
    },
    {
      "dock_id": 743,
      "dock": 24,
      "bike": 11,
      "name": "Lots Road, West Chelsea",
      "lat": 51.479573,
      "lon": -0.179038
    },
    {
      "dock_id": 744,
      "dock": 24,
      "bike": 6,
      "name": "Ormonde Gate, Chelsea",
      "lat": 51.487964,
      "lon": -0.161765
    },
    {
      "dock_id": 745,
      "dock": 37,
      "bike": 1,
      "name": "Haggerston Road, Haggerston ",
      "lat": 51.539328,
      "lon": -0.074284
    },
    {
      "dock_id": 746,
      "dock": 27,
      "bike": 1,
      "name": "Culvert Road, Battersea",
      "lat": 51.471095,
      "lon": -0.15785
    },
    {
      "dock_id": 747,
      "dock": 24,
      "bike": 12,
      "name": "Newton Street, Covent Garden",
      "lat": 51.516128,
      "lon": -0.120909
    },
    {
      "dock_id": 748,
      "dock": 28,
      "bike": 18,
      "name": "Hammersmith Town Hall, Hammersmith",
      "lat": 51.492636,
      "lon": -0.234094
    },
    {
      "dock_id": 749,
      "dock": 24,
      "bike": 2,
      "name": "Grenfell Road, Avondale",
      "lat": 51.5129,
      "lon": -0.214762
    },
    {
      "dock_id": 750,
      "dock": 23,
      "bike": 4,
      "name": "Westbourne Park Road, Portobello",
      "lat": 51.51787,
      "lon": -0.201005
    },
    {
      "dock_id": 751,
      "dock": 18,
      "bike": 10,
      "name": "Broadley Terrace, Marylebone",
      "lat": 51.524561,
      "lon": -0.165668
    },
    {
      "dock_id": 752,
      "dock": 18,
      "bike": 6,
      "name": "Rossmore Road, Marylebone",
      "lat": 51.525269,
      "lon": -0.163795
    },
    {
      "dock_id": 753,
      "dock": 33,
      "bike": 14,
      "name": "St. John's Road, Clapham Junction",
      "lat": 51.462392,
      "lon": -0.168292
    },
    {
      "dock_id": 754,
      "dock": 39,
      "bike": 26,
      "name": "Ranelagh Gardens, Fulham",
      "lat": 51.467601,
      "lon": -0.206827
    },
    {
      "dock_id": 755,
      "dock": 25,
      "bike": 13,
      "name": "Ram Street, Wandsworth",
      "lat": 51.457529,
      "lon": -0.192165
    },
    {
      "dock_id": 756,
      "dock": 30,
      "bike": 1,
      "name": "Santos Road, Wandsworth",
      "lat": 51.457059,
      "lon": -0.200806
    },
    {
      "dock_id": 757,
      "dock": 37,
      "bike": 0,
      "name": "Clapham Common North Side, Clapham Common",
      "lat": 51.461343,
      "lon": -0.159322
    },
    {
      "dock_id": 758,
      "dock": 24,
      "bike": 21,
      "name": "Tallis Street, Temple",
      "lat": 51.511891,
      "lon": -0.107349
    },
    {
      "dock_id": 759,
      "dock": 20,
      "bike": 5,
      "name": "Hurlingham Park, Parsons Green",
      "lat": 51.470131,
      "lon": -0.20464
    },
    {
      "dock_id": 760,
      "dock": 30,
      "bike": 30,
      "name": "Victoria & Albert Museum, South Kensington",
      "lat": 51.495898,
      "lon": -0.173009
    },
    {
      "dock_id": 761,
      "dock": 27,
      "bike": 7,
      "name": "Monier Road, Hackney Wick",
      "lat": 51.540311,
      "lon": -0.02163
    },
    {
      "dock_id": 762,
      "dock": 34,
      "bike": 2,
      "name": "East Village, Queen Elizabeth Olympic Park",
      "lat": 51.546326,
      "lon": -0.009935
    },
    {
      "dock_id": 763,
      "dock": 64,
      "bike": 49,
      "name": "Aquatic Centre, Queen Elizabeth Olympic Park",
      "lat": 51.54094,
      "lon": -0.01051
    },
    {
      "dock_id": 764,
      "dock": 44,
      "bike": 17,
      "name": "Lee Valley VeloPark, Queen Elizabeth Olympic Park",
      "lat": 51.549369,
      "lon": -0.015717
    },
    {
      "dock_id": 765,
      "dock": 28,
      "bike": 27,
      "name": "Stratford Station, Stratford",
      "lat": 51.541793,
      "lon": -0.00481
    },
    {
      "dock_id": 766,
      "dock": 28,
      "bike": 14,
      "name": "Cromer Street, Bloomsbury",
      "lat": 51.528279,
      "lon": -0.119558
    },
    {
      "dock_id": 767,
      "dock": 30,
      "bike": 24,
      "name": "Ossulston Street, Somers Town",
      "lat": 51.5293,
      "lon": -0.128279
    },
    {
      "dock_id": 768,
      "dock": 27,
      "bike": 23,
      "name": "Birkenhead Street, King's Cross",
      "lat": 51.530199,
      "lon": -0.122299
    },
    {
      "dock_id": 769,
      "dock": 29,
      "bike": 26,
      "name": "Lavington Street, Bankside",
      "lat": 51.505224,
      "lon": -0.098031
    },
    {
      "dock_id": 770,
      "dock": 23,
      "bike": 18,
      "name": "Southwark Street, Bankside",
      "lat": 51.505409,
      "lon": -0.098341
    },
    {
      "dock_id": 771,
      "dock": 27,
      "bike": 11,
      "name": "Good's Way, King's Cross",
      "lat": 51.534667,
      "lon": -0.125078
    },
    {
      "dock_id": 772,
      "dock": 27,
      "bike": 9,
      "name": "Handyside Street, King's Cross",
      "lat": 51.53724,
      "lon": -0.124807
    },
    {
      "dock_id": 773,
      "dock": 33,
      "bike": 22,
      "name": "Stockwell Roundabout, Stockwell",
      "lat": 51.473486,
      "lon": -0.122555
    },
    {
      "dock_id": 774,
      "dock": 28,
      "bike": 25,
      "name": "Lincoln's Inn Fields, Holborn",
      "lat": 51.516277,
      "lon": -0.118272
    },
    {
      "dock_id": 775,
      "dock": 28,
      "bike": 21,
      "name": "Here East North, Queen Elizabeth Olympic Park",
      "lat": 51.548731,
      "lon": -0.022606
    },
    {
      "dock_id": 776,
      "dock": 37,
      "bike": 11,
      "name": "New Spring Gardens Walk, Vauxhall",
      "lat": 51.487807,
      "lon": -0.122759
    },
    {
      "dock_id": 777,
      "dock": 28,
      "bike": 22,
      "name": "Here East South, Queen Elizabeth Olympic Park",
      "lat": 51.546532,
      "lon": -0.020597
    },
    {
      "dock_id": 778,
      "dock": 13,
      "bike": 10,
      "name": "One Tower Bridge, Bermondsey",
      "lat": 51.503127,
      "lon": -0.078655
    },
    {
      "dock_id": 779,
      "dock": 24,
      "bike": 14,
      "name": "Victory Place, Walworth",
      "lat": 51.492807,
      "lon": -0.091938
    },
    {
      "dock_id": 780,
      "dock": 24,
      "bike": 1,
      "name": "Cranmer Road, Stockwell",
      "lat": 51.479601,
      "lon": -0.111471
    },
    {
      "dock_id": 781,
      "dock": 25,
      "bike": 18,
      "name": "Wynne Road, Stockwell",
      "lat": 51.469217,
      "lon": -0.112686
    },
    {
      "dock_id": 782,
      "dock": 42,
      "bike": 21,
      "name": "Saltoun Road, Brixton",
      "lat": 51.460232,
      "lon": -0.115375
    },
    {
      "dock_id": 783,
      "dock": 16,
      "bike": 10,
      "name": "Dorset Square, Marylebone",
      "lat": 51.522596,
      "lon": -0.161113
    },
    {
      "dock_id": 784,
      "dock": 45,
      "bike": 19,
      "name": "Pennington Street, Wapping",
      "lat": 51.508622,
      "lon": -0.065006
    },
    {
      "dock_id": 785,
      "dock": 32,
      "bike": 6,
      "name": "Albert Square, Stockwell",
      "lat": 51.47659,
      "lon": -0.118256
    },
    {
      "dock_id": 786,
      "dock": 24,
      "bike": 8,
      "name": "Calshot Street , King's Cross",
      "lat": 51.53136,
      "lon": -0.117069
    },
    {
      "dock_id": 787,
      "dock": 18,
      "bike": 16,
      "name": "Broadwick Street, Soho",
      "lat": 51.513684,
      "lon": -0.13558
    },
    {
      "dock_id": 788,
      "dock": 26,
      "bike": 23,
      "name": "Worship Street, Shoreditch",
      "lat": 51.521773,
      "lon": -0.081118
    },
    {
      "dock_id": 789,
      "dock": 39,
      "bike": 20,
      "name": "Import Dock, Canary Wharf",
      "lat": 51.505772,
      "lon": -0.01646
    },
    {
      "dock_id": 790,
      "dock": 28,
      "bike": 17,
      "name": "Allington Street, Victoria",
      "lat": 51.496863,
      "lon": -0.142943
    },
    {
      "dock_id": 791,
      "dock": 30,
      "bike": 9,
      "name": "Euston Square Gardens, Euston",
      "lat": 51.527068,
      "lon": -0.131861
    },
    {
      "dock_id": 792,
      "dock": 24,
      "bike": 2,
      "name": "York Way, Kings Cross",
      "lat": 51.541596,
      "lon": -0.125441
    }
  ]
};

class GeoCircle extends Component {
  render() {
    return <VegaLite spec={spec} data={data} />
  }
}

export default GeoCircle;