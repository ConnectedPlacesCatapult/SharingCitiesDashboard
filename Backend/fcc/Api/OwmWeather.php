<?php

namespace FCC\Api;

use FCC\Source;

class OwmWeather extends Source
{
	const
		DATASET = 'weather';
		
	public function getDefaults()
	{
		return array_merge(parent::getDefaults(), [
			'refresh' => 1800,
			'endpoint' => 'http://api.openweathermap.org/data/2.5/weather?id=$id&APPID=0ac27f8fc55b1b39c301d85faa8a3fc2&units=metric',
			'param_sets' => '[{"id": 2643743},{"id": 2267057},{"id": 6542283}]'
		]);
	}
		
	public function import($data)
	{
		$data = $this->fromJson($data);
				
		$weahter = [
			'current_at' => date('Y-m-d H:i:s', $data['dt']),
			'description' => $data['weather'][0]['description'],
			'temp' => $data['main']['temp'],
			'pressure' => $data['main']['pressure'],
			'humidity' => $data['main']['humidity'],
			'wind_speed' => $data['wind']['speed'],
			'wind_direction' => array_key_exists('deg', $data['wind']) ?
				$data['wind']['deg'] : null,
			'rain' => array_key_exists('rain', $data) && array_key_exists('3h', $data['rain']) ?
				$data['rain']['3h'] : null				
		];
				
		$this->saveDataPoint(self::DATASET, $data['name'], $weahter);			
	}
	
	public function tables($schema)
	{
		// data
		
		$weather = $schema->createTable(self::DATASET);

		$weather->addColumn('location_id', 'integer', ['notnull' => true]);
		$weather->addColumn('current_at', 'datetime', ['notnull' => true]);
		$weather->addColumn('description', 'string', ['length' => 50]);

		$weather->addColumn('temp', 'float', ['notnull' => false]);
		$weather->addColumn('pressure', 'float', ['notnull' => false]);
		$weather->addColumn('humidity', 'float', ['notnull' => false]);
		$weather->addColumn('wind_speed', 'float', ['notnull' => false]);
		$weather->addColumn('wind_direction', 'float', ['notnull' => false]);
		$weather->addColumn('rain', 'float', ['notnull' => false]);

		$weather->setPrimaryKey(['location_id', 'current_at']);
		
		// locations
		
		$location = $schema->createTable(self::DATASET.'_location');

		$location->addColumn('id', 'integer', ['autoincrement' => true, 'notnull' => true]);
		$location->addColumn('name', 'string', ['length' => 50]);
		$location->addColumn('seen_at', 'datetime', ['notnull' => false]);
		
		$location->setPrimaryKey(['id']);		
	}	
}