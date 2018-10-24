<?php

namespace FCC\Api;

use FCC\Source;

class OwmWeatherForecast extends Source
{
	const
		DATASET = 'weather_forecast';
		
	public function getDefaults()
	{
		return array_merge(parent::getDefaults(), [
			'refresh' => 7200,
			'endpoint' => 'http://api.openweathermap.org/data/2.5/forecast?id=$id&APPID=0ac27f8fc55b1b39c301d85faa8a3fc2&units=metric',
			'param_sets' => '[{"id": 2643743},{"id": 2267057},{"id": 6542283}]'
		]);
	}
		
	public function import($data)
	{
		$data = $this->fromJson($data);
		
		foreach($data['list'] as $item)
		{			
			$forecast = [
				'current_at' => date('Y-m-d H:i:s', $item['dt']),
				'description' => $item['weather'][0]['description'],
				'temp' => $item['main']['temp'],
				'pressure' => $item['main']['pressure'],
				'humidity' => $item['main']['humidity'],
				'wind_speed' => $item['wind']['speed'],
				'wind_direction' => $item['wind']['deg'],
				'rain' => array_key_exists('rain', $item) && array_key_exists('3h', $item['rain']) ?
					$item['rain']['3h'] : null		
			];
									
			$this->saveDataPoint(self::DATASET, $data['city']['name'], $forecast);			
		}		
	}
	
	public function tables($schema)
	{
		// data
		
		$weather = $schema->createTable(self::DATASET);

		$weather->addColumn('location_id', 'integer', ['notnull' => true]);
		$weather->addColumn('current_at', 'datetime', ['notnull' => true]);
		$weather->addColumn('description', 'string', ['notnull' => true, 'length' => 50]);

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