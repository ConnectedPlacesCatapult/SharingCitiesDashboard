<?php

namespace FCC\Api;

use FCC\Source;

class TflBikes extends Source
{
	const
		DATASET = 'tfl_bike_dock';
		
	public function getDefaults()
	{
		return array_merge(parent::getDefaults(), [
			'refresh' => 600,
			'endpoint' => 'https://api.tfl.gov.uk/BikePoint'
		]);
	}
		
	public function import($data)
	{		
		$data = $this->fromJson($data);

		foreach($data as $station)			
			$this->importStation($station);
			
		return count($data);
	}
	
	private function importStation($station)
	{		
		$properties = [];			
		foreach($station['additionalProperties'] as $additionalProperty)
		{
			$properties[$additionalProperty['key']] = $additionalProperty['value'];
 			$modified = $additionalProperty['modified'];
		}
		
		$modified = date('Y-m-d H:i:s', strtotime($modified));		
							
		$this->saveDataPoint(
			self::DATASET,
			[
				'name' => $station['commonName'],
				'lat' => $station['lat'],
				'lon' => $station['lon'],				
			],
			[
				'dock' => $properties['NbDocks'],
				'bike' => $properties['NbBikes'],
				'empty' => $properties['NbEmptyDocks'],
				'updated_at' => $modified
			]
		);
	}
	
	public function tables($schema)
	{
		// data
		
		$bikes = $schema->createTable(self::DATASET);

		$bikes->addColumn('location_id', 'integer', ['notnull' => true]);
		$bikes->addColumn('current_at', 'datetime', ['notnull' => true]);

		$bikes->addColumn('dock', 'smallint', ['notnull' => false]);
		$bikes->addColumn('bike', 'smallint', ['notnull' => false]);
		$bikes->addColumn('empty', 'smallint', ['notnull' => false]);

		$bikes->addColumn('updated_at', 'datetime', ['notnull' => false]);

		$bikes->setPrimaryKey(['location_id', 'current_at']);
		
		// locations
		
		$location = $schema->createTable(self::DATASET.'_location');

		$location->addColumn('id', 'integer', ['autoincrement' => true, 'notnull' => true]);
		$location->addColumn('name', 'string', ['length' => 50]);
		$location->addColumn('lat', 'float', ['notnull' => false]);
		$location->addColumn('lon', 'float', ['notnull' => false]);		
		$location->addColumn('seen_at', 'datetime', ['notnull' => false]);
		
		$location->setPrimaryKey(['id']);		
	}		
}