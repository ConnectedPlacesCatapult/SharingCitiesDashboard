<?php

namespace FCC\Api;

use FCC\Source;

class TflCarpark extends Source
{
	const
		DATASET = 'carpark';
		
	public function getDefaults()
	{
		return array_merge(parent::getDefaults(), [
			'refresh' => 600,
			'endpoint' => 'https://api.tfl.gov.uk/Occupancy/CarPark'
		]);
	}
				
	public function import($data)
	{
		$data = $this->fromJson($data);
		
		foreach($data as $carpark)
		{
			$stats = [
				'pd_count' => 0,
				'pd_occupied' => 0
			];
						
			foreach($carpark['bays'] as $bay)
			{
				if($bay['bayType'] == 'Disabled')
				{
					$stats['disabled_count'] = $bay['bayCount'];
					$stats['disabled_occupied'] = $bay['occupied'];
				}
				else
				{
					$stats['pd_count'] += $bay['bayCount'];
					$stats['pd_occupied'] += $bay['occupied'];
				}
			}
						
			$this->saveDataPoint(self::DATASET, $carpark['name'], $stats);			
		}
	}
	
	public function tables($schema)
	{
		// data
		
		$bay = $schema->createTable(self::DATASET);

		$bay->addColumn('location_id', 'integer', ['notnull' => true]);
		$bay->addColumn('current_at', 'datetime', ['notnull' => true]);

		$bay->addColumn('disabled_count', 'smallint', ['notnull' => false]);
		$bay->addColumn('disabled_occupied', 'smallint', ['notnull' => false]);
		$bay->addColumn('pd_count', 'smallint', ['notnull' => false]);
		$bay->addColumn('pd_occupied', 'smallint', ['notnull' => false]);


		$bay->setPrimaryKey(['location_id', 'current_at']);
		
		// locations
		
		$location = $schema->createTable(self::DATASET.'_location');

		$location->addColumn('id', 'integer', ['autoincrement' => true, 'notnull' => true]);
		$location->addColumn('name', 'string', ['length' => 50]);	
		$location->addColumn('seen_at', 'datetime', ['notnull' => false]);
		
		$location->setPrimaryKey(['id']);		
	}		
}