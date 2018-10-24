<?php

require(__DIR__.'/vendor/autoload.php');

$config = json_decode(file_get_contents(__DIR__.'/config.json'), true);

$db = new \DbEx\PDOEx($config['database']['connection'],
	$config['database']['user'], $config['database']['password']);

$queries = [
	
	'air' => 
		'
			SELECT d.location_id, d.current_at, d.no2, d.so2, d.o3, d.pm10, d.pm25, l.name, l.lat, l.lon 
			FROM 
				air_quality d
				JOIN air_quality_location l on (d.location_id = l.id) 
			WHERE 
				d.current_at > date_sub(now(), interval 1 day)
		',
		
	'weather' => 
		'SELECT current_at, temp, pressure, humidity, wind_speed FROM weather_forecast ORDER BY current_at',

	'charger' => 
		'SELECT * FROM ev_charger e ORDER BY current_at DESC LIMIT 1',

	'jamcam' => 
		'SELECT * FROM jamcam_location',
		
	'bike' => 
		'
			SELECT d.location_id dock_id, d.dock, d.bike, l.name, l.lat, l.lon 
			FROM
				tfl_bike_dock d
				JOIN tfl_bike_dock_location l on (d.location_id = l.id) 
			WHERE
				d.current_at = (SELECT s.fetched_at FROM source s WHERE id = 2)
		',
	
	// Greenwich

	'greenwich_pump' => 'SELECT time_, value_kw FROM gla_kiwi_ernestdence_boiler_pump_minute ORDER BY 1 DESC LIMIT 2000',
	
	'greenwich_pump_long' => "
	
		SELECT s.date_time, 'p1' pump, s.b1_heat_value heat
		FROM gla_sharingcities_siemens_energy s 
		WHERE date_time BETWEEN '2018-02-08' AND '2018-02-10'
		
		UNION
		
		SELECT s.date_time, 'p2' pump, s.b2_heat_value heat
		FROM gla_sharingcities_siemens_energy s 
		WHERE date_time BETWEEN '2018-02-08' AND '2018-02-10'
		
		UNION
		
		SELECT s.date_time, 'p3' pump, s.b3_heat_value heat
		FROM gla_sharingcities_siemens_energy s 
		WHERE date_time BETWEEN '2018-02-08' AND '2018-02-10'
	
	",
	
	'greenwich_kiwi_residential' => 'SELECT k.time, k.power_wm_sid_761573_wholehouse FROM gla_kiwi_residential_sample_hour k ORDER BY 1',
	
	'greenwich_siemens_energy' => 'SELECT s.date_time, s.b1_heat_value, s.b2_heat_value, s.b3_heat_value FROM gla_sharingcities_siemens_energy s ORDER BY 1',

	'greenwich_smartparking_meta' => 'SELECT * FROM gla_sharingcities_smartparking_meta',

	'greenwich_smartparking' =>
		'
			SELECT
				m.city, m.street, m.latitude, m.longitude, m.baytype, p.free, p.occupied
			FROM
				gla_sharingcities_smartparking_meta m
				JOIN gla_sharingcities_smartparking_occ p ON (m.lotcode = p.lotcode)
			WHERE
				p.run_time_stamp = (SELECT max(run_time_stamp) FROM gla_sharingcities_smartparking_occ)	
		',
	
	// Gilan
	
	'milan_sensor_data' =>
		'
			SELECT
				s.latitudine, s.longitudine, s.descrizione,
				d.*
			FROM
				milan_sensor s
				JOIN milan_sensor_data d ON (s.dev_eui = d.dev_eui)
		'
];

if(array_key_exists('source', $_GET) && array_key_exists(strtolower($_GET['source']), $queries))
{
	$data = $db->doQuery($queries[strtolower($_GET['source'])]);
}
else
{
	$data = array_keys($queries);
}

header("Content-type: application/json; charset=utf-8");
header("Access-Control-Allow-Origin: *");

echo json_encode($data, JSON_PRETTY_PRINT);