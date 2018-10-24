<?php

namespace FCC\Api;

use FCC\Source;

class TflEvCharging extends Source
{
	const
		DATASET = 'ev_charger';
		
	const
		STATUSES = ['available', 'in_use', 'not_available_fault', 'unknown',
			'unavailable', 'charging', 'outofservice'];
		
	public function getDefaults()
	{
		return array_merge(parent::getDefaults(), [
			'refresh' => 3600,
			'endpoint' => 'https://api.tfl.gov.uk/Occupancy/ChargeConnector'
		]);
	}
				
	// has no location/name data, so agregate only
	
	public function import($data)
	{
		$data = $this->fromJson($data);
		
		//echo '<p>stats on ', count($data), ' charging points</p>';
		
		$stats = [];
		
		foreach($data as $point)
		{			
			$status = str_replace([' ', '(', ')'], ['_', '', ''], strtolower($point['status']));
			$status = trim($status, '_');
			
			if(in_array($status, self::STATUSES))
			{				
				if(array_key_exists($status, $stats))
					$stats[$status]++;
				else
					$stats[$status] = 1;
			}
		}
					
		$this->saveDataPoint(self::DATASET, null, $stats);		
	}
	
	public function tables($schema)
	{
		// data
		
		$station = $schema->createTable(self::DATASET);

		$station->addColumn('location_id', 'integer', ['notnull' => true]);
		$station->addColumn('current_at', 'datetime', ['notnull' => true]);

		foreach(self::STATUSES as $field)
			$station->addColumn($field, 'integer', ['notnull' => false]);

		$station->setPrimaryKey(['location_id', 'current_at']);
	}			
}