<?php

namespace FCC\Api;

use FCC\Source;

class Mappiness extends Source
{
	const
		DATASET = 'happyness';
		
	public function getDefaults()
	{
		return array_merge(parent::getDefaults(), [
			'refresh' => 86400,
			'endpoint' => 'http://production.mappiness.org.uk/current_happiness.json'
		]);
	}
		
	public function import($data)
	{
		$data = str_replace(['mpns_current_happiness_callback(', ');'], ['', ''], $data);
		
		$data = $this->fromJson($data);
		
		foreach($data as $location => $info)
			$this->saveDataPoint(self::DATASET, $location, $info);			
	}
	
	public function tables($schema)
	{
		// data
		
		$happy = $schema->createTable(self::DATASET);

		$happy->addColumn('location_id', 'integer', ['notnull' => true]);
		$happy->addColumn('current_at', 'datetime', ['notnull' => true]);

		$happy->addColumn('now', 'float', ['notnull' => false]);
		$happy->addColumn('avg', 'float', ['notnull' => false]);

		$happy->setPrimaryKey(['location_id', 'current_at']);
		
		// locations
		
		$location = $schema->createTable(self::DATASET.'_location');

		$location->addColumn('id', 'integer', ['autoincrement' => true, 'notnull' => true]);
		$location->addColumn('name', 'string', ['length' => 50]);		
		$location->addColumn('seen_at', 'datetime', ['notnull' => false]);
		
		$location->setPrimaryKey(['id']);		
	}			
}